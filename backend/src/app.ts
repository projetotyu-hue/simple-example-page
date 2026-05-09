import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import paymentRoutes from './routes/payment.routes'
import webhookRoutes from './routes/webhook.routes'
import { log, LogLevel } from './utils/logger'

dotenv.config()

const app = express()

// ==================== MIDDLEWARES GLOBAIS ====================
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://seudominio.com'] // Em produção, especifique os domínios
    : true, // Em dev, aceita todos
  credentials: true,
}))

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Log de requisições
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`)
  next()
})

// ==================== ROTAS ====================
app.use('/api/payments', paymentRoutes)
// app.use('/webhooks', webhookRoutes) // Temporariamente desativado

// ==================== ROTA DE SAÚDE ====================
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  })
})

// ==================== TRATAMENTO DE ERROS ====================
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[App Error]', err)

  log(LogLevel.ERROR, 'Erro não tratado na aplicação', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  })

  const status = err.status || 500
  res.status(status).json({
    success: false,
    error: process.env.NODE_ENV === 'production'
      ? 'Erro interno do servidor'
      : err.message,
  })
})

export default app
