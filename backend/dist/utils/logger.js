"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogLevel = void 0;
exports.log = log;
exports.logWebhook = logWebhook;
exports.logSecurity = logSecurity;
const database_service_1 = require("../services/database.service");
var LogLevel;
(function (LogLevel) {
    LogLevel["INFO"] = "INFO";
    LogLevel["WARN"] = "WARN";
    LogLevel["ERROR"] = "ERROR";
    LogLevel["WEBHOOK"] = "WEBHOOK";
    LogLevel["SECURITY"] = "SECURITY";
})(LogLevel || (exports.LogLevel = LogLevel = {}));
/**
 * Salva log no banco de dados e console
 */
async function log(level, message, metadata) {
    try {
        (0, database_service_1.createLog)(level, message, metadata ? JSON.stringify(metadata) : undefined);
        const emoji = {
            [LogLevel.INFO]: 'ℹ️',
            [LogLevel.WARN]: '⚠️',
            [LogLevel.ERROR]: '❌',
            [LogLevel.WEBHOOK]: '🔔',
            [LogLevel.SECURITY]: '🔒',
        };
        console.log(`[${new Date().toISOString()}] ${emoji[level]} [${level}] ${message}`, metadata ? JSON.stringify(metadata) : '');
    }
    catch (error) {
        console.error('Erro ao salvar log:', error);
    }
}
/**
 * Log específico para webhooks
 */
async function logWebhook(event, data, success) {
    await log(success ? LogLevel.WEBHOOK : LogLevel.ERROR, `Webhook ${event}: ${success ? 'SUCESSO' : 'FALHA'}`, {
        event,
        transactionId: data?.transactionId,
        amount: data?.amount,
        status: data?.status,
        paidAt: data?.paidAt,
    });
}
/**
 * Log de segurança (tentativas suspeitas)
 */
async function logSecurity(message, ip, metadata) {
    await log(LogLevel.SECURITY, message, { ip, ...metadata });
}
//# sourceMappingURL=logger.js.map