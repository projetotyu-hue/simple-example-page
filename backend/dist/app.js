"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const payment_routes_1 = __importDefault(require("./routes/payment.routes"));
const webhook_routes_1 = __importDefault(require("./routes/webhook.routes"));
const logger_1 = require("./utils/logger");
dotenv_1.default.config();
const app = (0, express_1.default)();
// ==================== MIDDLEWARES GLOBAIS ====================
app.use((0, cors_1.default)({
    origin: process.env.NODE_ENV === 'production'
        ? ['https://seudominio.com'] // Em produção, especifique os domínios
        : true, // Em dev, aceita todos
    credentials: true,
}));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Log de requisições
app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});
// ==================== ROTAS ====================
app.use('/api/payments', payment_routes_1.default);
app.use('/webhooks', webhook_routes_1.default);
// ==================== ROTA DE SAÚDE ====================
app.get('/health', (_req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    });
});
// ==================== TRATAMENTO DE ERROS ====================
app.use((err, _req, res, _next) => {
    console.error('[App Error]', err);
    (0, logger_1.log)(logger_1.LogLevel.ERROR, 'Erro não tratado na aplicação', {
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
    const status = err.status || 500;
    res.status(status).json({
        success: false,
        error: process.env.NODE_ENV === 'production'
            ? 'Erro interno do servidor'
            : err.message,
    });
});
exports.default = app;
//# sourceMappingURL=app.js.map