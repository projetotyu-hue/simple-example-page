import { r as reactExports, U as jsxRuntimeExports } from "./worker-entry-BK0h1eJs.js";
import { A as AdminLayout, X } from "./AdminLayout-D1Ns8z5y.js";
import { c as createLucideIcon, L as LoaderCircle, s as supabase } from "./useAuth-BDGmCldG.js";
import { I as ImagePlus } from "./image-plus-yxs4hOD7.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./router-BORuSdfU.js";
const __iconNode = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }],
  ["path", { d: "M3 9h18", key: "1pudct" }],
  ["path", { d: "M9 21V9", key: "1oto5p" }]
];
const PanelsTopLeft = createLucideIcon("panels-top-left", __iconNode);
const defaultSettings = {
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
  followers: "0"
};
function ConfiguracoesPage() {
  const [settings, setSettings] = reactExports.useState(defaultSettings);
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
      } = await supabase.from("settings").select("*").limit(1).maybeSingle();
      if (data) {
        setSettings({
          ...defaultSettings,
          ...data
        });
      } else if (error2) {
        console.error("Error loading settings:", error2);
        setError("Erro ao carregar as configurações da loja.");
      }
      setLoading(false);
    }
    void load();
  }, []);
  const handleChange = (e) => {
    const {
      name,
      value
    } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: value
    }));
  };
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setSaving(true);
      const fileExt = file.name.split(".").pop();
      const fileName = `logo-${Date.now()}.${fileExt}`;
      const {
        error: uploadError
      } = await supabase.storage.from("product-images").upload(fileName, file);
      if (uploadError) throw uploadError;
      const {
        data: publicUrl
      } = supabase.storage.from("product-images").getPublicUrl(fileName);
      setSettings((prev) => ({
        ...prev,
        logo_url: publicUrl.publicUrl
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
      const SETTINGS_ID = "00000000-0000-0000-0000-000000000000";
      const {
        id,
        ...dataToSave
      } = settings;
      const payload = {
        id: id || SETTINGS_ID,
        ...dataToSave
      };
      console.log("Saving settings with payload:", payload);
      const {
        data,
        error: error2
      } = await supabase.from("settings").upsert(payload).select().single();
      if (error2) throw error2;
      if (data) setSettings(data);
      setSuccess("Configurações salvas com sucesso!");
    } catch (err) {
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
    return /* @__PURE__ */ jsxRuntimeExports.jsx(AdminLayout, { title: "Configurações", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center p-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-6 w-6 animate-spin text-muted-foreground" }) }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminLayout, { title: "Configurações", children: [
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive", children: error }),
    success && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-600 dark:text-green-400", children: success }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-xl border border-border p-6 flex flex-col gap-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs text-muted-foreground mb-2 font-medium", children: "Logo da loja" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 bg-muted/30 p-3 rounded-lg border border-dashed border-border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-full bg-background overflow-hidden flex items-center justify-center shrink-0 border border-border", children: settings.logo_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { className: "w-full h-full object-cover", src: settings.logo_url, alt: "Logo" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-bold text-xl", children: "L" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 cursor-pointer text-xs font-semibold text-primary hover:opacity-80", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ImagePlus, { className: "w-4 h-4" }),
                " Enviar imagem",
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { accept: "image/*", className: "hidden", type: "file", ref: fileInputRef, onChange: handleImageUpload, disabled: saving })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setSettings((s) => ({
                ...s,
                logo_url: ""
              })), className: "flex items-center gap-1 text-[10px] text-muted-foreground hover:text-destructive", disabled: saving, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3 h-3" }),
                " Remover"
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs text-muted-foreground mb-1", children: "Nome da loja" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { name: "shop_name", value: settings.shop_name || "", onChange: handleChange, className: "w-full border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition-colors bg-background", placeholder: "Nome da sua loja", type: "text" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs text-muted-foreground mb-1", children: "CNPJ" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { name: "cnpj", value: settings.cnpj || "", onChange: handleChange, disabled: true, className: "w-full border border-border rounded-lg px-3 py-2 text-sm outline-none bg-muted/50 text-muted-foreground cursor-not-allowed", placeholder: "00.000.000/0001-00", type: "text" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs text-muted-foreground mb-1", children: "Telefone" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { name: "phone", value: settings.phone || "", onChange: handleChange, disabled: true, className: "w-full border border-border rounded-lg px-3 py-2 text-sm outline-none bg-muted/50 text-muted-foreground cursor-not-allowed", placeholder: "(00) 00000-0000", type: "text" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs text-muted-foreground mb-1", children: "Email de suporte" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { name: "email", value: settings.email || "", onChange: handleChange, disabled: true, className: "w-full border border-border rounded-lg px-3 py-2 text-sm outline-none bg-muted/50 text-muted-foreground cursor-not-allowed", placeholder: "suporte@loja.com", type: "email" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs text-muted-foreground mb-1", children: "Endereço" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { name: "address", value: settings.address || "", onChange: handleChange, disabled: true, className: "w-full border border-border rounded-lg px-3 py-2 text-sm outline-none bg-muted/50 text-muted-foreground cursor-not-allowed", placeholder: "Rua, Número, Bairro, Cidade - UF", type: "text" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs text-muted-foreground mb-1", children: "Horário de funcionamento" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { name: "hours", value: settings.hours || "", onChange: handleChange, disabled: true, className: "w-full border border-border rounded-lg px-3 py-2 text-sm outline-none bg-muted/50 text-muted-foreground cursor-not-allowed", placeholder: "Segunda a Sexta, das 9h às 18h", type: "text" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs text-muted-foreground mb-1", children: "Número de vendidos" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { name: "sold_count", value: settings.sold_count || "", onChange: handleChange, className: "w-full border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition-colors bg-background", placeholder: "Ex: 140.292", type: "text" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs text-muted-foreground mb-1", children: "Link de rastreamento" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { name: "tracking_link", value: settings.tracking_link || "", onChange: handleChange, className: "w-full border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition-colors bg-background", placeholder: "https://www.correios.com.br/rastreamento", type: "text" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border pt-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-foreground mb-1 uppercase tracking-wider", children: "Script do head" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground mb-3", children: "Será injetado no <head> de todas as páginas da loja." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { name: "head_script", value: settings.head_script || "", onChange: handleChange, className: "w-full border border-border rounded-lg px-3 py-2 text-xs outline-none focus:border-primary transition-colors resize-none font-mono bg-muted/50", rows: 4, placeholder: "<script>...<\/script>" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border pt-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-foreground mb-4 uppercase tracking-wider", children: "Estatísticas" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs text-muted-foreground mb-1", children: "Avaliação (%)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { name: "rating", value: settings.rating || "", onChange: handleChange, className: "w-full border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition-colors bg-background", placeholder: "Ex: 98%", type: "text" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs text-muted-foreground mb-1", children: "Seguidores" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { name: "followers", value: settings.followers || "", onChange: handleChange, className: "w-full border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition-colors bg-background", placeholder: "Ex: 3.2M", type: "text" })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-xl border border-border p-6 flex flex-col gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(PanelsTopLeft, { className: "w-4 h-4 text-primary" }),
            " Preview Rodapé"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-muted-foreground space-y-1 bg-muted/30 p-4 rounded-xl border border-border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-foreground mb-2", children: settings.shop_name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
              "CNPJ: ",
              settings.cnpj || "00.000.000/0001-00"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: settings.address || "Endereço da loja, Cidade - UF" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: settings.email || "suporte@loja.com" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: settings.hours || "Segunda a Sexta, das 9h às 18h" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleSave, disabled: saving, className: "bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground rounded-lg py-3 text-sm font-bold shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 active:translate-y-0 flex justify-center items-center gap-2", children: [
          saving && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin" }),
          "Salvar todas as configurações"
        ] })
      ] })
    ] })
  ] });
}
export {
  ConfiguracoesPage as component
};
