import { r as reactExports, U as jsxRuntimeExports } from "./worker-entry-BK0h1eJs.js";
import { A as AdminLayout } from "./AdminLayout-D1Ns8z5y.js";
import { c as createLucideIcon, L as LoaderCircle, s as supabase } from "./useAuth-BDGmCldG.js";
import { T as Tag } from "./tag-CG9QqyQO.js";
import { S as ShoppingCart } from "./shopping-cart-C1-B6ytg.js";
import { S as Search } from "./search-gILV_ome.js";
import { P as Plus, T as Trash2 } from "./trash-2-De-lS6-V.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./router-BORuSdfU.js";
const __iconNode = [
  ["path", { d: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71", key: "1cjeqo" }],
  ["path", { d: "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71", key: "19qd67" }]
];
const Link = createLucideIcon("link", __iconNode);
function RelacionadosPage() {
  const [activeTab, setActiveTab] = reactExports.useState("product");
  const [allProducts, setAllProducts] = reactExports.useState([]);
  const [baseProduct, setBaseProduct] = reactExports.useState(null);
  const [settings, setSettings] = reactExports.useState(null);
  const [selectedProductId, setSelectedProductId] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(true);
  const [saving, setSaving] = reactExports.useState(false);
  const [searchTerm, setSearchTerm] = reactExports.useState("");
  const [message, setMessage] = reactExports.useState(null);
  async function loadData() {
    setLoading(true);
    try {
      const {
        data: productsData,
        error: pError
      } = await supabase.from("products").select("id, name, image_url, related_product_ids").order("name");
      if (pError) throw pError;
      if (productsData) {
        setAllProducts(productsData);
        if (baseProduct) {
          const updated = productsData.find((p) => p.id === baseProduct.id);
          if (updated) setBaseProduct(updated);
        }
      }
      const {
        data: settingsData,
        error: sError
      } = await supabase.from("settings").select("id, cart_recommendations").limit(1).maybeSingle();
      if (sError) throw sError;
      if (settingsData) {
        setSettings(settingsData);
      }
    } catch (err) {
      console.error("Error loading data:", err);
      let errorMsg = err.message;
      if (err.message?.includes("column products.related_product_ids does not exist") || err.message?.includes("column settings.cart_recommendations does not exist")) {
        errorMsg = "Colunas faltando no banco de dados. Vá ao SQL Editor do Supabase e rode: \n\nALTER TABLE public.products ADD COLUMN IF NOT EXISTS related_product_ids UUID[] DEFAULT '{}'; \nALTER TABLE public.settings ADD COLUMN IF NOT EXISTS cart_recommendations UUID[] DEFAULT '{}';";
      }
      setMessage({
        text: errorMsg,
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  }
  reactExports.useEffect(() => {
    void loadData();
  }, []);
  const showMessage = (text, type) => {
    setMessage({
      text,
      type
    });
    setTimeout(() => setMessage(null), 3e3);
  };
  const handleAdd = async () => {
    if (!selectedProductId) return;
    setSaving(true);
    try {
      if (activeTab === "product" && baseProduct) {
        const currentIds = baseProduct.related_product_ids || [];
        if (currentIds.includes(selectedProductId)) {
          showMessage("Produto já está vinculado.", "error");
          return;
        }
        const newIds = [...currentIds, selectedProductId];
        const {
          error
        } = await supabase.from("products").update({
          related_product_ids: newIds
        }).eq("id", baseProduct.id);
        if (error) throw error;
        setBaseProduct({
          ...baseProduct,
          related_product_ids: newIds
        });
        setAllProducts(allProducts.map((p) => p.id === baseProduct.id ? {
          ...p,
          related_product_ids: newIds
        } : p));
        showMessage("Produto vinculado com sucesso!", "success");
      } else if (activeTab === "global") {
        let currentSettings = settings;
        if (!currentSettings) {
          const {
            data: existing
          } = await supabase.from("settings").select("id, cart_recommendations").limit(1).maybeSingle();
          if (existing) {
            currentSettings = existing;
            setSettings(existing);
          } else {
            const {
              data: created,
              error: createError
            } = await supabase.from("settings").insert([{
              shop_name: "Minha Loja"
            }]).select().single();
            if (createError) throw createError;
            currentSettings = created;
            setSettings(created);
          }
        }
        if (!currentSettings) throw new Error("Não foi possível carregar as configurações.");
        const currentIds = currentSettings.cart_recommendations || [];
        if (currentIds.includes(selectedProductId)) {
          showMessage("Produto já está vinculado.", "error");
          return;
        }
        const newIds = [...currentIds, selectedProductId];
        const {
          error
        } = await supabase.from("settings").update({
          cart_recommendations: newIds
        }).eq("id", currentSettings.id);
        if (error) throw error;
        setSettings({
          ...currentSettings,
          cart_recommendations: newIds
        });
        showMessage("Sugestão global adicionada!", "success");
      }
      setSelectedProductId("");
    } catch (err) {
      console.error("Error adding related product:", err);
      let errorMsg = err.message;
      if (err.message?.includes("row-level security policy")) {
        errorMsg = "Erro de Permissão (RLS). Seu usuário não tem a role 'admin' no banco de dados.";
      }
      showMessage("Erro ao salvar: " + errorMsg, "error");
    } finally {
      setSaving(false);
    }
  };
  const handleRemove = async (id) => {
    setSaving(true);
    try {
      if (activeTab === "product" && baseProduct) {
        const newIds = (baseProduct.related_product_ids || []).filter((rid) => rid !== id);
        const {
          error
        } = await supabase.from("products").update({
          related_product_ids: newIds
        }).eq("id", baseProduct.id);
        if (error) throw error;
        setBaseProduct({
          ...baseProduct,
          related_product_ids: newIds
        });
        setAllProducts(allProducts.map((p) => p.id === baseProduct.id ? {
          ...p,
          related_product_ids: newIds
        } : p));
        showMessage("Vínculo removido.", "success");
      } else if (activeTab === "global" && settings) {
        const newIds = (settings.cart_recommendations || []).filter((rid) => rid !== id);
        const {
          error
        } = await supabase.from("settings").update({
          cart_recommendations: newIds
        }).eq("id", settings.id);
        if (error) throw error;
        setSettings({
          ...settings,
          cart_recommendations: newIds
        });
        showMessage("Sugestão global removida.", "success");
      }
    } catch (err) {
      console.error("Error removing related product:", err);
      showMessage("Erro ao remover: " + err.message, "error");
    } finally {
      setSaving(false);
    }
  };
  const currentRelatedIds = activeTab === "product" ? baseProduct?.related_product_ids || [] : settings?.cart_recommendations || [];
  const relatedProducts = allProducts.filter((p) => currentRelatedIds.includes(p.id));
  const availableProducts = allProducts.filter((p) => {
    if (activeTab === "product") {
      return p.id !== baseProduct?.id && !currentRelatedIds.includes(p.id);
    }
    return !currentRelatedIds.includes(p.id);
  });
  if (loading && allProducts.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(AdminLayout, { title: "Relacionados", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center p-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-6 w-6 animate-spin text-muted-foreground" }) }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminLayout, { title: "Relacionados", children: [
    message && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `mb-6 p-4 rounded-xl border animate-in fade-in slide-in-from-top duration-300 ${message.type === "success" ? "bg-green-50 border-green-100 text-green-700" : "bg-red-50 border-red-100 text-red-700"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-2 h-2 rounded-full ${message.type === "success" ? "bg-green-500" : "bg-red-500"}` }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold", children: message.text })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 mb-8 bg-muted/30 p-1.5 rounded-xl border border-border w-fit shadow-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setActiveTab("product"), className: `flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === "product" ? "bg-primary text-white shadow-lg shadow-primary/30" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "w-4 h-4" }),
        "Por Produto"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setActiveTab("global"), className: `flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === "global" ? "bg-primary text-white shadow-lg shadow-primary/30" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { className: "w-4 h-4" }),
        "Sugestões do Carrinho"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8", children: [
      activeTab === "product" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-xl border border-border overflow-hidden shadow-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 border-b border-border bg-muted/20", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-foreground mb-2", children: "1. Selecione o Produto Base" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 bg-background border border-border rounded-lg px-3 py-1.5 focus-within:border-primary transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "w-4 h-4 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { placeholder: "Filtrar produtos...", className: "bg-transparent text-sm outline-none flex-1", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-[600px] overflow-y-auto divide-y divide-border", children: allProducts.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setBaseProduct(p), className: `w-full text-left p-4 flex items-center gap-4 transition-all ${baseProduct?.id === p.id ? "bg-primary/5 border-l-4 border-l-primary" : "hover:bg-muted/30"}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-lg bg-background border border-border overflow-hidden shrink-0 flex items-center justify-center p-1", children: p.image_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: p.image_url, alt: p.name, className: "w-full h-full object-contain" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "w-5 h-5 text-muted-foreground" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-sm font-semibold truncate ${baseProduct?.id === p.id ? "text-primary" : "text-foreground"}`, children: p.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground uppercase tracking-wider font-bold", children: [
              (p.related_product_ids || []).length,
              " relacionados"
            ] })
          ] })
        ] }, p.id)) })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-xl border border-border p-10 text-center space-y-5 shadow-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto shadow-inner", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { className: "w-10 h-10 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-xs mx-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold text-foreground", children: "Sugestões Globais" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed mt-2", children: 'Estes produtos aparecerão na seção "Você também pode gostar" do carrinho e checkout, independente do produto selecionado.' })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-wider", children: "⚠️ Aparece no Checkout" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6", children: activeTab === "product" && !baseProduct ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-xl border border-border p-12 text-center text-muted-foreground shadow-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { className: "h-12 w-12 mx-auto mb-4 opacity-10" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: "Selecione um produto à esquerda para gerenciar seus relacionados." })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card rounded-xl border border-border p-6 shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { className: "w-4 h-4 text-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-bold text-foreground", children: activeTab === "product" ? "Produtos Relacionados" : "Sugestões do Carrinho" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-6", children: activeTab === "product" ? `Gerenciando vínculos para: ${baseProduct?.name}` : "Configure os produtos que serão recomendados globalmente no carrinho." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mb-8 bg-muted/20 p-2 rounded-xl border border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: selectedProductId, onChange: (e) => setSelectedProductId(e.target.value), className: "flex-1 border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary transition-all bg-background shadow-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Selecione um produto..." }),
            availableProducts.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: p.id, children: p.name }, p.id))
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleAdd, disabled: !selectedProductId || saving, className: "bg-primary hover:bg-primary/90 disabled:opacity-50 text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 shrink-0 shadow-lg shadow-primary/20", children: [
            saving ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
            "Adicionar"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: relatedProducts.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-8 border-2 border-dashed border-border rounded-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Nenhum produto adicionado ainda." }) }) : relatedProducts.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-3 border border-border rounded-lg bg-muted/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            p.image_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: p.image_url, alt: p.name, className: "w-10 h-10 object-cover rounded bg-white border border-border" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 bg-muted rounded border border-border" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-foreground line-clamp-1", children: p.name })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleRemove(p.id), disabled: saving, className: "p-2 text-muted-foreground hover:text-red-600 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) })
        ] }, p.id)) })
      ] }) }) })
    ] })
  ] });
}
export {
  RelacionadosPage as component
};
