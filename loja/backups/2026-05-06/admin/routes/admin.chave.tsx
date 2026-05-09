import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/admin/chave")({
  head: () => ({ meta: [{ title: "Chave StreetPay — Achadinhos Admin" }] }),
  component: ChavePage,
});

function ChavePage() {
  const [gatewayMode, setGatewayMode] = useState("bearer");
  const [secretKey, setSecretKey] = useState("");
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
        setGatewayMode(data.gateway_mode || "bearer");
        setSecretKey(data.gateway_secret_key || "");
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
      const updates = { gateway_mode: gatewayMode, gateway_secret_key: secretKey };
      if (settingsId) {
        const { error } = await supabase.from("settings").update(updates).eq("id", settingsId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from("settings").insert([updates]).select().single();
        if (error) throw error;
        if (data) setSettingsId(data.id);
      }
      setSuccess("Chaves salvas com sucesso!");
    } catch (err) {
      setError("Não foi possível salvar.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Chave StreetPay">
        <div className="flex justify-center p-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </AdminLayout>
    );
  }

  const bearerClass = "flex items-start gap-3 border rounded-xl px-4 py-3 cursor-pointer transition-colors " + (gatewayMode === 'bearer' ? 'border-primary bg-primary/10' : 'border-border');
  const basicClass = "flex items-start gap-3 border rounded-xl px-4 py-3 cursor-pointer transition-colors " + (gatewayMode === 'basic' ? 'border-primary bg-primary/10' : 'border-border');

  return (
    <AdminLayout title="Chave StreetPay">
      {error && (
        <div className="mb-4 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-600 dark:text-green-400">
          {success}
        </div>
      )}

      <div className="max-w-lg">
        <div className="bg-card rounded-xl border border-border p-6 flex flex-col gap-5">
          <div>
            <label className="block text-xs text-muted-foreground mb-3">Modo de autenticação</label>
            <div className="flex flex-col gap-2">
              <label className={bearerClass}>
                <input
                  className="mt-0.5"
                  type="radio"
                  name="gatewayMode"
                  value="bearer"
                  checked={gatewayMode === 'bearer'}
                  onChange={() => setGatewayMode('bearer')}
                />
                <div>
                  <p className="text-sm font-medium text-foreground">Bearer Token (novo)</p>
                  <p className="text-xs text-muted-foreground">Usa apenas a Secret Key. Modo atual da Streetpay.</p>
                </div>
              </label>
              <label className={basicClass}>
                <input
                  className="mt-0.5"
                  type="radio"
                  name="gatewayMode"
                  value="basic"
                  checked={gatewayMode === 'basic'}
                  onChange={() => setGatewayMode('basic')}
                />
                <div>
                  <p className="text-sm font-medium text-foreground">Basic Auth (legado)</p>
                  <p className="text-xs text-muted-foreground">Usa Public Key + Secret Key. Método anterior.</p>
                </div>
              </label>
            </div>
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Secret Key *</label>
            <input
              className="w-full border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition-colors font-mono bg-background"
              placeholder="dqIt0LQWa_yM8oF..."
              type="text"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
            />
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground rounded-lg py-2.5 text-sm transition-colors flex justify-center items-center gap-2"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            Salvar chaves
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
