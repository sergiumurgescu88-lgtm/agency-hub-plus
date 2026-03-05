import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Download, RefreshCw, FileText, Plus, RotateCw, Edit } from "lucide-react";

// ══ DATA ══
const REV_LUNAR = { labels: ["Oct","Nov","Dec","Ian","Feb","Mar"], vals: [32000,28500,41200,38000,35600,48500] };
const REV_SAPT = { labels: ["S1","S2","S3","S4","S5","S6","S7","S8"], vals: [8200,11400,9800,13600,10200,12800,14100,16300] };

const FUNNEL = [
  { stage: "Lead", n: 128, colorClass: "bg-[hsl(var(--blue))]" },
  { stage: "Contactat", n: 94, colorClass: "bg-[hsl(var(--purple))]" },
  { stage: "Vizionare", n: 58, colorClass: "bg-[hsl(var(--gold))]" },
  { stage: "Negociere", n: 31, colorClass: "bg-[hsl(40_100%_74%)]" },
  { stage: "Contract", n: 19, colorClass: "bg-[hsl(var(--teal))]" },
  { stage: "Finalizat", n: 16, colorClass: "bg-[hsl(var(--teal))]" },
];

const PROP_TYPES = [
  { label: "Apartament", val: 52, cls: "bg-[hsl(var(--gold))]", text: "text-gold" },
  { label: "Casă / Vilă", val: 24, cls: "bg-[hsl(var(--blue))]", text: "text-info-blue" },
  { label: "Teren", val: 12, cls: "bg-[hsl(var(--teal))]", text: "text-teal" },
  { label: "Comercial", val: 8, cls: "bg-[hsl(var(--purple))]", text: "text-purple" },
  { label: "Industrial", val: 4, cls: "bg-[hsl(40_100%_74%)]", text: "text-gold" },
];

const LEAD_SOURCES = [
  { label: "imobiliare.ro", val: 38, cls: "bg-[hsl(var(--gold))]", text: "text-gold" },
  { label: "Referral", val: 27, cls: "bg-[hsl(var(--blue))]", text: "text-info-blue" },
  { label: "Site Propriu", val: 18, cls: "bg-[hsl(var(--teal))]", text: "text-teal" },
  { label: "Facebook Ads", val: 10, cls: "bg-[hsl(var(--purple))]", text: "text-purple" },
  { label: "OLX", val: 7, cls: "bg-[hsl(40_100%_74%)]", text: "text-gold" },
];

const TIME_TO_SELL = [
  { label: "Apartament", days: 28, cls: "bg-[hsl(var(--gold))]", text: "text-gold" },
  { label: "Casă", days: 52, cls: "bg-[hsl(var(--blue))]", text: "text-info-blue" },
  { label: "Teren", days: 94, cls: "bg-[hsl(var(--teal))]", text: "text-teal" },
  { label: "Comercial", days: 78, cls: "bg-[hsl(var(--purple))]", text: "text-purple" },
];

const AGENTS = [
  { name: "Andrei Ionescu", initials: "AI", color: "hsl(var(--gold))", com: 24800, tranz: 7, conv: 34, timp: 28, rating: 4.9, target: 88, trend: [3,5,4,6,5,7], delta: "+18%" },
  { name: "Maria Constantin", initials: "MC", color: "hsl(var(--blue))", com: 18600, tranz: 5, conv: 29, timp: 34, rating: 4.7, target: 74, trend: [4,3,5,4,6,5], delta: "+9%" },
  { name: "Radu Popescu", initials: "RP", color: "hsl(var(--teal))", com: 15200, tranz: 4, conv: 26, timp: 38, rating: 4.5, target: 61, trend: [2,3,4,3,4,4], delta: "+5%" },
  { name: "Elena Gheorghiu", initials: "EG", color: "hsl(var(--purple))", com: 8400, tranz: 2, conv: 18, timp: 45, rating: 4.2, target: 34, trend: [1,2,1,2,2,2], delta: "-2%" },
];

const ZONES = [
  { name: "Floreasca", tranz: 18, pret: 2840, cerere: 92, color: "hsl(var(--gold))" },
  { name: "Dorobanți", tranz: 15, pret: 3100, cerere: 88, color: "hsl(var(--gold2))" },
  { name: "Pipera", tranz: 12, pret: 2200, cerere: 74, color: "hsl(40 100% 74%)" },
  { name: "Aviatorilor", tranz: 11, pret: 2960, cerere: 82, color: "hsl(var(--gold))" },
  { name: "Victoriei", tranz: 9, pret: 3300, cerere: 78, color: "hsl(24 90% 60%)" },
  { name: "Drumul Taberei", tranz: 8, pret: 1580, cerere: 65, color: "hsl(var(--teal))" },
  { name: "Titan", tranz: 7, pret: 1420, cerere: 58, color: "hsl(var(--blue))" },
  { name: "Berceni", tranz: 5, pret: 1240, cerere: 44, color: "hsl(var(--purple))" },
  { name: "Militari", tranz: 6, pret: 1360, cerere: 52, color: "hsl(165 87% 55%)" },
  { name: "Pantelimon", tranz: 3, pret: 1100, cerere: 36, color: "hsl(var(--text2))" },
  { name: "Băneasa", tranz: 14, pret: 2600, cerere: 85, color: "hsl(24 90% 60%)" },
  { name: "1 Decembrie", tranz: 4, pret: 1180, cerere: 41, color: "hsl(var(--red))" },
];

