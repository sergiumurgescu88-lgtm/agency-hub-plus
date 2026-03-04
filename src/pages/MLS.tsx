import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Search, Plus, MessageSquare, Home, Send, Download, FileText, Link2, X, Star, MapPin, ArrowUpRight, TrendingUp, Users, Building2, Handshake, BarChart3, Shield, Clock, Bell, CreditCard, Globe, Scale } from "lucide-react";

// ── DATA ──
interface Agency {
  id: number; name: string; city: string; props: number; deals: number;
  status: "connected" | "pending" | "new"; color: string; initials: string; rating: number;
}

const INITIAL_AGENCIES: Agency[] = [
  { id: 1, name: "RE/MAX Floreasca", city: "București, Sector 2", props: 28, deals: 14, status: "connected", color: "hsl(var(--gold))", initials: "RF", rating: 4.9 },
  { id: 2, name: "Coldwell Banker", city: "București, Sector 1", props: 35, deals: 21, status: "connected", color: "hsl(var(--blue))", initials: "CB", rating: 4.8 },
  { id: 3, name: "Imobiliare Nordului", city: "Cluj-Napoca", props: 19, deals: 9, status: "connected", color: "hsl(var(--teal))", initials: "IN", rating: 4.7 },
  { id: 4, name: "Casa Visurilor", city: "Timișoara", props: 12, deals: 5, status: "connected", color: "hsl(var(--purple))", initials: "CV", rating: 4.6 },
  { id: 5, name: "Premium Estate", city: "București, Sector 3", props: 22, deals: 11, status: "connected", color: "hsl(var(--red))", initials: "PE", rating: 4.5 },
  { id: 6, name: "Luxury Homes RO", city: "Constanța", props: 9, deals: 4, status: "connected", color: "hsl(40 100% 74%)", initials: "LH", rating: 4.4 },
  { id: 7, name: "Grup Imobiliar SRL", city: "Iași", props: 15, deals: 7, status: "connected", color: "hsl(var(--teal))", initials: "GI", rating: 4.3 },
  { id: 8, name: "Avantaj Imobiliare", city: "Brașov", props: 8, deals: 3, status: "connected", color: "hsl(24 90% 60%)", initials: "AI", rating: 4.2 },
  { id: 9, name: "Metro Properties", city: "București, Sector 4", props: 0, deals: 0, status: "pending", color: "hsl(var(--text2))", initials: "MP", rating: 0 },
  { id: 10, name: "EstateHub Romania", city: "Oradea", props: 0, deals: 0, status: "pending", color: "hsl(var(--text2))", initials: "EH", rating: 0 },
  { id: 11, name: "TopImob", city: "Sibiu", props: 6, deals: 2, status: "new", color: "hsl(var(--gold))", initials: "TI", rating: 4.1 },
  { id: 12, name: "ImoPremium", city: "Galați", props: 4, deals: 1, status: "new", color: "hsl(var(--blue))", initials: "IP", rating: 3.9 },
];

const MLS_PROPS = [
  { title: "Penthouse 4 cam, Floreasca", agency: "RE/MAX Floreasca", type: "🏢", rooms: "4", area: "180mp", price: "€320,000", split: "50/50", status: "Disponibil" },
  { title: "Vilă duplex, Pipera", agency: "Coldwell Banker", type: "🏠", rooms: "5", area: "280mp", price: "€580,000", split: "60/40", status: "Disponibil" },
  { title: "Apartament 2 cam, Dorobanți", agency: "RE/MAX Floreasca", type: "🏢", rooms: "2", area: "68mp", price: "€145,000", split: "50/50", status: "Disponibil" },
  { title: "Casă 6 cam, Snagov", agency: "Imobiliare Nordului", type: "🏡", rooms: "6", area: "350mp", price: "€420,000", split: "50/50", status: "Rezervat" },
  { title: "Studio modern, Universitate", agency: "Premium Estate", type: "🏢", rooms: "1", area: "38mp", price: "€82,000", split: "50/50", status: "Disponibil" },
  { title: "Teren 1500mp, Baneasa", agency: "Luxury Homes RO", type: "🌿", rooms: "—", area: "1500mp", price: "€195,000", split: "40/60", status: "Disponibil" },
  { title: "Apartament 3 cam, Herăstrău", agency: "Casa Visurilor", type: "🏢", rooms: "3", area: "110mp", price: "€210,000", split: "50/50", status: "Disponibil" },
  { title: "Duplex 5 cam, Băneasa", agency: "Grup Imobiliar SRL", type: "🏠", rooms: "5", area: "220mp", price: "€385,000", split: "60/40", status: "Rezervat" },
];

