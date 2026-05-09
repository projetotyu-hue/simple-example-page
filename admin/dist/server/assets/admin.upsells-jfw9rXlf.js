import { r as reactExports, U as jsxRuntimeExports } from "./worker-entry-BK0h1eJs.js";
import { A as AdminLayout } from "./AdminLayout-D1Ns8z5y.js";
import { L as LoaderCircle, s as supabase } from "./useAuth-BDGmCldG.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./router-BORuSdfU.js";
const defaultUpsells = [{
  title: "TENF (Taxa de Emissao da Nota Fiscal)",
  value: "19.90"
}, {
  title: "Validacao CEP",
  value: "29.90"
}, {
  title: "Imposto Sobre Operacoes Financeiras (IOF)",
  value: "39.90"
}, {
  title: "Reembolso",
  value: "49.90"
}];
const UpsellsPage = () => {
  const [upsells, setUpsells] = reactExports.useState(defaultUpsells);
  const [settingsId, setSettingsId] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const [savingIndex, setSavingIndex] = reactExports.useState(null);
  const [error, setError] = reactExports.useState(null);
  const [success, setSuccess] = reactExports.useState(null);
  reactExports.useEffect(() => {
    async function load() {
      setLoading(true);
      const {
        data,
        error: error2
      } = await supabase.from("settings").select("id, upsells").limit(1).single();
      if (data) {
        setSettingsId(data.id);
        if (data.upsells && Array.isArray(data.upsells) && data.upsells.length > 0) {
          const loaded = data.upsells;
          const merged = defaultUpsells.map((def, i) => loaded[i] || def);
          setUpsells(merged);
        }
      } else if (error2 && error2.code !== "PGRST116") {
        setError("Erro ao carregar configuracoes.");
      }
      setLoading(false);
    }
    void load();
  }, []);
  const handleChange = (index, field, val) => {
    const newUpsells = [...upsells];
    newUpsells[index] = {
      ...newUpsells[index],
      [field]: val
    };
    setUpsells(newUpsells);
  };
  const handleSave = async (index) => {
    setSavingIndex(index);
    setError(null);
    setSuccess(null);
    try {
      if (settingsId) {
        const {
          error: error2
        } = await supabase.from("settings").update({
          upsells
        }).eq("id", settingsId);
        if (error2) throw error2;
      } else {
        const {
          data,
          error: error2
        } = await supabase.from("settings").insert([{
          upsells
        }]).select().single();
        if (error2) throw error2;
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
    return /* @__PURE__ */ jsxRuntimeExports.jsx(AdminLayout, { title: "Upsells", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center p-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-6 w-6 animate-spin text-muted-foreground" }) }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminLayout, { title: "Upsells", children: [
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700", children: error }),
    success && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700", children: success }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-4 max-w-lg", children: upsells.map((upsell, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-xl border border-border p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold text-primary", children: index + 1 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-semibold text-foreground", children: [
          "Upsell ",
          index + 1
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs text-muted-foreground mb-1", children: "Titulo" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "w-full border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition-colors", placeholder: "Ex: Taxa de Emissao de Nota Fiscal", type: "text", value: upsell.title, onChange: (e) => handleChange(index, "title", e.target.value) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs text-muted-foreground mb-1", children: "Valor (R$)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { step: "0.01", className: "w-full border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition-colors", placeholder: "0,00", type: "number", value: upsell.value, onChange: (e) => handleChange(index, "value", e.target.value) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => handleSave(index), disabled: savingIndex !== null, className: "bg-primary hover:bg-primary/90 disabled:opacity-50 text-white rounded-lg py-2.5 text-sm transition-colors flex justify-center items-center gap-2", children: [
          savingIndex === index && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin" }),
          "Salvar"
        ] })
      ] })
    ] }, index)) })
  ] });
};
export {
  UpsellsPage as component
};