const PRICE_DATA: Record<string, { labels: string[]; vals: number[] }> = {
  "6l": { labels: ["Oct","Nov","Dec","Ian","Feb","Mar"], vals: [2480,2520,2560,2600,2680,2750] },
  "1an": { labels: ["Apr","Mai","Iun","Iul","Aug","Sep","Oct","Nov","Dec","Ian","Feb","Mar"], vals: [2200,2240,2280,2310,2360,2400,2480,2520,2560,2600,2680,2750] },
  "3an": { labels: ["2023","2024","2025"], vals: [1950,2280,2750] },
};

const DEMAND_SUPPLY = [
  { label: "Ian", cerere: 68, oferta: 55 },
  { label: "Feb", cerere: 72, oferta: 52 },
  { label: "Mar", cerere: 84, oferta: 48 },
];

const REPORTS = [
  { name: "Raport Lunar Agenție", desc: "Venituri, tranzacții, agenți, portofoliu", icon: "🏢", format: "PDF + Excel" },
  { name: "Performanță Agenți", desc: "Clasament, conversie, satisfacție clienți", icon: "👥", format: "PDF" },
  { name: "Piața Imobiliară", desc: "Prețuri, cerere/ofertă, heatmap zone", icon: "📈", format: "PDF" },
  { name: "Raport MLS", desc: "Colaborări, split comisioane, parteneri", icon: "🤝", format: "Excel" },
  { name: "Pipeline & Conversie", desc: "Funnel complet cu timp mediu per etapă", icon: "📋", format: "PDF" },
  { name: "Campanii Marketing", desc: "WA + Email: open rate, conversii, ROI", icon: "📱", format: "Excel" },
];

const SCHEDULED = [
  { name: "Raport Lunar Agenție", freq: "Lunar — 1 ale lunii", next: "1 Apr", active: true },
  { name: "Performanță Agenți", freq: "Săptămânal — Luni 8:00", next: "7 Apr", active: true },
  { name: "Piața Imobiliară", freq: "Trimestrial", next: "1 Apr", active: false },
];

const HISTORY = [
  { name: "Raport Lunar Agenție", period: "Feb 2025", by: "Andrei Ionescu", date: "01 Mar 2025", format: "PDF" },
  { name: "Performanță Agenți", period: "Feb 2025", by: "Andrei Ionescu", date: "03 Mar 2025", format: "PDF" },
  { name: "Raport MLS", period: "Q1 2025", by: "Maria Constantin", date: "28 Feb 2025", format: "Excel" },
  { name: "Piața Imobiliară", period: "Ian 2025", by: "Andrei Ionescu", date: "01 Feb 2025", format: "PDF" },
  { name: "Campanii Marketing", period: "Ian 2025", by: "Radu Popescu", date: "05 Feb 2025", format: "Excel" },
];

const euro = (v: number) => "€" + Math.round(v).toLocaleString("ro");

// ══ SMALL COMPONENTS ══

function StatCard({ label, value, sub, colorClass }: { label: string; value: string; sub: string; colorClass: string }) {
  const borders: Record<string, string> = { gold: "gradient-gold-bottom", green: "gradient-teal-bottom", blue: "gradient-blue-bottom", purple: "bg-purple-dim", yellow: "bg-gold-dim" };
  return (
    <Card className="relative overflow-hidden hover:border-[hsl(var(--gold)/0.25)] transition-all hover:-translate-y-0.5">
      <div className={`absolute top-0 left-0 right-0 h-0.5 ${borders[colorClass] || "gradient-gold-bottom"}`} />
      <CardContent className="p-4">
        <p className="text-[11px] font-semibold tracking-wider uppercase text-dim mb-1.5">{label}</p>
        <p className="text-2xl font-bold leading-none">{value}</p>
        <p className="text-xs text-dim mt-1">{sub}</p>
      </CardContent>
    </Card>
  );
}

