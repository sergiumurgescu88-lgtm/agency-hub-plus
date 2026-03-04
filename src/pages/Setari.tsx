import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  Save, Upload, Trash2, Plus, Edit, Download, Zap, AlertTriangle
} from "lucide-react";

// ── DATA ──
interface Agent {
  id: number; name: string; email: string; role: "admin" | "senior" | "junior";
  phone: string; deals: number; initials: string; color: string;
}

const INITIAL_AGENTS: Agent[] = [
  { id: 1, name: "Andrei Ionescu", email: "andrei@societyhub.ro", role: "admin", phone: "+40 721 111 111", deals: 24, initials: "AI", color: "hsl(var(--gold))" },
  { id: 2, name: "Maria Constantin", email: "maria@societyhub.ro", role: "senior", phone: "+40 721 222 222", deals: 18, initials: "MC", color: "hsl(var(--blue))" },
  { id: 3, name: "Radu Popescu", email: "radu@societyhub.ro", role: "senior", phone: "+40 721 333 333", deals: 15, initials: "RP", color: "hsl(var(--teal))" },
  { id: 4, name: "Elena Gheorghiu", email: "elena@societyhub.ro", role: "junior", phone: "+40 721 444 444", deals: 7, initials: "EG", color: "hsl(var(--purple))" },
];

interface Integration {
  name: string; desc: string; icon: string; status: boolean;
}

const INITIAL_INTEGRATIONS: Integration[] = [
  { name: "imobiliare.ro", desc: "Publicare automată anunțuri pe cel mai mare portal din RO", icon: "🏠", status: true },
  { name: "Storia.ro", desc: "Sync proprietăți cu platforma Storia", icon: "🏡", status: true },
  { name: "OLX Imobiliare", desc: "Publicare pe OLX cu foto și descriere auto-generate", icon: "🔶", status: false },
  { name: "WhatsApp Business", desc: "API oficial Meta pentru campanii și notificări WA", icon: "💬", status: true },
  { name: "Google Calendar", desc: "Sincronizare vizionări și întâlniri cu Google Calendar", icon: "📅", status: true },
  { name: "Gmail / Email SMTP", desc: "Trimite emailuri din CRM cu contul tău de email", icon: "📧", status: true },
  { name: "DocuSign", desc: "Semnătură electronică validă juridic pentru contracte", icon: "✍️", status: false },
  { name: "Sage / SmartBill", desc: "Export facturi și integrare cu softul de contabilitate", icon: "🧾", status: false },
];

interface Notif {
  name: string; desc: string; icon: string; on: boolean;
}

const INITIAL_NOTIFS: Notif[] = [
  { name: "Lead nou în pipeline", desc: "Alertă când un lead nou este adăugat", icon: "🎯", on: true },
  { name: "Ofertă primită", desc: "Notificare instant la primirea unei oferte", icon: "💰", on: true },
  { name: "Contract în așteptare", desc: "Reminder pentru contracte nesemnate > 24h", icon: "📝", on: true },
  { name: "Vizionare confirmată", desc: "Confirmare client pentru vizionare programată", icon: "📅", on: true },
  { name: "Comision încasat", desc: "Alertă la recepționarea plății unui comision", icon: "✅", on: true },
  { name: "Contract expirat", desc: "Avertizare când un contract de exclusivitate expiră", icon: "⏰", on: true },
  { name: "Raport săptămânal", desc: "Rezumat automat al activității lunea dimineața", icon: "📊", on: false },
  { name: "Newsletter SocietyHUB", desc: "Noutăți produs și tips & tricks", icon: "📰", on: false },
];

const NAV_SECTIONS = [
  { section: "Agenție", items: [
    { key: "profil", icon: "🏢", label: "Profil Agenție" },
    { key: "branding", icon: "🎨", label: "Branding" },
  ]},
  { section: "Echipă", items: [
    { key: "agenti", icon: "👤", label: "Agenți & Roluri" },
    { key: "target", icon: "🎯", label: "Targete" },
  ]},
  { section: "Sistem", items: [
    { key: "integrari", icon: "🔌", label: "Integrări" },
    { key: "notificari", icon: "🔔", label: "Notificări" },
    { key: "securitate", icon: "🔒", label: "Securitate" },
    { key: "facturare", icon: "💳", label: "Plan & Facturare" },
  ]},
];

