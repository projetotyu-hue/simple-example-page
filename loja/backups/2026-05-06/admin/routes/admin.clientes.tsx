import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Users, Search, ChevronLeft, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/admin/clientes")({
  head: () => ({ meta: [{ title: "Clientes — Achadinhos Admin" }] }),
  component: ClientesPage,
});

type Customer = {
  id: string;
  name: string;
  email: string | null;
  cpf: string | null;
  orders_count: number | null;
  created_at: string;
};

function ClientesPage() {
  const [items, setItems] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      
      let query = supabase.from("customers").select("*").order("created_at", { ascending: false });
      
      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,cpf.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) {
        if (error.code !== "42P01") { // Ignore if table doesn't exist yet
          setError("Erro ao carregar clientes.");
        }
      } else {
        setItems(data ?? []);
      }
      setLoading(false);
    }
    
    // Simple debounce
    const timeoutId = setTimeout(() => {
      void load();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('pt-BR');
  };

  return (
    <AdminLayout title="Clientes">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">{items.length} clientes</p>
      </div>

      <div className="flex items-center gap-2 bg-muted/50 border border-border rounded-lg px-3 py-2 mb-4">
        <Search className="w-4 h-4 text-muted-foreground shrink-0" />
        <input 
          placeholder="Buscar por nome, email ou CPF..." 
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
            <Users className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm">Nenhum cliente encontrado.</p>
          </div>
        ) : (
          <div>
            {items.map((c) => (
              <div key={c.id} className="flex items-center gap-4 px-5 py-3.5 border-b border-gray-50 last:border-b-0">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-xs font-semibold text-primary">
                    {c.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{c.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {c.email || 'Sem e-mail'} {c.cpf ? `· ${c.cpf}` : ''}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-muted-foreground">{c.orders_count || 0} pedido(s)</p>
                  <p className="text-xs text-muted-foreground">{formatDate(c.created_at)}</p>
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
