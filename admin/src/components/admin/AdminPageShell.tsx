import { useEffect, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { AdminSidebar, AdminBottomNav } from "./AdminSidebar";
import { RequireAdmin } from "./RequireAdmin";

/**
 * Shell for the 14 ported HTML admin pages.
 * Renders the static HTML extracted from the original Next.js admin
 * inside a React-controlled container, intercepting internal links so
 * they navigate via TanStack Router instead of full page reloads.
 *
 * Empty-state friendly: does not depend on any data being present.
 */
export function AdminPageShell({ html, title }: { html: string; title: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  // Intercept clicks on links/buttons that point to /admin/* and route via TSR.
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    // Resolve [data-tsr] anchors to real hrefs so middle-click etc still works.
    root.querySelectorAll<HTMLElement>("[data-tsr]").forEach((el) => {
      const to = el.getAttribute("data-tsr") || "";
      if (el.tagName === "A") {
        (el as HTMLAnchorElement).href = to;
      }
    });

    const handler = (e: MouseEvent) => {
      const target = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-tsr], a[href^='/admin/'], a[href='/admin']");
      if (!target) return;
      const to =
        target.getAttribute("data-tsr") ||
        target.getAttribute("href") ||
        "";
      if (!to) return;
      // Allow modifier-clicks to behave normally
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      e.preventDefault();
      navigate({ to: to === "/admin" ? "/admin/dashboard" : to });
    };

    root.addEventListener("click", handler);
    return () => root.removeEventListener("click", handler);
  }, [html, navigate]);

  return (
    <RequireAdmin>
      <div className="min-h-screen bg-background flex">
        <AdminSidebar />
        <AdminBottomNav />
        <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-0">
          <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
            <h1 className="text-base font-semibold text-foreground">{title}</h1>
            <div className="w-8 h-8 rounded-full bg-primary/10 overflow-hidden flex items-center justify-center text-primary text-xs font-semibold">
              A
            </div>
          </header>
          <main className="flex-1 p-6 overflow-auto">
            <div
              ref={containerRef}
              className="admin-html-content"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </main>
        </div>
      </div>
    </RequireAdmin>
  );
}
