import { useState, useMemo, useCallback, useRef } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

/* ─── DATA ─────────────────────────────────────────────────────── */
interface Portal {
  id: string; name: string; logo: string; plan: string;
  views30: number; contacts30: number; trend: number;
  connected: boolean; liveAds: number; color: string;
}

const PORTALS: Portal[] = [
  { id: "imobiliare", name: "Imobiliare.ro", logo: "🏠", plan: "Premium", views30: 8420, contacts30: 87, trend: 12, connected: true, liveAds: 12, color: "#e8502a" },
  { id: "storia", name: "Storia.ro", logo: "🏡", plan: "Standard", views30: 5810, contacts30: 54, trend: 8, connected: true, liveAds: 10, color: "#00a651" },
  { id: "olx", name: "OLX Imobiliare", logo: "🛒", plan: "Gratuit", views30: 4230, contacts30: 41, trend: -3, connected: true, liveAds: 8, color: "#6c2eff" },
  { id: "publi24", name: "Publi24", logo: "📰", plan: "Standard", views30: 2100, contacts30: 22, trend: 5, connected: true, liveAds: 7, color: "#ff6b35" },
  { id: "anuntul", name: "Anuntul.ro", logo: "📣", plan: "Gratuit", views30: 1540, contacts30: 18, trend: 2, connected: true, liveAds: 6, color: "#2196f3" },
  { id: "romimo", name: "Romimo.ro", logo: "🏘", plan: "Premium", views30: 1280, contacts30: 15, trend: 6, connected: true, liveAds: 5, color: "#9c27b0" },
  { id: "bazareal", name: "BazaReal", logo: "🗺", plan: "Standard", views30: 980, contacts30: 11, trend: -1, connected: true, liveAds: 4, color: "#ff9800" },
  { id: "euroimob", name: "Euro-Imobiliare", logo: "🌍", plan: "Standard", views30: 760, contacts30: 9, trend: 3, connected: true, liveAds: 3, color: "#00bcd4" },
  { id: "homezu", name: "Homezu", logo: "🏗", plan: "Premium", views30: 640, contacts30: 7, trend: 4, connected: true, liveAds: 2, color: "#4caf50" },
  { id: "remax", name: "RE/MAX Network", logo: "🔴", plan: "Premium", views30: 530, contacts30: 6, trend: 1, connected: true, liveAds: 2, color: "#e53935" },
];

interface Property {
  id: number; title: string; price: number; icon: string;
  type: string; zone: string; surface: number; status: "live" | "draft";
}

const PROPERTIES: Property[] = [
  { id: 1, title: "Apt. 3 cam. – Floreasca 42", price: 185000, icon: "🏢", type: "Apartament", zone: "Floreasca", surface: 78, status: "live" },
  { id: 2, title: "Vilă Pipera Exclusive", price: 425000, icon: "🏠", type: "Casă", zone: "Pipera", surface: 220, status: "live" },
  { id: 3, title: "Apt. 2 cam. – Vitan Mall", price: 112000, icon: "🏢", type: "Apartament", zone: "Sector 4", surface: 54, status: "draft" },
  { id: 4, title: "Apt. 4 cam. – Dorobanți Lux", price: 340000, icon: "🏢", type: "Apartament", zone: "Dorobanți", surface: 110, status: "live" },
  { id: 5, title: "Teren 450m² – Baneasa", price: 68500, icon: "🏗️", type: "Teren", zone: "Baneasa", surface: 450, status: "draft" },
  { id: 6, title: "Sp. Comercial – Dorobanți", price: 290000, icon: "🏬", type: "Comercial", zone: "Dorobanți", surface: 145, status: "live" },
];

const DESCRIPTIONS: Record<number, string> = {
  1: `Apartament 3 camere cu finisaje premium în complexul Floreasca Residence, unul dintre cele mai exclusiviste proiecte rezidențiale din nordul Bucureștiului.\n\nApartamentul se află la etajul 5 din 8 și beneficiază de o priveliște panoramică spre Parcul Floreasca. Suprafața utilă de 78 mp este repartizată inteligent: living open-space cu bucătărie echipată complet, 2 dormitoare confortabile, 2 băi cu finisaje italiene și un balcon de 8 mp.\n\n🔑 Dotări: aer condiționat în toate camerele, pardoseală laminat premium, ferestre triple, sistem smart home, loc de parcare subteran inclus, boxă de depozitare.\n\n📍 Localizare excelentă: 5 min. Parc Floreasca, 10 min. Piața Victoriei, acces rapid DN1 și Centură.`,
};
const DEFAULT_DESC = `Proprietate excepțională cu finisaje de calitate superioară, amplasată într-o zonă rezidențială de prestigiu din București.\n\nSpațiul generos și bine compartimentat oferă confort maxim pentru o familie modernă. Dotări complete, acces facil la mijloace de transport și facilități urbane.\n\n📞 Contactați-ne pentru programarea unei vizionări sau pentru detalii suplimentare.`;

