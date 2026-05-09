"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
exports.initDatabase = initDatabase;
exports.createTransaction = createTransaction;
exports.getTransactionByTransactionId = getTransactionByTransactionId;
exports.updateTransactionStatus = updateTransactionStatus;
exports.listTransactions = listTransactions;
exports.getDashboardStats = getDashboardStats;
exports.createCashout = createCashout;
exports.getCashoutById = getCashoutById;
exports.listCashouts = listCashouts;
exports.createLog = createLog;
exports.listLogs = listLogs;
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const path_1 = __importDefault(require("path"));
const dbPath = process.env.DATABASE_URL?.replace('file:', '') || path_1.default.join(process.cwd(), 'dev.db');
const db = new better_sqlite3_1.default(dbPath);
exports.db = db;
// Ativar WAL mode para melhor performance
db.pragma('journal_mode = WAL');
// ==================== INICIALIZAÇÃO DO BANCO ====================
function initDatabase() {
    // Tabela de transações
    db.exec(`
    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
      transactionId TEXT UNIQUE NOT NULL,
      amount TEXT NOT NULL,
      fee TEXT,
      netAmount TEXT,
      status TEXT NOT NULL DEFAULT 'PENDING',
      qrCodeUrl TEXT,
      qrCodeBase64 TEXT,
      copyPaste TEXT,
      payerName TEXT,
      payerDocument TEXT,
      description TEXT,
      expiresAt TEXT,
      paidAt TEXT,
      webhookEvents TEXT,
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);
    // Tabela de saques
    db.exec(`
    CREATE TABLE IF NOT EXISTS cashouts (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
      amount TEXT NOT NULL,
      withdrawalMethod TEXT NOT NULL,
      pixKeyType TEXT,
      pixKey TEXT,
      status TEXT NOT NULL DEFAULT 'PENDING',
      description TEXT,
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);
    // Tabela de logs
    db.exec(`
    CREATE TABLE IF NOT EXISTS logs (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
      level TEXT NOT NULL,
      message TEXT NOT NULL,
      metadata TEXT,
      createdAt TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);
    console.log('[Database] SQLite inicializado em:', dbPath);
    return db;
}
// ==================== TRANSAÇÕES ====================
function createTransaction(data) {
    const stmt = db.prepare(`
    INSERT INTO transactions (transactionId, amount, fee, netAmount, status, qrCodeUrl, qrCodeBase64, copyPaste, expiresAt)
    VALUES (@transactionId, @amount, @fee, @netAmount, @status, @qrCodeUrl, @qrCodeBase64, @copyPaste, @expiresAt)
  `);
    stmt.run({
        transactionId: data.transactionId,
        amount: data.amount.toString(),
        fee: data.fee?.toString() || null,
        netAmount: data.netAmount?.toString() || null,
        status: data.status || 'PENDING',
        qrCodeUrl: data.qrCodeUrl || null,
        qrCodeBase64: data.qrCodeBase64 || null,
        copyPaste: data.copyPaste || null,
        expiresAt: data.expiresAt || null,
    });
    return getTransactionByTransactionId(data.transactionId);
}
function getTransactionByTransactionId(transactionId) {
    return db.prepare('SELECT * FROM transactions WHERE transactionId = ?').get(transactionId);
}
function updateTransactionStatus(transactionId, data) {
    const fields = [];
    const params = { transactionId };
    if (data.status !== undefined) {
        fields.push('status = @status');
        params.status = data.status;
    }
    if (data.fee !== undefined) {
        fields.push('fee = @fee');
        params.fee = data.fee?.toString();
    }
    if (data.netAmount !== undefined) {
        fields.push('netAmount = @netAmount');
        params.netAmount = data.netAmount?.toString();
    }
    if (data.paidAt !== undefined) {
        fields.push('paidAt = @paidAt');
        params.paidAt = data.paidAt;
    }
    fields.push("updatedAt = datetime('now')");
    if (fields.length === 1)
        return getTransactionByTransactionId(transactionId); // only updatedAt
    const stmt = db.prepare(`UPDATE transactions SET ${fields.join(', ')} WHERE transactionId = @transactionId`);
    stmt.run(params);
    return getTransactionByTransactionId(transactionId);
}
function listTransactions(filters) {
    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const offset = (page - 1) * limit;
    let where = '';
    const params = [];
    if (filters?.status) {
        where = 'WHERE status = ?';
        params.push(filters.status);
    }
    const transactions = db.prepare(`SELECT * FROM transactions ${where} ORDER BY createdAt DESC LIMIT ? OFFSET ?`)
        .all(...params, limit, offset);
    const countRow = db.prepare(`SELECT COUNT(*) as total FROM transactions ${where}`)
        .get(...params);
    return { transactions, total: countRow.total };
}
function getDashboardStats() {
    const paid = db.prepare(`
    SELECT SUM(CAST(amount AS REAL)) as total, COUNT(*) as count
    FROM transactions WHERE status = 'paid'
  `).get();
    const byStatus = db.prepare(`
    SELECT status, COUNT(*) as count FROM transactions GROUP BY status
  `).all();
    const recent = db.prepare(`
    SELECT * FROM transactions ORDER BY createdAt DESC LIMIT 10
  `).all();
    return {
        totalReceived: paid.total || 0,
        totalTransactions: paid.count || 0,
        byStatus: byStatus.reduce((acc, item) => {
            acc[item.status] = item.count;
            return acc;
        }, {}),
        recent,
    };
}
// ==================== SAQUES ====================
function createCashout(data) {
    const stmt = db.prepare(`
    INSERT INTO cashouts (amount, withdrawalMethod, pixKeyType, pixKey, description)
    VALUES (@amount, @withdrawalMethod, @pixKeyType, @pixKey, @description)
  `);
    stmt.run({
        amount: data.amount.toString(),
        withdrawalMethod: data.withdrawalMethod,
        pixKeyType: data.pixKeyType || null,
        pixKey: data.pixKey || null,
        description: data.description || null,
    });
    const lastId = db.prepare('SELECT last_insert_rowid() as id').get().id;
    return getCashoutById(lastId);
}
function getCashoutById(id) {
    return db.prepare('SELECT * FROM cashouts WHERE id = ?').get(id);
}
function listCashouts(limit = 20, offset = 0) {
    return db.prepare('SELECT * FROM cashouts ORDER BY createdAt DESC LIMIT ? OFFSET ?').all(limit, offset);
}
// ==================== LOGS ====================
function createLog(level, message, metadata) {
    db.prepare(`
    INSERT INTO logs (level, message, metadata)
    VALUES (@level, @message, @metadata)
  `).run({
        level,
        message,
        metadata: metadata ? JSON.stringify(metadata) : null,
    });
}
function listLogs(limit = 100) {
    return db.prepare('SELECT * FROM logs ORDER BY createdAt DESC LIMIT ?').all(limit);
}
//# sourceMappingURL=database.service.js.map