import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

type Channel = "wa" | "email";
type CampStatus = "live" | "done" | "sched" | "draft";
type TabKey = "creator" | "campanii" | "segmentare" | "analytics";
interface Template { id: string; name: string; desc: string; badge: string; badgeText: string; body: string; }
interface Segment { id: string; label: string; count: number; col: string; }
interface Campaign { id: number; name: string; channel: Channel; status: CampStatus; sent: number; opened: number; clicked: number; conv: number; date: string; segment: string; }

const TEMPLATES_WA: Template[] = [
  { id: "wa1", name: "Proprietăți Noi", desc: "Anunță proprietăți noi disponibile", badge: "approved", badgeText: "✓ Aprobat", body: '🏠 *Proprietăți Noi — {{luna}}*\n\nBună ziua, {{prenume}}! 👋\n\nAm adăugat {{nr_prop}} proprietăți noi:\n\n📍 {{titlu_prop}}\n💰 {{pret}}\n📐 {{suprafata}} mp · {{camere}} camere\n\n👉 Vizionare disponibilă imediat!' },
  { id: "wa2", name: "Follow-up Vizionare", desc: "Mesaj post-vizionare pentru feedback", badge: "approved", badgeText: "✓ Aprobat", body: 'Bună ziua, {{prenume}}! 😊\n\nMulțumim că ați vizitat *{{prop_titlu}}* astăzi.\n\nCum vi s-a părut proprietatea? 📞' },
  { id: "wa3", name: "Ofertă Exclusivă", desc: "Campanie urgency pentru oferte limitate", badge: "approved", badgeText: "✓ Aprobat", body: '⚡ *OFERTĂ LIMITATĂ*\n\n{{prenume}}, proprietatea s-a redus cu *{{reducere}}%*!\n\n🏡 {{prop_titlu}}\n💰 *{{pret_nou}}*\n📍 {{zona}}\n\nApasă *Rezervă Acum*!' },
  { id: "wa4", name: "Reminder Vizionare", desc: "Confirmare și reminder vizionare", badge: "approved", badgeText: "✓ Aprobat", body: '📅 *Reminder: Vizionare Mâine*\n\n{{prenume}}, vizionare programată:\n\n🏠 {{prop_titlu}}\n📍 {{adresa}}\n🕐 *{{data}}, ora {{ora}}*\n🧑‍💼 Agent: {{agent_nume}}' },
];
const TEMPLATES_EMAIL: Template[] = [
  { id: "em1", name: "Newsletter Săptămânal", desc: "Proprietăți noi + știri piață", badge: "email", badgeText: "📧 Email", body: 'Subiect: 🏠 {{nr_prop}} Proprietăți Noi | SocietyHUB\n\nBună ziua, {{prenume}},\n\nRezumatul săptămânii tale imobiliare este gata!\n\nEchipa SocietyHUB' },
  { id: "em2", name: "Ofertă Personalizată", desc: "Email one-to-one cu proprietăți potrivite", badge: "email", badgeText: "📧 Email", body: 'Subiect: 🎯 Proprietatea perfectă pentru tine, {{prenume}}!\n\nAm identificat {{nr_prop}} proprietăți care corespund criteriilor tale.\n\nVezi proprietățile →' },
  { id: "em3", name: "Drip Follow-up D+3", desc: "Secvență automată la 3 zile după lead", badge: "email", badgeText: "📧 Email", body: 'Subiect: {{prenume}}, mai avem câteva întrebări 🏡\n\nAi 2 minute pentru un scurt chestionar?' },
  { id: "em4", name: "Reactivare Lead Rece", desc: "Reactivează contactele inactive 30+ zile", badge: "email", badgeText: "📧 Email", body: 'Subiect: {{prenume}}, piața s-a schimbat\n\nPrețurile în zona {{zona}} au scăzut cu {{procent}}%.' },
];
const SEGMENTS: Segment[] = [
  { id: "all", label: "Toți clienții", count: 128, col: "hsl(40,100%,47%)" },
  { id: "buy100", label: "Buget 100K+", count: 42, col: "hsl(165,87%,43%)" },
  { id: "rent", label: "Chiriași activi", count: 35, col: "hsl(217,85%,65%)" },
  { id: "cold", label: "Leads reci", count: 28, col: "hsl(0,100%,69%)" },
  { id: "hot", label: "Leads calde", count: 18, col: "hsl(45,100%,50%)" },
  { id: "zona1", label: "Floreasca/Aviator", count: 31, col: "hsl(270,70%,75%)" },
  { id: "zona2", label: "Pipera/Băneasa", count: 24, col: "hsl(160,80%,50%)" },
  { id: "viz", label: "Post-vizionare", count: 19, col: "hsl(340,80%,65%)" },
];
const SEED_CAMPAIGNS: Campaign[] = [
  { id: 1, name: "Proprietăți Noi Floreasca — Feb", channel: "wa", status: "done", sent: 94, opened: 79, clicked: 22, conv: 8, date: "28 Feb 2025", segment: "Floreasca/Aviator" },
  { id: 2, name: "Newsletter Săptămânal #12", channel: "email", status: "done", sent: 128, opened: 41, clicked: 18, conv: 5, date: "24 Feb 2025", segment: "Toți clienții" },
  { id: 3, name: "Ofertă Exclusivă Penthouse", channel: "wa", status: "done", sent: 42, opened: 38, clicked: 19, conv: 4, date: "20 Feb 2025", segment: "Buget 100K+" },
  { id: 4, name: "Reactivare Lead-uri Reci", channel: "email", status: "done", sent: 28, opened: 9, clicked: 3, conv: 1, date: "18 Feb 2025", segment: "Leads reci" },
  { id: 5, name: "Reminder Vizionări — 5 Mar", channel: "wa", status: "sched", sent: 0, opened: 0, clicked: 0, conv: 0, date: "05 Mar 2025", segment: "Post-vizionare" },
  { id: 6, name: "Newsletter Săptămânal #13", channel: "email", status: "sched", sent: 0, opened: 0, clicked: 0, conv: 0, date: "07 Mar 2025", segment: "Toți clienții" },
  { id: 7, name: "Drip Follow-up Noi Leads", channel: "email", status: "live", sent: 14, opened: 11, clicked: 6, conv: 2, date: "04 Mar 2025", segment: "Leads calde" },
  { id: 8, name: "Proprietăți Zona Pipera", channel: "wa", status: "draft", sent: 0, opened: 0, clicked: 0, conv: 0, date: "—", segment: "Pipera/Băneasa" },
];
const STATUS_META: Record<CampStatus, { label: string; cls: string }> = {
  live: { label: "Live", cls: "bg-[hsla(142,70%,60%,.12)] text-teal" },
  done: { label: "Finalizat", cls: "bg-surface2 text-dim" },
  sched: { label: "Programat", cls: "bg-[hsla(45,100%,50%,.12)] text-[hsl(45,100%,50%)]" },
  draft: { label: "Draft", cls: "bg-purple-dim text-purple" },
};
const WA_VARS = ["{{prenume}}", "{{prop_titlu}}", "{{pret}}", "{{zona}}", "{{suprafata}}", "{{camere}}", "{{data}}", "{{ora}}", "{{agent_nume}}", "{{luna}}"];
const EMAIL_VARS = ["{{prenume}}", "{{prop_titlu}}", "{{nr_prop}}", "{{buget}}", "{{zona}}", "{{data}}", "{{procent}}"];
const WA_SEND_STEPS = ["🔗 Conectare WhatsApp Business API…", "✅ Token validat", "📋 Se procesează template-ul…", "🎯 Segmentare audiență…", "📤 Se trimit mesajele…", "📊 Se înregistrează analytics…", "🎉 Campanie lansată cu succes!"];
const EM_SEND_STEPS = ["📧 Conectare server SMTP…", "✅ Autentificare SPF/DKIM", "📋 Se compilează HTML email…", "🎯 Segmentare audiență…", "📨 Se trimit email-urile…", "📊 Se înregistrează analytics…", "🎉 Campanie lansată cu succes!"];