const COLLABS = [
  { prop: "Penthouse Floreasca", partner: "RE/MAX Floreasca", role: "Selling Agent" as const, value: "€320K", com: "€9,600", split: "50/50", status: "active" as const, date: "Feb 2025" },
  { prop: "Vilă duplex Pipera", partner: "Coldwell Banker", role: "Listing Agent" as const, value: "€580K", com: "€17,400", split: "60/40", status: "active" as const, date: "Ian 2025" },
  { prop: "Apartament Dorobanți", partner: "RE/MAX Floreasca", role: "Selling Agent" as const, value: "€145K", com: "€4,350", split: "50/50", status: "active" as const, date: "Mar 2025" },
  { prop: "Casă Snagov", partner: "Imobiliare Nordului", role: "Listing Agent" as const, value: "€420K", com: "€12,600", split: "50/50", status: "pending" as const, date: "Mar 2025" },
  { prop: "Studio Universitate", partner: "Premium Estate", role: "Selling Agent" as const, value: "€82K", com: "€2,460", split: "50/50", status: "closed" as const, date: "Dec 2024" },
  { prop: "Teren Băneasa", partner: "Luxury Homes RO", role: "Listing Agent" as const, value: "€195K", com: "€5,850", split: "40/60", status: "closed" as const, date: "Nov 2024" },
];

const RULES = [
  { icon: <Scale className="w-4 h-4" />, label: "Split implicit comision", value: "50% / 50%", colorClass: "text-gold", bgClass: "bg-gold-dim" },
  { icon: <Clock className="w-4 h-4" />, label: "Termen răspuns ofertă", value: "24 ore", colorClass: "text-info-blue", bgClass: "bg-blue-dim" },
  { icon: <FileText className="w-4 h-4" />, label: "Tip contract co-broker", value: "Standard ANAIIMM", colorClass: "text-teal", bgClass: "bg-teal-dim" },
  { icon: <Bell className="w-4 h-4" />, label: "Notificare modificare preț", value: "Instant", colorClass: "text-purple", bgClass: "bg-purple-dim" },
  { icon: <CreditCard className="w-4 h-4" />, label: "Termen plată comision", value: "30 zile de la act", colorClass: "text-gold", bgClass: "bg-gold-dim" },
  { icon: <Globe className="w-4 h-4" />, label: "Vizibilitate proprietăți", value: "Toți partenerii", colorClass: "text-gold", bgClass: "bg-gold-dim" },
];

const PERF_MONTHS = [
  { month: "Oct", val: 2 }, { month: "Nov", val: 3 }, { month: "Dec", val: 4 },
  { month: "Ian", val: 3 }, { month: "Feb", val: 5 }, { month: "Mar", val: 7 },
];

const TOP_PARTNERS = [
  { name: "RE/MAX Floreasca", value: "€14,000", deals: 5 },
  { name: "Coldwell Banker", value: "€17,400", deals: 3 },
  { name: "Imobiliare Nordului", value: "€12,600", deals: 2 },
  { name: "Premium Estate", value: "€7,200", deals: 4 },
];

// ── COMPONENTS ──

