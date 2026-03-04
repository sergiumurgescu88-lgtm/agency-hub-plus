import { useState } from "react";

const portals = [
  { logo: "OLX", name: "OLX Imobiliare", count: "47 anunțuri", active: true, cls: "bg-blue-dim text-info-blue border border-subtle" },
  { logo: "ST", name: "Storia.ro", count: "47 anunțuri", active: true, cls: "bg-teal-dim text-teal border border-subtle" },
  { logo: "IM", name: "Imobiliare.ro", count: "32 anunțuri", active: true, cls: "bg-red-dim text-danger border border-subtle" },
  { logo: "P24", name: "Publi24", count: "18 anunțuri", active: false, cls: "bg-[rgba(217,119,6,0.13)] text-orange-400 border border-[rgba(217,119,6,0.25)]" },
  { logo: "🌐", name: "Site Propriu", count: "47 anunțuri", active: true, cls: "bg-gold-dim text-gold border border-subtle" },
];

export function PortalsCard() {
  const [toggles, setToggles] = useState(portals.map((p) => p.active));

  return (
    <div className="bg-surface border border-subtle rounded-xl overflow-hidden">
      <div className="px-5 py-4 flex items-center justify-between border-b border-subtle">
        <div className="text-sm font-semibold flex items-center gap-2">
          <span>📤</span> Publicare Portale
        </div>
        <button className="text-xs text-gold font-medium hover:opacity-80 bg-transparent border-none cursor-pointer">
          Publică tot →
        </button>
      </div>
      <div className="px-5 py-1">
        {portals.map((p, i) => (
          <div key={i} className="flex items-center gap-3 py-2.5 border-b border-subtle last:border-b-0">
            <div className={`w-9 h-7 rounded-[5px] flex items-center justify-center text-[10px] font-extrabold tracking-tight flex-shrink-0 ${p.cls}`}>
              {p.logo}
            </div>
            <div className="text-[13px] font-medium flex-1">{p.name}</div>
            <div className="text-xs text-dim2">{p.count}</div>
            <div
              onClick={() => setToggles((t) => t.map((v, j) => (j === i ? !v : v)))}
              className={`w-9 h-5 rounded-full relative cursor-pointer flex-shrink-0 transition-colors ${toggles[i] ? "bg-teal" : "bg-surface2"}`}
            >
              <div
                className={`w-3.5 h-3.5 bg-foreground rounded-full absolute top-[3px] transition-all ${toggles[i] ? "right-[3px]" : "right-[19px]"}`}
              />
            </div>
          </div>
        ))}
        <div className="mt-3 p-2.5 bg-teal-dim rounded-lg flex items-center gap-2">
          <span className="text-sm">⚡</span>
          <span className="text-xs text-teal">
            3 anunțuri noi nepublicate. <strong>Publică cu 1 click</strong>
          </span>
        </div>
      </div>
    </div>
  );
}
