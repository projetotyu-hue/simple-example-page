"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleVexoWebhook = handleVexoWebhook;
const logger_1 = require("../utils/logger");
const database_service_1 = require("../services/database.service");
const supabase_service_1 = require("../services/supabase.service");
/**
 * Processa webhooks da VexoPay
 *
 * Eventos esperados:
 * - payment.completed
 * - payment.failed
 * - payment.expired
 */
async function handleVexoWebhook(req, res) {
    try {
        const payload = req.body;
        // Validação básica do payload
        if (!payload || !payload.event || !payload.data) {
            await (0, logger_1.log)(logger_1.LogLevel.WARN, 'Webhook recebido com payload inválido', { body: req.body });
            return res.status(400).json({ error: 'Payload inválido' });
        }
        const { event, data } = payload;
        await (0, logger_1.log)(logger_1.LogLevel.WEBHOOK, `Webhook recebido: ${event}`, {
            transactionId: data.transactionId,
            amount: data.amount,
            status: data.status,
        });
        // Salva evento no banco (para auditoria) - SQLite
        const transaction = (0, database_service_1.getTransactionByTransactionId)(data.transactionId);
        if (!transaction) {
            await (0, logger_1.log)(logger_1.LogLevel.WARN, 'Webhook para transação não encontrada no banco', {
                transactionId: data.transactionId,
            });
            // Mesmo assim retornamos 200 para o VexoPay não reenviar
            return res.json({ success: true, message: 'Evento recebido (transação não encontrada localmente)' });
        }
        // Processa de acordo com o evento
        switch (event) {
            case 'payment.completed':
                await handlePaymentCompleted(data, transaction);
                break;
            case 'payment.failed':
                await handlePaymentFailed(data, transaction);
                break;
            case 'payment.expired':
                await handlePaymentExpired(data, transaction);
                break;
            default:
                await (0, logger_1.log)(logger_1.LogLevel.WARN, `Evento de webhook não reconhecido: ${event}`, { data });
        }
        // Responde 200 para o VexoPay não reenviar
        return res.json({ success: true, message: 'Evento processado com sucesso' });
    }
    catch (error) {
        console.error('[Webhook] Erro ao processar webhook:', error);
        await (0, logger_1.log)(logger_1.LogLevel.ERROR, 'Erro ao processar webhook', {
            error: error.message,
            stack: error.stack,
        });
        // Sempre retornamos 200 para webhooks, mesmo em caso de erro
        return res.json({ success: true, message: 'Evento recebido (erro interno tratado)' });
    }
}
async function handlePaymentCompleted(data, transaction) {
    // Atualiza banco SQLite
    (0, database_service_1.updateTransactionStatus)(data.transactionId, {
        status: 'paid',
        paidAt: new Date().toISOString(),
    });
    // Atualiza pedido no Supabase
    if (supabase_service_1.supabase) {
        try {
            const { data: order, error } = await supabase_service_1.supabase
                .from('orders')
                .update({
                status: 'paid',
                updated_at: new Date().toISOString(),
                payment_method: 'pix',
            })
                .eq('transaction_id', data.transactionId)
                .select()
                .single();
            if (error) {
                console.error('[Webhook] Erro ao atualizar pedido no Supabase:', error);
            }
            else {
                await (0, logger_1.log)(logger_1.LogLevel.INFO, 'Pedido atualizado no Supabase para PAID', {
                    transactionId: data.transactionId,
                    orderId: order?.id,
                });
            }
        }
        catch (err) {
            console.error('[Webhook] Erro ao atualizar Supabase:', err);
        }
    }
    await (0, logger_1.log)(logger_1.LogLevel.INFO, 'Pagamento confirmado com sucesso', {
        transactionId: data.transactionId,
        amount: data.amount,
    });
}
async function handlePaymentFailed(data, transaction) {
    (0, database_service_1.updateTransactionStatus)(data.transactionId, {
        status: 'failed',
    });
    // Atualiza no Supabase
    if (supabase_service_1.supabase) {
        try {
            await supabase_service_1.supabase
                .from('orders')
                .update({ status: 'failed', updated_at: new Date().toISOString() })
                .eq('transaction_id', data.transactionId);
        }
        catch (err) {
            console.error('[Webhook] Erro ao atualizar falha no Supabase:', err);
        }
    }
    await (0, logger_1.log)(logger_1.LogLevel.WARN, 'Pagamento falhou', {
        transactionId: data.transactionId,
    });
}
async function handlePaymentExpired(data, transaction) {
    (0, database_service_1.updateTransactionStatus)(data.transactionId, {
        status: 'expired',
    });
    // Atualiza no Supabase
    if (supabase_service_1.supabase) {
        try {
            await supabase_service_1.supabase
                .from('orders')
                .update({ status: 'expired', updated_at: new Date().toISOString() })
                .eq('transaction_id', data.transactionId);
        }
        catch (err) {
            console.error('[Webhook] Erro ao atualizar expiração no Supabase:', err);
        }
    }
    await (0, logger_1.log)(logger_1.LogLevel.WARN, 'Pagamento expirado', {
        transactionId: data.transactionId,
    });
}
//# sourceMappingURL=vexopay.webhook.js.map