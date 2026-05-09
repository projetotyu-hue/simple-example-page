import { r as reactExports, U as jsxRuntimeExports } from "./worker-entry-BK0h1eJs.js";
import { A as AdminLayout } from "./AdminLayout-D1Ns8z5y.js";
import { L as LoaderCircle, s as supabase } from "./useAuth-BDGmCldG.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./router-BORuSdfU.js";
function TiktokPage() {
  const [pixelId, setPixelId] = reactExports.useState("");
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
      } = await supabase.from("settings").select("id, tiktok_pixel_id").limit(1).single();
      if (data) {
        setSettingsId(data.id);
        setPixelId(data.tiktok_pixel_id || "");
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
      if (settingsId) {
        const {
          error: error2
        } = await supabase.from("settings").update({
          tiktok_pixel_id: pixelId
        }).eq("id", settingsId);
        if (error2) throw error2;
      } else {
        const {
          data,
          error: error2
        } = await supabase.from("settings").insert([{
          tiktok_pixel_id: pixelId
        }]).select().single();
        if (error2) throw error2;
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
    return /* @__PURE__ */ jsxRuntimeExports.jsx(AdminLayout, { title: "TikTok", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center p-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-6 w-6 animate-spin text-muted-foreground" }) }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminLayout, { title: "TikTok", children: [
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700", children: error }),
    success && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700", children: success }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-md", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-xl border border-border p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs text-muted-foreground mb-1", children: "TikTok Pixel ID" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "w-full border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition-colors", placeholder: "Ex: CDX9XXXX...", type: "text", value: pixelId, onChange: (e) => setPixelId(e.target.value) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleSave, disabled: saving, className: "w-full bg-primary hover:bg-primary/90 disabled:opacity-50 text-white rounded-lg py-2.5 text-sm transition-colors flex justify-center items-center gap-2", children: [
        saving && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin" }),
        "Salvar"
      ] })
    ] }) })
  ] });
}
export {
  TiktokPage as component
};
