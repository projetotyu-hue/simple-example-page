import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ImagePlus, X, ShieldCheck, DollarSign, Type, Layout } from "lucide-react";

export const Route = createFileRoute("/admin/configuracoes")({
  head: () => ({ meta: [{ title: "Configurações — Achadinhos Admin" }] }),
  component: ConfiguracoesPage,
});

type Settings = {
  id?: string;
  shop_name: string | null;
  logo_url: string | null;
  sold_count: string | null;
  tracking_link: string | null;
  head_script: string | null;
  cnpj: string | null;
  address: string | null;
  email: string | null;
  phone: string | null;
  hours: string | null;
  rating: string | null;
  followers: string | null;
};

const defaultSettings: Settings = {
  shop_name: "Achadinhos do Momento",
  logo_url: "",
  sold_count: "0",
  tracking_link: "https://www.correios.com.br/rastreamento",
  head_script: "",
  cnpj: "",
  address: "",
  email: "",
  phone: "",
  hours: "",
  rating: "98%",
  followers: "0",
};

function ConfiguracoesPage() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data, error } = await supabase.from("settings").select("*").limit(1).maybeSingle();
      if (data) {
        setSettings({ 
          ...defaultSettings, 
          ...data
        });
      } else if (error) {
        console.error("Error loading settings:", error);
        setError("Erro ao carregar as configurações da loja.");
      }
      setLoading(false);
    }
    void load();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setSaving(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `logo-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: publicUrl } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);

      setSettings((prev) => ({ ...prev, logo_url: publicUrl.publicUrl }));
    } catch (err) {
      alert("Erro ao enviar a imagem. Verifique as permissões do Storage.");
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      // Clean up the object and ensure we use a consistent ID
      const SETTINGS_ID = "00000000-0000-0000-0000-000000000000";
      const { id, ...dataToSave } = settings;
      const payload = { id: id || SETTINGS_ID, ...dataToSave };

      console.log("Saving settings with payload:", payload);

      const { data, error } = await supabase
        .from("settings")
        .upsert(payload)
        .select()
        .single();

      if (error) throw error;
      if (data) setSettings(data as Settings);
      
      setSuccess("Configurações salvas com sucesso!");
    } catch (err: any) {
      console.error("Error saving settings:", err);
      let errorMsg = "Não foi possível salvar as configurações.";
      if (err.message?.includes("row-level security policy")) {
        errorMsg = "Erro de Permissão (RLS). Seu usuário não tem a role 'admin' ou a regra do banco está bloqueando este salvamento específico.";
      } else {
        errorMsg += ` Detalhes: ${err.message}`;
      }
      setError(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Configurações">
        <div className="flex justify-center p-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Configurações">
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

      <div className="max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border border-border p-6 flex flex-col gap-5">
          {/* Logo Section */}
          <div>
            <label className="block text-xs text-muted-foreground mb-2 font-medium">Logo da loja</label>
            <div className="flex items-center gap-4 bg-muted/30 p-3 rounded-lg border border-dashed border-border">
              <div className="w-16 h-16 rounded-full bg-background overflow-hidden flex items-center justify-center shrink-0 border border-border">
                {settings.logo_url ? (
                  <img className="w-full h-full object-cover" src={settings.logo_url} alt="Logo" />
                ) : (
                  <span className="text-muted-foreground font-bold text-xl">L</span>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-primary hover:opacity-80">
                  <ImagePlus className="w-4 h-4" /> Enviar imagem
                  <input accept="image/*" className="hidden" type="file" ref={fileInputRef} onChange={handleImageUpload} disabled={saving} />
                </label>
                <button
                  onClick={() => setSettings(s => ({ ...s, logo_url: "" }))}
                  className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-destructive"
                  disabled={saving}
                >
                  <X className="w-3 h-3" /> Remover
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs text-muted-foreground mb-1">Nome da loja</label>
            <input name="shop_name" value={settings.shop_name || ""} onChange={handleChange} className="w-full border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition-colors bg-background" placeholder="Nome da sua loja" type="text" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-muted-foreground mb-1">CNPJ</label>
              <input name="cnpj" value={settings.cnpj || ""} onChange={handleChange} disabled className="w-full border border-border rounded-lg px-3 py-2 text-sm outline-none bg-muted/50 text-muted-foreground cursor-not-allowed" placeholder="00.000.000/0001-00" type="text" />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Telefone</label>
              <input name="phone" value={settings.phone || ""} onChange={handleChange} disabled className="w-full border border-border rounded-lg px-3 py-2 text-sm outline-none bg-muted/50 text-muted-foreground cursor-not-allowed" placeholder="(00) 00000-0000" type="text" />
            </div>
          </div>

          <div>
            <label className="block text-xs text-muted-foreground mb-1">Email de suporte</label>
            <input name="email" value={settings.email || ""} onChange={handleChange} disabled className="w-full border border-border rounded-lg px-3 py-2 text-sm outline-none bg-muted/50 text-muted-foreground cursor-not-allowed" placeholder="suporte@loja.com" type="email" />
          </div>

          <div>
            <label className="block text-xs text-muted-foreground mb-1">Endereço</label>
            <input name="address" value={settings.address || ""} onChange={handleChange} disabled className="w-full border border-border rounded-lg px-3 py-2 text-sm outline-none bg-muted/50 text-muted-foreground cursor-not-allowed" placeholder="Rua, Número, Bairro, Cidade - UF" type="text" />
          </div>

          <div>
            <label className="block text-xs text-muted-foreground mb-1">Horário de funcionamento</label>
            <input name="hours" value={settings.hours || ""} onChange={handleChange} disabled className="w-full border border-border rounded-lg px-3 py-2 text-sm outline-none bg-muted/50 text-muted-foreground cursor-not-allowed" placeholder="Segunda a Sexta, das 9h às 18h" type="text" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Número de vendidos</label>
              <input name="sold_count" value={settings.sold_count || ""} onChange={handleChange} className="w-full border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition-colors bg-background" placeholder="Ex: 140.292" type="text" />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Link de rastreamento</label>
              <input name="tracking_link" value={settings.tracking_link || ""} onChange={handleChange} className="w-full border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition-colors bg-background" placeholder="https://www.correios.com.br/rastreamento" type="text" />
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <p className="text-xs font-bold text-foreground mb-1 uppercase tracking-wider">Script do head</p>
            <p className="text-[10px] text-muted-foreground mb-3">Será injetado no &lt;head&gt; de todas as páginas da loja.</p>
            <textarea name="head_script" value={settings.head_script || ""} onChange={handleChange} className="w-full border border-border rounded-lg px-3 py-2 text-xs outline-none focus:border-primary transition-colors resize-none font-mono bg-muted/50" rows={4} placeholder="<script>...</script>"></textarea>
          </div>

          <div className="border-t border-border pt-4">
            <p className="text-xs font-bold text-foreground mb-4 uppercase tracking-wider">Estatísticas</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-muted-foreground mb-1">Avaliação (%)</label>
                <input name="rating" value={settings.rating || ""} onChange={handleChange} className="w-full border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition-colors bg-background" placeholder="Ex: 98%" type="text" />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">Seguidores</label>
                <input name="followers" value={settings.followers || ""} onChange={handleChange} className="w-full border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition-colors bg-background" placeholder="Ex: 3.2M" type="text" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-card rounded-xl border border-border p-6 flex flex-col gap-4">
            <p className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
              <Layout className="w-4 h-4 text-primary" /> Preview Rodapé
            </p>
            <div className="text-[10px] text-muted-foreground space-y-1 bg-muted/30 p-4 rounded-xl border border-border">
              <p className="font-bold text-foreground mb-2">{settings.shop_name}</p>
              <p>CNPJ: {settings.cnpj || "00.000.000/0001-00"}</p>
              <p>{settings.address || "Endereço da loja, Cidade - UF"}</p>
              <p>{settings.email || "suporte@loja.com"}</p>
              <p>{settings.hours || "Segunda a Sexta, das 9h às 18h"}</p>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground rounded-lg py-3 text-sm font-bold shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 active:translate-y-0 flex justify-center items-center gap-2"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            Salvar todas as configurações
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
