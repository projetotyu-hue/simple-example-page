"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabase = void 0;
exports.upsertCustomer = upsertCustomer;
exports.createOrder = createOrder;
exports.updateOrderStatus = updateOrderStatus;
exports.addOrderItems = addOrderItems;
exports.logWebhook = logWebhook;
const supabase_js_1 = require("@supabase/supabase-js");
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
exports.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
// ==================== CUSTOMERS ====================
async function upsertCustomer(data) {
    const { data: customer, error } = await exports.supabase
        .from('customers')
        .upsert({
        full_name: data.full_name,
        cpf: data.cpf,
        email: data.email || null,
        phone: data.phone || null,
        updated_at: new Date().toISOString(),
    }, { onConflict: 'cpf' })
        .select()
        .single();
    if (error)
        throw error;
    return customer;
}
// ==================== ORDERS ====================
async function createOrder(data) {
    const { data: order, error } = await exports.supabase
        .from('orders')
        .insert({
        customer_id: data.customer_id,
        transaction_id: data.transaction_id,
        status: 'pending',
        subtotal: data.subtotal,
        shipping_cost: data.shipping_cost,
        total: data.total,
        payment_method: data.payment_method || 'pix',
        pix_code: data.pix_code || null,
        pix_qr_code: data.pix_qr_code || null,
        shipping_address: data.shipping_address || null,
    })
        .select()
        .single();
    if (error)
        throw error;
    return order;
}
async function updateOrderStatus(transactionId, status) {
    const { data, error } = await exports.supabase
        .from('orders')
        .update({
        status,
        updated_at: new Date().toISOString(),
        ...(status === 'paid' ? { paid_at: new Date().toISOString() } : {})
    })
        .eq('transaction_id', transactionId)
        .select()
        .single();
    if (error)
        throw error;
    return data;
}
async function addOrderItems(orderId, items) {
    const { error } = await exports.supabase
        .from('order_items')
        .insert(items.map(item => ({
        order_id: orderId,
        product_id: item.product_id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image_url: item.image_url || null,
        variation_name: item.variation_name || null,
    })));
    if (error)
        throw error;
}
// ==================== WEBHOOK LOGS ====================
async function logWebhook(event, transactionId, payload) {
    const { error } = await exports.supabase
        .from('webhook_logs')
        .insert({
        event,
        transaction_id: transactionId,
        payload,
        processed: true,
    });
    if (error)
        console.error('[Supabase] Erro ao salvar webhook log:', error);
}
//# sourceMappingURL=supabase.service.js.map