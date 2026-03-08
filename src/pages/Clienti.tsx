import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

type ClientType = "Cumpărător" | "Vânzător" | "Chiriaș" | "Investitor" | "Proprietar";
type ClientStage = "lead" | "contactat" | "vizionare" | "oferta";

interface Client {
  id: number;
  name: string;
  initials: string;
  gradient: string;
  type: ClientType;
  zone: string;
  score: number;
  budget: string;
  lastContact: string;
  phone: string;
  tags: { label: string; cls: string }[];
  stage: ClientStage;
  agent: string;
}

const defaultClients: Client[] = [
  {
    id: 1, name: "Cristian Bălan", initials: "CB", gradient: "from-indigo-500 to-indigo-400",
    type: "Cumpărător", zone: "Sector 2", score: 72, budget: "€120K – €160K",
    lastContact: "📞 Azi, 10:23", phone: "+40 766 123 456",
    tags: [
      { label: "Cumpărător", cls: "bg-green-400/10 text-green-400 border border-green-400/20" },
      { label: "🔥 Hot", cls: "bg-yellow-400/12 text-yellow-400 border border-yellow-400/25" },
      { label: "Sector 2", cls: "bg-purple-400/10 text-purple-400 border border-purple-400/20" },
    ],
    stage: "lead", agent: "Radu P.",
  },
  {
    id: 2, name: "Raluca Dumitrescu", initials: "RD", gradient: "from-sky-500 to-sky-400",
    type: "Cumpărător", zone: "Floreasca", score: 41, budget: "€80K – €100K",
    lastContact: "📧 Ieri", phone: "+40 711 987 654",
    tags: [
      { label: "Cumpărător", cls: "bg-green-400/10 text-green-400 border border-green-400/20" },
      { label: "❄️ Rece", cls: "bg-muted-foreground/10 text-muted-foreground border border-subtle" },
      { label: "Floreasca", cls: "bg-purple-400/10 text-purple-400 border border-purple-400/20" },
    ],
    stage: "lead", agent: "Andrei I.",
  },
  {
    id: 3, name: "Bogdan Enache", initials: "BE", gradient: "from-orange-500 to-orange-400",
    type: "Vânzător", zone: "Pipera", score: 55, budget: "Vilă 220m² Pipera",
    lastContact: "📞 Acum 2 zile", phone: "+40 744 555 666",
    tags: [
      { label: "Vânzător", cls: "bg-red-400/10 text-red-400 border border-red-400/20" },
      { label: "Pipera", cls: "bg-purple-400/10 text-purple-400 border border-purple-400/20" },
    ],
    stage: "lead", agent: "Andrei I.",
  },
  {
    id: 4, name: "Elena Popescu", initials: "EP", gradient: "from-primary to-amber-600",
    type: "Cumpărător", zone: "Dorobanți", score: 88, budget: "€200K – €280K",
    lastContact: "💬 Azi, 09:15", phone: "+40 722 111 222",
    tags: [
      { label: "Cumpărător", cls: "bg-green-400/10 text-green-400 border border-green-400/20" },
      { label: "🔥 Hot", cls: "bg-yellow-400/12 text-yellow-400 border border-yellow-400/25" },
      { label: "Dorobanți", cls: "bg-purple-400/10 text-purple-400 border border-purple-400/20" },
    ],
    stage: "contactat", agent: "Andrei I.",
  },
  {
    id: 5, name: "Mihai Florescu", initials: "MF", gradient: "from-purple-400 to-purple-300",
    type: "Chiriaș", zone: "Centru", score: 61, budget: "€600/lună",
    lastContact: "📞 Ieri, 16:40", phone: "+40 755 333 444",
    tags: [
      { label: "Chiriaș", cls: "bg-blue-400/10 text-blue-400 border border-blue-400/20" },
      { label: "Centru", cls: "bg-purple-400/10 text-purple-400 border border-purple-400/20" },
    ],
    stage: "contactat", agent: "Maria C.",
  },
  {
    id: 6, name: "Ioana Constantin", initials: "IC", gradient: "from-pink-500 to-pink-400",
    type: "Cumpărător", zone: "Baneasa", score: 79, budget: "€350K+",
    lastContact: "✅ Vizionare azi 14:00", phone: "+40 733 222 111",
    tags: [
      { label: "Cumpărător", cls: "bg-green-400/10 text-green-400 border border-green-400/20" },
      { label: "🔥 Hot", cls: "bg-yellow-400/12 text-yellow-400 border border-yellow-400/25" },
      { label: "Baneasa", cls: "bg-purple-400/10 text-purple-400 border border-purple-400/20" },
    ],
    stage: "contactat", agent: "Diana M.",
  },
  {
    id: 7, name: "Alexandru Marin", initials: "AM", gradient: "from-emerald-500 to-emerald-400",
    type: "Cumpărător", zone: "Floreasca", score: 91, budget: "€160K – €200K",
    lastContact: "🏠 Viz. Floreasca 42", phone: "+40 733 444 555",
    tags: [
      { label: "Cumpărător", cls: "bg-green-400/10 text-green-400 border border-green-400/20" },
      { label: "🔥 Hot", cls: "bg-yellow-400/12 text-yellow-400 border border-yellow-400/25" },
    ],
    stage: "vizionare", agent: "Maria C.",
  },
  {
    id: 8, name: "Daniela Niculescu", initials: "DN", gradient: "from-amber-500 to-amber-400",
    type: "Cumpărător", zone: "Sector 3", score: 68, budget: "€95K – €130K",
    lastContact: "🏠 Viz. Vitan mâine", phone: "+40 722 666 777",
    tags: [
      { label: "Cumpărător", cls: "bg-green-400/10 text-green-400 border border-green-400/20" },
      { label: "Sector 3", cls: "bg-purple-400/10 text-purple-400 border border-purple-400/20" },
    ],
    stage: "vizionare", agent: "Andrei I.",
  },
  {
    id: 9, name: "George Stancu", initials: "GS", gradient: "from-cyan-500 to-cyan-400",
    type: "Investitor", zone: "Multiple zone", score: 84, budget: "€500K – €800K",
    lastContact: "🏠 3 prop. vizitate", phone: "+40 799 234 567",
    tags: [
      { label: "Investitor", cls: "bg-green-400/10 text-green-400 border border-green-400/20" },
      { label: "🔥 Hot", cls: "bg-yellow-400/12 text-yellow-400 border border-yellow-400/25" },
    ],
    stage: "vizionare", agent: "Diana M.",
  },
  {
    id: 10, name: "Simona Gheorghe", initials: "SG", gradient: "from-green-400 to-green-500",
    type: "Cumpărător", zone: "Dorobanți", score: 96, budget: "€182,000",
    lastContact: "✅ Contract în pregătire", phone: "+40 745 678 901",
    tags: [
      { label: "Cumpărător", cls: "bg-green-400/10 text-green-400 border border-green-400/20" },
      { label: "🔥 HOT", cls: "bg-yellow-400/12 text-yellow-400 border border-yellow-400/25" },
    ],
    stage: "oferta", agent: "Andrei I.",
  },
  {
    id: 11, name: "Vlad Ionescu", initials: "VI", gradient: "from-primary to-amber-700",
    type: "Investitor", zone: "Pipera", score: 90, budget: "€415,000",
    lastContact: "⏳ Antecontract azi", phone: "+40 766 543 210",
    tags: [
      { label: "Investitor", cls: "bg-green-400/10 text-green-400 border border-green-400/20" },
      { label: "🔥 HOT", cls: "bg-yellow-400/12 text-yellow-400 border border-yellow-400/25" },
    ],
    stage: "oferta", agent: "Diana M.",
  },
];

