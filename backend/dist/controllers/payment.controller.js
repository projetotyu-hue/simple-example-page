"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPayment = createPayment;
exports.getPaymentStatus = getPaymentStatus;
exports.listTransactionsController = listTransactionsController;
exports.getDashboardStatsController = getDashboardStatsController;
const database_service_1 = require("../services/database.service");
const vexopay_service_1 = require("../services/vexopay.service");
const logger_1 = require("../utils/logger");
const supabase_service_1 = require("../services/supabase.service");
async function createPayment(req, res) {
    try {
        const { amount, payerName, payerDocument, description, items, shipping, address } = req.body;
        if (!amount || amount <= 0) {
            return res.status(400).json({ error: 'Valor inválido. Amount deve ser maior que zero.' });
        }
        if (!payerName || !payerDocument) {
            return res.status(400).json({ error: 'payerName e payerDocument são obrigatórios.' });
        }
        const paymentData = {
            amount: Number(amount),
            payerName: String(payerName),
            payerDocument: String(payerDocument),
            description: description ? String(description) : `Pedido #${Date.now()}`,
        };
        // Chama API VexoPay
        const vexoResponse = await (0, vexopay_service_1.createPixPayment)(paymentData);
        // Salva no banco SQLite
        (0, database_service_1.createTransaction)({
            transactionId: vexoResponse.transactionId,
            amount: vexoResponse.amount,
            fee: vexoResponse.fee,
            netAmount: vexoResponse.netAmount,
            status: vexoResponse.status,
            qrCodeUrl: vexoResponse.qrCodeUrl,
            qrCodeBase64: vexoResponse.qrCodeBase64,
            copyPaste: vexoResponse.copyPaste,
            expiresAt: vexoResponse.expiresAt,
        });
        // Criar/atualizar customer no Supabase
        let customerId = null;
        if (supabase_service_1.supabase) {
            try {
                const { data: customer, error: custError } = await supabase_service_1.supabase
                    .from('customers')
                    .upsert({
                    full_name: String(payerName),
                    cpf: String(payerDocument),
                    email: req.body.email || null,
                    phone: req.body.phone || null,
                    updated_at: new Date().toISOString(),
                }, { onConflict: 'cpf' })
                    .select()
                    .single();
                if (!custError && customer) {
                    customerId = customer.id;
                }
            }
            catch (e) {
                console.error('[Supabase] Erro ao upsert customer:', e);
            }
        }
        // Criar pedido no Supabase
        if (supabase_service_1.supabase && customerId) {
            try {
                const parsedItems = Array.isArray(items) ? items : [];
                const subtotal = parsedItems.reduce((sum, item) => sum + (Number(item.price) * Number(item.quantity)), 0);
                const shippingCost = shipping?.price || 0;
                const total = subtotal + shippingCost;
                const { data: order, error: orderError } = await supabase_service_1.supabase
                    .from('orders')
                    .insert({
                    customer_id: customerId,
                    transaction_id: vexoResponse.transactionId,
                    status: 'pending',
                    subtotal,
                    shipping_cost: shippingCost,
                    total,
                    payment_method: 'pix',
                    pix_code: vexoResponse.copyPaste,
                    pix_qr_code: vexoResponse.qrCodeBase64,
                    shipping_address: address || null,
                })
                    .select()
                    .single();
                if (!orderError && order && parsedItems.length > 0) {
                    const orderItems = parsedItems.map((item) => ({
                        order_id: order.id,
                        product_id: String(item.id || ''),
                        name: String(item.name || ''),
                        price: Number(item.price) || 0,
                        quantity: Number(item.quantity) || 1,
                        image_url: item.image || null,
                        variation_name: item.color || item.variation || null,
                    }));
                    await supabase_service_1.supabase
                        .from('order_items')
                        .insert(orderItems);
                }
            }
            catch (e) {
                console.error('[Supabase] Erro ao criar pedido:', e);
            }
        }
        await (0, logger_1.log)(logger_1.LogLevel.INFO, 'PIX criado com sucesso', {
            transactionId: vexoResponse.transactionId,
            amount: vexoResponse.amount,
            status: vexoResponse.status,
        });
        return res.status(201).json({
            success: true,
            data: {
                transactionId: vexoResponse.transactionId,
                qrCodeBase64: vexoResponse.qrCodeBase64,
                qrCodeUrl: vexoResponse.qrCodeUrl,
                copyPaste: vexoResponse.copyPaste,
                status: vexoResponse.status,
                expiresAt: vexoResponse.expiresAt,
                amount: vexoResponse.amount,
            },
        });
    }
    catch (error) {
        console.error('[PaymentController] Erro ao criar PIX:', error);
        await (0, logger_1.log)(logger_1.LogLevel.ERROR, 'Falha ao criar PIX', {
            error: error.message,
            data: req.body,
        });
        const status = error.status || 500;
        return res.status(status).json({
            success: false,
            error: error.message || 'Erro interno ao processar pagamento',
        });
    }
}
async function getPaymentStatus(req, res) {
    try {
        const transactionId = req.params.transactionId;
        if (!transactionId) {
            return res.status(400).json({ error: 'transactionId é obrigatório' });
        }
        // Consulta no banco primeiro
        const localTransaction = (0, database_service_1.getTransactionByTransactionId)(transactionId);
        // Se banco local diz "paid", retorna imediatamente (webhook já confirmou)
        if (localTransaction && localTransaction.status === 'paid') {
            await (0, logger_1.log)(logger_1.LogLevel.INFO, 'Status retornado do cache local (paid)', { transactionId });
            return res.json({
                success: true,
                data: {
                    transactionId: localTransaction.transactionId,
                    status: localTransaction.status,
                    amount: parseFloat(localTransaction.amount),
                    fee: localTransaction.fee ? parseFloat(localTransaction.fee) : null,
                    netAmount: localTransaction.netAmount ? parseFloat(localTransaction.netAmount) : null,
                    paidAt: localTransaction.paidAt,
                    localOnly: true,
                },
            });
        }
        // Consulta API VexoPay para status atualizado
        let apiStatus = null;
        try {
            apiStatus = await (0, vexopay_service_1.checkPixStatus)(transactionId);
        }
        catch (err) {
            if (localTransaction) {
                await (0, logger_1.log)(logger_1.LogLevel.WARN, 'API VexoPay indisponível, retornando cache local', {
                    transactionId,
                });
                return res.json({
                    success: true,
                    data: {
                        transactionId: localTransaction.transactionId,
                        status: localTransaction.status,
                        amount: parseFloat(localTransaction.amount),
                        fee: localTransaction.fee ? parseFloat(localTransaction.fee) : null,
                        netAmount: localTransaction.netAmount ? parseFloat(localTransaction.netAmount) : null,
                        paidAt: localTransaction.paidAt,
                        localOnly: true,
                    },
                });
            }
            throw err;
        }
        // Atualiza banco se status mudou
        if (localTransaction && localTransaction.status !== apiStatus.status) {
            (0, database_service_1.updateTransactionStatus)(transactionId, {
                status: apiStatus.status,
                fee: apiStatus.fee,
                netAmount: apiStatus.netAmount,
                paidAt: apiStatus.paidAt,
            });
            await (0, logger_1.log)(logger_1.LogLevel.INFO, 'Status de pagamento atualizado', {
                transactionId,
                oldStatus: localTransaction.status,
                newStatus: apiStatus.status,
            });
        }
        return res.json({
            success: true,
            data: {
                transactionId: apiStatus.transactionId || transactionId,
                status: apiStatus.status,
                amount: apiStatus.amount,
                fee: apiStatus.fee,
                netAmount: apiStatus.netAmount,
                paidAt: apiStatus.paidAt,
            },
        });
    }
    catch (error) {
        console.error('[PaymentController] Erro ao consultar status:', error);
        await (0, logger_1.log)(logger_1.LogLevel.ERROR, 'Falha ao consultar status', {
            transactionId: String(req.params.transactionId || ''),
            error: error.message,
        });
        const status = error.status || 500;
        return res.status(status).json({
            success: false,
            error: error.message || 'Erro ao consultar status do pagamento',
        });
    }
}
async function listTransactionsController(req, res) {
    try {
        const queryStatus = req.query.status;
        const queryPage = req.query.page;
        const queryLimit = req.query.limit;
        const status = Array.isArray(queryStatus) ? String(queryStatus[0]) : (queryStatus ? String(queryStatus) : undefined);
        const pageStr = Array.isArray(queryPage) ? String(queryPage[0]) : String(queryPage || '1');
        const limitStr = Array.isArray(queryLimit) ? String(queryLimit[0]) : String(queryLimit || '20');
        const pageNum = parseInt(pageStr, 10);
        const limitNum = parseInt(limitStr, 10);
        const result = (0, database_service_1.listTransactions)({
            status,
            page: pageNum,
            limit: limitNum,
        });
        return res.json({
            success: true,
            data: result.transactions.map((t) => ({
                ...t,
                amount: parseFloat(t.amount),
                fee: t.fee ? parseFloat(t.fee) : null,
                netAmount: t.netAmount ? parseFloat(t.netAmount) : null,
            })),
            pagination: {
                page: pageNum,
                limit: limitNum,
                total: result.total,
                pages: Math.ceil(result.total / limitNum),
            },
        });
    }
    catch (error) {
        console.error('[PaymentController] Erro ao listar transações:', error);
        return res.status(500).json({
            success: false,
            error: 'Erro ao listar transações',
        });
    }
}
async function getDashboardStatsController(req, res) {
    try {
        const stats = (0, database_service_1.getDashboardStats)();
        return res.json({ success: true, data: stats });
    }
    catch (error) {
        console.error('[PaymentController] Erro no dashboard:', error);
        return res.status(500).json({
            success: false,
            error: 'Erro ao carregar estatísticas',
        });
    }
}
//# sourceMappingURL=payment.controller.js.map