function StatCard({ label, value, sub, colorClass }: { label: string; value: string; sub: string; colorClass: string }) {
  const borderColors: Record<string, string> = {
    gold: "gradient-gold-bottom", green: "gradient-teal-bottom", blue: "gradient-blue-bottom", purple: "bg-purple-dim",
  };
  return (
    <Card className="relative overflow-hidden hover:border-[hsl(var(--gold)/0.25)] transition-all hover:-translate-y-0.5">
      <div className={`absolute top-0 left-0 right-0 h-0.5 ${borderColors[colorClass] || "gradient-gold-bottom"}`} />
      <CardContent className="p-5">
        <p className="text-[10px] font-semibold tracking-wider uppercase text-dim mb-1.5">{label}</p>
        <p className="font-['Syne'] text-[26px] font-extrabold leading-none">{value}</p>
        <p className="text-[11px] text-dim mt-1.5">{sub}</p>
      </CardContent>
    </Card>
  );
}

function AgencyCard({ ag, onConnect }: { ag: Agency; onConnect: (id: number) => void }) {
  const statusBadge = ag.status === "connected"
    ? <Badge className="bg-teal-dim text-teal border-0 text-[11px]">● Conectat</Badge>
    : ag.status === "pending"
      ? <Badge className="bg-gold-dim text-gold border-0 text-[11px]">⏳ În așteptare</Badge>
      : <Badge variant="secondary" className="text-[11px]">+ Invită</Badge>;

  return (
    <Card className={`hover:border-[hsl(var(--gold)/0.3)] transition-all hover:-translate-y-0.5 cursor-pointer ${ag.status === "connected" ? "border-[hsl(var(--teal)/0.2)]" : ""}`}
      onClick={() => ag.status === "connected" && toast.info(`🏢 Profil ${ag.name} — ${ag.props} proprietăți, ${ag.deals} tranzacții co-broker`)}>
      <CardContent className="p-[18px]">
        <div className="flex items-start justify-between mb-2.5">
          <div className="w-11 h-11 rounded-[10px] flex items-center justify-center font-['Syne'] font-extrabold text-sm border"
            style={{ color: ag.color, background: `${ag.color}20`, borderColor: `${ag.color}30` }}>{ag.initials}</div>
          {statusBadge}
        </div>
        <p className="font-['Syne'] text-sm font-bold mb-1">{ag.name}</p>
        <p className="text-xs text-dim mb-2.5 flex items-center gap-1"><MapPin className="w-3 h-3" />{ag.city}</p>
        {ag.status !== "pending" ? (
          <div className="flex gap-3 mb-3">
            <div className="text-center"><p className="font-['Syne'] text-sm font-bold" style={{ color: ag.color }}>{ag.props}</p><p className="text-[10px] text-dim">Proprietăți</p></div>
            <div className="text-center"><p className="font-['Syne'] text-sm font-bold">{ag.deals}</p><p className="text-[10px] text-dim">Tranzacții</p></div>
            {ag.rating > 0 && <div className="text-center"><p className="font-['Syne'] text-sm font-bold">⭐{ag.rating}</p><p className="text-[10px] text-dim">Rating</p></div>}
          </div>
        ) : (
          <p className="text-xs text-dim my-3">Invitație trimisă — așteaptă confirmare</p>
        )}
        <div className="flex gap-1.5 mt-2" onClick={e => e.stopPropagation()}>
          {ag.status === "connected" && (<>
            <Button variant="outline" size="sm" className="flex-1 text-xs h-8" onClick={() => toast.info(`💬 Chat deschis cu ${ag.name}`)}><MessageSquare className="w-3.5 h-3.5" />Chat</Button>
            <Button variant="outline" size="sm" className="text-xs h-8" onClick={() => toast.info(`📋 Proprietăți ${ag.name} deschise`)}><Home className="w-3.5 h-3.5" /></Button>
          </>)}
          {ag.status === "new" && (
            <Button size="sm" className="flex-1 text-xs h-8" onClick={() => onConnect(ag.id)}><Link2 className="w-3.5 h-3.5" />Conectează</Button>
          )}
          {ag.status === "pending" && (<>
            <Button variant="outline" size="sm" className="flex-1 text-xs h-8" onClick={() => toast.success("📨 Reminder trimis")}><Send className="w-3.5 h-3.5" />Reminder</Button>
            <Button variant="outline" size="sm" className="text-xs h-8 text-danger hover:text-danger" onClick={() => toast.info("❌ Invitație anulată")}><X className="w-3.5 h-3.5" /></Button>
          </>)}
        </div>
      </CardContent>
    </Card>
  );
}

