import type { Request, Response } from 'express'
import {
  createTransaction,
  getTransactionByTransactionId,
  updateTransactionStatus,
  listTransactions,
  getDashboardStats,
} from '../services/database.service'
import {
  createPixPayment,
  checkPixStatus,
} from '../services/vexopay.service'
import { log, LogLevel } from '../utils/logger'
import type { CreatePixPaymentRequest } from '../types/vexopay'
import {
  supabase,
  upsertCustomer,
  createOrder,
  updateOrderStatus,
  addOrderItems,
  findOrderByTransactionId,
} from '../services/supabase.service'

// Cache simples para evitar PIX duplicado (mesmo CPF + valor em 5 min)
const recentPixCache = new Map<string, { timestamp: number; data: any }>()
const PIX_CACHE_TTL = 5 * 60 * 1000 // 5 minutos

export async function createPayment(req: Request, res: Response) {
  try {
    const { amount, payerName, payerDocument, description, items, shipping, address } = req.body

    // Verifica cache de PIX recente (evita rate limit na VexoPay)
    const cacheKey = `${payerDocument}_${amount}`
    const cached = recentPixCache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < PIX_CACHE_TTL) {
      console.log(`[Cache] Retornando PIX em cache para ${cacheKey}`)
      return res.status(200).json({ success: true, data: cached.data })
    }

    // Limpa cache expirado
    for (const [key, val] of recentPixCache.entries()) {
      if (Date.now() - val.timestamp > PIX_CACHE_TTL) recentPixCache.delete(key)
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Valor inválido. Amount deve ser maior que zero.' })
    }
    if (!payerName || !payerDocument) {
      return res.status(400).json({ error: 'payerName e payerDocument são obrigatórios.' })
    }

    const paymentData: CreatePixPaymentRequest = {
      amount: Number(amount),
      payerName: String(payerName),
      payerDocument: String(payerDocument),
      description: description ? String(description) : `Pedido #${Date.now()}`,
    }

    // Chama API VexoPay
    const vexoResponse = await createPixPayment(paymentData)

    // Salva no banco SQLite
    createTransaction({
      transactionId: vexoResponse.transactionId,
      amount: vexoResponse.amount,
      fee: vexoResponse.fee,
      netAmount: vexoResponse.netAmount,
      status: vexoResponse.status,
      qrCodeUrl: vexoResponse.qrCodeUrl,
      qrCodeBase64: vexoResponse.qrCodeBase64,
      copyPaste: vexoResponse.copyPaste,
      expiresAt: vexoResponse.expiresAt,
    })

    // Adiciona ao cache (evita rate limit na VexoPay)
    const responseData = {
      transactionId: vexoResponse.transactionId,
      qrCodeBase64: vexoResponse.qrCodeBase64,
      qrCodeUrl: vexoResponse.qrCodeUrl,
      copyPaste: vexoResponse.copyPaste,
      status: vexoResponse.status,
      expiresAt: vexoResponse.expiresAt,
      amount: vexoResponse.amount,
    }
    recentPixCache.set(cacheKey, { timestamp: Date.now(), data: responseData })

    // Criar/atualizar customer no Supabase (NÃO falha se der erro)
    let customerId: string | null = null
    if (supabase) {
      try {
        const customer = await upsertCustomer({
          full_name: String(payerName),
          cpf: String(payerDocument),
          email: req.body.email || null,
          phone: req.body.phone || null,
        })
        customerId = customer?.id || null
      } catch (e: any) {
        console.error('[Supabase] Erro ao upsert customer (não crítico):', e.message)
      }
    }

    // Criar pedido no Supabase
    if (supabase && customerId) {
      try {
        const parsedItems = Array.isArray(items) ? items : []
        const products_total = parsedItems.reduce((sum: number, item: any) => sum + (Number(item.price) * Number(item.quantity)), 0)
        const shipping_total = shipping?.price || 0
        const total = products_total + shipping_total

        const order = await createOrder({
          customer_id: customerId,
          transaction_id: vexoResponse.transactionId,
          products_total,
          shipping_total,
          total,
          payment_method: 'pix',
          pix_code: vexoResponse.copyPaste,
          pix_qr_code: vexoResponse.qrCodeBase64,
          shipping_address: address || null,
        })

        if (order && parsedItems.length > 0) {
          const orderItems = parsedItems.map((item: any) => ({
            order_id: order.id,
            product_id: String(item.id || ''),
            name: String(item.name || ''),
            price: Number(item.price) || 0,
            quantity: Number(item.quantity) || 1,
            image_url: item.image || null,
            variation_name: item.color || item.variation || null,
          }))
          await addOrderItems(order.id, orderItems)
        }
      } catch (e: any) {
        console.error('[Supabase] Erro ao criar pedido:', e.message)
      }
    }

    await log(LogLevel.INFO, 'PIX criado com sucesso', {
      transactionId: vexoResponse.transactionId,
      amount: vexoResponse.amount,
      status: vexoResponse.status,
    })

    return res.status(201).json({
      success: true,
      data: responseData,
    })
  } catch (error: any) {
    console.error('[PaymentController] Erro ao criar PIX:', error)
    await log(LogLevel.ERROR, 'Falha ao criar PIX', {
      error: error.message,
      data: req.body,
    })

    const status = error.status || 500
    const message = error.message || 'Erro interno ao processar pagamento'
    return res.status(status).json({ success: false, error: message })
  }
}

