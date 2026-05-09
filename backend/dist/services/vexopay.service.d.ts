import type { CreatePixPaymentRequest, VexoPayPixResponse, VexoPayStatusResponse, VexoPayBalanceResponse, CreateCashoutRequest, VexoPayCashoutResponse } from '../types/vexopay';
export declare function createPixPayment(data: CreatePixPaymentRequest): Promise<VexoPayPixResponse>;
export declare function checkPixStatus(transactionId: string): Promise<VexoPayStatusResponse>;
export declare function getBalance(): Promise<VexoPayBalanceResponse>;
export declare function getCryptoFees(): Promise<{
    brlPerUSD: number;
    networkFee: number;
    platformFeePercentage: number;
}>;
export declare function createInternalCashout(amount: number, targetAccount: string, description?: string): Promise<VexoPayCashoutResponse>;
export declare function createCryptoCashout(amount: number, wallet: string, description?: string): Promise<VexoPayCashoutResponse>;
export declare function createCashout(data: CreateCashoutRequest): Promise<VexoPayCashoutResponse>;
//# sourceMappingURL=vexopay.service.d.ts.map