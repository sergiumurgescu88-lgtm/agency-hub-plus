const agents = [
  { initials: "AM", gradient: "from-gold to-orange-600", textColor: "text-primary-foreground", name: "Alexandru M.", stats: "12 prop · 4 tranzacții · 92% rată", commission: "8.240€" },
  { initials: "IP", gradient: "from-teal to-[#0a9b84]", textColor: "text-primary-foreground", name: "Ioana Preda", stats: "8 prop · 3 tranzacții · 87% rată", commission: "6.100€" },
  { initials: "RG", gradient: "from-info to-[#2563eb]", textColor: "text-foreground", name: "Relu Georgescu", stats: "9 prop · 2 tranzacții · 78% rată", commission: "3.900€" },
];

const bars = [55, 35, 70, 45, 60, 50, 90];
const months = ["Sep", "Oct", "Nov", "Dec", "Ian", "Feb", "Mar"];

export function AgentPerformanceCard() {
  return (
    <div className="bg-surface border border-subtle rounded-xl overflow-hidden">
      <div className="px-5 py-4 flex items-center justify-between border-b border-subtle">
        <div className="text-sm font-semibold flex items-center gap-2">
          <span>📊</span> Performanță Agenți
        </div>
        <button className="text-xs text-gold font-medium hover:opacity-80 bg-transparent border-none cursor-pointer">
          Raport complet →
        </button>
      </div>
      <div className="px-5 py-4">
        {/* Sparkline */}
        <div className="text-[11px] text-dim2 tracking-wider uppercase mb-1">Comisioane lunare (€)</div>
        <div className="h-[60px] flex items-end gap-1 my-3">
          {bars.map((h, i) => (
            <div
              key={i}
              className={`flex-1 rounded-t cursor-pointer transition-colors ${
                i === bars.length - 1
                  ? "bg-gradient-to-t from-gold to-gold/60"
                  : i % 2 === 0
                  ? "bg-gradient-to-t from-teal to-teal/40"
                  : "bg-surface2 hover:bg-gold-dim"
              }`}
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
        <div className="flex justify-between text-[10px] text-dim2">
          {months.map((m) => (
            <span key={m}>{m}</span>
          ))}
        </div>

        {/* Agent List */}
        <div className="mt-4">
          {agents.map((a, i) => (
            <div key={i} className="flex items-center gap-3 py-2.5 border-b border-subtle last:border-b-0">
              <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${a.gradient} flex items-center justify-center text-xs font-bold flex-shrink-0 ${a.textColor}`}>
                {a.initials}
              </div>
              <div className="flex-1">
                <div className="text-[13px] font-medium">{a.name}</div>
                <div className="text-[11px] text-dim2 mt-0.5">{a.stats}</div>
              </div>
              <div className="text-[13px] font-bold text-teal">{a.commission}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