function fmtEur(n: number) {
  if (n >= 1e6) return "€" + (n / 1e6).toFixed(2) + "M";
  if (n >= 1e3) return "€" + (n / 1e3).toFixed(0) + "K";
  return "€" + n;
}

interface ActivityItem { icon: string; text: string; time: string; }

/* ─── SEO CALC ─────────────────────────────────────────────────── */
function calcSeo(title: string, desc: string, kw: string, zone?: string) {
  let score = 0;
  const tips: { ok?: boolean; warn?: boolean; text: string }[] = [];
  if (title.length >= 20 && title.length <= 80) { score += 25; tips.push({ ok: true, text: "Titlu de lungime optimă" }); }
  else tips.push({ text: title.length < 20 ? "Titlu prea scurt (min 20)" : "Titlu prea lung (max 80)" });
  if (desc.length >= 300) { score += 30; tips.push({ ok: true, text: `Descriere detaliată (${desc.length} car.)` }); }
  else if (desc.length >= 100) { score += 15; tips.push({ warn: true, text: "Descriere prea scurtă (recomandat 300+)" }); }
  else tips.push({ text: "Descriere insuficientă" });
  if (kw.split(",").filter(k => k.trim().length > 2).length >= 3) { score += 20; tips.push({ ok: true, text: "Cuvinte cheie OK" }); }
  else tips.push({ warn: true, text: "Adaugă min. 3 cuvinte cheie" });
  if (title.length > 0 && desc.length > 0) { score += 15; tips.push({ ok: true, text: "Titlu și descriere completate" }); }
  if (zone && desc.toLowerCase().includes(zone.toLowerCase())) { score += 10; tips.push({ ok: true, text: "Zona menționată în descriere" }); }
  return { score: Math.min(100, score), tips: tips.slice(0, 4) };
}

/* ─── SPARKLINE ────────────────────────────────────────────────── */
function Sparkline({ data, positive }: { data: number[]; positive: boolean }) {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-[2px] h-7">
      {data.map((v, i) => (
        <div
          key={i}
          className="w-1.5 rounded-t-sm opacity-70 hover:opacity-50 transition-opacity"
          style={{
            height: `${Math.round((v / max) * 28)}px`,
            backgroundColor: positive ? "hsl(var(--blue))" : "hsl(var(--red))",
          }}
        />
      ))}
    </div>
  );
}

