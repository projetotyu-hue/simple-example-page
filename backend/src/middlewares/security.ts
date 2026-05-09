import type { Request, Response, NextFunction } from 'express'
import rateLimit from 'express-rate-limit'
import { logSecurity } from '../utils/logger'

/**
 * Rate limiting para rotas de pagamento
 */
export const paymentRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // máximo 10 requisições por IP
  message: {
    success: false,
    error: 'Muitas requisições. Tente novamente em 15 minutos.',
  },
  standardHeaders: true,
  legacyHeaders: false,
})

/**
 * Rate limiting para webhooks (mais restritivo)
 */
export const webhookRateLimit = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 30,
  message: {
    success: false,
    error: 'Rate limit excedido para webhooks',
  },
})

/**
 * Middleware de autenticação para rotas administrativas
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    logSecurity('Tentativa de acesso sem token', req.ip || 'unknown', {
      path: req.path,
    })
    return res.status(401).json({
      success: false,
      error: 'Token de autenticação necessário',
    })
  }

  const token = authHeader.split(' ')[1]

  // Aqui você pode validar JWT, API key, etc.
  // Por enquanto, verificamos se o token não está vazio
  if (!token) {
    logSecurity('Token vazio fornecido', req.ip || 'unknown')
    return res.status(401).json({
      success: false,
      error: 'Token inválido',
    })
  }

  next()
}

/**
 * Middleware para validar IPs (whitelist opcional)
 */
export function ipWhitelistMiddleware(whitelist: string[] = []) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (whitelist.length === 0) {
      return next()
    }

    const clientIp = req.ip || req.socket.remoteAddress || 'unknown'

    if (!whitelist.includes(clientIp)) {
      logSecurity('IP não autorizado', clientIp, {
        path: req.path,
        whitelist,
      })
      return res.status(403).json({
        success: false,
        error: 'IP não autorizado',
      })
    }

    next()
  }
}

/**
 * Middleware de log de requisições suspeitas
 */
export function suspiciousActivityMiddleware(req: Request, res: Response, next: NextFunction) {
  const suspiciousPatterns = [
    /(\<|%3C).*script.*(\>|%3E)/i, // XSS
    /union.*select/i, // SQL Injection
    /javascript:/i, // Javascript injection
  ]

  const bodyString = JSON.stringify(req.body)
  const queryString = JSON.stringify(req.query)
  const combined = `${bodyString}${queryString}`

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(combined)) {
      logSecurity('Atividade suspeita detectada', req.ip || 'unknown', {
        pattern: pattern.source,
        path: req.path,
        method: req.method,
      })
      return res.status(400).json({
        success: false,
        error: 'Requisição inválida',
      })
    }
  }

  next()
}
