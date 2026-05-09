export interface VexoPayHeaders {
    'Content-Type': 'application/json';
    ci: string;
    cs: string;
}
export interface CreatePixPaymentRequest {
    amount: number;
    payerName: string;
    payerDocument: string;
    description: string;
}
export interface VexoPayPixResponse {
    transactionId: string;
    amount: number;
    fee?: number;
    netAmount?: number;
    status: string;
    qrCodeUrl?: string;
    qrCodeBase64?: string;
    copyPaste?: string;
    expiresAt?: string;
    createdAt?: string;
}
export interface VexoPayStatusResponse {
    transactionId: string;
    status: 'pending' | 'paid' | 'failed' | 'expired' | 'refunded';
    amount: number;
    fee?: number;
    netAmount?: number;
    paidAt?: string;
}
export interface VexoPayBalanceResponse {
    balance: number;
    totalReceived?: number;
    totalWithdrawn?: number;
    totalFees?: number;
    transactionCount?: number;
    currency: string;
    available?: number;
    pending?: number;
}
export interface CreateCashoutRequest {
    withdrawalMethod: 'PIX' | 'INTERNAL' | 'CRYPTO';
    amount: number;
    pixKeyType?: 'CPF' | 'CNPJ' | 'EMAIL' | 'PHONE' | 'EVP';
    pixKey?: string;
    description?: string;
}
export interface VexoPayCashoutResponse {
    id?: string;
    transactionId?: string;
    status?: string;
    amount?: number;
    fee?: number;
    estimatedDate?: string;
}
export interface WebhookPayload {
    event: 'payment.completed' | 'payment.failed' | 'payment.expired';
    data: {
        transactionId: string;
        amount: number;
        fee?: number;
        netAmount?: number;
        status: string;
        payerName?: string;
        paidAt?: string;
        [key: string]: any;
    };
}
export interface VexoPayError {
    error: string;
    message: string;
    statusCode: number;
}
//# sourceMappingURL=vexopay.d.ts.map