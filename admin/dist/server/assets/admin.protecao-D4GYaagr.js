import { r as reactExports, U as jsxRuntimeExports } from "./worker-entry-BK0h1eJs.js";
import { A as AdminLayout, X } from "./AdminLayout-D1Ns8z5y.js";
import { L as LoaderCircle, s as supabase } from "./useAuth-BDGmCldG.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./router-BORuSdfU.js";
const defaultProtection = {
  enabled: true,
  title: "Proteção Total com Seguro",
  price: 26.14,
  original_price: 382,
  image_url: "https://imgur.com/p8wx3bjk2d.webp"
};
function ProtecaoPage() {
  const [protection, setProtection] = reactExports.useState(defaultProtection);
  const [settingsId, setSettingsId] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const [saving, setSaving] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const [success, setSuccess] = reactExports.useState(null);
  const fileInputRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    async function load() {
      setLoading(true);
      const {
        data,
        error: error2
      } = await supabase.from("settings").select("id, protection_product").limit(1).single();
      if (data) {
        setSettingsId(data.id);
        if (data.protection_product && typeof data.protection_product === "object" && Object.keys(data.protection_product).length > 0) {
          setProtection({
            ...defaultProtection,
            ...data.protection_product
          });
        }
      } else if (error2 && error2.code !== "PGRST116") {
        setError("Erro ao carregar configurações.");
      }
      setLoading(false);
    }
    void load();
  }, []);
  const handleChange = (field, val) => {
    setProtection((prev) => ({
      ...prev,
      [field]: val
    }));
  };
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setSaving(true);
      const fileExt = file.name.split(".").pop();
      const fileName = "protection-" + Date.now() + "." + fileExt;
      const {
        error: uploadError
      } = await supabase.storage.from("product-images").upload(fileName, file);
      if (uploadError) throw uploadError;
      const {
        data: publicUrl
      } = supabase.storage.from("product-images").getPublicUrl(fileName);
      setProtection((prev) => ({
        ...prev,
        image_url: publicUrl.publicUrl
      }));
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
        const {
          error: error2
        } = await supabase.from("settings").update({
          protection_product: protection
        }).eq("id", settingsId);
        if (error2) throw error2;
      } else {
        const {
          data,
          error: error2
        } = await supabase.from("settings").insert([{
          protection_product: protection
        }]).select().single();
        if (error2) throw error2;
        if (data) setSettingsId(data.id);
      }
      setSuccess("Proteção da loja salva com sucesso!");
    } catch (err) {
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
    return /* @__PURE__ */ jsxRuntimeExports.jsx(AdminLayout, { title: "Proteção Prod.", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center p-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-6 w-6 animate-spin text-muted-foreground" }) }) });
  }
  const toggleClass = protection.enabled ? "relative w-11 h-6 rounded-full transition-colors bg-primary" : "relative w-11 h-6 rounded-full transition-colors bg-muted";
  const knobClass = protection.enabled ? "absolute top-0.5 left-0.5 w-5 h-5 bg-card rounded-full shadow transition-transform translate-x-5" : "absolute top-0.5 left-0.5 w-5 h-5 bg-card rounded-full shadow transition-transform translate-x-0";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminLayout, { title: "Proteção Prod.", children: [
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700", children: error }),
    success && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700", children: success }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-xl border border-border p-6 max-w-lg flex flex-col gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs text-muted-foreground mb-1", children: "Título da Proteção" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "w-full border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition-colors bg-background", placeholder: "Ex: Proteção Total com Seguro", type: "text", value: protection.title, onChange: (e) => handleChange("title", e.target.value) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs text-muted-foreground mb-1", children: "Preço (R$)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { step: "0.01", className: "w-full border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition-colors bg-background", placeholder: "0,00", type: "number", value: protection.price, onChange: (e) => handleChange("price", parseFloat(e.target.value)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs text-muted-foreground mb-1", children: "Preço original (R$)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { step: "0.01", className: "w-full border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition-colors bg-background", placeholder: "0,00", type: "number", value: protection.original_price, onChange: (e) => handleChange("original_price", parseFloat(e.target.value)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs text-muted-foreground mb-2", children: "Imagem" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 bg-muted/30 p-3 rounded-lg border border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 bg-background rounded-lg border border-border flex items-center justify-center shrink-0", children: protection.image_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { className: "w-full h-full object-contain", src: protection.image_url, alt: "Proteção" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl", children: "🛡️" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "cursor-pointer text-xs font-bold text-primary hover:underline", children: [
              "Trocar Imagem",
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "file", accept: "image/*", className: "hidden", ref: fileInputRef, onChange: handleImageUpload, disabled: saving })
            ] }),
            protection.image_url && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => handleChange("image_url", ""), className: "flex items-center gap-1 text-[10px] text-muted-foreground hover:text-red-500", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3 h-3" }),
              " Remover"
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between py-2 border-t border-border mt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "Ativar Proteção" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Exibe a proteção no checkout" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleChange("enabled", !protection.enabled), className: toggleClass, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: knobClass }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleSave, disabled: saving, className: "bg-primary hover:bg-primary/90 disabled:opacity-50 text-white rounded-lg py-3 text-sm font-bold shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 active:translate-y-0 flex justify-center items-center gap-2", children: [
        saving && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin" }),
        "Salvar"
      ] })
    ] })
  ] });
}
export {
  ProtecaoPage as component
};
