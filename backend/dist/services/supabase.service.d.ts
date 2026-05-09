import { SupabaseClient } from '@supabase/supabase-js';
export declare const supabase: SupabaseClient;
export declare function upsertCustomer(data: {
    full_name: string;
    cpf: string;
    email?: string | null;
    phone?: string | null;
}): Promise<any>;
export declare function createOrder(data: {
    customer_id: string;
    transaction_id: string;
    subtotal: number;
    shipping_cost: number;
    total: number;
    payment_method?: string;
    pix_code?: string;
    pix_qr_code?: string;
    shipping_address?: any;
}): Promise<any>;
export declare function updateOrderStatus(transactionId: string, status: string): Promise<any>;
export declare function addOrderItems(orderId: string, items: Array<{
    product_id: string;
    name: string;
    price: number;
    quantity: number;
    image_url?: string | null;
    variation_name?: string | null;
}>): Promise<void>;
export declare function logWebhook(event: string, transactionId: string, payload: any): Promise<void>;
//# sourceMappingURL=supabase.service.d.ts.map