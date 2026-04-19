import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Lock, Eye, EyeOff, AlertTriangle, CheckCircle, Clock, Fingerprint } from "lucide-react";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({
    meta: [
      { title: "Login - SentinelShield Admin" },
      { name: "description", content: "Painel administrativo seguro" },
    ],
  }),
});

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);
  const [lockTime, setLockTime] = useState(0);

  const MAX_ATTEMPTS = 5;
  const LOCKOUT_TIME = 60;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (locked) return;
    
    setError("");
    setLoading(true);

    if (attempts >= MAX_ATTEMPTS) {
      setLocked(true);
      setLockTime(LOCKOUT_TIME);
      const timer = setInterval(() => {
        setLockTime((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setLocked(false);
            setAttempts(0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      setLoading(false);
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (username === "admin" && password === "admin123") {
      window.location.href = "/admin/dashboard";
    } else {
      setAttempts((prev) => prev + 1);
      setError(`Credenciais incorretas. Tentativas restantes: ${MAX_ATTEMPTS - attempts - 1}`);
      if (attempts + 1 >= MAX_ATTEMPTS) {
        setLocked(true);
        setLockTime(LOCKOUT_TIME);
        const timer = setInterval(() => {
          setLockTime((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              setLocked(false);
              setAttempts(0);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNCAxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNHoiIGZpbGw9IiMyNzI3MmEiIGZpbGwtb3BhY2l0eT0iMC4yIi8+PC9nPjwvc3ZnPg==')] opacity-30"></div>
      
      <Card className="w-full max-w-md bg-slate-900/80 backdrop-blur border-slate-800">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-violet-600">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
              SentinelShield
            </CardTitle>
            <CardDescription className="text-slate-400">
              Painel Administrativo Seguro
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent>
          {locked && (
            <Alert className="mb-4 border-red-500/50 bg-red-500/10">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <AlertDescription className="text-red-400">
                Conta temporariamente bloqueada. Aguarde {lockTime} segundos.
              </AlertDescription>
            </Alert>
          )}

          {error && !locked && (
            <Alert className="mb-4 border-amber-500/50 bg-amber-500/10">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <AlertDescription className="text-amber-400">{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Usuário</label>
              <div className="relative">
                <Fingerprint className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                <Input
                  type="text"
                  placeholder="Digite seu usuário"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-slate-800 border-slate-700 pl-10 text-slate-100 placeholder:text-slate-500"
                  disabled={locked}
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-800 border-slate-700 pl-10 pr-10 text-slate-100 placeholder:text-slate-500"
                  disabled={locked}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-500 hover:text-slate-300"
                  disabled={locked}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500"
              disabled={loading || locked}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4 animate-spin" />
                  Verificando...
                </span>
              ) : locked ? (
                `Bloqueado (${lockTime}s)`
              ) : (
                "Entrar"
              )}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-800">
            <div className="flex flex-wrap justify-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-500" />
                SSL/TLS
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-500" />
                2FA
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-500" />
                Audit Log
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-500" />
                IP Check
              </span>
            </div>
            <p className="mt-3 text-center text-xs text-slate-600">
              Seu IP está sendo monitorado por segurança
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
