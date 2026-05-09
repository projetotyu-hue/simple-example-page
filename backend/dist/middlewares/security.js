"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.webhookRateLimit = exports.paymentRateLimit = void 0;
exports.authMiddleware = authMiddleware;
exports.ipWhitelistMiddleware = ipWhitelistMiddleware;
exports.suspiciousActivityMiddleware = suspiciousActivityMiddleware;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const logger_1 = require("../utils/logger");
/**
 * Rate limiting para rotas de pagamento
 */
exports.paymentRateLimit = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 10, // máximo 10 requisições por IP
    message: {
        success: false,
        error: 'Muitas requisições. Tente novamente em 15 minutos.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});
/**
 * Rate limiting para webhooks (mais restritivo)
 */
exports.webhookRateLimit = (0, express_rate_limit_1.default)({
    windowMs: 1 * 60 * 1000, // 1 minuto
    max: 30,
    message: {
        success: false,
        error: 'Rate limit excedido para webhooks',
    },
});
/**
 * Middleware de autenticação para rotas administrativas
 */
function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        (0, logger_1.logSecurity)('Tentativa de acesso sem token', req.ip || 'unknown', {
            path: req.path,
        });
        return res.status(401).json({
            success: false,
            error: 'Token de autenticação necessário',
        });
    }
    const token = authHeader.split(' ')[1];
    // Aqui você pode validar JWT, API key, etc.
    // Por enquanto, verificamos se o token não está vazio
    if (!token) {
        (0, logger_1.logSecurity)('Token vazio fornecido', req.ip || 'unknown');
        return res.status(401).json({
            success: false,
            error: 'Token inválido',
        });
    }
    next();
}
/**
 * Middleware para validar IPs (whitelist opcional)
 */
function ipWhitelistMiddleware(whitelist = []) {
    return (req, res, next) => {
        if (whitelist.length === 0) {
            return next();
        }
        const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
        if (!whitelist.includes(clientIp)) {
            (0, logger_1.logSecurity)('IP não autorizado', clientIp, {
                path: req.path,
                whitelist,
            });
            return res.status(403).json({
                success: false,
                error: 'IP não autorizado',
            });
        }
        next();
    };
}
/**
 * Middleware de log de requisições suspeitas
 */
function suspiciousActivityMiddleware(req, res, next) {
    const suspiciousPatterns = [
        /(\<|%3C).*script.*(\>|%3E)/i, // XSS
        /union.*select/i, // SQL Injection
        /javascript:/i, // Javascript injection
    ];
    const bodyString = JSON.stringify(req.body);
    const queryString = JSON.stringify(req.query);
    const combined = `${bodyString}${queryString}`;
    for (const pattern of suspiciousPatterns) {
        if (pattern.test(combined)) {
            (0, logger_1.logSecurity)('Atividade suspeita detectada', req.ip || 'unknown', {
                pattern: pattern.source,
                path: req.path,
                method: req.method,
            });
            return res.status(400).json({
                success: false,
                error: 'Requisição inválida',
            });
        }
    }
    next();
}
//# sourceMappingURL=security.js.map