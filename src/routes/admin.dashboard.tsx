import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, CreditCard, Activity, Users, DollarSign, TrendingUp, AlertTriangle, LogOut, Settings, Bell } from "lucide-react";

export const Route = createFileRoute("/admin/dashboard")({
  component: AdminDashboard,
  head: () => ({
    meta: [
      { title: "Dashboard - SentinelShield Admin" },
      { name: "description", content: "Painel administrativo" },
    ],
  }),
});

function AdminDashboard() {
  const stats = [
    { title: "Vendas Hoje", value: "R$ 12.450", icon: DollarSign, change: "+12%", color: "text-green-500" },
    { title: "Pedidos", value: "156", icon: CreditCard, change: "+8%", color: "text-blue-500" },
    { title: "Visitantes", value: "2.340", icon: Users, change: "+24%", color: "text-purple-500" },
    { title: "Taxa Conversão", value: "3.2%", icon: TrendingUp, change: "+1.2%", color: "text-amber-500" },
  ];

  const securityAlerts = [
    { type: "warning", message: "3 tentativas de login falhas nos últimos 30 min", time: "5 min atrás" },
    { type: "info", message: "Novo dispositivo reconhecido: iPhone 15 Pro", time: "1 hora atrás" },
    { type: "success", message: "Backup realizado com sucesso", time: "3 horas atrás" },
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="flex">
        <aside className="w-64 bg-slate-900 border-r border-slate-800 min-h-screen fixed">
          <div className="p-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-violet-600">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-white">SentinelShield</span>
            </div>
          </div>
          
          <nav className="p-4 space-y-2">
            <Link to="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-purple-500/10 text-purple-400">
              <Activity className="h-5 w-5" />
              Dashboard
            </Link>
            <Link to="/admin/analytics" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white">
              <TrendingUp className="h-5 w-5" />
              Análises
            </Link>
            <Link to="/admin/payments" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white">
              <CreditCard className="h-5 w-5" />
              Pagamentos
            </Link>
            <Link to="/admin/sites" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white">
              <Lock className="h-5 w-5" />
              Sites
            </Link>
            <Link to="/admin/settings" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white">
              <Settings className="h-5 w-5" />
              Configurações
            </Link>
          </nav>
          
          <div className="absolute bottom-0 w-64 p-4 border-t border-slate-800">
            <button className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:text-red-400 w-full">
              <LogOut className="h-5 w-5" />
              Sair
            </button>
          </div>
        </aside>
        
        <main className="ml-64 flex-1 p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-white">Dashboard</h1>
              <p className="text-slate-400">Bem-vindo de volta, Admin</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-slate-400 hover:text-white">
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
              <Card key={stat.title} className="bg-slate-900 border-slate-800">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">{stat.title}</p>
                      <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                      <p className={`text-sm ${stat.color} mt-1`}>{stat.change}</p>
                    </div>
                    <div className={`h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center ${stat.color}`}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  Alertas de Segurança
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Atividade recente do sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {securityAlerts.map((alert, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-slate-800">
                    {alert.type === "warning" && <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />}
                    {alert.type === "info" && <Activity className="h-5 w-5 text-blue-500 mt-0.5" />}
                    {alert.type === "success" && <Shield className="h-5 w-5 text-green-500 mt-0.5" />}
                    <div className="flex-1">
                      <p className="text-sm text-slate-200">{alert.message}</p>
                      <p className="text-xs text-slate-500 mt-1">{alert.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
            
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Ações Rápidas</CardTitle>
                <CardDescription className="text-slate-400">
                  Operações comuns
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <button className="p-4 rounded-lg bg-slate-800 hover:bg-slate-700 text-center">
                  <Lock className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                  <span className="text-sm text-slate-200">Bloquear IP</span>
                </button>
                <button className="p-4 rounded-lg bg-slate-800 hover:bg-slate-700 text-center">
                  <Activity className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <span className="text-sm text-slate-200">Ver Logs</span>
                </button>
                <button className="p-4 rounded-lg bg-slate-800 hover:bg-slate-700 text-center">
                  <Users className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <span className="text-sm text-slate-200">Usuários</span>
                </button>
                <button className="p-4 rounded-lg bg-slate-800 hover:bg-slate-700 text-center">
                  <Settings className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                  <span className="text-sm text-slate-200">Config</span>
                </button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}