/* ─── MAIN COMPONENT ──────────────────────────────────────────── */
export default function Portale() {
  const [selectedProp, setSelectedProp] = useState<Property | null>(PROPERTIES[0]);
  const [selectedPortals, setSelectedPortals] = useState<Set<string>>(new Set(["imobiliare", "storia", "olx", "publi24", "anuntul"]));
  const [tplTitle, setTplTitle] = useState("");
  const [tplDesc, setTplDesc] = useState("");
  const [tplKeywords, setTplKeywords] = useState("");
  const [activeTab, setActiveTab] = useState("general");
  const [statPeriod, setStatPeriod] = useState(30);
  const [activity, setActivity] = useState<ActivityItem[]>([
    { icon: "🔄", text: "Sincronizare automată completă — toate portalele actualizate", time: new Date().toLocaleTimeString("ro", { hour: "2-digit", minute: "2-digit" }) },
    { icon: "📤", text: "Apt. 3 cam. Floreasca publicat pe Imobiliare.ro, Storia.ro, OLX", time: new Date().toLocaleTimeString("ro", { hour: "2-digit", minute: "2-digit" }) },
    { icon: "📸", text: "Poze actualizate pentru Vilă Pipera — 12 imagini noi", time: new Date().toLocaleTimeString("ro", { hour: "2-digit", minute: "2-digit" }) },
  ]);
  const [publishing, setPublishing] = useState(false);
  const [publishProgress, setPublishProgress] = useState(0);
  const [publishSteps, setPublishSteps] = useState<{ portal: Portal; status: "waiting" | "active" | "done" }[]>([]);
  const [publishDone, setPublishDone] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState("—");
  const [extraLive, setExtraLive] = useState(0);
  const [statsModal, setStatsModal] = useState(false);

  const publishTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  // ── helpers ──
  const addLog = useCallback((icon: string, text: string) => {
    const time = new Date().toLocaleTimeString("ro", { hour: "2-digit", minute: "2-digit" });
    setActivity(prev => [{ icon, text, time }, ...prev].slice(0, 20));
  }, []);

  const selectProp = useCallback((p: Property) => {
    setSelectedProp(p);
    setTplTitle(`${p.title} – ${p.zone} | ${p.surface}m²`);
    setTplDesc(DESCRIPTIONS[p.id] || DEFAULT_DESC);
    setTplKeywords(`${p.type.toLowerCase()} ${p.zone.toLowerCase()}, ${p.surface}m², ${fmtEur(p.price)}, imobiliare bucuresti`);
    addLog("🏠", `Proprietate selectată: <strong>${p.title}</strong>`);
  }, [addLog]);

  // Init first prop template
  useMemo(() => {
    if (selectedProp && !tplTitle) {
      setTplTitle(`${selectedProp.title} – ${selectedProp.zone} | ${selectedProp.surface}m²`);
      setTplDesc(DESCRIPTIONS[selectedProp.id] || DEFAULT_DESC);
      setTplKeywords(`${selectedProp.type.toLowerCase()} ${selectedProp.zone.toLowerCase()}, ${selectedProp.surface}m², ${fmtEur(selectedProp.price)}, imobiliare bucuresti`);
    }
  }, []); // eslint-disable-line

  const togglePortal = (id: string) => {
    setSelectedPortals(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const seo = useMemo(() => calcSeo(tplTitle, tplDesc, tplKeywords, selectedProp?.zone), [tplTitle, tplDesc, tplKeywords, selectedProp]);

  const totalLive = useMemo(() => PORTALS.reduce((s, p) => s + p.liveAds, 0) + extraLive, [extraLive]);

  // ── AI Generators ──
  const titleTemplates = [
    (p: Property) => `${p.type} ${p.surface}m² ultramod – ${p.zone} | ${fmtEur(p.price)}`,
    (p: Property) => `De vânzare: ${p.type} premium în ${p.zone} – ${p.surface}m²`,
    (p: Property) => `${p.type} ${p.surface}m², finisaje lux – ${p.zone}, ${fmtEur(p.price)}`,
    (p: Property) => `Oportunitate ${p.zone}: ${p.type} ${p.surface}m² – ${fmtEur(p.price)}`,
  ];

  const genTitle = () => {
    if (!selectedProp) { toast.warning("Selectează o proprietate mai întâi"); return; }
    setTplTitle(titleTemplates[Math.floor(Math.random() * titleTemplates.length)](selectedProp));
    toast.success("✨ Titlu generat cu AI");
  };
  const genDesc = () => {
    if (!selectedProp) { toast.warning("Selectează o proprietate mai întâi"); return; }
    const p = selectedProp;
    setTplDesc(`${p.type} premium de ${p.surface}m², amplasat strategic în zona ${p.zone}, una dintre cele mai căutate zone rezidențiale din București.\n\n🏠 Caracteristici principale:\n• Suprafață utilă: ${p.surface}m²\n• Tip: ${p.type}\n• Zonă: ${p.zone}\n• Preț: ${fmtEur(p.price)}\n\n✅ Proprietatea beneficiază de finisaje de înaltă calitate, iluminat natural abundent și compartimentare funcțională.\n\nLocalizare excelentă cu acces rapid la transport public, școli, centre comerciale și spații verze.\n\n📞 Contactați-ne pentru detalii sau pentru a programa o vizionare.\n\n#${p.type.toLowerCase().replace(/ /g, "")} #${p.zone.toLowerCase().replace(/ /g, "")} #imobiliare #bucuresti`);
    toast.success("✨ Descriere generată cu AI");
  };
  const genKeywords = () => {
    if (!selectedProp) { toast.warning("Selectează o proprietate mai întâi"); return; }
    const p = selectedProp;
    setTplKeywords([p.type.toLowerCase(), `${p.type.toLowerCase()} ${p.zone.toLowerCase()}`, `vanzare ${p.type.toLowerCase()}`, p.zone.toLowerCase(), "imobiliare bucuresti", `${p.surface}m2`, `${fmtEur(p.price).replace("€", "").trim()} euro`, `${p.type.toLowerCase()} premium`].join(", "));
    toast.success("✨ Cuvinte cheie generate cu AI");
  };
  const generateAll = () => {
    if (!selectedProp) { toast.warning("Selectează o proprietate mai întâi"); return; }
    genTitle();
    setTimeout(genDesc, 200);
    setTimeout(genKeywords, 400);
    setTimeout(() => toast.success("✅ Tot template-ul generat cu AI"), 600);
  };

  // ── PUBLISH ──
  const triggerPublish = () => {
    if (!selectedProp) { toast.warning("Selectează mai întâi o proprietate!"); return; }
    if (!selectedPortals.size) { toast.warning("Selectează cel puțin un portal!"); return; }
    if (publishing) return;
    setPublishing(true);
    setPublishDone(false);
    setPublishProgress(0);
    const portalsToPublish = PORTALS.filter(p => selectedPortals.has(p.id));
    const steps = portalsToPublish.map(p => ({ portal: p, status: "waiting" as const }));
    setPublishSteps(steps);

    let done = 0;
    const total = portalsToPublish.length;
    portalsToPublish.forEach((portal, i) => {
      const delay1 = 300 + i * 700;
      const delay2 = 600 + i * 700 + Math.random() * 400;
      const t1 = setTimeout(() => {
        setPublishSteps(prev => prev.map(s => s.portal.id === portal.id ? { ...s, status: "active" } : s));
      }, delay1);
      const t2 = setTimeout(() => {
        done++;
        const pct = Math.round((done / total) * 100);
        setPublishSteps(prev => prev.map(s => s.portal.id === portal.id ? { ...s, status: "done" } : s));
        setPublishProgress(pct);
        setExtraLive(prev => prev + 1);
        setLastSync("Acum");
        addLog(portal.logo, `Publicat pe <strong>${portal.name}</strong>: ${selectedProp!.title}`);
        if (done === total) {
          setPublishDone(true);
          toast.success(`🎉 Anunț publicat pe ${total} portale cu succes!`);
          setTimeout(() => { setPublishing(false); setPublishDone(false); setPublishProgress(0); setPublishSteps([]); }, 4000);
        }
      }, delay2);
      publishTimers.current.push(t1, t2);
    });
  };

  // ── SYNC ──
  const runSync = () => {
    if (syncing) return;
    setSyncing(true);
    toast.info("🔄 Sincronizare în curs pe toate portalele…");
    setTimeout(() => {
      setSyncing(false);
      setLastSync("Acum");
      addLog("🔄", "Sincronizare automată completă — prețuri și poze actualizate pe toate portalele");
      toast.success("✅ Sincronizare completă!");
    }, 2500);
  };

  // ── Tabs for templates ──
  const selectedPortalList = useMemo(() => PORTALS.filter(p => selectedPortals.has(p.id)), [selectedPortals]);

  // ── Stats per portal ──
  const sparkData = useMemo(() => [40, 55, 62, 48, 70, 58, 65, 72, 60, 55, 68, 75, 58, 80], []);

  const canPublish = !!selectedProp && selectedPortals.size > 0 && !publishing;

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 flex flex-col gap-5 animate-fade-up">

        {/* ── HEADER ── */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 bg-gold-dim border border-gold/20 rounded-[10px] flex items-center justify-center text-lg">📤</div>
              <h1 className="font-serif text-xl md:text-[22px] font-bold">Portale Imobiliare</h1>
              <span className="text-[10.5px] font-bold tracking-wider px-2 py-0.5 rounded bg-[hsl(48_100%_50%/0.12)] border border-[hsl(48_100%_50%/0.25)] text-[hsl(48,100%,50%)]">ÎN DEZVOLTARE</span>
            </div>
            <p className="text-[13.5px] text-dim ml-[52px]">Publică anunțuri simultan pe 10 platforme dintr-un singur click. Sincronizare automată preț, poze și descrieri.</p>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <div className="text-[11px] text-dim">Anunțuri active azi</div>
            <div className="font-serif text-[22px] font-bold text-teal">{totalLive}</div>
            <div className="text-[11px] text-dim">pe <span className="text-gold font-semibold">{selectedPortals.size}</span> platforme</div>
          </div>
        </div>

        {/* ── KPI STATS ── */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 animate-fade-up-delay-1">
          {[
            { label: "Vizualizări Totale", value: "24,813", sub: "↑ 12% față de săpt. trecută", color: "gold", subC: "text-teal" },
            { label: "Contacte Generate", value: "312", sub: "↑ 23 luna aceasta", color: "teal", subC: "text-teal" },
            { label: "Anunțuri Live", value: String(totalLive), sub: "pe toate platformele", color: "blue" },
            { label: "Portale Conectate", value: "10", sub: "Din 10 disponibile", color: "purple" },
            { label: "Ultima Sincronizare", value: lastSync, sub: `Status: ${syncing ? "Sincronizare…" : "OK"}`, color: "yellow", subC: syncing ? "text-[hsl(var(--gold))]" : "text-teal" },
          ].map((s, i) => (
            <div key={i} className="bg-surface border border-subtle rounded-xl p-4 relative overflow-hidden hover:border-gold/25 transition-all hover:-translate-y-px group">
              <div className={`absolute top-0 left-0 right-0 h-0.5 ${s.color === "gold" ? "bg-gradient-to-r from-gold to-gold/60" : s.color === "teal" ? "bg-teal" : s.color === "blue" ? "bg-info" : s.color === "purple" ? "bg-purple" : "bg-[hsl(var(--gold))]"}`} />
              <div className="text-[10px] font-semibold tracking-wider uppercase text-dim mb-1.5">{s.label}</div>
              <div className={`font-serif ${s.label === "Ultima Sincronizare" ? "text-lg" : "text-2xl"} font-bold leading-none`}>{s.value}</div>
              <div className={`text-[11px] mt-1 ${s.subC || "text-dim"}`}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* ── MAIN LAYOUT ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5 animate-fade-up-delay-2">

          {/* ── LEFT COLUMN ── */}
          <div className="flex flex-col gap-4">

            {/* PROPERTY SELECTOR */}
            <div className="bg-surface border border-subtle rounded-xl">
              <div className="px-4 py-3 border-b border-subtle flex items-center justify-between">
                <div className="font-serif text-[13px] font-bold">🏠 Selectează Proprietate</div>
                <div className="text-xs text-dim">{selectedProp ? selectedProp.title : "Nicio proprietate selectată"}</div>
              </div>
              <div className="p-3.5 grid grid-cols-2 md:grid-cols-3 gap-2.5">
                {PROPERTIES.map(p => (
                  <div
                    key={p.id}
                    onClick={() => selectProp(p)}
                    className={`bg-surface2 border rounded-[9px] p-3 cursor-pointer transition-all relative ${selectedProp?.id === p.id ? "border-gold bg-gold/[0.06]" : "border-subtle hover:border-gold/30"}`}
                  >
                    {selectedProp?.id === p.id && (
                      <div className="absolute top-2 right-2 w-[18px] h-[18px] rounded-[5px] bg-gold flex items-center justify-center text-[10px] text-primary-foreground font-bold">✓</div>
                    )}
                    <div className="text-[22px] mb-1.5">{p.icon}</div>
                    <div className="text-xs font-semibold leading-tight mb-0.5">{p.title}</div>
                    <div className="font-serif text-sm font-bold text-gold">{fmtEur(p.price)}</div>
                    <div className="text-[11px] text-dim mt-0.5">{p.surface}m² · {p.zone}</div>
                    <span className={`absolute bottom-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded ${p.status === "live" ? "bg-teal/15 text-teal" : "bg-surface2 text-dim"}`}>
                      {p.status === "live" ? "● LIVE" : "○ DRAFT"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* PORTAL SELECTOR */}
            <div className="bg-surface border border-subtle rounded-xl">
              <div className="px-4 py-3 border-b border-subtle flex items-center justify-between flex-wrap gap-2">
                <div className="font-serif text-[13px] font-bold">🌐 Selectează Portale</div>
                <div className="flex gap-2 items-center">
                  <button onClick={() => setSelectedPortals(new Set(PORTALS.map(p => p.id)))} className="text-xs px-3 py-1.5 rounded-lg bg-transparent border border-subtle text-dim hover:bg-surface2 hover:text-foreground transition-colors">Toate</button>
                  <button onClick={() => setSelectedPortals(new Set())} className="text-xs px-3 py-1.5 rounded-lg bg-transparent border border-subtle text-dim hover:bg-surface2 hover:text-foreground transition-colors">Niciunul</button>
                  <span className="text-xs text-dim">{selectedPortals.size} selectate</span>
                </div>
              </div>
              <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                {PORTALS.map(p => {
                  const sel = selectedPortals.has(p.id);
                  return (
                    <div
                      key={p.id}
                      onClick={() => togglePortal(p.id)}
                      className={`bg-surface2 border-2 rounded-[10px] p-3 cursor-pointer transition-all text-center relative select-none hover:-translate-y-px ${sel ? "border-gold bg-gold/[0.07]" : "border-subtle hover:border-gold/30"}`}
                    >
                      {sel && <span className="absolute top-1.5 right-2 text-[11px] font-bold text-gold">✓</span>}
                      <div className="text-[28px] mb-1.5">{p.logo}</div>
                      <div className="font-serif text-xs font-bold">{p.name}</div>
                      <div className="text-[10px] text-dim">{p.plan}</div>
                      <div className={`inline-flex items-center gap-1 text-[10px] font-semibold mt-1.5 px-1.5 py-0.5 rounded ${sel ? "bg-teal/12 text-teal" : p.plan === "Premium" ? "bg-gold/10 text-gold" : "bg-info/10 text-info-blue"}`}>
                        {sel ? "● Selectat" : p.plan === "Premium" ? "★ Premium" : "○ Disponibil"}
                      </div>
                      {p.liveAds > 0 && <div className="text-[10.5px] text-dim mt-1">{p.liveAds} anunțuri live</div>}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* TEMPLATE EDITOR */}
            <div className="bg-surface border border-subtle rounded-xl">
              <div className="px-4 py-3 flex items-center justify-between">
                <div className="font-serif text-[13px] font-bold">🎨 Template Anunț</div>
                <button onClick={generateAll} className="text-xs px-3 py-1.5 rounded-lg bg-transparent border border-subtle text-dim hover:bg-surface2 hover:text-foreground transition-colors">✨ Generează cu AI</button>
              </div>
              {/* Tabs */}
              <div className="flex gap-0.5 px-2 bg-surface">
                <button onClick={() => setActiveTab("general")} className={`px-3.5 py-2 rounded-t-lg text-xs font-medium border-b-2 transition-all ${activeTab === "general" ? "border-gold text-gold bg-gold/[0.06]" : "border-transparent text-dim hover:text-foreground"}`}>
                  General
                </button>
                {selectedPortalList.slice(0, 5).map(p => (
                  <button
                    key={p.id}
                    onClick={() => { setActiveTab(p.id); toast.info(`📝 Template pentru ${p.name} — adaptat automat`); }}
                    className={`px-3.5 py-2 rounded-t-lg text-xs font-medium border-b-2 transition-all ${activeTab === p.id ? "border-gold text-gold bg-gold/[0.06]" : "border-transparent text-dim hover:text-foreground"}`}
                  >
                    {p.logo} {p.name.split(".")[0].split(" ")[0]}
                  </button>
                ))}
              </div>

              <div className="p-4">
                {/* SEO Score */}
                <div className="flex items-center gap-3 p-3 bg-surface2 rounded-lg mb-3">
                  <div>
                    <div className="text-[10px] font-semibold tracking-wider uppercase text-dim mb-0.5">Scor SEO</div>
                    <div className={`font-serif text-lg font-extrabold ${seo.score >= 80 ? "text-teal" : seo.score >= 50 ? "text-gold" : "text-danger"}`}>{seo.score}</div>
                  </div>
                  <div className="flex flex-col gap-1 flex-1">
                    {seo.tips.map((t, i) => (
                      <div key={i} className={`text-[11px] flex items-center gap-1.5 ${t.ok ? "text-teal" : t.warn ? "text-gold" : "text-danger"}`}>
                        {t.ok ? "✓" : t.warn ? "⚡" : "✗"} {t.text}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Title */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-bold tracking-wider uppercase text-dim">Titlu Anunț</label>
                    <button onClick={genTitle} className="text-[10px] font-semibold text-gold bg-gold/10 border border-gold/20 rounded px-1.5 py-0.5 hover:bg-gold/20 transition-colors">✨ Generează</button>
                  </div>
                  <input value={tplTitle} onChange={e => setTplTitle(e.target.value)} className="w-full bg-surface2 border border-subtle rounded-lg px-3 py-2.5 text-[13px] text-foreground outline-none focus:border-gold transition-colors" placeholder="Titlul anunțului…" />
                  <div className="text-[10.5px] text-dim text-right mt-1">{tplTitle.length} / 80 caractere</div>
                </div>

                {/* Desc */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-bold tracking-wider uppercase text-dim">Descriere Completă</label>
                    <button onClick={genDesc} className="text-[10px] font-semibold text-gold bg-gold/10 border border-gold/20 rounded px-1.5 py-0.5 hover:bg-gold/20 transition-colors">✨ Generează</button>
                  </div>
                  <textarea value={tplDesc} onChange={e => setTplDesc(e.target.value)} rows={7} className="w-full bg-surface2 border border-subtle rounded-lg px-3 py-2.5 text-[13px] text-foreground outline-none focus:border-gold transition-colors resize-y" placeholder="Descrierea proprietății…" />
                  <div className="text-[10.5px] text-dim text-right mt-1">{tplDesc.length} / 2000 caractere</div>
                </div>

                {/* Keywords */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-bold tracking-wider uppercase text-dim">Cuvinte Cheie SEO</label>
                    <button onClick={genKeywords} className="text-[10px] font-semibold text-gold bg-gold/10 border border-gold/20 rounded px-1.5 py-0.5 hover:bg-gold/20 transition-colors">✨ Generează</button>
                  </div>
                  <input value={tplKeywords} onChange={e => setTplKeywords(e.target.value)} className="w-full bg-surface2 border border-subtle rounded-lg px-3 py-2.5 text-[13px] text-foreground outline-none focus:border-gold transition-colors" placeholder="ex. apartament floreasca, 3 camere, lux…" />
                </div>

                <div className="flex gap-2">
                  <button onClick={() => { toast.success("💾 Draft salvat cu succes!"); addLog("💾", `Draft salvat: ${selectedProp?.title || "Anunț"}`); }} className="flex-1 text-xs py-2.5 rounded-lg bg-transparent border border-subtle text-dim hover:bg-surface2 hover:text-foreground transition-colors font-medium">💾 Salvează Draft</button>
                  <button onClick={triggerPublish} disabled={!canPublish} className="flex-[2] text-xs py-2.5 rounded-[9px] bg-gradient-to-r from-gold to-gold/80 text-primary-foreground font-bold hover:opacity-90 hover:-translate-y-px transition-all disabled:opacity-40 disabled:cursor-not-allowed">⚡ Publică Acum</button>
                </div>
              </div>
            </div>

            {/* PUBLISH BAR */}
            <div className="bg-surface border border-subtle rounded-xl p-4 flex items-center gap-3 flex-wrap">
              <div className="flex-1 min-w-[150px]">
                <div className="font-serif text-[13px] font-bold mb-0.5">
                  {publishDone ? "✅ Publicat cu succes!" : selectedProp ? selectedProp.title : "Gata de publicare"}
                </div>
                <div className="text-xs text-dim">
                  {!selectedProp ? "Selectează o proprietate și cel puțin un portal" :
                    selectedPortals.size === 0 ? "Selectează cel puțin un portal" :
                      <>Se va publica pe <span className="text-gold font-semibold">{selectedPortals.size} portale</span>: {selectedPortalList.map(p => p.name.split(".")[0].split(" ")[0]).join(", ")}</>}
                </div>
              </div>
              <button onClick={runSync} disabled={syncing} className="px-4 py-2.5 bg-info/[0.08] text-info-blue border border-info/20 rounded-[9px] text-[13px] font-semibold hover:bg-info/15 transition-colors disabled:opacity-50 flex items-center gap-2">
                {syncing ? "⏳" : "🔄"} Sincronizează
              </button>
              <button onClick={triggerPublish} disabled={!canPublish} className="px-6 py-3 bg-gradient-to-r from-gold to-gold/80 text-primary-foreground rounded-[9px] font-serif text-sm font-extrabold hover:opacity-90 hover:-translate-y-px hover:shadow-[0_8px_24px_hsl(var(--gold)/0.3)] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2">
                {publishing ? "⏳" : publishDone ? "✅" : "⚡"} {publishing ? "Se publică…" : publishDone ? "Publicat!" : "Publică One-Click"}
              </button>
            </div>

            {/* PROGRESS */}
            {publishing && (
              <div className="bg-surface border border-subtle rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-serif text-[13px] font-bold">{publishDone ? "✅ Publicat cu succes!" : `Se publică pe ${publishSteps.length} portale…`}</div>
                  <div className="text-xs text-gold font-semibold">{publishProgress}%</div>
                </div>
                <div className="h-1.5 bg-surface2 rounded-full overflow-hidden mb-3">
                  <div className="h-full bg-gradient-to-r from-gold to-gold/70 rounded-full transition-all duration-400" style={{ width: `${publishProgress}%` }} />
                </div>
                <div className="flex flex-col gap-1 max-h-[120px] overflow-y-auto">
                  {publishSteps.map(s => (
                    <div key={s.portal.id} className={`flex items-center gap-2 text-xs animate-fade-up ${s.status === "done" ? "text-teal" : s.status === "active" ? "text-foreground" : "text-dim"}`}>
                      <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${s.status === "done" ? "bg-teal" : s.status === "active" ? "bg-gold shadow-[0_0_0_3px_hsl(var(--gold)/0.25)] animate-pulse" : "bg-[hsl(var(--text3))]"}`} />
                      <span>{s.portal.logo} {s.portal.name} — {s.status === "done" ? "✅ Publicat" : s.status === "active" ? "Se procesează…" : "În așteptare"}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="flex flex-col gap-3.5">

            {/* PORTAL STATS */}
            <div className="bg-surface border border-subtle rounded-xl">
              <div className="px-4 py-3 border-b border-subtle flex items-center justify-between">
                <div className="font-serif text-[13px] font-bold">📊 Statistici Portale</div>
                <select value={statPeriod} onChange={e => setStatPeriod(Number(e.target.value))} className="bg-surface2 border border-subtle rounded-md px-2 py-1 text-[11.5px] text-foreground outline-none">
                  <option value={7}>7 zile</option>
                  <option value={30}>30 zile</option>
                  <option value={90}>90 zile</option>
                </select>
              </div>
              {[...PORTALS].sort((a, b) => b.views30 - a.views30).map(p => {
                const views = Math.round(p.views30 * (statPeriod / 30) * (0.9 + Math.random() * 0.2));
                return (
                  <div key={p.id} onClick={() => toast.info(`📊 ${p.name} — ${p.views30.toLocaleString("ro")} vizualizări, ${p.contacts30} contacte (30 zile)`)} className="flex items-center gap-3 px-4 py-3 border-b border-subtle last:border-b-0 cursor-pointer hover:bg-surface2 transition-colors">
                    <div className="text-[22px] w-[38px] text-center shrink-0">{p.logo}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-semibold">{p.name}</div>
                      <div className="text-[11px] text-dim truncate">{p.liveAds} anunțuri · {p.contacts30} contacte · {p.plan}</div>
                      <Sparkline data={sparkData.slice(0, statPeriod > 14 ? 14 : 7)} positive={p.trend >= 0} />
                    </div>
                    <div className="text-right">
                      <div className="font-serif text-sm font-bold">{views.toLocaleString("ro")}</div>
                      <div className={`text-[10.5px] ${p.trend >= 0 ? "text-teal" : "text-danger"}`}>{p.trend >= 0 ? "↑" : "↓"} {Math.abs(p.trend)}%</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ACTIVITY LOG */}
            <div className="bg-surface border border-subtle rounded-xl">
              <div className="px-4 py-3 border-b border-subtle flex items-center justify-between">
                <div className="font-serif text-[13px] font-bold">📋 Activitate Recentă</div>
                <button onClick={() => setActivity([])} className="text-xs px-3 py-1.5 rounded-lg bg-transparent border border-subtle text-dim hover:bg-surface2 hover:text-foreground transition-colors">Șterge</button>
              </div>
              {activity.length === 0 ? (
                <div className="p-4 text-center text-[13px] text-dim">Nicio activitate recentă</div>
              ) : (
                activity.slice(0, 8).map((a, i) => (
                  <div key={i} className="flex gap-2.5 px-4 py-2.5 border-b border-subtle last:border-b-0">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs shrink-0 bg-gold/10">{a.icon}</div>
                    <div className="flex-1 text-xs text-dim leading-relaxed" dangerouslySetInnerHTML={{ __html: a.text }} />
                    <div className="text-[10.5px] text-dim2 shrink-0">{a.time}</div>
                  </div>
                ))
              )}
            </div>

            {/* QUICK ACTIONS */}
            <div className="bg-surface border border-subtle rounded-xl p-4">
              <div className="font-serif text-[13px] font-bold mb-3">⚡ Acțiuni Rapide</div>
              <div className="flex flex-col gap-1.5">
                {[
                  { icon: "🔄", label: "Sincronizează prețurile", action: runSync },
                  { icon: "📸", label: "Actualizează pozele", action: () => { toast.info("📸 Actualizare poze inițiată…"); setTimeout(() => { addLog("📸", "Poze actualizate pe toate portalele active"); toast.success("✅ Pozele au fost actualizate!"); }, 2000); } },
                  { icon: "⏸", label: "Pauzează toate anunțurile", action: () => { toast.warning("⏸ Toate anunțurile au fost puse pe pauză"); addLog("⏸", "Toate anunțurile au fost puse pe pauză"); } },
                  { icon: "📈", label: "Raport performanță complet", action: () => setStatsModal(true) },
                  { icon: "💳", label: "Verifică credite portale", action: () => toast.info("💳 Credite: Imobiliare.ro 450, Storia 120, OLX 0 (gratuit)") },
                ].map((a, i) => (
                  <button key={i} onClick={a.action} className="flex items-center gap-2 w-full text-left text-xs px-3 py-2 rounded-lg bg-transparent border border-subtle text-dim hover:bg-surface2 hover:text-foreground transition-colors">
                    {a.icon} {a.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── STATS MODAL ── */}
      <Dialog open={statsModal} onOpenChange={setStatsModal}>
        <DialogContent className="bg-surface border-subtle max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-[15px]">📊 Raport Performanță Portale</DialogTitle>
          </DialogHeader>
          <div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
              {[
                { val: PORTALS.reduce((s, p) => s + p.views30, 0).toLocaleString("ro"), label: "Vizualizări totale", cls: "text-gold" },
                { val: String(PORTALS.reduce((s, p) => s + p.contacts30, 0)), label: "Contacte totale", cls: "text-teal" },
                { val: String(PORTALS.reduce((s, p) => s + p.liveAds, 0)), label: "Anunțuri live", cls: "text-info-blue" },
                { val: (PORTALS.reduce((s, p) => s + p.contacts30, 0) / PORTALS.reduce((s, p) => s + p.views30, 0) * 100).toFixed(1) + "%", label: "Rată conversie", cls: "text-purple" },
              ].map((m, i) => (
                <div key={i} className="bg-surface2 rounded-[9px] p-3.5 text-center">
                  <div className={`font-serif text-xl font-bold ${m.cls}`}>{m.val}</div>
                  <div className="text-[11px] text-dim mt-1">{m.label}</div>
                </div>
              ))}
            </div>
            <div className="text-[11px] font-bold tracking-wider uppercase text-dim mb-2.5">Performanță per portal (30 zile)</div>
            {(() => {
              const totalViews = PORTALS.reduce((s, p) => s + p.views30, 0);
              return [...PORTALS].sort((a, b) => b.views30 - a.views30).map(p => (
                <div key={p.id} className="flex items-center gap-3 py-2.5 border-b border-subtle">
                  <span className="text-xl">{p.logo}</span>
                  <div className="flex-1">
                    <div className="text-[13px] font-semibold">{p.name}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-1.5 bg-surface2 rounded-full overflow-hidden">
                        <div className="h-full bg-gold rounded-full" style={{ width: `${Math.round(p.views30 / totalViews * 100)}%` }} />
                      </div>
                      <span className="text-[11px] text-dim w-[50px] text-right">{Math.round(p.views30 / totalViews * 100)}%</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-serif text-sm font-bold">{p.views30.toLocaleString("ro")}</div>
                    <div className={`text-[11px] ${p.trend >= 0 ? "text-teal" : "text-danger"}`}>{p.trend >= 0 ? "↑" : "↓"} {Math.abs(p.trend)}%</div>
                  </div>
                </div>
              ));
            })()}
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
