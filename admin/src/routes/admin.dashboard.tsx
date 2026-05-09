import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts";
import {
  DollarSign,
  ShoppingCart,
  TrendingUp,
  AlertTriangle,
  Package,
  Loader2,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Inbox,
  ChevronRight,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Ghostshield Admin" }] }),
  ssr: false,
  component: DashboardPage,
});

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type RevenuePeriod = "daily" | "weekly" | "monthly";

type RevenueDataPoint = {
  date: string;
  revenue: number;
  count: number;
};

type ConversionData = {
  totalVisitors: number;
  totalCarts: number;
  totalPurchases: number;
  conversionRate: number;
  abandonmentRate: number;
};

type TopProduct = {
  product_id: string;
  product_name: string;
  quantity_sold: number;
  revenue: number;
};

type KpiData = {
  totalSales: number;
  totalRevenue: number;
  conversionRate: number;
  abandonmentRate: number;
};

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const CHART_THEME_COLORS = {
  light: { stroke: "#6366f1", fill: "#6366f1", fillOpacity: 0.15 },
  dark: { stroke: "#818cf8", fill: "#818cf8", fillOpacity: 0.2 },
};

const FUNNEL_STEPS = [
  { key: "code_generated", label: "Código Gerado", color: "bg-blue-500" },
  { key: "payments_completed", label: "Pagamento Concluído", color: "bg-emerald-500" },
];

// ---------------------------------------------------------------------------
// Helper: format currency (BRL)
// ---------------------------------------------------------------------------

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(value);
}

