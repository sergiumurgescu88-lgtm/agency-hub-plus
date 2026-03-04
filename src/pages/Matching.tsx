import { useState, useMemo, useCallback } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

// ─── DATA ────────────────────────────────────────────────────────────
interface Client {
  id: number; name: string; initials: string; gradient: string; type: string;
  budget: [number, number]; surface: [number, number]; rooms: number; baths: number;
  zones: string[]; facilities: string[]; lastMatch: number;
}

interface Property {
  id: number; title: string; price: number; surface: number; rooms: number; baths: number;
  zone: string; type: string; floor: number; facilities: string[]; status: string; icon: string;
}

interface ScoreDetail {
  buget: number; suprafata: number; camere: number; zona: number; tip: number; facilitati: number;
}

interface MatchResult extends Property {
  matchScore: number; scoreDetail: ScoreDetail;
}

const CLIENTS: Client[] = [
  { id: 1, name: "Elena Popescu", initials: "EP", gradient: "from-gold to-yellow-600", type: "Cumpărător", budget: [170000, 260000], surface: [65, 120], rooms: 3, baths: 1, zones: ["Dorobanți", "Floreasca"], facilities: ["Parcare", "Balcon", "Lift"], lastMatch: 92 },
  { id: 2, name: "Alexandru Marin", initials: "AM", gradient: "from-emerald-500 to-emerald-400", type: "Cumpărător", budget: [140000, 200000], surface: [60, 90], rooms: 3, baths: 1, zones: ["Floreasca", "Baneasa"], facilities: ["Parcare", "AC"], lastMatch: 87 },
  { id: 3, name: "George Stancu", initials: "GS", gradient: "from-cyan-500 to-cyan-400", type: "Investitor", budget: [400000, 900000], surface: [150, 400], rooms: 5, baths: 2, zones: ["Pipera", "Dorobanți", "Baneasa"], facilities: ["Piscina", "Gradina", "Parcare"], lastMatch: 79 },
  { id: 4, name: "Ioana Constantin", initials: "IC", gradient: "from-pink-500 to-pink-400", type: "Cumpărător", budget: [300000, 500000], surface: [100, 200], rooms: 4, baths: 2, zones: ["Baneasa", "Floreasca"], facilities: ["Terasa", "Gradina", "Parcare"], lastMatch: 84 },
  { id: 5, name: "Cristian Bălan", initials: "CB", gradient: "from-indigo-500 to-indigo-400", type: "Cumpărător", budget: [100000, 155000], surface: [45, 75], rooms: 2, baths: 1, zones: ["Sector 2", "Centru"], facilities: ["Lift", "AC"], lastMatch: 71 },
  { id: 6, name: "Daniela Niculescu", initials: "DN", gradient: "from-amber-500 to-amber-400", type: "Cumpărător", budget: [80000, 130000], surface: [40, 65], rooms: 2, baths: 1, zones: ["Sector 3", "Vitan"], facilities: ["Parcare", "Balcon"], lastMatch: 68 },
  { id: 7, name: "Mihai Florescu", initials: "MF", gradient: "from-purple-500 to-purple-400", type: "Chiriaș", budget: [400, 800], surface: [30, 55], rooms: 1, baths: 1, zones: ["Centru", "Sector 1"], facilities: ["Lift", "AC"], lastMatch: 76 },
];

