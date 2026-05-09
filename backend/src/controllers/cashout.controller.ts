import type { Request, Response } from 'express'
import {
  getBalance,
  createCashout as vexoCreateCashout,
  createInternalCashout,
  createCryptoCashout,
  getCryptoFees,
} from '../services/vexopay.service'
import { createCashout, listCashouts as dbListCashouts, getCashoutById } from '../services/database.service'
import { log, LogLevel } from '../utils/logger'
import type { CreateCashoutRequest } from '../types/vexopay'

export async function getBalanceController(req: Request, res: Response) {
  try {
    const balanceData = await getBalance()

    await log(LogLevel.INFO, 'Saldo consultado', {
      balance: balanceData.balance,
      currency: balanceData.currency,
    })

    return res.json({
      success: true,
      data: balanceData,
    })
  } catch (error: any) {
    console.error('[CashoutController] Erro ao consultar saldo:', error)

    await log(LogLevel.ERROR, 'Falha ao consultar saldo', {
      error: error.message,
    })

    const status = error.status || 500
    return res.status(status).json({
      success: false,
      error: error.message || 'Erro ao consultar saldo',
    })
  }
}

export async function createCashoutController(req: Request, res: Response) {
  try {
    const {
      amount,
      withdrawalMethod,
      pixKeyType,
      pixKey,
      targetAccount,
      wallet,
      description,
    } = req.body

    // Validação básica
    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, error: 'Valor de saque inválido' })
    }
    if (!withdrawalMethod || !['PIX', 'INTERNAL', 'CRYPTO'].includes(withdrawalMethod)) {
      return res.status(400).json({
        success: false,
        error: 'withdrawalMethod deve ser PIX, INTERNAL ou CRYPTO',
      })
    }

    let vexoResponse: any

    // Criar saque conforme o método
    switch (withdrawalMethod) {
      case 'PIX': {
        if (!pixKey || !pixKeyType) {
          return res.status(400).json({
            success: false,
            error: 'pixKey e pixKeyType são obrigatórios para saque PIX',
          })
        }

        const pixData: CreateCashoutRequest = {
          amount: Number(amount),
          withdrawalMethod: 'PIX',
          pixKeyType,
          pixKey,
          description: description || 'Saque via API',
        }

        // Consulta saldo antes
        const balance = await getBalance()
        if (balance.balance < Number(amount)) {
          return res.status(409).json({
            success: false,
            error: 'Saldo insuficiente',
            balance: balance.balance,
          })
        }

        vexoResponse = await vexoCreateCashout(pixData)
        break
      }

      case 'INTERNAL': {
        if (!targetAccount) {
          return res.status(400).json({
            success: false,
            error: 'targetAccount é obrigatório para saque INTERNAL',
          })
        }

        vexoResponse = await createInternalCashout(
          Number(amount),
          targetAccount,
          description
        )
        break
      }

      case 'CRYPTO': {
        if (!wallet) {
          return res.status(400).json({
            success: false,
            error: 'wallet (endereço BEP20) é obrigatório para saque CRYPTO',
          })
        }

        vexoResponse = await createCryptoCashout(
          Number(amount),
          wallet,
          description
        )
        break
      }
    }

    // Salva no banco
    const cashoutRecord = createCashout({
      amount: Number(amount),
      withdrawalMethod,
      pixKeyType: pixKeyType || null,
      pixKey: pixKey || null,
      description: description || `Saque ${withdrawalMethod}`,
    })

    await log(LogLevel.INFO, 'Saque solicitado com sucesso', {
      withdrawalMethod,
      amount,
      status: vexoResponse.status,
    })

    return res.status(201).json({
      success: true,
      data: {
        ...vexoResponse,
        dbId: cashoutRecord.id,
      },
    })
  } catch (error: any) {
    console.error('[CashoutController] Erro ao criar saque:', error)

    await log(LogLevel.ERROR, 'Falha ao criar saque', {
      error: error.message,
    })

    const status = error.status || 500
    return res.status(status).json({
      success: false,
      error: error.message || 'Erro ao processar saque',
    })
  }
}

export async function listCashoutsController(req: Request, res: Response) {
  try {
    const { page = '1', limit = '20' } = req.query
    const offset = (Number(page) - 1) * Number(limit)

    const cashouts = dbListCashouts(Number(limit), offset)

    await log(LogLevel.INFO, 'Lista de saques consultada', {
      page,
      limit,
      count: cashouts.length,
    })

    return res.json({
      success: true,
      data: cashouts,
      pagination: { page: Number(page), limit: Number(limit) },
    })
  } catch (error: any) {
    console.error('[CashoutController] Erro ao listar saques:', error)
    return res.status(500).json({
      success: false,
      error: error.message || 'Erro ao listar saques',
    })
  }
}

export async function getCryptoFeesController(req: Request, res: Response) {
  try {
    const fees = await getCryptoFees()

    await log(LogLevel.INFO, 'Taxas crypto consultadas', fees)

    return res.json({
      success: true,
      data: fees,
    })
  } catch (error: any) {
    console.error('[CashoutController] Erro ao consultar taxas crypto:', error)
    return res.status(500).json({
      success: false,
      error: error.message || 'Erro ao consultar taxas crypto',
    })
  }
}
