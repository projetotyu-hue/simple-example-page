import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/admin/whosamungus")({
  head: () => ({ meta: [{ title: "WhosAmungUs — Achadinhos Admin" }] }),
  component: WhosamungusPage,
});

function WhosamungusPage() {
  const [siteId, setSiteId] = useState("");
  const [settingsId, setSettingsId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data, error } = await supabase.from("settings").select("id, whosamungus_id").limit(1).single();
      if (data) {
        setSettingsId(data.id);
        setSiteId(data.whosamungus_id || "");
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
        const { error } = await supabase.from("settings").update({ whosamungus_id: siteId }).eq("id", settingsId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from("settings").insert([{ whosamungus_id: siteId }]).select().single();
        if (error) throw error;
        if (data) setSettingsId(data.id);
      }
      setSuccess("WhosAmungUs salvo com sucesso!");
    } catch (err) {
      setError("Não foi possível salvar.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="WhosAmungUs">
        <div className="flex justify-center p-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="WhosAmungUs">
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
            <label className="block text-xs text-muted-foreground mb-1">Whos.AmungUs Site ID</label>
            <input 
              className="w-full border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition-colors" 
              placeholder="Ex: xxxxxxxxxx" 
              type="text" 
              value={siteId}
              onChange={(e) => setSiteId(e.target.value)}
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
