import { useState, type FormEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Shield, Loader2 } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const { isAdmin, loading: authLoading, user } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && user && isAdmin) navigate("/admin", { replace: true });
  }, [authLoading, user, isAdmin, navigate]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        toast.success("Conta criada! Faça login agora.");
        setMode("login");
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;

        const { data: roles } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", data.user.id);
        const adminOk = roles?.some((r) => r.role === "admin");

        await supabase.from("logs").insert({
          event_type: "login",
          username: email,
          status: adminOk ? "success" : "denied",
          user_id: data.user.id,
        });

        if (!adminOk) {
          await supabase.auth.signOut();
          throw new Error("Acesso restrito a administradores.");
        }

        toast.success("Bem-vindo, admin.");
        navigate("/admin", { replace: true });
      }
    } catch (err: any) {
      toast.error(err.message ?? "Erro ao autenticar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 opacity-30 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)),transparent_60%),radial-gradient(circle_at_70%_80%,hsl(var(--accent)),transparent_60%)]" />

      <div className="w-full max-w-md p-8 rounded-2xl bg-card border shadow-2xl">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="size-12 rounded-xl bg-primary/15 grid place-items-center mb-3">
            <Shield className="size-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Sentinel Shield</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {mode === "login" ? "Acesse o painel administrativo" : "Crie a primeira conta admin"}
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium" htmlFor="email">Email</label>
            <input
              id="email" type="email" required
              value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full h-10 px-3 rounded-md bg-input border text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="seu@email.com"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium" htmlFor="password">Senha</label>
            <input
              id="password" type="password" required minLength={6}
              value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full h-10 px-3 rounded-md bg-input border text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full h-10 rounded-md bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="size-4 animate-spin" />}
            {mode === "login" ? "Entrar" : "Criar conta"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          {mode === "login" ? (
            <>Não tem conta?{" "}
              <button onClick={() => setMode("signup")} className="text-primary hover:underline">
                Cadastre-se
              </button>
              <p className="text-xs mt-2 opacity-70">Primeiro usuário cadastrado vira admin.</p>
            </>
          ) : (
            <>Já tem conta?{" "}
              <button onClick={() => setMode("login")} className="text-primary hover:underline">
                Entrar
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
