import { useState, useEffect, useMemo, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useTheme } from "@/components/theme-provider";
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Ghostshield Admin" }] }),
  component: DashboardPage,
});

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type RevenuePeriod = "daily" | "weekly" | "monthly";

type RevenueDataPoint = {
  period_label: string;
  period_start: string;
  revenue: number;
  count: number;
};

type ConversionData = {
  code_generated: number;
  payments_completed: number;
  conversion_rate: number;
};

type FunnelDataPoint = {
  funnel_step: string;
  event_count: number;
  abandonment_count: number;
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
                dataKey="period_label"
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

  const { code_generated, payments_completed, conversion_rate } = data;
  const abandonmentRate = 100 - conversion_rate;

  const steps = [
    {
      label: "Código Gerado",
      value: code_generated,
      color: "bg-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-950/30",
      textColor: "text-blue-700 dark:text-blue-300",
    },
    {
      label: "Pagamento Concluído",
      value: payments_completed,
      color: "bg-emerald-500",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
      textColor: "text-emerald-700 dark:text-emerald-300",
    },
  ];

  const maxValue = Math.max(code_generated, payments_completed, 1);

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
                      {step.value.toLocaleString("pt-BR")}
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
                {conversion_rate.toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-sm text-muted-foreground">Taxa de Abandono</span>
              <span className="text-sm font-semibold text-red-500">
                {abandonmentRate.toFixed(1)}%
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
// Recent Activity (placeholder)
// ---------------------------------------------------------------------------

function RecentActivity({ loading }: { loading: boolean }) {
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
        ) : (
          <EmptyState message="Nenhuma atividade recente" icon={BarChart3} />
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

  // -- Fetch KPIs --
  const fetchKpis = useCallback(async (signal?: AbortSignal) => {
    try {
      // Fetch total completed sales count and sum
      const { data: paymentsData, error: paymentsError } = await supabase
        .from("payments")
        .select("amount")
        .eq("status", "completed");

      if (paymentsError) throw paymentsError;

      const totalSales = paymentsData?.length ?? 0;
      const totalRevenue = (paymentsData ?? []).reduce(
        (sum, p) => sum + (typeof p.amount === "number" ? p.amount : 0),
        0
      );

      // Try to fetch conversion data for conversion rate
      let conversionRate = 0;
      try {
        const { data: convData, error: convError } = await supabase.rpc("get_conversion_analytics", {
          start_date: dateRange.start,
          end_date: dateRange.end,
        });

        if (convError) {
          if (isRpcError(convError)) {
            conversionRate = 0; // Use 0 when function doesn't exist
          } else {
            throw convError;
          }
        } else if (convData && Array.isArray(convData) && convData.length > 0) {
          conversionRate = convData[0].conversion_rate ?? 0;
        }
      } catch {
        conversionRate = 0;
      }

      // Try to fetch funnel data for abandonment rate
      let abandonmentRate = 0;
      try {
        const { data: funnelData, error: funnelError } = await supabase.rpc("get_funnel_analytics", {
          start_date: dateRange.start,
          end_date: dateRange.end,
        });

        if (funnelError) {
          if (isRpcError(funnelError)) {
            abandonmentRate = 0;
          } else {
            throw funnelError;
          }
        } else if (funnelData && Array.isArray(funnelData)) {
          const totalEvents = funnelData.reduce((sum, f) => sum + (f.event_count ?? 0), 0);
          const totalAbandonment = funnelData.reduce((sum, f) => sum + (f.abandonment_count ?? 0), 0);
          abandonmentRate = totalEvents > 0 ? (totalAbandonment / totalEvents) * 100 : 0;
        }
      } catch {
        abandonmentRate = 0;
      }

      if (!signal?.aborted) {
        setKpi({
          totalSales,
          totalRevenue,
          conversionRate,
          abandonmentRate,
        });
      }
    } catch (err) {
      console.error("Error fetching KPIs:", err);
    }
  }, [dateRange]);

  // -- Fetch Revenue Chart Data --
  const fetchRevenue = useCallback(async (period: RevenuePeriod, signal?: AbortSignal) => {
    setRevenueLoading(true);
    try {
      const { data, error } = await supabase.rpc("get_revenue_analytics", {
        period,
        start_date: dateRange.start,
        end_date: dateRange.end,
      });

      if (error) {
        if (isRpcError(error)) {
          // Function doesn't exist yet — use empty data
          if (!signal?.aborted) setRevenueData([]);
        } else {
          throw error;
        }
      } else {
        if (!signal?.aborted) setRevenueData((data ?? []) as RevenueDataPoint[]);
      }
    } catch (err) {
      console.error("Error fetching revenue:", err);
      if (!signal?.aborted) setRevenueData([]);
    } finally {
      if (!signal?.aborted) setRevenueLoading(false);
    }
  }, [dateRange]);

  // -- Fetch Conversion Data --
  const fetchConversion = useCallback(async (signal?: AbortSignal) => {
    setConversionLoading(true);
    try {
      const { data, error } = await supabase.rpc("get_conversion_analytics", {
        start_date: dateRange.start,
        end_date: dateRange.end,
      });

      if (error) {
        if (isRpcError(error)) {
          if (!signal?.aborted) setConversionData(null);
        } else {
          throw error;
        }
      } else {
        const conv = Array.isArray(data) && data.length > 0 ? data[0] : null;
        if (!signal?.aborted) setConversionData(conv as ConversionData | null);
      }
    } catch (err) {
      console.error("Error fetching conversion:", err);
      if (!signal?.aborted) setConversionData(null);
    } finally {
      if (!signal?.aborted) setConversionLoading(false);
    }
  }, [dateRange]);

  // -- Fetch Top Products --
  const fetchTopProducts = useCallback(async (signal?: AbortSignal) => {
    setTopProductsLoading(true);
    try {
      const { data, error } = await supabase.rpc("get_top_products", {
        limit_count: 5,
        start_date: dateRange.start,
        end_date: dateRange.end,
      });

      if (error) {
        if (isRpcError(error)) {
          if (!signal?.aborted) setTopProducts([]);
        } else {
          throw error;
        }
      } else {
        if (!signal?.aborted) setTopProducts((data ?? []) as TopProduct[]);
      }
    } catch (err) {
      console.error("Error fetching top products:", err);
      if (!signal?.aborted) setTopProducts([]);
    } finally {
      if (!signal?.aborted) setTopProductsLoading(false);
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
    ]).finally(() => {
      if (!signal.aborted) {
        setLoading(false);
        setActivityLoading(false);
      }
    });

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
        value: kpi.totalSales.toLocaleString("pt-BR"),
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
        value: `${kpi.conversionRate.toFixed(1)}%`,
        subtitle: "códigos gerados → vendas",
        icon: TrendingUp,
      },
      {
        title: "Taxa de Abandono",
        value: `${kpi.abandonmentRate.toFixed(1)}%`,
        subtitle: "abandono no funil",
        icon: AlertTriangle,
      },
    ];
  }, [kpi]);

  return (
    <AdminLayout title="Dashboard">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Visão geral do seu negócio</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {loading || !kpi
            ? Array.from({ length: 4 }).map((_, i) => <KpiCardSkeleton key={i} />)
            : kpiCards.map((card) => (
                <KpiCard
                  key={card.title}
                  title={card.title}
                  value={card.value}
                  subtitle={card.subtitle}
                  icon={card.icon}
                  loading={false}
                />
              ))}
        </div>

        {/* Revenue Chart */}
        <RevenueChart
          data={revenueData}
          loading={revenueLoading}
          period={revenuePeriod}
          onPeriodChange={setRevenuePeriod}
        />

        {/* Two-column: Funnel + Top Products */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ConversionFunnel data={conversionData} loading={conversionLoading} />
          <TopProductsTable products={topProducts} loading={topProductsLoading} />
        </div>

        {/* Recent Activity */}
        <RecentActivity loading={activityLoading} />
      </div>
    </AdminLayout>
  );
}

// DashboardPage is used inline in createFileRoute above
