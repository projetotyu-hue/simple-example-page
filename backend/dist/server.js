#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = __importDefault(require("./app"));
const database_service_1 = require("./services/database.service");
const logger_1 = require("./utils/logger");
const PORT = process.env.PORT || 3000;
async function startServer() {
    try {
        // Inicializa banco SQLite
        (0, database_service_1.initDatabase)();
        await (0, logger_1.log)(logger_1.LogLevel.INFO, 'Banco SQLite inicializado com sucesso');
        const server = app_1.default.listen(PORT, () => {
            console.log(`\n🚀 Servidor VexoPay Backend rodando na porta ${PORT}`);
            console.log(`📊 Dashboard: http://localhost:${PORT}/api/payments/dashboard`);
            console.log(`💰 Saldo: http://localhost:${PORT}/api/payments/balance`);
            console.log(`🔗 Webhook: http://localhost:${PORT}/webhooks/vexopay\n`);
        });
        // Graceful shutdown
        const shutdown = async (signal) => {
            console.log(`\n⚠️  Recebido ${signal}. Encerrando servidor...`);
            server.close(() => {
                console.log('Servidor HTTP encerrado');
                process.exit(0);
            });
            setTimeout(() => {
                console.error('Timeout forçado ao encerrar');
                process.exit(1);
            }, 5000);
        };
        process.on('SIGTERM', () => shutdown('SIGTERM'));
        process.on('SIGINT', () => shutdown('SIGINT'));
    }
    catch (error) {
        console.error('Falha ao iniciar servidor:', error);
        await (0, logger_1.log)(logger_1.LogLevel.ERROR, 'Falha crítica ao iniciar servidor', {
            error: error.message,
        });
        process.exit(1);
    }
}
startServer();
//# sourceMappingURL=server.js.map