"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPixPayment = createPixPayment;
exports.checkPixStatus = checkPixStatus;
exports.getBalance = getBalance;
exports.getCryptoFees = getCryptoFees;
exports.createInternalCashout = createInternalCashout;
exports.createCryptoCashout = createCryptoCashout;
exports.createCashout = createCashout;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const VEXO_CI = process.env.VEXO_CI;
const VEXO_CS = process.env.VEXO_CS;
const VEXO_BASE_URL = process.env.VEXO_BASE_URL || 'https://www.vexopay.com.br';
if (!VEXO_CI || !VEXO_CS) {
    throw new Error('Credenciais VexoPay não configuradas. Verifique o arquivo .env');
}
const api = axios_1.default.create({
    baseURL: VEXO_BASE_URL,
    timeout: 30000, // 30 segundos
    headers: {
        'Content-Type': 'application/json',
    },
});
// Interceptor para adicionar as credenciais em TODAS as requisições
api.interceptors.request.use((config) => {
    config.headers.set('ci', VEXO_CI);
    config.headers.set('cs', VEXO_CS);
    return config;
});
// Interceptor de resposta para tratamento centralizado de erros
api.interceptors.response.use((response) => response, (error) => {
    const status = error.response?.status;
    const data = error.response?.data;
    let message = 'Erro desconhecido na API VexoPay';
    switch (status) {
        case 400:
            message = `Requisição inválida: ${data?.message || 'Dados incorretos'}`;
            break;
        case 401:
            message = 'Credenciais inválidas (Unauthorized)';
            break;
        case 403:
            message = 'Acesso negado (Forbidden)';
            break;
        case 404:
            message = 'Recurso não encontrado';
            break;
        case 409:
            message = 'Conflito de dados (Conflict)';
            break;
        case 428:
            message = 'Pré-condição necessária (Precondition Required)';
            break;
        case 429:
            message = 'Muitas requisições. Tente novamente mais tarde (Rate Limit)';
            break;
        case 500:
            message = 'Erro interno do servidor VexoPay';
            break;
        case 502:
            message = 'Bad Gateway - Servidor VexoPay indisponível';
            break;
    }
    console.error(`[VexoPay API Error ${status}]:`, message, data);
    return Promise.reject({ status, message, data });
});
// ==================== 1. CRIAR PIX ====================
async function createPixPayment(data) {
    try {
        const response = await api.post('/api/gateway/pix-create', {
            amount: data.amount,
            payerName: data.payerName,
            payerDocument: data.payerDocument,
            description: data.description,
        });
        // A API retorna { success: true, data: { transactionId: ... } }
        const responseData = response.data.data || response.data;
        // Log de sucesso
        console.log('[VexoPay] PIX criado com sucesso:', responseData.transactionId);
        return {
            transactionId: responseData.transactionId,
            amount: responseData.amount,
            fee: responseData.fee,
            netAmount: responseData.netAmount,
            status: responseData.status || 'PENDING',
            qrCodeUrl: responseData.qrCodeUrl,
            qrCodeBase64: responseData.qrCodeBase64,
            copyPaste: responseData.copyPaste,
            expiresAt: responseData.expiresAt,
            createdAt: responseData.createdAt,
        };
    }
    catch (error) {
        console.error('[VexoPay] Erro ao criar PIX:', error.message);
        throw error;
    }
}
// ==================== 2. CONSULTAR STATUS ====================
async function checkPixStatus(transactionId) {
    try {
        const response = await api.get('/api/gateway/pix-status', {
            params: { transactionId },
        });
        // A API retorna { success: true, data: { ... } }
        const responseData = response.data.data || response.data;
        return {
            transactionId: responseData.transactionId || transactionId,
            status: responseData.status,
            amount: responseData.amount,
            fee: responseData.fee,
            netAmount: responseData.netAmount,
            paidAt: responseData.paidAt,
        };
    }
    catch (error) {
        console.error('[VexoPay] Erro ao consultar status:', error.message);
        throw error;
    }
}
// ==================== 3. CONSULTAR SALDO ====================
async function getBalance() {
    try {
        const response = await api.get('/api/gateway/balance');
        // A API retorna { success: true, data: { ... } }
        const responseData = response.data.data || response.data;
        console.log('[VexoPay] Saldo consultado:', responseData.balance);
        return {
            balance: responseData.balance || 0,
            totalReceived: responseData.totalReceived,
            totalWithdrawn: responseData.totalWithdrawn,
            totalFees: responseData.totalFees,
            transactionCount: responseData.transactionsCount,
            currency: responseData.currency || 'BRL',
        };
    }
    catch (error) {
        console.error('[VexoPay] Erro ao consultar saldo:', error.message);
        throw error;
    }
}
// ==================== 5. CONSULTAR TAXAS CRYPTO ====================
async function getCryptoFees() {
    try {
        const response = await api.get('/api/merchant/crypto-fees');
        const responseData = response.data.data || response.data;
        return {
            brlPerUSD: responseData.quote?.brlPerUSD || 0,
            networkFee: responseData.fees?.networkFee || 0,
            platformFeePercentage: responseData.fees?.platformFeePercentage || 0,
        };
    }
    catch (error) {
        console.error('[VexoPay] Erro ao consultar taxas crypto:', error.message);
        throw error;
    }
}
// ==================== 6. SAQUE INTERNAL (entre contas VexoPay) ====================
async function createInternalCashout(amount, targetAccount, description) {
    try {
        if (!targetAccount) {
            throw new Error('targetAccount é obrigatório para saque INTERNAL');
        }
        const response = await api.post('/api/merchant/cashout', {
            withdrawalMethod: 'INTERNAL',
            amount,
            targetAccount,
            description: description || 'Transferência interna',
        });
        const responseData = response.data.data || response.data;
        return {
            id: responseData.id || responseData.transactionId,
            status: responseData.status,
            amount: responseData.amount,
            fee: responseData.fee,
        };
    }
    catch (error) {
        console.error('[VexoPay] Erro ao solicitar saque interno:', error.message);
        throw error;
    }
}
// ==================== 7. SAQUE CRYPTO ====================
async function createCryptoCashout(amount, wallet, description) {
    try {
        if (!wallet || !wallet.startsWith('0x') || wallet.length !== 42) {
            throw new Error('Carteira deve ser um endereço BEP20 válido (0x + 40 caracteres hex)');
        }
        const response = await api.post('/api/merchant/cashout', {
            withdrawalMethod: 'CRYPTO',
            amount,
            wallet,
            description: description || 'Saque em USDT',
        });
        const responseData = response.data.data || response.data;
        return {
            id: responseData.id || responseData.transactionId,
            status: responseData.status,
            amount: responseData.amount,
            fee: responseData.fee,
        };
    }
    catch (error) {
        console.error('[VexoPay] Erro ao solicitar saque crypto:', error.message);
        throw error;
    }
}
async function createCashout(data) {
    try {
        // Validações locais antes de enviar para API
        if (data.withdrawalMethod === 'PIX') {
            if (!data.pixKey || !data.pixKeyType) {
                throw new Error('Chave PIX e tipo de chave são obrigatórios para saque PIX');
            }
            if (!['CPF', 'CNPJ', 'EMAIL', 'PHONE', 'EVP'].includes(data.pixKeyType)) {
                throw new Error('Tipo de chave PIX inválido. Use: CPF, CNPJ, EMAIL, PHONE ou EVP');
            }
        }
        if (data.amount <= 0) {
            throw new Error('Valor de saque deve ser maior que zero');
        }
        const response = await api.post('/api/merchant/cashout', {
            withdrawalMethod: data.withdrawalMethod,
            amount: data.amount,
            pixKeyType: data.pixKeyType,
            pixKey: data.pixKey,
            description: data.description,
        });
        // A API retorna { success: true, data: { ... } }
        const responseData = response.data.data || response.data;
        console.log('[VexoPay] Saque solicitado com sucesso:', responseData.id || responseData.transactionId);
        return {
            id: responseData.id || responseData.transactionId,
            status: responseData.status,
            amount: responseData.amount,
            fee: responseData.fee,
            estimatedDate: responseData.estimatedDate,
        };
    }
    catch (error) {
        console.error('[VexoPay] Erro ao solicitar saque:', error.message);
        throw error;
    }
}
//# sourceMappingURL=vexopay.service.js.map