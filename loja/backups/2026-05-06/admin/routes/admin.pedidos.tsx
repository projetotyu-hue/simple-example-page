import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Search, ChevronLeft, ChevronRight, ShoppingCart, ChevronDown } from "lucide-react";

export const Route = createFileRoute("/admin/pedidos")({
  head: () => ({ meta: [{ title: "Pedidos — Achadinhos Admin" }] }),
  component: PedidosPage,
});

type Order = {
  id: string;
  customer_id: string | null;
  products_total: number | null;
  shipping_total: number | null;
  discount_total: number | null;
  total: number | null;
  status: string | null;
  created_at: string;
  customers?: {
    name: string;
    email: string | null;
  } | null;
};

function PedidosPage() {
  const [items, setItems] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      
      // Need to join with customers table to display name/email
      let query = supabase
        .from("orders")
        .select(`
          *,
          customers(name, email)
        `)
        .order("created_at", { ascending: false });

      const { data, error } = await query;
      if (error) {
        if (error.code !== "42P01") { // Ignore if table doesn't exist yet
          setError("Erro ao carregar pedidos.");
        }
      } else {
        // Local filtering since Supabase nested OR filters can be tricky without RPC
        let filtered = data as Order[];
        if (searchTerm) {
          const lower = searchTerm.toLowerCase();
          filtered = filtered.filter(o => 
            o.id.toLowerCase().includes(lower) || 
            o.customers?.name?.toLowerCase().includes(lower) ||
            o.customers?.email?.toLowerCase().includes(lower)
          );
        }
        setItems(filtered);
      }
      setLoading(false);
    }
    
    const timeoutId = setTimeout(() => {
      void load();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const formatCurrency = (val: number | null) => {
    return `R$ ${Number(val || 0).toFixed(2).replace('.', ',')}`;
  };

  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    return `${d.toLocaleDateString('pt-BR')}, ${d.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}`;
  };

  const getStatusBadge = (status: string | null) => {
    if (status === 'Pago') return <span className="text-xs px-2 py-1 rounded-full font-medium w-fit text-green-600 bg-green-50">{status}</span>;
    if (status === 'Aguardando Pix') return <span className="text-xs px-2 py-1 rounded-full font-medium w-fit text-blue-600 bg-blue-50">{status}</span>;
    if (status === 'Pendente') return <span className="text-xs px-2 py-1 rounded-full font-medium w-fit text-yellow-600 bg-yellow-50">{status}</span>;
    return <span className="text-xs px-2 py-1 rounded-full font-medium w-fit text-foreground bg-muted">{status || 'Desconhecido'}</span>;
  };

  return (
    <AdminLayout title="Pedidos">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">{items.length} pedidos</p>
      </div>

      <div className="flex items-center gap-2 bg-muted/50 border border-border rounded-lg px-3 py-2 mb-4">
        <Search className="w-4 h-4 text-muted-foreground shrink-0" />
        <input 
          placeholder="Buscar por ID, nome ou email..." 
          className="flex-1 bg-transparent text-sm outline-none text-foreground placeholder-gray-400" 
          type="text" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

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
          <div>
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3 border-b border-border bg-muted/50">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">ID / CLIENTE</p>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">PRODUTOS</p>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">FRETE</p>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">DESCONTO</p>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">TOTAL</p>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">PAGAMENTO</p>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">AÇÕES</p>
            </div>
            
            {items.map((o) => (
              <div key={o.id} className="border-b border-gray-50 last:border-b-0">
                <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3.5 items-center">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-semibold text-foreground">#{o.id.slice(0, 8)}</p>
                    </div>
                    <p className="text-xs font-medium text-foreground truncate">{o.customers?.name || "Cliente Desconhecido"}</p>
                    <p className="text-xs text-muted-foreground truncate">{o.customers?.email || "—"}</p>
                  </div>
                  <p className="text-sm text-foreground">{formatCurrency(o.products_total)}</p>
                  <p className="text-sm text-foreground">{formatCurrency(o.shipping_total)}</p>
                  <p className="text-sm text-foreground">{formatCurrency(o.discount_total)}</p>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{formatCurrency(o.total)}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(o.created_at)}</p>
                  </div>
                  {getStatusBadge(o.status)}
                  <button className="flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors shrink-0">
                    <ChevronDown className="w-3 h-3" /> Ver itens
                  </button>
                </div>
              </div>
            ))}
            
            <div className="flex items-center justify-center gap-1 mt-4 mb-4">
              <button disabled className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="w-8 h-8 rounded-lg text-sm transition-colors bg-primary text-white font-medium">1</button>
              <button disabled className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
