import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Search, ChevronLeft, ChevronRight, ShoppingCart, ChevronDown, CheckCircle2, XCircle, Clock, Truck, Download, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/admin/pedidos")({
  head: () => ({ meta: [{ title: "Pedidos — Achadinhos Admin" }] }),
  component: PedidosPage,
});

type Order = {
  id: string;
  customer_id: string | null;
  payment_id: string | null;
  status: string | null;
  products_total: number | null;
  shipping_total: number | null;
  total: number | null;
  payment_method: string | null;
  created_at: string;
  customers?: {
    name: string;
    email: string | null;
    cpf: string | null;
    phone: string | null;
  } | null;
  items?: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    image_url: string | null;
  }> | any;
};

function PedidosPage() {
  const [items, setItems] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const perPage = 20;

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);

      try {
        let query = supabase
          .from("orders")
          .select(`
            *,
            customers:customer_id (name, email, cpf)
          `)
          .order("created_at", { ascending: false })
          .range((page - 1) * perPage, page * perPage - 1);

        const { data, error } = await query;

        if (error) {
          setError("Erro ao carregar pedidos: " + error.message);
        } else {
          let filtered = (data || []) as Order[];

          // Filtro de busca
          if (searchTerm) {
            const lower = searchTerm.toLowerCase();
            filtered = filtered.filter(o =>
            o.id.toLowerCase().includes(lower) ||
            o.payment_id?.toLowerCase().includes(lower) ||
            o.customers?.name?.toLowerCase().includes(lower) ||
            o.customers?.email?.toLowerCase().includes(lower) ||
            o.customers?.cpf?.includes(lower)
            );
          }

          // Filtro de status
          if (statusFilter !== "all") {
            filtered = filtered.filter(o => o.status === statusFilter);
          }

          setItems(filtered);
        }
      } catch (err: any) {
        setError(err.message || "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, [searchTerm, statusFilter, page]);

  const formatCurrency = (val: number | null) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);
  };

  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    return `${d.toLocaleDateString('pt-BR')} ${d.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}`;
  };

  const getStatusBadge = (status: string | null) => {
    const s = (status || '').toLowerCase();
    if (s === 'paid' || s === 'pago') return (
      <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium bg-green-50 text-green-700 border border-green-200">
        <CheckCircle2 size={12} /> Pago
      </span>
    );
    if (s === 'pending' || s === 'pendente' || s === 'aguardando pix') return (
      <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium bg-yellow-50 text-yellow-700 border border-yellow-200">
        <Clock size={12} /> Pendente
      </span>
    );
    if (s === 'failed' || s === 'falhou') return (
      <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium bg-red-50 text-red-700 border border-red-200">
        <XCircle size={12} /> Falhou
      </span>
    );
    if (s === 'expired' || s === 'expirado') return (
      <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium bg-gray-100 text-gray-600 border border-gray-200">
        <Clock size={12} /> Expirado
      </span>
    );
    if (s === 'shipped' || s === 'enviado') return (
      <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium bg-blue-50 text-blue-700 border border-blue-200">
        <Truck size={12} /> Enviado
      </span>
    );
    return <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">{status || 'Desconhecido'}</span>;
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Cliente', 'Email', 'CPF', 'Total', 'Status', 'Data'];
    const rows = items.map(o => [
      o.id,
      o.customers?.name || '',
      o.customers?.email || '',
      o.customers?.cpf || '',
      Number(o.total || 0).toFixed(2),
      o.status || '',
      o.created_at
    ]);

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pedidos_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', orderId);

      if (error) throw error;

      setItems(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (err: any) {
      alert('Erro ao atualizar status: ' + err.message);
    }
  };

  return (
    <AdminLayout title="Pedidos">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        {/* Header com stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Total de Pedidos', value: items.length.toString(), color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Pagos', value: items.filter(o => o.status === 'paid').length.toString(), color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Pendentes', value: items.filter(o => o.status === 'pending').length.toString(), color: 'text-yellow-600', bg: 'bg-yellow-50' },
            { label: 'Faturado', value: formatCurrency(items.filter(o => o.status === 'paid').reduce((sum, o) => sum + (o.total || 0), 0)), color: 'text-rose-600', bg: 'bg-rose-50' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`${stat.bg} rounded-xl p-4 border border-gray-100`}
            >
              <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
              <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Barra de ações */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <div className="flex-1 flex items-center gap-2 bg-muted/50 border border-border rounded-lg px-3 py-2">
            <Search className="w-4 h-4 text-muted-foreground shrink-0" />
            <input
              placeholder="Buscar por ID, nome, email ou CPF..."
              className="flex-1 bg-transparent text-sm outline-none text-foreground placeholder:text-muted-foreground"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-sm border border-border rounded-lg px-3 py-2 bg-background outline-none"
            >
              <option value="all">Todos</option>
              <option value="paid">Pagos</option>
              <option value="pending">Pendentes</option>
              <option value="failed">Falhous</option>
              <option value="expired">Expirados</option>
              <option value="shipped">Enviados</option>
            </select>
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center justify-center gap-2 px-4 py-2 border border-border rounded-lg text-sm hover:bg-muted/50 transition-colors"
          >
            <Download size={14} />
            Exportar CSV
          </button>
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Tabela de Pedidos */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          {loading ? (
            <div className="p-12 flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : items.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              <ShoppingCart className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm">Nenhum pedido encontrado.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              {/* Header */}
              <div className="grid grid-cols-[1.5fr_1fr_0.8fr_0.8fr_0.8fr_0.8fr_auto] gap-4 px-5 py-3 border-b border-border bg-muted/50">
                {['PEDIDO / CLIENTE', 'VALOR', 'MÉTODO', 'STATUS', 'DATA', 'AÇÕES', ''].map((h, i) => (
                  <p key={i} className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</p>
                ))}
              </div>

              <AnimatePresence>
                {items.map((o, idx) => (
                  <motion.div
                    key={o.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="border-b border-gray-50 last:border-b-0"
                  >
                    <div className="grid grid-cols-[1.5fr_1fr_0.8fr_0.8fr_0.8fr_0.8fr_auto] gap-4 px-5 py-3.5 items-center hover:bg-muted/20 transition-colors">
                      {/* Pedido + Cliente */}
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground">#{o.id.slice(0, 8)}</p>
                        <p className="text-xs font-medium text-foreground truncate">{o.customers?.name || "Cliente Desconhecido"}</p>
                        <p className="text-xs text-muted-foreground truncate">{o.customers?.email || "—"}</p>
                      </div>

                      {/* Valor */}
                      <div>
                        <p className="text-sm font-semibold text-foreground">{formatCurrency(o.total)}</p>
                        <p className="text-xs text-muted-foreground">{formatCurrency(o.products_total)} produtos</p>
                      </div>

                      {/* Método */}
                      <p className="text-sm text-foreground capitalize">{o.payment_method || '—'}</p>

                      {/* Status */}
                      {getStatusBadge(o.status)}

                      {/* Data */}
                      <p className="text-xs text-muted-foreground">{formatDate(o.created_at)}</p>

                      {/* Ações rápidas */}
                      <div className="flex items-center gap-1">
                        {o.status === 'pending' && (
                          <button
                            onClick={() => handleUpdateStatus(o.id, 'paid')}
                            className="px-2 py-1 text-xs bg-green-50 text-green-700 rounded border border-green-200 hover:bg-green-100 transition-colors"
                          >
                            Marcar Pago
                          </button>
                        )}
                        {o.status === 'paid' && (
                          <button
                            onClick={() => handleUpdateStatus(o.id, 'shipped')}
                            className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded border border-blue-200 hover:bg-blue-100 transition-colors"
                          >
                            Enviar
                          </button>
                        )}
                      </div>

                      {/* Expandir */}
                      <button
                        onClick={() => setExpandedOrder(expandedOrder === o.id ? null : o.id)}
                        className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                      >
                        <motion.div
                          animate={{ rotate: expandedOrder === o.id ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        </motion.div>
                      </button>
                    </div>

                    {/* Detalhes expandidos */}
                    <AnimatePresence>
                      {expandedOrder === o.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-4 bg-muted/10">
                            {/* Dados do cliente */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div className="bg-white rounded-lg p-3 border border-gray-100">
                                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Dados do Cliente</h4>
                                <p className="text-sm text-gray-900">{o.customers?.name}</p>
                                <p className="text-xs text-gray-500">{o.customers?.email}</p>
                                <p className="text-xs text-gray-500">CPF: {o.customers?.cpf || '—'}</p>
                                <p className="text-xs text-gray-500">Tel: {o.customers?.phone || '—'}</p>
                              </div>

                              <div className="bg-white rounded-lg p-3 border border-gray-100">
                                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Dados do Pedido</h4>
                                <p className="text-xs text-gray-500">ID: <span className="text-gray-900 font-mono">{o.id}</span></p>
                                <p className="text-xs text-gray-500">Transação: <span className="text-gray-900 font-mono">{o.payment_id || '—'}</span></p>
                                <p className="text-xs text-gray-500">Frete: {formatCurrency(o.shipping_total)}</p>
                                <p className="text-xs text-gray-500">Subtotal: {formatCurrency(o.products_total)}</p>
                              </div>
                            </div>

                            {/* Itens do pedido */}
                            {o.items && Array.isArray(o.items) && o.items.length > 0 && (
                              <div>
                                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Itens do Pedido</h4>
                                <div className="space-y-2">
                                  {o.items.map((item: any, i: number) => (
                                    <div key={i} className="flex items-center gap-3 bg-white rounded-lg p-3 border border-gray-100">
                                      {item.image_url && (
                                        <img src={item.image_url} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                                      )}
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                                        <p className="text-xs text-gray-500">{formatCurrency(item.price)} x {item.quantity}</p>
                                      </div>
                                      <p className="text-sm font-semibold text-gray-900">
                                        {formatCurrency(item.price * item.quantity)}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Paginação */}
        <div className="flex items-center justify-center gap-1">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm text-foreground font-medium px-3">{page}</span>
          <button
            onClick={() => setPage(p => p + 1)}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AdminLayout>
  );
}
