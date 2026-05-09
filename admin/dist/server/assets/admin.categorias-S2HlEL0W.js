import { r as reactExports, U as jsxRuntimeExports } from "./worker-entry-BK0h1eJs.js";
import { A as AdminLayout, X } from "./AdminLayout-D1Ns8z5y.js";
import { L as LoaderCircle, s as supabase } from "./useAuth-BDGmCldG.js";
import { P as Plus, T as Trash2 } from "./trash-2-De-lS6-V.js";
import { T as Tag } from "./tag-CG9QqyQO.js";
import { P as Pencil } from "./pencil-BfzpVuHk.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./router-BORuSdfU.js";
function slugify(s) {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
function CategoriasPage() {
  const [items, setItems] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(null);
  const [editing, setEditing] = reactExports.useState(null);
  const [showForm, setShowForm] = reactExports.useState(false);
  async function load() {
    setLoading(true);
    setError(null);
    const [c, p] = await Promise.all([supabase.from("categories").select("*").order("name", {
      ascending: true
    }), supabase.from("products").select("category_id")]);
    if (c.error) setError("Erro ao carregar categorias");
    const cats = c.data ?? [];
    const prods = p.data ?? [];
    const mapped = cats.map((cat) => ({
      ...cat,
      productCount: prods.filter((prod) => prod.category_id === cat.id).length
    }));
    setItems(mapped);
    setLoading(false);
  }
  reactExports.useEffect(() => {
    void load();
  }, []);
  async function handleDelete(id) {
    if (!confirm("Excluir esta categoria?")) return;
    const {
      error: error2
    } = await supabase.from("categories").delete().eq("id", id);
    if (error2) {
      alert("Erro ao excluir");
      return;
    }
    setItems((prev) => prev.filter((c) => c.id !== id));
  }
  const [searchTerm, setSearchTerm] = reactExports.useState("");
  const filteredItems = items.filter((cat) => cat.name.toLowerCase().includes(searchTerm.toLowerCase()));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminLayout, { title: "Categorias", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
        filteredItems.length,
        " categorias"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
        setEditing(null);
        setShowForm(true);
      }, className: "flex items-center gap-2 bg-primary hover:bg-primary/90 text-white text-sm px-4 py-2 rounded-lg transition-colors", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
        "Nova categoria"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 bg-muted/50 border border-border rounded-lg px-3 py-2 mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: "lucide lucide-search text-muted-foreground shrink-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "m21 21-4.34-4.34" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "11", cy: "11", r: "8" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { placeholder: "Buscar categoria...", className: "flex-1 bg-transparent text-sm outline-none text-foreground placeholder-gray-400", type: "text", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value) })
    ] }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700", children: error }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card rounded-xl border border-border overflow-hidden", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-12 flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-6 w-6 animate-spin text-muted-foreground" }) }) : filteredItems.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-12 text-center text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "h-8 w-8 mx-auto mb-2 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "Nenhuma categoria encontrada." })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      filteredItems.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-5 py-3.5 border-b border-gray-50 last:border-b-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: c.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: c.productCount === 1 ? "1 produto" : `${c.productCount || 0} produtos` })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
            setEditing(c);
            setShowForm(true);
          }, className: "p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => void handleDelete(c.id), className: "p-2 rounded-lg text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) })
        ] })
      ] }, c.id)),
      items.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-1 mt-4 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { disabled: true, className: "p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: "lucide lucide-chevron-left", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "m15 18-6-6 6-6" }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "w-8 h-8 rounded-lg text-sm transition-colors bg-primary text-white font-medium", children: "1" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { disabled: true, className: "p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: "lucide lucide-chevron-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "m9 18 6-6-6-6" }) }) })
      ] })
    ] }) }),
    showForm && /* @__PURE__ */ jsxRuntimeExports.jsx(CategoryFormModal, { category: editing, onClose: () => setShowForm(false), onSaved: () => {
      setShowForm(false);
      void load();
    } })
  ] });
}
function CategoryFormModal({
  category,
  onClose,
  onSaved
}) {
  const [name, setName] = reactExports.useState(category?.name ?? "");
  const [slug, setSlug] = reactExports.useState(category?.slug ?? "");
  const [saving, setSaving] = reactExports.useState(false);
  const [err, setErr] = reactExports.useState(null);
  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) {
      setErr("Informe o nome");
      return;
    }
    setSaving(true);
    setErr(null);
    const payload = {
      name: name.trim(),
      slug: slug.trim() || slugify(name)
    };
    const {
      error
    } = category ? await supabase.from("categories").update(payload).eq("id", category.id) : await supabase.from("categories").insert(payload);
    setSaving(false);
    if (error) {
      setErr("Erro ao salvar");
      return;
    }
    onSaved();
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-2xl w-full max-w-md p-6 shadow-xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-semibold text-foreground", children: category ? "Editar categoria" : "Nova categoria" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "p-1 rounded-lg hover:bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4 text-muted-foreground" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-medium text-foreground mb-1", children: "Nome" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: name, onChange: (e) => setName(e.target.value), className: "w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary", autoFocus: true })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-xs font-medium text-foreground mb-1", children: [
          "Slug ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "(opcional)" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: slug, onChange: (e) => setSlug(e.target.value), placeholder: slugify(name) || "auto", className: "w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary" })
      ] }),
      err && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-red-600", children: err }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2 pt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: onClose, className: "px-4 py-2 rounded-lg text-sm text-foreground hover:bg-muted", children: "Cancelar" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "submit", disabled: saving, className: "px-4 py-2 rounded-lg text-sm bg-primary hover:bg-primary/90 text-white disabled:opacity-60 inline-flex items-center gap-2", children: [
          saving && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
          "Salvar"
        ] })
      ] })
    ] })
  ] }) });
}
export {
  CategoriasPage as component
};
