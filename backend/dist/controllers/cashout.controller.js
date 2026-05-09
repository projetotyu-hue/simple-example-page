"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBalanceController = getBalanceController;
exports.createCashoutController = createCashoutController;
exports.listCashoutsController = listCashoutsController;
exports.getCryptoFeesController = getCryptoFeesController;
const vexopay_service_1 = require("../services/vexopay.service");
const database_service_1 = require("../services/database.service");
const logger_1 = require("../utils/logger");
async function getBalanceController(req, res) {
    try {
        const balanceData = await (0, vexopay_service_1.getBalance)();
        await (0, logger_1.log)(logger_1.LogLevel.INFO, 'Saldo consultado', {
            balance: balanceData.balance,
            currency: balanceData.currency,
        });
        return res.json({
            success: true,
            data: balanceData,
        });
    }
    catch (error) {
        console.error('[CashoutController] Erro ao consultar saldo:', error);
        await (0, logger_1.log)(logger_1.LogLevel.ERROR, 'Falha ao consultar saldo', {
            error: error.message,
        });
        const status = error.status || 500;
        return res.status(status).json({
            success: false,
            error: error.message || 'Erro ao consultar saldo',
        });
    }
}
async function createCashoutController(req, res) {
    try {
        const { amount, withdrawalMethod, pixKeyType, pixKey, targetAccount, wallet, description, } = req.body;
        // Validação básica
        if (!amount || amount <= 0) {
            return res.status(400).json({ success: false, error: 'Valor de saque inválido' });
        }
        if (!withdrawalMethod || !['PIX', 'INTERNAL', 'CRYPTO'].includes(withdrawalMethod)) {
            return res.status(400).json({
                success: false,
                error: 'withdrawalMethod deve ser PIX, INTERNAL ou CRYPTO',
            });
        }
        let vexoResponse;
        // Criar saque conforme o método
        switch (withdrawalMethod) {
            case 'PIX': {
                if (!pixKey || !pixKeyType) {
                    return res.status(400).json({
                        success: false,
                        error: 'pixKey e pixKeyType são obrigatórios para saque PIX',
                    });
                }
                const pixData = {
                    amount: Number(amount),
                    withdrawalMethod: 'PIX',
                    pixKeyType,
                    pixKey,
                    description: description || 'Saque via API',
                };
                // Consulta saldo antes
                const balance = await (0, vexopay_service_1.getBalance)();
                if (balance.balance < Number(amount)) {
                    return res.status(409).json({
                        success: false,
                        error: 'Saldo insuficiente',
                        balance: balance.balance,
                    });
                }
                vexoResponse = await (0, vexopay_service_1.createCashout)(pixData);
                break;
            }
            case 'INTERNAL': {
                if (!targetAccount) {
                    return res.status(400).json({
                        success: false,
                        error: 'targetAccount é obrigatório para saque INTERNAL',
                    });
                }
                vexoResponse = await (0, vexopay_service_1.createInternalCashout)(Number(amount), targetAccount, description);
                break;
            }
            case 'CRYPTO': {
                if (!wallet) {
                    return res.status(400).json({
                        success: false,
                        error: 'wallet (endereço BEP20) é obrigatório para saque CRYPTO',
                    });
                }
                vexoResponse = await (0, vexopay_service_1.createCryptoCashout)(Number(amount), wallet, description);
                break;
            }
        }
        // Salva no banco
        const cashoutRecord = (0, database_service_1.createCashout)({
            amount: Number(amount),
            withdrawalMethod,
            pixKeyType: pixKeyType || null,
            pixKey: pixKey || null,
            description: description || `Saque ${withdrawalMethod}`,
        });
        await (0, logger_1.log)(logger_1.LogLevel.INFO, 'Saque solicitado com sucesso', {
            withdrawalMethod,
            amount,
            status: vexoResponse.status,
        });
        return res.status(201).json({
            success: true,
            data: {
                ...vexoResponse,
                dbId: cashoutRecord.id,
            },
        });
    }
    catch (error) {
        console.error('[CashoutController] Erro ao criar saque:', error);
        await (0, logger_1.log)(logger_1.LogLevel.ERROR, 'Falha ao criar saque', {
            error: error.message,
        });
        const status = error.status || 500;
        return res.status(status).json({
            success: false,
            error: error.message || 'Erro ao processar saque',
        });
    }
}
async function listCashoutsController(req, res) {
    try {
        const { page = '1', limit = '20' } = req.query;
        const offset = (Number(page) - 1) * Number(limit);
        const cashouts = (0, database_service_1.listCashouts)(Number(limit), offset);
        await (0, logger_1.log)(logger_1.LogLevel.INFO, 'Lista de saques consultada', {
            page,
            limit,
            count: cashouts.length,
        });
        return res.json({
            success: true,
            data: cashouts,
            pagination: { page: Number(page), limit: Number(limit) },
        });
    }
    catch (error) {
        console.error('[CashoutController] Erro ao listar saques:', error);
        return res.status(500).json({
            success: false,
            error: error.message || 'Erro ao listar saques',
        });
    }
}
async function getCryptoFeesController(req, res) {
    try {
        const fees = await (0, vexopay_service_1.getCryptoFees)();
        await (0, logger_1.log)(logger_1.LogLevel.INFO, 'Taxas crypto consultadas', fees);
        return res.json({
            success: true,
            data: fees,
        });
    }
    catch (error) {
        console.error('[CashoutController] Erro ao consultar taxas crypto:', error);
        return res.status(500).json({
            success: false,
            error: error.message || 'Erro ao consultar taxas crypto',
        });
    }
}
//# sourceMappingURL=cashout.controller.js.map