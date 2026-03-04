const properties = [
  { type: "apt", emoji: "🏢", name: "Ap. 3 camere · Floreasca, B-ul Aviatorilor", meta: "95 mp · Et. 4/8 · Semidecomandat · Renovat 2023", status: "Activ", statusClass: "bg-teal-dim text-teal", price: "185.000€", priceType: "vânzare" },
  { type: "house", emoji: "🏡", name: "Casă individuală · Baneasa, Str. Plopilor", meta: "240 mp · Teren 450 mp · 5 camere · Garaj", status: "Vizionare", statusClass: "bg-gold-dim text-gold", price: "420.000€", priceType: "vânzare" },
  { type: "studio", emoji: "🛏", name: "Studio · Centru, P-ța Unirii", meta: "38 mp · Et. 2/6 · Bloc 2019 · Parcare subterană", status: "Negociere", statusClass: "bg-blue-dim text-info-blue", price: "850€/lună", priceType: "închiriere" },
  { type: "apt", emoji: "🏠", name: "Ap. 2 camere · Dorobanți, Str. Mihai Eminescu", meta: "65 mp · Et. 1/4 · Interbelică renovată · Central", status: "Rezervat", statusClass: "bg-purple-dim text-purple", price: "138.000€", priceType: "vânzare" },
  { type: "office", emoji: "🏗", name: "Spațiu Birouri · Pipera, Str. Barbu Văcărescu", meta: "320 mp · Et. 5 · Clasa A · 80 locuri parcare", status: "Activ", statusClass: "bg-teal-dim text-teal", price: "14€/mp/lună", priceType: "închiriere" },
];

const thumbBg: Record<string, string> = {
  apt: "from-[#1C3A5E] to-[#2563EB22]",
  house: "from-[#1A3A1C] to-[#16A34A22]",
  office: "from-[#3A1A1A] to-[#DC262622]",
  studio: "from-[#2A1A3A] to-[#7C3AED22]",
};

export function PropertiesCard() {
  return (
    <div className="bg-surface border border-subtle rounded-xl overflow-hidden">
      <div className="px-4 md:px-5 py-3 md:py-4 flex items-center justify-between border-b border-subtle">
        <div className="text-sm font-semibold flex items-center gap-2">
          <span>🏠</span> Proprietăți Recente
        </div>
        <button className="text-xs text-gold font-medium hover:opacity-80 bg-transparent border-none cursor-pointer">
          Vezi toate (47) →
        </button>
      </div>
      <div className="px-4 md:px-5 py-1">
        {properties.map((p, i) => (
          <div
            key={i}
            className="flex items-center gap-2.5 md:gap-3.5 py-3 border-b border-subtle last:border-b-0 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className={`w-10 md:w-[52px] h-8 md:h-10 rounded-md flex items-center justify-center text-base md:text-lg bg-gradient-to-br ${thumbBg[p.type]} flex-shrink-0`}>
              {p.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[12px] md:text-[13.5px] font-medium truncate">{p.name}</div>
              <div className="text-[10px] md:text-[11px] text-dim2 mt-0.5 truncate">{p.meta}</div>
            </div>
            <span className={`text-[9px] md:text-[10px] font-semibold px-2 md:px-2.5 py-[3px] rounded-full tracking-wide uppercase whitespace-nowrap ${p.statusClass} hidden sm:inline`}>
              {p.status}
            </span>
            <div className="text-right flex-shrink-0">
              <div className="text-[12px] md:text-[13px] font-semibold">{p.price}</div>
              <div className="text-[9px] md:text-[10px] text-dim2">{p.priceType}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
