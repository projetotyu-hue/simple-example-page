import { r as reactExports, U as jsxRuntimeExports } from "./worker-entry-BK0h1eJs.js";
import { A as AdminLayout } from "./AdminLayout-D1Ns8z5y.js";
import { L as LoaderCircle, s as supabase } from "./useAuth-BDGmCldG.js";
import { T as Trash2, P as Plus } from "./trash-2-De-lS6-V.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./router-BORuSdfU.js";
const defaultShipping = [{
  id: "1",
  name: "Frete Grátis",
  price: "0.00",
  deadline: "12 dias úteis",
  active: true
}, {
  id: "2",
  name: "Entrega Padrão",
  price: "19.90",
  deadline: "10 dias úteis",
  active: true
}, {
  id: "3",
  name: "Entrega Expressa",
  price: "29.90",
  deadline: "7 dias úteis",
  active: true
}];
function FretePage() {
  const [rates, setRates] = reactExports.useState(defaultShipping);
  const [settingsId, setSettingsId] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const [saving, setSaving] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const [success, setSuccess] = reactExports.useState(null);
  const [newName, setNewName] = reactExports.useState("");
  const [newPrice, setNewPrice] = reactExports.useState("");
  const [newDeadline, setNewDeadline] = reactExports.useState("");
  const [newActive, setNewActive] = reactExports.useState(true);
  reactExports.useEffect(() => {
    async function load() {
      setLoading(true);
      const {
        data,
        error: error2
      } = await supabase.from("settings").select("id, shipping_rates").limit(1).single();
      if (data) {
        setSettingsId(data.id);
        if (data.shipping_rates && Array.isArray(data.shipping_rates) && data.shipping_rates.length > 0) {
          const normalized = data.shipping_rates.map((r) => ({
            id: r.id || Date.now().toString(),
            name: r.name || "",
            price: String(r.price || "0"),
            deadline: r.deadline || r.days || "",
            active: r.active !== void 0 ? r.active : true
          }));
          setRates(normalized);
        }
      } else if (error2 && error2.code !== "PGRST116") {
        setError("Erro ao carregar configurações.");
      }
      setLoading(false);
    }
    void load();
  }, []);
  const saveToDb = async (newRates) => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const {
        data: sett
      } = await supabase.from("settings").select("id").limit(1).maybeSingle();
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
    } catch (err) {
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
  const handleToggleActive = (id) => {
    const newRates = rates.map((r) => r.id === id ? {
      ...r,
      active: !r.active
    } : r);
    void saveToDb(newRates);
  };
  const handleDelete = (id) => {
    const newRates = rates.filter((r) => r.id !== id);
    void saveToDb(newRates);
  };
  const handleAdd = () => {
    if (!newName.trim()) {
      alert("O nome do frete é obrigatório.");
      return;
    }
    const newRate = {
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
  const formatCurrency = (val) => {
    const num = parseFloat(val);
    if (isNaN(num) || num === 0) return "Grátis";
    return "R$ " + num.toFixed(2).replace(".", ",");
  };
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(AdminLayout, { title: "Frete", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center p-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-6 w-6 animate-spin text-muted-foreground" }) }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminLayout, { title: "Frete", children: [
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700", children: error }),
    success && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700", children: success }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card rounded-xl border border-border overflow-hidden mb-6", children: rates.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-8 text-center text-muted-foreground text-sm", children: "Nenhuma opção de frete cadastrada." }) : rates.map((rate, idx) => {
        const rowClass = idx !== rates.length - 1 ? "flex items-center gap-4 px-5 py-3.5 border-b border-gray-50" : "flex items-center gap-4 px-5 py-3.5";
        const toggleClass = rate.active ? "relative w-9 h-5 rounded-full transition-colors shrink-0 bg-primary" : "relative w-9 h-5 rounded-full transition-colors shrink-0 bg-muted";
        const knobClass = rate.active ? "absolute top-0.5 left-0.5 w-4 h-4 bg-card rounded-full shadow transition-transform translate-x-4" : "absolute top-0.5 left-0.5 w-4 h-4 bg-card rounded-full shadow transition-transform translate-x-0";
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: rowClass, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: rate.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              formatCurrency(rate.price),
              " · ",
              rate.deadline
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleToggleActive(rate.id), disabled: saving, className: toggleClass, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: knobClass }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleDelete(rate.id), disabled: saving, className: "p-2 rounded-lg text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4" }) })
        ] }, rate.id);
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-xl border border-border p-6 max-w-lg", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-medium text-foreground mb-4 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4 text-primary" }),
          "Nova opção de frete"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs text-muted-foreground mb-1", children: "Nome *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "w-full border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition-colors", placeholder: "Ex: Frete Grátis, Expresso...", type: "text", value: newName, onChange: (e) => setNewName(e.target.value) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs text-muted-foreground mb-1", children: "Valor (R$)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { step: "0.01", className: "w-full border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition-colors", placeholder: "0,00 para grátis", type: "number", value: newPrice, onChange: (e) => setNewPrice(e.target.value) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs text-muted-foreground mb-1", children: "Prazo (Ex: 7-10 dias)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "w-full border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition-colors", placeholder: "Ex: 5-8 dias úteis", type: "text", value: newDeadline, onChange: (e) => setNewDeadline(e.target.value) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setNewActive(!newActive), className: newActive ? "relative w-9 h-5 rounded-full transition-colors bg-primary" : "relative w-9 h-5 rounded-full transition-colors bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: newActive ? "absolute top-0.5 left-0.5 w-4 h-4 bg-card rounded-full shadow transition-transform translate-x-4" : "absolute top-0.5 left-0.5 w-4 h-4 bg-card rounded-full shadow transition-transform translate-x-0" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Ativo" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleAdd, disabled: saving, className: "bg-primary hover:bg-primary/90 disabled:opacity-50 text-white rounded-lg py-2.5 text-sm transition-colors flex justify-center items-center gap-2 mt-2", children: [
            saving && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin" }),
            "Criar opção"
          ] })
        ] })
      ] })
    ] })
  ] });
}
export {
  FretePage as component
};