function BarChart({ data, maxVal }: { data: { label: string; val: number; cls: string; text: string; unit?: string }[]; maxVal?: number }) {
  const max = maxVal || Math.max(...data.map(d => d.val));
  return (
    <div className="space-y-2.5">
      {data.map(d => (
        <div key={d.label} className="flex items-center gap-2.5 cursor-pointer" onClick={() => toast.info(`${d.label}: ${d.val}${d.unit || ""}`)}>
          <span className="text-[13px] w-[110px] text-right text-dim flex-shrink-0">{d.label}</span>
          <div className="flex-1 h-[9px] bg-surface2 rounded-[5px] overflow-hidden">
            <div className={`h-full rounded-[5px] ${d.cls}`} style={{ width: `${(d.val / max) * 100}%`, transition: "width 0.8s cubic-bezier(.4,0,.2,1)" }} />
          </div>
          <span className={`text-xs font-bold w-14 flex-shrink-0 ${d.text}`}>{d.val}{d.unit || ""}</span>
        </div>
      ))}
    </div>
  );
}

function Sparkline({ vals, color }: { vals: number[]; color: string }) {
  const max = Math.max(...vals);
  return (
    <div className="flex items-end gap-0.5 h-8">
      {vals.map((v, i) => (
        <div key={i} className="flex-1 min-w-[3px] rounded-t-sm" style={{ height: `${(v / max) * 32}px`, background: `${color}80` }} />
      ))}
    </div>
  );
}

function PillToggle({ options, active, onChange }: { options: string[]; active: string; onChange: (v: string) => void }) {
  return (
    <div className="flex gap-1">
      {options.map(o => (
        <button key={o} onClick={() => onChange(o)}
          className={`px-3 py-1 rounded-md text-xs border transition-all ${active === o ? "bg-surface2 text-foreground border-subtle2" : "border-subtle text-dim hover:text-foreground"}`}>
          {o}
        </button>
      ))}
    </div>
  );
}

