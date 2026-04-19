import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  LayoutDashboard, 
  BarChart3, 
  Globe, 
  CreditCard, 
  FileText, 
  Settings,
  LogOut,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Globe as GlobeIcon,
  Server,
  Shield
} from "lucide-react";

export const Route = createFileRoute("/admin/logs")({
  component: LogsPage,
  head: () => ({
    meta: [
      { title: "Logs & Monitoramento - SentinelShield" },
      { name: "description", content: "Logs e monitoramento do sistema" },
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

const logs = [
  { ip: "Nenhum dado disponível", date: "-", event: "-", device: "-", browser: "-" },
];

const loginAttempts = 0;

function LogsPage() {
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
              <h1 className="text-2xl font-bold text-white">Logs & Monitoramento</h1>
              <p className="text-gray-400">Dados técnicos do sistema</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-gray-800 flex items-center justify-center">
                    <LogOut className="h-6 w-6 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Acessos à Página de Login</p>
                    <p className="text-2xl font-bold text-white">{loginAttempts}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-gray-800 flex items-center justify-center">
                    <AlertTriangle className="h-6 w-6 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Alertas de Atividade Suspeita</p>
                    <p className="text-2xl font-bold text-white">0</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-gray-800 flex items-center justify-center">
                    <Server className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Status da API</p>
                    <p className="text-2xl font-bold text-green-500">Online</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-gray-800 flex items-center justify-center">
                    <Shield className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Gateway de Pagamento</p>
                    <p className="text-2xl font-bold text-green-500">Online</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Eventos do Sistema</CardTitle>
              <CardDescription className="text-gray-400">
                Logs de login, acessos e atividades
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">IP</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Data</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Evento</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Dispositivo</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Navegador</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log, i) => (
                      <tr key={i} className="border-b border-gray-800/50">
                        <td className="py-3 px-4 text-gray-300">{log.ip}</td>
                        <td className="py-3 px-4 text-gray-300">{log.date}</td>
                        <td className="py-3 px-4 text-gray-300">{log.event}</td>
                        <td className="py-3 px-4 text-gray-300">{log.device}</td>
                        <td className="py-3 px-4 text-gray-300">{log.browser}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {logs.length === 0 && (
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