const PROPERTIES: Property[] = [
  { id: 1, title: "Apartament 3 camere – Floreasca Residence", price: 185000, surface: 78, rooms: 3, baths: 2, zone: "Floreasca", type: "Apartament", floor: 5, facilities: ["Parcare", "Balcon", "Lift", "AC"], status: "Disponibil", icon: "🏢" },
  { id: 2, title: "Vilă D+P+1 – Pipera Exclusive", price: 425000, surface: 220, rooms: 5, baths: 3, zone: "Pipera", type: "Casă / Vilă", floor: 0, facilities: ["Piscina", "Gradina", "Parcare", "AC"], status: "Rezervat", icon: "🏠" },
  { id: 3, title: "Apartament 2 camere – Vitan Mall", price: 112000, surface: 54, rooms: 2, baths: 1, zone: "Sector 4", type: "Apartament", floor: 3, facilities: ["Lift", "Balcon"], status: "Disponibil", icon: "🏢" },
  { id: 4, title: "Apartament 3 camere – Dorobanți Central", price: 230000, surface: 85, rooms: 3, baths: 2, zone: "Dorobanți", type: "Apartament", floor: 2, facilities: ["Parcare", "Balcon", "Lift", "AC"], status: "Disponibil", icon: "🏢" },
  { id: 5, title: "Casă P+1 – Voluntari Premium", price: 195000, surface: 120, rooms: 4, baths: 2, zone: "Voluntari", type: "Casă / Vilă", floor: 0, facilities: ["Gradina", "Parcare", "AC"], status: "Disponibil", icon: "🏠" },
  { id: 6, title: "Apartament Studio – Centru Vechi", price: 74000, surface: 38, rooms: 1, baths: 1, zone: "Centru", type: "Apartament", floor: 4, facilities: ["Lift", "AC"], status: "Disponibil", icon: "🏢" },
  { id: 7, title: "Apartament 4 camere – Dorobanți Lux", price: 340000, surface: 110, rooms: 4, baths: 2, zone: "Dorobanți", type: "Apartament", floor: 6, facilities: ["Parcare", "Terasa", "Lift", "AC"], status: "Disponibil", icon: "🏢" },
  { id: 8, title: "Vilă 300m² – Baneasa Forest", price: 680000, surface: 300, rooms: 6, baths: 4, zone: "Baneasa", type: "Casă / Vilă", floor: 0, facilities: ["Piscina", "Gradina", "Parcare", "AC", "Terasa"], status: "Disponibil", icon: "🏠" },
  { id: 9, title: "Apartament 2 camere – Floreasca Park", price: 152000, surface: 62, rooms: 2, baths: 1, zone: "Floreasca", type: "Apartament", floor: 7, facilities: ["Parcare", "Lift", "AC", "Boxa"], status: "Disponibil", icon: "🏢" },
  { id: 10, title: "Teren 450m² – Baneasa", price: 68500, surface: 450, rooms: 0, baths: 0, zone: "Baneasa", type: "Teren", floor: 0, facilities: [], status: "Disponibil", icon: "🏗️" },
  { id: 11, title: "Spațiu Comercial – Floreasca", price: 290000, surface: 145, rooms: 0, baths: 2, zone: "Floreasca", type: "Spațiu Comercial", floor: 0, facilities: ["Parcare", "AC"], status: "Disponibil", icon: "🏬" },
  { id: 12, title: "Apartament 3 camere – Baneasa Residence", price: 218000, surface: 82, rooms: 3, baths: 2, zone: "Baneasa", type: "Apartament", floor: 3, facilities: ["Parcare", "Balcon", "Lift", "Terasa"], status: "Disponibil", icon: "🏢" },
  { id: 13, title: "Casă 180m² – Pipera Nord", price: 320000, surface: 180, rooms: 5, baths: 3, zone: "Pipera", type: "Casă / Vilă", floor: 0, facilities: ["Gradina", "Parcare", "Piscina"], status: "Disponibil", icon: "🏠" },
  { id: 14, title: "Garsonieră – Sector 2 Central", price: 58000, surface: 32, rooms: 1, baths: 1, zone: "Sector 2", type: "Apartament", floor: 2, facilities: ["Lift"], status: "Disponibil", icon: "🏢" },
  { id: 15, title: "Apartament 3 camere – Victoriei", price: 198000, surface: 75, rooms: 3, baths: 2, zone: "Dorobanți", type: "Apartament", floor: 1, facilities: ["Parcare", "Balcon", "AC"], status: "Disponibil", icon: "🏢" },
];

const FACILITIES = [
  { value: "Parcare", icon: "🚗", label: "Parcare" },
  { value: "Balcon", icon: "🌿", label: "Balcon" },
  { value: "Lift", icon: "🛗", label: "Lift" },
  { value: "AC", icon: "❄️", label: "AC" },
  { value: "Terasa", icon: "☀️", label: "Terasă" },
  { value: "Piscina", icon: "🏊", label: "Piscină" },
  { value: "Gradina", icon: "🌳", label: "Grădină" },
  { value: "Boxa", icon: "📦", label: "Boxă" },
];

// ─── SCORE ENGINE ────────────────────────────────────────────────────
function scoreMatch(client: Client, prop: Property, crit: Criteria): { total: number; scores: ScoreDetail } {
  const scores: ScoreDetail = { buget: 0, suprafata: 0, camere: 0, zona: 0, tip: 0, facilitati: 0 };

  const bmin = crit.bmin || client.budget[0];
  const bmax = crit.bmax || client.budget[1];
  if (prop.price <= bmax && prop.price >= bmin * 0.9) scores.buget = 100;
  else if (prop.price < bmin * 0.9) scores.buget = 70;
  else { const over = prop.price - bmax; scores.buget = Math.max(0, 100 - Math.round(over / bmax * 200)); }

  const smin = crit.smin || client.surface[0];
  const smax = crit.smax || client.surface[1];
  if (prop.surface >= smin && prop.surface <= smax) scores.suprafata = 100;
  else if (prop.surface > smax) scores.suprafata = Math.max(0, 100 - Math.round((prop.surface - smax) / smax * 150));
  else scores.suprafata = Math.max(0, 100 - Math.round((smin - prop.surface) / smin * 200));

  const minRooms = crit.rooms || client.rooms;
  if (prop.rooms >= minRooms) scores.camere = 100;
  else if (prop.rooms === minRooms - 1) scores.camere = 60;
  else scores.camere = Math.max(0, 100 - (minRooms - prop.rooms) * 30);

  const zones = crit.zone ? crit.zone.split(",").map(z => z.trim().toLowerCase()) : client.zones.map(z => z.toLowerCase());
  const zoneMatch = zones.some(z => prop.zone.toLowerCase().includes(z) || z.includes(prop.zone.toLowerCase().split(" ")[0]));
  scores.zona = zoneMatch ? 100 : 25;

  const wantedType = crit.type || "";
  if (!wantedType) scores.tip = 90;
  else scores.tip = prop.type === wantedType ? 100 : (prop.type.includes(wantedType.split(" ")[0]) ? 70 : 20);

  const wantedFacil = crit.facilities.length ? crit.facilities : client.facilities;
  if (!wantedFacil.length) scores.facilitati = 90;
  else { const matched = wantedFacil.filter(f => prop.facilities.includes(f)).length; scores.facilitati = Math.round(matched / wantedFacil.length * 100); }

  const total = Math.round(scores.buget * 0.30 + scores.suprafata * 0.20 + scores.camere * 0.20 + scores.zona * 0.15 + scores.tip * 0.10 + scores.facilitati * 0.05);
  return { total, scores };
}

