import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Activity, Users, Globe, ScrollText } from "lucide-react";

async function fetchOverview() {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const [m, m24, l, ips] = await Promise.all([
    supabase.from("metrics").select("id", { count: "exact", head: true }),
    supabase.from("metrics").select("id", { count: "exact", head: true }).gte("created_at", since),
    supabase.from("logs").select("id", { count: "exact", head: true }),
    supabase.from("metrics").select("ip").not("ip", "is", null).limit(1000),
  ]);
  return {
    totalVisits: m.count ?? 0,
    visits24h: m24.count ?? 0,
    totalLogs: l.count ?? 0,
    uniqueIps: new Set((ips.data ?? []).map((r) => r.ip)).size,
  };
}

export default function DashboardPage() {
  const { data, isLoading } = useQuery({ queryKey: ["overview"], queryFn: fetchOverview });

  const stats = [
    { label: "Visitas totais", value: data?.totalVisits ?? 0, icon: Activity, color: "text-primary" },
    { label: "Visitas (24h)", value: data?.visits24h ?? 0, icon: Globe, color: "text-accent" },
    { label: "IPs únicos", value: data?.uniqueIps ?? 0, icon: Users, color: "text-success" },
    { label: "Eventos de log", value: data?.totalLogs ?? 0, icon: ScrollText, color: "text-warning" },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Visão geral em tempo real do sistema.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="p-5 rounded-xl bg-card border hover:border-primary/40 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">{s.label}</span>
              <s.icon className={`size-4 ${s.color}`} />
            </div>
            <div className="text-3xl font-bold tabular-nums">
              {isLoading ? "—" : s.value.toLocaleString("pt-BR")}
            </div>
          </div>
        ))}
      </div>

      <div className="p-6 rounded-xl bg-card border">
        <h2 className="text-lg font-semibold mb-2">Como começar</h2>
        <p className="text-sm text-muted-foreground mb-4">
          O banco está vazio. Insira eventos pelo Lovable Cloud ou via uma rota de tracking pública (a criar).
        </p>
      </div>
    </div>
  );
}
