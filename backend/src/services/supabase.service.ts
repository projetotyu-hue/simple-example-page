import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_KEY!

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey)

// ==================== CUSTOMERS ====================
export async function upsertCustomer(data: {
  full_name: string
  cpf: string
  email?: string | null
  phone?: string | null
}) {
  const { data: customer, error } = await supabase
    .from('customers')
    .upsert(
      {
        full_name: data.full_name,
        cpf: data.cpf,
        email: data.email || null,
        phone: data.phone || null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'cpf' }
    )
    .select()
    .single()

  if (error) throw error
  return customer
}

// ==================== ORDERS ====================
export async function createOrder(data: {
  customer_id: string
  transaction_id: string
  products_total: number
  shipping_total: number
  discount_total?: number
  total: number
  payment_method?: string
  pix_code?: string
  pix_qr_code?: string
  shipping_address?: any
}) {
  // Tenta inserir com transaction_id (se a coluna existir)
  try {
    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        customer_id: data.customer_id,
        transaction_id: data.transaction_id,
        products_total: data.products_total,
        shipping_total: data.shipping_total,
        discount_total: data.discount_total || 0,
        total: data.total,
        status: 'pending',
        payment_method: data.payment_method || 'pix',
        pix_code: data.pix_code || null,
        pix_qr_code: data.pix_qr_code || null,
        shipping_address: data.shipping_address || null,
      })
      .select()
      .single()

    if (error) {
      // Se erro de coluna inexistente, insere sem as colunas extras
      if (error.message.includes('does not exist')) {
        console.warn('[Supabase] Colunas extras não existem, inserindo com estrutura básica')
        const { data: order2, error: error2 } = await supabase
          .from('orders')
          .insert({
            customer_id: data.customer_id,
            products_total: data.products_total,
            shipping_total: data.shipping_total,
            discount_total: data.discount_total || 0,
            total: data.total,
            status: 'pending',
          })
          .select()
          .single()

        if (error2) throw error2
        return { ...order2, transaction_id: data.transaction_id }
      }
      throw error
    }
    return order
  } catch (err) {
    console.error('[Supabase] Erro ao criar pedido:', err)
    throw err
  }
}

export async function updateOrderStatus(transactionId: string, status: string) {
  // Tenta atualizar pela transaction_id (se existir)
  try {
    const { data, error } = await supabase
      .from('orders')
      .update({
        status,
        updated_at: new Date().toISOString(),
        ...(status === 'paid' ? { paid_at: new Date().toISOString() } : {})
      })
      .eq('transaction_id', transactionId)
      .select()
      .single()

    if (error && error.message.includes('does not exist')) {
      // Se a coluna transaction_id não existe, não podemos atualizar assim
      console.warn('[Supabase] Coluna transaction_id não existe, pulando atualização de status')
      return null
    }

    if (error) throw error
    return data
  } catch (err) {
    console.error('[Supabase] Erro ao atualizar status:', err)
    throw err
  }
}

export async function findOrderByTransactionId(transactionId: string) {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('transaction_id', transactionId)
      .maybeSingle()

    if (error && error.message.includes('does not exist')) {
      return null
    }

    if (error) throw error
    return data
  } catch (err) {
    console.error('[Supabase] Erro ao buscar pedido:', err)
    return null
  }
}

export async function addOrderItems(orderId: string, items: Array<{
  product_id: string
  name: string
  price: number
  quantity: number
  image_url?: string | null
  variation_name?: string | null
}>) {
  const { error } = await supabase
    .from('order_items')
    .insert(
      items.map(item => ({
        order_id: orderId,
        product_id: item.product_id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image_url: item.image_url || null,
        variation_name: item.variation_name || null,
      }))
    )

  if (error) throw error
}

// ==================== WEBHOOK LOGS ====================
export async function logWebhook(event: string, transactionId: string, payload: any) {
  const { error } = await supabase
    .from('webhook_logs')
    .insert({
      event,
      transaction_id: transactionId,
      payload,
      processed: true,
    })

  if (error) console.error('[Supabase] Erro ao salvar webhook log:', error)
}
