import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useTheme } from "@/components/theme-provider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Copy,
  ArrowDownToLine,
  Loader2,
  BarChart3,
  Wallet,
  AlertTriangle,
  Inbox,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";

export const Route = createFileRoute("/admin/vexopay")({
  head: () => ({ meta: [{ title: "VexoPay — Ghostshield Admin" }] }),
  component: VexoPayPage,
});

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type VexoBalance = {
  balance: number;
  totalReceived: number;
  totalWithdrawn: number;
  totalFees: number;
  transactionCount: number;
  currency: string;
};

type VexoTransaction = {
  id: number;
  transactionId: string;
  amount: string;
  fee: string | null;
  netAmount: string | null;
  status: string;
  payerName: string | null;
  description: string | null;
  qrCodeUrl: string | null;
  copyPaste: string | null;
  expiresAt: string | null;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
};

type CashoutForm = {
  amount: string;
  withdrawalMethod: "PIX" | "INTERNAL" | "CRYPTO";
  pixKeyType: string;
  pixKey: string;
  targetAccount: string;
  wallet: string;
  description: string;
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(value);
}

function statusBadge(status: string) {
  const map: Record<string, { label: string; className: string }> = {
    pending: { label: "Pendente", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
    paid: { label: "Pago", className: "bg-green-100 text-green-800 border-green-200" },
    failed: { label: "Falhou", className: "bg-red-100 text-red-800 border-red-200" },
    expired: { label: "Expirado", className: "bg-gray-100 text-gray-800 border-gray-200" },
    refunded: { label: "Estornado", className: "bg-orange-100 text-orange-800 border-orange-200" },
  };
  const s = map[status] || { label: status, className: "bg-gray-100 text-gray-800 border-gray-200" };
  return <Badge variant="outline" className={cn("text-xs", s.className)}>{s.label}</Badge>;
}

function EmptyState({ message = "Nenhum dado ainda", icon: Icon = Inbox }: { message?: string; icon?: React.ElementType }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Icon className="h-12 w-12 text-muted-foreground/40 mb-4" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// API helpers (call local VexoPay backend)
// ---------------------------------------------------------------------------
const API_BASE = "/api";

async function apiFetch(path: string, options?: RequestInit) {
  const token = localStorage.getItem("auth_token") || "vexopay-secret-token-123";
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      ...(options?.headers || {}),
    },
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || `Erro ${res.status}`);
  return json;
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------
function VexoPayPage() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState("dashboard");

  // Balance
  const [balance, setBalance] = useState<VexoBalance | null>(null);
  const [balanceLoading, setBalanceLoading] = useState(true);
  const [balanceError, setBalanceError] = useState<string | null>(null);

  // Transactions
  const [transactions, setTransactions] = useState<VexoTransaction[]>([]);
  const [txLoading, setTxLoading] = useState(true);
  const [txError, setTxError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchId, setSearchId] = useState("");

  // Cashout form
  const [cashoutForm, setCashoutForm] = useState<CashoutForm>({
    amount: "",
    withdrawalMethod: "PIX",
    pixKeyType: "CPF",
    pixKey: "",
    targetAccount: "",
    wallet: "",
    description: "",
  });
  const [cashoutLoading, setCashoutLoading] = useState(false);
  const [cashoutResult, setCashoutResult] = useState<string | null>(null);
  const [cashoutError, setCashoutError] = useState<string | null>(null);

  // Fetch balance
  const fetchBalance = useCallback(async (signal?: AbortSignal) => {
    try {
      setBalanceLoading(true);
      setBalanceError(null);
      const data = await apiFetch("/api/payments/balance");
      if (!signal?.aborted) {
        setBalance(data.success ? data.data : data);
      }
    } catch (err: any) {
      if (!signal?.aborted) setBalanceError(err.message);
    } finally {
      if (!signal?.aborted) setBalanceLoading(false);
    }
  }, []);

  // Fetch transactions
  const fetchTransactions = useCallback(async (signal?: AbortSignal) => {
    try {
      setTxLoading(true);
      setTxError(null);
      const data = await apiFetch("/api/payments/transactions?limit=100");
      if (!signal?.aborted) {
        setTransactions(data.success ? data.data : data);
      }
    } catch (err: any) {
      if (!signal?.aborted) setTxError(err.message);
    } finally {
      if (!signal?.aborted) setTxLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchBalance(controller.signal);
    fetchTransactions(controller.signal);
    return () => controller.abort();
  }, [fetchBalance, fetchTransactions]);

  // Filtered transactions
  const filteredTx = transactions.filter(tx => {
    if (statusFilter !== "all" && tx.status !== statusFilter) return false;
    if (searchId && !tx.transactionId.toLowerCase().includes(searchId.toLowerCase()) && !tx.payerName?.toLowerCase().includes(searchId.toLowerCase())) return false;
    return true;
  });

  // Cashout submit
  const handleCashout = async (e: React.FormEvent) => {
    e.preventDefault();
    setCashoutLoading(true);
    setCashoutError(null);
    setCashoutResult(null);

    try {
      const payload: any = {
        amount: Number(cashoutForm.amount),
        withdrawalMethod: cashoutForm.withdrawalMethod,
        description: cashoutForm.description || `Saque ${cashoutForm.withdrawalMethod}`,
      };

      if (cashoutForm.withdrawalMethod === "PIX") {
        payload.pixKeyType = cashoutForm.pixKeyType;
        payload.pixKey = cashoutForm.pixKey;
      } else if (cashoutForm.withdrawalMethod === "INTERNAL") {
        payload.targetAccount = cashoutForm.targetAccount;
      } else if (cashoutForm.withdrawalMethod === "CRYPTO") {
        payload.wallet = cashoutForm.wallet;
      }

      const data = await apiFetch("/api/payments/cashout", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setCashoutResult(`Saque solicitado com sucesso! ID: ${data.data?.id || data.data?.dbId || 'N/A'}`);
      setCashoutForm({ amount: "", withdrawalMethod: "PIX", pixKeyType: "CPF", pixKey: "", targetAccount: "", wallet: "", description: "" });
      fetchBalance();
    } catch (err: any) {
      setCashoutError(err.message);
    } finally {
      setCashoutLoading(false);
    }
  };

  // KPI cards
  const kpiCards = balance ? [
    { title: "Saldo Atual", value: formatCurrency(balance.balance), icon: Wallet, subtitle: `${balance.currency} disponível` },
    { title: "Total Recebido", value: formatCurrency(balance.totalReceived), icon: TrendingUp, subtitle: "bruto histórico" },
    { title: "Total Sacado", value: formatCurrency(balance.totalWithdrawn), icon: ArrowDownToLine, subtitle: "saques realizados" },
    { title: "Total em Taxas", value: formatCurrency(balance.totalFees), icon: AlertTriangle, subtitle: `${balance.transactionCount} transações` },
  ] : [];

  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <AdminLayout title="VexoPay">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">VexoPay</h1>
            <p className="text-sm text-muted-foreground">Gestão de pagamentos PIX</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => { fetchBalance(); fetchTransactions(); }}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href="https://www.vexopay.com.br" target="_blank" rel="noopener">
                <ExternalLink className="h-4 w-4 mr-2" />
                VexoPay
              </a>
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="transactions">Transações</TabsTrigger>
            <TabsTrigger value="cashout">Saque</TabsTrigger>
          </TabsList>

          {/* ==================== DASHBOARD TAB ==================== */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {balanceLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <Card key={i}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <div className="h-4 w-24 rounded bg-muted animate-pulse" />
                      <div className="h-4 w-4 rounded bg-muted animate-pulse" />
                    </CardHeader>
                    <CardContent>
                      <div className="h-8 w-32 rounded bg-muted animate-pulse mb-1" />
                      <div className="h-3 w-40 rounded bg-muted animate-pulse" />
                    </CardContent>
                  </Card>
                ))
              ) : balanceError ? (
                <Card className="col-span-full">
                  <CardContent className="pt-6">
                    <p className="text-sm text-red-500">{balanceError}</p>
                  </CardContent>
                </Card>
              ) : (
                kpiCards.map((card) => (
                  <Card key={card.title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
                      <card.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{card.value}</div>
                      <p className="text-xs text-muted-foreground mt-1">{card.subtitle}</p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* Recent Transactions Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Transações Recentes</CardTitle>
                <CardDescription>Últimas 10 transações PIX</CardDescription>
              </CardHeader>
              <CardContent>
                {txLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded bg-muted animate-pulse" />
                        <div className="flex-1 space-y-1">
                          <div className="h-4 w-3/4 rounded bg-muted animate-pulse" />
                          <div className="h-3 w-1/2 rounded bg-muted animate-pulse" />
                        </div>
                        <div className="h-4 w-20 rounded bg-muted animate-pulse" />
                      </div>
                    ))}
                  </div>
                ) : filteredTx.length === 0 ? (
                  <EmptyState message="Nenhuma transação ainda" />
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Pagador</TableHead>
                        <TableHead>Data</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTx.slice(0, 10).map((tx) => (
                        <TableRow key={tx.id}>
                          <TableCell className="font-mono text-xs">
                            <button onClick={() => copyToClipboard(tx.transactionId)} className="hover:text-rose-600 flex items-center gap-1">
                              {tx.transactionId.slice(0, 16)}...
                              <Copy className="h-3 w-3" />
                            </button>
                          </TableCell>
                          <TableCell className="font-semibold">{formatCurrency(Number(tx.amount))}</TableCell>
                          <TableCell>{statusBadge(tx.status)}</TableCell>
                          <TableCell className="text-sm">{tx.payerName || "-"}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {new Date(tx.createdAt).toLocaleDateString("pt-BR")}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ==================== TRANSACTIONS TAB ==================== */}
          <TabsContent value="transactions" className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                placeholder="Buscar por ID ou nome..."
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="sm:max-w-xs"
              />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="paid">Pago</SelectItem>
                  <SelectItem value="failed">Falhou</SelectItem>
                  <SelectItem value="expired">Expirado</SelectItem>
                  <SelectItem value="refunded">Estornado</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={() => { setSearchId(""); setStatusFilter("all"); }}>
                Limpar
              </Button>
            </div>

            {/* Transactions Table */}
            <Card>
              <CardHeader>
                <CardTitle>Todas as Transações</CardTitle>
                <CardDescription>{filteredTx.length} transação(ões) encontrada(s)</CardDescription>
              </CardHeader>
              <CardContent>
                {txLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded bg-muted animate-pulse" />
                        <div className="flex-1 space-y-1">
                          <div className="h-4 w-3/4 rounded bg-muted animate-pulse" />
                          <div className="h-3 w-1/2 rounded bg-muted animate-pulse" />
                        </div>
                        <div className="h-4 w-20 rounded bg-muted animate-pulse" />
                      </div>
                    ))}
                  </div>
                ) : txError ? (
                  <p className="text-sm text-red-500">{txError}</p>
                ) : filteredTx.length === 0 ? (
                  <EmptyState message="Nenhuma transação encontrada" />
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Transaction ID</TableHead>
                          <TableHead>Valor</TableHead>
                          <TableHead>Taxa</TableHead>
                          <TableHead>Líquido</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Pagador</TableHead>
                          <TableHead>Descrição</TableHead>
                          <TableHead>Data</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredTx.map((tx) => (
                          <TableRow key={tx.id}>
                            <TableCell className="font-mono text-xs max-w-[150px] truncate">
                              <button onClick={() => copyToClipboard(tx.transactionId)} className="hover:text-rose-600 flex items-center gap-1">
                                {tx.transactionId}
                                <Copy className="h-3 w-3 inline" />
                              </button>
                            </TableCell>
                            <TableCell className="font-semibold">{formatCurrency(Number(tx.amount))}</TableCell>
                            <TableCell>{tx.fee ? formatCurrency(Number(tx.fee)) : "-"}</TableCell>
                            <TableCell>{tx.netAmount ? formatCurrency(Number(tx.netAmount)) : "-"}</TableCell>
                            <TableCell>{statusBadge(tx.status)}</TableCell>
                            <TableCell className="text-sm">{tx.payerName || "-"}</TableCell>
                            <TableCell className="text-xs max-w-[200px] truncate">{tx.description || "-"}</TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                              {new Date(tx.createdAt).toLocaleString("pt-BR")}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ==================== CASHOUT TAB ==================== */}
          <TabsContent value="cashout" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Solicitar Saque</CardTitle>
                <CardDescription>Retire saldo via PIX, entre contas ou Crypto (BEP20)</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCashout} className="space-y-4 max-w-lg">
                  {/* Amount */}
                  <div className="space-y-2">
                    <Label htmlFor="amount">Valor (R$)</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      min="0.01"
                      required
                      placeholder="0,00"
                      value={cashoutForm.amount}
                      onChange={(e) => setCashoutForm(f => ({ ...f, amount: e.target.value }))}
                    />
                  </div>

                  {/* Withdrawal Method */}
                  <div className="space-y-2">
                    <Label>Método de Saque</Label>
                    <Select
                      value={cashoutForm.withdrawalMethod}
                      onValueChange={(v: any) => setCashoutForm(f => ({ ...f, withdrawalMethod: v }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PIX">PIX</SelectItem>
                        <SelectItem value="INTERNAL">Conta VexoPay (Interno)</SelectItem>
                        <SelectItem value="CRYPTO">Crypto (USDT BEP20)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* PIX fields */}
                  {cashoutForm.withdrawalMethod === "PIX" && (
                    <>
                      <div className="space-y-2">
                        <Label>Tipo de Chave PIX</Label>
                        <Select
                          value={cashoutForm.pixKeyType}
                          onValueChange={(v) => setCashoutForm(f => ({ ...f, pixKeyType: v }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="CPF">CPF</SelectItem>
                            <SelectItem value="CNPJ">CNPJ</SelectItem>
                            <SelectItem value="EMAIL">E-mail</SelectItem>
                            <SelectItem value="TELEFONE">Telefone</SelectItem>
                            <SelectItem value="CHAVE_ALEATORIA">Chave Aleatória</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Chave PIX</Label>
                        <Input
                          required
                          placeholder="Digite a chave PIX"
                          value={cashoutForm.pixKey}
                          onChange={(e) => setCashoutForm(f => ({ ...f, pixKey: e.target.value }))}
                        />
                      </div>
                    </>
                  )}

                  {/* INTERNAL fields */}
                  {cashoutForm.withdrawalMethod === "INTERNAL" && (
                    <div className="space-y-2">
                      <Label>Conta Destino</Label>
                      <Input
                        required
                        placeholder="E-mail, CPF ou ID da conta"
                        value={cashoutForm.targetAccount}
                        onChange={(e) => setCashoutForm(f => ({ ...f, targetAccount: e.target.value }))}
                      />
                    </div>
                  )}

                  {/* CRYPTO fields */}
                  {cashoutForm.withdrawalMethod === "CRYPTO" && (
                    <div className="space-y-2">
                      <Label>Carteira BEP20 (USDT)</Label>
                      <Input
                        required
                        placeholder="0x..."
                        value={cashoutForm.wallet}
                        onChange={(e) => setCashoutForm(f => ({ ...f, wallet: e.target.value }))}
                      />
                    </div>
                  )}

                  {/* Description */}
                  <div className="space-y-2">
                    <Label>Descrição (opcional)</Label>
                    <Input
                      placeholder="Motivo do saque"
                      value={cashoutForm.description}
                      onChange={(e) => setCashoutForm(f => ({ ...f, description: e.target.value }))}
                    />
                  </div>

                  {/* Result / Error */}
                  {cashoutResult && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
                      <CheckCircle2 className="inline h-4 w-4 mr-2" />
                      {cashoutResult}
                    </div>
                  )}
                  {cashoutError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                      <XCircle className="inline h-4 w-4 mr-2" />
                      {cashoutError}
                    </div>
                  )}

                  <Button type="submit" disabled={cashoutLoading} className="w-full">
                    {cashoutLoading ? (
                      <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Solicitando...</>
                    ) : (
                      <><ArrowDownToLine className="h-4 w-4 mr-2" /> Solicitar Saque</>
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground">
                    Taxa da VexoPay: 2% + R$ 0,50 por transação. Saques INTERNAL não têm taxa.
                  </p>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
