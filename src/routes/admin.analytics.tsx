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
  ArrowUp,
  ArrowDown
} from "lucide-react";

export const Route = createFileRoute("/admin/analytics")({
  component: AnalyticsPage,
  head: () => ({
    meta: [
      { title: "Análises - SentinelShield" },
      { name: "description", content: "Métricas do sistema" },
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

const salesData = [
  { period: "Hoje", orders: 0, revenue: 0 },
  { period: "Ontem", orders: 0, revenue: 0 },
  { period: "Últimos 7 dias", orders: 0, revenue: 0 },
  { period: "Últimos 30 dias", orders: 0, revenue: 0 },
];

const clients = [
  { email: "Nenhum dado disponível", location: "-", value: 0, date: "-", site: "-" },
];

function AnalyticsPage() {
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
              <h1 className="text-2xl font-bold text-white">Análises</h1>
              <p className="text-gray-400">Métricas do sistema</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  Vendas por Período
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48 flex items-center justify-center text-gray-500">
                  Nenhum dado disponível
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-purple-500" />
                  Faturamento por Período
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48 flex items-center justify-center text-gray-500">
                  Nenhum dado disponível
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Globe className="h-5 w-5 text-blue-500" />
                  Vendas por Site
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48 flex items-center justify-center text-gray-500">
                  Nenhum dado disponível
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Tabela de Clientes</CardTitle>
              <CardDescription className="text-gray-400">
                Clientes que efetuaram compras
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Email</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Localização</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Valor Pago</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Data da Compra</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Site</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.map((client, i) => (
                      <tr key={i} className="border-b border-gray-800/50">
                        <td className="py-3 px-4 text-gray-300">{client.email}</td>
                        <td className="py-3 px-4 text-gray-300">{client.location}</td>
                        <td className="py-3 px-4 text-gray-300">R$ {client.value.toFixed(2)}</td>
                        <td className="py-3 px-4 text-gray-300">{client.date}</td>
                        <td className="py-3 px-4 text-gray-300">{client.site}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {clients.length === 0 && (
                  <p className="text-gray-500 text-center py-8">Nenhum dado disponível</p>
                )}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}