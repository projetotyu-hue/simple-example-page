import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin/frete")({
  head: () => ({ meta: [{ title: "Frete — Achadinhos Admin" }] }),
  component: FretePage,
});

type ShippingOption = {
  id: string;
  name: string;
  price: string;
  deadline: string;
  active: boolean;
};

const defaultShipping: ShippingOption[] = [
  { id: '1', name: "Frete Grátis", price: "0.00", deadline: "12 dias úteis", active: true },
  { id: '2', name: "Entrega Padrão", price: "19.90", deadline: "10 dias úteis", active: true },
  { id: '3', name: "Entrega Expressa", price: "29.90", deadline: "7 dias úteis", active: true },
];

function FretePage() {
  const [rates, setRates] = useState<ShippingOption[]>(defaultShipping);
  const [settingsId, setSettingsId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newDeadline, setNewDeadline] = useState("");
  const [newActive, setNewActive] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data, error } = await supabase.from("settings").select("id, shipping_rates").limit(1).single();
      if (data) {
        setSettingsId(data.id);
        if (data.shipping_rates && Array.isArray(data.shipping_rates) && data.shipping_rates.length > 0) {
          // Normalize data if it comes from old schema
          const normalized = (data.shipping_rates as any[]).map(r => ({
            id: r.id || Date.now().toString(),
            name: r.name || "",
            price: String(r.price || "0"),
            deadline: r.deadline || r.days || "",
            active: r.active !== undefined ? r.active : true
          }));
          setRates(normalized);
        }
      } else if (error && error.code !== "PGRST116") {
        setError("Erro ao carregar configurações.");
      }
      setLoading(false);
    }
    void load();
  }, []);

  const saveToDb = async (newRates: ShippingOption[]) => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      // Get the existing settings row first to be safe
      const { data: sett } = await supabase.from("settings").select("id").limit(1).maybeSingle();
      
      const payload = { 
        shipping_rates: newRates 
      };

      let result;
      if (sett?.id) {
        result = await supabase.from("settings").update(payload).eq("id", sett.id);
      } else {
        result = await supabase.from("settings").insert([payload]).select().single();
      }

      if (result.error) throw result.error;
      
      setRates(newRates);
      setSuccess("Configurações de frete atualizadas!");
    } catch (err: any) {
      console.error("Error saving shipping:", err);
      let errorMsg = "Não foi possível salvar o frete.";
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

  const handleToggleActive = (id: string) => {
    const newRates = rates.map(r => r.id === id ? { ...r, active: !r.active } : r);
    void saveToDb(newRates);
  };

  const handleDelete = (id: string) => {
    const newRates = rates.filter(r => r.id !== id);
    void saveToDb(newRates);
  };

  const handleAdd = () => {
    if (!newName.trim()) {
      alert("O nome do frete é obrigatório.");
      return;
    }
    const newRate: ShippingOption = {
      id: Date.now().toString(),
      name: newName,
      price: newPrice || "0",
      deadline: newDeadline || "0 dias úteis",
      active: newActive
    };
    const newRates = [...rates, newRate];
    void saveToDb(newRates).then(() => {
      setNewName("");
      setNewPrice("");
      setNewDeadline("");
      setNewActive(true);
    });
  };

  const formatCurrency = (val: string) => {
    const num = parseFloat(val);
    if (isNaN(num) || num === 0) return "Grátis";
    return "R$ " + num.toFixed(2).replace('.', ',');
  };

  if (loading) {
    return (
      <AdminLayout title="Frete">
        <div className="flex justify-center p-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Frete">
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

      <div className="max-w-2xl">
        <div className="bg-card rounded-xl border border-border overflow-hidden mb-6">
          {rates.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm">Nenhuma opção de frete cadastrada.</div>
          ) : (
            rates.map((rate, idx) => {
              const rowClass = idx !== rates.length - 1 ? "flex items-center gap-4 px-5 py-3.5 border-b border-gray-50" : "flex items-center gap-4 px-5 py-3.5";
              const toggleClass = rate.active ? "relative w-9 h-5 rounded-full transition-colors shrink-0 bg-primary" : "relative w-9 h-5 rounded-full transition-colors shrink-0 bg-muted";
              const knobClass = rate.active ? "absolute top-0.5 left-0.5 w-4 h-4 bg-card rounded-full shadow transition-transform translate-x-4" : "absolute top-0.5 left-0.5 w-4 h-4 bg-card rounded-full shadow transition-transform translate-x-0";
              return (
                <div key={rate.id} className={rowClass}>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{rate.name}</p>
                    <p className="text-xs text-muted-foreground">{formatCurrency(rate.price)} · {rate.deadline}</p>
                  </div>
                  <button onClick={() => handleToggleActive(rate.id)} disabled={saving} className={toggleClass}>
                    <span className={knobClass}></span>
                  </button>
                  <button onClick={() => handleDelete(rate.id)} disabled={saving} className="p-2 rounded-lg text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        <div className="bg-card rounded-xl border border-border p-6 max-w-lg">
          <p className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
            <Plus className="w-4 h-4 text-primary" />
            Nova opção de frete
          </p>
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Nome *</label>
              <input
                className="w-full border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition-colors"
                placeholder="Ex: Frete Grátis, Expresso..."
                type="text"
                value={newName}
                onChange={e => setNewName(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-muted-foreground mb-1">Valor (R$)</label>
                <input
                  step="0.01"
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition-colors"
                  placeholder="0,00 para grátis"
                  type="number"
                  value={newPrice}
                  onChange={e => setNewPrice(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">Prazo (Ex: 7-10 dias)</label>
                <input
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition-colors"
                  placeholder="Ex: 5-8 dias úteis"
                  type="text"
                  value={newDeadline}
                  onChange={e => setNewDeadline(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setNewActive(!newActive)}
                className={newActive ? "relative w-9 h-5 rounded-full transition-colors bg-primary" : "relative w-9 h-5 rounded-full transition-colors bg-muted"}
              >
                <span className={newActive ? "absolute top-0.5 left-0.5 w-4 h-4 bg-card rounded-full shadow transition-transform translate-x-4" : "absolute top-0.5 left-0.5 w-4 h-4 bg-card rounded-full shadow transition-transform translate-x-0"}></span>
              </button>
              <span className="text-xs text-muted-foreground">Ativo</span>
            </div>
            <button
              onClick={handleAdd}
              disabled={saving}
              className="bg-primary hover:bg-primary/90 disabled:opacity-50 text-white rounded-lg py-2.5 text-sm transition-colors flex justify-center items-center gap-2 mt-2"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              Criar opção
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
