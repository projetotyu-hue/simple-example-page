import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { RefreshCw } from "lucide-react";

async function fetchLogs() {
  const { data, error } = await supabase
    .from("logs").select("*")
    .order("created_at", { ascending: false }).limit(300);
  if (error) throw error;
  return data ?? [];
}

const STATUS_STYLES: Record<string, string> = {
  success: "bg-success/15 text-success",
  denied: "bg-destructive/15 text-destructive",
  error: "bg-destructive/15 text-destructive",
  warning: "bg-warning/15 text-warning",
};

export default function LogsPage() {
  const { data: logs, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["logs"], queryFn: fetchLogs,
  });

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Logs</h1>
          <p className="text-muted-foreground mt-1">Últimos 300 eventos do sistema.</p>
        </div>
        <button onClick={() => refetch()}
          className="h-9 px-3 rounded-md border bg-card text-sm font-medium hover:bg-muted transition-colors flex items-center gap-2">
          <RefreshCw className={`size-3.5 ${isFetching ? "animate-spin" : ""}`} />
          Atualizar
        </button>
      </header>

      <div className="rounded-xl bg-card border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Data</th>
                <th className="text-left px-4 py-3 font-medium">Evento</th>
                <th className="text-left px-4 py-3 font-medium">Usuário</th>
                <th className="text-left px-4 py-3 font-medium">IP</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium">Dispositivo</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">Carregando...</td></tr>
              ) : (logs ?? []).length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">Sem eventos registrados.</td></tr>
              ) : logs!.map((l) => (
                <tr key={l.id} className="border-t hover:bg-muted/30">
                  <td className="px-4 py-3 whitespace-nowrap text-xs text-muted-foreground">
                    {format(new Date(l.created_at), "dd/MM/yy HH:mm:ss", { locale: ptBR })}
                  </td>
                  <td className="px-4 py-3 text-xs font-medium">{l.event_type}</td>
                  <td className="px-4 py-3 text-xs">{l.username ?? "—"}</td>
                  <td className="px-4 py-3 font-mono text-xs">{l.ip ?? "—"}</td>
                  <td className="px-4 py-3">
                    {l.status ? (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wide ${STATUS_STYLES[l.status] ?? "bg-muted text-muted-foreground"}`}>
                        {l.status}
                      </span>
                    ) : "—"}
                  </td>
                  <td className="px-4 py-3 text-xs">{l.device ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
