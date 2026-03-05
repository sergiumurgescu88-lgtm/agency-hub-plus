import { useState, useMemo, useRef, useCallback } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

/* ── Types ── */
interface Contract {
  id: number; nr: string; type: ContractType; client: string; prop: string;
  agent: string; signed: string; expiry: string; status: ContractStatus;
  val: number; com: number; notes: string;
}
type ContractType = "intermediere" | "exclusivitate" | "precontract" | "act";
type ContractStatus = "activ" | "expirat" | "draft" | "semnat" | "ec";
type TabKey = "all" | "active" | "templates" | "archive";

const TYPE_META: Record<ContractType, { label: string; cls: string }> = {
  intermediere: { label: "Intermediere", cls: "bg-gold-dim text-gold" },
  exclusivitate: { label: "Exclusivitate", cls: "bg-blue-dim text-info-blue" },
  precontract: { label: "Pre-contract", cls: "bg-purple-dim text-purple" },
  act: { label: "Act Adițional", cls: "bg-[hsl(var(--gold-dim))] text-[hsl(43,97%,56%)]" },
};
const STATUS_META: Record<ContractStatus, { label: string; cls: string }> = {
  activ: { label: "Activ", cls: "bg-[hsl(var(--teal-dim))] text-teal" },
  expirat: { label: "Expirat", cls: "bg-red-dim text-danger" },
  draft: { label: "Draft", cls: "bg-surface2 text-dim" },
  semnat: { label: "Semnat", cls: "bg-gold-dim text-gold" },
  ec: { label: "Expiră Curând", cls: "bg-[hsla(45,100%,50%,.12)] text-[hsl(45,100%,60%)]" },
};
const AVATAR_COLORS = ["hsl(var(--gold))", "hsl(var(--blue))", "hsl(var(--purple))", "hsl(var(--teal))", "hsl(45,100%,50%)", "hsl(var(--red))", "hsl(160,80%,50%)", "hsl(230,70%,65%)", "hsl(340,80%,65%)"];

const SEED: Contract[] = [
  { id: 1, nr: "CTR-2025-001", type: "exclusivitate", client: "Mihai Popescu", prop: "Penthouse Aviatorilor 180mp", agent: "Andrei Ionescu", signed: "10 Ian 2025", expiry: "2025-04-10", status: "activ", val: 320000, com: 2, notes: "Exclusivitate 90 zile." },
  { id: 2, nr: "CTR-2025-002", type: "intermediere", client: "Elena Dumitrescu", prop: "Apartament 3 cam. Floreasca", agent: "Maria Popa", signed: "15 Ian 2025", expiry: "2025-07-15", status: "activ", val: 185000, com: 2, notes: "" },
  { id: 3, nr: "CTR-2025-003", type: "precontract", client: "Cristian Marin", prop: "Vila Baneasa 450mp", agent: "Andrei Ionescu", signed: "20 Ian 2025", expiry: "2025-06-20", status: "semnat", val: 650000, com: 1.5, notes: "Avans 10%." },
  { id: 4, nr: "CTR-2025-004", type: "intermediere", client: "Ioana Stancu", prop: "Studio Pipera 45mp", agent: "Alex Gheorghiu", signed: "01 Feb 2025", expiry: "2025-03-08", status: "ec", val: 72000, com: 2, notes: "" },
  { id: 5, nr: "CTR-2025-005", type: "act", client: "Radu Florescu", prop: "Penthouse Aviatorilor 180mp", agent: "Andrei Ionescu", signed: "05 Feb 2025", expiry: "2025-04-10", status: "activ", val: 0, com: 0, notes: "Modificare preț." },
  { id: 6, nr: "CTR-2025-006", type: "exclusivitate", client: "Ana Ionescu", prop: "Casa Otopeni 300mp", agent: "Maria Popa", signed: "10 Feb 2025", expiry: "2025-03-10", status: "ec", val: 280000, com: 2.5, notes: "" },
  { id: 7, nr: "CTR-2024-089", type: "intermediere", client: "Dan Stoica", prop: "Birou Victoriei 120mp", agent: "Andrei Ionescu", signed: "15 Nov 2024", expiry: "2025-02-15", status: "expirat", val: 95000, com: 2, notes: "" },
  { id: 8, nr: "CTR-2025-007", type: "precontract", client: "Sorin Lungu", prop: "Apartament 2 cam. Titan", agent: "Alex Gheorghiu", signed: "20 Feb 2025", expiry: "2025-08-20", status: "draft", val: 118000, com: 2, notes: "Necesită semnătură." },
  { id: 9, nr: "CTR-2025-008", type: "intermediere", client: "Laura Dinu", prop: "Garsonieră Drumul Taberei", agent: "Maria Popa", signed: "25 Feb 2025", expiry: "2025-08-25", status: "draft", val: 55000, com: 2, notes: "" },
  { id: 10, nr: "CTR-2025-009", type: "exclusivitate", client: "Victor Pana", prop: "Penthouse Dorobanți 220mp", agent: "Andrei Ionescu", signed: "01 Mar 2025", expiry: "2025-05-31", status: "activ", val: 450000, com: 2, notes: "Exclusivitate strictă." },
];

