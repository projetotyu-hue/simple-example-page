import { useState, useRef, useEffect, type FormEvent } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AtSign, Lock, Loader2, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { AuthError } from "@supabase/supabase-js";
import { LoginParticles } from "@/components/admin/LoginParticles";

export const Route = createFileRoute("/admin/login")({
  head: () => ({ meta: [{ title: "Login — Achadinhos Admin" }] }),
  component: Component,
});

function Component() {
  const navigate = useNavigate();
  const { session, isAdmin, loading: authLoading } = useAuth();
  const emailRef = useRef<HTMLInputElement>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!authLoading && session && isAdmin) {
      navigate({ to: "/admin/dashboard" });
    }
  }, [session, isAdmin, authLoading, navigate]);

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidPassword = (password: string) => {
    return password.length >= 6;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setError("");
    if (value && !isValidEmail(value)) {
      setEmailError("Email inválido");
    } else {
      setEmailError("");
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setError("");
    if (value && !isValidPassword(value)) {
      setPasswordError("Senha deve ter pelo menos 6 caracteres");
    } else {
      setPasswordError("");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    let hasError = false;

    if (!email) {
      setEmailError("Email é obrigatório");
      hasError = true;
    } else if (!isValidEmail(email)) {
      setEmailError("Email inválido");
      hasError = true;
    }

    if (!password) {
      setPasswordError("Senha é obrigatória");
      hasError = true;
    } else if (!isValidPassword(password)) {
      setPasswordError("Senha deve ter pelo menos 6 caracteres");
      hasError = true;
    }

    if (hasError) return;

    setError("");
    setSubmitting(true);

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError || !data.session) {
      setSubmitting(false);
      if (signInError instanceof AuthError) {
        if (signInError.status === 0) {
          setError("Erro de rede. Verifique sua conexão.");
        } else if (signInError.status === 400 || signInError.status === 401) {
          setError("Email ou senha incorretos");
        } else {
          setError("Erro ao fazer login. Tente novamente mais tarde.");
        }
      } else {
        setError("Email ou senha incorretos");
      }
      return;
    }

    const { data: roleRow, error: roleError } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", data.session.user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (roleError || !roleRow) {
      await supabase.auth.signOut();
      setSubmitting(false);
      if (roleError) {
        setError("Erro ao verificar permissões. Tente novamente.");
      } else {
        setError("Usuário não tem permissão de administrador");
      }
      return;
    }

    setSuccess(true);
    setSubmitting(false);

    setTimeout(() => {
      navigate({ to: "/admin/dashboard" });
    }, 1200);
  };

  const isFormInvalid = !email || !password || !!emailError || !!passwordError;
  const isDisabled = isFormInvalid || submitting || success;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Particle effect background */}
      <LoginParticles />

      {/* Animated background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/20 blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-primary/20 blur-3xl animate-pulse [animation-delay:1000ms]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-primary/10 blur-3xl animate-pulse [animation-delay:500ms]" />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      {/* Login card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Logo and header */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground text-3xl font-bold shadow-lg shadow-primary/25 animate-in fade-in zoom-in duration-500">
            A
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Achadinhos da Vitrine
          </h1>
          <p className="mt-2 text-muted-foreground">
            Painel Administrativo
          </p>
        </div>

        {/* Form card with glass effect */}
        <div className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-xl shadow-2xl shadow-black/20 p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <Label
                htmlFor="email"
                className="text-foreground"
              >
                Email
              </Label>
              <div className="relative">
                <AtSign
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                />
                <Input
                  ref={emailRef}
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={handleEmailChange}
                  className={cn(
                    "pl-10 bg-background/50 border-border/50 focus:border-primary transition-colors",
                    emailError && "border-destructive focus-visible:ring-destructive"
                  )}
                  placeholder="admin@exemplo.com"
                  disabled={submitting || success}
                  maxLength={255}
                />
              </div>
              {emailError && (
                <p className="text-xs text-destructive mt-1">{emailError}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="text-foreground"
                >
                  Senha
                </Label>
                <a
                  href="#"
                  className="text-xs text-primary hover:opacity-80 transition-opacity"
                >
                  Esqueceu a senha?
                </a>
              </div>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={handlePasswordChange}
                  className={cn(
                    "pl-10 pr-10 bg-background/50 border-border/50 focus:border-primary transition-colors",
                    passwordError && "border-destructive focus-visible:ring-destructive"
                  )}
                  placeholder="••••••••"
                  disabled={submitting || success}
                  maxLength={128}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {passwordError && (
                <p className="text-xs text-destructive mt-1">{passwordError}</p>
              )}
            </div>

            {/* Error alert */}
            {error && (
              <Alert variant="destructive" className="py-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">{error}</AlertDescription>
              </Alert>
            )}

            {/* Success alert */}
            {success && (
              <Alert className="border-green-500/50 bg-green-500/10 py-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <AlertDescription className="text-sm text-green-600 dark:text-green-400">
                  Redirecionando...
                </AlertDescription>
              </Alert>
            )}

            {/* Submit button with gradient */}
            <Button
              type="submit"
              disabled={isDisabled}
              className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-semibold shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Entrando...
                </>
              ) : success ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Redirecionando...
                </>
              ) : (
                "Entrar"
              )}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mt-6">
          <Lock className="h-3 w-3" />
          Acesso restrito
        </div>
      </div>
    </div>
  );
}
