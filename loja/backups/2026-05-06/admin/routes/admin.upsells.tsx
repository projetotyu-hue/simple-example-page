import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/admin/upsells")({
  head: () => ({ meta: [{ title: "Upsells - Achadinhos Admin" }] }),
  component: UpsellsPage,
});

type Upsell = {
  title: string;
  value: string;
};

const defaultUpsells: Upsell[] = [
  { title: "TENF (Taxa de Emissao da Nota Fiscal)", value: "19.90" },
  { title: "Validacao CEP", value: "29.90" },
  { title: "Imposto Sobre Operacoes Financeiras (IOF)", value: "39.90" },
  { title: "Reembolso", value: "49.90" },
];

const UpsellsPage = () => {
  const [upsells, setUpsells] = useState<Upsell[]>(defaultUpsells);
  const [settingsId, setSettingsId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingIndex, setSavingIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data, error } = await supabase
        .from("settings")
        .select("id, upsells")
        .limit(1)
        .single();
      if (data) {
        setSettingsId(data.id);
        if (data.upsells && Array.isArray(data.upsells) && data.upsells.length > 0) {
          const loaded = data.upsells as Upsell[];
          const merged = defaultUpsells.map((def, i) => loaded[i] || def);
          setUpsells(merged);
        }
      } else if (error && error.code !== "PGRST116") {
        setError("Erro ao carregar configuracoes.");
      }
      setLoading(false);
    }
    void load();
  }, []);

  const handleChange = (index: number, field: keyof Upsell, val: string) => {
    const newUpsells = [...upsells];
    newUpsells[index] = { ...newUpsells[index], [field]: val };
    setUpsells(newUpsells);
  };

  const handleSave = async (index: number) => {
    setSavingIndex(index);
    setError(null);
    setSuccess(null);
    try {
      if (settingsId) {
        const { error } = await supabase
          .from("settings")
          .update({ upsells })
          .eq("id", settingsId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("settings")
          .insert([{ upsells }])
          .select()
          .single();
        if (error) throw error;
        if (data) setSettingsId(data.id);
      }
      setSuccess("Upsell " + (index + 1) + " salvo com sucesso!");
    } catch {
      setError("Nao foi possivel salvar o upsell.");
    } finally {
      setSavingIndex(null);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Upsells">
        <div className="flex justify-center p-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Upsells">
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

      <div className="flex flex-col gap-4 max-w-lg">
        {upsells.map((upsell, index) => (
          <div key={index} className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-primary">{index + 1}</span>
              </div>
              <p className="text-sm font-semibold text-foreground">Upsell {index + 1}</p>
            </div>
            <div className="flex flex-col gap-3">
              <div>
                <label className="block text-xs text-muted-foreground mb-1">Titulo</label>
                <input
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition-colors"
                  placeholder="Ex: Taxa de Emissao de Nota Fiscal"
                  type="text"
                  value={upsell.title}
                  onChange={(e) => handleChange(index, "title", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">Valor (R$)</label>
                <input
                  step="0.01"
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition-colors"
                  placeholder="0,00"
                  type="number"
                  value={upsell.value}
                  onChange={(e) => handleChange(index, "value", e.target.value)}
                />
              </div>
              <button
                onClick={() => handleSave(index)}
                disabled={savingIndex !== null}
                className="bg-primary hover:bg-primary/90 disabled:opacity-50 text-white rounded-lg py-2.5 text-sm transition-colors flex justify-center items-center gap-2"
              >
                {savingIndex === index && <Loader2 className="w-4 h-4 animate-spin" />}
                Salvar
              </button>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