function formatShortCurrency(value: number): string {
  if (value >= 1_000_000) return `R$ ${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `R$ ${(value / 1_000).toFixed(1)}k`;
  return formatCurrency(value);
}

// ---------------------------------------------------------------------------
// Skeleton Components
// ---------------------------------------------------------------------------

function KpiCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="h-4 w-24 rounded bg-muted animate-pulse" />
        <div className="h-4 w-4 rounded bg-muted animate-pulse" />
      </CardHeader>
      <CardContent>
        <div className="h-8 w-32 rounded bg-muted animate-pulse mb-1" />
        <div className="h-3 w-40 rounded bg-muted animate-pulse" />
      </CardContent>
    </Card>
  );
}

function ChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="h-5 w-48 rounded bg-muted animate-pulse" />
        <div className="h-4 w-64 rounded bg-muted animate-pulse" />
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full rounded bg-muted animate-pulse" />
      </CardContent>
    </Card>
  );
}

function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <Card>
      <CardHeader>
        <div className="h-5 w-40 rounded bg-muted animate-pulse" />
        <div className="h-4 w-56 rounded bg-muted animate-pulse" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {Array.from({ length: rows }).map((_, i) => (
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
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Empty State
// ---------------------------------------------------------------------------

function EmptyState({ message = "Nenhum dado ainda", icon: Icon = Inbox }: { message?: string; icon?: React.ElementType }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Icon className="h-12 w-12 text-muted-foreground/40 mb-4" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// KPI Card
// ---------------------------------------------------------------------------

function KpiCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  loading,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ElementType;
  trend?: { value: number; label: string };
  loading: boolean;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <>
            <div className="h-8 w-32 rounded bg-muted animate-pulse mb-1" />
            <div className="h-3 w-40 rounded bg-muted animate-pulse" />
          </>
        ) : (
          <>
            <div className="text-2xl font-bold">{value}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              {trend && (
                <span
                  className={cn(
                    "inline-flex items-center gap-0.5",
                    trend.value >= 0 ? "text-emerald-600" : "text-red-600"
                  )}
                >
                  {trend.value >= 0 ? (
                    <ArrowUpRight className="h-3 w-3" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3" />
                  )}
                  {Math.abs(trend.value)}%
                </span>
              )}
              <span>{subtitle}</span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Revenue Chart
// ---------------------------------------------------------------------------

function RevenueChart({
  data,
  loading,
  period,
  onPeriodChange,
}: {
  data: RevenueDataPoint[];
  loading: boolean;
  period: RevenuePeriod;
  onPeriodChange: (p: RevenuePeriod) => void;
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const colors = isDark ? CHART_THEME_COLORS.dark : CHART_THEME_COLORS.light;

  const chartConfig = useMemo(
    () => ({
      revenue: { label: "Faturamento", color: colors.stroke },
      count: { label: "Vendas", color: "#a855f7" },
    }),
    [colors.stroke]
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <CardTitle>Faturamento por Período</CardTitle>
            <CardDescription>Receita e volume de vendas ao longo do tempo</CardDescription>
          </div>
          <Tabs value={period} onValueChange={(v) => onPeriodChange(v as RevenuePeriod)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="daily">Diário</TabsTrigger>
              <TabsTrigger value="weekly">Semanal</TabsTrigger>
              <TabsTrigger value="monthly">Mensal</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-[300px] w-full rounded bg-muted animate-pulse" />
        ) : data.length === 0 ? (
          <EmptyState message="Nenhum dado de faturamento ainda" />
        ) : (
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors.fill} stopOpacity={colors.fillOpacity * 4} />
                  <stop offset="95%" stopColor={colors.fill} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                className="text-xs text-muted-foreground"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v)}
                className="text-xs text-muted-foreground"
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, name) => [
                      name === "revenue" ? formatCurrency(Number(value)) : `${value} vendas`,
                      name === "revenue" ? "Faturamento" : "Vendas",
                    ]}
                  />
                }
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke={colors.stroke}
                strokeWidth={2}
                fill="url(#revenueGradient)"
                name="revenue"
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Conversion Funnel
// ---------------------------------------------------------------------------

function ConversionFunnel({
  data,
  loading,
}: {
  data: ConversionData | null;
  loading: boolean;
}) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-5 w-40 rounded bg-muted animate-pulse" />
          <div className="h-4 w-56 rounded bg-muted animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between">
                  <div className="h-4 w-32 rounded bg-muted animate-pulse" />
                  <div className="h-4 w-16 rounded bg-muted animate-pulse" />
                </div>
                <div className="h-3 w-full rounded bg-muted animate-pulse" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Funil de Conversão</CardTitle>
          <CardDescription>Jornada do cliente até o pagamento</CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState message="Nenhum dado ainda" />
        </CardContent>
      </Card>
    );
  }

  const { totalVisitors, totalPurchases, conversionRate } = data;
  const abandonmentRate = 100 - (conversionRate || 0);

  const steps = [
    {
      label: "Visitantes",
      value: totalVisitors,
      color: "bg-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-950/30",
      textColor: "text-blue-700 dark:text-blue-300",
    },
    {
      label: "Pagamento Concluído",
      value: totalPurchases,
      color: "bg-emerald-500",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
      textColor: "text-emerald-700 dark:text-emerald-300",
    },
  ];

  const maxValue = Math.max(totalVisitors, totalPurchases, 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Funil de Conversão</CardTitle>
        <CardDescription>Jornada do cliente até o pagamento</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {steps.map((step, idx) => {
            const widthPercent = (step.value / maxValue) * 100;
            const prevValue = idx > 0 ? steps[idx - 1].value : step.value;
            const dropPercent = prevValue > 0 ? ((prevValue - step.value) / prevValue) * 100 : 0;

            return (
              <div key={step.label} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={cn("h-2.5 w-2.5 rounded-full", step.color)} />
                    <span className="text-sm font-medium">{step.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {idx > 0 && dropPercent > 0 && (
                      <span className="text-xs text-red-500 flex items-center gap-0.5">
                        <ArrowDownRight className="h-3 w-3" />
                        {dropPercent.toFixed(1)}%
                      </span>
                    )}
                    <span className={cn("text-sm font-semibold", step.textColor)}>
                      {(step.value ?? 0).toLocaleString("pt-BR")}
                    </span>
                  </div>
                </div>
                <div className="h-3 w-full rounded-full bg-muted/50 overflow-hidden">
                  <div
                    className={cn("h-full rounded-full transition-all duration-500", step.color)}
                    style={{ width: `${Math.max(widthPercent, 2)}%` }}
                  />
                </div>
              </div>
            );
          })}

          <div className="pt-4 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Taxa de Conversão</span>
              <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                {(conversionRate ?? 0).toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-sm text-muted-foreground">Taxa de Abandono</span>
              <span className="text-sm font-semibold text-red-500">
                {(abandonmentRate ?? 0).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Top Products Table
// ---------------------------------------------------------------------------

function TopProductsTable({
  products,
  loading,
}: {
  products: TopProduct[];
  loading: boolean;
}) {
  if (loading) {
    return <TableSkeleton rows={5} />;
  }

  if (products.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Produtos Mais Vendidos</CardTitle>
          <CardDescription>Ranking por volume de vendas e receita</CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState message="Nenhum produto vendido ainda" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Produtos Mais Vendidos</CardTitle>
        <CardDescription>Ranking por volume de vendas e receita</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {products.map((product, idx) => (
            <div
              key={product.product_id}
              className="flex items-center gap-4 py-3 px-2 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                {idx + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{product.product_name}</p>
                <p className="text-xs text-muted-foreground">
                  {product.quantity_sold} {product.quantity_sold === 1 ? "unidade" : "unidades"} vendidas
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">{formatCurrency(product.revenue)}</p>
                <p className="text-xs text-muted-foreground">
                  {formatCurrency(product.revenue / product.quantity_sold)} / un
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Recent Activity (real data)
// ---------------------------------------------------------------------------

function RecentActivity({ loading, activities }: { loading: boolean; activities: typeof activities }) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'payment': return <DollarSign className="h-4 w-4 text-green-600" />
      case 'sale': return <TrendingUp className="h-4 w-4 text-blue-600" />
      case 'order': return <ShoppingCart className="h-4 w-4 text-rose-600" />
      default: return <Inbox className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Atividade Recente</CardTitle>
        <CardDescription>Últimas operações no sistema</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
                <div className="flex-1 space-y-1">
                  <div className="h-4 w-1/2 rounded bg-muted animate-pulse" />
                  <div className="h-3 w-1/3 rounded bg-muted animate-pulse" />
                </div>
                <div className="h-3 w-16 rounded bg-muted animate-pulse" />
              </div>
            ))}
          </div>
        ) : activities.length === 0 ? (
          <EmptyState message="Nenhuma atividade recente" icon={BarChart3} />
        ) : (
          <div className="space-y-3">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded-lg transition-colors">
                <div className="h-8 w-8 rounded-full bg-muted/50 flex items-center justify-center">
                  {getIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{activity.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{activity.description}</p>
                </div>
                <div className="text-xs text-muted-foreground text-right shrink-0">
                  {activity.time}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Main Dashboard Page
// ---------------------------------------------------------------------------

const DashboardPage = () => {
  const { theme } = useTheme();

  // -- State --
  const [loading, setLoading] = useState(true);
  const [kpi, setKpi] = useState<KpiData | null>(null);
  const [revenueData, setRevenueData] = useState<RevenueDataPoint[]>([]);
  const [revenueLoading, setRevenueLoading] = useState(true);
  const [revenuePeriod, setRevenuePeriod] = useState<RevenuePeriod>("daily");
  const [conversionData, setConversionData] = useState<ConversionData | null>(null);
  const [conversionLoading, setConversionLoading] = useState(true);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [topProductsLoading, setTopProductsLoading] = useState(true);
  const [activityLoading, setActivityLoading] = useState(true);

  // -- VexoPay State --
  const [vexoLoading, setVexoLoading] = useState(true);
  const [vexoBalance, setVexoBalance] = useState<{
    balance: number;
    totalReceived: number;
    totalWithdrawn: number;
    totalFees: number;
    transactionCount: number;
  } | null>(null);
  const [vexoDashboard, setVexoDashboard] = useState<{
    totalTransactions: number;
    totalAmount: number;
    byStatus: Record<string, number>;
  } | null>(null);

  // -- Activity State --
  const [activities, setActivities] = useState<Array<{
    id: string;
    type: 'payment' | 'sale' | 'product' | 'order';
    title: string;
    description: string;
    time: string;
    amount?: number;
  }>>([]);

  // -- Date range: last 30 days --
  const dateRange = useMemo(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    return {
      start: start.toISOString().split("T")[0],
      end: end.toISOString().split("T")[0],
    };
  }, []);

  // -- Helpers for RPC error handling --
  const isRpcError = (err: unknown): boolean => {
    if (typeof err === "object" && err !== null) {
      const e = err as { code?: string; message?: string };
      return e.code === "404" || e.code === "PGRST202" || (e.message ?? "").includes("does not exist");
    }
    return false;
  };

  // -- Fetch KPIs (real data) --
  const fetchKpis = useCallback(async (signal?: AbortSignal) => {
    try {
      // VexoPay: total faturamento e vendas
      let totalRevenue = 0
      let totalSales = 0
      try {
        const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
        const dashRes = await fetch(
          `${backendUrl}/api/payments/dashboard`,
          { headers: { "Authorization": `Bearer ${localStorage.getItem("auth_token") || "vexopay-secret-token-123"}` } }
        )
        if (dashRes.ok) {
          const dash = await dashRes.json().then((d: any) => d.success ? d.data : d)
          totalRevenue = dash.totalAmount || 0
          totalSales = dash.totalTransactions || 0
        }
      } catch { /* VexoPay offline */ }

      // Supabase: pedidos (customers + orders)
      let abandonmentRate = 0
      try {
        const { count: customerCount } = await supabase
          .from("customers")
          .select("*", { count: "exact", head: true })
        const { count: orderCount } = await supabase
          .from("orders")
          .select("*", { count: "exact", head: true })
          .eq("status", "paid")
        if (customerCount && customerCount > 0) {
          abandonmentRate = Math.round(((customerCount - (orderCount || 0)) / customerCount) * 100)
        }
      } catch { abandonmentRate = 0 }

      if (!signal?.aborted) {
        setKpi({ totalSales, totalRevenue, conversionRate: 0, abandonmentRate })
      }
    } catch (err) {
      console.error("Error fetching KPIs:", err)
    }
  }, [dateRange])

  // -- Fetch Revenue Chart Data (real VexoPay data) --
  const fetchRevenue = useCallback(async (period: RevenuePeriod, signal?: AbortSignal) => {
    setRevenueLoading(true)
    try {
      // Busca todas as transações da VexoPay
      const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
      const res = await fetch(
        `${backendUrl}/api/payments/transactions?limit=1000`,
        { headers: { "Authorization": `Bearer ${localStorage.getItem("auth_token") || "vexopay-secret-token-123"}` } }
      )
      let txs: Array<{ amount: number; createdAt: string; status: string }> = []
      if (res.ok) {
        const d = await res.json()
        // API retorna: { success: true, data: [...] }
        txs = (d.success && Array.isArray(d.data)) ? d.data : (Array.isArray(d.data?.transactions) ? d.data.transactions : [])
      }

      // Filtra apenas pagas e agrupa por período
      const paid = txs.filter(t => t.status === 'paid')
      const groups: Record<string, { revenue: number; count: number }> = {}

      paid.forEach(t => {
        const d = new Date((t.createdAt || '').replace(' ', 'T') || Date.now())
        let key = ''
        if (period === 'daily') {
          key = d.toISOString().slice(0, 10) // YYYY-MM-DD
        } else if (period === 'weekly') {
          const start = new Date(d)
          start.setDate(d.getDate() - d.getDay())
          key = start.toISOString().slice(0, 10)
        } else {
          key = d.toISOString().slice(0, 7) // YYYY-MM
        }
        if (!groups[key]) groups[key] = { revenue: 0, count: 0 }
        groups[key].revenue += Number(t.amount)
        groups[key].count += 1
      })

      const data = Object.entries(groups)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, v]) => ({ date, revenue: v.revenue, count: v.count }))

      if (!signal?.aborted) setRevenueData(data)
    } catch (err) {
      console.error("Error fetching revenue:", err)
      if (!signal?.aborted) setRevenueData([])
    } finally {
      if (!signal?.aborted) setRevenueLoading(false)
    }
  }, [revenuePeriod])

  // -- Fetch Conversion Data (real Supabase) --
  const fetchConversion = useCallback(async (signal?: AbortSignal) => {
    setConversionLoading(true);
    try {
      // Busca customers (visitas simuladas) vs pedidos pagos
      const { count: customerCount } = await supabase
        .from("customers")
        .select("*", { count: "exact", head: true });

      const { count: paidOrders } = await supabase
        .from("orders")
        .select("*", { count: "exact", head: true })
        .eq("status", "paid");

      const { count: totalOrders } = await supabase
        .from("orders")
        .select("*", { count: "exact", head: true });

      const conversionRate = customerCount && customerCount > 0
        ? Math.round((paidOrders || 0) / customerCount * 100)
        : 0;

      const abandonmentRate = totalOrders && totalOrders > 0
        ? Math.round(((totalOrders - (paidOrders || 0)) / totalOrders) * 100)
        : 0;

      if (!signal?.aborted) {
        setConversionData({
          totalVisitors: customerCount || 0,
          totalCarts: totalOrders || 0,
          totalPurchases: paidOrders || 0,
          conversionRate,
          abandonmentRate,
        });
      }
    } catch (err) {
      console.error("Error fetching conversion:", err);
      if (!signal?.aborted) setConversionData(null);
    } finally {
      if (!signal?.aborted) setConversionLoading(false);
    }
  }, [dateRange]);

  // -- Fetch Top Products (real Supabase) --
  const fetchTopProducts = useCallback(async (signal?: AbortSignal) => {
    setTopProductsLoading(true);
    try {
      // Busca produtos com contagem de pedidos
      const { data: products, error } = await supabase
        .from("products")
        .select(`
          id,
          name,
          price,
          order_items:order_items(count)
        `)
        .limit(5);

      if (error) throw error;

      const top = (products ?? []).map((p: any) => ({
        product_id: p.id,
        product_name: p.name || "Produto",
        quantity_sold: p.order_items?.[0]?.count || 0,
        revenue: (p.price || 0) * (p.order_items?.[0]?.count || 0),
      })).sort((a, b) => b.quantity_sold - a.quantity_sold);

      if (!signal?.aborted) setTopProducts(top);
    } catch (err) {
      console.error("Error fetching top products:", err);
      if (!signal?.aborted) setTopProducts([]);
    } finally {
      if (!signal?.aborted) setTopProductsLoading(false);
    }
  }, [dateRange]);

  // -- Fetch Recent Activity (real data) --
  const fetchActivity = useCallback(async (signal?: AbortSignal) => {
    setActivityLoading(true)
    try {
      const activities: Array<{
        id: string;
        type: 'payment' | 'sale' | 'product' | 'order';
        title: string;
        description: string;
        time: string;
        amount?: number;
      }> = []

      const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

      // 1. VexoPay transactions (payments)
      try {
        const res = await fetch(
          `${backendUrl}/api/payments/transactions?limit=10`,
          { headers: { "Authorization": `Bearer ${localStorage.getItem("auth_token") || "vexopay-secret-token-123"}` } }
        )
        if (res.ok) {
          const d = await res.json()
          // API retorna: { success: true, data: [...] }
          const txs = (d.success && Array.isArray(d.data)) ? d.data : (Array.isArray(d.data?.transactions) ? d.data.transactions : [])
          txs.forEach((t: any) => {
            activities.push({
              id: t.transactionId || t.id,
              type: 'payment',
              title: `PIX ${t.status === 'paid' ? 'Pago' : 'Pendente'}: ${t.payerName || 'N/A'}`,
              description: `R$ ${(Number(t.amount) || 0).toFixed(2)} • ${t.description || 'Sem descrição'}`,
              time: t.createdAt ? new Date(t.createdAt.replace(' ', 'T')).toLocaleString('pt-BR') : 'Data inválida',
              amount: Number(t.amount),
            })
          })
        }
      } catch { /* VexoPay offline */ }

      // 2. Supabase recent orders
      try {
        const { data: orders } = await supabase
          .from("orders")
          .select("id, status, total, created_at, customers(name)")
          .order("created_at", { ascending: false })
          .limit(10)

        (orders || []).forEach((o: any) => {
          activities.push({
            id: `order-${o.id}`,
            type: 'order',
            title: `Pedido #${o.id} — ${o.status}`,
            description: `${o.customers?.name || 'Cliente'} • R$ ${(o.total || 0).toFixed(2)}`,
            time: o.created_at ? new Date(o.created_at).toLocaleString('pt-BR') : 'Data inválida',
          })
        })
      } catch { /* Supabase offline */ }

      // Sort by most recent
      activities.sort((a, b) => {
        const ta = new Date(b.time.split(' ')[0].split('/').reverse().join('-') + ' ' + b.time.split(' ')[1]).getTime()
        const tb = new Date(a.time.split(' ')[0].split('/').reverse().join('-') + ' ' + a.time.split(' ')[1]).getTime()
        return ta - tb
      })

      if (!signal?.aborted) setActivities(activities.slice(0, 10))
    } catch (err) {
      console.error("Error fetching activity:", err)
    } finally {
      if (!signal?.aborted) setActivityLoading(false)
    }
  }, [dateRange]);

  // -- Initial data fetch --
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    setLoading(true);

    Promise.all([
      fetchKpis(signal),
      fetchRevenue(revenuePeriod, signal),
      fetchConversion(signal),
      fetchTopProducts(signal),
      fetchActivity(signal),
    ]).finally(() => {
      if (!signal.aborted) {
        setLoading(false);
        setActivityLoading(false);
      }
    });

    // VexoPay data
    const fetchVexo = async () => {
      try {
        setVexoLoading(true);
        const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
        const [balRes, dashRes] = await Promise.all([
          fetch(`${backendUrl}/api/payments/balance`, {
            headers: { "Authorization": `Bearer ${localStorage.getItem("auth_token") || "vexopay-secret-token-123"}` }
          }),
          fetch(`${backendUrl}/api/payments/dashboard`, {
            headers: { "Authorization": `Bearer ${localStorage.getItem("auth_token") || "vexopay-secret-token-123"}` }
          }),
        ]);
        if (balRes.ok) setVexoBalance(await balRes.json().then((d: any) => d.success ? d.data : d));
        if (dashRes.ok) setVexoDashboard(await dashRes.json().then((d: any) => d.success ? d.data : d));
      } catch (err) {
        console.error("Erro VexoPay:", err);
      } finally {
        setVexoLoading(false);
      }
    };
    fetchVexo();

    return () => {
      controller.abort();
    };
  }, [fetchKpis, fetchRevenue, fetchConversion, fetchTopProducts, revenuePeriod]);

  // Re-fetch revenue when period changes
  useEffect(() => {
    const controller = new AbortController();
    fetchRevenue(revenuePeriod, controller.signal);
    return () => controller.abort();
  }, [revenuePeriod, fetchRevenue]);

  // -- KPI cards data --
  const kpiCards = useMemo(() => {
    if (!kpi) return [];
    return [
      {
        title: "Total de Vendas",
        value: (kpi.totalSales ?? 0).toLocaleString("pt-BR"),
        subtitle: "pedidos concluídos",
        icon: ShoppingCart,
      },
      {
        title: "Faturamento Total",
        value: formatCurrency(kpi.totalRevenue),
        subtitle: "receita bruta",
        icon: DollarSign,
      },
      {
        title: "Taxa de Conversão",
        value: `${(kpi.conversionRate ?? 0).toFixed(1)}%`,
        subtitle: "códigos gerados → vendas",
        icon: TrendingUp,
      },
      {
        title: "Taxa de Abandono",
        value: `${(kpi.abandonmentRate ?? 0).toFixed(1)}%`,
        subtitle: "abandono no funil",
        icon: AlertTriangle,
      },
    ];
  }, [kpi]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <AdminLayout title="Dashboard">
      <motion.div
        className="flex flex-col gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-sm text-muted-foreground">Visão geral do seu negócio</p>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="outline" size="sm" asChild>
              <a href="/admin/vexopay">Ver VexoPay →</a>
            </Button>
          </motion.div>
        </motion.div>

        {/* KPI Cards */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4"
        >
          {loading || !kpi
            ? Array.from({ length: 5 }).map((_, i) => <KpiCardSkeleton key={i} />)
            : (
              <>
                {kpiCards.map((card, idx) => (
                  <motion.div key={card.title} variants={cardVariants} custom={idx} whileHover={{ y: -4, transition: { duration: 0.2 } }}>
                    <KpiCard
                      title={card.title}
                      value={card.value}
                      subtitle={card.subtitle}
                      icon={card.icon}
                      loading={false}
                    />
                  </motion.div>
                ))}
                {/* VexoPay Saldo */}
                {vexoLoading || !vexoBalance ? (
                  <KpiCardSkeleton />
                ) : (
                  <motion.div variants={cardVariants} whileHover={{ y: -4, transition: { duration: 0.2 } }}>
                    <KpiCard
                      title="Saldo VexoPay"
                      value={formatCurrency(vexoBalance.balance)}
                      subtitle={`${vexoBalance.transactionCount} transações`}
                      icon={Wallet}
                      loading={false}
                    />
                  </motion.div>
                )}
              </>
            )}
        </motion.div>

        {/* Revenue Chart - destaque */}
        <motion.div variants={itemVariants} whileHover={{ boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }} className="bg-card border rounded-xl p-4 shadow-sm transition-shadow duration-300">
          <RevenueChart
            data={revenueData}
            loading={revenueLoading}
            period={revenuePeriod}
            onPeriodChange={setRevenuePeriod}
          />
        </motion.div>

        {/* Two-column: Funnel + Top Products */}
        <motion.div variants={containerVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <motion.div variants={itemVariants} whileHover={{ y: -2 }} className="bg-card border rounded-xl p-4 shadow-sm transition-all duration-300">
            <ConversionFunnel data={conversionData} loading={conversionLoading} />
          </motion.div>
          <motion.div variants={itemVariants} whileHover={{ y: -2 }} className="bg-card border rounded-xl p-4 shadow-sm transition-all duration-300">
            <TopProductsTable products={topProducts} loading={topProductsLoading} />
          </motion.div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div variants={itemVariants} whileHover={{ y: -2 }} className="bg-card border rounded-xl p-4 shadow-sm transition-all duration-300">
          <RecentActivity loading={activityLoading} activities={activities} />
        </motion.div>
      </motion.div>
    </AdminLayout>
  );
}

// DashboardPage is used inline in createFileRoute above
