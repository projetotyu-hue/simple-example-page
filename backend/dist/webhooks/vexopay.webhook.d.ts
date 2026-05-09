import type { Request, Response } from 'express';
/**
 * Processa webhooks da VexoPay
 *
 * Eventos esperados:
 * - payment.completed
 * - payment.failed
 * - payment.expired
 */
export declare function handleVexoWebhook(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=vexopay.webhook.d.ts.map