function WaPreview({ text }: { text: string }) {
  const formatted = text.replace(/\*([^*]+)\*/g, "<strong>$1</strong>").replace(/_([^_]+)_/g, "<em>$1</em>").replace(/\n/g, "<br>");
  return (
    <div className="bg-[#1a1a2e] border-[8px] border-[#2d2d4e] rounded-[36px] w-[220px] mx-auto overflow-hidden shadow-2xl">
      <div className="bg-[#111] px-4 pt-2 pb-1 flex justify-center"><div className="w-[60px] h-[18px] bg-[#222] rounded-b-xl" /></div>
      <div className="bg-[#0d1117] min-h-[320px]">
        <div className="bg-[#1f2c34] px-3 py-2.5 flex items-center gap-2">
          <div className="w-[34px] h-[34px] rounded-full bg-[#25d366] flex items-center justify-center text-[13px] font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>SH</div>
          <div><div className="text-[12px] font-semibold text-[#e9edef]">SocietyHUB</div><div className="text-[10px] text-[#8696a0]">online</div></div>
        </div>
        <div className="p-2 flex flex-col gap-2">
          <div className="max-w-[85%] self-end bg-[#005c4b] rounded-lg rounded-br-none px-2.5 py-1.5 relative pb-4">
            <div className="w-full h-[60px] bg-gradient-to-br from-[#1e3a2f] to-[#0d2918] rounded flex items-center justify-center text-[22px] mb-1.5">🏠</div>
            <div className="text-[11px] leading-relaxed text-[#e9edef]" dangerouslySetInnerHTML={{ __html: formatted.slice(0, 200) }} />
            <div className="text-center text-[10.5px] text-[#25d366] font-semibold mt-1.5 pt-1.5 border-t border-white/10">🔗 Detalii Proprietate</div>
            <div className="absolute bottom-1 right-2 text-[9px] text-[rgba(37,211,102,.7)]">09:14 ✓✓</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmailPreview({ text }: { text: string }) {
  const lines = text.split("\n").filter(l => l.trim());
  const subj = (lines[0] || "Subiect email").replace(/^Subiect:\s*/i, "");
  const body = lines.slice(1).join(" ").slice(0, 120) || "Conținut email…";
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg">
      <div className="bg-[#1a1a2e] px-4 py-3">
        <div className="text-[11px] text-white/70">De la: contact@societyhub.ro</div>
        <div className="text-[12px] font-semibold text-white mt-0.5">{subj.slice(0, 45)}</div>
      </div>
      <div className="p-4 bg-[#f8f9fa]">
        <div className="bg-white rounded-lg overflow-hidden shadow-sm mb-2.5">
          <div className="h-[70px] bg-gradient-to-br from-[#0a0b0f] to-[#1e2330] flex items-center justify-center gap-2">
            <span className="text-[16px] font-extrabold text-[hsl(40,100%,47%)]" style={{ fontFamily: "'Syne', sans-serif" }}>Society</span>
            <span className="text-[16px] font-extrabold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>HUB</span>
          </div>
          <div className="p-3">
            <div className="text-[13px] font-bold text-[#1a1a2e] mb-1">{subj.slice(0, 55)}</div>
            <div className="text-[11px] text-[#555] leading-relaxed">{body}</div>
          </div>
          <div className="mx-3 mb-3 py-2 bg-[hsl(40,100%,47%)] rounded-md text-center text-[12px] font-bold text-[#0a0b0f]">🏠 Vezi Proprietățile</div>
        </div>
      </div>
    </div>
  );
}

function FunnelRow({ label, pct, value, color }: { label: string; pct: number; value: string; color: string }) {
  return (
    <div className="flex items-center gap-2.5 mb-2">
      <div className="w-[80px] text-[12px] text-dim text-right">{label}</div>
      <div className="flex-1 h-[28px] bg-surface2 rounded-md overflow-hidden">
        <div className="h-full rounded-md flex items-center px-2.5 text-[11.5px] font-semibold transition-all duration-700" style={{ width: `${pct}%`, background: `${color}33`, color }}>{pct > 15 ? `~${pct}%` : ""}</div>
      </div>
      <div className="w-[50px] text-right font-bold text-[13px]" style={{ fontFamily: "'Syne', sans-serif", color }}>{value}</div>
    </div>
  );
}

function SendOverlay({ show, channel, name, onDone }: { show: boolean; channel: Channel; name: string; onDone: () => void }) {
  const [step, setStep] = useState(-1);
  const [finished, setFinished] = useState(false);
  const steps = channel === "wa" ? WA_SEND_STEPS : EM_SEND_STEPS;
  useEffect(() => {
    if (!show) { setStep(-1); setFinished(false); return; }
    let i = 0;
    const run = () => { setStep(i); i++; if (i < steps.length) setTimeout(run, 650); else setTimeout(() => { setFinished(true); setTimeout(onDone, 1200); }, 700); };
    setTimeout(run, 300);
  }, [show]);
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[300] flex flex-col items-center justify-center gap-4 animate-fade-up">
      <div className="text-[18px] font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>{finished ? "🎉 Campanie lansată cu succes!" : `${channel === "wa" ? "📱" : "📧"} Se lansează "${name}"…`}</div>
      {!finished && <div className="w-16 h-16 border-[3px] border-subtle2 border-t-gold rounded-full animate-spin" />}
      <div className="flex flex-col gap-1.5 min-w-[280px]">
        {steps.map((s, i) => i <= step && (
          <div key={i} className={`text-[13px] px-3 py-1.5 rounded-md transition-all ${i < step ? (channel === "wa" ? "text-[#25d366]" : "text-teal") : "bg-[hsla(40,100%,47%,.1)] text-foreground"}`}>{i < step ? "✓ " : ""}{s}</div>
        ))}
      </div>
    </div>
  );
}