interface Criteria {
  type: string; bmin: number; bmax: number; smin: number; smax: number;
  rooms: number; baths: number; zone: string; facilities: string[]; minScore: number;
}

function formatEur(n: number) {
  if (!n) return "€0";
  if (n >= 1000000) return "€" + (n / 1000000).toFixed(2) + "M";
  if (n >= 1000) return "€" + (n / 1000).toFixed(0) + "K";
  return "€" + n;
}

function scoreColor(s: number) { return s >= 80 ? "hsl(var(--teal))" : s >= 60 ? "hsl(var(--gold))" : "hsl(var(--red))"; }
function scoreColorClass(s: number) { return s >= 80 ? "text-teal" : s >= 60 ? "text-gold" : "text-danger"; }
function scoreBgClass(s: number) { return s >= 80 ? "bg-teal-dim" : s >= 60 ? "bg-gold-dim" : "bg-red-dim"; }

// ─── COMPONENTS ──────────────────────────────────────────────────────

function ScoreRingSvg({ score, size = 52 }: { score: number; size?: number }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const fill = (score / 100) * circ;
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="absolute top-0 left-0">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="hsl(var(--bg3))" strokeWidth="4" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={scoreColor(score)} strokeWidth="4"
          strokeDasharray={`${fill.toFixed(1)} ${circ.toFixed(1)}`} strokeLinecap="round" transform={`rotate(-90 ${size / 2} ${size / 2})`} />
      </svg>
      <span className={`font-serif text-[15px] font-bold relative z-10 ${scoreColorClass(score)}`}>{score}%</span>
    </div>
  );
}

function ScoreCritBar({ name, value }: { name: string; value: number }) {
  const col = value >= 80 ? "bg-teal" : value >= 50 ? "bg-gold" : "bg-[hsl(var(--red))]";
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10.5px] text-dim w-[60px] flex-shrink-0">{name}</span>
      <div className="flex-1 h-1 bg-surface2 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${col} transition-all duration-500`} style={{ width: `${value}%` }} />
      </div>
      <span className={`text-[10.5px] font-semibold w-7 text-right ${scoreColorClass(value)}`}>{value}</span>
    </div>
  );
}

function MatchTag({ type, label }: { type: "match" | "partial" | "miss" | "neutral"; label: string }) {
  const cls = {
    match: "bg-teal-dim text-teal border-teal/20",
    partial: "bg-gold-dim text-gold border-gold/20",
    miss: "bg-red-dim text-danger border-[hsl(var(--red))]/20",
    neutral: "bg-surface2 text-dim border-subtle",
  }[type];
  return <span className={`px-2 py-0.5 rounded text-[10.5px] font-medium border ${cls}`}>{label}</span>;
}

