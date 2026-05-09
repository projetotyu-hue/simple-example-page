import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ShieldCheck, Key } from "lucide-react";

export const Route = createFileRoute("/admin/chave")({
  head: () => ({ meta: [{ title: "Chaves de API — Achadinhos Admin" }] }),
  component: ChavePage,
});

function ChavePage() {
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [settingsId, setSettingsId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data, error } = await supabase.from("settings").select("id, gateway_mode, gateway_secret_key").limit(1).single();
      if (data) {
        setSettingsId(data.id);
        // Usamos gateway_mode para Client ID e gateway_secret_key para Client Secret
        setClientId(data.gateway_mode || "");
        setClientSecret(data.gateway_secret_key || "");
      } else if (error && error.code !== "PGRST116") {
        setError("Erro ao carregar configurações.");
      }
      setLoading(false);
    }
    void load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const updates = { 
        gateway_mode: clientId, 
        gateway_secret_key: clientSecret 
      };
      
      if (settingsId) {
        const { error } = await supabase.from("settings").update(updates).eq("id", settingsId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from("settings").insert([updates]).select().single();
        if (error) throw error;
        if (data) setSettingsId(data.id);
      }
      setSuccess("Chaves VexoPay salvas com sucesso!");
    } catch (err) {
      setError("Não foi possível salvar as chaves.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Configuração de Pagamento">
        <div className="flex justify-center p-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Configuração de Pagamento">
      <div className="max-w-2xl">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-foreground mb-2 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-primary" />
            Integração VexoPay
          </h2>
          <p className="text-sm text-muted-foreground">
            Configure suas credenciais do VexoPay para processar pagamentos via PIX de forma automática.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive animate-in fade-in slide-in-from-top-1">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-600 dark:text-green-400 animate-in fade-in slide-in-from-top-1">
            {success}
          </div>
        )}

        <div className="bg-card rounded-2xl border border-border p-8 shadow-sm flex flex-col gap-6">
          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                <Key className="w-3 h-3" />
                Client ID
              </label>
              <input
                className="w-full border border-border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-mono bg-background shadow-sm"
                placeholder="vxp_ci_..."
                type="text"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
              />
              <p className="mt-1.5 text-[10px] text-muted-foreground">Seu identificador único da conta VexoPay.</p>
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                <Key className="w-3 h-3" />
                Client Secret
              </label>
              <input
                className="w-full border border-border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-mono bg-background shadow-sm"
                placeholder="vxp_cs_..."
                type="password"
                value={clientSecret}
                onChange={(e) => setClientSecret(e.target.value)}
              />
              <p className="mt-1.5 text-[10px] text-muted-foreground">Chave secreta para autenticação de transações.</p>
            </div>
          </div>

          <div className="pt-4 border-t border-border mt-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-primary hover:bg-primary/90 active:scale-[0.98] disabled:opacity-50 text-primary-foreground font-semibold rounded-xl py-4 text-sm transition-all flex justify-center items-center gap-2 shadow-lg shadow-primary/20"
            >
              {saving ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Salvar Configurações"
              )}
            </button>
          </div>
        </div>

        <div className="mt-8 p-4 rounded-xl bg-muted/30 border border-border">
          <h4 className="text-xs font-bold text-foreground uppercase tracking-widest mb-2 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Dica de Segurança
          </h4>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Nunca compartilhe seu <strong>Client Secret</strong> com ninguém. Ele é usado para assinar suas requisições e garantir que apenas você possa criar cobranças em sua conta.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
