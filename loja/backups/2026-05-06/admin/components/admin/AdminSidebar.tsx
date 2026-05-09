import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Package,
  Shield,
  Sparkles,
  Users,
  ShoppingBag,
  Truck,
  AtSign,
  Eye,
  Key,
  TrendingUp,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type NavItem = {
  to: string;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
};

const NAV_GROUPS: { label: string; items: NavItem[] }[] = [
  {
    label: "Geral",
    items: [
      { to: "/admin/dashboard", label: "Dashboard", Icon: LayoutDashboard },
    ],
  },
  {
    label: "Catálogo",
    items: [
      { to: "/admin/categorias", label: "Categorias", Icon: Sparkles },
      { to: "/admin/produtos", label: "Produtos", Icon: Package },
      { to: "/admin/relacionados", label: "Relacionados", Icon: Sparkles },
      { to: "/admin/protecao", label: "Proteção Prod.", Icon: Shield },
    ],
  },
  {
    label: "Vendas",
    items: [
      { to: "/admin/pedidos", label: "Pedidos", Icon: ShoppingBag },
      { to: "/admin/clientes", label: "Clientes", Icon: Users },
      { to: "/admin/frete", label: "Frete", Icon: Truck },
    ],
  },
  {
    label: "Configurações",
    items: [
      { to: "/admin/perfil", label: "Perfil", Icon: Users },
      { to: "/admin/tiktok", label: "TikTok", Icon: AtSign },
      { to: "/admin/whosamungus", label: "Whos.AmungUs", Icon: Eye },
      { to: "/admin/chave", label: "Chave StreetPay", Icon: Key },
      { to: "/admin/configuracoes", label: "Configurações", Icon: Settings },
    ],
  },
];

export function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { resolvedTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    () => {
      const initial: Record<string, boolean> = {};
      NAV_GROUPS.forEach((g) => {
        initial[g.label] = true;
      });
      return initial;
    },
  );

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/admin/login" });
  };

  const isActive = (to: string) => {
    if (to === "/admin/dashboard") return location.pathname === to;
    return location.pathname.startsWith(to);
  };

  const toggleGroup = (label: string) => {
    setExpandedGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const sidebarRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const sidebar = sidebarRef.current;
    if (!sidebar) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = sidebar.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    sidebar.addEventListener('mousemove', handleMouseMove);
    sidebar.addEventListener('mouseenter', handleMouseEnter);
    sidebar.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      sidebar.removeEventListener('mousemove', handleMouseMove);
      sidebar.removeEventListener('mouseenter', handleMouseEnter);
      sidebar.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const sidebarContent = (
    <>
      {/* Logo / Brand */}
      <div
        className={cn(
          "flex items-center gap-3 px-4 py-5 border-b border-sidebar-border relative z-10",
          collapsed && "justify-center px-2",
        )}
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
          A
        </div>
        {!collapsed && (
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-bold text-sidebar-foreground truncate">
              Achadinhos
            </span>
            <span className="text-[11px] text-sidebar-foreground/50 truncate">
              Painel Admin
            </span>
          </div>
        )}
      </div>

      {/* Mouse-following glow effect */}
      {isHovered && (
        <div
          className="absolute pointer-events-none z-0 transition-opacity duration-300"
          style={{
            left: mousePosition.x - 100,
            top: mousePosition.y - 100,
            width: 200,
            height: 200,
            background: `radial-gradient(circle, oklch(0.62 0.15 280 / 0.08) 0%, transparent 70%)`,
            borderRadius: '50%',
          }}
        />
      )}

      {/* Navigation */}
      <nav ref={sidebarRef} className="flex-1 overflow-y-auto py-4 px-3 space-y-5 relative z-10 scrollbar-thin scrollbar-track-sidebar scrollbar-thumb-sidebar-border hover:scrollbar-thumb-sidebar-primary/50">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            {!collapsed && (
              <button
                onClick={() => toggleGroup(group.label)}
                className="flex items-center gap-1 px-2 mb-1 text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/40 hover:text-sidebar-foreground/60 transition-colors w-full"
              >
                {group.label}
                {expandedGroups[group.label] ? (
                  <ChevronDown className="ml-auto h-3 w-3" />
                ) : (
                  <ChevronRight className="ml-auto h-3 w-3" />
                )}
              </button>
            )}
            {expandedGroups[group.label] && (
              <ul className="space-y-0.5">
                {group.items.map((item) => (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-150",
                        "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                        isActive(item.to)
                          ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium shadow-sm"
                          : "text-sidebar-foreground/70",
                        collapsed && "justify-center px-2",
                      )}
                      activeProps={{
                        className: cn(
                          "bg-sidebar-primary text-sidebar-primary-foreground font-medium shadow-sm",
                        ),
                      }}
                    >
                      <item.Icon className="h-4 w-4 shrink-0" />
                      {!collapsed && (
                        <span className="truncate">{item.label}</span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </nav>

      {/* Bottom: Logout + Collapse */}
      <div className="border-t border-sidebar-border p-3 space-y-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "w-full text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent",
            collapsed && "justify-center px-0",
          )}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronDown className="h-4 w-4 rotate-90" />
              <span className="text-xs">Recolher</span>
            </>
          )}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className={cn(
            "w-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30",
            collapsed && "justify-center px-0",
          )}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span className="text-xs">Sair</span>}
        </Button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-sidebar border-b border-sidebar-border px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold text-xs">
            A
          </div>
          <span className="text-sm font-bold text-sidebar-foreground">
            Achadinhos
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-200 lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="pt-16 h-full flex flex-col">{sidebarContent}</div>
      </aside>

      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden lg:flex lg:flex-col h-screen sticky top-0 border-r border-sidebar-border bg-sidebar transition-all duration-300",
          collapsed ? "w-[3.5rem]" : "w-60",
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}

const NAV_ITEMS = NAV_GROUPS.flatMap((g) => g.items);

export function AdminBottomNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-sidebar border-t border-sidebar-border flex overflow-x-auto px-2 py-2 gap-1">
      {NAV_ITEMS.map(({ to, label, Icon }) => (
        <Link
          key={to}
          to={to}
          activeProps={{ className: "flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-[10px] transition-colors text-primary shrink-0 min-w-[60px]" }}
          inactiveProps={{ className: "flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-[10px] transition-colors text-sidebar-foreground/50 shrink-0 min-w-[60px]" }}
        >
          <Icon className="h-5 w-5" />
          <span className="text-center leading-tight">{label}</span>
        </Link>
      ))}
    </nav>
  );
}
