import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export function Topbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isDashboard = location.pathname === "/dashboard";

  return (
    <div className="bg-surface border-b border-subtle px-4 md:px-7 h-[52px] md:h-[58px] flex items-center gap-3 md:gap-4 sticky top-0 z-40">
      {/* Back to Home / Dashboard */}
      <button
        onClick={() => navigate(isDashboard ? "/" : "/dashboard")}
        className="flex items-center gap-1.5 text-dim hover:text-foreground transition-colors text-[13px] mr-2 flex-shrink-0"
      >
        <ArrowLeft size={16} />
        <span className="hidden sm:inline">{isDashboard ? "Pagina principală" : "Dashboard"}</span>
      </button>

      <div className="flex-1 min-w-0">
        <span className="font-serif text-base md:text-xl">Bună ziua, Alexandru 👋</span>
        <span className="text-dim2 text-xs md:text-sm ml-2 md:ml-2.5 font-sans hidden sm:inline">Miercuri, 4 Martie 2026</span>
      </div>

      {/* Search - hidden on mobile */}
      <div className="hidden md:flex items-center gap-2 bg-surface2 border border-subtle rounded-lg px-3.5 py-[7px] w-[220px]">
        <span className="text-dim2">🔍</span>
        <input
          type="text"
          placeholder="Caută proprietăți, clienți..."
          className="bg-transparent border-none outline-none text-foreground text-[13px] w-full placeholder:text-dim2"
        />
        <span className="text-[10px] text-dim2 border border-subtle px-1.5 py-0.5 rounded">⌘K</span>
      </div>

      {/* Add Property */}
      <button className="hidden sm:flex items-center gap-1.5 bg-gold text-primary-foreground border-none rounded-lg px-3 md:px-4 py-2 text-[12px] md:text-[13px] font-semibold cursor-pointer hover:opacity-90 transition-opacity whitespace-nowrap">
        ＋ <span className="hidden md:inline">Proprietate Nouă</span><span className="md:hidden">Nouă</span>
      </button>

      {/* Mobile: small add button */}
      <button className="sm:hidden w-9 h-9 bg-gold text-primary-foreground rounded-lg flex items-center justify-center text-lg font-bold">
        ＋
      </button>

      {/* Notifications */}
      <div className="w-8 h-8 md:w-9 md:h-9 bg-surface2 border border-subtle rounded-lg flex items-center justify-center text-sm md:text-base cursor-pointer relative flex-shrink-0">
        🔔
        <div className="w-2 h-2 bg-danger rounded-full absolute top-1 right-1 md:top-1.5 md:right-1.5 border-2 border-surface" />
      </div>
    </div>
  );
}
