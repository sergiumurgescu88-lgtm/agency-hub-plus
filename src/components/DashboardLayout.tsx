import { ReactNode, useState, useEffect } from "react";
import { AppSidebar } from "./AppSidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";

export function DashboardLayout({ children }: { children: ReactNode }) {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    return saved === "true";
  });

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", String(collapsed));
  }, [collapsed]);

  const sidebarWidth = collapsed ? 60 : 230;

  if (isMobile) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="bg-surface border-b border-subtle h-[52px] flex items-center px-4 sticky top-0 z-50">
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-surface2 border border-subtle text-lg"
          >
            ☰
          </button>
          <div className="flex-1 text-center">
            <span className="font-serif text-lg tracking-tight">
              Society<span className="text-gold">HUB</span>
            </span>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold to-orange-600 flex items-center justify-center font-bold text-[11px] text-primary-foreground">
            AM
          </div>
        </div>
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="p-0 w-[260px] bg-surface border-r border-subtle">
            <SheetTitle className="sr-only">Meniu navigare</SheetTitle>
            <AppSidebar onNavigate={() => setSidebarOpen(false)} />
          </SheetContent>
        </Sheet>
        <main className="flex-1 flex flex-col min-h-0">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <AppSidebar collapsed={collapsed} onToggleCollapse={() => setCollapsed(!collapsed)} />
      <main
        className="flex-1 flex flex-col min-h-screen transition-all duration-300"
        style={{ marginLeft: sidebarWidth }}
      >
        {children}
      </main>
    </div>
  );
}
