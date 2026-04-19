import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  BarChart3, 
  Globe, 
  CreditCard, 
  FileText, 
  Settings,
  LogOut,
  TrendingUp,
  DollarSign,
  Users,
  Pause,
  Play,
  Trash2,
  ExternalLink,
  MoreVertical
} from "lucide-react";

export const Route = createFileRoute("/admin/sites")({
  component: SitesPage,
  head: () => ({
    meta: [
      { title: "Meus Sites - SentinelShield" },
      { name: "description", content: "Sites administrados" },
    ],
  }),
});

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: BarChart3, label: "Análises", path: "/admin/analytics" },
  { icon: Globe, label: "Meus Sites", path: "/admin/sites" },
  { icon: CreditCard, label: "Cartões", path: "/admin/cards" },
  { icon: FileText, label: "Logs & Monitoramento", path: "/admin/logs" },
  { icon: Settings, label: "Configurações", path: "/admin/settings" },
];

const sites = [
  { name: "Achadinhos da Vitrine", domain: "achadinhos.lovable.app", sales: 0, revenue: 0, status: "online" },
];

const siteStats = [
  { label: "Vendas Hoje", value: 0 },
  { label: "Vendas Totais", value: 0 },
  { label: "Faturamento Total", value: "R$ 0" },
  { label: "Taxa Conversão", value: "0%" },
];

const billing = [
  { period: "Hoje", orders: 0, revenue: 0 },
  { period: "Ontem", orders: 0, revenue: 0 },
  { period: "Últimos 7 dias", orders: 0, revenue: 0 },
  { period: "Últimos 30 dias", orders: 0, revenue: 0 },
];

function SitesPage() {
  const [selectedSite, setSelectedSite] = useState<typeof sites[0] | null>(sites[0] || null);

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="flex">
        <aside className="w-64 bg-gray-900 border-r border-gray-800 min-h-screen fixed">
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
                <span className="text-white font-bold">SS</span>
              </div>
              <span className="font-bold text-white">SentinelShield</span>
            </div>
          </div>
          
          <nav className="p-4 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white"
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            ))}
          </nav>
          
          <div className="absolute bottom-0 w-64 p-4 border-t border-gray-800">
            <button className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-red-400 w-full">
              <LogOut className="h-5 w-5" />
              Sair
            </button>
          </div>
        </aside>
        
        <main className="ml-64 flex-1 p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-white">Meus Sites</h1>
              <p className="text-gray-400">Sites administrados</p>
            </div>
          </div>
          
          {!selectedSite ? (
            <div className="grid gap-4">
              {sites.map((site) => (
                <Card 
                  key={site.name} 
                  className="bg-gray-900 border-gray-800 cursor-pointer hover:border-gray-700"
                  onClick={() => setSelectedSite(site)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-white">{site.name}</h3>
                        <p className="text-gray-400">{site.domain}</p>
                        <div className="flex gap-4 mt-2 text-sm text-gray-500">
                          <span>Vendas: {site.sales}</span>
                          <span>Faturamento: R$ {site.revenue}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {site.status === "online" && (
                          <Badge className="bg-green-500/20 text-green-500">Online</Badge>
                        )}
                        {site.status === "pausado" && (
                          <Badge className="bg-yellow-500/20 text-yellow-500">Pausado</Badge>
                        )}
                        {site.status === "offline" && (
                          <Badge className="bg-red-500/20 text-red-500">Offline</Badge>
                        )}
                        <Button size="icon" variant="ghost" className="text-gray-400">
                          <MoreVertical className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {sites.length === 0 && (
                <p className="text-gray-500 text-center py-8">Nenhum dado disponível</p>
              )}
            </div>
          ) : (
            <div>
              <Button variant="ghost" className="mb-4 text-gray-400" onClick={() => setSelectedSite(null)}>
                ← Voltar
              </Button>
              
              <div className="mb-6">
                <h2 className="text-xl font-bold text-white">{selectedSite.name}</h2>
                <p className="text-gray-400">{selectedSite.domain}</p>
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {siteStats.map((stat) => (
                  <Card key={stat.label} className="bg-gray-900 border-gray-800">
                    <CardContent className="pt-6">
                      <p className="text-sm text-gray-400">{stat.label}</p>
                      <p className="text-2xl font-bold text-white mt-1">
                        {typeof stat.value === "number" ? stat.value : stat.value}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <Card className="bg-gray-900 border-gray-800 mb-8">
                <CardHeader>
                  <CardTitle className="text-white">Gráfico de Vendas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48 flex items-center justify-center text-gray-500">
                    Nenhum dado disponível
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Tabela de Faturamento</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-800">
                          <th className="text-left py-3 px-4 text-gray-400 font-medium">Período</th>
                          <th className="text-left py-3 px-4 text-gray-400 font-medium">Pedidos</th>
                          <th className="text-left py-3 px-4 text-gray-400 font-medium">Faturamento</th>
                        </tr>
                      </thead>
                      <tbody>
                        {billing.map((row, i) => (
                          <tr key={i} className="border-b border-gray-800/50">
                            <td className="py-3 px-4 text-gray-300">{row.period}</td>
                            <td className="py-3 px-4 text-gray-300">{row.orders}</td>
                            <td className="py-3 px-4 text-gray-300">R$ {row.revenue.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}