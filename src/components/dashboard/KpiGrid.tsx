import { useNavigate } from "react-router-dom";

const kpis = [
  { label: "Comisioane Lună", value: "18.240€", delta: "↑ +23% față de luna trecută", up: true, icon: "💰", accent: "gold", path: "/comisioane" },
  { label: "Proprietăți Active", value: "47", delta: "↑ +6 proprietăți noi", up: true, icon: "🏠", accent: "teal", path: "/proprietati" },
  { label: "Leads Active", value: "83", delta: "↑ 8 leads noi azi", up: true, icon: "👥", accent: "blue", path: "/clienti" },
  { label: "Vizionări Săptămână", value: "14", delta: "↓ -2 vs. săpt. trecută", up: false, icon: "👁️", accent: "red", path: "/vizionari" },
];

const gradientMap: Record<string, string> = {
  gold: "gradient-gold-bottom",
  teal: "gradient-teal-bottom",
  blue: "gradient-blue-bottom",
  red: "gradient-red-bottom",
};

export function KpiGrid() {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 md:gap-3.5 mb-6 animate-fade-up">
      {kpis.map((kpi) => (
        <div
          key={kpi.label}
          onClick={() => navigate(kpi.path)}
          className="bg-surface border border-subtle rounded-xl p-4 md:p-5 relative overflow-hidden hover:border-subtle2 transition-colors cursor-pointer"
        >
          <div className="absolute top-3 md:top-[18px] right-3 md:right-[18px] text-[20px] md:text-[22px] opacity-20">{kpi.icon}</div>
          <div className="text-[11px] md:text-xs text-dim2 tracking-[1.5px] uppercase mb-2">{kpi.label}</div>
          <div className="text-[24px] md:text-[32px] font-bold leading-none mb-1.5 md:mb-2">{kpi.value}</div>
          <div className={`text-xs md:text-sm flex items-center gap-1 ${kpi.up ? "text-teal" : "text-danger"}`}>
            {kpi.delta}
          </div>
          <div className={`absolute bottom-0 left-0 right-0 h-[2px] ${gradientMap[kpi.accent]}`} />
        </div>
      ))}
    </div>
  );
}