const stages: { key: ClientStage; label: string; dotColor: string }[] = [
  { key: "lead", label: "Lead Nou", dotColor: "bg-blue-400" },
  { key: "contactat", label: "Contactat", dotColor: "bg-yellow-400" },
  { key: "vizionare", label: "Vizionare", dotColor: "bg-purple-400" },
  { key: "oferta", label: "Ofertă / Tranzacție", dotColor: "bg-green-400" },
];

const features = [
  { icon: "🎯", title: "Lead Scoring AI", desc: "Algoritm de scoring automat bazat pe comportament, buget și urgență.", tag: "COMING SOON" },
  { icon: "📞", title: "Istoric Interacțiuni", desc: "Toate apelurile, emailurile, WhatsApp-urile și vizionările într-un timeline.", tag: "COMING SOON" },
  { icon: "🏷️", title: "Segmentare Inteligentă", desc: "Grupare automată pe criterii: cumpărător/vânzător, buget, zonă.", tag: "BETA" },
  { icon: "🔔", title: "Notificări & Follow-up", desc: "Remindere automate pentru recontactare, cu prioritizare inteligentă.", tag: "COMING SOON" },
];

function ScoreRing({ score, size = 36 }: { score: number; size?: number }) {
  const r = (size / 2) - 3;
  const circumference = 2 * Math.PI * r;
  const dash = (score / 100) * circumference;
  const color = score >= 80 ? "#4ade80" : score >= 60 ? "#fbbf24" : "#f87171";
  return (
    <div className="relative flex items-center justify-center flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="absolute top-0 left-0 -rotate-90">
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={3} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={3}
          strokeDasharray={`${dash} ${circumference}`} strokeLinecap="round" />
      </svg>
      <span className="font-serif text-[11px] font-bold relative z-10" style={{ color }}>{score}</span>
    </div>
  );
}

function UrgencyBar({ score }: { score: number }) {
  const color = score >= 80 ? "from-green-400 to-green-500" : score >= 60 ? "from-yellow-400 to-amber-500" : "from-red-400 to-red-500";
  return (
    <div className="h-[3px] rounded-sm bg-surface2 overflow-hidden mb-2">
      <div className={`h-full rounded-sm bg-gradient-to-r ${color} transition-all duration-700`} style={{ width: `${score}%` }} />
    </div>
  );
}

