#!/usr/bin/env node
import 'dotenv/config'
import app from './app'
import { initDatabase } from './services/database.service'
import { log, LogLevel } from './utils/logger'

const PORT = process.env.PORT || 3000

async function startServer() {
  try {
    // Inicializa banco SQLite
    initDatabase()
    await log(LogLevel.INFO, 'Banco SQLite inicializado com sucesso')

    const server = app.listen(PORT, () => {
      console.log(`\n🚀 Servidor VexoPay Backend rodando na porta ${PORT}`)
      console.log(`📊 Dashboard: http://localhost:${PORT}/api/payments/dashboard`)
      console.log(`💰 Saldo: http://localhost:${PORT}/api/payments/balance`)
      console.log(`🔗 Webhook: http://localhost:${PORT}/webhooks/vexopay\n`)
    })

    // Graceful shutdown
    const shutdown = async (signal: string) => {
      console.log(`\n⚠️  Recebido ${signal}. Encerrando servidor...`)
      server.close(() => {
        console.log('Servidor HTTP encerrado')
        process.exit(0)
      })
      setTimeout(() => {
        console.error('Timeout forçado ao encerrar')
        process.exit(1)
      }, 5000)
    }

    process.on('SIGTERM', () => shutdown('SIGTERM'))
    process.on('SIGINT', () => shutdown('SIGINT'))

  } catch (error: any) {
    console.error('Falha ao iniciar servidor:', error)
    await log(LogLevel.ERROR, 'Falha crítica ao iniciar servidor', {
      error: error.message,
    })
    process.exit(1)
  }
}

startServer()
