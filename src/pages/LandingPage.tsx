import { useNavigate } from "react-router-dom";

const stats = [
  { value: "1.200+", label: "Agenți și agenții active în platformă" },
  { value: "34.000+", label: "Proprietăți gestionate lunar prin CRM" },
  { value: "€0", label: "Comision de agenție pentru clienții direcți" },
  { value: "4.9 ★", label: "Rating mediu · utilizatori verificați" },
];

const painPoints = [
  { icon: "📋", title: "Excel și agende fizice nu mai sunt suficiente", desc: "Când portofoliul crește, sistemele improvizate colapsează. Pierzi clienți și ratezi follow-up-uri." },
  { icon: "⏰", title: "Publicarea manuală pe portale durează ore", desc: "Orice modificare de preț înseamnă 4 actualizări manuale pe OLX, Storia, Imobiliare.ro etc." },
  { icon: "💸", title: "Lead-urile se pierd fără un pipeline clar", desc: "Un client interesat te contactează, nu îl urmărești la timp și vânzarea se duce la alt agent." },
];

const bigStats = [
  { value: "73%", label: "din agenții imobiliari nu au un CRM dedicat", sub: "Lucrează cu Excel și WhatsApp — și pierd în medie 2 tranzacții pe lună." },
  { value: "4–6h", label: "pierdute zilnic pe sarcini administrative", sub: "Timp care ar putea fi petrecut cu clienții sau la vizionări, nu la tastatură." },
  { value: "€2.500", label: "comision mediu pierdut lunar din lead-uri neurmărite", sub: "Calculat pe baza ratei medii de conversie din piața imobiliară din România." },
];

const modules = [
  { title: "Proprietăți", desc: "Gestionează portofoliul complet de proprietăți – apartamente, case, terenuri și spații comerciale.", tags: ["Galerie Foto & Video", "Localizare pe Hartă"], path: "/proprietati" },
  { title: "Clienți & Leads", desc: "Centralizează toți clienții și lead-urile cu scoring automat și segmentare avansată.", tags: ["Lead Scoring AI", "Istoric Interacțiuni"], path: "/clienti", badge: "ÎN DEZVOLTARE" },
  { title: "Pipeline Tranzacții", desc: "Vizualizare Kanban completă a tranzacțiilor în curs, de la lead nou la contract semnat.", tags: ["Board Kanban", "Timere & Deadline-uri"], path: "/pipeline", badge: "ÎN DEZVOLTARE" },
  { title: "Matching AI", desc: "Motor inteligent de potrivire între proprietăți și cerințele clienților, cu scoring de compatibilitate.", tags: ["Algoritm AI de Potrivire", "Notificări Automate"], path: "/matching", badge: "ÎN DEZVOLTARE" },
  { title: "Portale Imobiliare", desc: "Publică anunțuri simultan pe 8-10 platforme: OLX, Storia, Imobiliare.ro, dintr-un singur click.", tags: ["Sincronizare Automată", "Statistici per Portal"], path: "/portale", badge: "ÎN DEZVOLTARE" },
  { title: "Site Agenție", desc: "Website profesional generat automat cu listing-urile tale, pagini de agent și formulare de contact.", tags: ["Template-uri Premium", "Listing-uri Live"], path: "/site", badge: "ÎN DEZVOLTARE" },
  { title: "Campanii WA/Email", desc: "Trimite campanii targetate pe WhatsApp și Email către clienți segmentați.", tags: ["WhatsApp Business API", "Email Marketing"], path: "/campanii", badge: "ÎN DEZVOLTARE" },
  { title: "Contracte", desc: "Generează, semnează și arhivează contracte digitale – de intermediere, pre-contracte și acte adiționale.", tags: ["Template-uri Contract", "Semnătură Electronică"], path: "/contracte", badge: "ÎN DEZVOLTARE" },
  { title: "Vizionări", desc: "Programează, gestionează și urmărește toate vizionările – cu calendar integrat și feedback.", tags: ["Calendar Inteligent", "Checklist Vizionare"], path: "/vizionari", badge: "ÎN DEZVOLTARE" },
  { title: "Comisioane", desc: "Tracking complet al comisioanelor – calculate, facturate și încasate, cu split automat.", tags: ["Calcul Automat", "Dashboard Financiar"], path: "/comisioane", badge: "ÎN DEZVOLTARE" },
  { title: "Analytics", desc: "Rapoarte detaliate și insight-uri despre performanța agenției, agenților și a pieței imobiliare.", tags: ["Grafice Interactive", "Leaderboard Agenți"], path: "/analytics", badge: "ÎN DEZVOLTARE" },
  { title: "MLS Partener", desc: "Colaborează cu alte agenții prin sistemul MLS – share proprietăți, split comisioane.", tags: ["Rețea de Agenții", "Reguli de Colaborare"], path: "/mls", badge: "ÎN DEZVOLTARE" },
];