// ══ MAIN ══
export default function Analytics() {
  const [revMode, setRevMode] = useState<"Lunar" | "Săptămânal">("Lunar");
  const [hmMode, setHmMode] = useState<"Tranzacții" | "Preț/mp" | "Cerere">("Tranzacții");
  const [priceMode, setPriceMode] = useState<"6 luni" | "1 an" | "3 ani">("6 luni");
  const [generating, setGenerating] = useState<string | null>(null);

  const revData = revMode === "Lunar" ? REV_LUNAR : REV_SAPT;
  const revMax = Math.max(...revData.vals);

  const priceKey = priceMode === "6 luni" ? "6l" : priceMode === "1 an" ? "1an" : "3an";
  const priceData = PRICE_DATA[priceKey];
  const priceMax = Math.max(...priceData.vals);
  const priceMin = Math.min(...priceData.vals);

  const hmKey = hmMode === "Tranzacții" ? "tranz" : hmMode === "Preț/mp" ? "pret" : "cerere";
  const hmVals = ZONES.map(z => z[hmKey as keyof typeof z] as number);
  const hmMax = Math.max(...hmVals);
  const hmMin = Math.min(...hmVals);

  const hmLayout = [
    ["Aviatorilor","Floreasca","Dorobanți","Victoriei"],
    ["Drumul Taberei","Pipera","Băneasa","1 Decembrie"],
    ["Militari","Titan","Berceni","Pantelimon"],
  ];

  const topZones = useMemo(() => [...ZONES].sort((a, b) => (b[hmKey as keyof typeof b] as number) - (a[hmKey as keyof typeof a] as number)).slice(0, 8), [hmKey]);

  const genReport = (name: string) => {
    setGenerating(name);
    toast.info(`📊 Se generează ${name}…`);
    setTimeout(() => { setGenerating(null); toast.success(`✅ ${name} generat cu succes!`); }, 1800);
  };

  const sortedByCom = [...AGENTS].sort((a, b) => b.com - a.com);
  const sortedByTranz = [...AGENTS].sort((a, b) => b.tranz - a.tranz);
  const medals = ["🥇", "🥈", "🥉"];

  return (
    <DashboardLayout>
    <div className="space-y-5 animate-fade-up p-4 md:p-7">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-extrabold flex items-center gap-2">📊 Analytics</h1>
          <p className="text-sm text-dim mt-1">Rapoarte, performanță și insight-uri de piață</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Select defaultValue="toti" onValueChange={() => toast.info("🔍 Filtru aplicat")}>
            <SelectTrigger className="h-8 text-xs w-36"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="toti">Toți agenții</SelectItem>
              {AGENTS.map(a => <SelectItem key={a.initials} value={a.initials}>{a.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select defaultValue="30z" onValueChange={() => toast.info("🔍 Filtru aplicat")}>
            <SelectTrigger className="h-8 text-xs w-36"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="30z">Ultimele 30 zile</SelectItem>
              <SelectItem value="3l">Ultimele 3 luni</SelectItem>
              <SelectItem value="6l">Ultimele 6 luni</SelectItem>
              <SelectItem value="an">Anul 2025</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="text-xs hidden md:inline-flex" onClick={() => { toast.info("📊 Se generează PDF…"); setTimeout(() => toast.success("✅ PDF generat!"), 1600); }}><FileText className="w-3.5 h-3.5" />PDF</Button>
          <Button variant="outline" size="sm" className="text-xs hidden md:inline-flex" onClick={() => { toast.info("📤 Se exportă Excel…"); setTimeout(() => toast.success("✅ Excel exportat!"), 1200); }}><Download className="w-3.5 h-3.5" />Excel</Button>
          <Button size="sm" className="text-xs" onClick={() => toast.success("🔄 Date reîncărcate")}><RefreshCw className="w-3.5 h-3.5" />Refresh</Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5 md:gap-3.5">
        <StatCard label="Venituri Totale" value="€48.5K" sub="↑ +12% față de luna trecută" colorClass="gold" />
        <StatCard label="Tranzacții Finalizate" value="16" sub="↑ +3 față de Feb" colorClass="green" />
        <StatCard label="Clienți Activi" value="34" sub="↑ +7 noi luna asta" colorClass="blue" />
        <StatCard label="Rată Conversie" value="28%" sub="↑ +4% față de Jan" colorClass="purple" />
        <StatCard label="Timp Mediu Vânzare" value="38 zile" sub="↓ −6 zile față de Feb" colorClass="yellow" />
      </div>

      {/* TABS */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-surface border border-subtle overflow-x-auto w-full justify-start">
          <TabsTrigger value="overview">📈 Overview</TabsTrigger>
          <TabsTrigger value="leaderboard">🏆 Leaderboard</TabsTrigger>
          <TabsTrigger value="heatmap">🗺️ Heatmap Zone</TabsTrigger>
          <TabsTrigger value="piata">🏘️ Piața</TabsTrigger>
          <TabsTrigger value="rapoarte">📋 Rapoarte</TabsTrigger>
        </TabsList>

        {/* ══ OVERVIEW ══ */}
        <TabsContent value="overview" className="space-y-4 animate-fade-up">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Revenue Chart */}
            <Card>
              <CardHeader className="py-3 px-4 border-b border-subtle flex-row items-center justify-between">
                <CardTitle className="text-sm font-semibold">💰 Evoluție Venituri</CardTitle>
                <PillToggle options={["Lunar","Săptămânal"]} active={revMode} onChange={v => setRevMode(v as typeof revMode)} />
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex items-end gap-1.5 h-[130px]">
                  {revData.vals.map((v, i) => {
                    const isLast = i === revData.vals.length - 1;
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1 cursor-pointer" onClick={() => toast.info(`${revData.labels[i]}: ${euro(v)}`)}>
                        <span className={`text-[10px] font-bold ${isLast ? "text-gold" : "text-transparent"}`}>{isLast ? euro(v) : "."}</span>
                        <div className={`w-full rounded-t transition-all duration-500 hover:opacity-75 ${isLast ? "bg-gradient-to-t from-[hsl(var(--gold))] to-[hsl(var(--gold2))]" : "bg-gold-dim"}`}
                          style={{ height: `${(v / revMax) * 120}px` }} />
                      </div>
                    );
                  })}
                </div>
                <div className="flex gap-1.5 mt-1.5">
                  {revData.labels.map((l, i) => (
                    <div key={l} className={`flex-1 text-center text-[10px] ${i === revData.labels.length - 1 ? "text-gold font-bold" : "text-dim"}`}>{l}</div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Pipeline Funnel */}
            <Card>
              <CardHeader className="py-3 px-4 border-b border-subtle flex-row items-center justify-between">
                <CardTitle className="text-sm font-semibold">📋 Pipeline Funnel</CardTitle>
                <span className="text-xs text-dim">Conversie pas cu pas</span>
              </CardHeader>
              <CardContent className="p-4 space-y-2">
                {FUNNEL.map((f, i) => {
                  const conv = i === 0 ? 100 : Math.round((f.n / FUNNEL[i - 1].n) * 100);
                  return (
                    <div key={f.stage} className="cursor-pointer" onClick={() => toast.info(`${f.stage}: ${f.n} leads${i > 0 ? ` (${conv}% conversie)` : ""}`)}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[13px] font-medium">{f.stage}</span>
                        <span className="text-xs font-bold text-gold">
                          {f.n}{i > 0 && <span className="text-[11px] text-dim ml-1.5">→ {conv}% conversie</span>}
                        </span>
                      </div>
                      <div className="h-2.5 bg-surface2 rounded-[5px] overflow-hidden">
                        <div className={`h-full rounded-[5px] ${f.colorClass}`} style={{ width: `${(f.n / FUNNEL[0].n) * 100}%`, transition: "width 0.8s ease" }} />
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="py-3 px-4 border-b border-subtle"><CardTitle className="text-sm font-semibold">🏠 Tip Proprietăți</CardTitle></CardHeader>
              <CardContent className="p-4">
                <BarChart data={PROP_TYPES.map(d => ({ ...d, unit: "%" }))} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="py-3 px-4 border-b border-subtle"><CardTitle className="text-sm font-semibold">📥 Surse Lead-uri</CardTitle></CardHeader>
              <CardContent className="p-4">
                <BarChart data={LEAD_SOURCES.map(d => ({ ...d, unit: "%" }))} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="py-3 px-4 border-b border-subtle"><CardTitle className="text-sm font-semibold">⏱ Timp Mediu Vânzare / Tip</CardTitle></CardHeader>
              <CardContent className="p-4">
                <BarChart data={TIME_TO_SELL.map(d => ({ label: d.label, val: d.days, cls: d.cls, text: d.text, unit: "z" }))} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ══ LEADERBOARD ══ */}
        <TabsContent value="leaderboard" className="space-y-4 animate-fade-up">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="py-3 px-4 border-b border-subtle flex-row items-center justify-between">
                <CardTitle className="text-sm font-semibold">🏆 Clasament Comisioane</CardTitle>
                <span className="text-xs text-dim">Martie 2025</span>
              </CardHeader>
              <CardContent className="p-0">
                {sortedByCom.map((ag, i) => (
                  <div key={ag.name} className="flex items-center gap-3 px-4 py-3 border-b border-subtle/30 last:border-b-0 hover:bg-surface2 cursor-pointer"
                    onClick={() => toast.info(`${ag.name}: ${euro(ag.com)} comisioane, ${ag.tranz} tranzacții`)}>
                    <span className="text-base font-extrabold w-7 text-center">{medals[i] || (i + 1)}</span>
                    <div className="w-[38px] h-[38px] rounded-[10px] flex items-center justify-center font-bold text-[13px] text-background flex-shrink-0"
                      style={{ background: ag.color }}>{ag.initials}</div>
                    <div className="flex-1">
                      <p className="text-[14px] font-semibold">{ag.name}</p>
                      <p className="text-xs text-dim">{ag.tranz} tranzacții • {ag.conv}% conv.</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold" style={{ color: ag.color }}>{euro(ag.com)}</p>
                      <Badge className={`text-[11px] border-0 ${ag.delta.startsWith("+") ? "bg-teal-dim text-teal" : "bg-red-dim text-danger"}`}>
                        {ag.delta.startsWith("+") ? "↑" : "↓"} {ag.delta}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="py-3 px-4 border-b border-subtle"><CardTitle className="text-sm font-semibold">💼 Clasament Tranzacții</CardTitle></CardHeader>
              <CardContent className="p-0">
                {sortedByTranz.map((ag, i) => (
                  <div key={ag.name} className="flex items-center gap-3 px-4 py-3 border-b border-subtle/30 last:border-b-0 hover:bg-surface2 cursor-pointer"
                    onClick={() => toast.info(`${ag.name}: ${ag.tranz} tranzacții finalizate`)}>
                    <span className="text-base font-extrabold w-7 text-center">{medals[i] || (i + 1)}</span>
                    <div className="w-[38px] h-[38px] rounded-[10px] flex items-center justify-center font-bold text-[13px] text-background flex-shrink-0"
                      style={{ background: ag.color }}>{ag.initials}</div>
                    <div className="flex-1">
                      <p className="text-[14px] font-semibold">{ag.name}</p>
                      <p className="text-xs text-dim">⭐ {ag.rating} satisfacție clienți</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">{ag.tranz} <span className="text-xs text-dim font-normal">tranz.</span></p>
                      <Badge className="text-[11px] border-0 bg-teal-dim text-teal">↑ target {ag.target}%</Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Perf Table */}
          <Card>
            <CardHeader className="py-3 px-4 border-b border-subtle flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold">📊 Performanță Agenți — Comparație 6 luni</CardTitle>
              <Button variant="outline" size="sm" className="text-xs" onClick={() => toast.success("📊 Raport agenți exportat")}><Download className="w-3.5 h-3.5" />Export</Button>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-[11px]">Agent</TableHead>
                    <TableHead className="text-[11px] text-center">Tranzacții</TableHead>
                    <TableHead className="text-[11px]">Comisioane</TableHead>
                    <TableHead className="text-[11px] text-center">Conversie</TableHead>
                    <TableHead className="text-[11px] text-center">Timp mediu</TableHead>
                    <TableHead className="text-[11px] text-center">Satisfacție</TableHead>
                    <TableHead className="text-[11px]">Target %</TableHead>
                    <TableHead className="text-[11px]">Trend</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {AGENTS.map(ag => (
                    <TableRow key={ag.name} className="cursor-pointer" onClick={() => toast.info(`📊 Profil detaliat: ${ag.name}`)}>
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[11px]"
                            style={{ color: ag.color, background: `${ag.color}20` }}>{ag.initials}</div>
                          <span className="font-medium text-[13px]">{ag.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center font-bold">{ag.tranz}</TableCell>
                      <TableCell className="font-bold text-gold">{euro(ag.com)}</TableCell>
                      <TableCell className="text-center">
                        <span className={`text-[13px] font-bold ${ag.conv > 28 ? "text-teal" : ag.conv > 20 ? "text-gold" : "text-danger"}`}>{ag.conv}%</span>
                      </TableCell>
                      <TableCell className="text-center text-dim">{ag.timp} zile</TableCell>
                      <TableCell className="text-center"><span className="text-gold">⭐</span> {ag.rating}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={ag.target} className="h-1.5 flex-1" />
                          <span className={`text-xs font-bold w-9 ${ag.target >= 80 ? "text-teal" : ag.target >= 60 ? "text-gold" : "text-danger"}`}>{ag.target}%</span>
                        </div>
                      </TableCell>
                      <TableCell><Sparkline vals={ag.trend} color={ag.color} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ══ HEATMAP ══ */}
        <TabsContent value="heatmap" className="space-y-4 animate-fade-up">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="py-3 px-4 border-b border-subtle flex-row items-center justify-between">
                <CardTitle className="text-sm font-semibold">🗺️ Activitate pe Zone — București</CardTitle>
                <PillToggle options={["Tranzacții","Preț/mp","Cerere"]} active={hmMode} onChange={v => setHmMode(v as typeof hmMode)} />
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-4 gap-1.5">
                  {hmLayout.flat().map(name => {
                    const z = ZONES.find(z2 => z2.name === name);
                    if (!z) return <div key={name} className="aspect-[1.5/1] rounded-md bg-surface2" />;
                    const v = z[hmKey as keyof typeof z] as number;
                    const intensity = hmMax === hmMin ? 0.5 : (v - hmMin) / (hmMax - hmMin);
                    const alpha = 0.08 + intensity * 0.87;
                    const lbl = hmMode === "Tranzacții" ? `${v} tranz.` : hmMode === "Preț/mp" ? `€${v}/mp` : `${v}% cerere`;
                    return (
                      <div key={name}
                        className="aspect-[1.5/1] rounded-md cursor-pointer transition-transform hover:scale-110 hover:z-10 relative group p-1.5 flex flex-col justify-between"
                        style={{ background: `rgba(200,169,110,${alpha.toFixed(2)})`, border: `1px solid rgba(200,169,110,${(alpha * 0.4).toFixed(2)})` }}
                        onClick={() => toast.info(`${name}: ${lbl}`)}>
                        <span className="text-[9px] font-bold" style={{ color: `rgba(255,255,255,${0.4 + intensity * 0.6})` }}>{name}</span>
                        <span className="text-[11px] font-extrabold" style={{ color: `rgba(255,255,255,${0.5 + intensity * 0.5})` }}>
                          {hmMode === "Preț/mp" ? `€${v}` : v}
                        </span>
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 bg-surface2 border border-subtle2 text-foreground px-2 py-1 rounded-md text-[11px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                          {name}: {lbl}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center gap-2 mt-3 text-xs text-dim">
                  <span>Scăzut</span>
                  <div className="flex gap-0.5">
                    {[0.08, 0.25, 0.45, 0.7, 0.95].map(a => (
                      <div key={a} className="w-[18px] h-2.5 rounded-sm" style={{ background: `rgba(200,169,110,${a})` }} />
                    ))}
                  </div>
                  <span>Ridicat</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="py-3 px-4 border-b border-subtle"><CardTitle className="text-sm font-semibold">📍 Top Zone după Activitate</CardTitle></CardHeader>
              <CardContent className="p-0">
                {topZones.map((z, i) => {
                  const v = z[hmKey as keyof typeof z] as number;
                  const pct = hmMax === hmMin ? 50 : ((v - hmMin) / (hmMax - hmMin)) * 100;
                  const lbl = hmMode === "Tranzacții" ? `${v} tranzacții` : hmMode === "Preț/mp" ? `€${v}/mp` : `${v}% cerere`;
                  return (
                    <div key={z.name} className="flex items-center gap-3 px-4 py-2.5 border-b border-subtle/30 last:border-b-0 cursor-pointer hover:bg-surface2"
                      onClick={() => toast.info(`${z.name}: ${lbl}`)}>
                      <span className={`text-sm font-extrabold w-5 text-center ${i < 3 ? "text-gold" : "text-dim"}`}>{i + 1}</span>
                      <div className="flex-1">
                        <p className="text-[13px] font-semibold mb-1">📍 {z.name}</p>
                        <div className="h-[5px] bg-surface2 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: z.color, transition: "width 0.8s" }} />
                        </div>
                      </div>
                      <span className="text-[13px] font-bold" style={{ color: z.color }}>{lbl}</span>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="py-3 px-4 border-b border-subtle"><CardTitle className="text-sm font-semibold">📊 Distribuție Tipuri / Zonă</CardTitle></CardHeader>
              <CardContent className="p-4">
                <BarChart data={[
                  { label: "Apartament", val: 52, cls: "bg-[hsl(var(--gold))]", text: "text-gold", unit: "%" },
                  { label: "Casă", val: 24, cls: "bg-[hsl(var(--blue))]", text: "text-info-blue", unit: "%" },
                  { label: "Teren", val: 14, cls: "bg-[hsl(var(--teal))]", text: "text-teal", unit: "%" },
                  { label: "Comercial", val: 10, cls: "bg-[hsl(var(--purple))]", text: "text-purple", unit: "%" },
                ]} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="py-3 px-4 border-b border-subtle"><CardTitle className="text-sm font-semibold">💶 Preț Mediu €/mp pe Zone</CardTitle></CardHeader>
              <CardContent className="p-4">
                <BarChart data={[...ZONES].sort((a, b) => b.pret - a.pret).slice(0, 6).map(z => ({
                  label: z.name, val: z.pret, cls: "bg-[hsl(var(--gold))]", text: "text-gold", unit: "",
                }))} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ══ PIATA ══ */}
        <TabsContent value="piata" className="space-y-4 animate-fade-up">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="py-3 px-4 border-b border-subtle flex-row items-center justify-between">
                <CardTitle className="text-sm font-semibold">📈 Evoluție Preț €/mp</CardTitle>
                <PillToggle options={["6 luni","1 an","3 ani"]} active={priceMode} onChange={v => setPriceMode(v as typeof priceMode)} />
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex items-end gap-1.5 h-[130px]">
                  {priceData.vals.map((v, i) => {
                    const isLast = i === priceData.vals.length - 1;
                    const h = priceMax === priceMin ? 60 : ((v - priceMin) / (priceMax - priceMin)) * 90 + 20;
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1 cursor-pointer" onClick={() => toast.info(`${priceData.labels[i]}: €${v}/mp`)}>
                        <span className={`text-[10px] font-bold ${isLast ? "text-gold" : "text-transparent"}`}>{isLast ? `€${v}` : "."}</span>
                        <div className={`w-full rounded-t transition-all duration-500 hover:opacity-70 ${isLast ? "bg-gradient-to-t from-[hsl(var(--gold))] to-[hsl(var(--gold2))]" : "bg-gold-dim"}`}
                          style={{ height: `${h}px` }} />
                      </div>
                    );
                  })}
                </div>
                <div className="flex gap-1.5 mt-1.5">
                  {priceData.labels.map((l, i) => (
                    <div key={l} className={`flex-1 text-center text-[10px] ${i === priceData.labels.length - 1 ? "text-gold font-bold" : "text-dim"}`}>{l}</div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="py-3 px-4 border-b border-subtle"><CardTitle className="text-sm font-semibold">⚖️ Cerere vs Ofertă</CardTitle></CardHeader>
              <CardContent className="p-4 space-y-3.5">
                <div className="flex gap-4 text-xs">
                  <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-[hsl(var(--gold))]" />Cerere</div>
                  <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-[hsl(var(--blue)/0.7)]" />Ofertă</div>
                </div>
                {DEMAND_SUPPLY.map(d => (
                  <div key={d.label} className="cursor-pointer" onClick={() => toast.info(`${d.label}: Cerere ${d.cerere} • Ofertă ${d.oferta}`)}>
                    <div className="flex justify-between text-xs text-dim mb-1"><span>{d.label}</span><span>Deficit: {d.cerere - d.oferta}%</span></div>
                    <div className="h-2.5 bg-surface2 rounded-[5px] overflow-hidden mb-1">
                      <div className="h-full rounded-[5px] bg-[hsl(var(--gold))]" style={{ width: `${d.cerere}%`, transition: "width 0.8s" }} />
                    </div>
                    <div className="h-2.5 bg-surface2 rounded-[5px] overflow-hidden">
                      <div className="h-full rounded-[5px] bg-[hsl(var(--blue)/0.7)]" style={{ width: `${d.oferta}%`, transition: "width 0.8s" }} />
                    </div>
                  </div>
                ))}
                <div className="p-3 bg-gold-dim/30 border border-[hsl(var(--gold)/0.15)] rounded-lg text-xs text-dim">
                  💡 <strong className="text-gold">Insight:</strong> Cererea depășește oferta în Floreasca (+36%), Dorobanți (+32%), Aviatorilor (+28%). Moment favorabil pentru listare.
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="py-3 px-4 border-b border-subtle"><CardTitle className="text-sm font-semibold">🏘️ Comparație Zone — Preț Mediu €/mp + Evoluție</CardTitle></CardHeader>
            <CardContent className="p-4 overflow-x-auto">
              <div className="flex items-end gap-2.5 h-[160px] min-w-[500px]">
                {[...ZONES].sort((a, b) => b.pret - a.pret).slice(0, 8).map(z => {
                  const h = (z.pret / Math.max(...ZONES.map(z2 => z2.pret))) * 140;
                  const chg = (0.04 + Math.random() * 0.1).toFixed(1);
                  return (
                    <div key={z.name} className="flex-1 flex flex-col items-center gap-1 cursor-pointer" onClick={() => toast.info(`${z.name}: €${z.pret}/mp`)}>
                      <span className="text-[10px] font-bold" style={{ color: z.color }}>+{chg}%</span>
                      <div className="w-full rounded-t-[5px] border hover:opacity-70 transition-opacity flex items-start justify-center pt-1"
                        style={{ height: `${h}px`, background: `${z.color}40`, borderColor: `${z.color}60` }}>
                        <span className="text-[10px] font-bold" style={{ color: z.color }}>€{z.pret}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-2.5 mt-1.5 min-w-[500px]">
                {[...ZONES].sort((a, b) => b.pret - a.pret).slice(0, 8).map(z => (
                  <div key={z.name} className="flex-1 text-center text-[10px] text-dim truncate">{z.name}</div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ══ RAPOARTE ══ */}
        <TabsContent value="rapoarte" className="space-y-4 animate-fade-up">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="py-3 px-4 border-b border-subtle flex-row items-center justify-between">
                <CardTitle className="text-sm font-semibold">📋 Rapoarte Disponibile</CardTitle>
                <Button size="sm" className="text-xs" onClick={() => toast.success("✨ Raport custom nou creat")}><Plus className="w-3 h-3" />Raport Custom</Button>
              </CardHeader>
              <CardContent className="p-0">
                {REPORTS.map(r => (
                  <div key={r.name} className="flex items-center gap-3 px-4 py-3 border-b border-subtle/30 last:border-b-0 hover:bg-surface2 cursor-pointer transition-colors"
                    onClick={() => genReport(r.name)}>
                    <span className="text-xl w-8 text-center">{r.icon}</span>
                    <div className="flex-1">
                      <p className="text-[13px] font-semibold">{r.name}</p>
                      <p className="text-xs text-dim">{r.desc}</p>
                    </div>
                    <Badge className="bg-gold-dim text-gold border-0 text-[11px]">{r.format}</Badge>
                    <Button variant="outline" size="sm" className="text-xs" onClick={e => { e.stopPropagation(); genReport(r.name); }}
                      disabled={generating === r.name}>
                      {generating === r.name ? "⏳" : "▶"} Generează
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="py-3 px-4 border-b border-subtle flex-row items-center justify-between">
                <CardTitle className="text-sm font-semibold">⏰ Rapoarte Programate</CardTitle>
                <Button variant="outline" size="sm" className="text-xs" onClick={() => toast.success("➕ Programare adăugată")}><Plus className="w-3 h-3" />Adaugă</Button>
              </CardHeader>
              <CardContent className="p-0">
                {SCHEDULED.map(s => (
                  <div key={s.name} className="flex items-center gap-3 px-4 py-3 border-b border-subtle/30 last:border-b-0">
                    <div className="flex-1">
                      <p className="text-[13px] font-semibold">{s.name}</p>
                      <p className="text-xs text-dim">📅 {s.freq} • Următor: {s.next}</p>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${s.active ? "bg-[hsl(var(--teal))]" : "bg-[hsl(var(--text3))]"}`} />
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => toast.info("✏️ Configurare programare")}><Edit className="w-3.5 h-3.5" /></Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="py-3 px-4 border-b border-subtle"><CardTitle className="text-sm font-semibold">📜 Istoric Rapoarte Generate</CardTitle></CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-[11px]">Raport</TableHead>
                    <TableHead className="text-[11px]">Perioadă</TableHead>
                    <TableHead className="text-[11px]">Generat de</TableHead>
                    <TableHead className="text-[11px]">Dată</TableHead>
                    <TableHead className="text-[11px]">Format</TableHead>
                    <TableHead className="text-[11px]">Acțiuni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {HISTORY.map((h, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{h.name}</TableCell>
                      <TableCell className="text-dim">{h.period}</TableCell>
                      <TableCell className="text-dim">{h.by}</TableCell>
                      <TableCell className="text-dim text-xs">{h.date}</TableCell>
                      <TableCell>
                        <Badge className={`text-[11px] border-0 ${h.format === "PDF" ? "bg-red-dim text-danger" : "bg-teal-dim text-teal"}`}>{h.format}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => toast.success(`⬇️ ${h.name}.${h.format.toLowerCase()} descărcat`)}>
                            <Download className="w-3 h-3" />Descarcă
                          </Button>
                          <Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => genReport(h.name)}>
                            <RotateCw className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
    </DashboardLayout>
  );
}
