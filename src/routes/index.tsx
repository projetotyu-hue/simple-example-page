import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Store, BarChart3, CreditCard } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "SentinelShield - Painel Admin & Loja" },
      { name: "description", content: "Painel administrativo e loja virtual" },
    ],
  }),
});

function Index() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="max-w-7xl mx-auto px-6 py-24 text-center">
        <h1 className="text-5xl font-bold text-white mb-6">
          SentinelShield
        </h1>
        <p className="text-xl text-gray-300 mb-12">
          Sistema completo de administração e loja virtual
        </p>
        
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <Link to="/store">
            <Card className="bg-white/10 backdrop-blur border-white/20 hover:bg-white/20 transition-all cursor-pointer h-full">
              <CardHeader>
                <div className="mx-auto h-16 w-16 rounded-full bg-orange-500/20 flex items-center justify-center mb-4">
                  <Store className="h-8 w-8 text-orange-500" />
                </div>
                <CardTitle className="text-white text-xl">TikTok Shop</CardTitle>
                <CardDescription className="text-gray-400">
                  Acessar loja virtual
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-orange-500 hover:bg-orange-600">
                  Entrar na Loja
                </Button>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/admin">
            <Card className="bg-white/10 backdrop-blur border-white/20 hover:bg-white/20 transition-all cursor-pointer h-full">
              <CardHeader>
                <div className="mx-auto h-16 w-16 rounded-full bg-purple-500/20 flex items-center justify-center mb-4">
                  <Shield className="h-8 w-8 text-purple-500" />
                </div>
                <CardTitle className="text-white text-xl">Painel Admin</CardTitle>
                <CardDescription className="text-gray-400">
                  Acessar painel administrativo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-purple-500 hover:bg-purple-600">
                  Entrar no Admin
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </main>
  );
}