import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const matches = [
  { score: "97%", high: true, names: "Radu D. ↔ Ap. Floreasca", detail: "3 cam · 185K€ · Toate criteriile ✓" },
  { score: "91%", high: true, names: "Maria P. ↔ Ap. Dorobanți", detail: "2 cam · 138K€ · 5 criterii din 6 ✓" },
  { score: "74%", high: false, names: "Stefan C. ↔ Studio Unirii", detail: "Studio · 92K€ · Zona OK, preț ușor peste" },
  { score: "68%", high: false, names: "Familia D. ↔ Ap. Aviatorilor", detail: "3 cam · 185K€ · Zona sub așteptări" },
];

export function MatchingCard() {
  const navigate = useNavigate();

  const handleSend = (names: string) => {
    toast({ title: "📧 Trimis!", description: `Ofertă trimisă pentru match-ul: ${names}` });
  };

  return (
    <div className="bg-surface border border-subtle rounded-xl overflow-hidden">
      <div className="px-5 py-4 flex items-center justify-between border-b border-subtle">
        <div className="text-sm font-semibold flex items-center gap-2">
          <span>🤖</span> Matching AI
        </div>
        <button
          onClick={() => navigate("/matching")}
          className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-teal-dim text-teal cursor-pointer hover:opacity-80 transition-opacity border-none"
        >
          12 noi
        </button>
      </div>
      <div className="px-5 py-1">
        {matches.map((m, i) => (
          <div key={i} className="flex items-center gap-3 py-2.5 border-b border-subtle last:border-b-0">
            <div className={`w-[38px] h-[38px] rounded-full bg-surface2 border-2 flex items-center justify-center text-xs font-bold flex-shrink-0 ${m.high ? "border-teal text-teal" : "border-gold text-gold"}`}>
              {m.score}
            </div>
            <div className="flex-1">
              <div className="text-[13px] font-medium">{m.names}</div>
              <div className="text-[11px] text-dim2 mt-0.5">{m.detail}</div>
            </div>
            <button
              onClick={() => handleSend(m.names)}
              className="text-[11px] font-semibold px-3 py-[5px] rounded-md border border-subtle bg-surface2 text-dim cursor-pointer hover:border-gold hover:text-gold transition-all"
            >
              Trimite →
            </button>
          </div>
        ))}
        <div
          onClick={() => navigate("/matching")}
          className="mt-3 p-2.5 bg-teal-dim/30 rounded-lg border border-teal/15 cursor-pointer hover:bg-teal-dim/50 transition-colors"
        >
          <div className="text-xs text-teal font-semibold mb-1">Potențial comision total</div>
          <div className="font-serif text-[22px]">38.400€</div>
          <div className="text-[11px] text-dim2 mt-0.5">din 12 match-uri active</div>
        </div>
      </div>
    </div>
  );
}
