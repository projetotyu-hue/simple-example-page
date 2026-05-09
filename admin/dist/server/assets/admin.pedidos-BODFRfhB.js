import { r as reactExports, U as jsxRuntimeExports } from "./worker-entry-BK0h1eJs.js";
import { A as AdminLayout, C as ChevronDown, a as ChevronRight } from "./AdminLayout-D1Ns8z5y.js";
import { L as LoaderCircle, s as supabase } from "./useAuth-BDGmCldG.js";
import { S as Search } from "./search-gILV_ome.js";
import { S as ShoppingCart } from "./shopping-cart-C1-B6ytg.js";
import { C as ChevronLeft } from "./chevron-left-m3Y3Hlqz.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./router-BORuSdfU.js";
function PedidosPage() {
  const [items, setItems] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(null);
  const [searchTerm, setSearchTerm] = reactExports.useState("");
  reactExports.useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      let query = supabase.from("orders").select(`
          *,
          customers(name, email)
        `).order("created_at", {
        ascending: false
      });
      const {
        data,
        error: error2
      } = await query;
      if (error2) {
        if (error2.code !== "42P01") {
          setError("Erro ao carregar pedidos.");
        }
      } else {
        let filtered = data;
        if (searchTerm) {
          const lower = searchTerm.toLowerCase();
          filtered = filtered.filter((o) => o.id.toLowerCase().includes(lower) || o.customers?.name?.toLowerCase().includes(lower) || o.customers?.email?.toLowerCase().includes(lower));
        }
        setItems(filtered);
      }
      setLoading(false);
    }
    const timeoutId = setTimeout(() => {
      void load();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);
  const formatCurrency = (val) => {
    return `R$ ${Number(val || 0).toFixed(2).replace(".", ",")}`;
  };
  const formatDate = (isoString) => {
    const d = new Date(isoString);
    return `${d.toLocaleDateString("pt-BR")}, ${d.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit"
    })}`;
  };
  const getStatusBadge = (status) => {
    if (status === "Pago") return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs px-2 py-1 rounded-full font-medium w-fit text-green-600 bg-green-50", children: status });
    if (status === "Aguardando Pix") return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs px-2 py-1 rounded-full font-medium w-fit text-blue-600 bg-blue-50", children: status });
    if (status === "Pendente") return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs px-2 py-1 rounded-full font-medium w-fit text-yellow-600 bg-yellow-50", children: status });
    return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs px-2 py-1 rounded-full font-medium w-fit text-foreground bg-muted", children: status || "Desconhecido" });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminLayout, { title: "Pedidos", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
      items.length,
      " pedidos"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 bg-muted/50 border border-border rounded-lg px-3 py-2 mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "w-4 h-4 text-muted-foreground shrink-0" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { placeholder: "Buscar por ID, nome ou email...", className: "flex-1 bg-transparent text-sm outline-none text-foreground placeholder-gray-400", type: "text", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value) })
    ] }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700", children: error }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card rounded-xl border border-border overflow-hidden", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-12 flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-6 w-6 animate-spin text-muted-foreground" }) }) : items.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-12 text-center text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { className: "h-8 w-8 mx-auto mb-2 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "Nenhum pedido encontrado." })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3 border-b border-border bg-muted/50", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "ID / CLIENTE" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "PRODUTOS" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "FRETE" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "DESCONTO" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "TOTAL" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "PAGAMENTO" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "AÇÕES" })
      ] }),
      items.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b border-gray-50 last:border-b-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3.5 items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 mb-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-semibold text-foreground", children: [
            "#",
            o.id.slice(0, 8)
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-foreground truncate", children: o.customers?.name || "Cliente Desconhecido" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate", children: o.customers?.email || "—" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground", children: formatCurrency(o.products_total) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground", children: formatCurrency(o.shipping_total) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground", children: formatCurrency(o.discount_total) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: formatCurrency(o.total) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: formatDate(o.created_at) })
        ] }),
        getStatusBadge(o.status),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "w-3 h-3" }),
          " Ver itens"
        ] })
      ] }) }, o.id)),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-1 mt-4 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { disabled: true, className: "p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-4 h-4" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "w-8 h-8 rounded-lg text-sm transition-colors bg-primary text-white font-medium", children: "1" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { disabled: true, className: "p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-4 h-4" }) })
      ] })
    ] }) })
  ] });
}
export {
  PedidosPage as component
};
