import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Search, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export function Topbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isDashboard = location.pathname === "/dashboard";
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);

  const notifications = [
    { icon: "🏠", text: "Proprietate nouă adăugată: Ap. 3 cam Floreasca", time: "acum 5 min" },
    { icon: "📅", text: "Vizionare confirmată: Radu Marinescu, 10:00", time: "acum 30 min" },
    { icon: "🤖", text: "3 match-uri noi identificate de AI", time: "acum 1h" },
    { icon: "💰", text: "Comision încasat: 2.760€ - Familia Ionescu", time: "acum 2h" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast({ title: "🔍 Căutare", description: `Rezultate pentru: "${searchQuery}"` });
      setSearchQuery("");
      setSearchOpen(false);
    }
  };

  const handleAddProperty = () => {
    navigate("/proprietati");
    toast({ title: "🏠 Proprietate Nouă", description: "Navighezi la secțiunea Proprietăți pentru a adăuga una nouă." });
  };

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

      {/* Search - desktop */}
      <form onSubmit={handleSearch} className="hidden md:flex items-center gap-2 bg-surface2 border border-subtle rounded-lg px-3.5 py-[7px] w-[220px]">
        <Search size={14} className="text-dim2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Caută proprietăți, clienți..."
          className="bg-transparent border-none outline-none text-foreground text-[13px] w-full placeholder:text-dim2"
        />
        <span className="text-[10px] text-dim2 border border-subtle px-1.5 py-0.5 rounded">⌘K</span>
      </form>

      {/* Mobile search toggle */}
      <button
        onClick={() => setSearchOpen(!searchOpen)}
        className="md:hidden w-8 h-8 bg-surface2 border border-subtle rounded-lg flex items-center justify-center text-dim"
      >
        {searchOpen ? <X size={14} /> : <Search size={14} />}
      </button>

      {/* Add Property */}
      <button
        onClick={handleAddProperty}
        className="hidden sm:flex items-center gap-1.5 bg-gold text-primary-foreground border-none rounded-lg px-3 md:px-4 py-2 text-[12px] md:text-[13px] font-semibold cursor-pointer hover:opacity-90 transition-opacity whitespace-nowrap"
      >
        ＋ <span className="hidden md:inline">Proprietate Nouă</span><span className="md:hidden">Nouă</span>
      </button>

      {/* Mobile: small add button */}
      <button
        onClick={handleAddProperty}
        className="sm:hidden w-9 h-9 bg-gold text-primary-foreground rounded-lg flex items-center justify-center text-lg font-bold"
      >
        ＋
      </button>

      {/* Notifications */}
      <div className="relative flex-shrink-0">
        <div
          onClick={() => setNotifOpen(!notifOpen)}
          className="w-8 h-8 md:w-9 md:h-9 bg-surface2 border border-subtle rounded-lg flex items-center justify-center text-sm md:text-base cursor-pointer relative"
        >
          🔔
          <div className="w-2 h-2 bg-danger rounded-full absolute top-1 right-1 md:top-1.5 md:right-1.5 border-2 border-surface" />
        </div>
        {notifOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
            <div className="absolute right-0 top-[calc(100%+8px)] w-[320px] bg-surface border border-subtle rounded-xl shadow-lg z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-subtle flex items-center justify-between">
                <span className="text-sm font-semibold">Notificări</span>
                <button
                  onClick={() => { setNotifOpen(false); toast({ title: "✓ Notificări", description: "Toate notificările au fost marcate ca citite." }); }}
                  className="text-[11px] text-gold font-medium bg-transparent border-none cursor-pointer"
                >
                  Marchează citite
                </button>
              </div>
              {notifications.map((n, i) => (
                <div key={i} className="px-4 py-3 border-b border-subtle last:border-b-0 hover:bg-surface2 cursor-pointer transition-colors">
                  <div className="flex items-start gap-2.5">
                    <span className="text-base mt-0.5">{n.icon}</span>
                    <div className="flex-1">
                      <div className="text-[13px]">{n.text}</div>
                      <div className="text-[11px] text-dim2 mt-1">{n.time}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Mobile search bar */}
      {searchOpen && (
        <form
          onSubmit={handleSearch}
          className="absolute left-0 right-0 top-full bg-surface border-b border-subtle px-4 py-2 md:hidden z-30"
        >
          <div className="flex items-center gap-2 bg-surface2 border border-subtle rounded-lg px-3 py-2">
            <Search size={14} className="text-dim2" />
            <input
              autoFocus
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Caută proprietăți, clienți..."
              className="bg-transparent border-none outline-none text-foreground text-[13px] w-full placeholder:text-dim2"
            />
          </div>
        </form>
      )}
    </div>
  );
}
