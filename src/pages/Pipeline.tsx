import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useNavigate } from "react-router-dom";

interface Deal {
  id: number;
  title: string;
  client: string;
  agent: string;
  value: number;
  commPct: number;
  type: string;
  stage: number;
  deadline: number;
  zone: string;
  notes: string;
  daysOld: number;
}

const STAGES = ["Lead Nou", "Vizionare", "Negociere", "Ofertă", "Contract", "Finalizat"];
const STAGE_COLORS = ["bg-blue-400", "bg-yellow-400", "bg-orange-400", "bg-purple-400", "bg-primary", "bg-green-400"];
const STAGE_DOT_COLORS = ["#60a5fa", "#fbbf24", "#f97316", "#a78bfa", "#c8a96e", "#4ade80"];

const AGENT_GRADIENTS: Record<string, string> = {
  "Andrei I.": "from-primary to-amber-700",
  "Maria C.": "from-blue-400 to-blue-600",
  "Radu P.": "from-green-400 to-green-600",
  "Diana M.": "from-pink-400 to-pink-600",
  "Sofia N.": "from-yellow-400 to-yellow-600",
};
const AGENT_INITIALS: Record<string, string> = {
  "Andrei I.": "AI", "Maria C.": "MC", "Radu P.": "RP", "Diana M.": "DM", "Sofia N.": "SN",
};

const initialDeals: Deal[] = [
  { id: 1, title: "Apt. 3 cam. – Floreasca 42", client: "Elena Popescu", agent: "Andrei I.", value: 185000, commPct: 3, type: "Apartament", stage: 4, deadline: 3, zone: "Floreasca", notes: "Contract în pregătire, client urgent.", daysOld: 18 },
  { id: 2, title: "Vilă D+P+1 – Pipera", client: "Bogdan Enache", agent: "Maria C.", value: 425000, commPct: 2.5, type: "Casă", stage: 3, deadline: 7, zone: "Pipera", notes: "Ofertă trimisă, așteaptă aprobare bancă.", daysOld: 12 },
  { id: 3, title: "Teren 450m² – Baneasa", client: "George Stancu", agent: "Radu P.", value: 68500, commPct: 4, type: "Teren", stage: 2, deadline: 21, zone: "Baneasa", notes: "Negociere preț, clientul vrea 65K.", daysOld: 9 },
  { id: 4, title: "Apt. 2 cam. – Vitan", client: "Raluca Dumitrescu", agent: "Andrei I.", value: 112000, commPct: 3, type: "Apartament", stage: 1, deadline: 30, zone: "Sector 4", notes: "Prima vizionare programată mâine.", daysOld: 4 },
  { id: 5, title: "Sp. Comercial – Dorobanți", client: "Investiții SRL", agent: "Diana M.", value: 290000, commPct: 2, type: "Comercial", stage: 5, deadline: 0, zone: "Dorobanți", notes: "Deal închis cu succes!", daysOld: 25 },
  { id: 6, title: "Casă P+1 – Voluntari", client: "Ioana Constantin", agent: "Sofia N.", value: 195000, commPct: 3, type: "Casă", stage: 2, deadline: 14, zone: "Voluntari", notes: "Negociere în curs, -8K față de listare.", daysOld: 7 },
  { id: 7, title: "Apt. Studio – Centru", client: "Mihai Florescu", agent: "Maria C.", value: 75000, commPct: 3.5, type: "Apartament", stage: 1, deadline: 10, zone: "Centru", notes: "Vizionare confirmată.", daysOld: 3 },
  { id: 8, title: "Apt. 4 cam. – Dorobanți", client: "Simona Gheorghe", agent: "Andrei I.", value: 340000, commPct: 2.5, type: "Apartament", stage: 3, deadline: 2, zone: "Dorobanți", notes: "URGENT – ofertă expirată mâine!", daysOld: 20 },
  { id: 9, title: "Teren 800m² – Pipera", client: "Vlad Ionescu", agent: "Radu P.", value: 120000, commPct: 3, type: "Teren", stage: 0, deadline: 45, zone: "Pipera", notes: "Lead nou din Imobiliare.ro.", daysOld: 1 },
  { id: 10, title: "Apt. 3 cam. – Baneasa", client: "Alexandru Marin", agent: "Diana M.", value: 220000, commPct: 3, type: "Apartament", stage: 4, deadline: 5, zone: "Baneasa", notes: "Contract în curs de redactare.", daysOld: 15 },
  { id: 11, title: "Garsonieră – Militari", client: "Daniela Niculescu", agent: "Sofia N.", value: 58000, commPct: 4, type: "Apartament", stage: 0, deadline: 20, zone: "Sector 6", notes: "Interesat de mai multe opțiuni.", daysOld: 2 },
  { id: 12, title: "Vilă Exclusivistă – Pipera", client: "George Stancu", agent: "Andrei I.", value: 780000, commPct: 2, type: "Casă", stage: 2, deadline: 8, zone: "Pipera", notes: "Investitor, discutat ROI.", daysOld: 11 },
  { id: 13, title: "Ap. 2 cam. – Floreasca", client: "Cristian Bălan", agent: "Maria C.", value: 148000, commPct: 3, type: "Apartament", stage: 1, deadline: 12, zone: "Floreasca", notes: "2 vizionări programate.", daysOld: 5 },
  { id: 14, title: "Sp. Birouri 300m²", client: "TechCorp SRL", agent: "Diana M.", value: 450000, commPct: 2, type: "Comercial", stage: 3, deadline: 4, zone: "Floreasca", notes: "Negociere finală cu managementul.", daysOld: 16 },
  { id: 15, title: "Casă 180m² – Snagov", client: "Radu Petrescu", agent: "Radu P.", value: 165000, commPct: 3.5, type: "Casă", stage: 5, deadline: 0, zone: "Snagov", notes: "Finalizat luna trecută.", daysOld: 30 },
];

