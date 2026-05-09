import { createLog } from '../services/database.service'

export enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  WEBHOOK = 'WEBHOOK',
  SECURITY = 'SECURITY',
}

interface LogMetadata {
  transactionId?: string
  amount?: number
  status?: string
  ip?: string
  userId?: string
  [key: string]: any
}

/**
 * Salva log no banco de dados e console
 */
export async function log(
  level: LogLevel,
  message: string,
  metadata?: LogMetadata
): Promise<void> {
  try {
    createLog(level, message, metadata ? JSON.stringify(metadata) : undefined)

    const emoji: Record<LogLevel, string> = {
      [LogLevel.INFO]: 'ℹ️',
      [LogLevel.WARN]: '⚠️',
      [LogLevel.ERROR]: '❌',
      [LogLevel.WEBHOOK]: '🔔',
      [LogLevel.SECURITY]: '🔒',
    }

    console.log(
      `[${new Date().toISOString()}] ${emoji[level]} [${level}] ${message}`,
      metadata ? JSON.stringify(metadata) : ''
    )
  } catch (error) {
    console.error('Erro ao salvar log:', error)
  }
}

/**
 * Log específico para webhooks
 */
export async function logWebhook(
  event: string,
  data: any,
  success: boolean
): Promise<void> {
  await log(
    success ? LogLevel.WEBHOOK : LogLevel.ERROR,
    `Webhook ${event}: ${success ? 'SUCESSO' : 'FALHA'}`,
    {
      event,
      transactionId: data?.transactionId,
      amount: data?.amount,
      status: data?.status,
      paidAt: data?.paidAt,
    }
  )
}

/**
 * Log de segurança (tentativas suspeitas)
 */
export async function logSecurity(
  message: string,
  ip: string,
  metadata?: Record<string, any>
): Promise<void> {
  await log(LogLevel.SECURITY, message, { ip, ...metadata })
}
