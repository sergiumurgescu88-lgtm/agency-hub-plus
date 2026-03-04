import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const navSections = [
  {
    label: "Principal",
    items: [
      { icon: "⊞", title: "Dashboard", path: "/", badge: null },
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

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="w-[230px] bg-surface border-r border-subtle fixed top-0 left-0 bottom-0 z-50 flex flex-col">
      {/* Logo */}
      <div className="px-5 py-[22px] border-b border-subtle mb-2">
        <div className="font-serif text-[22px] tracking-tight">
          Society<span className="text-gold">HUB</span>
        </div>
        <div className="text-[10px] text-dim2 tracking-[2px] uppercase mt-0.5">
          CRM Imobiliar Pro
        </div>
      </div>

      {/* Nav Sections */}
      <div className="flex-1 overflow-y-auto">
        {navSections.map((section) => (
          <div key={section.label}>
            <div className="px-3 pt-2 pb-1 text-[10px] text-dim2 tracking-[2px] uppercase mt-2">
              {section.label}
            </div>
            {section.items.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <div
                  key={item.title}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-2.5 py-[9px] px-3 mx-2 rounded-lg cursor-pointer text-[13.5px] transition-all relative
                    ${isActive ? "bg-gold-dim text-gold" : "text-dim hover:bg-surface2 hover:text-foreground"}`}
                >
                  {isActive && (
                    <div className="absolute left-[-8px] top-1/2 -translate-y-1/2 w-[3px] h-5 bg-gold rounded-r" />
                  )}
                  <span className="text-base w-5 text-center flex-shrink-0">{item.icon}</span>
                  <span className="flex-1">{item.title}</span>
                  {item.badge && (
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
        <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-surface2">
          <div className="w-[34px] h-[34px] rounded-full bg-gradient-to-br from-gold to-orange-600 flex items-center justify-center font-bold text-[13px] text-primary-foreground flex-shrink-0">
            AM
          </div>
          <div>
            <div className="text-[13px] font-semibold">Alexandru M.</div>
            <div className="text-[11px] text-dim2">Agent Senior · Plan Pro</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
