export declare enum LogLevel {
    INFO = "INFO",
    WARN = "WARN",
    ERROR = "ERROR",
    WEBHOOK = "WEBHOOK",
    SECURITY = "SECURITY"
}
interface LogMetadata {
    transactionId?: string;
    amount?: number;
    status?: string;
    ip?: string;
    userId?: string;
    [key: string]: any;
}
/**
 * Salva log no banco de dados e console
 */
export declare function log(level: LogLevel, message: string, metadata?: LogMetadata): Promise<void>;
/**
 * Log específico para webhooks
 */
export declare function logWebhook(event: string, data: any, success: boolean): Promise<void>;
/**
 * Log de segurança (tentativas suspeitas)
 */
export declare function logSecurity(message: string, ip: string, metadata?: Record<string, any>): Promise<void>;
export {};
//# sourceMappingURL=logger.d.ts.map