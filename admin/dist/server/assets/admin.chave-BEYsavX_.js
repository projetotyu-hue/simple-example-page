import { r as reactExports, U as jsxRuntimeExports } from "./worker-entry-BK0h1eJs.js";
import { A as AdminLayout } from "./AdminLayout-D1Ns8z5y.js";
import { L as LoaderCircle, s as supabase } from "./useAuth-BDGmCldG.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./router-BORuSdfU.js";
function ChavePage() {
  const [gatewayMode, setGatewayMode] = reactExports.useState("bearer");
  const [secretKey, setSecretKey] = reactExports.useState("");
  const [settingsId, setSettingsId] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const [saving, setSaving] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const [success, setSuccess] = reactExports.useState(null);
  reactExports.useEffect(() => {
    async function load() {
      setLoading(true);
      const {
        data,
        error: error2
      } = await supabase.from("settings").select("id, gateway_mode, gateway_secret_key").limit(1).single();
      if (data) {
        setSettingsId(data.id);
        setGatewayMode(data.gateway_mode || "bearer");
        setSecretKey(data.gateway_secret_key || "");
      } else if (error2 && error2.code !== "PGRST116") {
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
        gateway_mode: gatewayMode,
        gateway_secret_key: secretKey
      };
      if (settingsId) {
        const {
          error: error2
        } = await supabase.from("settings").update(updates).eq("id", settingsId);
        if (error2) throw error2;
      } else {
        const {
          data,
          error: error2
        } = await supabase.from("settings").insert([updates]).select().single();
        if (error2) throw error2;
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
    return /* @__PURE__ */ jsxRuntimeExports.jsx(AdminLayout, { title: "Chave StreetPay", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center p-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-6 w-6 animate-spin text-muted-foreground" }) }) });
  }
  const bearerClass = "flex items-start gap-3 border rounded-xl px-4 py-3 cursor-pointer transition-colors " + (gatewayMode === "bearer" ? "border-primary bg-primary/10" : "border-border");
  const basicClass = "flex items-start gap-3 border rounded-xl px-4 py-3 cursor-pointer transition-colors " + (gatewayMode === "basic" ? "border-primary bg-primary/10" : "border-border");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminLayout, { title: "Chave StreetPay", children: [
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive", children: error }),
    success && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-600 dark:text-green-400", children: success }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-xl border border-border p-6 flex flex-col gap-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs text-muted-foreground mb-3", children: "Modo de autenticação" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: bearerClass, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "mt-0.5", type: "radio", name: "gatewayMode", value: "bearer", checked: gatewayMode === "bearer", onChange: () => setGatewayMode("bearer") }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "Bearer Token (novo)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Usa apenas a Secret Key. Modo atual da Streetpay." })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: basicClass, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "mt-0.5", type: "radio", name: "gatewayMode", value: "basic", checked: gatewayMode === "basic", onChange: () => setGatewayMode("basic") }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "Basic Auth (legado)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Usa Public Key + Secret Key. Método anterior." })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs text-muted-foreground mb-1", children: "Secret Key *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "w-full border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition-colors font-mono bg-background", placeholder: "dqIt0LQWa_yM8oF...", type: "text", value: secretKey, onChange: (e) => setSecretKey(e.target.value) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleSave, disabled: saving, className: "bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground rounded-lg py-2.5 text-sm transition-colors flex justify-center items-center gap-2", children: [
        saving && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin" }),
        "Salvar chaves"
      ] })
    ] }) })
  ] });
}
export {
  ChavePage as component
};