const THEMES = [
  { name: "Gold", from: "hsl(var(--gold))", to: "hsl(var(--gold2))" },
  { name: "Blue", from: "hsl(var(--blue))", to: "hsl(217 85% 78%)" },
  { name: "Green", from: "hsl(var(--teal))", to: "hsl(165 87% 63%)" },
  { name: "Purple", from: "hsl(var(--purple))", to: "hsl(270 70% 85%)" },
  { name: "Red", from: "hsl(var(--red))", to: "hsl(0 100% 82%)" },
  { name: "Orange", from: "hsl(24 90% 60%)", to: "hsl(24 90% 75%)" },
];

const SESSIONS = [
  { dev: "Chrome — Windows 11", loc: "București, RO", time: "Activ acum", current: true, icon: "🖥️" },
  { dev: "Safari — iPhone 15", loc: "București, RO", time: "Acum 2h", current: false, icon: "📱" },
  { dev: "Firefox — MacBook", loc: "Cluj-Napoca, RO", time: "Ieri, 18:42", current: false, icon: "💻" },
];

const INVOICES = [
  { date: "Mar 2025", amount: "€199", status: "Plătit" },
  { date: "Feb 2025", amount: "€199", status: "Plătit" },
  { date: "Ian 2025", amount: "€199", status: "Plătit" },
  { date: "Dec 2024", amount: "€199", status: "Plătit" },
];