function formatEur(n: number) {
  if (!n) return "€0";
  if (n >= 1000000) return "€" + (n / 1000000).toFixed(2) + "M";
  if (n >= 1000) return "€" + Math.round(n / 1000) + "K";
  return "€" + n;
}

function TimerRing({ deadline, stage }: { deadline: number; stage: number }) {
  const maxDays = 30;
  const pct = stage === 5 ? 1 : Math.max(0, Math.min(1, (maxDays - deadline) / maxDays));
  const r = 10;
  const circ = 2 * Math.PI * r;
  const dash = pct * circ;
  const color = stage === 5 ? "#4ade80" : deadline <= 3 ? "#f87171" : deadline <= 10 ? "#fbbf24" : "#4ade80";
  return (
    <div className="relative flex items-center justify-center flex-shrink-0 w-6 h-6">
      <svg width={24} height={24} viewBox="0 0 24 24" className="absolute -rotate-90">
        <circle cx={12} cy={12} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={2.5} />
        <circle cx={12} cy={12} r={r} fill="none" stroke={color} strokeWidth={2.5}
          strokeDasharray={`${dash.toFixed(1)} ${circ.toFixed(1)}`} strokeLinecap="round" />
      </svg>
      <span className="font-serif text-[8px] font-bold relative z-10" style={{ color }}>
        {stage === 5 ? "✓" : deadline}
      </span>
    </div>
  );
}

