import { useState, useMemo, useCallback } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

/* ─── TYPES & DATA ─────────────────────────────────────────────── */
interface Template { id: string; name: string; badge: string; badgeColor: string; barColor: string; blocks: string[]; }
interface Lead { id: number; name: string; initials: string; color: string; msg: string; prop: string; time: string; isNew: boolean; phone: string; email: string; }
interface Section { id: string; label: string; on: boolean; }

const TEMPLATES: Template[] = [
  { id: "luxury", name: "Luxury Dark", badge: "Popular", badgeColor: "text-gold", barColor: "hsl(var(--gold))", blocks: ["#1a1a2e", "#2d1b1b"] },
  { id: "modern", name: "Modern Light", badge: "Nou", badgeColor: "text-teal", barColor: "#1a1a2e", blocks: ["#e8e8e8", "#d0d0d0"] },
  { id: "green", name: "Nature Green", badge: "", badgeColor: "", barColor: "#22c55e", blocks: ["#162a1b", "#1e3a24"] },
  { id: "ocean", name: "Ocean Blue", badge: "Premium", badgeColor: "text-info-blue", barColor: "#3b82f6", blocks: ["#0f2040", "#1a3060"] },
];
const ACCENT_COLORS = ["#c8a96e", "#3b82f6", "#22c55e", "#a78bfa", "#f87171", "#fb923c", "#06b6d4", "#ec4899"];
const INIT_SECTIONS: Section[] = [
  { id: "hero", label: "Hero / Banner principal", on: true },
  { id: "search", label: "Bara de căutare", on: true },
  { id: "properties", label: "Proprietăți evidențiate", on: true },
  { id: "agents", label: "Pagina agenților", on: true },
  { id: "contact", label: "Formular de contact", on: true },
  { id: "blog", label: "Blog / Știri imobiliare", on: false },
  { id: "testimonials", label: "Testimoniale clienți", on: false },
  { id: "map", label: "Hartă interactivă", on: false },
];
const PROPERTIES_MINI = [
  { icon: "🏢", price: 185000, title: "Apt. 3 cam. – Floreasca", meta: "78m² · 3 cam.", status: "Disponibil", bg: "linear-gradient(135deg,#1a2035,#0f1520)" },
  { icon: "🏠", price: 425000, title: "Vilă – Pipera Exclusive", meta: "220m² · 5 cam.", status: "Rezervat", bg: "linear-gradient(135deg,#1a1a2e,#16213e)" },
  { icon: "🏢", price: 340000, title: "Apt. 4 cam. – Dorobanți", meta: "110m² · 4 cam.", status: "Disponibil", bg: "linear-gradient(135deg,#0f2027,#203a43)" },
  { icon: "🏬", price: 290000, title: "Sp. Comercial – Dorobanți", meta: "145m² · comercial", status: "Disponibil", bg: "linear-gradient(135deg,#1a0533,#2d1b69)" },
];
const INIT_LEADS: Lead[] = [
  { id: 1, name: "Mihai Stoian", initials: "MS", color: "linear-gradient(135deg,#3b82f6,#60a5fa)", msg: "Bună ziua, sunt interesat de apartamentul din Floreasca. Putem programa o vizionare?", prop: "Apt. 3 cam. – Floreasca 42", time: "Acum 5 min", isNew: true, phone: "+40 721 345 678", email: "m.stoian@gmail.com" },
  { id: 2, name: "Ana Radu", initials: "AR", color: "linear-gradient(135deg,#ec4899,#f472b6)", msg: "Aveți proprietăți disponibile în Baneasa cu grădină? Buget 400-500K.", prop: "Cerere generală", time: "Acum 23 min", isNew: true, phone: "+40 766 234 567", email: "ana.radu@yahoo.com" },
  { id: 3, name: "Toma Popescu", initials: "TP", color: "linear-gradient(135deg,#22c55e,#4ade80)", msg: "Solicit detalii despre vila din Pipera. Ce include prețul?", prop: "Vilă D+P+1 – Pipera", time: "Acum 1h", isNew: true, phone: "+40 733 456 789", email: "toma.p@business.ro" },
  { id: 4, name: "Irina Vasile", initials: "IV", color: "linear-gradient(135deg,#fbbf24,#f59e0b)", msg: "Salut, am văzut anunțul pe site. Când e disponibil pentru vizionare apartamentul 4 camere?", prop: "Apt. 4 cam. – Dorobanți", time: "Acum 3h", isNew: false, phone: "+40 744 567 890", email: "irina.vasile@gmail.com" },
  { id: 5, name: "Dan Marinescu", initials: "DM", color: "linear-gradient(135deg,#a78bfa,#c4b5fd)", msg: "Sunt investitor și caut proprietăți comerciale în zone premium. Aveți oferte?", prop: "Cerere investitor", time: "Ieri", isNew: false, phone: "+40 799 678 901", email: "dan.m@investments.ro" },
];
const SEO_CHECKS = [
  { ok: true, warn: false, text: "Titlu pagină definit" },
  { ok: true, warn: false, text: "Meta description completată" },
  { ok: true, warn: false, text: "SSL activ (HTTPS)" },
  { ok: true, warn: false, text: "Site responsive (mobile-first)" },
  { ok: false, warn: true, text: "3 imagini fără text ALT" },
  { ok: false, warn: true, text: "Viteza de încărcare: 1.2s (recomandat <1s)" },
  { ok: false, warn: false, text: "Sitemap XML generat" },
];
const SEO_AUDIT = [
  { ok: true, warn: false, label: "Titlu pagină definit", detail: "52 caractere — optimal" },
  { ok: true, warn: false, label: "Meta description completată", detail: "148 caractere — optimal" },
  { ok: true, warn: false, label: "HTTPS / SSL activ", detail: "Certificat valid până în 2027" },
  { ok: true, warn: false, label: "Sitemap XML existent", detail: "47 URL-uri în sitemap" },
  { ok: true, warn: false, label: "Site responsive", detail: "Score mobil 94/100" },
  { ok: false, warn: true, label: "Viteza de încărcare", detail: "1.2s — recomandat sub 1s" },
  { ok: false, warn: true, label: "Imagini fără text ALT", detail: "3 imagini neoptimizate" },
  { ok: false, warn: true, label: "Heading H1 duplicat", detail: "2 pagini au H1 identic" },
  { ok: true, warn: false, label: "Robots.txt configurat", detail: "Crawling permis corect" },
  { ok: true, warn: false, label: "Structured Data (JSON-LD)", detail: "Schema.org RealEstate activ" },
];
const PUB_STEPS = ["🔧 Compilare assets…", "📦 Generare pagini HTML…", "🖼 Optimizare imagini…", "🔒 Configurare SSL…", "🌐 Deploy pe CDN…", "🗺 Trimitere sitemap Google…", "✅ Site live!"];