// ── MAIN ──
export default function MLS() {
  const [agencies, setAgencies] = useState<Agency[]>(INITIAL_AGENCIES);
  const [agencyFilter, setAgencyFilter] = useState("toate");
  const [propFilter, setPropFilter] = useState("toate");
  const [search, setSearch] = useState("");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [ruleToggles, setRuleToggles] = useState<boolean[]>(RULES.map(() => true));

  const filteredAgencies = agencies.filter(ag => {
    if (agencyFilter === "conectate") return ag.status === "connected";
    if (agencyFilter === "pending") return ag.status === "pending";
    if (agencyFilter === "noi") return ag.status === "new";
    return true;
  }).filter(ag => !search || ag.name.toLowerCase().includes(search.toLowerCase()) || ag.city.toLowerCase().includes(search.toLowerCase()));

  const filteredProps = MLS_PROPS.filter(p => {
    if (propFilter === "disponibile") return p.status === "Disponibil";
    if (propFilter === "rezervate") return p.status === "Rezervat";
    if (propFilter === "mele") return p.agency === "RE/MAX Floreasca";
    return true;
  }).filter(p => !search || p.title.toLowerCase().includes(search.toLowerCase()));

  const connectAgency = (id: number) => {
    setAgencies(prev => prev.map(ag => ag.id === id ? { ...ag, status: "connected" as const, props: Math.floor(Math.random() * 15) + 5, deals: Math.floor(Math.random() * 8) + 1, rating: +(3.8 + Math.random()).toFixed(1) } : ag));
    const ag = agencies.find(a => a.id === id);
    toast.success(`✅ ${ag?.name} a fost conectată în rețeaua MLS!`);
  };

  const connCount = agencies.filter(a => a.status === "connected").length;
  const pendCount = agencies.filter(a => a.status === "pending").length;
  const newCount = agencies.filter(a => a.status === "new").length;
  const maxPerf = Math.max(...PERF_MONTHS.map(m => m.val));

  const agencyFilterPills = [
    { key: "toate", label: `Toate (${agencies.length})` },
    { key: "conectate", label: `Conectate (${connCount})` },
    { key: "pending", label: `În așteptare (${pendCount})` },
    { key: "noi", label: `Sugestii noi (${newCount})` },
  ];

  const propFilterPills = [
    { key: "toate", label: `Toate (${MLS_PROPS.length})` },
    { key: "disponibile", label: `Disponibile (${MLS_PROPS.filter(p => p.status === "Disponibil").length})` },
    { key: "rezervate", label: `Rezervate (${MLS_PROPS.filter(p => p.status === "Rezervat").length})` },
    { key: "mele", label: `Ale mele (${MLS_PROPS.filter(p => p.agency === "RE/MAX Floreasca").length})` },
  ];

  return (
    <div className="space-y-5 animate-fade-up">
      {/* MLS EXPLANATION */}
      <Card className="border-[hsl(var(--gold)/0.2)] bg-gold-dim/30">
        <CardContent className="p-4 flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-gold-dim flex items-center justify-center flex-shrink-0">
            <Handshake className="w-5 h-5 text-gold" />
          </div>
          <div>
            <p className="font-['Syne'] font-bold text-sm mb-1">Ce este MLS Partener?</p>
            <p className="text-xs text-dim leading-relaxed">
              <strong className="text-gold">MLS (Multiple Listing Service)</strong> este un sistem de partajare a proprietăților între agenții imobiliare partenere. 
              Prin MLS, poți colabora cu alte agenții: partajezi proprietăți, împarți comisioanele (co-broking) și extinzi portofoliul disponibil pentru clienții tăi — fără a lista proprietățile individual. 
              Listing Agent = agenția care deține proprietatea. Selling Agent = agenția care aduce cumpărătorul.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* HEADER */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="font-['Syne'] text-xl font-extrabold flex items-center gap-2">🤝 MLS Partener</h1>
          <p className="text-xs text-dim mt-1">Colaborează cu agenții partenere — share proprietăți & split comisioane</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-surface border border-subtle rounded-lg px-3 h-9 w-64">
            <Search className="w-4 h-4 text-dim" />
            <input className="bg-transparent border-none text-sm outline-none flex-1 placeholder:text-dim" placeholder="Caută agenție sau proprietate..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <Button variant="outline" size="sm" onClick={() => toast.success("📊 Export raport MLS")}><BarChart3 className="w-3.5 h-3.5" />Export</Button>
          <Button size="sm" onClick={() => setInviteOpen(true)}><Plus className="w-3.5 h-3.5" />Invită Agenție</Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-3.5">
        <StatCard label="Agenții Partenere" value={String(agencies.length)} sub={`↑ +3 luna aceasta`} colorClass="gold" />
        <StatCard label="Proprietăți Partajate" value="84" sub="În rețeaua MLS" colorClass="green" />
        <StatCard label="Colaborări Active" value="7" sub="↑ 2 tranzacții noi" colorClass="blue" />
        <StatCard label="Comisioane Co-broker" value="€18.4K" sub="↑ +22% YTD" colorClass="purple" />
      </div>

      {/* TABS */}
      <Tabs defaultValue="retea" className="space-y-4">
        <TabsList className="bg-surface border border-subtle">
          <TabsTrigger value="retea">🔗 Rețea Agenții</TabsTrigger>
          <TabsTrigger value="proprietati">🏠 Proprietăți MLS</TabsTrigger>
          <TabsTrigger value="colaborari">💼 Colaborări</TabsTrigger>
          <TabsTrigger value="reguli">📋 Reguli Co-broker</TabsTrigger>
        </TabsList>

        {/* TAB: RETEA AGENTII */}
        <TabsContent value="retea" className="space-y-4 animate-fade-up">
          <div className="flex gap-1.5 flex-wrap">
            {agencyFilterPills.map(p => (
              <button key={p.key} onClick={() => setAgencyFilter(p.key)}
                className={`px-3 py-1.5 rounded-full text-xs border transition-all ${agencyFilter === p.key ? "bg-gold-dim border-[hsl(var(--gold)/0.3)] text-gold" : "border-subtle text-dim hover:text-foreground"}`}>
                {p.label}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-3.5">
            {filteredAgencies.map(ag => <AgencyCard key={ag.id} ag={ag} onConnect={connectAgency} />)}
          </div>
        </TabsContent>

        {/* TAB: PROPRIETATI MLS */}
        <TabsContent value="proprietati" className="space-y-4 animate-fade-up">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex gap-1.5 flex-wrap">
              {propFilterPills.map(p => (
                <button key={p.key} onClick={() => setPropFilter(p.key)}
                  className={`px-3 py-1.5 rounded-full text-xs border transition-all ${propFilter === p.key ? "bg-gold-dim border-[hsl(var(--gold)/0.3)] text-gold" : "border-subtle text-dim hover:text-foreground"}`}>
                  {p.label}
                </button>
              ))}
            </div>
            <div className="ml-auto flex gap-2">
              <Select onValueChange={() => toast.info("Filtru aplicat")}>
                <SelectTrigger className="h-8 text-xs w-36"><SelectValue placeholder="Toate tipurile" /></SelectTrigger>
                <SelectContent><SelectItem value="all">Toate tipurile</SelectItem><SelectItem value="apt">Apartament</SelectItem><SelectItem value="casa">Casă</SelectItem><SelectItem value="teren">Teren</SelectItem><SelectItem value="com">Comercial</SelectItem></SelectContent>
              </Select>
              <Select onValueChange={() => toast.info("Sortare aplicată")}>
                <SelectTrigger className="h-8 text-xs w-32"><SelectValue placeholder="Cel mai nou" /></SelectTrigger>
                <SelectContent><SelectItem value="new">Cel mai nou</SelectItem><SelectItem value="pa">Preț ↑</SelectItem><SelectItem value="pd">Preț ↓</SelectItem><SelectItem value="split">Split ↑</SelectItem></SelectContent>
              </Select>
            </div>
          </div>
          <Card>
            <CardHeader className="py-3 px-4 border-b border-subtle">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-['Syne']">🏠 Proprietăți Disponibile în Rețeaua MLS</CardTitle>
                <span className="text-xs text-dim">{filteredProps.length} proprietăți • {agencies.filter(a => a.status === "connected").length} agenții</span>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {filteredProps.map((p, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3 border-b border-subtle/30 hover:bg-surface2 transition-colors cursor-pointer"
                  onClick={() => toast.info(`🏠 Detalii: ${p.title} — ${p.price}`)}>
                  <div className="w-[52px] h-10 rounded-md bg-surface2 flex items-center justify-center text-lg flex-shrink-0">{p.type}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold truncate">{p.title}</p>
                    <p className="text-[11.5px] text-dim">{p.rooms !== "—" ? `${p.rooms} cam • ` : ""}{p.area} • via <strong>{p.agency}</strong></p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-['Syne'] text-[13px] font-bold text-gold">{p.price}</p>
                    <p className="text-[11px] text-dim">Split: {p.split}</p>
                  </div>
                  <Badge className={`text-[11px] border-0 ${p.status === "Disponibil" ? "bg-teal-dim text-teal" : "bg-gold-dim text-gold"}`}>{p.status}</Badge>
                  <Button variant="outline" size="sm" className="text-xs h-7 ml-1" onClick={e => { e.stopPropagation(); toast.success("✅ Proprietate adăugată în portofoliul tău MLS"); }}>+ Adaugă</Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB: COLABORARI */}
        <TabsContent value="colaborari" className="space-y-4 animate-fade-up">
          <Card>
            <CardHeader className="py-3 px-4 border-b border-subtle flex-row items-center justify-between">
              <CardTitle className="text-sm font-['Syne']">💼 Colaborări Active & Istorice</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="text-xs h-8" onClick={() => toast.success("📊 Raport colaborări exportat")}><Download className="w-3.5 h-3.5" />Export</Button>
                <Button size="sm" className="text-xs h-8" onClick={() => toast.success("✅ Colaborare nouă inițiată")}><Plus className="w-3.5 h-3.5" />Colaborare Nouă</Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-[10.5px]">Proprietate</TableHead>
                    <TableHead className="text-[10.5px]">Partener</TableHead>
                    <TableHead className="text-[10.5px]">Rol</TableHead>
                    <TableHead className="text-[10.5px] text-center">Valoare</TableHead>
                    <TableHead className="text-[10.5px] text-center">Comision</TableHead>
                    <TableHead className="text-[10.5px] text-center">Status</TableHead>
                    <TableHead className="text-[10.5px] text-center">Acțiuni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {COLLABS.map((c, i) => (
                    <TableRow key={i} className="cursor-pointer" onClick={() => toast.info(`📋 Detalii colaborare: ${c.prop}`)}>
                      <TableCell className="text-[13px] font-semibold">{c.prop}</TableCell>
                      <TableCell className="text-[13px] text-dim">{c.partner}</TableCell>
                      <TableCell>
                        <Badge className={`text-[11px] border-0 ${c.role === "Listing Agent" ? "bg-gold-dim text-gold" : "bg-blue-dim text-info-blue"}`}>{c.role}</Badge>
                      </TableCell>
                      <TableCell className="text-center font-['Syne'] font-bold text-[13px]">{c.value}</TableCell>
                      <TableCell className="text-center font-['Syne'] font-bold text-gold text-[13px]">{c.com}</TableCell>
                      <TableCell className="text-center">
                        <Badge className={`text-[11px] border-0 ${c.status === "active" ? "bg-teal-dim text-teal" : c.status === "pending" ? "bg-gold-dim text-gold" : "bg-surface2 text-dim"}`}>
                          {c.status === "active" ? "Activ" : c.status === "pending" ? "În curs" : "Finalizat"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center" onClick={e => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => toast.info("📋 Contract co-broker deschis")}><FileText className="w-3.5 h-3.5" /></Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => toast.info("💬 Chat partener deschis")}><MessageSquare className="w-3.5 h-3.5" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            {/* Perf chart */}
            <Card>
              <CardHeader className="py-3 px-4 border-b border-subtle"><CardTitle className="text-sm font-['Syne']">📈 Performanță Colaborări</CardTitle></CardHeader>
              <CardContent className="p-4">
                <p className="text-[11.5px] text-dim mb-3">Colaborări finalizate pe lună</p>
                <div className="flex items-end gap-2 h-[100px]">
                  {PERF_MONTHS.map((m, i) => (
                    <div key={m.month} className="flex flex-col items-center gap-1.5 flex-1">
                      <span className="font-['Syne'] text-[11px] font-bold text-gold">{m.val}</span>
                      <div className={`w-full rounded-t transition-all cursor-pointer hover:opacity-70 ${i === PERF_MONTHS.length - 1 ? "bg-gradient-to-t from-[hsl(var(--gold))] to-[hsl(var(--gold2))]" : "bg-gold-dim"}`}
                        style={{ height: `${(m.val / maxPerf) * 70 + 10}px` }}
                        onClick={() => toast.info(`${m.month}: ${m.val} colaborări finalizate`)} />
                      <span className="text-[10px] text-dim">{m.month}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top partners */}
            <Card>
              <CardHeader className="py-3 px-4 border-b border-subtle"><CardTitle className="text-sm font-['Syne']">🏆 Top Parteneri după Comision</CardTitle></CardHeader>
              <CardContent className="p-0">
                {TOP_PARTNERS.map((p, i) => {
                  const colors = ["text-gold", "text-info-blue", "text-teal", "text-purple"];
                  const bgs = ["bg-gold-dim", "bg-blue-dim", "bg-teal-dim", "bg-purple-dim"];
                  return (
                    <div key={p.name} className="flex items-center gap-3 px-4 py-3 border-b border-subtle/30">
                      <div className={`w-7 h-7 rounded-[7px] ${bgs[i]} flex items-center justify-center text-xs font-extrabold font-['Syne'] ${colors[i]}`}>{i + 1}</div>
                      <span className="flex-1 text-[13px] font-medium">{p.name}</span>
                      <span className="text-xs text-dim mr-2.5">{p.deals} deal-uri</span>
                      <span className="font-['Syne'] text-[13px] font-bold text-gold">{p.value}</span>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* TAB: REGULI CO-BROKER */}
        <TabsContent value="reguli" className="space-y-4 animate-fade-up">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="py-3 px-4 border-b border-subtle flex-row items-center justify-between">
                <CardTitle className="text-sm font-['Syne']">📋 Reguli Implicite Co-broker</CardTitle>
                <Button variant="outline" size="sm" className="text-xs h-8" onClick={() => toast.success("✅ Reguli salvate")}>💾 Salvează</Button>
              </CardHeader>
              <CardContent className="p-0">
                {RULES.map((r, i) => (
                  <div key={i} className="flex items-center gap-3 px-4 py-3.5 border-b border-subtle/30">
                    <div className={`w-[34px] h-[34px] rounded-lg ${r.bgClass} flex items-center justify-center ${r.colorClass}`}>{r.icon}</div>
                    <span className="flex-1 text-[13px] font-medium">{r.label}</span>
                    <span className={`font-['Syne'] text-[13px] font-bold ${r.colorClass}`}>{r.value}</span>
                    <div className="flex items-center gap-2 ml-2">
                      <Switch checked={ruleToggles[i]} onCheckedChange={v => { const t = [...ruleToggles]; t[i] = v; setRuleToggles(t); }} />
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => toast.info("✏️ Editare regulă activată")}>✏️</Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="py-3 px-4 border-b border-subtle"><CardTitle className="text-sm font-['Syne']">🔧 Reguli per Agenție</CardTitle></CardHeader>
              <CardContent className="p-0">
                {agencies.filter(a => a.status === "connected").slice(0, 5).map(ag => (
                  <div key={ag.id} className="flex items-center gap-3 px-4 py-3.5 border-b border-subtle/30">
                    <div className="w-8 h-8 rounded-[7px] flex items-center justify-center text-[11px] font-bold font-['Syne'] border"
                      style={{ color: ag.color, background: `${ag.color}20`, borderColor: `${ag.color}30` }}>{ag.initials}</div>
                    <span className="flex-1 text-[13px] font-medium">{ag.name}</span>
                    <Select defaultValue="50" onValueChange={() => toast.success(`✅ Regulă actualizată pentru ${ag.name}`)}>
                      <SelectTrigger className="h-7 text-[11px] w-24"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="50">50/50</SelectItem>
                        <SelectItem value="60">60/40</SelectItem>
                        <SelectItem value="40">40/60</SelectItem>
                        <SelectItem value="70">70/30</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* T&C */}
            <Card className="col-span-2">
              <CardHeader className="py-3 px-4 border-b border-subtle"><CardTitle className="text-sm font-['Syne']">📜 Termeni & Condiții MLS</CardTitle></CardHeader>
              <CardContent className="p-5">
                <div className="bg-surface2 border border-subtle rounded-lg p-4 text-[13px] text-dim leading-relaxed max-h-[180px] overflow-y-auto">
                  <p className="font-semibold text-foreground mb-2.5">Acordul de Co-broking SocietyHUB MLS</p>
                  <p className="mb-2">1. Agenția care introduce proprietatea în MLS (listing agent) și agenția care aduce cumpărătorul (selling agent) vor împărți comisionul conform regulilor stabilite bilateral.</p>
                  <p className="mb-2">2. Split-ul implicit este 50/50, dar poate fi modificat individual pentru fiecare agenție parteneră.</p>
                  <p className="mb-2">3. Proprietățile partajate sunt vizibile tuturor membrilor MLS și pot fi promovate de agenții partenere.</p>
                  <p className="mb-2">4. Orice modificare de preț sau retragere a proprietății trebuie notificată partenerilor în maxim 24h.</p>
                  <p>5. Disputele privind comisionul vor fi mediate de SocietyHUB în conformitate cu reglementările ANAIIMM.</p>
                </div>
                <div className="flex gap-2.5 mt-3.5">
                  <Button size="sm" onClick={() => toast.success("✅ Termeni acceptați și semnați digital")}>✍️ Acceptă & Semnează</Button>
                  <Button variant="outline" size="sm" onClick={() => toast.info("📄 PDF generat")}><Download className="w-3.5 h-3.5" />Descarcă PDF</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* INVITE MODAL */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-['Syne']">➕ Invită Agenție Parteneră</DialogTitle>
            <DialogDescription>Trimite o invitație de colaborare în rețeaua MLS</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div><Label className="text-xs">Nume Agenție</Label><Input placeholder="ex: Imobiliare Nordului SRL" /></div>
            <div><Label className="text-xs">Email Contact</Label><Input type="email" placeholder="contact@agentie.ro" /></div>
            <div><Label className="text-xs">Oraș / Regiune</Label><Input placeholder="ex: Cluj-Napoca" /></div>
            <div>
              <Label className="text-xs">Split Implicit (%)</Label>
              <Select defaultValue="50">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="50">50/50 — Split egal</SelectItem>
                  <SelectItem value="60">60/40 — Favorizat listing</SelectItem>
                  <SelectItem value="40">40/60 — Favorizat selling</SelectItem>
                  <SelectItem value="70">70/30</SelectItem>
                  <SelectItem value="custom">Custom — Stabilit la fiecare tranzacție</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteOpen(false)}>Anulează</Button>
            <Button onClick={() => { setInviteOpen(false); toast.success("📨 Invitație trimisă! Agenția va fi notificată prin email."); }}><Send className="w-3.5 h-3.5" />Trimite Invitație</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
