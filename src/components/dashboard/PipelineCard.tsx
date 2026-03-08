import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const columns = [
  {
    name: "Lead Nou", count: 5, colorClass: "bg-blue-dim text-info-blue",
    cards: [
      { name: "Familia Dumitru", meta: "Caută ap. 3 cam · Floreasca", price: "Budget: 180K–220K€", tag: "Primit azi", tagClass: "bg-blue-dim text-info-blue" },
      { name: "Andrei Gheorghiu", meta: "Caută studio / 1 cam · Centru", price: "Budget: 80K–100K€", tag: "OLX Lead", tagClass: "bg-blue-dim text-info-blue" },
      { name: "Maria Constantin", meta: "Caută casă · Voluntari", price: "Budget: 150K–200K€", tag: "Site lead", tagClass: "bg-blue-dim text-info-blue" },
    ],
  },
  {
    name: "Vizionare", count: 4, colorClass: "bg-gold-dim text-gold",
    cards: [
      { name: "Radu Marinescu", meta: "Ap. Floreasca · 185K€", price: "Vizionare: 4 mart. 10:00", tag: "Confirmat ✓", tagClass: "bg-gold-dim text-gold" },
      { name: "Cristian Popescu", meta: "Casa Baneasa · 420K€", price: "Vizionare: 4 mart. 17:00", tag: "Confirmat ✓", tagClass: "bg-gold-dim text-gold" },
    ],
  },
  {
    name: "Negociere", count: 3, colorClass: "bg-purple-dim text-purple",
    cards: [
      { name: "Familia Stan", meta: "Studio Unirii · 92K€", price: "Ofertă: 88.000€", tag: "Contraofertă", tagClass: "bg-purple-dim text-purple" },
      { name: "Birouri Pipera SRL", meta: "Spații birouri · 320mp", price: "14€/mp/lună", tag: "Negociere", tagClass: "bg-purple-dim text-purple" },
    ],
  },
  {
    name: "Finalizat", count: 3, colorClass: "bg-teal-dim text-teal",
    cards: [
      { name: "Familia Ionescu", meta: "Ap. Dorobanți · 138K€", price: "Comision: 2.760€ ✓", tag: "Contract semnat", tagClass: "bg-teal-dim text-teal" },
      { name: "Mihai Teodorescu", meta: "Vila Snagov · 340K€", price: "Comision: 6.800€ ✓", tag: "Finalizat ✓", tagClass: "bg-teal-dim text-teal" },
    ],
  },
];

export function PipelineCard() {
  const navigate = useNavigate();

  const handleCardClick = (name: string) => {
    toast({ title: "📋 Tranzacție", description: `Deschizi detaliile pentru: ${name}` });
    navigate("/pipeline");
  };

  return (
    <div className="bg-surface border border-subtle rounded-xl overflow-hidden mb-3.5 animate-fade-up-delay-1">
      <div className="px-4 md:px-5 py-3 md:py-4 flex items-center justify-between border-b border-subtle">
        <div className="text-sm font-semibold flex items-center gap-2">
          <span>📋</span> Pipeline Tranzacții
        </div>
        <div className="flex gap-2 items-center">
          <span className="hidden sm:inline text-[11px] font-medium px-2 py-0.5 rounded-md bg-gold-dim text-gold">
            Valoare totală: 284.600€
          </span>
          <button
            onClick={() => navigate("/pipeline")}
            className="text-xs text-gold font-medium hover:opacity-80 bg-transparent border-none cursor-pointer"
          >
            Gestionează →
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <div className="grid grid-cols-4 gap-2.5 p-4 px-4 md:px-5 min-w-[700px]">
          {columns.map((col) => (
            <div key={col.name}>
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[11px] font-semibold tracking-wider uppercase text-dim">{col.name}</span>
                <span className={`text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center ${col.colorClass}`}>
                  {col.count}
                </span>
              </div>
              {col.cards.map((card, i) => (
                <div
                  key={i}
                  onClick={() => handleCardClick(card.name)}
                  className="bg-surface2 border border-subtle rounded-lg p-[11px] mb-2 cursor-pointer hover:border-subtle2 hover:-translate-y-0.5 transition-all"
                >
                  <div className="text-[12.5px] font-medium mb-1">{card.name}</div>
                  <div className="text-[11px] text-dim2">{card.meta}</div>
                  <div className="text-xs font-semibold text-gold mt-1.5">{card.price}</div>
                  <span className={`inline-block text-[10px] px-[7px] py-0.5 rounded-md mt-1.5 ${card.tagClass}`}>
                    {card.tag}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