function fmtEur(n: number) {
  if (n >= 1e6) return "€" + (n / 1e6).toFixed(2) + "M";
  if (n >= 1e3) return "€" + (n / 1e3).toFixed(0) + "K";
  return "€" + n;
}

const CHART_DATA = Array.from({ length: 30 }, (_, i) => Math.round(60 + Math.random() * 120 + Math.sin(i * 0.4) * 30));
const CHART_MAX = Math.max(...CHART_DATA);
const CHART_COLORS = ["hsl(var(--gold))", "hsl(var(--blue))", "hsl(var(--teal))", "hsl(var(--purple))", "hsl(48,100%,50%)"];

/* ─── COMPONENT ────────────────────────────────────────────────── */
export default function SiteAgentie() {
  const [activeTemplate, setActiveTemplate] = useState("luxury");
  const [activeAccent, setActiveAccent] = useState("#c8a96e");
  const [sections, setSections] = useState<Section[]>(INIT_SECTIONS.map(s => ({ ...s })));
  const [agencyName, setAgencyName] = useState("Ionescu Imobiliare");
  const [agencySlogan, setAgencySlogan] = useState("Casa ta, visul nostru.");
  const [agencyPhone, setAgencyPhone] = useState("+40 722 111 222");
  const [agencyEmail, setAgencyEmail] = useState("contact@ionescu-imobiliare.ro");
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [currentTab, setCurrentTab] = useState<"builder" | "leads" | "analytics" | "seo">("builder");
  const [leads, setLeads] = useState<Lead[]>(INIT_LEADS.map(l => ({ ...l })));
  const [sitePublished, setSitePublished] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [pubSteps, setPubSteps] = useState<{ text: string; status: "waiting" | "active" | "done" }[]>([]);
  const [domainModal, setDomainModal] = useState(false);
  const [domainInput, setDomainInput] = useState("ionescu-imobiliare.ro");
  const [seoTitle, setSeoTitle] = useState("Ionescu Imobiliare — Proprietăți Premium în București");
  const [seoDesc, setSeoDesc] = useState("Agenție imobiliară premium în București. Apartamente, vile și terenuri în Floreasca, Dorobanți și Pipera. Contactați-ne pentru o vizionare gratuită.");
  const [seoKeywords, setSeoKeywords] = useState("imobiliare bucuresti, apartamente floreasca, vile pipera");

  const slug = useMemo(() => agencyName.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, ""), [agencyName]);
  const newLeadsCount = useMemo(() => leads.filter(l => l.isNew).length, [leads]);

  const isLight = activeTemplate === "modern";
  const bg = isLight ? "#f8f9fa" : "#0a0c10";
  const bg2 = isLight ? "#fff" : "#141820";
  const textColor = isLight ? "#1a1a2e" : "#f0eee8";
  const mutedColor = isLight ? "#666" : "#8a8d9a";
  const borderAlpha = isLight ? "rgba(0,0,0,.08)" : "rgba(255,255,255,.08)";
  const inputBg = isLight ? "#fff" : "rgba(255,255,255,.06)";
  const inputBorder = isLight ? "rgba(0,0,0,.1)" : "rgba(255,255,255,.1)";

  const toggleSection = (idx: number) => {
    setSections(prev => prev.map((s, i) => i === idx ? { ...s, on: !s.on } : s));
  };

  const simulateFormSubmit = useCallback(() => {
    toast.success("📥 Lead nou intrat în CRM! Notificare trimisă pe WhatsApp.");
    setLeads(prev => [{ id: Date.now(), name: "Vizitator Site", initials: "VS", color: "linear-gradient(135deg,#c8a96e,#e8c98e)", msg: "Mesaj primit prin formularul de pe site.", prop: "Cerere generală", time: "Acum", isNew: true, phone: "—", email: "—" }, ...prev]);
  }, []);

  const addLeadToCrm = (id: number) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, isNew: false } : l));
    const l = leads.find(x => x.id === id);
    toast.success(`✅ ${l?.name} adăugat în CRM ca lead nou!`);
  };
  const markLeadRead = (id: number) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, isNew: false } : l));
    toast.success("✓ Lead marcat ca procesat");
  };

  const publishSite = () => {
    if (publishing) return;
    setPublishing(true);
    const steps = PUB_STEPS.map(t => ({ text: t, status: "waiting" as const }));
    setPubSteps(steps);
    PUB_STEPS.forEach((_, i) => {
      setTimeout(() => {
        setPubSteps(prev => prev.map((s, j) => j === i ? { ...s, status: "active" } : j < i ? { ...s, status: "done" } : s));
      }, i * 600);
      if (i === PUB_STEPS.length - 1) {
        setTimeout(() => {
          setPubSteps(prev => prev.map(s => ({ ...s, status: "done" })));
          setSitePublished(true);
          setPublishing(false);
          toast.success(`🚀 Site-ul tău este acum LIVE pe ${domainInput}!`);
        }, i * 600 + 800);
      }
    });
  };

  const saveDomain = () => {
    if (!domainInput.trim()) return;
    setDomainModal(false);
    toast.success(`🌐 Domeniu actualizat: ${domainInput}`);
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 flex flex-col gap-5 animate-fade-up">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 bg-gold-dim border border-gold/20 rounded-[10px] flex items-center justify-center text-lg">🌐</div>
              <h1 className="font-serif text-xl md:text-[22px] font-bold">Site Agenție</h1>
              <span className="text-[10.5px] font-bold tracking-wider px-2 py-0.5 rounded bg-[hsl(48_100%_50%/0.12)] border border-[hsl(48_100%_50%/0.25)] text-[hsl(48,100%,50%)]">ÎN DEZVOLTARE</span>
            </div>
            <p className="text-[13.5px] text-dim ml-[52px]">Website profesional generat automat cu listing-urile tale, pagini de agent și formulare de contact integrate.</p>
          </div>
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs text-dim px-3 py-1.5 bg-surface border border-subtle rounded-lg">
              <span className={`w-[7px] h-[7px] rounded-full inline-block ${sitePublished ? "bg-teal" : "bg-[hsl(var(--text3))]"}`} />
              <span className={sitePublished ? "text-teal" : ""}>{sitePublished ? "Live" : "Nepublicat"}</span>
            </div>
            <button onClick={() => setCurrentTab("analytics")} className="text-xs px-3 py-1.5 rounded-lg bg-transparent border border-subtle text-dim hover:bg-surface2 hover:text-foreground transition-colors">📊 Analytics</button>
            <button onClick={() => toast.info("👁 Previzualizare deschisă în tab nou (demo)")} className="text-xs px-3 py-1.5 rounded-lg bg-transparent border border-subtle text-dim hover:bg-surface2 hover:text-foreground transition-colors">👁 Preview</button>
            <button onClick={publishSite} disabled={publishing} className="text-xs px-4 py-1.5 rounded-lg bg-gradient-to-r from-gold to-gold/80 text-primary-foreground font-bold hover:opacity-90 transition-all disabled:opacity-50">🚀 Publică Site</button>
          </div>
        </div>

        {/* KPI */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 animate-fade-up-delay-1">
          {[
            { label: "Vizitatori / Lună", value: "2,847", sub: "↑ 18% față de luna trecută", color: "gold", subC: "text-teal" },
            { label: "Lead-uri din Site", value: String(43 + leads.length - INIT_LEADS.length), sub: `↑ ${newLeadsCount} noi`, color: "teal", subC: "text-teal" },
            { label: "Pagini Vizualizate", value: "8,312", sub: "2.9 pagini/sesiune", color: "blue" },
            { label: "Timp Mediu pe Site", value: "3:24", sub: "minute", color: "purple" },
            { label: "Rată Respingere", value: "34%", sub: "Sub media industriei", color: "yellow" },
          ].map((s, i) => (
            <div key={i} className="bg-surface border border-subtle rounded-xl p-4 relative overflow-hidden hover:border-gold/25 transition-all hover:-translate-y-px">
              <div className={`absolute top-0 left-0 right-0 h-0.5 ${s.color === "gold" ? "bg-gradient-to-r from-gold to-gold/60" : s.color === "teal" ? "bg-teal" : s.color === "blue" ? "bg-info" : s.color === "purple" ? "bg-purple" : "bg-[hsl(var(--gold))]"}`} />
              <div className="text-[10px] font-semibold tracking-wider uppercase text-dim mb-1.5">{s.label}</div>
              <div className="font-serif text-2xl font-bold leading-none">{s.value}</div>
              <div className={`text-[11px] mt-1 ${s.subC || "text-dim"}`}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* TABS + DOMAIN */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 animate-fade-up-delay-2">
          <div className="flex gap-0.5 bg-surface border border-subtle rounded-[10px] p-1 w-fit">
            {([["builder", "🎨 Builder"], ["leads", "📥 Lead-uri"], ["analytics", "📊 Analytics"], ["seo", "🔍 SEO"]] as const).map(([id, label]) => (
              <button key={id} onClick={() => setCurrentTab(id)} className={`px-4 py-2 rounded-lg text-[13px] font-medium transition-all ${currentTab === id ? "bg-surface2 text-foreground shadow-sm" : "text-dim hover:text-foreground"}`}>
                {label}
                {id === "leads" && newLeadsCount > 0 && <span className="ml-1.5 text-[10px] font-bold bg-teal text-primary-foreground px-1.5 py-0.5 rounded">{newLeadsCount}</span>}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-dim">
            🌐 <span className="text-gold cursor-pointer" onClick={() => setDomainModal(true)}>{domainInput}</span>
            <button onClick={() => setDomainModal(true)} className="text-[11px] px-2 py-0.5 rounded border border-subtle text-dim hover:bg-surface2 transition-colors">✏️</button>
          </div>
        </div>

        {/* ═══ BUILDER TAB ═══ */}
        {currentTab === "builder" && (
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_260px] gap-4 animate-fade-up">

            {/* LEFT SETTINGS */}
            <div className="flex flex-col gap-3">
              {/* Templates */}
              <div className="bg-surface border border-subtle rounded-xl">
                <div className="px-4 py-3 border-b border-subtle font-serif text-xs font-bold">🎨 Template</div>
                <div className="flex flex-col gap-2 p-2.5">
                  {TEMPLATES.map(t => (
                    <div key={t.id} onClick={() => { setActiveTemplate(t.id); toast.success(`🎨 Template ${t.name} aplicat!`); }}
                      className={`border-[1.5px] rounded-[9px] overflow-hidden cursor-pointer transition-all relative hover:-translate-y-px ${activeTemplate === t.id ? "border-gold" : "border-subtle hover:border-gold/30"}`}>
                      {activeTemplate === t.id && <span className="absolute top-1.5 right-1.5 text-[10px] font-bold bg-gold text-primary-foreground px-1.5 py-0.5 rounded font-serif z-10">✓ Activ</span>}
                      <div className="h-[60px] flex flex-col overflow-hidden">
                        <div className="h-3" style={{ background: t.barColor }} />
                        <div className="flex-1 grid grid-cols-2 gap-0.5 p-[3px]">
                          {t.blocks.map((c, i) => <div key={i} className="rounded-sm" style={{ background: c }} />)}
                        </div>
                      </div>
                      <div className="px-2.5 py-2 flex items-center justify-between">
                        <span className="text-xs font-semibold">{t.name}</span>
                        {t.badge && <span className={`text-[10px] px-1.5 py-0.5 rounded bg-surface2 ${t.badgeColor}`}>{t.badge}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Branding */}
              <div className="bg-surface border border-subtle rounded-xl">
                <div className="px-4 py-3 border-b border-subtle font-serif text-xs font-bold">✏️ Branding</div>
                <div className="p-4 flex flex-col gap-3">
                  {[
                    { label: "Nume agenție", value: agencyName, set: setAgencyName },
                    { label: "Slogan", value: agencySlogan, set: setAgencySlogan },
                    { label: "Telefon", value: agencyPhone, set: setAgencyPhone },
                    { label: "Email", value: agencyEmail, set: setAgencyEmail },
                  ].map((f, i) => (
                    <div key={i}>
                      <label className="text-[10.5px] font-bold tracking-wider uppercase text-dim block mb-1">{f.label}</label>
                      <input value={f.value} onChange={e => f.set(e.target.value)} className="w-full bg-surface2 border border-subtle rounded-lg px-3 py-2 text-[13px] text-foreground outline-none focus:border-gold transition-colors" />
                    </div>
                  ))}
                  <div>
                    <label className="text-[10.5px] font-bold tracking-wider uppercase text-dim block mb-1.5">Culoare Principală</label>
                    <div className="flex gap-[7px] flex-wrap">
                      {ACCENT_COLORS.map(c => (
                        <div key={c} onClick={() => setActiveAccent(c)} title={c}
                          className={`w-7 h-7 rounded-md cursor-pointer transition-transform hover:scale-110 relative ${activeAccent === c ? "ring-2 ring-foreground ring-offset-2 ring-offset-background" : ""}`}
                          style={{ background: c }}>
                          {activeAccent === c && <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-white">✓</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Sections */}
              <div className="bg-surface border border-subtle rounded-xl">
                <div className="px-4 py-3 border-b border-subtle font-serif text-xs font-bold">📋 Secțiuni</div>
                <div className="p-4 flex flex-col">
                  {sections.map((s, i) => (
                    <div key={s.id} className="flex items-center justify-between py-[7px] border-b border-subtle/30 last:border-b-0">
                      <span className="text-xs">{s.label}</span>
                      <div onClick={() => toggleSection(i)} className={`w-9 h-5 rounded-full relative cursor-pointer shrink-0 transition-colors ${s.on ? "bg-gold" : "bg-surface2"}`}>
                        <div className={`w-3.5 h-3.5 bg-foreground rounded-full absolute top-[3px] transition-all ${s.on ? "right-[3px]" : "right-[19px]"}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CENTER PREVIEW */}
            <div className="relative">
              <div className="bg-surface border border-subtle rounded-xl overflow-hidden flex flex-col">
                <div className="px-3.5 py-2.5 border-b border-subtle flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-danger" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[hsl(var(--gold))]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-teal" />
                  </div>
                  <div className="flex-1 bg-surface2 border border-subtle rounded-md px-2.5 py-1 text-[11.5px] text-dim text-center">{slug}.ro</div>
                  <div className="flex gap-1">
                    {(["desktop", "tablet", "mobile"] as const).map(d => (
                      <button key={d} onClick={() => setDevice(d)} className={`px-2 py-1 rounded-md border text-xs transition-all ${device === d ? "bg-surface2 text-foreground border-subtle" : "bg-transparent text-dim border-subtle hover:bg-surface2"}`}>
                        {d === "desktop" ? "🖥" : d === "tablet" ? "📱" : "📲"}
                      </button>
                    ))}
                  </div>
                </div>
                <div className={`min-h-[550px] overflow-auto transition-all ${device === "mobile" ? "max-w-[390px] mx-auto border-x border-subtle" : device === "tablet" ? "max-w-[768px] mx-auto" : ""}`}>
                  <SitePreview {...{ bg, bg2, textColor, mutedColor, borderAlpha, inputBg, inputBorder, activeAccent, agencyName, agencySlogan, agencyPhone, sections, simulateFormSubmit }} />
                </div>
              </div>
              {publishing && (
                <div className="absolute inset-0 bg-background/90 backdrop-blur-md flex flex-col items-center justify-center gap-4 rounded-xl z-10 animate-fade-up">
                  {pubSteps.some(s => s.status !== "done") && <div className="w-[52px] h-[52px] border-[3px] border-gold/20 border-t-gold rounded-full animate-spin" />}
                  <div className="font-serif text-[15px] font-bold">{pubSteps.every(s => s.status === "done") ? "🎉 Site publicat cu succes!" : "Se publică site-ul…"}</div>
                  <div className="flex flex-col gap-1.5 w-[260px]">
                    {pubSteps.map((s, i) => (
                      <div key={i} className={`text-xs px-2.5 py-1.5 rounded-md flex items-center gap-2 ${s.status === "done" ? "text-teal bg-surface2" : s.status === "active" ? "text-foreground bg-gold/10" : "text-dim bg-surface2"}`}>
                        {s.text}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT PANEL */}
            <div className="flex flex-col gap-3">
              {/* Leads mini */}
              <div className="bg-surface border border-subtle rounded-xl">
                <div className="px-4 py-3 border-b border-subtle flex items-center justify-between">
                  <div className="font-serif text-xs font-bold">📥 Lead-uri Noi</div>
                  <span className="text-[11px] text-dim">{newLeadsCount} neprocesate</span>
                </div>
                {leads.slice(0, 4).map(l => (
                  <div key={l.id} className="px-3.5 py-3 border-b border-subtle last:border-b-0 hover:bg-surface2 transition-colors cursor-pointer">
                    <div className="flex items-center gap-2 mb-1">
                      {l.isNew && <div className="w-[7px] h-[7px] rounded-full bg-teal shrink-0 animate-pulse" />}
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center font-serif font-bold text-[10px] text-primary-foreground shrink-0" style={{ background: l.color }}>{l.initials}</div>
                      <span className="text-xs font-semibold">{l.name}</span>
                      <span className="text-[10.5px] text-dim ml-auto">{l.time}</span>
                    </div>
                    <div className="text-[11.5px] text-dim leading-relaxed mb-1">{l.msg.slice(0, 80)}…</div>
                    <div className="text-[11px] text-gold">📌 {l.prop}</div>
                    <div className="flex gap-1 mt-1.5">
                      <button onClick={() => addLeadToCrm(l.id)} className="text-[11px] px-2 py-1 rounded border border-gold/30 text-gold bg-gold/[0.08] hover:bg-gold/15 transition-colors">➕ CRM</button>
                      <button onClick={() => toast.info(`📞 Se inițiază apel: ${l.phone}`)} className="text-[11px] px-2 py-1 rounded border border-subtle text-dim hover:bg-surface2 transition-colors">📞</button>
                      <button onClick={() => markLeadRead(l.id)} className="text-[11px] px-2 py-1 rounded border border-subtle text-dim hover:bg-surface2 transition-colors">✓</button>
                    </div>
                  </div>
                ))}
              </div>

              {/* SEO Quick */}
              <div className="bg-surface border border-subtle rounded-xl">
                <div className="px-4 py-3 border-b border-subtle font-serif text-xs font-bold">🔍 SEO Rapid</div>
                <div className="p-4 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-dim">Scor SEO</span>
                    <span className="font-serif text-lg font-extrabold text-gold">78</span>
                  </div>
                  <div className="h-1.5 bg-surface2 rounded-full overflow-hidden">
                    <div className="h-full w-[78%] bg-gradient-to-r from-gold to-gold/70 rounded-full" />
                  </div>
                  <div className="flex flex-col gap-1 mt-1">
                    {SEO_CHECKS.map((c, i) => (
                      <div key={i} className={`text-[11.5px] flex items-center gap-1.5 ${c.ok ? "text-teal" : c.warn ? "text-gold" : "text-dim"}`}>
                        {c.ok ? "✓" : c.warn ? "⚡" : "✗"} {c.text}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Mobile Score */}
              <div className="bg-surface border border-subtle rounded-xl">
                <div className="px-4 py-3 border-b border-subtle font-serif text-xs font-bold">📱 Mobile Score</div>
                <div className="p-4 flex gap-3.5">
                  {[{ val: 94, label: "Performance", cls: "text-teal" }, { val: 100, label: "Accessibility", cls: "text-teal" }, { val: 86, label: "SEO", cls: "text-gold" }].map((m, i) => (
                    <div key={i} className="text-center flex-1">
                      <div className={`font-serif text-[22px] font-extrabold ${m.cls}`}>{m.val}</div>
                      <div className="text-[10.5px] text-dim">{m.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══ LEADS TAB ═══ */}
        {currentTab === "leads" && (
          <div className="bg-surface border border-subtle rounded-xl overflow-hidden animate-fade-up">
            <div className="px-4 py-3.5 border-b border-subtle flex items-center justify-between">
              <div className="font-serif text-sm font-bold">📥 Toate Lead-urile din Site</div>
              <button onClick={() => toast.success("📤 CSV exportat — lead-uri descărcate")} className="text-xs px-3 py-1.5 rounded-lg bg-gradient-to-r from-gold to-gold/80 text-primary-foreground font-bold">📤 Export CSV</button>
            </div>
            {leads.map(l => (
              <div key={l.id} className="flex items-center gap-3 px-4 py-3 border-b border-subtle last:border-b-0 hover:bg-surface2 transition-colors cursor-pointer">
                {l.isNew ? <div className="w-[7px] h-[7px] rounded-full bg-teal shrink-0 animate-pulse" /> : <div className="w-[7px] shrink-0" />}
                <div className="w-7 h-7 rounded-lg flex items-center justify-center font-serif font-bold text-[10px] text-primary-foreground shrink-0" style={{ background: l.color }}>{l.initials}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold mb-0.5">{l.name}</div>
                  <div className="text-[11.5px] text-dim truncate">{l.msg.slice(0, 60)}…</div>
                </div>
                <div className="text-xs text-gold shrink-0 hidden md:block">{l.prop}</div>
                <div className="text-[11px] text-dim w-[70px] text-right shrink-0">{l.time}</div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => addLeadToCrm(l.id)} className="text-[11px] px-2 py-1 rounded border border-gold/30 text-gold bg-gold/[0.08] hover:bg-gold/15 transition-colors">➕ CRM</button>
                  <button onClick={() => toast.info(`📞 Se inițiază apel: ${l.phone}`)} className="text-[11px] px-2 py-1 rounded border border-subtle text-dim hover:bg-surface2 transition-colors">📞</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ═══ ANALYTICS TAB ═══ */}
        {currentTab === "analytics" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-up">
            <div className="bg-surface border border-subtle rounded-xl p-4 md:col-span-2">
              <div className="font-serif text-[13px] font-bold mb-3.5">Vizitatori Unici — Ultimele 30 de zile</div>
              <div className="flex items-end gap-1 h-20">
                {CHART_DATA.map((v, i) => (
                  <div key={i} className="flex-1 rounded-t-sm cursor-pointer hover:opacity-80 transition-opacity" title={`${v} vizitatori`}
                    style={{ height: `${Math.round((v / CHART_MAX) * 80)}px`, background: CHART_COLORS[i % 5], opacity: 0.7 }} />
                ))}
              </div>
              <div className="flex gap-1 mt-1">
                {CHART_DATA.map((_, i) => (
                  <div key={i} className="flex-1 text-center text-[9px] text-dim">{(i + 1) % 5 === 0 ? i + 1 : ""}</div>
                ))}
              </div>
            </div>

            <div className="bg-surface border border-subtle rounded-xl p-4">
              <div className="font-serif text-[13px] font-bold mb-3.5">Surse Trafic</div>
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20 shrink-0">
                  <svg width="80" height="80" viewBox="0 0 80 80" className="-rotate-90">
                    <circle cx="40" cy="40" r="32" fill="none" stroke="hsl(var(--bg3))" strokeWidth="12" />
                    <circle cx="40" cy="40" r="32" fill="none" stroke="hsl(var(--gold))" strokeWidth="12" strokeDasharray="80 121" strokeLinecap="round" />
                    <circle cx="40" cy="40" r="32" fill="none" stroke="hsl(var(--blue))" strokeWidth="12" strokeDasharray="48 201" strokeDashoffset="-80" strokeLinecap="round" />
                    <circle cx="40" cy="40" r="32" fill="none" stroke="hsl(var(--purple))" strokeWidth="12" strokeDasharray="30 201" strokeDashoffset="-128" strokeLinecap="round" />
                    <circle cx="40" cy="40" r="32" fill="none" stroke="hsl(var(--teal))" strokeWidth="12" strokeDasharray="43 201" strokeDashoffset="-158" strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="font-serif text-base font-extrabold">2,847</div>
                    <div className="text-[9px] text-dim">vizitatori</div>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  {[{ color: "bg-gold", label: "Organic 40%" }, { color: "bg-info", label: "Direct 24%" }, { color: "bg-purple", label: "Social 15%" }, { color: "bg-teal", label: "Portale 21%" }].map((s, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-[11.5px]"><div className={`w-2 h-2 rounded-full ${s.color}`} />{s.label}</div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-surface border border-subtle rounded-xl p-4">
              <div className="font-serif text-[13px] font-bold mb-3.5">Top Pagini</div>
              {[
                { page: "/ (Acasă)", views: "1,240 viz." }, { page: "/proprietati", views: "876 viz." },
                { page: "/proprietate/floreasca-42", views: "523 viz." }, { page: "/agenti", views: "312 viz." },
                { page: "/contact", views: "198 viz." }, { page: "/proprietate/pipera-vila", views: "167 viz." },
              ].map((p, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-subtle/40 last:border-b-0 text-xs">
                  <span>{p.page}</span><span className="text-dim">{p.views}</span>
                </div>
              ))}
            </div>

            <div className="bg-surface border border-subtle rounded-xl p-4">
              <div className="font-serif text-[13px] font-bold mb-3.5">Dispozitive</div>
              <div className="flex flex-col gap-2">
                {[{ icon: "📱", label: "Mobil", pct: 62, color: "bg-gold" }, { icon: "🖥", label: "Desktop", pct: 30, color: "bg-info" }, { icon: "📟", label: "Tabletă", pct: 8, color: "bg-purple" }].map((d, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs">
                    <span className="w-[100px] text-dim shrink-0">{d.icon} {d.label}</span>
                    <div className="flex-1 h-1.5 bg-surface2 rounded-full overflow-hidden"><div className={`h-full rounded-full ${d.color}`} style={{ width: `${d.pct}%` }} /></div>
                    <span className="w-9 text-right font-semibold">{d.pct}%</span>
                  </div>
                ))}
              </div>
              <div className="mt-3.5 pt-3.5 border-t border-subtle">
                <div className="font-serif text-[13px] font-bold mb-2">Conversie Lead-uri</div>
                {[{ label: "Vizitatori", val: "2,847", pct: 100, color: "bg-info" }, { label: "Formulare", val: "183", pct: 6, color: "bg-[hsl(var(--gold))]" }, { label: "Lead-uri", val: "43", pct: 1.5, color: "bg-teal" }].map((d, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs mb-1.5">
                    <span className="w-[100px] text-dim shrink-0">{d.label}</span>
                    <div className="flex-1 h-1.5 bg-surface2 rounded-full overflow-hidden"><div className={`h-full rounded-full ${d.color}`} style={{ width: `${d.pct}%` }} /></div>
                    <span className="w-9 text-right font-semibold">{d.val}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-surface border border-subtle rounded-xl p-4">
              <div className="font-serif text-[13px] font-bold mb-3.5">Top Orașe</div>
              {[{ label: "București", pct: 68, color: "bg-gold" }, { label: "Cluj-Napoca", pct: 8, color: "bg-info" }, { label: "Timișoara", pct: 6, color: "bg-purple" }, { label: "Constanța", pct: 4, color: "bg-teal" }, { label: "Altele", pct: 14, color: "bg-surface2" }].map((d, i) => (
                <div key={i} className="flex items-center gap-2.5 text-xs mb-1.5">
                  <span className="w-[100px] text-dim shrink-0">{d.label}</span>
                  <div className="flex-1 h-1.5 bg-surface2 rounded-full overflow-hidden"><div className={`h-full rounded-full ${d.color}`} style={{ width: `${d.pct}%` }} /></div>
                  <span className="w-9 text-right font-semibold">{d.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ SEO TAB ═══ */}
        {currentTab === "seo" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-up">
            <div className="bg-surface border border-subtle rounded-xl p-4">
              <div className="font-serif text-[13px] font-bold mb-3.5">🔍 Audit SEO Complet</div>
              {SEO_AUDIT.map((item, i) => (
                <div key={i} className="flex items-start gap-2.5 py-2 border-b border-subtle/40 last:border-b-0">
                  <span className="text-[13px] shrink-0">{item.ok ? "✅" : item.warn ? "⚠️" : "❌"}</span>
                  <div>
                    <div className="text-xs font-medium">{item.label}</div>
                    <div className="text-[11px] text-dim mt-0.5">{item.detail}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-surface border border-subtle rounded-xl p-4">
              <div className="font-serif text-[13px] font-bold mb-3.5">📝 Meta Tags</div>
              <div className="flex flex-col gap-3">
                <div>
                  <label className="text-[10.5px] font-bold tracking-wider uppercase text-dim block mb-1">Title Tag</label>
                  <input value={seoTitle} onChange={e => setSeoTitle(e.target.value)} className="w-full bg-surface2 border border-subtle rounded-lg px-3 py-2 text-[13px] text-foreground outline-none focus:border-gold transition-colors" />
                  <div className="text-[11px] text-dim mt-1">{seoTitle.length} / 60 caractere recomandabile</div>
                </div>
                <div>
                  <label className="text-[10.5px] font-bold tracking-wider uppercase text-dim block mb-1">Meta Description</label>
                  <textarea value={seoDesc} onChange={e => setSeoDesc(e.target.value)} rows={3} className="w-full bg-surface2 border border-subtle rounded-lg px-3 py-2 text-[13px] text-foreground outline-none focus:border-gold transition-colors resize-y" />
                  <div className="text-[11px] text-dim mt-1">{seoDesc.length} / 160 caractere recomandabile</div>
                </div>
                <div>
                  <label className="text-[10.5px] font-bold tracking-wider uppercase text-dim block mb-1">Cuvinte Cheie Focus</label>
                  <input value={seoKeywords} onChange={e => setSeoKeywords(e.target.value)} className="w-full bg-surface2 border border-subtle rounded-lg px-3 py-2 text-[13px] text-foreground outline-none focus:border-gold transition-colors" />
                </div>
                <button onClick={() => toast.success("✅ Meta tags salvate și aplicate pe site")} className="text-xs py-2.5 rounded-lg bg-gradient-to-r from-gold to-gold/80 text-primary-foreground font-bold hover:opacity-90 transition-all">💾 Salvează Meta Tags</button>
              </div>
            </div>

            <div className="bg-surface border border-subtle rounded-xl p-4 md:col-span-2">
              <div className="font-serif text-[13px] font-bold mb-3.5">🔗 Sitemap & Indexare</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3.5">
                {[
                  { val: "47", label: "Pagini indexate", cls: "text-teal" },
                  { val: "3", label: "Erori crawl", cls: "text-gold" },
                  { val: "1.2s", label: "Timp încărcare", cls: "text-info-blue" },
                  { val: "SSL ✓", label: "Certificat valid", cls: "text-gold" },
                ].map((m, i) => (
                  <div key={i} className="bg-surface2 rounded-lg p-3 text-center">
                    <div className={`font-serif text-xl font-bold ${m.cls}`}>{m.val}</div>
                    <div className="text-[11px] text-dim mt-0.5">{m.label}</div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 flex-wrap">
                <button onClick={() => toast.success("🗺 Sitemap generat și trimis la Google")} className="text-xs px-3 py-1.5 rounded-lg bg-transparent border border-subtle text-dim hover:bg-surface2 hover:text-foreground transition-colors">🗺 Regenerează Sitemap</button>
                <button onClick={() => toast.info("📡 Pagini trimise pentru re-indexare Google")} className="text-xs px-3 py-1.5 rounded-lg bg-transparent border border-subtle text-dim hover:bg-surface2 hover:text-foreground transition-colors">📡 Trimite la Google</button>
                <button onClick={() => toast.info("🔍 Audit complet rulat! Scor: 78/100")} className="text-xs px-3 py-1.5 rounded-lg bg-transparent border border-subtle text-dim hover:bg-surface2 hover:text-foreground transition-colors">🔍 Rulează Audit</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* DOMAIN MODAL */}
      <Dialog open={domainModal} onOpenChange={setDomainModal}>
        <DialogContent className="bg-surface border-subtle max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="font-serif text-[15px]">🌐 Configurare Domeniu</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <div>
              <label className="text-[10.5px] font-bold tracking-wider uppercase text-dim block mb-1">Domeniu personalizat</label>
              <input value={domainInput} onChange={e => setDomainInput(e.target.value)} className="w-full bg-surface2 border border-subtle rounded-lg px-3 py-2 text-[13px] text-foreground outline-none focus:border-gold transition-colors" placeholder="ex. agentiatamara.ro" />
              <div className="text-[11px] text-dim mt-1">Introdu domeniul tău sau vom genera automat un subdomeniu gratuit.</div>
            </div>
            <div className="bg-surface2 rounded-lg p-3">
              <div className="text-[11.5px] font-semibold text-gold mb-2">📦 Subdomeniu gratuit inclus:</div>
              <div className="text-[13px] font-serif">{slug}.societyhub.ro</div>
            </div>
          </div>
          <DialogFooter>
            <button onClick={() => setDomainModal(false)} className="text-xs px-3 py-1.5 rounded-lg bg-transparent border border-subtle text-dim hover:bg-surface2 transition-colors">Anulează</button>
            <button onClick={saveDomain} className="text-xs px-4 py-1.5 rounded-lg bg-gradient-to-r from-gold to-gold/80 text-primary-foreground font-bold hover:opacity-90 transition-all">💾 Salvează</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}

/* ─── SITE PREVIEW ─────────────────────────────────────────────── */
function SitePreview({ bg, bg2, textColor, mutedColor, borderAlpha, inputBg, inputBorder, activeAccent, agencyName, agencySlogan, agencyPhone, sections, simulateFormSubmit }: {
  bg: string; bg2: string; textColor: string; mutedColor: string; borderAlpha: string; inputBg: string; inputBorder: string;
  activeAccent: string; agencyName: string; agencySlogan: string; agencyPhone: string; sections: Section[]; simulateFormSubmit: () => void;
}) {
  const secOn = (id: string) => sections.find(s => s.id === id)?.on;
  const isLight = bg === "#f8f9fa";

  return (
    <div style={{ background: bg, color: textColor, minHeight: "100%", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ padding: "14px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", background: bg2, borderBottom: `1px solid ${borderAlpha}` }}>
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 800, color: textColor }}>{agencyName}</div>
        <div style={{ display: "flex", gap: 14, fontSize: 11.5 }}>
          {["Acasă", "Proprietăți", "Agenți", "Contact"].map(n => <span key={n} style={{ color: mutedColor, cursor: "pointer" }}>{n}</span>)}
        </div>
        <button style={{ padding: "7px 14px", background: activeAccent, color: "#0a0b0f", border: "none", borderRadius: 6, fontSize: 11.5, fontWeight: 700, cursor: "pointer", fontFamily: "'Syne', sans-serif" }}>{agencyPhone}</button>
      </div>

      {secOn("hero") && (
        <div style={{ padding: "44px 24px 36px", textAlign: "center", background: isLight ? "linear-gradient(135deg,#eef2ff,#dbeafe)" : `linear-gradient(135deg,${activeAccent}22,${activeAccent}08)` }}>
          <div style={{ display: "inline-block", padding: "4px 12px", borderRadius: 20, fontSize: 10.5, fontWeight: 600, marginBottom: 12, background: `${activeAccent}22`, color: activeAccent, border: `1px solid ${activeAccent}44` }}>AGENȚIE PREMIUM BUCUREȘTI</div>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 26, fontWeight: 800, lineHeight: 1.2, marginBottom: 10 }}>{agencySlogan}</h2>
          <p style={{ fontSize: 13, color: mutedColor, marginBottom: 20, maxWidth: 420, marginLeft: "auto", marginRight: "auto" }}>Peste 500 de proprietăți premium în portofoliu.</p>
          {secOn("search") && (
            <div style={{ background: isLight ? "rgba(255,255,255,.9)" : "rgba(255,255,255,.07)", border: `1px solid ${inputBorder}`, borderRadius: 10, padding: "10px 14px", display: "flex", alignItems: "center", gap: 8, maxWidth: 480, margin: "0 auto" }}>
              <span>🔍</span>
              <input style={{ background: "none", border: "none", flex: 1, fontSize: 13, outline: "none", color: textColor, fontFamily: "'DM Sans', sans-serif" }} placeholder="Caută proprietăți în București…" readOnly />
              <button style={{ padding: "7px 14px", background: activeAccent, color: "#0a0b0f", border: "none", borderRadius: 7, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'Syne', sans-serif" }}>Caută</button>
            </div>
          )}
        </div>
      )}

      {secOn("properties") && (
        <div style={{ padding: 24 }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Proprietăți de Top</div>
          <div style={{ fontSize: 12, color: mutedColor, marginBottom: 16 }}>Sincronizate live din CRM</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
            {PROPERTIES_MINI.map((p, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,.05)", border: `1px solid ${borderAlpha}`, borderRadius: 10, overflow: "hidden", cursor: "pointer" }}>
                <div style={{ height: 100, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, background: p.bg, position: "relative" }}>
                  <span>{p.icon}</span>
                  <span style={{ position: "absolute", top: 6, left: 6, fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 4, background: p.status === "Disponibil" ? "rgba(74,222,128,.2)" : "rgba(251,191,36,.2)", color: p.status === "Disponibil" ? "#4ade80" : "#fbbf24" }}>● {p.status}</span>
                </div>
                <div style={{ padding: 10 }}>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 700, color: activeAccent, marginBottom: 3 }}>{fmtEur(p.price)}</div>
                  <div style={{ fontSize: 11, opacity: 0.8, marginBottom: 4 }}>{p.title}</div>
                  <div style={{ fontSize: 10, color: mutedColor }}>{p.meta}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {secOn("agents") && (
        <div style={{ padding: "0 24px 24px" }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Echipa Noastră</div>
          <div style={{ fontSize: 12, color: mutedColor, marginBottom: 14 }}>Profesioniști în piața imobiliară</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            {[{ i: "AI", n: "Andrei Ionescu", r: "Senior Agent", g: `linear-gradient(135deg,${activeAccent},#b8895e)` },
              { i: "MC", n: "Maria Constantin", r: "Agent Rezidențial", g: "linear-gradient(135deg,#60a5fa,#3b82f6)" },
              { i: "RP", n: "Radu Popescu", r: "Agent Comercial", g: "linear-gradient(135deg,#4ade80,#22c55e)" }].map((a, idx) => (
              <div key={idx} style={{ background: "rgba(255,255,255,.04)", border: `1px solid ${borderAlpha}`, borderRadius: 9, padding: 14, textAlign: "center" }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, margin: "0 auto 8px", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14, color: "#0a0b0f", background: a.g }}>{a.i}</div>
                <div style={{ fontSize: 12, fontWeight: 600 }}>{a.n}</div>
                <div style={{ fontSize: 10, color: mutedColor }}>{a.r}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {secOn("contact") && (
        <div style={{ padding: 24, background: isLight ? "#f0f4ff" : "rgba(255,255,255,.03)", borderTop: `1px solid ${borderAlpha}` }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Contactează-ne</div>
          <div style={{ fontSize: 12, color: mutedColor, marginBottom: 14 }}>Lead-urile intră direct în CRM</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
            <input style={{ background: inputBg, border: `1px solid ${inputBorder}`, borderRadius: 7, padding: "9px 12px", fontSize: 12, color: textColor, outline: "none" }} placeholder="Nume complet" readOnly />
            <input style={{ background: inputBg, border: `1px solid ${inputBorder}`, borderRadius: 7, padding: "9px 12px", fontSize: 12, color: textColor, outline: "none" }} placeholder="Telefon / Email" readOnly />
          </div>
          <textarea style={{ width: "100%", background: inputBg, border: `1px solid ${inputBorder}`, borderRadius: 7, padding: "9px 12px", fontSize: 12, color: textColor, outline: "none", resize: "none", marginBottom: 8 }} rows={3} placeholder="Mesaj…" readOnly />
          <button onClick={simulateFormSubmit} style={{ width: "100%", padding: 10, background: activeAccent, color: "#0a0b0f", border: "none", borderRadius: 7, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Syne', sans-serif" }}>Trimite Mesaj → CRM</button>
        </div>
      )}

      <div style={{ padding: "16px 24px", borderTop: `1px solid ${borderAlpha}`, display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 11, color: mutedColor }}>
        <span>{agencyName} © 2026</span>
        <span>Powered by <strong style={{ color: activeAccent }}>SocietyHUB</strong></span>
      </div>
    </div>
  );
}