export default function Clienti() {
  const navigate = useNavigate();
  const [clientList, setClientList] = useState<Client[]>(defaultClients);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban");
  const [filterType, setFilterType] = useState("all");
  const [filterScore, setFilterScore] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  // Form state
  const [formFirstName, setFormFirstName] = useState("");
  const [formLastName, setFormLastName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formType, setFormType] = useState<ClientType>("Cumpărător");
  const [formSource, setFormSource] = useState("Imobiliare.ro");
  const [formBudgetMin, setFormBudgetMin] = useState("");
  const [formBudgetMax, setFormBudgetMax] = useState("");
  const [formZone, setFormZone] = useState("");
  const [formNotes, setFormNotes] = useState("");

  const resetForm = () => {
    setFormFirstName(""); setFormLastName(""); setFormPhone(""); setFormEmail("");
    setFormType("Cumpărător"); setFormSource("Imobiliare.ro");
    setFormBudgetMin(""); setFormBudgetMax(""); setFormZone(""); setFormNotes("");
  };

  const handleSaveClient = () => {
    if (!formFirstName.trim() || !formLastName.trim()) {
      toast({ title: "⚠️ Câmpuri obligatorii", description: "Completează cel puțin prenumele și numele.", variant: "destructive" });
      return;
    }
    const fullName = `${formFirstName.trim()} ${formLastName.trim()}`;
    const initials = `${formFirstName[0]}${formLastName[0]}`.toUpperCase();
    const gradients = ["from-indigo-500 to-indigo-400", "from-sky-500 to-sky-400", "from-orange-500 to-orange-400", "from-pink-500 to-pink-400", "from-emerald-500 to-emerald-400", "from-cyan-500 to-cyan-400"];
    const typeTagMap: Record<ClientType, { label: string; cls: string }> = {
      "Cumpărător": { label: "Cumpărător", cls: "bg-green-400/10 text-green-400 border border-green-400/20" },
      "Vânzător": { label: "Vânzător", cls: "bg-red-400/10 text-red-400 border border-red-400/20" },
      "Chiriaș": { label: "Chiriaș", cls: "bg-blue-400/10 text-blue-400 border border-blue-400/20" },
      "Investitor": { label: "Investitor", cls: "bg-green-400/10 text-green-400 border border-green-400/20" },
      "Proprietar": { label: "Proprietar", cls: "bg-yellow-400/10 text-yellow-400 border border-yellow-400/20" },
    };
    const budget = formBudgetMin && formBudgetMax ? `€${(Number(formBudgetMin)/1000).toFixed(0)}K – €${(Number(formBudgetMax)/1000).toFixed(0)}K` : formBudgetMin ? `€${(Number(formBudgetMin)/1000).toFixed(0)}K+` : "N/A";
    const tags: { label: string; cls: string }[] = [typeTagMap[formType]];
    if (formZone) tags.push({ label: formZone, cls: "bg-purple-400/10 text-purple-400 border border-purple-400/20" });

    const newClient: Client = {
      id: Date.now(), name: fullName, initials, gradient: gradients[Math.floor(Math.random() * gradients.length)],
      type: formType, zone: formZone || "Nespecificat", score: Math.floor(Math.random() * 40) + 30,
      budget, lastContact: "🆕 Adăugat acum", phone: formPhone || "N/A",
      tags, stage: "lead", agent: "Alexandru M.",
    };
    setClientList(prev => [newClient, ...prev]);
    toast({ title: "✅ Client adăugat", description: `${fullName} a fost adăugat ca ${formType}.` });
    setModalOpen(false);
    resetForm();
  };

  const handleDeleteClient = (id: number, name: string) => {
    setClientList(prev => prev.filter(c => c.id !== id));
    setSelectedClient(null);
    toast({ title: "🗑️ Client șters", description: `${name} a fost eliminat din baza de date.` });
  };

  const handleStageChange = (id: number, newStage: ClientStage) => {
    setClientList(prev => prev.map(c => c.id === id ? { ...c, stage: newStage } : c));
    const stageLabel = stages.find(s => s.key === newStage)?.label || newStage;
    toast({ title: "🔄 Status actualizat", description: `Clientul a fost mutat la: ${stageLabel}` });
    setSelectedClient(prev => prev && prev.id === id ? { ...prev, stage: newStage } : prev);
  };

  const handleContactAction = (action: string, clientName: string, phone?: string) => {
    switch (action) {
      case "📞":
        toast({ title: "📞 Apel inițiat", description: `Apelezi pe ${clientName} la ${phone || "N/A"}` });
        break;
      case "✉️":
        toast({ title: "✉️ Email", description: `Deschizi emailul pentru ${clientName}` });
        break;
      case "💬":
        toast({ title: "💬 WhatsApp", description: `Deschizi conversația WhatsApp cu ${clientName}` });
        break;
    }
  };

  const handleImportCSV = () => {
    toast({ title: "📥 Import CSV", description: "Funcționalitatea de import CSV va fi disponibilă în curând." });
  };

  const filtered = useMemo(() => {
    return clientList.filter((c) => {
      if (search) {
        const q = search.toLowerCase();
        if (!c.name.toLowerCase().includes(q) && !c.phone.includes(q)) return false;
      }
      if (filterType !== "all" && c.type !== filterType) return false;
      if (filterScore === "hot" && c.score < 80) return false;
      if (filterScore === "med" && (c.score < 50 || c.score >= 80)) return false;
      if (filterScore === "cold" && c.score >= 50) return false;
      return true;
    });
  }, [search, filterType, filterScore, clientList]);

  const stats = [
    { label: "Total Clienți", value: String(clientList.length), sub: `↑ ${clientList.filter(c => c.lastContact.includes("Azi") || c.lastContact.includes("acum")).length} noi azi`, subColor: "text-green-400", accent: "bg-primary", filterKey: "all" },
    { label: "Lead-uri Active", value: String(clientList.filter(c => c.stage === "lead").length), sub: "Necesită contactare", subColor: "text-green-400", accent: "bg-green-400", filterKey: "all" },
    { label: "Scor Mediu AI", value: String(Math.round(clientList.reduce((s, c) => s + c.score, 0) / clientList.length)), sub: "Din 100 puncte posibile", subColor: "text-muted-foreground", accent: "bg-yellow-400", filterKey: "all" },
    { label: "Cumpărători", value: String(clientList.filter(c => c.type === "Cumpărător").length), sub: `Vs ${clientList.filter(c => c.type === "Vânzător").length} vânzători`, subColor: "text-muted-foreground", accent: "bg-blue-400", filterKey: "Cumpărător" },
    { label: "Follow-up Azi", value: String(clientList.filter(c => c.lastContact.includes("Azi")).length), sub: "De contactat", subColor: "text-yellow-400", accent: "bg-purple-400", filterKey: "all" },
  ];

  return (
    <DashboardLayout>
      {/* Topbar */}
      <div className="bg-surface border-b border-subtle px-4 md:px-7 h-[52px] md:h-[58px] flex items-center gap-3 sticky top-0 z-40">
        <div className="flex items-center gap-1.5 text-xs md:text-[13px] text-muted-foreground">
          <span className="cursor-pointer hover:text-primary transition-colors" onClick={() => navigate("/dashboard")}>⊞ Dashboard</span>
          <span className="text-muted-foreground/40">›</span>
          <span className="text-foreground font-medium">👥 Clienți & Leads</span>
        </div>
        <div className="ml-auto flex items-center gap-2 md:gap-3">
          <button onClick={() => { resetForm(); setModalOpen(true); }} className="hidden sm:flex items-center gap-1.5 border border-subtle bg-transparent text-muted-foreground rounded-lg px-3 py-2 text-xs font-medium hover:bg-surface2 hover:text-foreground transition-all cursor-pointer">+ Adaugă Client</button>
          <button onClick={() => { resetForm(); setModalOpen(true); }} className="sm:hidden w-9 h-9 bg-primary text-primary-foreground rounded-lg flex items-center justify-center text-lg font-bold">＋</button>
          <button onClick={handleImportCSV} className="flex items-center gap-1.5 bg-gradient-to-r from-primary to-amber-600 text-primary-foreground rounded-lg px-3 md:px-4 py-2 text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer">
            📥 <span className="hidden md:inline">Import CSV</span>
          </button>
        </div>
      </div>

      <div className="p-4 md:p-8 flex-1 space-y-5 md:space-y-6">
        {/* Header */}
        <div className="animate-fade-up">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 bg-primary/10 border border-primary/20 rounded-[10px] flex items-center justify-center text-lg">👥</div>
            <h1 className="font-serif text-xl md:text-[22px] font-bold">Clienți & Leads</h1>
          </div>
          <p className="text-muted-foreground text-[13px] md:text-sm max-w-xl ml-[52px]">
            Centralizează toți clienții și lead-urile într-o bază de date inteligentă cu scoring automat și segmentare avansată.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-[14px] animate-fade-up-delay-1">
          {stats.map((s, i) => (
            <div key={i}
              onClick={() => {
                if (s.filterKey !== "all") { setFilterType(s.filterKey); }
                toast({ title: `📊 ${s.label}`, description: `${s.value} — ${s.sub}` });
              }}
              className="bg-card border border-subtle rounded-xl p-4 relative overflow-hidden group hover:border-primary/30 hover:-translate-y-0.5 transition-all cursor-pointer">
              <div className={`absolute top-0 left-0 right-0 h-[2px] ${s.accent}`} />
              <div className="text-[10px] font-semibold tracking-wider uppercase text-muted-foreground mb-2">{s.label}</div>
              <div className="font-serif text-2xl md:text-[26px] font-bold leading-none">{s.value}</div>
              <div className={`text-[11px] mt-1.5 ${s.subColor}`}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Plan Banner */}
        <div className="bg-gradient-to-r from-primary/[0.07] to-primary/[0.02] border border-primary/[0.18] rounded-xl p-4 md:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4 animate-fade-up-delay-1">
          <span className="text-2xl">🎯</span>
          <div className="flex-1 min-w-0">
            <h3 className="font-serif text-sm md:text-[14px] font-bold mb-0.5">Ce va include acest modul — SocietyHUB Pro</h3>
            <p className="text-xs md:text-[12.5px] text-muted-foreground"><span className="text-primary">Lead Scoring AI</span>, Istoric Interacțiuni complet, <span className="text-primary">Segmentare automată</span>, Notificări follow-up inteligente și integrare WhatsApp.</p>
          </div>
          <button onClick={() => navigate("/business-plan")} className="bg-gradient-to-r from-primary to-amber-600 text-primary-foreground px-4 py-2 rounded-lg text-xs font-bold hover:opacity-85 transition-opacity whitespace-nowrap cursor-pointer">🔓 Vezi Planul</button>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-2 md:gap-3 animate-fade-up-delay-2">
          <div className="flex bg-card border border-subtle rounded-[9px] p-[3px]">
            {(["kanban", "table"] as const).map((v) => (
              <button key={v} onClick={() => setViewMode(v)}
                className={`px-3 py-[7px] rounded-[7px] text-[12.5px] font-medium border-none cursor-pointer transition-all flex items-center gap-1.5 ${
                  viewMode === v ? "bg-surface2 text-foreground" : "bg-transparent text-muted-foreground hover:text-foreground"
                }`}>
                {v === "kanban" ? "⊞ Kanban" : "☰ Tabel"}
                <span className={`text-[10px] px-1.5 py-px rounded ${viewMode === v ? "bg-primary/15 text-primary" : "bg-surface2 text-muted-foreground"}`}>
                  {filtered.length}
                </span>
              </button>
            ))}
          </div>
          <div className="relative flex-1 min-w-[160px] max-w-xs">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-[13px] pointer-events-none">🔍</span>
            <Input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Caută după nume, telefon…" className="pl-8 bg-card border-subtle text-[13px] h-9" />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-auto min-w-[120px] bg-card border-subtle text-xs h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toți clienții</SelectItem>
              <SelectItem value="Cumpărător">Cumpărători</SelectItem>
              <SelectItem value="Vânzător">Vânzători</SelectItem>
              <SelectItem value="Chiriaș">Chiriași</SelectItem>
              <SelectItem value="Investitor">Investitori</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterScore} onValueChange={setFilterScore}>
            <SelectTrigger className="w-auto min-w-[120px] bg-card border-subtle text-xs h-9 hidden md:flex"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toate scorurile</SelectItem>
              <SelectItem value="hot">🔥 Hot (80+)</SelectItem>
              <SelectItem value="med">⚡ Mediu (50–80)</SelectItem>
              <SelectItem value="cold">❄️ Rece (sub 50)</SelectItem>
            </SelectContent>
          </Select>
          {(filterType !== "all" || filterScore !== "all" || search) && (
            <button
              onClick={() => { setFilterType("all"); setFilterScore("all"); setSearch(""); toast({ title: "🔄 Filtre resetate" }); }}
              className="text-[11px] text-danger font-medium bg-transparent border-none cursor-pointer hover:opacity-80"
            >
              ✕ Resetează
            </button>
          )}
        </div>

        {/* Kanban View */}
        {viewMode === "kanban" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-up-delay-2">
            {stages.map((stage) => {
              const stageClients = filtered.filter((c) => c.stage === stage.key);
              return (
                <div key={stage.key} className="flex flex-col gap-2.5">
                  <div className="flex items-center gap-2 px-3 py-2.5 bg-card border border-subtle rounded-[9px]">
                    <div className={`w-2 h-2 rounded-full ${stage.dotColor}`} />
                    <span className="font-serif text-xs font-bold tracking-wide flex-1">{stage.label}</span>
                    <span className="text-[11px] text-muted-foreground bg-surface2 px-2 py-0.5 rounded">{stageClients.length}</span>
                  </div>
                  {stageClients.map((c) => (
                    <ClientCard key={c.id} client={c} onClick={() => setSelectedClient(c)} onContactAction={handleContactAction} />
                  ))}
                  <button onClick={() => { resetForm(); setModalOpen(true); }}
                    className="w-full py-2.5 rounded-lg border border-dashed border-subtle bg-transparent text-muted-foreground text-xs font-medium hover:bg-surface2 hover:text-foreground transition-all cursor-pointer">
                    + Adaugă lead
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Table View */}
        {viewMode === "table" && (
          <div className="overflow-x-auto animate-fade-up-delay-2 rounded-xl border border-subtle">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-subtle bg-card">
                  {["Client ↕", "Tip", "Scor AI", "Buget", "Zonă", "Ultima interacț.", "Status", "Agent"].map((h) => (
                    <th key={h} className="text-left px-3.5 py-2.5 text-[10.5px] font-semibold tracking-wider uppercase text-muted-foreground whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => {
                  const stageInfo = stages.find((s) => s.key === c.stage)!;
                  const scoreCls = c.score >= 80 ? "bg-green-400/12 text-green-400" : c.score >= 60 ? "bg-yellow-400/12 text-yellow-400" : "bg-red-400/12 text-red-400";
                  return (
                    <tr key={c.id} className="border-b border-subtle hover:bg-surface2 cursor-pointer transition-colors" onClick={() => setSelectedClient(c)}>
                      <td className="px-3.5 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-[30px] h-[30px] rounded-[7px] bg-gradient-to-br ${c.gradient} flex items-center justify-center font-serif font-bold text-[11px] text-primary-foreground flex-shrink-0`}>{c.initials}</div>
                          <div>
                            <div className="font-medium">{c.name}</div>
                            <div className="text-[11px] text-muted-foreground">{c.phone}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3.5 py-3"><span className={`text-[10.5px] px-1.5 py-0.5 rounded ${c.tags[0]?.cls}`}>{c.type}</span></td>
                      <td className="px-3.5 py-3"><span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md ${scoreCls}`}>● {c.score}</span></td>
                      <td className="px-3.5 py-3 text-primary font-semibold text-xs">{c.budget}</td>
                      <td className="px-3.5 py-3 text-muted-foreground text-xs">{c.zone}</td>
                      <td className="px-3.5 py-3 text-muted-foreground text-xs whitespace-nowrap">{c.lastContact}</td>
                      <td className="px-3.5 py-3">
                        <span className="flex items-center gap-1 text-xs whitespace-nowrap">
                          <span className={`w-[7px] h-[7px] rounded-full ${stageInfo.dotColor}`} />
                          {stageInfo.label}
                        </span>
                      </td>
                      <td className="px-3.5 py-3 text-muted-foreground text-xs">{c.agent}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Features */}
        <div className="mt-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-serif text-[13px] font-semibold text-muted-foreground tracking-wide">Ce va include acest modul</span>
            <div className="flex-1 h-px bg-border" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {features.map((f, i) => (
              <div key={i}
                onClick={() => toast({ title: `${f.icon} ${f.title}`, description: f.tag === "BETA" ? "Disponibil în versiunea beta." : "Va fi disponibil în curând." })}
                className="bg-card border border-subtle rounded-xl p-4 md:p-5 hover:border-primary/25 hover:-translate-y-0.5 transition-all cursor-pointer">
                <span className="text-xl block mb-2.5">{f.icon}</span>
                <div className="font-serif text-[13px] font-semibold mb-1">{f.title}</div>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                <span className="inline-block mt-2 px-2 py-0.5 bg-primary/10 rounded text-[10px] text-primary font-semibold tracking-wide">{f.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detail Panel */}
      <Sheet open={!!selectedClient} onOpenChange={(o) => !o && setSelectedClient(null)}>
        <SheetContent side="right" className="w-[340px] md:w-[380px] bg-card border-l border-subtle p-0 overflow-y-auto">
          <SheetTitle className="sr-only">Detalii Client</SheetTitle>
          {selectedClient && (
            <ClientDetailPanel
              client={selectedClient}
              onContactAction={handleContactAction}
              onDelete={() => handleDeleteClient(selectedClient.id, selectedClient.name)}
              onStageChange={(s) => handleStageChange(selectedClient.id, s)}
              onEdit={() => {
                toast({ title: "✏️ Editare", description: `Editezi profilul: ${selectedClient.name}` });
              }}
              onMatch={() => {
                navigate("/matching");
                toast({ title: "🤖 Matching AI", description: `Căutăm proprietăți potrivite pentru ${selectedClient.name}` });
              }}
            />
          )}
        </SheetContent>
      </Sheet>

      {/* Add Modal */}
      <Dialog open={modalOpen} onOpenChange={(open) => { setModalOpen(open); if (!open) resetForm(); }}>
        <DialogContent className="bg-card border-subtle max-w-[560px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-base font-bold">👥 Adaugă Client / Lead</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Prenume *"><Input value={formFirstName} onChange={(e) => setFormFirstName(e.target.value)} className="bg-surface2 border-subtle text-[13px]" placeholder="ex. Elena" /></FormField>
              <FormField label="Nume *"><Input value={formLastName} onChange={(e) => setFormLastName(e.target.value)} className="bg-surface2 border-subtle text-[13px]" placeholder="ex. Popescu" /></FormField>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Telefon"><Input value={formPhone} onChange={(e) => setFormPhone(e.target.value)} className="bg-surface2 border-subtle text-[13px]" placeholder="+40 7XX XXX XXX" /></FormField>
              <FormField label="Email"><Input value={formEmail} onChange={(e) => setFormEmail(e.target.value)} className="bg-surface2 border-subtle text-[13px]" type="email" placeholder="email@exemplu.ro" /></FormField>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Tip Client">
                <Select value={formType} onValueChange={(v) => setFormType(v as ClientType)}>
                  <SelectTrigger className="bg-surface2 border-subtle text-[13px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(["Cumpărător", "Vânzător", "Chiriaș", "Proprietar", "Investitor"] as ClientType[]).map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="Sursă Lead">
                <Select value={formSource} onValueChange={setFormSource}>
                  <SelectTrigger className="bg-surface2 border-subtle text-[13px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Imobiliare.ro", "Storia.ro", "OLX", "Recomandare", "Website propriu", "Facebook / Instagram"].map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Buget Minim (€)"><Input value={formBudgetMin} onChange={(e) => setFormBudgetMin(e.target.value)} className="bg-surface2 border-subtle text-[13px]" type="number" placeholder="ex. 100000" /></FormField>
              <FormField label="Buget Maxim (€)"><Input value={formBudgetMax} onChange={(e) => setFormBudgetMax(e.target.value)} className="bg-surface2 border-subtle text-[13px]" type="number" placeholder="ex. 180000" /></FormField>
            </div>
            <FormField label="Zonă Preferată"><Input value={formZone} onChange={(e) => setFormZone(e.target.value)} className="bg-surface2 border-subtle text-[13px]" placeholder="ex. Floreasca, Dorobanți" /></FormField>
            <FormField label="Note Inițiale"><Textarea value={formNotes} onChange={(e) => setFormNotes(e.target.value)} className="bg-surface2 border-subtle text-[13px]" rows={2} placeholder="Observații, preferințe speciale…" /></FormField>
          </div>
          <div className="flex gap-3 justify-end pt-4 border-t border-subtle mt-2">
            <button onClick={() => { setModalOpen(false); resetForm(); }} className="px-4 py-2 rounded-lg border border-subtle text-muted-foreground text-xs font-medium hover:bg-surface2 transition-colors cursor-pointer bg-transparent">Anulează</button>
            <button onClick={handleSaveClient} className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-amber-600 text-primary-foreground text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer">✓ Salvează Clientul</button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[11px] font-semibold text-muted-foreground tracking-wider uppercase block mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function ClientCard({ client: c, onClick, onContactAction }: { client: Client; onClick: () => void; onContactAction: (action: string, name: string, phone?: string) => void }) {
  return (
    <div onClick={onClick} className="bg-card border border-subtle rounded-xl p-3.5 cursor-pointer hover:border-primary/30 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] transition-all">
      <div className="flex items-start gap-2.5 mb-2.5">
        <div className={`w-[38px] h-[38px] rounded-[9px] bg-gradient-to-br ${c.gradient} flex items-center justify-center font-serif font-bold text-[13px] text-primary-foreground flex-shrink-0`}>{c.initials}</div>
        <div className="flex-1 min-w-0">
          <div className="text-[13.5px] font-semibold truncate">{c.name}</div>
          <div className="text-[11px] text-muted-foreground">{c.type} · {c.zone}</div>
        </div>
        <ScoreRing score={c.score} />
      </div>
      <UrgencyBar score={c.score} />
      <div className="flex gap-1.5 flex-wrap mb-2">
        {c.tags.map((t, i) => (
          <span key={i} className={`text-[10.5px] font-medium px-[7px] py-[3px] rounded ${t.cls}`}>{t.label}</span>
        ))}
      </div>
      <div className="text-xs text-muted-foreground flex items-center gap-1.5 mb-2">
        💰 Buget: <strong className="text-primary font-semibold">{c.budget}</strong>
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-subtle">
        <span className="text-[11px] text-muted-foreground">{c.lastContact}</span>
        <div className="flex gap-1">
          {["📞", "✉️", "💬"].map((ic, i) => (
            <button key={i} onClick={(e) => { e.stopPropagation(); onContactAction(ic, c.name, c.phone); }}
              className="w-[26px] h-[26px] rounded-md bg-surface2 border border-subtle flex items-center justify-center text-xs text-muted-foreground hover:bg-primary/15 hover:border-primary/30 hover:text-primary transition-all cursor-pointer">
              {ic}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ClientDetailPanel({ client: c, onContactAction, onDelete, onStageChange, onEdit, onMatch }: {
  client: Client;
  onContactAction: (action: string, name: string, phone?: string) => void;
  onDelete: () => void;
  onStageChange: (stage: ClientStage) => void;
  onEdit: () => void;
  onMatch: () => void;
}) {
  const scoreColor = c.score >= 80 ? "text-green-400" : c.score >= 60 ? "text-yellow-400" : "text-red-400";
  const barGrad = c.score >= 80 ? "from-green-400 to-green-500" : c.score >= 60 ? "from-yellow-400 to-amber-500" : "from-red-400 to-red-500";

  const timeline = [
    { icon: "💬", title: "WhatsApp — confirmat vizionare", time: "Azi, 09:15" },
    { icon: "🏠", title: "Vizionare — Floreasca 42", time: "Ieri, 14:00" },
    { icon: "📞", title: "Apel 18 min — discutat buget", time: "22 Feb, 10:00" },
    { icon: "✉️", title: "Email — trimis 3 anunțuri", time: "20 Feb, 15:30" },
    { icon: "🎯", title: "Lead creat din Imobiliare.ro", time: "12 Feb, 09:00" },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-subtle flex items-center gap-3 sticky top-0 bg-card z-10">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.gradient} flex items-center justify-center font-serif font-extrabold text-base text-primary-foreground`}>{c.initials}</div>
        <div className="flex-1">
          <div className="font-serif text-base font-bold">{c.name}</div>
          <div className="text-xs text-muted-foreground">{c.type} · {c.score >= 80 ? "🔥 Hot" : c.score >= 60 ? "⚡ Mediu" : "❄️ Rece"}</div>
        </div>
      </div>

      <div className="p-5 flex-1 space-y-5 overflow-y-auto">
        {/* Stage selector */}
        <div>
          <div className="text-[11px] font-semibold tracking-wider uppercase text-muted-foreground mb-2">Etapă curentă</div>
          <div className="flex gap-1.5">
            {stages.map((s) => (
              <button key={s.key} onClick={() => onStageChange(s.key)}
                className={`flex-1 py-1.5 rounded-md text-[10px] font-semibold border cursor-pointer transition-all ${
                  c.stage === s.key ? `${s.dotColor} text-primary-foreground border-transparent` : "bg-transparent border-subtle text-muted-foreground hover:bg-surface2"
                }`}>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <PanelSection title="Scor AI">
          <div className="flex justify-between text-[11.5px] text-muted-foreground mb-1.5">
            <span>Scor total</span>
            <span className={`font-bold ${scoreColor}`}>{c.score} / 100</span>
          </div>
          <div className="h-1.5 bg-surface2 rounded-sm overflow-hidden">
            <div className={`h-full rounded-sm bg-gradient-to-r ${barGrad}`} style={{ width: `${c.score}%` }} />
          </div>
          <div className="mt-2.5 space-y-2">
            {[
              { label: "Urgență", val: 92, color: "bg-red-400" },
              { label: "Buget potrivit", val: 85, color: "bg-primary" },
              { label: "Angajament", val: 78, color: "bg-blue-400" },
            ].map((s) => (
              <div key={s.label}>
                <div className="flex justify-between text-[11px] text-muted-foreground mb-1">
                  <span>{s.label}</span><span className="text-foreground">{s.val}</span>
                </div>
                <div className="h-1.5 bg-surface2 rounded-sm overflow-hidden">
                  <div className={`h-full rounded-sm ${s.color}`} style={{ width: `${s.val}%` }} />
                </div>
              </div>
            ))}
          </div>
        </PanelSection>

        <PanelSection title="Informații Contact">
          {[
            ["Telefon", c.phone],
            ["Email", c.name.toLowerCase().replace(" ", ".") + "@gmail.com"],
            ["WhatsApp", "✓ Activ"],
            ["Sursă lead", "Imobiliare.ro"],
            ["Data adăugare", "12 Feb 2026"],
            ["Agent", c.agent],
          ].map(([label, val]) => (
            <div key={label} className="flex justify-between items-center py-[7px] border-b border-white/[0.03] text-[13px]">
              <span className="text-muted-foreground">{label}</span>
              <span className={`font-medium text-right ${val === "✓ Activ" ? "text-green-400" : ""}`}>{val}</span>
            </div>
          ))}
        </PanelSection>

        <PanelSection title="Preferințe">
          {[
            ["Tip proprietate", "Apartament 3 cam."],
            ["Buget", c.budget],
            ["Zonă preferată", c.zone],
            ["Suprafață minimă", "70 m²"],
            ["Urgență mutare", "🔥 Luna aceasta"],
          ].map(([label, val]) => (
            <div key={label} className="flex justify-between items-center py-[7px] border-b border-white/[0.03] text-[13px]">
              <span className="text-muted-foreground">{label}</span>
              <span className={`font-medium text-right ${label === "Buget" ? "text-primary" : label === "Urgență mutare" ? "text-red-400" : ""}`}>{val}</span>
            </div>
          ))}
        </PanelSection>

        <PanelSection title="Istoric Interacțiuni">
          <div className="space-y-0">
            {timeline.map((t, i) => (
              <div key={i} className="flex gap-3 pb-4 relative">
                {i < timeline.length - 1 && <div className="absolute left-[14px] top-7 bottom-0 w-px bg-border" />}
                <div className="w-7 h-7 rounded-[7px] bg-surface2 border border-subtle flex items-center justify-center text-xs flex-shrink-0">{t.icon}</div>
                <div>
                  <div className="text-[12.5px] font-medium">{t.title}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">{t.time}</div>
                </div>
              </div>
            ))}
          </div>
        </PanelSection>

        {/* Action buttons */}
        <div className="flex gap-2 pt-1">
          <button onClick={() => onContactAction("📞", c.name, c.phone)} className="flex-1 bg-gradient-to-r from-primary to-amber-600 text-primary-foreground py-2.5 rounded-lg text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer">📞 Sună Acum</button>
          <button onClick={() => onContactAction("💬", c.name)} className="flex-1 border border-subtle bg-transparent text-muted-foreground py-2.5 rounded-lg text-xs font-medium hover:bg-surface2 hover:text-foreground transition-all cursor-pointer">💬 WhatsApp</button>
        </div>
        <div className="flex gap-2">
          <button onClick={onMatch} className="flex-1 border border-subtle bg-transparent text-muted-foreground py-2 rounded-lg text-xs font-medium hover:bg-surface2 hover:text-foreground transition-all cursor-pointer">🤖 Matching AI</button>
          <button onClick={onEdit} className="flex-1 border border-subtle bg-transparent text-muted-foreground py-2 rounded-lg text-xs font-medium hover:bg-surface2 hover:text-foreground transition-all cursor-pointer">✏️ Editează</button>
          <button onClick={onDelete} className="px-3 py-2 rounded-lg bg-danger/10 border border-danger/25 text-danger text-xs font-medium cursor-pointer hover:bg-danger/20 transition-colors">🗑️</button>
        </div>
      </div>
    </div>
  );
}

function PanelSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[11px] font-semibold tracking-wider uppercase text-muted-foreground mb-3 pb-1.5 border-b border-subtle">{title}</div>
      {children}
    </div>
  );
}