const TEMPLATES = [
  { type: "intermediere" as ContractType, icon: "🤝", name: "Contract Intermediere", desc: "Contract standard pentru servicii de intermediere imobiliară între agent și client.", pages: "4 pagini · Ian 2025" },
  { type: "exclusivitate" as ContractType, icon: "🔒", name: "Contract Exclusivitate", desc: "Mandat exclusiv de vânzare/închiriere cu clauze de exclusivitate și penalizări.", pages: "5 pagini · Feb 2025" },
  { type: "precontract" as ContractType, icon: "📋", name: "Antecontract Vânzare-Cumpărare", desc: "Pre-contract cu clauze standard, avans, penalizare și termene de executare.", pages: "6 pagini · Mar 2025" },
  { type: "act" as ContractType, icon: "📎", name: "Act Adițional", desc: "Modificare sau completare la un contract existent, cu referință la contractul de bază.", pages: "2 pagini · Ian 2025" },
];

function daysLeft(d: string) { return Math.ceil((new Date(d).getTime() - Date.now()) / 864e5); }
function initials(n: string) { return n.split(" ").map(x => x[0]).join(""); }

/* ── Sign Steps Component ── */
function SignSteps({ step }: { step: number }) {
  const labels = ["Verificare\nidentitate", "Semnătură\ndigitală", "Timestamp\nlegal", "Arhivare\ncloud"];
  return (
    <div className="flex gap-0 mb-6 relative">
      <div className="absolute top-4 left-4 right-4 h-0.5 bg-surface2 z-0" />
      {labels.map((l, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1.5 relative z-[1]">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold border-2 transition-all duration-300 ${
            i < step ? "bg-teal border-teal text-primary-foreground" : i === step ? "bg-gold border-gold text-primary-foreground" : "bg-surface2 border-subtle text-dim"
          }`}>
            {i < step ? "✓" : i + 1}
          </div>
          <div className="text-[10.5px] text-dim text-center whitespace-pre-line">{l}</div>
        </div>
      ))}
    </div>
  );
}

/* ── Main Page ── */
export default function Contracte() {
  const [data, setData] = useState<Contract[]>(SEED);
  const [tab, setTab] = useState<TabKey>("all");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [alertVisible, setAlertVisible] = useState(true);

  // modals
  const [newOpen, setNewOpen] = useState(false);
  const [signOpen, setSignOpen] = useState(false);
  const [detOpen, setDetOpen] = useState(false);
  const [detContract, setDetContract] = useState<Contract | null>(null);
  const [signId, setSignId] = useState<number | null>(null);
  const [signStep, setSignStep] = useState(1);
  const [signed, setSigned] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // new contract form
  const [nType, setNType] = useState<ContractType>("intermediere");
  const [nNr, setNNr] = useState("CTR-2025-025");
  const [nClient, setNClient] = useState("Mihai Popescu");
  const [nProp, setNProp] = useState("Apartament 3 camere, Floreasca");
  const [nExp, setNExp] = useState("2025-09-04");
  const [nVal, setNVal] = useState("");
  const [nCom, setNCom] = useState("2");
  const [nNotes, setNNotes] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return data.filter(c =>
      (!q || c.nr.toLowerCase().includes(q) || c.client.toLowerCase().includes(q) || c.prop.toLowerCase().includes(q)) &&
      (!typeFilter || c.type === typeFilter)
    );
  }, [data, search, typeFilter]);

  const activeContracts = useMemo(() => data.filter(c => ["activ", "semnat", "ec"].includes(c.status)), [data]);
  const archivedContracts = useMemo(() => data.filter(c => c.status === "expirat"), [data]);

  const stats = useMemo(() => ({
    total: data.length,
    active: data.filter(c => ["activ", "semnat", "ec"].includes(c.status)).length,
    expiring: data.filter(c => { const d = daysLeft(c.expiry); return d >= 0 && d <= 7 && c.status !== "expirat"; }).length,
    unsigned: data.filter(c => c.status === "draft").length,
    expired: data.filter(c => c.status === "expirat").length,
  }), [data]);

  const saveContract = useCallback(() => {
    const newC: Contract = {
      id: Date.now(), nr: nNr, type: nType, client: nClient, prop: nProp,
      agent: "Andrei Ionescu", signed: "04 Mar 2025", expiry: nExp,
      status: "draft", val: parseFloat(nVal) || 0, com: parseFloat(nCom) || 2, notes: nNotes,
    };
    setData(prev => [newC, ...prev]);
    setNewOpen(false);
    toast.success(`✅ Contract ${nNr} generat! Status: Draft.`);
  }, [nNr, nType, nClient, nProp, nExp, nVal, nCom, nNotes]);

  const openSign = (id: number) => {
    setSignId(id); setSigned(false); setSignStep(1); setSignOpen(true);
  };

  const doSign = () => {
    if (signed) return;
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    ctx.strokeStyle = "hsl(40,100%,47%)";
    ctx.lineWidth = 2; ctx.lineCap = "round";
    const pts = [[60, 75], [90, 55], [120, 95], [155, 65], [185, 85], [215, 60], [250, 95], [280, 72], [310, 88], [340, 65], [370, 90], [395, 75]];
    ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
    pts.forEach(p => ctx.lineTo(p[0], p[1])); ctx.stroke();
    setSigned(true); setSignStep(2);
  };

  const confirmSign = () => {
    setSignStep(4);
    const c = data.find(x => x.id === signId);
    setTimeout(() => {
      setData(prev => prev.map(x => x.id === signId ? { ...x, status: "semnat" as ContractStatus } : x));
      setSignOpen(false);
      toast.success(`✍️ Contract ${c?.nr} semnat! Timestamp: ${new Date().toLocaleTimeString("ro")}`);
    }, 600);
  };

  const deleteContract = (id: number) => {
    const c = data.find(x => x.id === id);
    setData(prev => prev.filter(x => x.id !== id));
    toast.info(`🗑 Contract ${c?.nr} șters`);
  };

  const viewDetail = (id: number) => {
    setDetContract(data.find(x => x.id === id) || null);
    setDetOpen(true);
  };

  const useTpl = (type: ContractType) => {
    setTab("all"); setNType(type); setNewOpen(true);
    toast.info(`📄 Template ${TYPE_META[type].label} încărcat`);
  };

  const TABS: { key: TabKey; label: string; icon: string }[] = [
    { key: "all", label: "Toate", icon: "📋" },
    { key: "active", label: "Active", icon: "✅" },
    { key: "templates", label: "Template-uri", icon: "📄" },
    { key: "archive", label: "Arhivă", icon: "📁" },
  ];

  return (
    <DashboardLayout>
      {/* Topbar */}
      <div className="sticky top-0 z-40 bg-background/90 backdrop-blur-xl border-b border-subtle px-4 md:px-7 h-[52px] md:h-[60px] flex items-center gap-2 md:gap-3">
        <div className="flex items-center gap-1.5 text-[12px] md:text-[13px] text-dim">
          <span className="hover:text-gold cursor-pointer transition-colors">SocietyHUB</span>
          <span className="text-dim2">›</span>
          <span className="text-foreground font-medium">📝 Contracte</span>
        </div>
        <div className="ml-auto flex items-center gap-1.5 md:gap-2">
          <Button variant="outline" size="sm" className="text-xs gap-1.5 hidden md:inline-flex" onClick={() => setTab("templates")}>📄 Template-uri</Button>
          <Button variant="outline" size="sm" className="text-xs gap-1.5 hidden md:inline-flex" onClick={() => toast.success("📤 Export CSV — " + data.length + " contracte")}>📤 Export</Button>
          <Button size="sm" className="text-[11px] md:text-xs gap-1.5 bg-gradient-to-r from-[hsl(var(--gold))] to-[hsl(var(--gold2))] text-primary-foreground font-bold hover:opacity-90" onClick={() => setNewOpen(true)}>＋ <span className="hidden sm:inline">Contract </span>Nou</Button>
        </div>
      </div>

      <div className="flex-1 p-4 md:p-7 flex flex-col gap-5 overflow-y-auto">
        {/* Alert */}
        {alertVisible && stats.expiring > 0 && (
          <div className="animate-fade-up flex items-center gap-2.5 px-4 py-3 rounded-[10px] bg-[hsla(45,100%,50%,.08)] border border-[hsla(45,100%,50%,.2)] text-[13px]">
            <span>⚠️</span>
            <span><strong>{stats.expiring} contracte</strong> expiră în următoarele 7 zile.</span>
            <button onClick={() => setAlertVisible(false)} className="ml-auto text-dim hover:text-foreground text-lg">×</button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 animate-fade-up">
          {[
            { label: "Total Contracte", value: stats.total, sub: "↑ +3 luna aceasta", subCls: "text-teal", bar: "gradient-gold-bottom" },
            { label: "Active", value: stats.active, sub: `${Math.round(stats.active / stats.total * 100)}% din total`, subCls: "text-dim", bar: "gradient-teal-bottom" },
            { label: "Expiră Curând", value: stats.expiring, sub: "în 7 zile", subCls: "text-danger", bar: "bg-[hsl(45,100%,50%)]" },
            { label: "Nesemnate", value: stats.unsigned, sub: "Necesită semnătură", subCls: "text-dim", bar: "gradient-blue-bottom" },
            { label: "Expirate", value: stats.expired, sub: "De arhivat", subCls: "text-dim", bar: "gradient-red-bottom" },
          ].map((s, i) => (
            <div key={i} className="bg-surface border border-subtle rounded-xl p-4 relative overflow-hidden hover:border-[hsla(40,100%,47%,.25)] transition-all hover:-translate-y-0.5">
              <div className={`absolute top-0 left-0 right-0 h-0.5 ${s.bar}`} />
              <div className="text-[10px] font-semibold tracking-wider uppercase text-dim mb-1.5">{s.label}</div>
              <div className="font-bold text-2xl leading-none" style={{ fontFamily: "'Syne', sans-serif" }}>{s.value}</div>
              <div className={`text-[11px] mt-1 ${s.subCls}`}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Tabs + Search */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-3 animate-fade-up-delay-1">
          <div className="flex gap-0.5 bg-surface border border-subtle rounded-[10px] p-1 overflow-x-auto w-full md:w-auto">
            {TABS.map(t => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`px-3 md:px-4 py-2 rounded-lg text-[12px] md:text-[13px] font-medium transition-all whitespace-nowrap ${tab === t.key ? "bg-surface2 text-foreground shadow-sm" : "text-dim hover:text-foreground"}`}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>
          <div className="md:ml-auto flex gap-2">
            <div className="flex items-center gap-2 bg-surface2 border border-subtle rounded-lg px-3 py-1.5">
              <span className="text-dim text-sm">🔍</span>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Caută contract, client…"
                className="bg-transparent border-none outline-none text-[13px] text-foreground placeholder:text-dim w-[180px]" />
            </div>
            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
              className="bg-surface2 border border-subtle rounded-lg px-3 py-1.5 text-[13px] text-foreground outline-none cursor-pointer">
              <option value="">Toate tipurile</option>
              <option value="intermediere">Intermediere</option>
              <option value="exclusivitate">Exclusivitate</option>
              <option value="precontract">Pre-contract</option>
              <option value="act">Act Adițional</option>
            </select>
          </div>
        </div>

        {/* Tab Content */}
        {tab === "all" && (
          <div className="bg-surface border border-subtle rounded-xl overflow-hidden animate-fade-up-delay-2">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[hsla(0,0%,100%,.02)]">
                    {["Contract", "Tip", "Client", "Proprietate", "Agent", "Expirare", "Status", "Acțiuni"].map(h => (
                      <th key={h} className="px-4 py-2.5 text-left text-[10.5px] font-bold tracking-wider uppercase text-dim border-b border-subtle">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c, i) => {
                    const d = daysLeft(c.expiry);
                    const expColor = d < 0 ? "text-danger" : d <= 7 ? "text-[hsl(45,100%,50%)]" : "text-dim";
                    return (
                      <tr key={c.id} className="hover:bg-[hsla(0,0%,100%,.02)] transition-colors">
                        <td className="px-4 py-3 border-b border-[hsla(0,0%,100%,.03)]">
                          <div className="font-bold text-[12.5px] text-gold" style={{ fontFamily: "'Syne', sans-serif" }}>{c.nr}</div>
                          <div className="text-[11px] text-dim mt-0.5">{c.notes?.slice(0, 30) || "—"}</div>
                        </td>
                        <td className="px-4 py-3 border-b border-[hsla(0,0%,100%,.03)]">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${TYPE_META[c.type].cls}`}>{TYPE_META[c.type].label}</span>
                        </td>
                        <td className="px-4 py-3 border-b border-[hsla(0,0%,100%,.03)]">
                          <div className="flex items-center gap-2">
                            <div className="w-[26px] h-[26px] rounded-md flex items-center justify-center text-[10px] font-bold text-primary-foreground shrink-0" style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length], fontFamily: "'Syne', sans-serif" }}>{initials(c.client)}</div>
                            <span className="text-[13px]">{c.client}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-[12px] text-dim border-b border-[hsla(0,0%,100%,.03)]">{c.prop}</td>
                        <td className="px-4 py-3 text-[12px] text-dim border-b border-[hsla(0,0%,100%,.03)]">{c.agent}</td>
                        <td className={`px-4 py-3 text-[12px] border-b border-[hsla(0,0%,100%,.03)] ${expColor}`}>
                          {d >= 0 && d <= 7 && <span className="inline-block w-[7px] h-[7px] rounded-full bg-[hsl(45,100%,50%)] mr-1 animate-pulse" />}
                          {c.expiry}
                        </td>
                        <td className="px-4 py-3 border-b border-[hsla(0,0%,100%,.03)]">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${STATUS_META[c.status].cls}`}>{STATUS_META[c.status].label}</span>
                        </td>
                        <td className="px-4 py-3 border-b border-[hsla(0,0%,100%,.03)]">
                          <div className="flex gap-1">
                            <button onClick={() => viewDetail(c.id)} className="px-2 py-1 rounded text-[11.5px] border border-subtle text-dim hover:bg-surface2 hover:text-foreground transition-all">👁</button>
                            {c.status === "draft" && <button onClick={() => openSign(c.id)} className="px-2 py-1 rounded text-[11.5px] border border-[hsla(40,100%,47%,.3)] text-gold bg-[hsla(40,100%,47%,.08)] hover:bg-[hsla(40,100%,47%,.15)] transition-all">✍️</button>}
                            <button onClick={() => toast.success(`⬇️ ${c.nr}.pdf descărcat`)} className="px-2 py-1 rounded text-[11.5px] border border-subtle text-dim hover:bg-surface2 hover:text-foreground transition-all">⬇️</button>
                            <button onClick={() => deleteContract(c.id)} className="px-2 py-1 rounded text-[11.5px] border border-[hsla(0,100%,69%,.2)] text-danger bg-[hsla(0,100%,69%,.08)] hover:bg-[hsla(0,100%,69%,.15)] transition-all">🗑</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "active" && (
          <div className="bg-surface border border-subtle rounded-xl overflow-hidden animate-fade-up-delay-2">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[hsla(0,0%,100%,.02)]">
                    {["Contract", "Client", "Tip", "Expirare", "Zile Rămase", "Acțiuni"].map(h => (
                      <th key={h} className="px-4 py-2.5 text-left text-[10.5px] font-bold tracking-wider uppercase text-dim border-b border-subtle">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {activeContracts.map(c => {
                    const d = daysLeft(c.expiry);
                    return (
                      <tr key={c.id} className="hover:bg-[hsla(0,0%,100%,.02)] transition-colors">
                        <td className="px-4 py-3 border-b border-[hsla(0,0%,100%,.03)]">
                          <div className="font-bold text-[13px] text-gold" style={{ fontFamily: "'Syne', sans-serif" }}>{c.nr}</div>
                        </td>
                        <td className="px-4 py-3 text-[13px] border-b border-[hsla(0,0%,100%,.03)]">{c.client}</td>
                        <td className="px-4 py-3 border-b border-[hsla(0,0%,100%,.03)]">
                          <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-semibold ${TYPE_META[c.type].cls}`}>{TYPE_META[c.type].label}</span>
                        </td>
                        <td className="px-4 py-3 text-[12px] text-dim border-b border-[hsla(0,0%,100%,.03)]">{c.expiry}</td>
                        <td className="px-4 py-3 border-b border-[hsla(0,0%,100%,.03)]">
                          <span className={`font-bold ${d <= 7 ? "text-[hsl(45,100%,50%)]" : d <= 30 ? "text-foreground" : "text-teal"}`} style={{ fontFamily: "'Syne', sans-serif" }}>{d}z</span>
                        </td>
                        <td className="px-4 py-3 border-b border-[hsla(0,0%,100%,.03)]">
                          <div className="flex gap-1">
                            <button onClick={() => viewDetail(c.id)} className="px-2 py-1 rounded text-[11.5px] border border-subtle text-dim hover:bg-surface2 hover:text-foreground transition-all">👁 Detalii</button>
                            <button onClick={() => toast.info(`🔄 Reînnoire inițiată pentru ${c.nr}`)} className="px-2 py-1 rounded text-[11.5px] border border-[hsla(40,100%,47%,.3)] text-gold bg-[hsla(40,100%,47%,.08)] hover:bg-[hsla(40,100%,47%,.15)] transition-all">🔄 Reînnoire</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "templates" && (
          <div className="bg-surface border border-subtle rounded-xl p-6 animate-fade-up-delay-2">
            <div className="font-bold text-[15px] mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>📄 Template-uri Contract</div>
            <div className="text-[13px] text-dim mb-5">Modele pre-definite, editabile, gata de utilizare</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {TEMPLATES.map(t => (
                <div key={t.type} onClick={() => useTpl(t.type)}
                  className="bg-surface2 border-[1.5px] border-subtle rounded-[10px] p-4 cursor-pointer hover:border-[hsla(40,100%,47%,.35)] hover:-translate-y-0.5 transition-all">
                  <div className="text-[28px] mb-2">{t.icon}</div>
                  <div className="font-bold text-[13px] mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>{t.name}</div>
                  <div className="text-[11.5px] text-dim leading-relaxed">{t.desc}</div>
                  <div className="text-[10.5px] text-dim2 mt-1.5">{t.pages}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "archive" && (
          <div className="bg-surface border border-subtle rounded-xl p-6 animate-fade-up-delay-2">
            <div className="font-bold text-[15px] mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>📁 Arhivă Contracte</div>
            {archivedContracts.length === 0 ? (
              <div className="text-dim text-[13px] text-center py-6">Nu există contracte în arhivă.</div>
            ) : archivedContracts.map(c => (
              <div key={c.id} className="flex items-center gap-3 py-3 border-b border-subtle last:border-0">
                <div className="font-bold text-[13px] text-dim w-[130px]" style={{ fontFamily: "'Syne', sans-serif" }}>{c.nr}</div>
                <div className="flex-1">
                  <div className="text-[13px]">{c.client}</div>
                  <div className="text-[11.5px] text-dim">{c.prop}</div>
                </div>
                <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-semibold ${TYPE_META[c.type].cls}`}>{TYPE_META[c.type].label}</span>
                <span className="text-[12px] text-danger">{c.expiry}</span>
                <button onClick={() => toast.success(`⬇️ ${c.nr}.pdf`)} className="px-2 py-1 rounded text-[11.5px] border border-subtle text-dim hover:bg-surface2 hover:text-foreground transition-all">⬇️ PDF</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── New Contract Modal ── */}
      <Dialog open={newOpen} onOpenChange={setNewOpen}>
        <DialogContent className="bg-surface border-subtle2 max-w-[640px]">
          <DialogHeader><DialogTitle className="flex items-center gap-2" style={{ fontFamily: "'Syne', sans-serif" }}>📝 Contract Nou</DialogTitle></DialogHeader>
          <div className="space-y-3.5">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[10.5px] font-bold tracking-wider uppercase text-dim">Tip Contract</label>
                <select value={nType} onChange={e => setNType(e.target.value as ContractType)} className="w-full bg-surface2 border border-subtle rounded-lg px-3 py-2 text-[13px] text-foreground outline-none">
                  <option value="intermediere">Contract Intermediere</option>
                  <option value="exclusivitate">Contract Exclusivitate</option>
                  <option value="precontract">Antecontract V-C</option>
                  <option value="act">Act Adițional</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10.5px] font-bold tracking-wider uppercase text-dim">Nr. Contract</label>
                <Input value={nNr} onChange={e => setNNr(e.target.value)} className="bg-surface2 border-subtle text-[13px]" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[10.5px] font-bold tracking-wider uppercase text-dim">Client</label>
                <select value={nClient} onChange={e => setNClient(e.target.value)} className="w-full bg-surface2 border border-subtle rounded-lg px-3 py-2 text-[13px] text-foreground outline-none">
                  <option>Mihai Popescu</option><option>Elena Dumitrescu</option><option>Cristian Marin</option><option>Ioana Stancu</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10.5px] font-bold tracking-wider uppercase text-dim">Proprietate</label>
                <select value={nProp} onChange={e => setNProp(e.target.value)} className="w-full bg-surface2 border border-subtle rounded-lg px-3 py-2 text-[13px] text-foreground outline-none">
                  <option>Apartament 3 camere, Floreasca</option><option>Penthouse Aviatorilor</option><option>Vila Baneasa 450mp</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[10.5px] font-bold tracking-wider uppercase text-dim">Data Semnare</label>
                <Input type="date" defaultValue="2025-03-04" className="bg-surface2 border-subtle text-[13px]" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10.5px] font-bold tracking-wider uppercase text-dim">Data Expirare</label>
                <Input type="date" value={nExp} onChange={e => setNExp(e.target.value)} className="bg-surface2 border-subtle text-[13px]" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[10.5px] font-bold tracking-wider uppercase text-dim">Valoare Tranzacție (€)</label>
                <Input type="number" value={nVal} onChange={e => setNVal(e.target.value)} placeholder="250000" className="bg-surface2 border-subtle text-[13px]" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10.5px] font-bold tracking-wider uppercase text-dim">Comision %</label>
                <Input type="number" value={nCom} onChange={e => setNCom(e.target.value)} className="bg-surface2 border-subtle text-[13px]" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10.5px] font-bold tracking-wider uppercase text-dim">Note</label>
              <textarea value={nNotes} onChange={e => setNNotes(e.target.value)} placeholder="Clauze speciale, observații…"
                className="w-full bg-surface2 border border-subtle rounded-lg px-3 py-2 text-[13px] text-foreground outline-none resize-y min-h-[80px]" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Anulează</Button></DialogClose>
            <Button variant="outline" onClick={() => { setNewOpen(false); toast.info("💾 Draft salvat"); }}>💾 Draft</Button>
            <Button className="bg-gradient-to-r from-[hsl(var(--gold))] to-[hsl(var(--gold2))] text-primary-foreground font-bold" onClick={saveContract}>✅ Generează Contract</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Sign Modal ── */}
      <Dialog open={signOpen} onOpenChange={setSignOpen}>
        <DialogContent className="bg-surface border-subtle2 max-w-[640px]">
          <DialogHeader><DialogTitle className="flex items-center gap-2" style={{ fontFamily: "'Syne', sans-serif" }}>✍️ Semnătură Electronică</DialogTitle></DialogHeader>
          <SignSteps step={signStep} />
          <div className="text-[13px] text-dim mb-2">Desenați semnătura în câmpul de mai jos:</div>
          <canvas ref={canvasRef} width={590} height={150} onClick={doSign}
            className="w-full h-[150px] bg-surface2 border-2 border-dashed border-subtle2 rounded-[10px] cursor-pointer hover:border-gold transition-colors" />
          <div className="text-center text-[12px] text-dim mt-2">{signed ? "✅ Semnătură capturată" : "Click pentru a simula semnătura"}</div>
          <div className="mt-3 p-3 bg-[hsla(40,100%,47%,.05)] border border-[hsla(40,100%,47%,.15)] rounded-lg text-[12px] text-dim">
            🔒 Semnătura electronică este validă juridic conform Regulamentului eIDAS și Legii 455/2001.
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Anulează</Button></DialogClose>
            <Button disabled={!signed} className="bg-gradient-to-r from-[hsl(var(--gold))] to-[hsl(var(--gold2))] text-primary-foreground font-bold disabled:opacity-50" onClick={confirmSign}>✍️ Confirmă Semnătura</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Detail Modal ── */}
      <Dialog open={detOpen} onOpenChange={setDetOpen}>
        <DialogContent className="bg-surface border-subtle2 max-w-[680px]">
          {detContract && (() => {
            const c = detContract;
            const d = daysLeft(c.expiry);
            return (
              <>
                <DialogHeader><DialogTitle style={{ fontFamily: "'Syne', sans-serif" }}>📝 {c.nr} — {TYPE_META[c.type].label}</DialogTitle></DialogHeader>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {[
                    { label: "Client", val: <span className="text-[14px] font-semibold">{c.client}</span> },
                    { label: "Agent", val: <span className="text-[14px] font-semibold">{c.agent}</span> },
                    { label: "Proprietate", val: <span className="text-[13px]">{c.prop}</span> },
                    { label: "Status", val: <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-semibold ${STATUS_META[c.status].cls}`}>{STATUS_META[c.status].label}</span> },
                    { label: "Semnat", val: <span className="text-[13px] text-dim">{c.signed}</span> },
                    { label: "Expiră", val: <span className={`text-[13px] ${d <= 7 ? "text-[hsl(45,100%,50%)]" : "text-dim"}`}>{c.expiry} ({d} zile)</span> },
                    ...(c.val > 0 ? [
                      { label: "Valoare", val: <span className="text-[16px] font-bold text-gold" style={{ fontFamily: "'Syne', sans-serif" }}>€{c.val.toLocaleString("ro")}</span> },
                      { label: `Comision ${c.com}%`, val: <span className="text-[16px] font-bold text-teal" style={{ fontFamily: "'Syne', sans-serif" }}>€{(c.val * c.com / 100).toLocaleString("ro")}</span> },
                    ] : []),
                  ].map((item, i) => (
                    <div key={i}>
                      <div className="text-[10px] font-bold tracking-wider uppercase text-dim mb-1">{item.label}</div>
                      {item.val}
                    </div>
                  ))}
                </div>
                {c.notes && (
                  <div className="bg-surface2 rounded-lg p-3 text-[13px] text-dim mb-3">
                    <strong className="text-foreground">Note:</strong> {c.notes}
                  </div>
                )}
                <div className="p-3 bg-[hsla(40,100%,47%,.05)] border border-[hsla(40,100%,47%,.15)] rounded-lg">
                  <div className="text-[11px] text-dim mb-1.5">🔒 Securitate document</div>
                  <div className="flex gap-4 text-[12px]">
                    <span className="text-teal">✓ Hash SHA-256</span>
                    <span className="text-teal">✓ Backup cloud</span>
                    <span className={["semnat", "activ"].includes(c.status) ? "text-teal" : "text-[hsl(45,100%,50%)]"}>
                      {["semnat", "activ"].includes(c.status) ? "✓ Semnat digital" : "⚠ Necesită semnătură"}
                    </span>
                  </div>
                </div>
              </>
            );
          })()}
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Închide</Button></DialogClose>
            <Button className="bg-gradient-to-r from-[hsl(var(--gold))] to-[hsl(var(--gold2))] text-primary-foreground font-bold" onClick={() => toast.success("⬇️ PDF descărcat cu succes")}>⬇️ Descarcă PDF</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
