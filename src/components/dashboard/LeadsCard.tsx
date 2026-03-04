const leads = [
  { initials: "RD", bg: "bg-[#1C3A5E]", color: "text-info-blue", name: "Radu Dumitru", req: "3 cam · Floreasca · Max 200K€", score: 92, scoreColor: "text-teal", barColor: "bg-teal" },
  { initials: "MP", bg: "bg-[#1A3A1C]", color: "text-green-400", name: "Maria Popa", req: "2 cam · Domenii · Max 130K€", score: 78, scoreColor: "text-gold", barColor: "bg-gold" },
  { initials: "SC", bg: "bg-[#2A1A3A]", color: "text-purple", name: "Stefan Ciobanu", req: "Studio · Centru · Max 95K€", score: 65, scoreColor: "text-gold", barColor: "bg-gold" },
  { initials: "AI", bg: "bg-[#1A1A3A]", color: "text-info-blue", name: "Andrei Ionescu", req: "4 cam · Primăverii · Max 350K€", score: 43, scoreColor: "text-danger", barColor: "bg-danger" },
];

export function LeadsCard() {
  return (
    <div className="bg-surface border border-subtle rounded-xl overflow-hidden">
      <div className="px-5 py-4 flex items-center justify-between border-b border-subtle">
        <div className="text-sm font-semibold flex items-center gap-2">
          <span>🎯</span> Leads Noi — Azi
        </div>
        <button className="text-xs text-gold font-medium hover:opacity-80 bg-transparent border-none cursor-pointer">
          Toate (83) →
        </button>
      </div>
      <div className="px-5 py-1">
        {leads.map((l, i) => (
          <div key={i} className="flex items-center gap-3 py-[11px] border-b border-subtle last:border-b-0">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${l.bg} ${l.color}`}>
              {l.initials}
            </div>
            <div className="flex-1">
              <div className="text-[13px] font-medium">{l.name}</div>
              <div className="text-[11px] text-dim2 mt-0.5">{l.req}</div>
            </div>
            <div className="flex flex-col items-end gap-[3px]">
              <span className={`text-[13px] font-bold ${l.scoreColor}`}>{l.score}</span>
              <div className="w-[60px] h-1 bg-surface2 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${l.barColor}`} style={{ width: `${l.score}%` }} />
              </div>
            </div>
            <div className="flex gap-1.5">
              <div className="w-7 h-7 rounded-md border border-subtle bg-surface2 flex items-center justify-center text-[13px] cursor-pointer hover:border-gold hover:bg-gold-dim transition-all">📞</div>
              <div className="w-7 h-7 rounded-md border border-subtle bg-surface2 flex items-center justify-center text-[13px] cursor-pointer hover:border-gold hover:bg-gold-dim transition-all">💬</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
