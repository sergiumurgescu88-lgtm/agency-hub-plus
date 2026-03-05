import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

const navSections = [
  {
    label: "Principal",
    items: [
      { icon: "⊞", title: "Dashboard", path: "/dashboard", badge: null },
      { icon: "🏠", title: "Proprietăți", path: "/proprietati", badge: { text: "47", color: "teal" } },
      { icon: "👥", title: "Clienți & Leads", path: "/clienti", badge: { text: "8", color: "red" } },
      { icon: "📋", title: "Pipeline", path: "/pipeline", badge: null },
      { icon: "🎯", title: "Matching AI", path: "/matching", badge: { text: "12", color: "gold" } },
    ],
  },
  {
    label: "Publicare",
    items: [
      { icon: "📤", title: "Portale Imobiliare", path: "/portale", badge: null },
      { icon: "🌐", title: "Site Agenție", path: "/site", badge: null },
      { icon: "📱", title: "Campanii WA/Email", path: "/campanii", badge: null },
    ],
  },
  {
    label: "Tranzacții",
    items: [
      { icon: "📝", title: "Contracte", path: "/contracte", badge: null },
      { icon: "📅", title: "Vizionări", path: "/vizionari", badge: null },
      { icon: "💰", title: "Comisioane", path: "/comisioane", badge: null },
    ],
  },
  {
    label: "Rapoarte",
    items: [
      { icon: "📊", title: "Analytics", path: "/analytics", badge: null },
      { icon: "🤝", title: "MLS Partener", path: "/mls", badge: null },
    ],
  },
  {
    label: "Setări",
    items: [
      { icon: "⚙️", title: "Setări Agenție", path: "/setari", badge: null },
      { icon: "📄", title: "Plan de Afaceri", path: "/business-plan", badge: null },
    ],
  },
];

const badgeColorMap: Record<string, string> = {
  teal: "bg-teal text-primary-foreground",
  red: "bg-danger text-primary-foreground",
  gold: "bg-gold text-primary-foreground",
};

interface AppSidebarProps {
  onNavigate?: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function AppSidebar({ onNavigate, collapsed = false, onToggleCollapse }: AppSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNav = (path: string) => {
    navigate(path);
    onNavigate?.();
  };

  const sidebarWidth = collapsed ? "w-[60px]" : "w-full md:w-[230px]";

  return (
    <aside className={`${sidebarWidth} bg-surface md:border-r border-subtle md:fixed md:top-0 md:left-0 md:bottom-0 z-50 flex flex-col h-full transition-all duration-300`}>
      {/* Logo */}
      <div className="px-3 py-[22px] border-b border-subtle mb-2 flex items-center justify-between min-h-[68px]">
        {!collapsed && (
          <div className="px-2">
            <div className="font-serif text-[22px] tracking-tight">
              Society<span className="text-gold">HUB</span>
            </div>
            <div className="text-[10px] text-dim2 tracking-[2px] uppercase mt-0.5">
              CRM Imobiliar Pro
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-full flex justify-center">
            <span className="font-serif text-[18px] text-gold font-bold">S</span>
          </div>
        )}
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="hidden md:flex w-6 h-6 items-center justify-center rounded bg-surface2 border border-subtle text-dim hover:text-foreground transition-colors flex-shrink-0"
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        )}
      </div>

      {/* Nav Sections */}
      <div className="flex-1 overflow-y-auto">
        {navSections.map((section) => (
          <div key={section.label}>
            {!collapsed && (
              <div className="px-3 pt-2 pb-1 text-[10px] text-dim2 tracking-[2px] uppercase mt-2">
                {section.label}
              </div>
            )}
            {collapsed && <div className="mt-2" />}
            {section.items.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <div
                  key={item.title}
                  onClick={() => handleNav(item.path)}
                  title={collapsed ? item.title : undefined}
                  className={`flex items-center ${collapsed ? "justify-center" : "gap-2.5"} py-[9px] px-3 mx-2 rounded-lg cursor-pointer text-[13.5px] transition-all relative
                    ${isActive ? "bg-gold-dim text-gold" : "text-dim hover:bg-surface2 hover:text-foreground"}`}
                >
                  {isActive && (
                    <div className="absolute left-[-8px] top-1/2 -translate-y-1/2 w-[3px] h-5 bg-gold rounded-r" />
                  )}
                  <span className="text-base w-5 text-center flex-shrink-0">{item.icon}</span>
                  {!collapsed && <span className="flex-1 whitespace-nowrap overflow-hidden">{item.title}</span>}
                  {!collapsed && item.badge && (
                    <span className={`text-[10px] font-semibold px-[7px] py-[1px] rounded-full min-w-[20px] text-center ${badgeColorMap[item.badge.color]}`}>
                      {item.badge.text}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Agent Card */}
      <div className="mt-auto px-3 pt-3 border-t border-subtle">
        <div className={`flex items-center ${collapsed ? "justify-center" : "gap-2.5"} p-2.5 rounded-lg bg-surface2`}>
          <div className="w-[34px] h-[34px] rounded-full bg-gradient-to-br from-gold to-orange-600 flex items-center justify-center font-bold text-[13px] text-primary-foreground flex-shrink-0">
            AM
          </div>
          {!collapsed && (
            <div>
              <div className="text-[13px] font-semibold">Alexandru M.</div>
              <div className="text-[11px] text-dim2">Agent Senior · Plan Pro</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