export async function checkPaymentStatus(req: Request, res: Response) {
  try {
    const { transactionId } = req.params
    if (!transactionId) {
      return res.status(400).json({ error: 'transactionId é obrigatório' })
    }

    // Busca no cache primeiro
    for (const [key, val] of recentPixCache.entries()) {
      if (val.data?.transactionId === transactionId) {
        return res.json({ success: true, data: val.data })
      }
    }

    // Busca no SQLite
    const transaction = getTransactionByTransactionId(transactionId)
    if (!transaction) {
      return res.status(404).json({ error: 'Transação não encontrada' })
    }

    // Se status ainda é pending, consulta VexoPay
    if (transaction.status === 'pending') {
      try {
        const statusResponse = await checkPixStatus(transactionId)
        if (statusResponse.status !== transaction.status) {
          transaction.status = statusResponse.status
          updateTransactionStatus(transactionId, statusResponse.status)
        }
      } catch (e: any) {
        console.error('[VexoPay] Erro ao consultar status:', e.message)
      }
    }

    return res.json({
      success: true,
      data: {
        transactionId: transaction.transactionId,
        status: transaction.status,
        amount: transaction.amount,
        fee: transaction.fee,
        netAmount: transaction.netAmount,
      },
    })
  } catch (error: any) {
    console.error('[PaymentController] Erro ao consultar PIX:', error)
    return res.status(500).json({ error: error.message || 'Erro interno' })
  }
}

export async function getDashboard(req: Request, res: Response) {
  try {
    const stats = getDashboardStats()
    const { transactions: recentTransactions } = listTransactions()
    return res.json({
      success: true,
      data: {
        stats,
        recentTransactions: recentTransactions.slice(0, 10),
      },
    })
  } catch (error: any) {
    console.error('[PaymentController] Erro no dashboard:', error)
    return res.status(500).json({ error: error.message || 'Erro interno' })
  }
}

export async function webhookHandler(req: Request, res: Response) {
  try {
    const event = req.body?.event
    const data = req.body?.data
    if (!event || !data?.transactionId) {
      return res.status(400).json({ error: 'Payload inválido' })
    }

    console.log(`[Webhook] Evento recebido: ${event}`, data)

    // Atualiza status no SQLite
    if (event === 'payment.completed') {
      updateTransactionStatus(data.transactionId, 'paid')
      // Atualiza no Supabase se disponível
      if (supabase) {
        try {
          const order = findOrderByTransactionId(data.transactionId)
          if (order) {
            await updateOrderStatus(order.id, 'paid')
          }
        } catch (e: any) {
          console.error('[Webhook] Erro ao atualizar pedido:', e.message)
        }
      }
    } else if (event === 'payment.failed') {
      updateTransactionStatus(data.transactionId, 'failed')
    } else if (event === 'payment.expired') {
      updateTransactionStatus(data.transactionId, 'expired')
    }

    return res.json({ success: true })
  } catch (error: any) {
    console.error('[Webhook] Erro:', error)
    return res.status(500).json({ error: error.message })
  }
}
