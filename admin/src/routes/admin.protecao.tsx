import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ImagePlus, X } from "lucide-react";

export const Route = createFileRoute("/admin/protecao")({
  head: () => ({ meta: [{ title: "Proteção Prod. — Achadinhos Admin" }] }),
  component: ProtecaoPage,
});

type Protection = {
  enabled: boolean;
  title: string;
  price: number;
  original_price: number;
  image_url: string;
};

const defaultProtection: Protection = {
  enabled: true,
  title: "Proteção Total com Seguro",
  price: 26.14,
  original_price: 382.00,
  image_url: "https://imgur.com/p8wx3bjk2d.webp",
};

function ProtecaoPage() {
  const [protection, setProtection] = useState<Protection>(defaultProtection);
  const [settingsId, setSettingsId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data, error } = await supabase.from("settings").select("id, protection_product").limit(1).single();
      if (data) {
        setSettingsId(data.id);
        if (data.protection_product && typeof data.protection_product === 'object' && Object.keys(data.protection_product).length > 0) {
          setProtection({ ...defaultProtection, ...(data.protection_product as Protection) });
        }
      } else if (error && error.code !== "PGRST116") {
        setError("Erro ao carregar configurações.");
      }
      setLoading(false);
    }
    void load();
  }, []);

  const handleChange = (field: keyof Protection, val: string | boolean | number) => {
    setProtection(prev => ({ ...prev, [field]: val }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setSaving(true);
      const fileExt = file.name.split('.').pop();
      const fileName = "protection-" + Date.now() + "." + fileExt;
      const { error: uploadError } = await supabase.storage.from('product-images').upload(fileName, file);
      if (uploadError) throw uploadError;
      const { data: publicUrl } = supabase.storage.from('product-images').getPublicUrl(fileName);
      setProtection(prev => ({ ...prev, image_url: publicUrl.publicUrl }));
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
      if (settingsId) {
        const { error } = await supabase.from("settings").update({ protection_product: protection }).eq("id", settingsId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from("settings").insert([{ protection_product: protection }]).select().single();
        if (error) throw error;
        if (data) setSettingsId(data.id);
      }
      setSuccess("Proteção da loja salva com sucesso!");
    } catch (err: any) {
      console.error("Error saving protection:", err);
      let errorMsg = "Não foi possível salvar.";
      if (err.message?.includes("row-level security policy")) {
        errorMsg = "Erro de Permissão (RLS). Seu usuário não tem a role 'admin' no banco de dados.";
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
      <AdminLayout title="Proteção Prod.">
        <div className="flex justify-center p-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </AdminLayout>
    );
  }

  const toggleClass = protection.enabled
    ? "relative w-11 h-6 rounded-full transition-colors bg-primary"
    : "relative w-11 h-6 rounded-full transition-colors bg-muted";
  const knobClass = protection.enabled
    ? "absolute top-0.5 left-0.5 w-5 h-5 bg-card rounded-full shadow transition-transform translate-x-5"
    : "absolute top-0.5 left-0.5 w-5 h-5 bg-card rounded-full shadow transition-transform translate-x-0";

  return (
    <AdminLayout title="Proteção Prod.">
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      )}

      <div className="bg-card rounded-xl border border-border p-6 max-w-lg flex flex-col gap-4">
        <div>
          <label className="block text-xs text-muted-foreground mb-1">Título da Proteção</label>
          <input
            className="w-full border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition-colors bg-background"
            placeholder="Ex: Proteção Total com Seguro"
            type="text"
            value={protection.title}
            onChange={e => handleChange('title', e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Preço (R$)</label>
            <input
              step="0.01"
              className="w-full border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition-colors bg-background"
              placeholder="0,00"
              type="number"
              value={protection.price}
              onChange={e => handleChange('price', parseFloat(e.target.value))}
            />
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Preço original (R$)</label>
            <input
              step="0.01"
              className="w-full border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition-colors bg-background"
              placeholder="0,00"
              type="number"
              value={protection.original_price}
              onChange={e => handleChange('original_price', parseFloat(e.target.value))}
            />
          </div>
        </div>
        <div>
          <label className="block text-xs text-muted-foreground mb-2">Imagem</label>
          <div className="flex items-center gap-4 bg-muted/30 p-3 rounded-lg border border-border">
            <div className="w-16 h-16 bg-background rounded-lg border border-border flex items-center justify-center shrink-0">
              {protection.image_url ? (
                <img className="w-full h-full object-contain" src={protection.image_url} alt="Proteção" />
              ) : (
                <span className="text-2xl">🛡️</span>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label className="cursor-pointer text-xs font-bold text-primary hover:underline">
                Trocar Imagem
                <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} disabled={saving} />
              </label>
              {protection.image_url && (
                <button
                  onClick={() => handleChange('image_url', '')}
                  className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-red-500"
                >
                  <X className="w-3 h-3" /> Remover
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between py-2 border-t border-border mt-2">
          <div>
            <p className="text-sm font-medium text-foreground">Ativar Proteção</p>
            <p className="text-xs text-muted-foreground">Exibe a proteção no checkout</p>
          </div>
          <button onClick={() => handleChange('enabled', !protection.enabled)} className={toggleClass}>
            <span className={knobClass}></span>
          </button>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-primary hover:bg-primary/90 disabled:opacity-50 text-white rounded-lg py-3 text-sm font-bold shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 active:translate-y-0 flex justify-center items-center gap-2"
        >
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          Salvar
        </button>
      </div>
    </AdminLayout>
  );
}
