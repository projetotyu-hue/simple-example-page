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
  Menu,
  Search,
  Bell,
  TrendingUp,
  Users,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  XCircle
} from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
  head: () => ({
    meta: [
      { title: "Painel Admin - SentinelShield" },
      { name: "description", content: "Painel administrativo" },
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

const stats = [
  { label: "Vendas Hoje", value: "R$ 0", change: "+0%", icon: DollarSign },
  { label: "Pedidos", value: "0", change: "+0%", icon: TrendingUp },
  { label: "Clientes", value: "0", change: "+0%", icon: Users },
  { label: "Taxa Conversão", value: "0%", change: "+0%", icon: BarChart3 },
];

const sites = [
  { name: "Achadinhos da Vitrine", domain: "achadinhos.lovable.app", sales: 0, revenue: 0, status: "online" },
];

const securityLogs = [
  { type: "success", message: "Sistema iniciado", time: "Agora" },
  { type: "info", message: "API conexão estabelecida", time: "Agora" },
];

function AdminPage() {
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
              <h1 className="text-2xl font-bold text-white">Dashboard</h1>
              <p className="text-gray-400">Bem-vindo de volta, Admin</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input 
                  type="text" 
                  placeholder="Buscar..." 
                  className="bg-gray-800 border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white"
                />
              </div>
              <button className="relative p-2 text-gray-400 hover:text-white">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
              </button>
              <Badge variant="outline" className="border-green-500 text-green-500">
                <span className="mr-1 h-2 w-2 rounded-full bg-green-500"></span>
                Sistema Online
              </Badge>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => (
              <Card key={stat.label} className="bg-gray-900 border-gray-800">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">{stat.label}</p>
                      <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                      <p className="text-sm text-green-500 mt-1">{stat.change}</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-gray-800 flex items-center justify-center text-purple-500">
                      <stat.icon className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  Alertas de Segurança
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Atividade recente do sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {securityLogs.map((log, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-gray-800">
                    {log.type === "success" && <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />}
                    {log.type === "info" && <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5" />}
                    {log.type === "warning" && <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />}
                    <div className="flex-1">
                      <p className="text-sm text-gray-200">{log.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{log.time}</p>
                    </div>
                  </div>
                ))}
                {securityLogs.length === 0 && (
                  <p className="text-gray-500 text-center py-4">Nenhum dado disponível</p>
                )}
              </CardContent>
            </Card>
            
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Meus Sites</CardTitle>
                <CardDescription className="text-gray-400">
                  Sites administrados
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {sites.map((site) => (
                  <div key={site.name} className="flex items-center justify-between p-4 rounded-lg bg-gray-800">
                    <div>
                      <p className="font-medium text-white">{site.name}</p>
                      <p className="text-sm text-gray-400">{site.domain}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {site.status === "online" && (
                        <Badge className="bg-green-500/20 text-green-500">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Online
                        </Badge>
                      )}
                      {site.status === "pausado" && (
                        <Badge className="bg-yellow-500/20 text-yellow-500">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Pausado
                        </Badge>
                      )}
                      {site.status === "offline" && (
                        <Badge className="bg-red-500/20 text-red-500">
                          <XCircle className="h-3 w-3 mr-1" />
                          Offline
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
                {sites.length === 0 && (
                  <p className="text-gray-500 text-center py-4">Nenhum dado disponível</p>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}