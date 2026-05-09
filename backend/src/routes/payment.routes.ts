import { Router } from 'express'
import { createPayment, checkPaymentStatus, getDashboard, webhookHandler } from '../controllers/payment.controller'
import { getBalanceController, listCashoutsController } from '../controllers/cashout.controller'

const router = Router()

// ==================== PÚBLICO ====================
router.post('/pix-create', createPayment)
router.get('/pix-status/:transactionId', checkPaymentStatus)

// ==================== WEBHOOK ====================
router.post('/webhook', webhookHandler)

// ==================== ADMIN (requerem auth) ====================
router.get('/dashboard', getDashboard)
router.get('/balance', getBalanceController)
router.get('/transactions', listCashoutsController)

export default router
