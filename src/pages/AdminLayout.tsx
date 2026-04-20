import { Outlet, NavLink, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { LayoutDashboard, BarChart3, ScrollText, LogOut, Shield, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/metrics", label: "Métricas", icon: BarChart3 },
  { to: "/admin/logs", label: "Logs", icon: ScrollText },
];

export default function AdminLayout() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-background">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) {
    supabase.auth.signOut();
    return <Navigate to="/login" replace />;
  }

  async function logout() {
    await supabase.from("logs").insert({
      event_type: "logout", username: user!.email, status: "success", user_id: user!.id,
    });
    await supabase.auth.signOut();
    toast.success("Sessão encerrada");
    navigate("/login");
  }

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <aside className="w-64 border-r bg-card flex flex-col">
        <div className="px-5 py-5 border-b flex items-center gap-2.5">
          <div className="size-8 rounded-lg bg-primary/15 grid place-items-center">
            <Shield className="size-4 text-primary" />
          </div>
          <div>
            <div className="text-sm font-semibold">Sentinel</div>
            <div className="text-xs text-muted-foreground">Admin Panel</div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to} to={item.to} end={item.end}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 h-10 rounded-md text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )
              }
            >
              <item.icon className="size-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t">
          <div className="px-3 py-2 mb-2">
            <div className="text-xs text-muted-foreground truncate">{user.email}</div>
            <div className="text-[10px] uppercase tracking-wide text-primary mt-0.5">Admin</div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 h-10 rounded-md text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="size-4" />
            Sair
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
