import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { RefreshCw } from "lucide-react";

async function fetchMetrics() {
  const { data, error } = await supabase
    .from("metrics").select("*")
    .order("created_at", { ascending: false }).limit(200);
  if (error) throw error;
  return data ?? [];
}

export default function MetricsPage() {
  const { data: metrics, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["metrics"], queryFn: fetchMetrics,
  });

  const byCountry = (metrics ?? []).reduce<Record<string, number>>((acc, m) => {
    const k = m.country ?? "Desconhecido"; acc[k] = (acc[k] ?? 0) + 1; return acc;
  }, {});
  const byDevice = (metrics ?? []).reduce<Record<string, number>>((acc, m) => {
    const k = m.device ?? "Desconhecido"; acc[k] = (acc[k] ?? 0) + 1; return acc;
  }, {});

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Métricas</h1>
          <p className="text-muted-foreground mt-1">Últimas 200 visitas registradas.</p>
        </div>
        <button onClick={() => refetch()}
          className="h-9 px-3 rounded-md border bg-card text-sm font-medium hover:bg-muted transition-colors flex items-center gap-2">
          <RefreshCw className={`size-3.5 ${isFetching ? "animate-spin" : ""}`} />
          Atualizar
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Breakdown title="Por país" data={byCountry} />
        <Breakdown title="Por dispositivo" data={byDevice} />
      </div>

      <div className="rounded-xl bg-card border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Data</th>
                <th className="text-left px-4 py-3 font-medium">IP</th>
                <th className="text-left px-4 py-3 font-medium">Local</th>
                <th className="text-left px-4 py-3 font-medium">Dispositivo</th>
                <th className="text-left px-4 py-3 font-medium">SO</th>
                <th className="text-left px-4 py-3 font-medium">Navegador</th>
                <th className="text-left px-4 py-3 font-medium">Origem</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">Carregando...</td></tr>
              ) : (metrics ?? []).length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">Sem registros ainda.</td></tr>
              ) : metrics!.map((m) => (
                <tr key={m.id} className="border-t hover:bg-muted/30">
                  <td className="px-4 py-3 whitespace-nowrap text-xs text-muted-foreground">
                    {format(new Date(m.created_at), "dd/MM/yy HH:mm", { locale: ptBR })}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">{m.ip ?? "—"}</td>
                  <td className="px-4 py-3 text-xs">{[m.city, m.state, m.country].filter(Boolean).join(", ") || "—"}</td>
                  <td className="px-4 py-3 text-xs">{m.device ?? "—"}</td>
                  <td className="px-4 py-3 text-xs">{m.os ?? "—"}</td>
                  <td className="px-4 py-3 text-xs">{m.browser ?? "—"}</td>
                  <td className="px-4 py-3 text-xs truncate max-w-[200px]">{m.origin ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Breakdown({ title, data }: { title: string; data: Record<string, number> }) {
  const total = Object.values(data).reduce((a, b) => a + b, 0);
  const entries = Object.entries(data).sort(([, a], [, b]) => b - a).slice(0, 5);
  return (
    <div className="p-5 rounded-xl bg-card border">
      <h3 className="text-sm font-semibold mb-4">{title}</h3>
      {entries.length === 0 ? <p className="text-xs text-muted-foreground">Sem dados.</p> : (
        <div className="space-y-3">
          {entries.map(([k, v]) => {
            const pct = total > 0 ? (v / total) * 100 : 0;
            return (
              <div key={k}>
                <div className="flex justify-between text-xs mb-1">
                  <span>{k}</span>
                  <span className="text-muted-foreground tabular-nums">{v} ({pct.toFixed(0)}%)</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