const profiles = [
  {
    icon: "🚀", title: "Pornești de la zero",
    desc: "Vrei să intri în imobiliare dar nu știi de unde să începi. SocietyHUB îți dă infrastructura ca să lansezi profesionist.",
    checks: ["Onboarding ghidat pas cu pas", "Procese predefinite testate", "Training integrat în platformă", "Suport dedicat pentru primele luni"],
  },
  {
    icon: "👤", title: "Ești agent independent",
    desc: "Ai experiență, ai clienți, dar pierzi timp pe administrare. Automatizează tot ce nu generează direct bani.",
    checks: ["CRM personal configurat rapid", "Automatizare lead management", "Publicare pe toate portalele", "Contracte generate în 2 minute"],
  },
  {
    icon: "🏬", title: "Conduci o agenție",
    desc: "Ai o echipă și vrei vizibilitate pe performanță, să elimini duplicarea efortului și să scalezi business-ul.",
    checks: ["Dashboard centralizat pentru echipă", "Leaderboard și target-uri agenți", "Permisiuni și roluri configurabile", "Rapoarte exportabile management"],
  },
];

const comparisonRows = [
  { feature: "Adaptat pieței din România", us: true, intl: false, excel: false },
  { feature: "Publicare pe portale RO (OLX, Storia)", us: true, intl: false, excel: false },
  { feature: "Contracte în legislație RO", us: true, intl: false, excel: false },
  { feature: "Pipeline vizual Kanban", us: true, intl: true, excel: false },
  { feature: "Matching AI cerere–ofertă", us: true, intl: "Limitat", excel: false },
  { feature: "Campanii WhatsApp integrate", us: true, intl: "Contra cost", excel: "Manual" },
  { feature: "Site agenție generat automat", us: true, intl: "Separat", excel: false },
  { feature: "Suport în limba română", us: true, intl: false, excel: false },
  { feature: "Preț accesibil piața RO", us: true, intl: "Scump", excel: false },
];

