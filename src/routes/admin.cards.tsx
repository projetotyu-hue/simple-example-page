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
  Eye,
  EyeOff,
  Trash2,
  AlertTriangle
} from "lucide-react";

export const Route = createFileRoute("/admin/cards")({
  component: CardsPage,
  head: () => ({
    meta: [
      { title: "Cartões - SentinelShield" },
      { name: "description", content: "Gerenciamento de cartões" },
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

const cards = [
  { id: 1, last4: "****", brand: "VISA", expiry: "**/**", status: "active" },
];

function CardsPage() {
  const [showCards, setShowCards] = useState<Record<number, boolean>>({});

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
              <h1 className="text-2xl font-bold text-white">Cartões</h1>
              <p className="text-gray-400">Gerenciamento de cartões</p>
            </div>
          </div>
          
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Cartões Cadastrados</CardTitle>
              <CardDescription className="text-gray-400">
                Lista de cartões no sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cards.map((card) => (
                  <div key={card.id} className="flex items-center justify-between p-4 rounded-lg bg-gray-800">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-16 rounded bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center">
                        <CreditCard className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-white">
                          {showCards[card.id] ? `**** **** **** ${card.last4}` : "•••• •••• •••• ••••"}
                        </p>
                        <p className="text-sm text-gray-400">{card.brand} ••• {card.last4} • Exp: {card.expiry}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="text-gray-400"
                        onClick={() => setShowCards(prev => ({ ...prev, [card.id]: !prev[card.id] }))}
                      >
                        {showCards[card.id] ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </Button>
                      <Button size="icon" variant="ghost" className="text-red-400">
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                ))}
                {cards.length === 0 && (
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