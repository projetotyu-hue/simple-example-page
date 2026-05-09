import type { Request, Response } from 'express';
export declare function createPayment(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getPaymentStatus(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function listTransactionsController(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getDashboardStatsController(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=payment.controller.d.ts.map