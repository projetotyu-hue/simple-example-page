"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const vexopay_webhook_1 = require("../webhooks/vexopay.webhook");
const security_1 = require("../middlewares/security");
const router = (0, express_1.Router)();
// Webhook da VexoPay
// Recebe eventos: payment.completed, payment.failed, payment.expired
router.post('/vexopay', security_1.webhookRateLimit, security_1.suspiciousActivityMiddleware, vexopay_webhook_1.handleVexoWebhook);
exports.default = router;
//# sourceMappingURL=webhook.routes.js.map