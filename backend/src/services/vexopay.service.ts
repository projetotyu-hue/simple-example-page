import axios, { AxiosError } from 'axios'
import dotenv from 'dotenv'
import type {
  CreatePixPaymentRequest,
  VexoPayPixResponse,
  VexoPayStatusResponse,
  VexoPayBalanceResponse,
  CreateCashoutRequest,
  VexoPayCashoutResponse,
} from '../types/vexopay'

dotenv.config()

const VEXO_CI = process.env.VEXO_CI
const VEXO_CS = process.env.VEXO_CS
const VEXO_BASE_URL = process.env.VEXO_BASE_URL || 'https://www.vexopay.com.br'

if (!VEXO_CI || !VEXO_CS) {
  throw new Error('Credenciais VexoPay não configuradas. Verifique o arquivo .env')
}

const api = axios.create({
  baseURL: VEXO_BASE_URL,
  timeout: 30000, // 30 segundos
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para adicionar as credenciais em TODAS as requisições
api.interceptors.request.use((config) => {
  config.headers.set('ci', VEXO_CI!)
  config.headers.set('cs', VEXO_CS!)
  return config
})

// Interceptor de resposta para tratamento centralizado de erros
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error.response?.status
    const data = error.response?.data as any

    // Retry automático para 429 (rate limit) - até 3 tentativas
    if (status === 429 && !error.config?._retryCount) {
      error.config._retryCount = 1
      const retryAfter = error.response?.headers['retry-after']
        ? parseInt(error.response.headers['retry-after'] as string) * 1000
        : 5000 // Default 5s
      console.warn(`[VexoPay] Rate limit (429). Retry after ${retryAfter}ms`)
      await new Promise(resolve => setTimeout(resolve, retryAfter))
      return api.request(error.config)
    }

    let message = 'Erro desconhecido na API VexoPay'

    switch (status) {
      case 400:
        message = `Requisição inválida: ${data?.message || 'Dados incorretos'}`
        break
      case 401:
        message = 'Credenciais inválidas (Unauthorized)'
        break
      case 403:
        message = 'Acesso negado (Forbidden)'
        break
      case 404:
        message = 'Recurso não encontrado'
        break
      case 409:
        message = 'Conflito de dados (Conflict)'
        break
      case 428:
        message = 'Pré-condição necessária (Precondition Required)'
        break
      case 429:
        message = 'Muitas requisições. Tente novamente mais tarde (Rate Limit)'
        break
      case 500:
        message = 'Erro interno do servidor VexoPay'
        break
      case 502:
        message = 'Bad Gateway - Servidor VexoPay indisponível'
        break
    }

    console.error(`[VexoPay API Error ${status}]:`, message, data)
    return Promise.reject({ status, message, data })
  }
)

// ==================== 1. CRIAR PIX ====================
export async function createPixPayment(
  data: CreatePixPaymentRequest
): Promise<VexoPayPixResponse> {
  try {
    const response = await api.post('/api/gateway/pix-create', {
      amount: data.amount,
      payerName: data.payerName,
      payerDocument: data.payerDocument,
      description: data.description,
    })

    // A API retorna { success: true, data: { transactionId: ... } }
    const responseData = response.data.data || response.data

    // Log de sucesso
    console.log('[VexoPay] PIX criado com sucesso:', responseData.transactionId)

    return {
      transactionId: responseData.transactionId,
      amount: responseData.amount,
      fee: responseData.fee,
      netAmount: responseData.netAmount,
      status: responseData.status || 'PENDING',
      qrCodeUrl: responseData.qrCodeUrl,
      qrCodeBase64: responseData.qrCodeBase64,
      copyPaste: responseData.copyPaste,
      expiresAt: responseData.expiresAt,
      createdAt: responseData.createdAt,
    }
  } catch (error: any) {
    console.error('[VexoPay] Erro ao criar PIX:', error.message)
    throw error
  }
}

// ==================== 2. CONSULTAR STATUS ====================
export async function checkPixStatus(
  transactionId: string
): Promise<VexoPayStatusResponse> {
  try {
    const response = await api.get('/api/gateway/pix-status', {
      params: { transactionId },
    })

    // A API retorna { success: true, data: { ... } }
    const responseData = response.data.data || response.data

    return {
      transactionId: responseData.transactionId || transactionId,
      status: responseData.status,
      amount: responseData.amount,
      fee: responseData.fee,
      netAmount: responseData.netAmount,
      paidAt: responseData.paidAt,
    }
  } catch (error: any) {
    console.error('[VexoPay] Erro ao consultar status:', error.message)
    throw error
  }
}

