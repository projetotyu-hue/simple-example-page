import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/admin/tiktok")({
  head: () => ({ meta: [{ title: "TikTok Pixel — Achadinhos Admin" }] }),
  component: TiktokPage,
});

function TiktokPage() {
  const [pixelId, setPixelId] = useState("");
  const [settingsId, setSettingsId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data, error } = await supabase.from("settings").select("id, tiktok_pixel_id").limit(1).single();
      if (data) {
        setSettingsId(data.id);
        setPixelId(data.tiktok_pixel_id || "");
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
      if (settingsId) {
        const { error } = await supabase.from("settings").update({ tiktok_pixel_id: pixelId }).eq("id", settingsId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from("settings").insert([{ tiktok_pixel_id: pixelId }]).select().single();
        if (error) throw error;
        if (data) setSettingsId(data.id);
      }
      setSuccess("TikTok Pixel salvo com sucesso!");
    } catch (err) {
      setError("Não foi possível salvar.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="TikTok">
        <div className="flex justify-center p-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="TikTok">
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

      <div className="max-w-md">
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="mb-6">
            <label className="block text-xs text-muted-foreground mb-1">TikTok Pixel ID</label>
            <input 
              className="w-full border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition-colors" 
              placeholder="Ex: CDX9XXXX..." 
              type="text" 
              value={pixelId}
              onChange={(e) => setPixelId(e.target.value)}
            />
          </div>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 text-white rounded-lg py-2.5 text-sm transition-colors flex justify-center items-center gap-2"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            Salvar
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
