import type { Request, Response, NextFunction } from 'express';
/**
 * Rate limiting para rotas de pagamento
 */
export declare const paymentRateLimit: import("express-rate-limit").RateLimitRequestHandler;
/**
 * Rate limiting para webhooks (mais restritivo)
 */
export declare const webhookRateLimit: import("express-rate-limit").RateLimitRequestHandler;
/**
 * Middleware de autenticação para rotas administrativas
 */
export declare function authMiddleware(req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
/**
 * Middleware para validar IPs (whitelist opcional)
 */
export declare function ipWhitelistMiddleware(whitelist?: string[]): (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
/**
 * Middleware de log de requisições suspeitas
 */
export declare function suspiciousActivityMiddleware(req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=security.d.ts.map