"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const payment_controller_1 = require("../controllers/payment.controller");
const cashout_controller_1 = require("../controllers/cashout.controller");
const security_1 = require("../middlewares/security");
const supabase_service_1 = require("../services/supabase.service");
const router = (0, express_1.Router)();
// ==================== PÚBLICO ====================
router.post('/pix-create', security_1.paymentRateLimit, payment_controller_1.createPayment);
router.get('/pix-status/:transactionId', payment_controller_1.getPaymentStatus);
// ==================== ADMIN (auth) ====================
router.use(security_1.authMiddleware);
router.get('/dashboard', payment_controller_1.getDashboardStatsController);
router.get('/transactions', payment_controller_1.listTransactionsController);
router.get('/balance', cashout_controller_1.getBalanceController);
router.post('/cashout', cashout_controller_1.createCashoutController);
router.get('/cashouts', cashout_controller_1.listCashoutsController);
router.get('/crypto-fees', cashout_controller_1.getCryptoFeesController);
// ==================== PEDIDOS (Supabase) ====================
router.get('/orders', async (req, res) => {
    try {
        const { data, error } = await supabase_service_1.supabase
            .from('orders')
            .select(`*, customers:customer_id (full_name, email), order_items (*)`)
            .order('created_at', { ascending: false })
            .limit(100);
        if (error)
            throw error;
        res.json({ success: true, data });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});
router.get('/orders/:id', async (req, res) => {
    try {
        const { data, error } = await supabase_service_1.supabase
            .from('orders')
            .select(`*, customers:customer_id (full_name, email, cpf, phone), order_items (*)`)
            .eq('id', req.params.id)
            .single();
        if (error)
            throw error;
        res.json({ success: true, data });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});
router.patch('/orders/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const { data, error } = await supabase_service_1.supabase
            .from('orders')
            .update({ status, updated_at: new Date().toISOString() })
            .eq('id', req.params.id)
            .select()
            .single();
        if (error)
            throw error;
        res.json({ success: true, data });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});
exports.default = router;
//# sourceMappingURL=payment.routes.js.map