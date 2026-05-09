import { ReactNode } from "react";
import { AdminSidebar, AdminBottomNav } from "./AdminSidebar";
import { RequireAdmin } from "./RequireAdmin";
import { MouseGlow } from "./MouseGlow";
import { SparkleEffect } from "./SparkleEffect";

/**
 * Modern layout for admin pages — uses the new sidebar with dark mode support.
 */
export function AdminLayout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <RequireAdmin>
      <MouseGlow>
        <div className="flex min-h-screen bg-background relative">
        {/* Subtle animated background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-primary/5 blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-primary/5 blur-3xl animate-pulse [animation-delay:2000ms]" />
        </div>

        <SparkleEffect />

        <AdminSidebar />
        <AdminBottomNav />

        <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-0 relative z-10">
          <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border/50 px-4 sm:px-6 py-4 flex items-center gap-3 shadow-sm shadow-black/5">
            <div className="flex-1 min-w-0">
              <h1 className="text-base sm:text-lg font-semibold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent truncate">
                {title}
              </h1>
            </div>
          </header>

          <main className="flex-1 p-4 sm:p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </MouseGlow>
  </RequireAdmin>
  );
}