// ── MAIN COMPONENT ──
export default function Setari() {
  const [activeSection, setActiveSection] = useState("profil");
  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS);
  const [integrations, setIntegrations] = useState<Integration[]>(INITIAL_INTEGRATIONS);
  const [notifs, setNotifs] = useState<Notif[]>(INITIAL_NOTIFS);
  const [selectedTheme, setSelectedTheme] = useState(0);
  const [customFields, setCustomFields] = useState(["Tip escalator (bloc)", "Certificat energetic", "An construcție"]);
  const [addAgentOpen, setAddAgentOpen] = useState(false);
  const [sessions, setSessions] = useState(SESSIONS);

  const changeRole = (id: number, role: "admin" | "senior" | "junior") => {
    setAgents(prev => prev.map(a => a.id === id ? { ...a, role } : a));
    const ag = agents.find(a => a.id === id);
    toast.success(`✅ Rol actualizat: ${ag?.name} → ${role}`);
  };

  const removeAgent = (id: number) => {
    const ag = agents.find(a => a.id === id);
    setAgents(prev => prev.filter(a => a.id !== id));
    toast.info(`🗑️ Agent ${ag?.name} eliminat din echipă`);
  };

  const toggleIntegration = (i: number) => {
    setIntegrations(prev => prev.map((ig, idx) => idx === i ? { ...ig, status: !ig.status } : ig));
    const ig = integrations[i];
    toast[ig.status ? "info" : "success"](`${!ig.status ? "✅ Conectat" : "🔌 Deconectat"}: ${ig.name}`);
  };

  const toggleNotif = (i: number) => {
    setNotifs(prev => prev.map((n, idx) => idx === i ? { ...n, on: !n.on } : n));
    const n = notifs[i];
    toast.info(`🔔 ${n.name} — ${!n.on ? "activat" : "dezactivat"}`);
  };

  const roleBadge = (role: string) => {
    const cfg: Record<string, { cls: string; label: string }> = {
      admin: { cls: "bg-gold-dim text-gold", label: "👑 Admin" },
      senior: { cls: "bg-blue-dim text-info-blue", label: "⭐ Senior" },
      junior: { cls: "bg-teal-dim text-teal", label: "🌱 Junior" },
    };
    const c = cfg[role] || cfg.junior;
    return <Badge className={`${c.cls} border-0 text-[11px]`}>{c.label}</Badge>;
  };

  const renderSection = () => {
    switch (activeSection) {
      case "profil": return <ProfilSection />;
      case "branding": return (
        <BrandingSection
          selectedTheme={selectedTheme} setSelectedTheme={setSelectedTheme}
          customFields={customFields} setCustomFields={setCustomFields}
        />
      );
      case "agenti": return (
        <AgentiSection agents={agents} roleBadge={roleBadge} changeRole={changeRole}
          removeAgent={removeAgent} onAddAgent={() => setAddAgentOpen(true)} />
      );
      case "target": return <TargeteSection agents={agents} />;
      case "integrari": return <IntegrariSection integrations={integrations} toggleIntegration={toggleIntegration} />;
      case "notificari": return <NotificariSection notifs={notifs} toggleNotif={toggleNotif} />;
      case "securitate": return <SecuritateSection sessions={sessions} setSessions={setSessions} />;
      case "facturare": return <FacturareSection />;
      default: return null;
    }
  };

  return (
    <div className="space-y-5 animate-fade-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-['Syne'] text-xl font-extrabold flex items-center gap-2">⚙️ Setări Agenție</h1>
          <p className="text-xs text-dim mt-1">Configurare profil, echipă, integrări și securitate</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => toast.info("🔄 Modificări anulate")}>↩ Anulează</Button>
          <Button size="sm" onClick={() => toast.success("💾 Toate setările au fost salvate cu succes!")}>
            <Save className="w-3.5 h-3.5" />Salvează tot
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-[220px_1fr] gap-4">
        <Card className="sticky top-20 h-fit p-2">
          {NAV_SECTIONS.map(sec => (
            <div key={sec.section}>
              <p className="text-[10px] font-bold tracking-wider uppercase text-dim2 px-2.5 pt-3 pb-1">{sec.section}</p>
              {sec.items.map(item => (
                <button key={item.key}
                  onClick={() => setActiveSection(item.key)}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-[7px] text-[13px] transition-all mb-0.5 text-left ${
                    activeSection === item.key
                      ? "bg-gold-dim text-gold font-medium"
                      : "text-dim hover:bg-surface2 hover:text-foreground"
                  }`}>
                  <span>{item.icon}</span>{item.label}
                </button>
              ))}
            </div>
          ))}
        </Card>

        <div className="space-y-4 animate-fade-up" key={activeSection}>
          {renderSection()}
        </div>
      </div>

      <Dialog open={addAgentOpen} onOpenChange={setAddAgentOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-['Syne']">+ Adaugă Agent</DialogTitle>
            <DialogDescription>Completează datele agentului și trimite invitația</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div><Label className="text-xs">Nume complet</Label><Input placeholder="ex: Ana Popescu" /></div>
            <div><Label className="text-xs">Email</Label><Input type="email" placeholder="ana@agentie.ro" /></div>
            <div><Label className="text-xs">Telefon</Label><Input placeholder="+40 7XX XXX XXX" /></div>
            <div>
              <Label className="text-xs">Rol</Label>
              <Select defaultValue="junior">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="senior">Senior</SelectItem>
                  <SelectItem value="junior">Junior</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddAgentOpen(false)}>Anulează</Button>
            <Button onClick={() => { setAddAgentOpen(false); toast.success("📨 Invitație trimisă!"); }}>📨 Trimite Invitație</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ── SECTION: PROFIL ──
function ProfilSection() {
  return (
    <Card>
      <CardHeader className="py-3 px-5 border-b border-subtle flex-row items-center justify-between">
        <div>
          <CardTitle className="text-sm font-['Syne']">🏢 Profil Agenție</CardTitle>
          <p className="text-xs text-dim mt-0.5">Date fiscale și informații de contact</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => toast.success("✅ Profil salvat")}><Save className="w-3.5 h-3.5" />Salvează</Button>
      </CardHeader>
      <CardContent className="p-5 space-y-5">
        <div className="flex items-center gap-5 p-4 bg-surface2 rounded-[10px] border border-subtle">
          <div className="w-[72px] h-[72px] rounded-[14px] bg-gradient-to-br from-[hsl(var(--gold))] to-[hsl(var(--gold2))] flex items-center justify-center font-['Syne'] font-extrabold text-[22px] text-background flex-shrink-0">SH</div>
          <div className="flex-1">
            <p className="font-['Syne'] text-base font-bold mb-1">SocietyHUB Imobiliare</p>
            <p className="text-xs text-dim mb-2.5">CIF: RO12345678 • J40/1234/2020</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="text-xs" onClick={() => toast.info("📁 Upload logo activ")}><Upload className="w-3 h-3" />Schimbă logo</Button>
              <Button variant="outline" size="sm" className="text-xs" onClick={() => toast.info("🗑️ Logo eliminat")}><Trash2 className="w-3 h-3" />Elimină</Button>
            </div>
          </div>
          <div className="text-right">
            <Badge className="bg-teal-dim text-teal border-0 text-xs">✓ Verificat</Badge>
            <p className="text-[11px] text-dim mt-1">Plan: <strong className="text-gold">Professional</strong></p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><Label className="text-[11px] uppercase tracking-wider text-dim">Denumire Firmă</Label><Input defaultValue="SocietyHUB Imobiliare SRL" /></div>
          <div><Label className="text-[11px] uppercase tracking-wider text-dim">CIF / CUI</Label><Input defaultValue="RO12345678" /></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><Label className="text-[11px] uppercase tracking-wider text-dim">Nr. Registrul Comerțului</Label><Input defaultValue="J40/1234/2020" /></div>
          <div><Label className="text-[11px] uppercase tracking-wider text-dim">IBAN</Label><Input defaultValue="RO49 AAAA 1B31 0075 9384 0000" /></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><Label className="text-[11px] uppercase tracking-wider text-dim">Telefon</Label><Input defaultValue="+40 721 000 000" /></div>
          <div><Label className="text-[11px] uppercase tracking-wider text-dim">Email contact</Label><Input type="email" defaultValue="contact@societyhub.ro" /></div>
        </div>
        <div><Label className="text-[11px] uppercase tracking-wider text-dim">Adresă sediu</Label><Input defaultValue="Str. Floreasca 14, Sector 2, București, 014453" /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><Label className="text-[11px] uppercase tracking-wider text-dim">Website</Label><Input defaultValue="https://societyhub.ro" /></div>
          <div><Label className="text-[11px] uppercase tracking-wider text-dim">Cod CAEN</Label><Input defaultValue="6831 — Activități imobiliare pe baze de comision" /></div>
        </div>
      </CardContent>
    </Card>
  );
}

// ── SECTION: BRANDING ──
function BrandingSection({ selectedTheme, setSelectedTheme, customFields, setCustomFields }: {
  selectedTheme: number; setSelectedTheme: (n: number) => void;
  customFields: string[]; setCustomFields: (f: string[]) => void;
}) {
  return (
    <Card>
      <CardHeader className="py-3 px-5 border-b border-subtle flex-row items-center justify-between">
        <div>
          <CardTitle className="text-sm font-['Syne']">🎨 Branding & Personalizare</CardTitle>
          <p className="text-xs text-dim mt-0.5">Culori, template-uri și câmpuri custom</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => toast.success("🎨 Branding salvat")}><Save className="w-3.5 h-3.5" />Salvează</Button>
      </CardHeader>
      <CardContent className="p-5 space-y-5">
        <div>
          <Label className="text-[11px] uppercase tracking-wider text-dim">Culoare principală</Label>
          <div className="flex gap-2.5 mt-2 flex-wrap">
            {THEMES.map((t, i) => (
              <button key={t.name} title={t.name}
                onClick={() => { setSelectedTheme(i); toast.info(`🎨 Temă ${t.name} aplicată — salvați pentru a păstra modificările`); }}
                className={`w-9 h-9 rounded-[9px] transition-all flex-shrink-0 ${selectedTheme === i ? "ring-2 ring-foreground scale-110" : "hover:scale-105"}`}
                style={{ background: `linear-gradient(135deg, ${t.from}, ${t.to})` }} />
            ))}
            <button className="w-9 h-9 rounded-[9px] border border-dashed border-subtle2 flex items-center justify-center text-sm text-dim hover:text-foreground"
              onClick={() => toast.info("🎨 Color picker deschis")}>+</button>
          </div>
          <p className="text-[11px] text-dim mt-2">Culoarea selectată va fi aplicată în header, butoane și accente din întreg CRM-ul.</p>
        </div>
        <div>
          <Label className="text-[11px] uppercase tracking-wider text-dim">Template email implicit</Label>
          <Select defaultValue="dark" onValueChange={() => toast.info("📧 Template selectat")}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="dark">SocietyHUB Dark — Default</SelectItem>
              <SelectItem value="white">Minimal White</SelectItem>
              <SelectItem value="blue">Corporate Blue</SelectItem>
              <SelectItem value="custom">Custom — Upload HTML</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-[11px] uppercase tracking-wider text-dim">Semnătură email</Label>
          <Textarea className="mt-1.5" rows={4} defaultValue={`Andrei Ionescu | Agent Senior\nSocietyHUB Imobiliare SRL\nTel: +40 721 000 000 | www.societyhub.ro`} />
        </div>
        <div>
          <Label className="text-[11px] uppercase tracking-wider text-dim">Câmpuri custom proprietăți</Label>
          <div className="space-y-2 mt-2">
            {customFields.map((f, i) => (
              <div key={i} className="flex gap-2">
                <Input defaultValue={f} className="flex-1" />
                <Button variant="outline" size="icon" className="h-10 w-10 text-danger hover:text-danger flex-shrink-0"
                  onClick={() => { setCustomFields(customFields.filter((_, idx) => idx !== i)); toast.info("🗑️ Câmp eliminat"); }}>
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            ))}
          </div>
          <Button variant="outline" size="sm" className="mt-2 text-xs" onClick={() => setCustomFields([...customFields, ""])}>
            <Plus className="w-3 h-3" />Adaugă câmp
          </Button>
        </div>
        <div>
          <Label className="text-[11px] uppercase tracking-wider text-dim">Watermark fotografii</Label>
          <div className="flex items-center gap-3 mt-2">
            <div className="w-[100px] h-[60px] bg-surface2 border border-subtle rounded-lg flex items-center justify-center text-[11px] text-dim">Previzualizare</div>
            <div>
              <Button variant="outline" size="sm" className="text-xs mb-1.5" onClick={() => toast.info("📁 Upload watermark")}><Upload className="w-3 h-3" />Upload logo watermark</Button>
              <p className="text-[11px] text-dim">Recomandat: PNG transparent, 300x100px</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ── SECTION: AGENTI ──
function AgentiSection({ agents, roleBadge, changeRole, removeAgent, onAddAgent }: {
  agents: Agent[]; roleBadge: (r: string) => JSX.Element;
  changeRole: (id: number, role: "admin" | "senior" | "junior") => void;
  removeAgent: (id: number) => void; onAddAgent: () => void;
}) {
  return (
    <Card>
      <CardHeader className="py-3 px-5 border-b border-subtle flex-row items-center justify-between">
        <div>
          <CardTitle className="text-sm font-['Syne']">👤 Management Agenți & Roluri</CardTitle>
          <p className="text-xs text-dim mt-0.5">{agents.length} agenți activi din 10 licențe</p>
        </div>
        <Button size="sm" onClick={onAddAgent}><Plus className="w-3.5 h-3.5" />Adaugă Agent</Button>
      </CardHeader>
      <CardContent className="p-5 space-y-2.5">
        {agents.map(ag => (
          <div key={ag.id} className="flex items-center gap-3.5 p-3.5 bg-surface2 border border-subtle rounded-[10px] hover:border-[hsl(var(--gold)/0.2)] transition-colors">
            <div className="w-10 h-10 rounded-[10px] flex items-center justify-center font-['Syne'] font-bold text-sm flex-shrink-0"
              style={{ color: ag.color, background: `${ag.color}20` }}>{ag.initials}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold">{ag.name}</p>
              <div className="flex items-center gap-2 mt-0.5">
                {roleBadge(ag.role)}
                <span className="text-[11.5px] text-dim truncate">{ag.email}</span>
              </div>
            </div>
            <div className="text-right mr-2">
              <p className="font-['Syne'] text-sm font-bold">{ag.deals}</p>
              <p className="text-[11px] text-dim">tranzacții</p>
            </div>
            <div className="flex gap-1.5">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast.info(`✏️ Editare profil: ${ag.name}`)}><Edit className="w-3.5 h-3.5" /></Button>
              <Select defaultValue={ag.role} onValueChange={v => changeRole(ag.id, v as Agent["role"])}>
                <SelectTrigger className="h-8 text-xs w-[85px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">admin</SelectItem>
                  <SelectItem value="senior">senior</SelectItem>
                  <SelectItem value="junior">junior</SelectItem>
                </SelectContent>
              </Select>
              {ag.id !== 1 && (
                <Button variant="outline" size="icon" className="h-8 w-8 text-danger hover:text-danger" onClick={() => removeAgent(ag.id)}>
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>
          </div>
        ))}
        <div className="flex items-center gap-3 p-3 bg-surface2 rounded-lg border border-subtle mt-2">
          <div className="flex-1">
            <p className="text-[13px] font-medium mb-1">Licențe utilizate</p>
            <Progress value={(agents.length / 10) * 100} className="h-1.5" />
          </div>
          <div className="text-right whitespace-nowrap">
            <span className="font-['Syne'] text-lg font-bold">{agents.length}</span>
            <span className="text-dim text-[13px]"> / 10</span>
          </div>
          <Button variant="outline" size="sm" className="text-xs" onClick={() => toast.info("💳 Upgrade plan pentru mai multe licențe")}>Upgrade →</Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ── SECTION: TARGETE ──
function TargeteSection({ agents }: { agents: Agent[] }) {
  return (
    <Card>
      <CardHeader className="py-3 px-5 border-b border-subtle flex-row items-center justify-between">
        <div>
          <CardTitle className="text-sm font-['Syne']">🎯 Targete Individuale</CardTitle>
          <p className="text-xs text-dim mt-0.5">Setează obiective lunare per agent</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => toast.success("✅ Targete salvate")}><Save className="w-3.5 h-3.5" />Salvează</Button>
      </CardHeader>
      <CardContent className="p-5 space-y-2.5">
        {agents.map(ag => (
          <div key={ag.id} className="flex items-center gap-3.5 p-3.5 bg-surface2 border border-subtle rounded-[10px]">
            <div className="w-9 h-9 rounded-[9px] flex items-center justify-center font-['Syne'] font-bold text-xs flex-shrink-0"
              style={{ color: ag.color, background: `${ag.color}20` }}>{ag.initials}</div>
            <p className="flex-1 text-[13.5px] font-medium">{ag.name}</p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-dim">Tranzacții/lună:</span>
              <Input type="number" defaultValue={ag.deals > 15 ? 5 : ag.deals > 10 ? 4 : 3} className="w-[70px] h-8 text-xs"
                onChange={() => toast.success(`🎯 Target actualizat pentru ${ag.name}`)} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-dim">Comision target:</span>
              <Input defaultValue={`€${ag.deals * 1200}`} className="w-[100px] h-8 text-xs"
                onChange={() => toast.success("💰 Target financiar actualizat")} />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// ── SECTION: INTEGRARI ──
function IntegrariSection({ integrations, toggleIntegration }: { integrations: Integration[]; toggleIntegration: (i: number) => void }) {
  return (
    <Card>
      <CardHeader className="py-3 px-5 border-b border-subtle">
        <CardTitle className="text-sm font-['Syne']">🔌 Integrări</CardTitle>
        <p className="text-xs text-dim mt-0.5">Conectează platformele externe</p>
      </CardHeader>
      <CardContent className="p-0">
        {integrations.map((ig, i) => (
          <div key={ig.name} className="flex items-center gap-3.5 px-5 py-3.5 border-b border-subtle/30 last:border-b-0">
            <div className="w-[38px] h-[38px] rounded-[9px] bg-surface2 flex items-center justify-center text-xl flex-shrink-0">{ig.icon}</div>
            <div className="flex-1">
              <p className="text-sm font-semibold">{ig.name}</p>
              <p className="text-xs text-dim">{ig.desc}</p>
            </div>
            <Badge className={`border-0 text-[11px] ${ig.status ? "bg-teal-dim text-teal" : "bg-surface2 text-dim"}`}>
              {ig.status ? "● Conectat" : "○ Inactiv"}
            </Badge>
            <Button variant={ig.status ? "outline" : "default"} size="sm" className={`text-xs ${ig.status ? "text-danger hover:text-danger" : ""}`}
              onClick={() => toggleIntegration(i)}>
              {ig.status ? "Deconectează" : "Conectează"}
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// ── SECTION: NOTIFICARI ──
function NotificariSection({ notifs, toggleNotif }: { notifs: Notif[]; toggleNotif: (i: number) => void }) {
  return (
    <Card>
      <CardHeader className="py-3 px-5 border-b border-subtle flex-row items-center justify-between">
        <div>
          <CardTitle className="text-sm font-['Syne']">🔔 Notificări</CardTitle>
          <p className="text-xs text-dim mt-0.5">Configurează alertele și reminderele</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => toast.success("✅ Notificări salvate")}><Save className="w-3.5 h-3.5" />Salvează</Button>
      </CardHeader>
      <CardContent className="p-5">
        {notifs.map((n, i) => (
          <div key={n.name} className="flex items-center gap-3.5 py-3 border-b border-subtle/30 last:border-b-0">
            <span className="text-lg">{n.icon}</span>
            <div className="flex-1">
              <p className="text-[13.5px] font-medium">{n.name}</p>
              <p className="text-xs text-dim">{n.desc}</p>
            </div>
            <Switch checked={n.on} onCheckedChange={() => toggleNotif(i)} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// ── SECTION: SECURITATE ──
function SecuritateSection({ sessions, setSessions }: { sessions: typeof SESSIONS; setSessions: (s: typeof SESSIONS) => void }) {
  return (
    <Card>
      <CardHeader className="py-3 px-5 border-b border-subtle">
        <CardTitle className="text-sm font-['Syne']">🔒 Securitate & Acces</CardTitle>
        <p className="text-xs text-dim mt-0.5">Parolă, 2FA și sesiuni active</p>
      </CardHeader>
      <CardContent className="p-5 space-y-3.5">
        <div className="flex items-center gap-3.5 p-4 bg-surface2 border border-subtle rounded-[10px]">
          <span className="text-[28px]">🔑</span>
          <div className="flex-1">
            <p className="text-sm font-semibold">Parolă cont</p>
            <p className="text-xs text-dim">Ultima modificare: acum 45 zile</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => toast.success("📧 Email de resetare parolă trimis")}>Schimbă parola</Button>
        </div>
        <div className="flex items-center gap-3.5 p-4 bg-surface2 border border-[hsl(var(--teal)/0.15)] rounded-[10px]">
          <span className="text-[28px]">📱</span>
          <div className="flex-1">
            <p className="text-sm font-semibold">Autentificare în 2 pași (2FA)</p>
            <p className="text-xs text-teal">✓ Activată — Google Authenticator</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => toast.info("⚙️ Setări 2FA deschise")}>Configurează</Button>
        </div>
        <div className="p-4 bg-surface2 border border-subtle rounded-[10px]">
          <p className="text-sm font-semibold mb-3">💻 Sesiuni active ({sessions.length})</p>
          {sessions.map((s, i) => (
            <div key={i} className="flex items-center gap-3 py-2.5 border-b border-subtle/30 last:border-b-0">
              <span className="text-xl">{s.icon}</span>
              <div className="flex-1">
                <p className="text-[13px] font-medium">{s.dev}</p>
                <p className="text-[11.5px] text-dim">{s.loc} • {s.time}</p>
              </div>
              {s.current ? (
                <Badge className="bg-teal-dim text-teal border-0 text-[11px]">Curentă</Badge>
              ) : (
                <Button variant="outline" size="sm" className="text-xs text-danger hover:text-danger"
                  onClick={() => { setSessions(sessions.filter((_, idx) => idx !== i)); toast.success("🔒 Sesiune deconectată"); }}>
                  Deconectează
                </Button>
              )}
            </div>
          ))}
        </div>
        <div className="p-3.5 bg-red-dim/50 border border-[hsl(var(--red)/0.15)] rounded-[10px]">
          <p className="text-[13px] font-semibold text-danger mb-2 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4" />Zonă periculoasă
          </p>
          <p className="text-xs text-dim mb-3">Acțiunile de mai jos sunt ireversibile. Procedați cu atenție.</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="text-xs text-danger hover:text-danger border-[hsl(var(--red)/0.25)]"
              onClick={() => toast.info("📧 Email de confirmare trimis pentru ștergere date")}>
              <Trash2 className="w-3 h-3" />Ștergere date agenție
            </Button>
            <Button variant="outline" size="sm" className="text-xs text-danger hover:text-danger border-[hsl(var(--red)/0.25)]"
              onClick={() => toast.info("📧 Email confirmare export trimis")}>
              <Download className="w-3 h-3" />Export date GDPR
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ── SECTION: FACTURARE ──
function FacturareSection() {
  return (
    <Card>
      <CardHeader className="py-3 px-5 border-b border-subtle">
        <CardTitle className="text-sm font-['Syne']">💳 Plan & Facturare</CardTitle>
        <p className="text-xs text-dim mt-0.5">Abonament activ și istoricul facturilor</p>
      </CardHeader>
      <CardContent className="p-5 space-y-5">
        <div className="p-5 bg-gradient-to-br from-[hsl(var(--gold)/0.1)] to-[hsl(var(--gold2)/0.05)] border border-[hsl(var(--gold)/0.25)] rounded-xl">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="font-['Syne'] text-xl font-extrabold text-gold">Professional</p>
              <p className="text-[13px] text-dim mt-1">Facturat anual • Reînnoire: 1 Apr 2026</p>
            </div>
            <div className="text-right">
              <span className="font-['Syne'] text-[28px] font-extrabold">€199</span>
              <span className="text-dim">/lună</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2.5 mb-4">
            {[["10", "Licențe agenți"], ["∞", "Proprietăți"], ["∞", "Portale"]].map(([v, l]) => (
              <div key={l} className="bg-[hsl(0_0%_100%/0.05)] rounded-lg p-2.5 text-center">
                <p className="font-['Syne'] text-lg font-bold text-gold">{v}</p>
                <p className="text-[11px] text-dim">{l}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => toast.info("🚀 Pagina upgrade deschisă")}><Zap className="w-3.5 h-3.5" />Upgrade la Enterprise</Button>
            <Button variant="outline" size="sm" onClick={() => toast.info("📋 Detalii plan deschise")}>Compară planuri</Button>
          </div>
        </div>
        <div>
          <p className="font-['Syne'] text-[13px] font-bold mb-3">📄 Facturi recente</p>
          <div className="space-y-1.5">
            {INVOICES.map(f => (
              <div key={f.date} className="flex items-center gap-3 p-3 bg-surface2 rounded-lg">
                <span className="text-sm">🧾</span>
                <span className="flex-1 text-[13px]">Abonament Professional — {f.date}</span>
                <span className="font-['Syne'] text-[13px] font-bold">{f.amount}</span>
                <Badge className="bg-teal-dim text-teal border-0 text-[11px]">{f.status}</Badge>
                <Button variant="ghost" size="sm" className="text-xs" onClick={() => toast.success("📄 Factură descărcată")}>
                  <Download className="w-3 h-3" />PDF
                </Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