export default function Campanii() {
  const [tab, setTab] = useState<TabKey>("creator");
  const [channel, setChannel] = useState<Channel>("wa");
  const [campaigns, setCampaigns] = useState<Campaign[]>(SEED_CAMPAIGNS);
  const [activeSegs, setActiveSegs] = useState<Set<string>>(new Set());
  const [activeTpl, setActiveTpl] = useState("wa1");
  const [msgText, setMsgText] = useState(TEMPLATES_WA[0].body);
  const [campaignName, setCampaignName] = useState("🏠 Proprietăți Noi Floreasca — Martie 2025");
  const [schedNow, setSchedNow] = useState(true);
  const [sending, setSending] = useState(false);
  const [campSearch, setCampSearch] = useState("");
  const [campChFilter, setCampChFilter] = useState("");
  const [campStFilter, setCampStFilter] = useState("");
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailCamp, setDetailCamp] = useState<Campaign | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  const templates = channel === "wa" ? TEMPLATES_WA : TEMPLATES_EMAIL;
  const vars = channel === "wa" ? WA_VARS : EMAIL_VARS;
  const isWa = channel === "wa";
  const openRate = isWa ? 84 : 32;
  const clickRate = isWa ? 24 : 8;
  const maxChar = isWa ? 1024 : 5000;

  const audienceCount = useMemo(() => {
    let total = 0;
    activeSegs.forEach(id => { const s = SEGMENTS.find(x => x.id === id); if (s) total += s.count; });
    return Math.min(total, 128);
  }, [activeSegs]);

  const switchChannel = (ch: Channel) => {
    setChannel(ch);
    const tpls = ch === "wa" ? TEMPLATES_WA : TEMPLATES_EMAIL;
    setActiveTpl(tpls[0].id);
    setMsgText(tpls[0].body);
    if (editorRef.current) editorRef.current.innerText = tpls[0].body;
  };

  const selectTemplate = (id: string) => {
    const tpl = templates.find(t => t.id === id);
    if (!tpl) return;
    setActiveTpl(id); setMsgText(tpl.body);
    if (editorRef.current) editorRef.current.innerText = tpl.body;
    toast.info(`📄 Template ${tpl.name} încărcat`);
  };

  const toggleSeg = (id: string) => setActiveSegs(prev => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next; });
  const insertVar = (v: string) => { setMsgText(prev => prev + v); if (editorRef.current) { editorRef.current.focus(); document.execCommand("insertText", false, v); } };
  const insertEmoji = (e: string) => { setMsgText(prev => prev + e); if (editorRef.current) { editorRef.current.focus(); document.execCommand("insertText", false, e); } };

  const aiGenerate = () => {
    setAiLoading(true);
    setTimeout(() => {
      const msg = isWa
        ? '🏠 *Proprietăți Exclusive — Floreasca*\n\nBună {{prenume}}! 👋\n\nAm găsit *3 proprietăți noi*:\n\n📍 Apartament 3 camere, Str. Dorobanților\n💰 *€185,000* · 78mp\n\n👉 Răspunde DA pentru vizionare.'
        : 'Subiect: 🏡 Proprietatea perfectă pentru tine, {{prenume}}!\n\nEchipa SocietyHUB a selecționat {{nr_prop}} proprietăți care se potrivesc bugetului tău de {{buget}} în zona {{zona}}.\n\nVezi proprietățile →';
      setMsgText(msg);
      if (editorRef.current) editorRef.current.innerText = msg;
      setAiLoading(false);
      toast.success("✨ Mesaj generat de AI!");
    }, 1400);
  };

  const sendCampaign = () => { if (audienceCount === 0) { toast.warning("⚠️ Selectează cel puțin un segment!"); return; } setSending(true); };
  const onSendDone = useCallback(() => {
    setSending(false);
    setCampaigns(prev => [{ id: Date.now(), name: campaignName, channel, status: "live", sent: audienceCount, opened: Math.round(audienceCount * openRate / 100), clicked: Math.round(audienceCount * clickRate / 100), conv: Math.round(audienceCount * 0.08), date: "04 Mar 2025", segment: Array.from(activeSegs).join(", ") || "—" }, ...prev]);
    toast.success(`🎉 Campanie "${campaignName}" lansată! ${audienceCount} destinatari.`);
  }, [campaignName, channel, audienceCount, activeSegs, openRate, clickRate]);

  const filteredCampaigns = useMemo(() => {
    const q = campSearch.toLowerCase();
    return campaigns.filter(c => (!q || c.name.toLowerCase().includes(q)) && (!campChFilter || c.channel === campChFilter) && (!campStFilter || c.status === campStFilter));
  }, [campaigns, campSearch, campChFilter, campStFilter]);

  const TABS: { key: TabKey; label: string; icon: string }[] = [
    { key: "creator", label: "Creator", icon: "✏️" }, { key: "campanii", label: "Campanii", icon: "📋" },
    { key: "segmentare", label: "Segmentare", icon: "🎯" }, { key: "analytics", label: "Analytics", icon: "📊" },
  ];

  return (
    <DashboardLayout>
      <SendOverlay show={sending} channel={channel} name={campaignName} onDone={onSendDone} />
      {/* Topbar */}
      <div className="sticky top-0 z-40 bg-background/90 backdrop-blur-xl border-b border-subtle px-4 md:px-7 h-[52px] md:h-[60px] flex items-center gap-2 md:gap-3">
        <div className="flex items-center gap-1.5 text-[12px] md:text-[13px] text-dim">
          <span className="hover:text-gold cursor-pointer">SocietyHUB</span><span className="text-dim2">›</span><span className="text-foreground font-medium">📱 Campanii</span>
        </div>
        <div className="ml-auto flex items-center gap-1.5 md:gap-2">
          <Button variant="outline" size="sm" className="text-xs hidden md:inline-flex" onClick={() => setTab("campanii")}>📋 Campanii</Button>
          <Button variant="outline" size="sm" className="text-xs hidden md:inline-flex" onClick={() => setTab("analytics")}>📊 Analytics</Button>
          <Button size="sm" className="text-[11px] md:text-xs bg-gradient-to-r from-[hsl(var(--gold))] to-[hsl(var(--gold2))] text-primary-foreground font-bold hover:opacity-90" onClick={() => setNewModalOpen(true)}>＋ <span className="hidden sm:inline">Campanie </span>Nouă</Button>
        </div>
      </div>

      <div className="flex-1 p-4 md:p-7 flex flex-col gap-5 overflow-y-auto">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 animate-fade-up">
          {[
            { label: "Campanii Trimise", value: "47", sub: "↑ +8 luna aceasta", subCls: "text-teal", bar: "gradient-gold-bottom" },
            { label: "WA Deschideri", value: "84%", sub: "↑ față de 78% Feb", subCls: "text-teal", bar: "bg-[#25d366]" },
            { label: "Email Open Rate", value: "32%", sub: "↑ +4% față de medie", subCls: "text-teal", bar: "gradient-blue-bottom" },
            { label: "Click-uri Totale", value: "1.2K", sub: "din 4.8K trimise", subCls: "text-dim", bar: "gradient-teal-bottom" },
            { label: "Conversii", value: "68", sub: "↑ campanie → vizionare", subCls: "text-teal", bar: "bg-[hsl(var(--purple))]" },
          ].map((s, i) => (
            <div key={i} className="bg-surface border border-subtle rounded-xl p-4 relative overflow-hidden hover:border-[hsla(40,100%,47%,.25)] transition-all hover:-translate-y-0.5">
              <div className={`absolute top-0 left-0 right-0 h-0.5 ${s.bar}`} />
              <div className="text-[10px] font-semibold tracking-wider uppercase text-dim mb-1.5">{s.label}</div>
              <div className="font-bold text-2xl leading-none" style={{ fontFamily: "'Syne', sans-serif" }}>{s.value}</div>
              <div className={`text-[11px] mt-1 ${s.subCls}`}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Tabs + Channel */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-3 animate-fade-up-delay-1">
          <div className="flex gap-0.5 bg-surface border border-subtle rounded-[10px] p-1">
            {TABS.map(t => (
              <button key={t.key} onClick={() => setTab(t.key)} className={`px-4 py-2 rounded-lg text-[13px] font-medium transition-all ${tab === t.key ? "bg-surface2 text-foreground shadow-sm" : "text-dim hover:text-foreground"}`}>{t.icon} {t.label}</button>
            ))}
          </div>
          <div className="md:ml-auto flex gap-2">
            {(["wa", "email"] as Channel[]).map(ch => (
              <button key={ch} onClick={() => switchChannel(ch)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-medium border-[1.5px] transition-all ${channel === ch ? (ch === "wa" ? "bg-[rgba(37,211,102,.1)] border-[rgba(37,211,102,.4)] text-[#25d366]" : "bg-blue-dim border-[rgba(96,165,250,.4)] text-info-blue") : "bg-surface2 border-subtle text-dim hover:text-foreground"}`}>
                <div className={`w-2 h-2 rounded-full ${ch === "wa" ? "bg-[#25d366]" : "bg-[hsl(var(--blue))]"}`} /> {ch === "wa" ? "WhatsApp" : "Email"}
              </button>
            ))}
          </div>
        </div>

        {/* CREATOR */}
        {tab === "creator" && (
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_280px] gap-4 animate-fade-up-delay-2">
            <div className="flex flex-col gap-3">
              {/* Templates */}
              <div className="bg-surface border border-subtle rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-subtle flex items-center justify-between">
                  <div className="font-bold text-[12.5px]" style={{ fontFamily: "'Syne', sans-serif" }}>📄 Template-uri</div>
                  <span className={`text-[10.5px] font-bold px-2 py-0.5 rounded ${isWa ? "bg-[rgba(37,211,102,.12)] text-[#25d366]" : "bg-blue-dim text-info-blue"}`}>{isWa ? "WhatsApp" : "Email"}</span>
                </div>
                <div className="flex flex-col gap-1.5 p-2.5">
                  {templates.map(t => (
                    <div key={t.id} onClick={() => selectTemplate(t.id)} className={`p-2.5 rounded-lg border-[1.5px] cursor-pointer transition-all relative ${activeTpl === t.id ? (isWa ? "border-[#25d366] bg-[rgba(37,211,102,.04)]" : "border-[hsl(var(--blue))] bg-blue-dim") : "border-subtle hover:border-subtle2"}`}>
                      <div className="text-[12.5px] font-semibold mb-0.5">{t.name}</div>
                      <div className="text-[11px] text-dim">{t.desc}</div>
                      <span className={`inline-flex text-[10px] px-1.5 py-0.5 rounded mt-1 font-semibold ${t.badge === "approved" ? "bg-[hsla(142,70%,60%,.12)] text-teal" : "bg-blue-dim text-info-blue"}`}>{t.badgeText}</span>
                      {activeTpl === t.id && <span className={`absolute top-2 right-2.5 text-[11px] font-bold ${isWa ? "text-[#25d366]" : "text-info-blue"}`}>✓</span>}
                    </div>
                  ))}
                </div>
              </div>
              {/* Segments */}
              <div className="bg-surface border border-subtle rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-subtle"><div className="font-bold text-[12.5px]" style={{ fontFamily: "'Syne', sans-serif" }}>🎯 Audiență Țintă</div></div>
                <div className="p-4">
                  <div className="text-[11.5px] text-dim mb-2">Selectează segmentele:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {SEGMENTS.map(s => (
                      <button key={s.id} onClick={() => toggleSeg(s.id)} className={`px-2.5 py-1 rounded-full text-[11.5px] border transition-all select-none ${activeSegs.has(s.id) ? (isWa ? "bg-[rgba(37,211,102,.1)] border-[rgba(37,211,102,.3)] text-[#25d366]" : "bg-blue-dim border-[rgba(96,165,250,.3)] text-info-blue") : "bg-surface2 border-subtle text-dim hover:text-foreground"}`}>{s.label} <strong>{s.count}</strong></button>
                    ))}
                  </div>
                  <div className="mt-3 p-2.5 bg-surface2 rounded-lg flex items-center gap-2.5">
                    <span className="text-[11px] text-dim">Destinatari estimați:</span>
                    <span className="font-extrabold text-[20px] text-gold" style={{ fontFamily: "'Syne', sans-serif" }}>{audienceCount}</span>
                  </div>
                </div>
              </div>
              {/* Schedule */}
              <div className="bg-surface border border-subtle rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-subtle"><div className="font-bold text-[12.5px]" style={{ fontFamily: "'Syne', sans-serif" }}>⏰ Programare</div></div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[12px] text-dim w-[80px]">Imediat</span>
                    <button onClick={() => setSchedNow(!schedNow)} className={`w-9 h-5 rounded-full relative transition-colors flex-shrink-0 ${schedNow ? "bg-gold" : "bg-surface2"}`}>
                      <div className={`absolute top-[3px] w-3.5 h-3.5 bg-white rounded-full transition-all ${schedNow ? "left-[19px]" : "left-[3px]"}`} />
                    </button>
                  </div>
                  {!schedNow && <div className="space-y-2 mt-2"><div><label className="text-[10.5px] font-bold uppercase text-dim block mb-1">Data</label><Input type="date" defaultValue="2025-03-10" className="bg-surface2 border-subtle text-[13px]" /></div><div><label className="text-[10.5px] font-bold uppercase text-dim block mb-1">Ora</label><Input type="time" defaultValue="09:00" className="bg-surface2 border-subtle text-[13px]" /></div></div>}
                  <div className="mt-2.5 text-[11px] text-dim">💡 Cel mai bun timp: <strong className="text-gold">Mar–Joi, 09:00–11:00</strong></div>
                </div>
              </div>
            </div>

            {/* Editor */}
            <div className="bg-surface border border-subtle rounded-xl overflow-hidden flex flex-col">
              <div className="px-3 py-2.5 border-b border-subtle flex items-center gap-2 flex-wrap">
                <span className="text-[12px] text-dim font-semibold">Format:</span>
                {["B", "I", "S"].map(f => <button key={f} className="bg-surface2 border border-subtle rounded px-2 py-1 text-[12px] text-dim hover:text-foreground transition-all">{f === "B" ? <b>B</b> : f === "I" ? <i>I</i> : <s>S</s>}</button>)}
                {["🏠", "📍", "💰", "⭐", "📞"].map(e => <button key={e} onClick={() => insertEmoji(e)} className="bg-surface2 border border-subtle rounded px-2 py-1 text-[12px] hover:text-foreground transition-all">{e}</button>)}
                <button onClick={aiGenerate} disabled={aiLoading} className="ml-auto bg-surface2 border border-[rgba(200,169,110,.3)] rounded px-2.5 py-1 text-[12px] text-gold hover:bg-gold-dim transition-all disabled:opacity-50">{aiLoading ? "⏳ Se generează…" : "✨ AI Generate"}</button>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <input value={campaignName} onChange={e => setCampaignName(e.target.value)} placeholder="Numele campaniei…" className="w-full bg-transparent border-b border-subtle pb-3 mb-4 text-[15px] font-semibold text-foreground outline-none" style={{ fontFamily: "'Syne', sans-serif" }} />
                <div ref={editorRef} contentEditable suppressContentEditableWarning className="flex-1 min-h-[250px] outline-none text-[13.5px] leading-relaxed text-foreground whitespace-pre-wrap" onInput={() => { if (editorRef.current) setMsgText(editorRef.current.innerText); }}>{msgText}</div>
                <div className={`text-[11px] text-right mt-1.5 ${msgText.length > maxChar * 0.9 ? "text-[hsl(45,100%,50%)]" : "text-dim"}`}>{msgText.length} / {maxChar} caractere</div>
              </div>
              <div className="flex flex-wrap gap-1.5 px-3 py-2.5 border-t border-subtle items-center">
                <span className="text-[11px] text-dim">Variabile:</span>
                {vars.map(v => <button key={v} onClick={() => insertVar(v)} className={`px-2 py-0.5 rounded text-[11px] border transition-all cursor-pointer ${isWa ? "bg-[rgba(37,211,102,.08)] border-[rgba(37,211,102,.2)] text-[#25d366]" : "bg-blue-dim border-[rgba(96,165,250,.2)] text-info-blue"}`}>{v}</button>)}
              </div>
              <div className="px-4 py-3 border-t border-subtle flex items-center gap-2.5">
                <div className="flex-1 text-[12px] text-dim">📬 <strong>{audienceCount}</strong> destinatari selectați</div>
                <Button variant="outline" size="sm" className="text-xs" onClick={() => { setCampaigns(prev => [{ id: Date.now(), name: campaignName || "Draft", channel, status: "draft", sent: 0, opened: 0, clicked: 0, conv: 0, date: "—", segment: "—" }, ...prev]); toast.info(`💾 Draft salvat`); }}>💾 Draft</Button>
                <Button variant="outline" size="sm" className="text-xs" onClick={() => toast.info("🧪 Mesaj test trimis")}>🧪 Test</Button>
                <Button size="sm" className="text-xs bg-gradient-to-r from-[hsl(var(--gold))] to-[hsl(var(--gold2))] text-primary-foreground font-bold" onClick={sendCampaign}>🚀 Lansează Campania</Button>
              </div>
            </div>

            {/* Right */}
            <div className="flex flex-col gap-3">
              <div className="bg-surface border border-subtle rounded-xl p-4">
                <div className="font-bold text-[12.5px] mb-3" style={{ fontFamily: "'Syne', sans-serif" }}>👁 Preview Live</div>
                {isWa ? <WaPreview text={msgText} /> : <EmailPreview text={msgText} />}
              </div>
              <div className="bg-surface border border-subtle rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-subtle"><div className="font-bold text-[12.5px]" style={{ fontFamily: "'Syne', sans-serif" }}>📊 Metrici Estimative</div></div>
                <div className="p-4">
                  <FunnelRow label="Trimise" pct={100} value={audienceCount > 0 ? String(audienceCount) : "—"} color="hsl(40,100%,47%)" />
                  <FunnelRow label="Livrate" pct={96} value={audienceCount > 0 ? String(Math.round(audienceCount * 0.96)) : "—"} color="hsl(217,85%,65%)" />
                  <FunnelRow label="Deschise" pct={openRate} value={audienceCount > 0 ? String(Math.round(audienceCount * openRate / 100)) : "—"} color={isWa ? "#25d366" : "hsl(217,85%,65%)"} />
                  <FunnelRow label="Click-uri" pct={clickRate} value={audienceCount > 0 ? String(Math.round(audienceCount * clickRate / 100)) : "—"} color="hsl(270,70%,75%)" />
                  <FunnelRow label="Conversii" pct={8} value={audienceCount > 0 ? String(Math.round(audienceCount * 0.08)) : "—"} color="hsl(165,87%,43%)" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CAMPANII LIST */}
        {tab === "campanii" && (
          <div className="animate-fade-up-delay-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="flex items-center gap-2 bg-surface2 border border-subtle rounded-lg px-3 py-1.5 flex-1 max-w-[320px]">
                <span className="text-dim">🔍</span>
                <input value={campSearch} onChange={e => setCampSearch(e.target.value)} placeholder="Caută campanie…" className="bg-transparent border-none outline-none text-[13px] text-foreground flex-1" />
              </div>
              <select value={campChFilter} onChange={e => setCampChFilter(e.target.value)} className="bg-surface2 border border-subtle rounded-lg px-3 py-1.5 text-[13px] text-foreground outline-none"><option value="">Toate</option><option value="wa">WhatsApp</option><option value="email">Email</option></select>
              <select value={campStFilter} onChange={e => setCampStFilter(e.target.value)} className="bg-surface2 border border-subtle rounded-lg px-3 py-1.5 text-[13px] text-foreground outline-none"><option value="">Toate statusurile</option><option value="live">Live</option><option value="done">Finalizat</option><option value="sched">Programat</option><option value="draft">Draft</option></select>
            </div>
            <div className="flex flex-col gap-2.5">
              {filteredCampaigns.map(c => {
                const cIsWa = c.channel === "wa";
                const oRate = c.sent > 0 ? Math.round(c.opened / c.sent * 100) : 0;
                const clRate = c.sent > 0 ? Math.round(c.clicked / c.sent * 100) : 0;
                return (
                  <div key={c.id} onClick={() => { setDetailCamp(c); setDetailOpen(true); }} className="bg-surface border border-subtle rounded-xl px-5 py-4 flex items-center gap-4 cursor-pointer hover:border-[hsla(40,100%,47%,.2)] hover:-translate-y-0.5 transition-all">
                    <div className={`w-[42px] h-[42px] rounded-[10px] flex items-center justify-center text-[18px] shrink-0 ${cIsWa ? "bg-[rgba(37,211,102,.12)]" : "bg-blue-dim"}`}>{cIsWa ? "💬" : "📧"}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[14px] font-semibold mb-0.5 truncate">{c.name}</div>
                      <div className="flex gap-3 text-[12px] text-dim"><span>📅 {c.date}</span><span>🎯 {c.segment}</span></div>
                    </div>
                    {c.status !== "draft" && c.status !== "sched" && (
                      <div className="hidden md:flex gap-5">
                        {[{ val: c.sent, label: "Trimise", color: "" }, { val: `${oRate}%`, label: "Deschis", color: cIsWa ? "text-[#25d366]" : "text-info-blue" }, { val: `${clRate}%`, label: "Click", color: "text-purple" }, { val: c.conv, label: "Conversii", color: "text-teal" }].map((m, i) => (
                          <div key={i} className="text-center"><div className={`font-bold text-[15px] ${m.color}`} style={{ fontFamily: "'Syne', sans-serif" }}>{m.val}</div><div className="text-[10.5px] text-dim">{m.label}</div></div>
                        ))}
                      </div>
                    )}
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${STATUS_META[c.status].cls}`}>{STATUS_META[c.status].label}</span>
                    <button onClick={e => { e.stopPropagation(); setCampaigns(prev => [{ ...c, id: Date.now(), name: c.name + " (Copie)", status: "draft", sent: 0, opened: 0, clicked: 0, conv: 0, date: "—" }, ...prev]); toast.info("⧉ Duplicată"); }} className="px-2 py-1 rounded text-[11.5px] border border-subtle text-dim hover:bg-surface2 transition-all">⧉ Duplică</button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SEGMENTARE */}
        {tab === "segmentare" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-up-delay-2">
            {SEGMENTS.map(s => (
              <div key={s.id} className="bg-surface border border-subtle rounded-xl p-4 hover:border-[hsla(40,100%,47%,.25)] hover:-translate-y-0.5 transition-all cursor-pointer">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: s.col }} />
                  <div className="flex-1 font-bold text-[13px]" style={{ fontFamily: "'Syne', sans-serif" }}>{s.label}</div>
                  <div className="font-extrabold text-[20px]" style={{ fontFamily: "'Syne', sans-serif", color: s.col }}>{s.count}</div>
                </div>
                <div className="h-1 bg-surface2 rounded-full overflow-hidden mb-2.5"><div className="h-full rounded-full transition-all duration-700" style={{ width: `${s.count / 128 * 100}%`, background: s.col }} /></div>
                <div className="text-[11px] text-dim">{Math.round(s.count / 128 * 100)}% din baza de clienți</div>
                <div className="flex gap-1.5 mt-2.5">
                  <button onClick={() => toast.info(`👁 Vizualizare ${s.label}`)} className="px-2 py-1 rounded text-[11px] border border-subtle text-dim hover:bg-surface2 transition-all">👁 Vezi</button>
                  <button onClick={() => toast.info(`📱 Campanie nouă: ${s.label}`)} className="px-2 py-1 rounded text-[11px] border border-[hsla(40,100%,47%,.3)] text-gold bg-gold-dim transition-all">📱 Campanie</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ANALYTICS */}
        {tab === "analytics" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-up-delay-2">
            <div className="bg-surface border border-subtle rounded-xl p-5">
              <div className="font-bold text-[13px] mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>📈 Performanță WA vs Email</div>
              {[{ l: "Rată Deschidere", wa: 84, em: 32 }, { l: "Rată Click", wa: 24, em: 8 }, { l: "Rată Conversie", wa: 8, em: 4 }, { l: "Livrare", wa: 98, em: 96 }].map((m, i) => (
                <div key={i} className="mb-3.5">
                  <div className="flex justify-between text-[12px] mb-1"><span className="text-dim">{m.l}</span><div className="flex gap-3"><span className="text-[#25d366] font-semibold">WA {m.wa}%</span><span className="text-info-blue font-semibold">Email {m.em}%</span></div></div>
                  <div className="h-2 bg-surface2 rounded-full overflow-hidden relative">
                    <div className="absolute top-0 left-0 h-full rounded-full bg-[rgba(37,211,102,.4)] transition-all duration-700" style={{ width: `${m.wa}%` }} />
                    <div className="absolute top-1 left-0 h-[3px] rounded-full bg-[hsl(var(--blue))] opacity-70 transition-all duration-700" style={{ width: `${m.em}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-surface border border-subtle rounded-xl p-5">
              <div className="font-bold text-[13px] mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>📅 Campanii pe Luni</div>
              {(() => { const m = ["Oct","Nov","Dec","Ian","Feb","Mar"], v = [6,8,12,9,11,14], mx = Math.max(...v); return (<><div className="flex items-end gap-2 h-[120px] mb-1.5">{v.map((val,i) => <div key={i} className="flex-1 rounded-t" style={{ background: `hsla(40,100%,47%,${.2+i*.12})`, height: `${val/mx*100}%` }} />)}</div><div className="flex gap-2">{m.map((mo,i) => <div key={i} className="flex-1 text-center text-[10px] text-dim">{mo}<br/><span className="font-bold text-[11px] text-foreground">{v[i]}</span></div>)}</div></>); })()}
            </div>
            <div className="bg-surface border border-subtle rounded-xl p-5">
              <div className="font-bold text-[13px] mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>🏆 Top Campanii</div>
              {campaigns.filter(c => c.sent > 0).sort((a, b) => b.conv - a.conv).slice(0, 5).map((c, i) => (
                <div key={c.id} className="flex items-center gap-2.5 mb-2">
                  <div className="font-extrabold text-[13px] text-dim w-[18px]" style={{ fontFamily: "'Syne', sans-serif" }}>#{i+1}</div>
                  <div className="flex-1 text-[12.5px] truncate">{c.name}</div>
                  <span className={`text-[10.5px] px-1.5 py-0.5 rounded ${c.channel === "wa" ? "bg-[rgba(37,211,102,.1)] text-[#25d366]" : "bg-blue-dim text-info-blue"}`}>{c.channel === "wa" ? "WA" : "Email"}</span>
                  <div className="font-bold text-[13px] text-teal" style={{ fontFamily: "'Syne', sans-serif" }}>{c.conv} conv</div>
                </div>
              ))}
            </div>
            <div className="bg-surface border border-subtle rounded-xl p-5">
              <div className="font-bold text-[13px] mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>⏰ Best Time to Send</div>
              {(() => { const h = ["8","9","10","11","12","13","14","15","16","17","18"], hv = [40,85,92,78,45,30,55,70,60,50,38]; return (<><div className="text-[12px] text-dim mb-2.5">Rata de deschidere per oră:</div><div className="flex items-end gap-1 h-[70px] mb-1.5">{h.map((_,i) => <div key={i} className="flex-1 rounded-t" style={{ background: `hsla(40,100%,47%,${hv[i]/100})`, height: `${hv[i]}%` }} />)}</div><div className="flex gap-1">{h.map(hr => <div key={hr} className="flex-1 text-center text-[9.5px] text-dim">{hr}</div>)}</div><div className="mt-2.5 p-2 bg-[hsla(40,100%,47%,.06)] border border-[hsla(40,100%,47%,.15)] rounded-md text-[11.5px]">🏆 <strong className="text-gold">Recomandat: 10:00–11:00</strong> — 92% open rate</div></>); })()}
            </div>
          </div>
        )}
      </div>

      {/* New Campaign Modal */}
      <Dialog open={newModalOpen} onOpenChange={setNewModalOpen}>
        <DialogContent className="bg-surface border-subtle2 max-w-[640px]">
          <DialogHeader><DialogTitle style={{ fontFamily: "'Syne', sans-serif" }}>📱 Campanie Nouă</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="space-y-1.5"><label className="text-[10.5px] font-bold uppercase text-dim">Tip Canal</label><select className="w-full bg-surface2 border border-subtle rounded-lg px-3 py-2 text-[13px] text-foreground outline-none"><option>💬 WhatsApp</option><option>📧 Email</option><option>💬📧 Ambele</option></select></div>
            <div className="space-y-1.5"><label className="text-[10.5px] font-bold uppercase text-dim">Nume Campanie</label><Input placeholder="ex: Proprietăți Noi" className="bg-surface2 border-subtle text-[13px]" /></div>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="space-y-1.5"><label className="text-[10.5px] font-bold uppercase text-dim">Template</label><select className="w-full bg-surface2 border border-subtle rounded-lg px-3 py-2 text-[13px] text-foreground outline-none"><option>Proprietăți Noi (WA)</option><option>Newsletter (Email)</option></select></div>
            <div className="space-y-1.5"><label className="text-[10.5px] font-bold uppercase text-dim">Segment</label><select className="w-full bg-surface2 border border-subtle rounded-lg px-3 py-2 text-[13px] text-foreground outline-none"><option>Toți clienții</option><option>Buget 100K+</option></select></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><label className="text-[10.5px] font-bold uppercase text-dim">Data</label><Input type="date" defaultValue="2025-03-06" className="bg-surface2 border-subtle text-[13px]" /></div>
            <div className="space-y-1.5"><label className="text-[10.5px] font-bold uppercase text-dim">Ora</label><Input type="time" defaultValue="09:30" className="bg-surface2 border-subtle text-[13px]" /></div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Anulează</Button></DialogClose>
            <Button className="bg-gradient-to-r from-[hsl(var(--gold))] to-[hsl(var(--gold2))] text-primary-foreground font-bold" onClick={() => { setNewModalOpen(false); setTab("creator"); toast.success("✅ Campanie creată!"); }}>✅ Creează</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail Modal */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="bg-surface border-subtle2 max-w-[680px]">
          {detailCamp && (() => {
            const c = detailCamp, cIsWa = c.channel === "wa";
            const oRate = c.sent > 0 ? Math.round(c.opened / c.sent * 100) : 0;
            const clRate = c.sent > 0 ? Math.round(c.clicked / c.sent * 100) : 0;
            const funnel = [
              { l: "Trimise", v: c.sent, pct: 100, col: "hsl(40,100%,47%)" },
              { l: "Livrate", v: Math.round(c.sent * .96), pct: 96, col: "hsl(217,85%,65%)" },
              { l: "Deschise", v: c.opened, pct: oRate, col: cIsWa ? "#25d366" : "hsl(217,85%,65%)" },
              { l: "Click-uri", v: c.clicked, pct: clRate, col: "hsl(270,70%,75%)" },
              { l: "Conversii", v: c.conv, pct: c.sent > 0 ? Math.round(c.conv / c.sent * 100) : 0, col: "hsl(165,87%,43%)" },
            ];
            return (<>
              <DialogHeader><DialogTitle style={{ fontFamily: "'Syne', sans-serif" }}>{cIsWa ? "💬" : "📧"} {c.name}</DialogTitle></DialogHeader>
              <div className="grid grid-cols-4 gap-3 mb-5">
                {[{ label: "Trimise", val: c.sent || "—", col: "text-gold" }, { label: "Deschise", val: oRate ? `${oRate}%` : "—", col: cIsWa ? "text-[#25d366]" : "text-info-blue" }, { label: "Click-uri", val: clRate ? `${clRate}%` : "—", col: "text-purple" }, { label: "Conversii", val: c.conv || "—", col: "text-teal" }].map((m, i) => (
                  <div key={i} className="bg-surface2 rounded-lg p-3.5 text-center"><div className="text-[10px] text-dim uppercase tracking-wider mb-1.5">{m.label}</div><div className={`font-bold text-2xl ${m.col}`} style={{ fontFamily: "'Syne', sans-serif" }}>{m.val}</div></div>
                ))}
              </div>
              <div className="bg-surface2 rounded-lg p-3.5 mb-3.5">
                <div className="text-[11.5px] text-dim mb-2.5">📊 Funnel Campanie</div>
                {funnel.map((f, i) => <div key={i} className="flex items-center gap-2.5 mb-1.5"><div className="w-[80px] text-[12px] text-dim">{f.l}</div><div className="flex-1 h-[7px] bg-[hsl(var(--bg3))] rounded-full overflow-hidden"><div className="h-full rounded-full transition-all duration-700" style={{ width: `${f.pct}%`, background: f.col }} /></div><div className="w-[50px] text-right text-[12px] font-bold" style={{ fontFamily: "'Syne', sans-serif", color: f.col }}>{f.v || 0}</div></div>)}
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {[{ l: "Canal", v: cIsWa ? "WhatsApp" : "Email" }, { l: "Status", v: STATUS_META[c.status].label }, { l: "Dată", v: c.date }, { l: "Segment", v: c.segment }].map((item, i) => (
                  <div key={i} className="px-3.5 py-2.5 bg-surface2 rounded-lg text-[12px]"><span className="text-dim">{item.l}:</span> <strong>{item.v}</strong></div>
                ))}
              </div>
            </>);
          })()}
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Închide</Button></DialogClose>
            <Button className="bg-gradient-to-r from-[hsl(var(--gold))] to-[hsl(var(--gold2))] text-primary-foreground font-bold" onClick={() => { toast.success("📤 Raport exportat PDF"); setDetailOpen(false); }}>📤 Export PDF</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