const testimonials = [
  { name: "Alexandru M.", role: "Agent independent · București", initials: "AM", text: "Am trecut de la Excel la SocietyHUB. Am economisit 3 ore pe zi și în prima lună am închis cu 40% mai multe tranzacții." },
  { name: "Raluca C.", role: "Director agenție · Cluj-Napoca", initials: "RC", text: "Ca director de agenție, aveam zero vizibilitate. Acum văd în timp real fiecare lead și performanța fiecăruia." },
  { name: "Mihai I.", role: "Agent nou · Timișoara", initials: "MI", text: "Am pornit de la zero în imobiliare la 32 de ani. Fără SocietyHUB nu știam de unde să încep." },
];

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-subtle">
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gold flex items-center justify-center text-primary-foreground font-bold text-sm">S</div>
            <div>
              <div className="text-sm font-bold tracking-wide">SOCIETY</div>
              <div className="text-[9px] text-dim2 tracking-[2px]">HUB · CRM IMOB</div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#problema" className="text-sm text-dim hover:text-foreground transition-colors">Problema</a>
            <a href="#module" className="text-sm text-dim hover:text-foreground transition-colors">Module CRM</a>
            <a href="#profile" className="text-sm text-dim hover:text-foreground transition-colors">Pentru cine</a>
            <a href="#comparatie" className="text-sm text-dim hover:text-foreground transition-colors">Comparație</a>
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-5 py-2 border border-subtle rounded-lg text-sm font-medium hover:bg-surface2 transition-colors"
          >
            Începe acum
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-transparent" />
        <div className="max-w-[1200px] mx-auto px-6 pt-24 pb-20 text-center relative">
          <div className="text-[11px] tracking-[4px] uppercase text-dim2 mb-8">
            CRM Imobiliar Pro · România
          </div>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-8" />
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif leading-[1.05] mb-6">
            Imobiliare{" "}
            <em className="font-serif-display text-dim not-italic">profesio</em>
            <span className="font-bold">nale</span>
            <br />
            <span className="font-serif-display text-dim italic">fără compromisuri.</span>
          </h1>
          <div className="w-12 h-px bg-gold mx-auto mb-8 relative">
            <div className="w-2 h-2 bg-gold rotate-45 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-base md:text-lg text-dim max-w-2xl mx-auto mb-10 leading-relaxed">
            SocietyHUB este singura platformă construită complet în România care îți oferă{" "}
            <strong className="text-foreground">toate instrumentele</strong> pentru a construi sau scala o afacere imobiliară profitabilă — și care conectează totodată cumpărătorii direct cu proprietarii,{" "}
            <strong className="text-foreground">fără comision</strong>.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              onClick={() => navigate("/dashboard")}
              className="px-8 py-3.5 bg-gradient-to-r from-gold to-[hsl(43,97%,56%)] text-primary-foreground rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity shadow-[0_4px_24px_hsl(var(--gold)/0.3)]"
            >
              Accesează CRM-ul →
            </button>
            <a
              href="https://cautaimob.ro/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 border border-subtle rounded-lg text-sm font-medium text-dim hover:text-foreground hover:bg-surface2 transition-all"
            >
              Caut fără comision ↗
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {stats.map((s) => (
              <div key={s.label} className="bg-surface border border-subtle rounded-xl p-5">
                <div className="text-2xl md:text-3xl font-serif font-bold text-gold mb-1">{s.value}</div>
                <div className="text-xs text-dim2 leading-relaxed">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section id="problema" className="py-20 bg-surface/50">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-[11px] tracking-[3px] uppercase text-dim2 mb-3 text-center">Realitatea pieței</div>
          <h2 className="text-3xl md:text-4xl font-serif text-center mb-4">
            Munca haotică <em className="font-serif-display text-dim italic">îți costă bani</em> în fiecare zi
          </h2>
          <p className="text-sm text-dim text-center max-w-2xl mx-auto mb-12 leading-relaxed">
            Majoritatea agenților imobiliari din România pierd <strong className="text-foreground">4–6 ore pe zi</strong> pe sarcini administrative: trimit oferte manual, țin evidența clienților în Excel, pierd lead-uri și publică același anunț de <strong className="text-foreground">8</strong> ori.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14">
            {painPoints.map((p) => (
              <div key={p.title} className="bg-surface border border-subtle rounded-xl p-6">
                <div className="text-2xl mb-3">{p.icon}</div>
                <h3 className="text-sm font-semibold mb-2">{p.title}</h3>
                <p className="text-xs text-dim2 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {bigStats.map((b) => (
              <div key={b.value} className="bg-surface border border-subtle rounded-xl p-6 text-center">
                <div className="text-4xl font-serif font-bold text-gold mb-2">{b.value}</div>
                <div className="text-sm font-semibold mb-1">{b.label}</div>
                <p className="text-xs text-dim2 leading-relaxed">{b.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Two Paths Section */}
      <section className="py-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-[11px] tracking-[3px] uppercase text-dim2 mb-3 text-center">Soluția</div>
          <h2 className="text-3xl md:text-4xl font-serif text-center mb-12">
            Alege cum vrei <em className="font-serif-display text-dim italic">să folosești platforma</em>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* CRM Path */}
            <div className="bg-surface border border-subtle rounded-2xl p-8 hover:border-gold/30 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-gold font-mono text-sm font-bold">01</span>
                <span className="text-xs text-dim2 tracking-widest uppercase">CRM Profesional</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Pentru profesioniști imobiliari</h3>
              <p className="text-sm text-dim mb-6 leading-relaxed">
                <strong className="text-foreground">Construiesc sau scalez o afacere imobiliară.</strong> Fie că ești agent cu experiență, conduci o agenție sau vrei să pornești de la zero.
              </p>
              <div className="space-y-3 mb-6">
                {["Portofoliu complet gestionat digital", "Pipeline de vânzări — niciun lead pierdut", "Publicare pe 8+ portale dintr-un click"].map((f) => (
                  <div key={f} className="flex items-start gap-2">
                    <span className="text-teal text-xs mt-0.5">✓</span>
                    <span className="text-xs text-dim">{f}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => navigate("/dashboard")} className="px-6 py-2.5 bg-gold text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
                Accesează CRM-ul profesional
              </button>
            </div>

            {/* Direct Path */}
            <div className="bg-surface border border-subtle rounded-2xl p-8 hover:border-teal/30 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-teal font-mono text-sm font-bold">02</span>
                <span className="text-xs text-dim2 tracking-widest uppercase">Fără comision</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Pentru cumpărători și chiriași</h3>
              <p className="text-sm text-dim mb-6 leading-relaxed">
                <strong className="text-foreground">Caut proprietate direct de la proprietar.</strong> Ești cumpărător sau chiriaș și nu vrei să plătești 2–4% comision?
              </p>
              <div className="space-y-3 mb-6">
                {["Zero comision — garantat", "Contact direct cu proprietarul real", "Filtre avansate — găsești rapid"].map((f) => (
                  <div key={f} className="flex items-start gap-2">
                    <span className="text-teal text-xs mt-0.5">✓</span>
                    <span className="text-xs text-dim">{f}</span>
                  </div>
                ))}
              </div>
              <a href="https://cautaimob.ro/" target="_blank" rel="noopener noreferrer" className="inline-block px-6 py-2.5 border border-subtle rounded-lg text-sm font-semibold hover:bg-surface2 transition-colors">
                Deschide cautaimob.ro
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section id="module" className="py-20 bg-surface/50">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-[11px] tracking-[3px] uppercase text-dim2 mb-3 text-center">CRM Complet</div>
          <h2 className="text-3xl md:text-4xl font-serif text-center mb-12">
            12 module integrate <em className="font-serif-display text-dim italic">pentru tot ce ai nevoie</em>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {modules.map((m) => (
              <div
                key={m.title}
                onClick={() => navigate(m.path)}
                className="bg-surface border border-subtle rounded-xl p-5 cursor-pointer hover:border-gold/30 transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold">{m.title}</h3>
                  {m.badge && (
                    <span className="text-[9px] font-bold tracking-wider text-gold bg-gold-dim px-2 py-0.5 rounded-full">{m.badge}</span>
                  )}
                </div>
                <p className="text-xs text-dim2 mb-4 leading-relaxed">{m.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {m.tags.map((t) => (
                    <span key={t} className="text-[10px] text-dim px-2 py-0.5 rounded-md bg-surface2 border border-subtle">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Profiles Section */}
      <section id="profile" className="py-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-[11px] tracking-[3px] uppercase text-dim2 mb-3 text-center">Profiluri</div>
          <h2 className="text-3xl md:text-4xl font-serif text-center mb-12">
            SocietyHUB este construit <em className="font-serif-display text-dim italic">pentru tine dacă…</em>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {profiles.map((p) => (
              <div key={p.title} className="bg-surface border border-subtle rounded-2xl p-7">
                <div className="text-3xl mb-4">{p.icon}</div>
                <h3 className="text-base font-bold mb-2">{p.title}</h3>
                <p className="text-xs text-dim2 mb-5 leading-relaxed">{p.desc}</p>
                <div className="space-y-2.5">
                  {p.checks.map((c) => (
                    <div key={c} className="flex items-center gap-2">
                      <span className="text-teal text-xs">✓</span>
                      <span className="text-xs text-dim">{c}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section id="comparatie" className="py-20 bg-surface/50">
        <div className="max-w-[900px] mx-auto px-6">
          <div className="text-[11px] tracking-[3px] uppercase text-dim2 mb-3 text-center">Comparație</div>
          <h2 className="text-3xl md:text-4xl font-serif text-center mb-12">
            SocietyHUB vs. <em className="font-serif-display text-dim italic">alternativele</em> din piață
          </h2>
          <div className="bg-surface border border-subtle rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-subtle">
                    <th className="text-xs font-semibold text-dim2 px-5 py-4">Funcționalitate</th>
                    <th className="text-xs font-bold text-gold px-5 py-4 text-center">SocietyHUB</th>
                    <th className="text-xs font-semibold text-dim2 px-5 py-4 text-center">CRM Internațional</th>
                    <th className="text-xs font-semibold text-dim2 px-5 py-4 text-center">Excel + WhatsApp</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((r) => (
                    <tr key={r.feature} className="border-b border-subtle last:border-b-0">
                      <td className="text-xs text-dim px-5 py-3.5">{r.feature}</td>
                      <td className="text-center px-5 py-3.5">
                        {r.us === true ? <span className="text-teal text-sm">✓</span> : <span className="text-xs text-dim2">{String(r.us)}</span>}
                      </td>
                      <td className="text-center px-5 py-3.5">
                        {r.intl === true ? <span className="text-teal text-sm">✓</span> : r.intl === false ? <span className="text-danger text-sm">✗</span> : <span className="text-xs text-dim2">{String(r.intl)}</span>}
                      </td>
                      <td className="text-center px-5 py-3.5">
                        {r.excel === true ? <span className="text-teal text-sm">✓</span> : r.excel === false ? <span className="text-danger text-sm">✗</span> : <span className="text-xs text-dim2">{String(r.excel)}</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-[11px] tracking-[3px] uppercase text-dim2 mb-3 text-center">Testimoniale</div>
          <h2 className="text-3xl md:text-4xl font-serif text-center mb-12">
            Ce spun <em className="font-serif-display text-dim italic">utilizatorii noștri</em>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-surface border border-subtle rounded-2xl p-7">
                <div className="text-gold text-sm mb-4">★★★★★</div>
                <p className="text-sm text-dim mb-6 leading-relaxed italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-orange-600 flex items-center justify-center text-xs font-bold text-primary-foreground">
                    {t.initials}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{t.name}</div>
                    <div className="text-xs text-dim2">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-surface/50">
        <div className="max-w-[700px] mx-auto px-6 text-center">
          <div className="text-[11px] tracking-[3px] uppercase text-dim2 mb-3">Începe astăzi</div>
          <h2 className="text-3xl md:text-4xl font-serif mb-4">
            Fii cu un pas <em className="font-serif-display text-dim italic">înaintea pieței</em>
          </h2>
          <p className="text-sm text-dim mb-8 leading-relaxed">
            Fiecare zi în care lucrezi fără un CRM dedicat înseamnă <strong className="text-foreground">lead-uri pierdute, timp irosit și bani lăsați pe masă</strong>. SocietyHUB îți oferă toată infrastructura digitală.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="px-8 py-3.5 bg-gradient-to-r from-gold to-[hsl(43,97%,56%)] text-primary-foreground rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity shadow-[0_4px_24px_hsl(var(--gold)/0.3)]"
            >
              Accesează CRM-ul →
            </button>
            <a
              href="https://cautaimob.ro/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 border border-subtle rounded-lg text-sm font-medium text-dim hover:text-foreground hover:bg-surface2 transition-all"
            >
              Caut fără comision ↗
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-subtle py-8">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif text-lg">Society<span className="text-gold">HUB</span></span>
            <span className="text-xs text-dim2">· CRM Imobiliar Pro</span>
          </div>
          <div className="text-xs text-dim2">© 2026 SocietyHUB. Toate drepturile rezervate.</div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
