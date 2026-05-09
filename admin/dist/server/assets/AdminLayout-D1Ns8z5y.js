import { M as useRouter, r as reactExports, U as jsxRuntimeExports } from "./worker-entry-BK0h1eJs.js";
import { f as useNavigate, u as useTheme, c as cn, L as Link } from "./router-BORuSdfU.js";
import { c as createLucideIcon, A as AtSign, E as Eye, B as Button, s as supabase, f as useAuth, L as LoaderCircle } from "./useAuth-BDGmCldG.js";
function useLocation(opts) {
  const router = useRouter();
  {
    const location = router.stores.location.get();
    return location;
  }
}
const __iconNode$e = [["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]];
const ChevronDown = createLucideIcon("chevron-down", __iconNode$e);
const __iconNode$d = [["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]];
const ChevronRight = createLucideIcon("chevron-right", __iconNode$d);
const __iconNode$c = [
  ["path", { d: "m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4", key: "g0fldk" }],
  ["path", { d: "m21 2-9.6 9.6", key: "1j0ho8" }],
  ["circle", { cx: "7.5", cy: "15.5", r: "5.5", key: "yqb3hr" }]
];
const Key = createLucideIcon("key", __iconNode$c);
const __iconNode$b = [
  ["rect", { width: "7", height: "9", x: "3", y: "3", rx: "1", key: "10lvy0" }],
  ["rect", { width: "7", height: "5", x: "14", y: "3", rx: "1", key: "16une8" }],
  ["rect", { width: "7", height: "9", x: "14", y: "12", rx: "1", key: "1hutg5" }],
  ["rect", { width: "7", height: "5", x: "3", y: "16", rx: "1", key: "ldoo1y" }]
];
const LayoutDashboard = createLucideIcon("layout-dashboard", __iconNode$b);
const __iconNode$a = [
  ["path", { d: "m16 17 5-5-5-5", key: "1bji2h" }],
  ["path", { d: "M21 12H9", key: "dn1m92" }],
  ["path", { d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4", key: "1uf3rs" }]
];
const LogOut = createLucideIcon("log-out", __iconNode$a);
const __iconNode$9 = [
  ["path", { d: "M4 5h16", key: "1tepv9" }],
  ["path", { d: "M4 12h16", key: "1lakjw" }],
  ["path", { d: "M4 19h16", key: "1djgab" }]
];
const Menu = createLucideIcon("menu", __iconNode$9);
const __iconNode$8 = [
  [
    "path",
    {
      d: "M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z",
      key: "1a0edw"
    }
  ],
  ["path", { d: "M12 22V12", key: "d0xqtd" }],
  ["polyline", { points: "3.29 7 12 12 20.71 7", key: "ousv84" }],
  ["path", { d: "m7.5 4.27 9 5.15", key: "1c824w" }]
];
const Package = createLucideIcon("package", __iconNode$8);
const __iconNode$7 = [
  [
    "path",
    {
      d: "M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",
      key: "1i5ecw"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
];
const Settings = createLucideIcon("settings", __iconNode$7);
const __iconNode$6 = [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ]
];
const Shield = createLucideIcon("shield", __iconNode$6);
const __iconNode$5 = [
  ["path", { d: "M16 10a4 4 0 0 1-8 0", key: "1ltviw" }],
  ["path", { d: "M3.103 6.034h17.794", key: "awc11p" }],
  [
    "path",
    {
      d: "M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z",
      key: "o988cm"
    }
  ]
];
const ShoppingBag = createLucideIcon("shopping-bag", __iconNode$5);
const __iconNode$4 = [
  [
    "path",
    {
      d: "M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z",
      key: "1s2grr"
    }
  ],
  ["path", { d: "M20 2v4", key: "1rf3ol" }],
  ["path", { d: "M22 4h-4", key: "gwowj6" }],
  ["circle", { cx: "4", cy: "20", r: "2", key: "6kqj1y" }]
];
const Sparkles = createLucideIcon("sparkles", __iconNode$4);
const __iconNode$3 = [
  ["path", { d: "M16 7h6v6", key: "box55l" }],
  ["path", { d: "m22 7-8.5 8.5-5-5L2 17", key: "1t1m79" }]
];
const TrendingUp = createLucideIcon("trending-up", __iconNode$3);
const __iconNode$2 = [
  ["path", { d: "M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2", key: "wrbu53" }],
  ["path", { d: "M15 18H9", key: "1lyqi6" }],
  [
    "path",
    {
      d: "M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14",
      key: "lysw3i"
    }
  ],
  ["circle", { cx: "17", cy: "18", r: "2", key: "332jqn" }],
  ["circle", { cx: "7", cy: "18", r: "2", key: "19iecd" }]
];
const Truck = createLucideIcon("truck", __iconNode$2);
const __iconNode$1 = [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["path", { d: "M16 3.128a4 4 0 0 1 0 7.744", key: "16gr8j" }],
  ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
];
const Users = createLucideIcon("users", __iconNode$1);
const __iconNode = [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
];
const X = createLucideIcon("x", __iconNode);
const NAV_GROUPS = [
  {
    label: "Geral",
    items: [
      { to: "/admin/dashboard", label: "Dashboard", Icon: LayoutDashboard }
    ]
  },
  {
    label: "Catálogo",
    items: [
      { to: "/admin/categorias", label: "Categorias", Icon: Sparkles },
      { to: "/admin/produtos", label: "Produtos", Icon: Package },
      { to: "/admin/relacionados", label: "Relacionados", Icon: Sparkles },
      { to: "/admin/protecao", label: "Proteção Prod.", Icon: Shield }
    ]
  },
  {
    label: "Vendas",
    items: [
      { to: "/admin/pedidos", label: "Pedidos", Icon: ShoppingBag },
      { to: "/admin/clientes", label: "Clientes", Icon: Users },
      { to: "/admin/frete", label: "Frete", Icon: Truck }
    ]
  },
  {
    label: "Financeiro",
    items: [
      { to: "/admin/vexopay", label: "VexoPay", Icon: TrendingUp }
    ]
  },
  {
    label: "Configurações",
    items: [
      { to: "/admin/perfil", label: "Perfil", Icon: Users },
      { to: "/admin/tiktok", label: "TikTok", Icon: AtSign },
      { to: "/admin/whosamungus", label: "Whos.AmungUs", Icon: Eye },
      { to: "/admin/chave", label: "Chave StreetPay", Icon: Key },
      { to: "/admin/configuracoes", label: "Configurações", Icon: Settings }
    ]
  }
];
function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { resolvedTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = reactExports.useState(false);
  const [collapsed, setCollapsed] = reactExports.useState(false);
  const [expandedGroups, setExpandedGroups] = reactExports.useState(
    () => {
      const initial = {};
      NAV_GROUPS.forEach((g) => {
        initial[g.label] = true;
      });
      return initial;
    }
  );
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/admin/login" });
  };
  const isActive = (to) => {
    if (to === "/admin/dashboard") return location.pathname === to;
    return location.pathname.startsWith(to);
  };
  const toggleGroup = (label) => {
    setExpandedGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  };
  const sidebarRef = reactExports.useRef(null);
  const [mousePosition, setMousePosition] = reactExports.useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const sidebar = sidebarRef.current;
    if (!sidebar) return;
    const handleMouseMove = (e) => {
      const rect = sidebar.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    };
    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);
    sidebar.addEventListener("mousemove", handleMouseMove);
    sidebar.addEventListener("mouseenter", handleMouseEnter);
    sidebar.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      sidebar.removeEventListener("mousemove", handleMouseMove);
      sidebar.removeEventListener("mouseenter", handleMouseEnter);
      sidebar.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);
  const sidebarContent = /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: cn(
          "flex items-center gap-3 px-4 py-5 border-b border-sidebar-border relative z-10",
          collapsed && "justify-center px-2"
        ),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm", children: "A" }),
          !collapsed && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col overflow-hidden", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold text-sidebar-foreground truncate", children: "Achadinhos" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-sidebar-foreground/50 truncate", children: "Painel Admin" })
          ] })
        ]
      }
    ),
    isHovered && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "absolute pointer-events-none z-0 transition-opacity duration-300",
        style: {
          left: mousePosition.x - 100,
          top: mousePosition.y - 100,
          width: 200,
          height: 200,
          background: `radial-gradient(circle, oklch(0.62 0.15 280 / 0.08) 0%, transparent 70%)`,
          borderRadius: "50%"
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { ref: sidebarRef, className: "flex-1 overflow-y-auto py-4 px-3 space-y-5 relative z-10 scrollbar-thin scrollbar-track-sidebar scrollbar-thumb-sidebar-border hover:scrollbar-thumb-sidebar-primary/50", children: NAV_GROUPS.map((group) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      !collapsed && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => toggleGroup(group.label),
          className: "flex items-center gap-1 px-2 mb-1 text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/40 hover:text-sidebar-foreground/60 transition-colors w-full",
          children: [
            group.label,
            expandedGroups[group.label] ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "ml-auto h-3 w-3" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "ml-auto h-3 w-3" })
          ]
        }
      ),
      expandedGroups[group.label] && /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-0.5", children: group.items.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: item.to,
          onClick: () => setMobileOpen(false),
          className: cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-150",
            "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            isActive(item.to) ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium shadow-sm" : "text-sidebar-foreground/70",
            collapsed && "justify-center px-2"
          ),
          activeProps: {
            className: cn(
              "bg-sidebar-primary text-sidebar-primary-foreground font-medium shadow-sm"
            )
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(item.Icon, { className: "h-4 w-4 shrink-0" }),
            !collapsed && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: item.label })
          ]
        }
      ) }, item.to)) })
    ] }, group.label)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-sidebar-border p-3 space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "sm",
          onClick: () => setCollapsed(!collapsed),
          className: cn(
            "w-full text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent",
            collapsed && "justify-center px-0"
          ),
          children: collapsed ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4 rotate-90" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", children: "Recolher" })
          ] })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "ghost",
          size: "sm",
          onClick: handleLogout,
          className: cn(
            "w-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30",
            collapsed && "justify-center px-0"
          ),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-4 w-4" }),
            !collapsed && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", children: "Sair" })
          ]
        }
      )
    ] })
  ] });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-sidebar border-b border-sidebar-border px-4 py-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold text-xs", children: "A" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold text-sidebar-foreground", children: "Achadinhos" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          onClick: () => setMobileOpen(!mobileOpen),
          children: mobileOpen ? /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-5 w-5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { className: "h-5 w-5" })
        }
      )
    ] }),
    mobileOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "lg:hidden fixed inset-0 z-40 bg-black/50",
        onClick: () => setMobileOpen(false)
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "aside",
      {
        className: cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-200 lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        ),
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-16 h-full flex flex-col", children: sidebarContent })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "aside",
      {
        className: cn(
          "hidden lg:flex lg:flex-col h-screen sticky top-0 border-r border-sidebar-border bg-sidebar transition-all duration-300",
          collapsed ? "w-[3.5rem]" : "w-60"
        ),
        children: sidebarContent
      }
    )
  ] });
}
const NAV_ITEMS = NAV_GROUPS.flatMap((g) => g.items);
function AdminBottomNav() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-sidebar border-t border-sidebar-border flex overflow-x-auto px-2 py-2 gap-1", children: NAV_ITEMS.map(({ to, label, Icon }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Link,
    {
      to,
      activeProps: { className: "flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-[10px] transition-colors text-primary shrink-0 min-w-[60px]" },
      inactiveProps: { className: "flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-[10px] transition-colors text-sidebar-foreground/50 shrink-0 min-w-[60px]" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-center leading-tight", children: label })
      ]
    },
    to
  )) });
}
function RequireAdmin({ children }) {
  const { session, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  reactExports.useEffect(() => {
    if (loading) return;
    if (!session || !isAdmin) {
      navigate({ to: "/admin/login" });
    }
  }, [session, isAdmin, loading, navigate]);
  if (loading || !session || !isAdmin) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-6 w-6 animate-spin text-muted-foreground" }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children });
}
function MouseGlow({ children }) {
  const containerRef = reactExports.useRef(null);
  const [mousePosition, setMousePosition] = reactExports.useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    };
    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);
    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref: containerRef, className: "relative", children: [
    isHovered && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "pointer-events-none absolute z-0 transition-all duration-300 ease-out",
        style: {
          left: mousePosition.x - 200,
          top: mousePosition.y - 200,
          width: 400,
          height: 400,
          background: `radial-gradient(circle, oklch(0.62 0.15 280 / 0.06) 0%, transparent 70%)`,
          borderRadius: "50%"
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative z-10", children })
  ] });
}
function SparkleEffect() {
  const canvasRef = reactExports.useRef(null);
  const [sparkles, setSparkles] = reactExports.useState([]);
  reactExports.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    const initialSparkles = Array.from({ length: 30 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.5 + 0.2,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3
    }));
    setSparkles(initialSparkles);
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      initialSparkles.forEach((sparkle) => {
        sparkle.x += sparkle.vx;
        sparkle.y += sparkle.vy;
        if (sparkle.x < 0 || sparkle.x > canvas.width) sparkle.vx *= -1;
        if (sparkle.y < 0 || sparkle.y > canvas.height) sparkle.vy *= -1;
        ctx.beginPath();
        ctx.arc(sparkle.x, sparkle.y, sparkle.size, 0, Math.PI * 2);
        ctx.fillStyle = `oklch(0.62 0.15 280 / ${sparkle.opacity})`;
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(sparkle.x - sparkle.size * 2, sparkle.y);
        ctx.lineTo(sparkle.x + sparkle.size * 2, sparkle.y);
        ctx.moveTo(sparkle.x, sparkle.y - sparkle.size * 2);
        ctx.lineTo(sparkle.x, sparkle.y + sparkle.size * 2);
        ctx.strokeStyle = `oklch(0.62 0.15 280 / ${sparkle.opacity * 0.5})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      });
      requestAnimationFrame(animate);
    };
    animate();
    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "canvas",
    {
      ref: canvasRef,
      className: "absolute inset-0 pointer-events-none z-0",
      style: { opacity: 0.4 }
    }
  );
}
function AdminLayout({ title, children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(RequireAdmin, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(MouseGlow, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-h-screen bg-background relative", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 overflow-hidden pointer-events-none", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 h-96 w-96 rounded-full bg-primary/5 blur-3xl animate-pulse" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-0 left-0 h-96 w-96 rounded-full bg-primary/5 blur-3xl animate-pulse [animation-delay:2000ms]" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SparkleEffect, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AdminSidebar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AdminBottomNav, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col min-w-0 pb-16 lg:pb-0 relative z-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border/50 px-4 sm:px-6 py-4 flex items-center gap-3 shadow-sm shadow-black/5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 min-w-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-base sm:text-lg font-semibold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent truncate", children: title }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 p-4 sm:p-6 overflow-auto", children })
    ] })
  ] }) }) });
}
export {
  AdminLayout as A,
  ChevronDown as C,
  Package as P,
  TrendingUp as T,
  Users as U,
  X,
  ChevronRight as a
};