export default function Pipeline() {
  const navigate = useNavigate();
  const [deals, setDeals] = useState<Deal[]>(initialDeals);
  const [search, setSearch] = useState("");
  const [filterAgent, setFilterAgent] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterUrgency, setFilterUrgency] = useState("all");
  const [showClosed, setShowClosed] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalStage, setModalStage] = useState(0);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);

  const filtered = useMemo(() => {
    return deals.filter((d) => {
      if (!showClosed && d.stage === 5) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!d.title.toLowerCase().includes(q) && !d.client.toLowerCase().includes(q) && !d.zone.toLowerCase().includes(q)) return false;
      }
      if (filterAgent !== "all" && d.agent !== filterAgent) return false;
      if (filterType !== "all" && d.type !== filterType) return false;
      if (filterUrgency === "urgent" && d.deadline > 3) return false;
      if (filterUrgency === "warn" && (d.deadline <= 3 || d.deadline > 10)) return false;
      if (filterUrgency === "ok" && d.deadline <= 10) return false;
      return true;
    });
  }, [deals, search, filterAgent, filterType, filterUrgency, showClosed]);

  const active = deals.filter((d) => d.stage < 5);
  const totalVal = active.reduce((s, d) => s + d.value, 0);
  const totalComm = active.reduce((s, d) => s + Math.round(d.value * d.commPct / 100), 0);
  const urgentCount = active.filter((d) => d.deadline <= 3).length;

  const stats = [
    { label: "Total Active", value: String(active.length), sub: `${deals.filter(d => d.stage === 5).length} finalizate`, accent: "bg-primary" },
    { label: "Urgente", value: String(urgentCount), sub: "≤ 3 zile termen", accent: "bg-red-400" },
    { label: "Valoare Pipeline", value: formatEur(totalVal), sub: `${active.length} deal-uri`, accent: "bg-blue-400" },
    { label: "Comisioane Est.", value: formatEur(totalComm), sub: "din deal-uri active", accent: "bg-green-400" },
    { label: "Rată Succes", value: `${deals.length ? Math.round(deals.filter(d => d.stage === 5).length / deals.length * 100) : 0}%`, sub: `${deals.filter(d => d.stage === 5).length} finalizate`, accent: "bg-purple-400" },
  ];

  const moveDeal = (id: number, newStage: number) => {
    setDeals((prev) => prev.map((d) => d.id === id ? { ...d, stage: newStage } : d));
  };

  const openAddModal = (stage = 0) => {
    setModalStage(stage);
    setModalOpen(true);
  };

  return (
    <DashboardLayout>
      {/* Topbar */}
      <div className="bg-surface border-b border-subtle px-4 md:px-7 h-[52px] md:h-[58px] flex items-center gap-3 sticky top-0 z-40">
        <div className="flex items-center gap-1.5 text-xs md:text-[13px] text-muted-foreground">
          <span className="cursor-pointer hover:text-primary transition-colors" onClick={() => navigate("/")}>⊞ Dashboard</span>
          <span className="text-muted-foreground/40">›</span>
          <span className="text-foreground font-medium">📋 Pipeline Tranzacții</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button onClick={() => openAddModal()} className="hidden sm:flex items-center gap-1.5 border border-subtle bg-transparent text-muted-foreground rounded-lg px-3 py-1.5 text-xs font-medium hover:bg-surface2 hover:text-foreground transition-all cursor-pointer">+ Deal Nou</button>
          <button onClick={() => openAddModal()} className="sm:hidden w-9 h-9 bg-primary text-primary-foreground rounded-lg flex items-center justify-center text-lg font-bold">＋</button>
          <button onClick={() => setShowReport(!showReport)} className={`hidden md:flex items-center gap-1.5 border border-subtle rounded-lg px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${showReport ? "bg-primary/15 text-primary border-primary/25" : "bg-transparent text-muted-foreground hover:bg-surface2 hover:text-foreground"}`}>📈 Raport</button>
          <button className="flex items-center gap-1.5 bg-gradient-to-r from-primary to-amber-600 text-primary-foreground rounded-lg px-3 py-1.5 text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer">📥 Export</button>
        </div>
      </div>

      <div className="p-4 md:p-6 flex-1 flex flex-col gap-4 md:gap-5">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 animate-fade-up">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 bg-primary/10 border border-primary/20 rounded-[10px] flex items-center justify-center text-lg">📋</div>
              <h1 className="font-serif text-xl md:text-[22px] font-bold">Pipeline Tranzacții</h1>
              <span className="text-[10.5px] font-bold px-2 py-1 rounded bg-yellow-400/12 text-yellow-400 border border-yellow-400/25 tracking-wider">ÎN DEZVOLTARE</span>
            </div>
            <p className="text-muted-foreground text-[13px] ml-[52px]">Vizualizare Kanban — de la lead nou până la contract semnat.</p>
          </div>
          <div className="flex flex-col items-end gap-1 ml-[52px] md:ml-0">
            <span className="text-[11px] text-muted-foreground">Valoare totală pipeline</span>
            <span className="font-serif text-xl md:text-[22px] font-bold text-primary">{formatEur(totalVal)}</span>
            <span className="text-[11px] text-muted-foreground">Comisioane: <span className="text-green-400 font-semibold">{formatEur(totalComm)}</span></span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 animate-fade-up-delay-1">
          {stats.map((s, i) => (
            <div key={i} className="bg-card border border-subtle rounded-xl p-3.5 relative overflow-hidden hover:border-primary/25 hover:-translate-y-0.5 transition-all">
              <div className={`absolute top-0 left-0 right-0 h-[2px] ${s.accent}`} />
              <div className="text-[10px] font-semibold tracking-wider uppercase text-muted-foreground mb-1.5">{s.label}</div>
              <div className="font-serif text-xl md:text-2xl font-bold leading-none">{s.value}</div>
              <div className="text-[11px] text-muted-foreground mt-1">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Pipeline Flow Bar */}
        <div className="bg-card border border-subtle rounded-xl p-3 flex items-center overflow-x-auto animate-fade-up-delay-1">
          {STAGES.map((stage, i) => {
            const count = deals.filter((d) => d.stage === i).length;
            return (
              <div key={i} className="contents">
                {i > 0 && <span className="text-muted-foreground/40 text-sm mx-1 flex-shrink-0">›</span>}
                <div className="flex flex-col items-center px-2 md:px-3 py-1 flex-1 min-w-[60px] rounded-md hover:bg-surface2 cursor-pointer transition-colors">
                  <span className="text-[9px] md:text-[10px] font-semibold tracking-wider uppercase text-muted-foreground" style={{ color: i === 5 ? "#4ade80" : undefined }}>{stage}</span>
                  <span className="font-serif text-sm md:text-[15px] font-bold" style={{ color: i === 5 ? "#4ade80" : undefined }}>{count}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-2 animate-fade-up-delay-2">
          <div className="relative flex-1 min-w-[160px] max-w-xs">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-[13px] pointer-events-none">🔍</span>
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Caută deal, client, zonă…" className="pl-8 bg-card border-subtle text-[13px] h-9" />
          </div>
          <Select value={filterAgent} onValueChange={setFilterAgent}>
            <SelectTrigger className="w-auto min-w-[110px] bg-card border-subtle text-xs h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toți agenții</SelectItem>
              {["Andrei I.", "Maria C.", "Radu P.", "Diana M.", "Sofia N."].map((a) => (
                <SelectItem key={a} value={a}>{a}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-auto min-w-[110px] bg-card border-subtle text-xs h-9 hidden md:flex"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toate tipurile</SelectItem>
              {["Apartament", "Casă", "Teren", "Comercial"].map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterUrgency} onValueChange={setFilterUrgency}>
            <SelectTrigger className="w-auto min-w-[100px] bg-card border-subtle text-xs h-9 hidden md:flex"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toate</SelectItem>
              <SelectItem value="urgent">🔴 Urgente</SelectItem>
              <SelectItem value="warn">🟡 Avertizări</SelectItem>
              <SelectItem value="ok">🟢 OK</SelectItem>
            </SelectContent>
          </Select>
          <label className="hidden md:flex items-center gap-2 text-xs text-muted-foreground cursor-pointer ml-auto select-none">
            <input type="checkbox" checked={showClosed} onChange={(e) => setShowClosed(e.target.checked)} className="accent-primary" />
            Arată finalizate
          </label>
        </div>

        {/* Report Panel */}
        {showReport && (
          <div className="bg-card border border-subtle rounded-xl p-5 animate-fade-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-base font-bold">📈 Raport Pipeline</h3>
              <button onClick={() => setShowReport(false)} className="text-xs text-muted-foreground border border-subtle rounded-lg px-3 py-1.5 hover:bg-surface2 cursor-pointer bg-transparent">✕ Închide</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Conversion */}
              <div>
                <div className="text-[11px] font-bold tracking-wider uppercase text-muted-foreground mb-3">Rată Conversie Per Etapă</div>
                <div className="space-y-2">
                  {STAGES.slice(0, 5).map((s, i) => {
                    const inStage = deals.filter((d) => d.stage >= i).length;
                    const conv = inStage ? Math.round((deals.filter((d) => d.stage >= i + 1).length / inStage) * 100) : 0;
                    return (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <span className="text-muted-foreground w-20 flex-shrink-0">{s}→</span>
                        <div className="flex-1 h-[5px] bg-surface2 rounded-sm overflow-hidden">
                          <div className="h-full rounded-sm" style={{ width: `${conv}%`, background: STAGE_DOT_COLORS[i] }} />
                        </div>
                        <span className="font-serif font-semibold w-8 text-right">{conv}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              {/* Commissions */}
              <div>
                <div className="text-[11px] font-bold tracking-wider uppercase text-muted-foreground mb-3">Comisioane Estimate</div>
                <div className="space-y-2">
                  {STAGES.slice(0, 5).map((s, i) => {
                    const val = deals.filter((d) => d.stage === i).reduce((sum, d) => sum + d.value * d.commPct / 100, 0);
                    if (!val) return null;
                    return (
                      <div key={i} className="flex items-center gap-2">
                        <span className="text-[11px] text-muted-foreground w-20 flex-shrink-0">{s}</span>
                        <div className="flex-1 h-1.5 bg-surface2 rounded-sm overflow-hidden">
                          <div className="h-full rounded-sm bg-gradient-to-r from-primary to-amber-600" style={{ width: `${Math.min(100, val / 200)}%` }} />
                        </div>
                        <span className="text-[11.5px] font-semibold text-primary w-16 text-right">{formatEur(Math.round(val))}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-3 pt-3 border-t border-subtle flex justify-between text-[13px]">
                  <span className="text-muted-foreground">Total estimat</span>
                  <span className="text-primary font-bold font-serif">{formatEur(totalComm)}</span>
                </div>
              </div>
              {/* Avg Times */}
              <div>
                <div className="text-[11px] font-bold tracking-wider uppercase text-muted-foreground mb-3">Timp Mediu Per Etapă</div>
                <div className="space-y-1">
                  {STAGES.slice(0, 5).map((s, i) => {
                    const stageDeals = deals.filter((d) => d.stage === i);
                    const avg = stageDeals.length ? Math.round(stageDeals.reduce((sum, d) => sum + d.daysOld, 0) / stageDeals.length) : 0;
                    return (
                      <div key={i} className="flex justify-between text-xs py-1.5 border-b border-white/[0.04]">
                        <span className="text-muted-foreground">{s}</span>
                        <span className="font-semibold">{stageDeals.length ? avg + " zile" : "—"}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Kanban Board */}
        <div className="flex-1 overflow-x-auto animate-fade-up-delay-2">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-[14px] min-w-[900px]">
            {STAGES.map((stage, idx) => {
              const stageDeals = filtered.filter((d) => d.stage === idx);
              const stageTotal = stageDeals.reduce((s, d) => s + d.value, 0);
              return (
                <div key={idx} className="flex flex-col">
                  <div className="flex items-center gap-2 px-3 py-2.5 bg-card border border-subtle rounded-[9px] mb-2">
                    <div className="w-[9px] h-[9px] rounded-full flex-shrink-0" style={{ background: STAGE_DOT_COLORS[idx] }} />
                    <span className="font-serif text-xs font-bold tracking-wide flex-1">{stage}</span>
                    <span className="text-[10.5px] text-muted-foreground bg-surface2 px-2 py-0.5 rounded">{stageDeals.length}</span>
                  </div>
                  {stageTotal > 0 && (
                    <div className="text-[10.5px] text-muted-foreground text-right px-1 mb-2">{formatEur(stageTotal)}</div>
                  )}
                  <div className="flex flex-col gap-2.5 min-h-[80px]">
                    {stageDeals.map((deal) => (
                      <DealCard key={deal.id} deal={deal} onClick={() => setSelectedDeal(deal)} onMove={moveDeal} />
                    ))}
                  </div>
                  {idx < 5 && (
                    <button onClick={() => openAddModal(idx)}
                      className="w-full mt-2 py-2 rounded-[9px] border border-dashed border-subtle bg-transparent text-muted-foreground text-xs hover:border-primary/30 hover:text-primary hover:bg-primary/[0.04] transition-all cursor-pointer flex items-center justify-center gap-1">
                      + Adaugă
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Detail Panel */}
      <Sheet open={!!selectedDeal} onOpenChange={(o) => !o && setSelectedDeal(null)}>
        <SheetContent side="right" className="w-[340px] md:w-[390px] bg-card border-l border-subtle p-0 overflow-y-auto">
          <SheetTitle className="sr-only">Detalii Deal</SheetTitle>
          {selectedDeal && <DealDetailPanel deal={selectedDeal} onMove={(stage) => { moveDeal(selectedDeal.id, stage); setSelectedDeal({ ...selectedDeal, stage }); }} onClose={() => setSelectedDeal(null)} />}
        </SheetContent>
      </Sheet>

      {/* Add Deal Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="bg-card border-subtle max-w-[540px] max-h-[88vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-base font-bold">📋 Deal Nou</DialogTitle>
          </DialogHeader>
          <AddDealForm stage={modalStage} onSave={(deal) => { setDeals((p) => [...p, deal]); setModalOpen(false); }} onCancel={() => setModalOpen(false)} />
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}

/* ─── Deal Card ─── */
function DealCard({ deal, onClick, onMove }: { deal: Deal; onClick: () => void; onMove: (id: number, stage: number) => void }) {
  const initials = deal.client.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const agGrad = AGENT_GRADIENTS[deal.agent] || "from-gray-400 to-gray-500";
  const commVal = Math.round(deal.value * deal.commPct / 100);
  const urgency = deal.stage === 5 ? "ok" : deal.deadline <= 3 ? "urgent" : deal.deadline <= 10 ? "warn" : "ok";

  const tagCls = deal.stage === 5
    ? "bg-green-400/10 text-green-400 border border-green-400/20"
    : urgency === "urgent" ? "bg-red-400/12 text-red-400 border border-red-400/20"
    : urgency === "warn" ? "bg-yellow-400/10 text-yellow-400 border border-yellow-400/20"
    : "bg-green-400/10 text-green-400 border border-green-400/20";
  const tagLabel = deal.stage === 5 ? "✅ Finalizat" : urgency === "urgent" ? "🔴 Urgent" : urgency === "warn" ? "⚡ Termen" : "✓ OK";

  return (
    <div onClick={onClick} className="bg-card border border-subtle rounded-[10px] p-3 cursor-pointer hover:border-primary/30 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.35)] transition-all relative group">
      <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
        <TimerRing deadline={deal.deadline} stage={deal.stage} />
        {deal.stage < 5 && deal.stage > 0 && (
          <button onClick={(e) => { e.stopPropagation(); onMove(deal.id, deal.stage - 1); }}
            className="w-5 h-5 rounded bg-surface2 border border-subtle text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:text-primary cursor-pointer flex items-center justify-center">←</button>
        )}
        {deal.stage < 5 && (
          <button onClick={(e) => { e.stopPropagation(); onMove(deal.id, deal.stage + 1); }}
            className="w-5 h-5 rounded bg-surface2 border border-subtle text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:text-primary cursor-pointer flex items-center justify-center">→</button>
        )}
      </div>

      <div className="flex items-start gap-2 mb-2 pr-16">
        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${agGrad} flex items-center justify-center font-serif font-bold text-[11px] text-primary-foreground flex-shrink-0`}>{initials}</div>
        <div className="text-[12.5px] font-semibold leading-tight">{deal.title}</div>
      </div>
      <div className="text-[11.5px] text-muted-foreground mb-2 truncate">👤 {deal.client} · 📍 {deal.zone}</div>
      <div className="font-serif text-base font-bold text-primary mb-1">{formatEur(deal.value)}</div>
      <div className="text-[11px] text-muted-foreground mb-2">Comision est.: <span className="text-green-400 font-semibold">{formatEur(commVal)}</span> ({deal.commPct}%)</div>
      <div className="flex gap-1.5 flex-wrap mb-2">
        <span className={`text-[10px] font-semibold px-[7px] py-[2px] rounded ${tagCls}`}>{tagLabel}</span>
        <span className="text-[10px] font-semibold px-[7px] py-[2px] rounded bg-blue-400/10 text-blue-400 border border-blue-400/20">{deal.type}</span>
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-subtle">
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <div className={`w-5 h-5 rounded bg-gradient-to-br ${agGrad} flex items-center justify-center font-serif font-bold text-[9px] text-primary-foreground`}>{AGENT_INITIALS[deal.agent] || "?"}</div>
          {deal.agent}
        </div>
        {deal.stage < 5 && (
          <span className={`text-[10.5px] flex items-center gap-1 ${urgency === "urgent" ? "text-red-400" : urgency === "warn" ? "text-yellow-400" : "text-muted-foreground"}`}>
            {urgency === "urgent" ? "🔴" : urgency === "warn" ? "🟡" : "🕐"} {deal.deadline} zile
          </span>
        )}
      </div>
    </div>
  );
}

/* ─── Deal Detail Panel ─── */
function DealDetailPanel({ deal, onMove, onClose }: { deal: Deal; onMove: (stage: number) => void; onClose: () => void }) {
  const initials = deal.client.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const agGrad = AGENT_GRADIENTS[deal.agent] || "from-gray-400 to-gray-500";
  const comm = Math.round(deal.value * deal.commPct / 100);

  return (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-subtle flex items-center gap-3 sticky top-0 bg-card z-10">
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${agGrad} flex items-center justify-center font-serif font-extrabold text-[15px] text-primary-foreground`}>{initials}</div>
        <div className="flex-1">
          <div className="font-serif text-[15px] font-bold">{deal.title}</div>
          <div className="text-[11.5px] text-muted-foreground">{STAGES[deal.stage]} · {deal.zone}</div>
        </div>
      </div>

      <div className="p-5 flex-1 space-y-5 overflow-y-auto">
        {/* Stepper */}
        <div>
          <div className="text-[10.5px] font-bold tracking-wider uppercase text-muted-foreground mb-3 pb-1.5 border-b border-subtle">Progres Etape</div>
          <div className="flex items-center gap-0 mb-1">
            {STAGES.map((_, i) => (
              <div key={i} className="contents">
                {i > 0 && <div className={`flex-1 h-0.5 ${i <= deal.stage ? "bg-primary" : "bg-surface2"}`} />}
                <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${i < deal.stage ? "bg-primary" : i === deal.stage ? "bg-amber-400 shadow-[0_0_0_3px_rgba(200,169,110,0.25)]" : "bg-surface2 border-2 border-subtle"}`} />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-1">
            {STAGES.map((s, i) => (
              <span key={i} className={`text-[8.5px] ${i < deal.stage ? "text-primary" : i === deal.stage ? "text-amber-400" : "text-muted-foreground"}`}>{s}</span>
            ))}
          </div>
        </div>

        {/* Details */}
        <PanelSection title="Detalii Deal">
          {[
            ["Client", deal.client],
            ["Agent", deal.agent],
            ["Tip proprietate", deal.type],
            ["Zonă", deal.zone],
          ].map(([l, v]) => (
            <div key={l} className="flex justify-between items-center py-[7px] border-b border-white/[0.03] text-[13px]">
              <span className="text-muted-foreground">{l}</span>
              <span className="font-medium">{v}</span>
            </div>
          ))}
          <div className="flex justify-between items-center py-[7px] border-b border-white/[0.03] text-[13px]">
            <span className="text-muted-foreground">Valoare</span>
            <span className="font-bold font-serif text-primary">{formatEur(deal.value)}</span>
          </div>
          <div className="flex justify-between items-center py-[7px] border-b border-white/[0.03] text-[13px]">
            <span className="text-muted-foreground">Comision ({deal.commPct}%)</span>
            <span className="font-bold text-green-400">{formatEur(comm)}</span>
          </div>
          <div className="flex justify-between items-center py-[7px] border-b border-white/[0.03] text-[13px]">
            <span className="text-muted-foreground">Termen rămas</span>
            <span className={`font-medium ${deal.stage === 5 ? "text-green-400" : deal.deadline <= 3 ? "text-red-400" : deal.deadline <= 10 ? "text-yellow-400" : ""}`}>
              {deal.stage === 5 ? "✅ Finalizat" : deal.deadline + " zile"}
            </span>
          </div>
          <div className="flex justify-between items-center py-[7px] text-[13px]">
            <span className="text-muted-foreground">Zile în pipeline</span>
            <span className="font-medium">{deal.daysOld} zile</span>
          </div>
        </PanelSection>

        <PanelSection title="Note">
          <div className="text-[13px] text-muted-foreground leading-relaxed bg-surface2 rounded-lg p-3">{deal.notes || "—"}</div>
        </PanelSection>

        <PanelSection title="Activitate Recentă">
          {[
            { icon: "📋", title: `Etapă curentă: ${STAGES[deal.stage]}`, time: "Acum" },
            { icon: "📞", title: "Ultimul contact cu clientul", time: deal.daysOld === 0 ? "Azi" : deal.daysOld === 1 ? "Ieri" : deal.daysOld + " zile în urmă" },
            { icon: "🎯", title: "Deal creat", time: deal.daysOld + " zile în urmă" },
          ].map((t, i) => (
            <div key={i} className="flex gap-2.5 pb-3.5 relative">
              {i < 2 && <div className="absolute left-[13px] top-[26px] bottom-0 w-px bg-border" />}
              <div className="w-[26px] h-[26px] rounded-[7px] bg-surface2 border border-subtle flex items-center justify-center text-[11px] flex-shrink-0">{t.icon}</div>
              <div>
                <div className="text-xs font-medium">{t.title}</div>
                <div className="text-[10.5px] text-muted-foreground mt-0.5">{t.time}</div>
              </div>
            </div>
          ))}
        </PanelSection>

        <div className="flex gap-2 pt-1">
          {deal.stage < 5 ? (
            <button onClick={() => onMove(deal.stage + 1)} className="flex-1 bg-gradient-to-r from-primary to-amber-600 text-primary-foreground py-2.5 rounded-lg text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer">➡️ Avansează Etapă</button>
          ) : (
            <div className="flex-1 py-2.5 rounded-lg text-xs font-bold text-green-400 border border-green-400/30 text-center">✅ Finalizat</div>
          )}
          <button onClick={onClose} className="border border-subtle bg-transparent text-muted-foreground px-4 py-2.5 rounded-lg text-xs hover:bg-surface2 cursor-pointer">✕</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Add Deal Form ─── */
function AddDealForm({ stage, onSave, onCancel }: { stage: number; onSave: (deal: Deal) => void; onCancel: () => void }) {
  const [title, setTitle] = useState("");
  const [client, setClient] = useState("");
  const [agent, setAgent] = useState("Andrei I.");
  const [value, setValue] = useState("");
  const [commPct, setCommPct] = useState("3");
  const [type, setType] = useState("Apartament");
  const [dealStage, setDealStage] = useState(String(stage));
  const [deadline, setDeadline] = useState("30");
  const [zone, setZone] = useState("");
  const [notes, setNotes] = useState("");

  const handleSave = () => {
    if (!title || !client) return;
    onSave({
      id: Date.now(),
      title, client, agent,
      value: parseFloat(value) || 0,
      commPct: parseFloat(commPct) || 3,
      type, stage: parseInt(dealStage),
      deadline: parseInt(deadline) || 30,
      zone: zone || "—", notes,
      daysOld: 0,
    });
  };

  return (
    <div className="space-y-4 pt-2">
      <FormField label="Titlu Deal"><Input className="bg-surface2 border-subtle text-[13px]" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="ex. Apt. 3 cam. Floreasca – Elena P." /></FormField>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Client"><Input className="bg-surface2 border-subtle text-[13px]" value={client} onChange={(e) => setClient(e.target.value)} placeholder="Nume client" /></FormField>
        <FormField label="Agent">
          <Select value={agent} onValueChange={setAgent}>
            <SelectTrigger className="bg-surface2 border-subtle text-[13px]"><SelectValue /></SelectTrigger>
            <SelectContent>{["Andrei I.", "Maria C.", "Radu P.", "Diana M.", "Sofia N."].map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}</SelectContent>
          </Select>
        </FormField>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Valoare (€)"><Input className="bg-surface2 border-subtle text-[13px]" type="number" value={value} onChange={(e) => setValue(e.target.value)} placeholder="ex. 185000" /></FormField>
        <FormField label="Comision %"><Input className="bg-surface2 border-subtle text-[13px]" type="number" value={commPct} onChange={(e) => setCommPct(e.target.value)} placeholder="3" /></FormField>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Tip Proprietate">
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="bg-surface2 border-subtle text-[13px]"><SelectValue /></SelectTrigger>
            <SelectContent>{["Apartament", "Casă", "Teren", "Comercial"].map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
          </Select>
        </FormField>
        <FormField label="Etapă Inițială">
          <Select value={dealStage} onValueChange={setDealStage}>
            <SelectTrigger className="bg-surface2 border-subtle text-[13px]"><SelectValue /></SelectTrigger>
            <SelectContent>{STAGES.slice(0, 5).map((s, i) => <SelectItem key={i} value={String(i)}>{s}</SelectItem>)}</SelectContent>
          </Select>
        </FormField>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Deadline (zile)"><Input className="bg-surface2 border-subtle text-[13px]" type="number" value={deadline} onChange={(e) => setDeadline(e.target.value)} placeholder="ex. 14" /></FormField>
        <FormField label="Zonă"><Input className="bg-surface2 border-subtle text-[13px]" value={zone} onChange={(e) => setZone(e.target.value)} placeholder="ex. Floreasca" /></FormField>
      </div>
      <FormField label="Note"><Textarea className="bg-surface2 border-subtle text-[13px]" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Observații deal…" /></FormField>
      <div className="flex gap-3 justify-end pt-4 border-t border-subtle">
        <button onClick={onCancel} className="px-4 py-2 rounded-lg border border-subtle text-muted-foreground text-xs font-medium hover:bg-surface2 transition-colors cursor-pointer bg-transparent">Anulează</button>
        <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-amber-600 text-primary-foreground text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer">✓ Adaugă Deal</button>
      </div>
    </div>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[11px] font-bold text-muted-foreground tracking-wider uppercase block mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function PanelSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10.5px] font-bold tracking-wider uppercase text-muted-foreground mb-3 pb-1.5 border-b border-subtle">{title}</div>
      {children}
    </div>
  );
}
