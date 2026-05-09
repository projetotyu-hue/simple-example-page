import { Router } from 'express'
import { webhookHandler } from '../controllers/payment.controller'
import { webhookRateLimit, suspiciousActivityMiddleware } from '../middlewares/security'

const router = Router()

// Webhook da VexoPay
// Recebe eventos: payment.completed, payment.failed, payment.expired
router.post(
  '/vexopay',
  webhookRateLimit,
  suspiciousActivityMiddleware,
  webhookHandler
)

export default router
