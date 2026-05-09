import { type Database as DatabaseType } from 'better-sqlite3';
declare const db: DatabaseType;
export declare function initDatabase(): DatabaseType;
export declare function createTransaction(data: {
    transactionId: string;
    amount: number;
    fee?: number;
    netAmount?: number;
    status?: string;
    qrCodeUrl?: string;
    qrCodeBase64?: string;
    copyPaste?: string;
    expiresAt?: string;
}): any;
export declare function getTransactionByTransactionId(transactionId: string): any;
export declare function updateTransactionStatus(transactionId: string, data: {
    status?: string;
    fee?: number;
    netAmount?: number;
    paidAt?: string;
}): any;
export declare function listTransactions(filters?: {
    status?: string;
    page?: number;
    limit?: number;
}): {
    transactions: any[];
    total: number;
};
export declare function getDashboardStats(): {
    totalReceived: number;
    totalTransactions: number;
    byStatus: any;
    recent: any[];
};
export declare function createCashout(data: {
    amount: number;
    withdrawalMethod: string;
    pixKeyType?: string;
    pixKey?: string;
    description?: string;
}): any;
export declare function getCashoutById(id: string): any;
export declare function listCashouts(limit?: number, offset?: number): any[];
export declare function createLog(level: string, message: string, metadata?: any): void;
export declare function listLogs(limit?: number): any[];
export { db };
//# sourceMappingURL=database.service.d.ts.map