// ==================== 3. CONSULTAR SALDO ====================
export async function getBalance(): Promise<VexoPayBalanceResponse> {
  try {
    const response = await api.get('/api/gateway/balance')

    // A API retorna { success: true, data: { ... } }
    const responseData = response.data.data || response.data

    console.log('[VexoPay] Saldo consultado:', responseData.balance)
    return {
      balance: responseData.balance || 0,
      totalReceived: responseData.totalReceived,
      totalWithdrawn: responseData.totalWithdrawn,
      totalFees: responseData.totalFees,
      transactionCount: responseData.transactionsCount,
      currency: responseData.currency || 'BRL',
    }
  } catch (error: any) {
    console.error('[VexoPay] Erro ao consultar saldo:', error.message)
    throw error
  }
}

// ==================== 5. CONSULTAR TAXAS CRYPTO ====================
export async function getCryptoFees(): Promise<{
  brlPerUSD: number
  networkFee: number
  platformFeePercentage: number
}> {
  try {
    const response = await api.get('/api/merchant/crypto-fees')
    const responseData = response.data.data || response.data
    return {
      brlPerUSD: responseData.quote?.brlPerUSD || 0,
      networkFee: responseData.fees?.networkFee || 0,
      platformFeePercentage: responseData.fees?.platformFeePercentage || 0,
    }
  } catch (error: any) {
    console.error('[VexoPay] Erro ao consultar taxas crypto:', error.message)
    throw error
  }
}

// ==================== 6. SAQUE INTERNAL (entre contas VexoPay) ====================
export async function createInternalCashout(
  amount: number,
  targetAccount: string,
  description?: string
): Promise<VexoPayCashoutResponse> {
  try {
    if (!targetAccount) {
      throw new Error('targetAccount é obrigatório para saque INTERNAL')
    }

    const response = await api.post('/api/merchant/cashout', {
      withdrawalMethod: 'INTERNAL',
      amount,
      targetAccount,
      description: description || 'Transferência interna',
    })

    const responseData = response.data.data || response.data
    return {
      id: responseData.id || responseData.transactionId,
      status: responseData.status,
      amount: responseData.amount,
      fee: responseData.fee,
    }
  } catch (error: any) {
    console.error('[VexoPay] Erro ao solicitar saque interno:', error.message)
    throw error
  }
}

// ==================== 7. SAQUE CRYPTO ====================
export async function createCryptoCashout(
  amount: number,
  wallet: string,
  description?: string
): Promise<VexoPayCashoutResponse> {
  try {
    if (!wallet || !wallet.startsWith('0x') || wallet.length !== 42) {
      throw new Error('Carteira deve ser um endereço BEP20 válido (0x + 40 caracteres hex)')
    }

    const response = await api.post('/api/merchant/cashout', {
      withdrawalMethod: 'CRYPTO',
      amount,
      wallet,
      description: description || 'Saque em USDT',
    })

    const responseData = response.data.data || response.data
    return {
      id: responseData.id || responseData.transactionId,
      status: responseData.status,
      amount: responseData.amount,
      fee: responseData.fee,
    }
  } catch (error: any) {
    console.error('[VexoPay] Erro ao solicitar saque crypto:', error.message)
    throw error
  }
}
export async function createCashout(
  data: CreateCashoutRequest
): Promise<VexoPayCashoutResponse> {
  try {
    // Validações locais antes de enviar para API
    if (data.withdrawalMethod === 'PIX') {
      if (!data.pixKey || !data.pixKeyType) {
        throw new Error('Chave PIX e tipo de chave são obrigatórios para saque PIX')
      }
      if (!['CPF', 'CNPJ', 'EMAIL', 'PHONE', 'EVP'].includes(data.pixKeyType)) {
        throw new Error('Tipo de chave PIX inválido. Use: CPF, CNPJ, EMAIL, PHONE ou EVP')
      }
    }

    if (data.amount <= 0) {
      throw new Error('Valor de saque deve ser maior que zero')
    }

    const response = await api.post('/api/merchant/cashout', {
      withdrawalMethod: data.withdrawalMethod,
      amount: data.amount,
      pixKeyType: data.pixKeyType,
      pixKey: data.pixKey,
      description: data.description,
    })

    // A API retorna { success: true, data: { ... } }
    const responseData = response.data.data || response.data

    console.log('[VexoPay] Saque solicitado com sucesso:', responseData.id || responseData.transactionId)
    return {
      id: responseData.id || responseData.transactionId,
      status: responseData.status,
      amount: responseData.amount,
      fee: responseData.fee,
      estimatedDate: responseData.estimatedDate,
    }
  } catch (error: any) {
    console.error('[VexoPay] Erro ao solicitar saque:', error.message)
    throw error
  }
}