// ─── MAIN PAGE ───────────────────────────────────────────────────────
export default function Matching() {
  const { toast } = useToast();
  const [selectedClient, setSelectedClient] = useState<Client | null>(CLIENTS[0]);
  const [clientSearch, setClientSearch] = useState("");
  const [results, setResults] = useState<MatchResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  const [sortBy, setSortBy] = useState("score");
  const [showReport, setShowReport] = useState(false);
  const [detailProp, setDetailProp] = useState<MatchResult | null>(null);
  const [notifsSent, setNotifsSent] = useState<Set<string>>(new Set());
  const [notifLog, setNotifLog] = useState<Array<{ client: string; prop: string; time: string }>>([]);

  // Criteria state
  const [cType, setCType] = useState("");
  const [cBmin, setCBmin] = useState<number | "">("");
  const [cBmax, setCBmax] = useState<number | "">("");
  const [cSmin, setCSmin] = useState<number | "">("");
  const [cSmax, setCSmax] = useState<number | "">("");
  const [cRooms, setCRooms] = useState<number | "">("");
  const [cBaths, setCBaths] = useState<number | "">("");
  const [cZone, setCZone] = useState("");
  const [cFacilities, setCFacilities] = useState<string[]>([]);
  const [cMinScore, setCMinScore] = useState(50);

  const filteredClients = useMemo(() =>
    CLIENTS.filter(c => c.name.toLowerCase().includes(clientSearch.toLowerCase())),
    [clientSearch]
  );

  const selectClient = useCallback((c: Client) => {
    setSelectedClient(c);
    setCBmin(c.budget[0]); setCBmax(c.budget[1]);
    setCSmin(c.surface[0]); setCSmax(c.surface[1]);
    setCRooms(c.rooms); setCZone(c.zones.join(", "));
    setCFacilities([...c.facilities]);
    toast({ title: `👤 Client selectat: ${c.name}`, description: "Criterii pre-completate din preferințe" });
  }, [toast]);

  const resetCriteria = () => {
    setCType(""); setCBmin(""); setCBmax(""); setCSmin(""); setCSmax("");
    setCRooms(""); setCBaths(""); setCZone(""); setCFacilities([]); setCMinScore(50);
  };

  const toggleFacility = (val: string) => {
    setCFacilities(prev => prev.includes(val) ? prev.filter(f => f !== val) : [...prev, val]);
  };

  const runMatch = useCallback(() => {
    if (!selectedClient) { toast({ title: "⚠️ Selectează un client mai întâi!" }); return; }
    setIsProcessing(true); setHasRun(true);

    const crit: Criteria = {
      type: cType, bmin: cBmin || 0, bmax: cBmax || 0, smin: cSmin || 0, smax: cSmax || 0,
      rooms: cRooms || 0, baths: cBaths || 0, zone: cZone, facilities: cFacilities, minScore: cMinScore,
    };

    setTimeout(() => {
      const matched = PROPERTIES.map(p => {
        const m = scoreMatch(selectedClient, p, crit);
        return { ...p, matchScore: m.total, scoreDetail: m.scores } as MatchResult;
      }).filter(p => p.matchScore >= cMinScore).sort((a, b) => b.matchScore - a.matchScore);

      setResults(matched);
      setIsProcessing(false);
      toast({ title: matched.length > 0 ? `✅ ${matched.length} potriviri găsite` : "🔍 Nicio potrivire", description: matched.length > 0 ? `Scor minim: ${cMinScore}%` : "Încearcă un prag mai mic" });
    }, 1200);
  }, [selectedClient, cType, cBmin, cBmax, cSmin, cSmax, cRooms, cBaths, cZone, cFacilities, cMinScore, toast]);

  const sortedResults = useMemo(() => {
    const sorted = [...results];
    if (sortBy === "score") sorted.sort((a, b) => b.matchScore - a.matchScore);
    else if (sortBy === "price_asc") sorted.sort((a, b) => a.price - b.price);
    else if (sortBy === "price_desc") sorted.sort((a, b) => b.price - a.price);
    else if (sortBy === "surface") sorted.sort((a, b) => b.surface - a.surface);
    return sorted;
  }, [results, sortBy]);

  const avgScore = results.length ? Math.round(results.reduce((s, r) => s + r.matchScore, 0) / results.length) : 0;

  const sendNotif = (prop: MatchResult) => {
    if (!selectedClient) return;
    const key = `${prop.id}_${selectedClient.id}`;
    if (notifsSent.has(key)) { toast({ title: "ℹ️ Notificare deja trimisă" }); return; }
    setNotifsSent(prev => new Set(prev).add(key));
    setNotifLog(prev => [{ client: selectedClient.name, prop: prop.title.slice(0, 40), time: "Acum" }, ...prev]);
    toast({ title: `📧 Notificare trimisă lui ${selectedClient.name}` });
  };

  const inputCls = "w-full bg-surface2 border border-subtle rounded-lg px-3 py-2 text-xs text-foreground outline-none focus:border-gold transition-colors";

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 flex flex-col gap-4 animate-fade-up">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold-dim border border-gold/20 flex items-center justify-center text-lg">🎯</div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-xl md:text-2xl font-bold">Matching AI</h1>
                <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded bg-gold-dim border border-gold/25 text-gold">ÎN DEZVOLTARE</span>
              </div>
              <p className="text-xs text-dim mt-0.5">Motor inteligent de potrivire între proprietăți și cerințele clienților</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowReport(!showReport)} className="px-3 py-2 rounded-lg border border-subtle bg-surface text-dim text-xs font-medium hover:bg-surface2 hover:text-foreground transition-all">
              📋 Raport
            </button>
            <button onClick={() => { toast({ title: "⚡ Matching rulat pentru toți clienții — 128 rezultate generate" }); }} className="px-4 py-2 rounded-lg bg-gradient-to-r from-gold to-gold/80 text-primary-foreground text-xs font-bold hover:opacity-90 transition-all">
              ⚡ Match Toți Clienții
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 animate-fade-up-delay-1">
          {[
            { label: "Potriviri Generate", value: hasRun ? results.length.toString() : "0", sub: "Total sesiune", accent: "gradient-gold-bottom" },
            { label: "Scor Mediu", value: hasRun && results.length ? `${avgScore}%` : "—", sub: "Compatibilitate medie", accent: "gradient-teal-bottom" },
            { label: "Notificări Trimise", value: notifLog.length.toString(), sub: "Email + WhatsApp", accent: "gradient-blue-bottom" },
            { label: "Vizionări Generate", value: "23", sub: "↑ 8 față de săpt. trecută", accent: "bg-purple-dim" },
            { label: "Conversie Matching", value: "34%", sub: "Matching → Vizionare", accent: "bg-gold-dim" },
          ].map((s, i) => (
            <div key={i} className="bg-surface border border-subtle rounded-xl p-4 relative overflow-hidden hover:border-gold/25 transition-all group">
              <div className={`absolute top-0 left-0 right-0 h-0.5 ${s.accent}`} />
              <div className="text-[10px] font-semibold tracking-wider uppercase text-dim mb-1.5">{s.label}</div>
              <div className="font-serif text-2xl font-bold">{s.value}</div>
              <div className="text-[11px] text-dim2 mt-1">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Report Bar */}
        {showReport && (
          <div className="bg-surface border border-subtle rounded-xl p-4 md:p-5 animate-fade-up">
            <div className="font-serif text-sm font-bold mb-3">📋 Raport Matching — Luna Aceasta</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {[
                { val: "847", label: "Potriviri totale", cls: "text-gold" },
                { val: "312", label: "Notificări trimise", cls: "text-info-blue" },
                { val: "108", label: "Vizionări generate", cls: "text-purple" },
                { val: "23", label: "Tranzacții inițiate", cls: "text-teal" },
              ].map((r, i) => (
                <div key={i} className="text-center">
                  <div className={`font-serif text-xl font-bold ${r.cls}`}>{r.val}</div>
                  <div className="text-[11px] text-dim mt-1">{r.label}</div>
                </div>
              ))}
            </div>
            <div className="text-[10px] font-semibold tracking-wider uppercase text-dim mb-2">Funnel conversie</div>
            <div className="flex gap-1 h-10 rounded-lg overflow-hidden">
              <div className="flex-[5] bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-[10px] font-bold text-primary-foreground">Potriviri 847</div>
              <div className="flex-[3.5] bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center text-[10px] font-bold text-primary-foreground">Notif. 312</div>
              <div className="flex-[1.3] bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-center text-[10px] font-bold text-primary-foreground">Viz. 108</div>
              <div className="flex-[0.3] bg-gradient-to-r from-emerald-500 to-emerald-600 flex items-center justify-center text-[10px] font-bold text-primary-foreground">23</div>
            </div>
          </div>
        )}

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4 animate-fade-up-delay-2">
          {/* Left Panel */}
          <div className="flex flex-col gap-3">
            {/* Client Selector */}
            <div className="bg-surface border border-subtle rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-subtle flex items-center justify-between">
                <span className="font-serif text-[13px] font-bold">👤 Selectează Client</span>
                <span className="text-[11px] text-dim">{selectedClient?.name || "Niciunul"}</span>
              </div>
              <div className="p-2.5">
                <input placeholder="🔍 Caută client…" value={clientSearch} onChange={e => setClientSearch(e.target.value)} className={`${inputCls} mb-2`} />
                <div className="flex flex-col gap-1 max-h-[260px] overflow-y-auto">
                  {filteredClients.map(c => (
                    <div key={c.id} onClick={() => selectClient(c)}
                      className={`flex items-center gap-2.5 p-2.5 rounded-lg cursor-pointer transition-all border ${selectedClient?.id === c.id ? "bg-gold-dim/30 border-gold/30" : "border-transparent hover:bg-surface2"}`}>
                      <div className={`w-[34px] h-[34px] rounded-lg bg-gradient-to-br ${c.gradient} flex items-center justify-center font-serif font-bold text-[12px] text-primary-foreground flex-shrink-0`}>{c.initials}</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-medium truncate">{c.name}</div>
                        <div className="text-[11px] text-dim">{c.type} · {c.zones[0]}</div>
                      </div>
                      <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${scoreBgClass(c.lastMatch)} ${scoreColorClass(c.lastMatch)}`}>{c.lastMatch}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Criteria Editor */}
            <div className="bg-surface border border-subtle rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-subtle flex items-center justify-between">
                <span className="font-serif text-[13px] font-bold">⚙️ Criterii Matching</span>
                <button onClick={resetCriteria} className="text-[11px] text-dim hover:text-foreground px-2 py-1 rounded border border-subtle hover:bg-surface2 transition-all">Reset</button>
              </div>
              <div className="p-4 flex flex-col gap-3">
                <div>
                  <label className="text-[11px] font-semibold tracking-wider uppercase text-dim mb-1 block">Tip proprietate</label>
                  <select value={cType} onChange={e => setCType(e.target.value)} className={inputCls}>
                    <option value="">Orice tip</option>
                    <option>Apartament</option>
                    <option>Casă / Vilă</option>
                    <option>Teren</option>
                    <option>Spațiu Comercial</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-semibold tracking-wider uppercase text-dim mb-1 block">Buget (€)</label>
                  <div className="flex items-center gap-2">
                    <input type="number" placeholder="Min" value={cBmin} onChange={e => setCBmin(e.target.value ? Number(e.target.value) : "")} className={inputCls} />
                    <span className="text-dim text-xs">—</span>
                    <input type="number" placeholder="Max" value={cBmax} onChange={e => setCBmax(e.target.value ? Number(e.target.value) : "")} className={inputCls} />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-semibold tracking-wider uppercase text-dim mb-1 block">Suprafață (m²)</label>
                  <div className="flex items-center gap-2">
                    <input type="number" placeholder="Min" value={cSmin} onChange={e => setCSmin(e.target.value ? Number(e.target.value) : "")} className={inputCls} />
                    <span className="text-dim text-xs">—</span>
                    <input type="number" placeholder="Max" value={cSmax} onChange={e => setCSmax(e.target.value ? Number(e.target.value) : "")} className={inputCls} />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-semibold tracking-wider uppercase text-dim mb-1 block">Camere / Băi</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input type="number" placeholder="Min camere" value={cRooms} onChange={e => setCRooms(e.target.value ? Number(e.target.value) : "")} className={inputCls} />
                    <input type="number" placeholder="Min băi" value={cBaths} onChange={e => setCBaths(e.target.value ? Number(e.target.value) : "")} className={inputCls} />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-semibold tracking-wider uppercase text-dim mb-1 block">Zonă preferată</label>
                  <input placeholder="ex. Floreasca, Dorobanți" value={cZone} onChange={e => setCZone(e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className="text-[11px] font-semibold tracking-wider uppercase text-dim mb-1 block">Facilități dorite</label>
                  <div className="flex flex-wrap gap-1.5">
                    {FACILITIES.map(f => (
                      <button key={f.value} onClick={() => toggleFacility(f.value)}
                        className={`px-2 py-1 rounded-md text-[11px] border transition-all ${cFacilities.includes(f.value) ? "bg-gold-dim border-gold/30 text-gold" : "bg-surface2 border-subtle text-dim hover:border-gold/20"}`}>
                        {f.icon} {f.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-semibold tracking-wider uppercase text-dim mb-1 block">Prag minim scor (%)</label>
                  <div className="flex items-center gap-3">
                    <input type="range" min={0} max={100} value={cMinScore} onChange={e => setCMinScore(Number(e.target.value))} className="flex-1 accent-gold" />
                    <span className="font-serif text-sm font-bold text-gold w-10 text-right">{cMinScore}%</span>
                  </div>
                </div>
                <button onClick={runMatch} disabled={isProcessing}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-gold to-gold/80 text-primary-foreground font-serif text-[13px] font-bold flex items-center justify-center gap-2 hover:opacity-90 active:scale-[.98] transition-all disabled:opacity-60">
                  {isProcessing ? <>⏳ Se procesează…</> : <>🤖 Rulează Matching AI</>}
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="flex flex-col gap-3">
            {/* Results Header */}
            <div className="flex items-center gap-3">
              <span className="font-serif text-[15px] font-bold">Rezultate Matching</span>
              <span className="text-xs text-dim bg-surface border border-subtle px-2 py-0.5 rounded-md">
                {hasRun ? `${sortedResults.length} potriviri` : "Niciun rezultat"}
              </span>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="ml-auto bg-surface border border-subtle rounded-lg px-3 py-1.5 text-xs text-foreground outline-none cursor-pointer">
                <option value="score">Sort: Scor ↓</option>
                <option value="price_asc">Preț ↑</option>
                <option value="price_desc">Preț ↓</option>
                <option value="surface">Suprafață ↓</option>
              </select>
            </div>

            {/* Results */}
            <div className="relative flex flex-col gap-3 min-h-[200px]">
              {isProcessing && (
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3 z-10 rounded-xl">
                  <div className="w-12 h-12 border-[3px] border-subtle border-t-gold rounded-full animate-spin" />
                  <span className="font-serif text-sm font-semibold">🤖 AI Analizează Proprietățile…</span>
                  <span className="text-xs text-dim">Se calculează compatibilitatea pentru {PROPERTIES.length} proprietăți</span>
                </div>
              )}

              {!hasRun && !isProcessing && (
                <div className="text-center py-12">
                  <div className="text-5xl mb-3 opacity-30">🎯</div>
                  <div className="font-serif text-base font-semibold mb-1">Niciun matching rulat încă</div>
                  <div className="text-sm text-dim">Selectează un client, setează criteriile și apasă <strong className="text-gold">Rulează Matching AI</strong></div>
                </div>
              )}

              {hasRun && !isProcessing && sortedResults.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-5xl mb-3 opacity-30">🔍</div>
                  <div className="font-serif text-base font-semibold mb-1">Nicio potrivire</div>
                  <div className="text-sm text-dim">Încearcă să reduci pragul minim sau să relaxezi criteriile.</div>
                </div>
              )}

              {sortedResults.map((prop, idx) => {
                const sd = prop.scoreDetail;
                const isSent = selectedClient ? notifsSent.has(`${prop.id}_${selectedClient.id}`) : false;
                return (
                  <div key={prop.id} className={`bg-surface border rounded-xl overflow-hidden flex transition-all hover:border-gold/30 hover:-translate-y-0.5 hover:shadow-xl cursor-pointer relative ${idx === 0 ? "border-gold/35 bg-gradient-to-r from-gold/[0.03] to-transparent" : "border-subtle"}`}>
                    {idx === 0 && <div className="absolute top-0 right-0 bg-gradient-to-r from-gold to-gold/80 text-[10px] px-2 py-0.5 rounded-bl-lg text-primary-foreground font-bold font-serif z-10">🏆 Best Match</div>}
                    {/* Image placeholder */}
                    <div className="w-[100px] md:w-[140px] flex-shrink-0 bg-surface2 flex items-center justify-center text-3xl opacity-50 relative">
                      <span>{prop.icon}</span>
                      <div className={`absolute top-2 left-2 bg-background/85 px-1.5 py-0.5 rounded text-[10px] font-bold ${scoreColorClass(prop.matchScore)}`}>{prop.matchScore}%</div>
                    </div>
                    {/* Body */}
                    <div className="flex-1 p-3 md:p-4 min-w-0">
                      <div className="flex items-start gap-2 mb-2">
                        <div className="text-[13px] md:text-sm font-semibold flex-1 leading-tight">{prop.title}</div>
                        <div className="font-serif text-base md:text-lg font-bold text-gold flex-shrink-0">{formatEur(prop.price)}</div>
                      </div>
                      <div className="flex gap-3 mb-2 flex-wrap text-[12px] text-dim">
                        <span>📍 {prop.zone}</span>
                        {prop.rooms > 0 && <span><strong className="text-foreground">{prop.rooms}</strong> cam.</span>}
                        <span><strong className="text-foreground">{prop.surface}</strong> m²</span>
                        {prop.baths > 0 && <span><strong className="text-foreground">{prop.baths}</strong> băi</span>}
                        {prop.floor > 0 && <span>Et. <strong className="text-foreground">{prop.floor}</strong></span>}
                      </div>
                      {/* Score Section */}
                      <div className="flex items-center gap-3 mb-2">
                        <ScoreRingSvg score={prop.matchScore} />
                        <div className="flex-1 flex flex-col gap-1">
                          <ScoreCritBar name="Buget" value={sd.buget} />
                          <ScoreCritBar name="Suprafață" value={sd.suprafata} />
                          <ScoreCritBar name="Camere" value={sd.camere} />
                          <ScoreCritBar name="Zonă" value={sd.zona} />
                          <ScoreCritBar name="Facilități" value={sd.facilitati} />
                        </div>
                      </div>
                      {/* Tags */}
                      <div className="flex gap-1 flex-wrap mb-2">
                        {sd.zona === 100 ? <MatchTag type="match" label="✓ Zona dorită" /> : <MatchTag type="miss" label="✗ Altă zonă" />}
                        {sd.buget >= 90 ? <MatchTag type="match" label="✓ În buget" /> : sd.buget >= 60 ? <MatchTag type="partial" label="~ Ușor depășit" /> : <MatchTag type="miss" label="✗ Depășit buget" />}
                        {sd.camere === 100 ? <MatchTag type="match" label="✓ Camere OK" /> : sd.camere >= 60 ? <MatchTag type="partial" label={`~ ${prop.rooms} cam.`} /> : null}
                        {sd.facilitati >= 80 ? <MatchTag type="match" label="✓ Facilități" /> : sd.facilitati < 40 ? <MatchTag type="miss" label="✗ Facilități lipsă" /> : null}
                        <MatchTag type="neutral" label={prop.type} />
                        {prop.status === "Rezervat" && <MatchTag type="partial" label="⏳ Rezervat" />}
                      </div>
                      {/* Actions */}
                      <div className="flex gap-2 pt-2 border-t border-subtle">
                        <button onClick={(e) => { e.stopPropagation(); setDetailProp(prop); }} className="flex-1 py-1.5 rounded-lg border border-subtle text-xs text-dim hover:bg-surface2 hover:text-foreground transition-all flex items-center justify-center gap-1">🔍 Detalii</button>
                        <button onClick={(e) => { e.stopPropagation(); toast({ title: `📅 Vizionare programată: ${prop.title.slice(0, 35)}` }); }} className="flex-1 py-1.5 rounded-lg border border-subtle text-xs text-dim hover:bg-surface2 hover:text-foreground transition-all flex items-center justify-center gap-1">📅 Vizionare</button>
                        <button onClick={(e) => { e.stopPropagation(); sendNotif(prop); }}
                          className={`flex-1 py-1.5 rounded-lg border text-xs font-medium transition-all flex items-center justify-center gap-1 ${isSent ? "bg-teal-dim border-teal/20 text-teal" : "bg-blue-dim border-[hsl(var(--blue))]/20 text-info-blue hover:bg-blue-dim/60"}`}>
                          {isSent ? "✅ Trimis" : "📧 Notifică"}
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); toast({ title: `➕ ${prop.title.slice(0, 35)} adăugat în Pipeline` }); }} className="flex-1 py-1.5 rounded-lg bg-gold-dim/50 border border-gold/25 text-xs font-medium text-gold hover:bg-gold-dim transition-all flex items-center justify-center gap-1">➕ Pipeline</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Notification Log */}
            {notifLog.length > 0 && (
              <div className="bg-surface border border-subtle rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-subtle flex items-center justify-between">
                  <span className="font-serif text-[13px] font-bold">🔔 Log Notificări</span>
                  <span className="text-[11px] text-dim">{notifLog.length} trimise</span>
                </div>
                <div className="p-3 max-h-[180px] overflow-y-auto flex flex-col gap-0">
                  {notifLog.map((n, i) => (
                    <div key={i} className="flex items-center gap-2.5 py-2 border-b border-subtle/30 last:border-b-0">
                      <div className="w-7 h-7 rounded-lg bg-surface2 flex items-center justify-center text-xs flex-shrink-0">📧</div>
                      <div className="flex-1 text-xs"><strong>{n.client}</strong> — {n.prop}…</div>
                      <div className="text-[11px] text-dim flex-shrink-0">{n.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Property Detail Modal */}
      <Dialog open={!!detailProp} onOpenChange={o => { if (!o) setDetailProp(null); }}>
        <DialogContent className="bg-surface border-subtle max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif text-base">{detailProp?.title}</DialogTitle>
          </DialogHeader>
          {detailProp && (
            <div className="flex flex-col gap-3">
              <div>
                <div className="font-serif text-xl font-bold text-gold mb-0.5">{formatEur(detailProp.price)}</div>
                <div className="text-xs text-dim">{detailProp.zone} · {detailProp.status}</div>
              </div>
              {[
                ["Tip", detailProp.type],
                ["Suprafață", `${detailProp.surface} m²`],
                ...(detailProp.rooms ? [["Camere", detailProp.rooms.toString()]] : []),
                ...(detailProp.baths ? [["Băi", detailProp.baths.toString()]] : []),
                ...(detailProp.floor ? [["Etaj", detailProp.floor.toString()]] : []),
                ["Zonă", detailProp.zone],
                ["Facilități", detailProp.facilities.join(", ") || "—"],
              ].map(([l, v], i) => (
                <div key={i} className="flex justify-between items-center py-1.5 text-sm border-b border-subtle/30">
                  <span className="text-dim">{l}</span>
                  <span className="font-medium">{v}</span>
                </div>
              ))}
              {selectedClient && (
                <div className="mt-2 p-3 bg-gold-dim/20 border border-gold/15 rounded-lg">
                  <div className="text-[10px] font-bold tracking-wider uppercase text-dim mb-2">Compatibilitate cu {selectedClient.name}</div>
                  <div className="flex flex-col gap-1.5">
                    {(["Buget", "Suprafață", "Camere", "Zonă", "Tip", "Facilități"] as const).map((n, i) => {
                      const val = [detailProp.scoreDetail.buget, detailProp.scoreDetail.suprafata, detailProp.scoreDetail.camere, detailProp.scoreDetail.zona, detailProp.scoreDetail.tip, detailProp.scoreDetail.facilitati][i];
                      return <ScoreCritBar key={n} name={n} value={val} />;
                    })}
                  </div>
                  <div className={`mt-2 font-serif text-base font-bold ${scoreColorClass(detailProp.matchScore)}`}>Total: {detailProp.matchScore}%</div>
                </div>
              )}
              <div className="flex gap-2 mt-2">
                <button onClick={() => { sendNotif(detailProp); setDetailProp(null); }} className="flex-1 py-2 rounded-lg bg-gradient-to-r from-gold to-gold/80 text-primary-foreground text-xs font-bold">📧 Notifică Client</button>
                <button onClick={() => { toast({ title: `📅 Vizionare programată: ${detailProp.title.slice(0, 35)}` }); setDetailProp(null); }} className="flex-1 py-2 rounded-lg border border-subtle text-xs font-medium text-dim hover:bg-surface2">📅 Vizionare</button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
