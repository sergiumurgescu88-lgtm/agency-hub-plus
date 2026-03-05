import { useState } from "react";
import { useNavigate } from "react-router-dom";

/* ─── PAGE KEYS ─── */
type PageKey = "home" | "func" | "site" | "pret" | "despre" | "contact" | "auth" | "signup" | "termeni";

const NAV_ITEMS: { key: PageKey; label: string }[] = [
  { key: "func", label: "Funcționalități" },
  { key: "site", label: "Site Agenție" },
  { key: "pret", label: "Prețuri" },
  { key: "despre", label: "Despre Noi" },
  { key: "contact", label: "Contact" },
];

/* ─── DATA ─── */
const modules = [
  { icon: "🏠", title: "Proprietăți", desc: "Gestionează portofoliul complet — apartamente, case, terenuri și spații comerciale, totul într-un singur loc.", chips: ["Galerie Foto & Video", "Localizare pe Hartă"] },
  { icon: "👥", title: "Clienți & Leads", desc: "Centralizează toți clienții și lead-urile cu scoring automat și segmentare avansată.", chips: ["Lead Scoring AI", "Istoric Interacțiuni"], badge: "În dezvoltare" },
  { icon: "📋", title: "Pipeline Tranzacții", desc: "Vizualizare Kanban completă a tranzacțiilor în curs, de la lead nou până la contract semnat.", chips: ["Board Kanban", "Timere & Deadline-uri"], badge: "În dezvoltare" },
  { icon: "🎯", title: "Matching AI", desc: "Motor inteligent de potrivire între proprietăți și cerințele clienților, cu sugestii automate.", chips: ["Algoritm AI de Potrivire", "Notificări Automate"], badge: "În dezvoltare" },
  { icon: "📤", title: "Portale Imobiliare", desc: "Publică simultan pe 8–10 platforme: OLX, Storia, Imobiliare.ro, Publi24 și altele, dintr-un singur click.", chips: ["Sincronizare Automată", "Statistici per Portal"], badge: "În dezvoltare" },
  { icon: "🌐", title: "Site Agenție", desc: "Website profesional generat automat cu listing-urile tale, pagini de agent și formulare integrate.", chips: ["Template-uri Premium", "Listing-uri Live"], badge: "În dezvoltare" },
  { icon: "📱", title: "Campanii WA/Email", desc: "Trimite campanii targetate pe WhatsApp și Email către clienți segmentați, cu template-uri profesionale.", chips: ["WhatsApp Business API", "Email Marketing"], badge: "În dezvoltare" },
  { icon: "📝", title: "Contracte", desc: "Generează, semnează și arhivează contracte digitale — de intermediere, pre-contracte și acte adiționale.", chips: ["Template-uri Contract", "Semnătură Electronică"], badge: "În dezvoltare" },
  { icon: "📅", title: "Vizionări", desc: "Programează, gestionează și urmărești toate vizionările cu calendar integrat și feedback automat.", chips: ["Calendar Inteligent", "Checklist Vizionare"], badge: "În dezvoltare" },
  { icon: "💰", title: "Comisioane", desc: "Tracking complet al comisioanelor — calculate, facturate și încasate, cu split automat între agenți.", chips: ["Calcul Automat", "Dashboard Financiar"], badge: "În dezvoltare" },
  { icon: "📊", title: "Analytics", desc: "Rapoarte detaliate și insight-uri despre performanța agenției, agenților și a pieței imobiliare.", chips: ["Grafice Interactive", "Leaderboard Agenți"], badge: "În dezvoltare" },
  { icon: "🤝", title: "MLS Partener", desc: "Colaborează cu alte agenții prin sistemul MLS — share proprietăți, split comisioane și extinde portofoliul.", chips: ["Rețea de Agenții", "Reguli de Colaborare"], badge: "În dezvoltare" },
];

const funcItems = [
  { num: "01", title: "Caută instant, orice, oriunde", desc: "Căutarea inteligentă îți oferă acces instant la informațiile dorite — după număr de telefon, ID proprietate, adresă sau orice alt detaliu." },
  { num: "02", title: "Notificări automate", desc: "Ești notificat automat despre proprietăți noi potrivite clienților tăi, remindere vizionări și deschideri de emailuri cu ofertele tale." },
  { num: "03", title: "Activități + Calendar", desc: "Toate activitățile tale zilnice sunt perfect organizate.", subs: ["Privire de ansamblu activități agenție", "Remindere prin email pentru activitățile viitoare", "Istoricul rezultatelor activităților finalizate"] },
  { num: "04", title: "Contacte & Google Sync", desc: "Toate datele de contact ale tale și ale colegilor, cu căutare după nume, domeniu, sursă sau etichete.", subs: ["Google Sync contacte pe smartphone", "Tag-uri și categorii avansate"] },
  { num: "05", title: "Publicare cu un click", desc: "Publicăm automat fiecare anunț imobiliar pe 16+ portaluri simultan.", subs: ["Link anunț direct pe fiecare portal", "Rapoarte promovare per portal", "Limitare anunțuri per agent", "Număr vizualizări per anunț"] },
  { num: "06", title: "Prezentări PDF Automate", desc: "Generezi automat prezentări profesionale cu brandul tău, cu un singur click — în română și engleză.", subs: ["Pentru clienți, uz intern sau colaboratori", "Poziționare exactă sau aproximativă pe hartă"] },
  { num: "07", title: "Gestionare Imagini", desc: "Redimensionare automată pe 20 dimensiuni, ordonare drag&drop, watermark automat pe toate canalele, poze confidențiale." },
  { num: "08", title: "Portofoliu Complet", desc: "Sortări și filtrări avansate, semaforul pentru legătura cu proprietarii, afișare și căutare pe hartă." },
  { num: "09", title: "Matching Automat", desc: "Sistemul configurabil de matching găsește proprietățile potrivite pentru fiecare client și trimite notificări automate.", subs: ["Trimitere proprietăți pe email cu feedback", "Notificări proprietăți noi"] },
  { num: "10", title: "Rapoarte Avansate", desc: "Evaluare imediată a datelor pentru management decizional rapid — activitate agenți, stoc proprietăți, tendințe piață." },
  { num: "11", title: "Rețea Colaborare MLS", desc: "Colaborezi cu sute de agenții. Caută în timp real clienți potriviți proprietăților tale. Modulul este izolat complet de baza ta de date." },
  { num: "12", title: "Contracte Digitale", desc: "Generezi contracte direct din CRM. Clienții le semnează digital sau le descarci pentru semnare olografă.", subs: ["Date preluate din buletin automat", "Toate contractele organizate în același loc"] },
  { num: "13", title: "Import / Export Date", desc: "Import gratuit din AdminOnline, SoftImobiliar, ImmoFlux și altele. Export oricând în Excel." },
  { num: "14", title: "Infrastructură 100% Sigură", desc: "Fiecare agenție are baza de date separată. Backup zilnic. Actualizăm permanent infrastructura pentru securitate maximă." },
];

const compRows = [
  { label: "Adaptat pieței din România", s: "✓", i: "✗", e: "✗" },
  { label: "Publicare pe portale RO (OLX, Storia)", s: "✓", i: "✗", e: "✗" },
  { label: "Contracte în legislație RO", s: "✓", i: "✗", e: "✗" },
  { label: "Pipeline vizual Kanban", s: "✓", i: "✓", e: "✗" },
  { label: "Matching AI cerere–ofertă", s: "✓", i: "Limitat", e: "✗" },
  { label: "Campanii WhatsApp integrate", s: "✓", i: "Contra cost", e: "Manual" },
  { label: "Site agenție generat automat", s: "✓", i: "Separat", e: "✗" },
  { label: "Suport în limba română", s: "✓", i: "✗", e: "✗" },
  { label: "Preț accesibil piața RO", s: "✓", i: "Scump", e: "✗" },
];

const teamMembers = [
  { initials: "S", name: "Sergiu Murgescu", role: "CEO & Fondator" },
  { initials: "A", name: "Andrei Bunea", role: "CTO" },
  { initials: "M", name: "Mihnea Enache", role: "Product Manager" },
  { initials: "M", name: "Marius Viziru", role: "Sales Consulting Partner" },
];

/* ─── STYLES ─── */
const s = {
  gold: "#C9A84C",
  goldLight: "#E8C96A",
  goldDim: "rgba(201,168,76,0.13)",
  goldBorder: "rgba(201,168,76,0.22)",
  dark: "#09090E",
  dark2: "#101018",
  dark3: "#181824",
  surface: "#1C1C28",
  surface2: "#232333",
  text: "#F2EFE9",
  text2: "#B5B1AA",
  text3: "#706D66",
  green: "#2ECC71",
  subtleBorder: "rgba(255,255,255,0.07)",
  radius: "14px",
};

/* ─── COMPONENT ─── */
const LandingPage = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState<PageKey>("home");
  const [mobOpen, setMobOpen] = useState(false);
  const [annual, setAnnual] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(1);
  const [cookieAccepted, setCookieAccepted] = useState(() => localStorage.getItem("cookie_accepted") === "true");

  const nav = (key: PageKey) => {
    setPage(key);
    setMobOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const prices = annual ? ["4.99", "9.99", "14.99"] : ["9.99", "19.99", "29.99"];

  /* ─── SHARED COMPONENTS ─── */
  const Tag = ({ children }: { children: string }) => (
    <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[0.73rem] font-semibold uppercase tracking-wider mb-4" style={{ background: s.goldDim, border: `1px solid ${s.goldBorder}`, color: s.gold }}>
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: s.gold }} />
      {children}
    </div>
  );

  const BtnPrimary = ({ children, onClick, full }: { children: React.ReactNode; onClick?: () => void; full?: boolean }) => (
    <button onClick={onClick} className={`inline-flex items-center gap-2 px-5 py-3 md:px-7 md:py-3.5 rounded-[10px] text-sm font-semibold border-none cursor-pointer transition-all duration-200 hover:-translate-y-0.5 ${full ? "w-full justify-center" : ""}`} style={{ background: `linear-gradient(135deg,${s.gold},${s.goldLight})`, color: s.dark, fontFamily: "'DM Sans',sans-serif" }}>
      {children}
    </button>
  );

  const BtnSecondary = ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <button onClick={onClick} className="inline-flex items-center gap-2 px-5 py-3 md:px-7 md:py-3.5 rounded-[10px] text-sm font-semibold cursor-pointer bg-transparent transition-all duration-200 hover:border-[rgba(201,168,76,0.22)]" style={{ border: "1px solid rgba(255,255,255,0.12)", color: s.text, fontFamily: "'DM Sans',sans-serif" }}>
      {children}
    </button>
  );

  const Logo = ({ onClick }: { onClick?: () => void }) => (
    <div onClick={onClick} className="flex items-center gap-2.5 cursor-pointer select-none">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-bold text-[15px]" style={{ background: `linear-gradient(135deg,${s.gold},${s.goldLight})`, fontFamily: "'Playfair Display',serif", color: s.dark }}>S</div>
      <div className="text-lg font-bold" style={{ fontFamily: "'Playfair Display',serif" }}>Society<span style={{ color: s.gold }}>HUB</span></div>
    </div>
  );

  const CtaBanner = ({ title, desc, btnText }: { title: React.ReactNode; desc: string; btnText: string }) => (
    <div className="px-5 py-10 md:px-16 md:py-20 rounded-2xl text-center relative overflow-hidden" style={{ background: `linear-gradient(135deg,${s.dark3} 0%,${s.surface2} 100%)`, border: `1px solid ${s.goldBorder}` }}>
      <div className="absolute top-[-40%] left-1/2 -translate-x-1/2 w-[500px] md:w-[700px] h-[500px] md:h-[700px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle,rgba(201,168,76,0.07),transparent 65%)" }} />
      <h2 className="relative z-[1] text-xl md:text-4xl font-bold leading-tight" style={{ fontFamily: "'Playfair Display',serif" }}>{title}</h2>
      <p className="relative z-[1] mx-auto mt-3 mb-6 md:mt-5 md:mb-10 max-w-[500px] text-sm md:text-base leading-relaxed" style={{ color: s.text2 }}>{desc}</p>
      <div className="relative z-[1]">
        <BtnPrimary onClick={() => nav("signup")}>{btnText}</BtnPrimary>
      </div>
    </div>
  );

  const SmallFooter = () => (
    <footer className="py-4 md:py-6" style={{ background: s.dark2, borderTop: `1px solid ${s.subtleBorder}` }}>
      <div className="lp-wrap">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-center sm:text-left">
          <div>
            <p className="text-[0.72rem] md:text-[0.8rem]" style={{ color: s.text3 }}>© 2026 SocietyHUB. Toate drepturile rezervate.</p>
            <p className="text-[0.62rem] md:text-[0.7rem] mt-0.5" style={{ color: s.text3 }}>MURSE ADVERTISING S.R.L. · CUI: 44923890 · J40/16148/2021</p>
          </div>
          <div className="flex gap-4">
            <a onClick={() => nav("termeni")} className="text-[0.75rem] cursor-pointer" style={{ color: s.text3 }}>Termeni</a>
            <a onClick={() => nav("contact")} className="text-[0.75rem] cursor-pointer" style={{ color: s.text3 }}>Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );

  const inputStyle: React.CSSProperties = { width: "100%", background: s.dark3, border: `1px solid rgba(255,255,255,0.09)`, borderRadius: 8, padding: "0.65rem 0.85rem", fontSize: "0.85rem", color: s.text, outline: "none" };
  const labelStyle: React.CSSProperties = { display: "block", fontSize: "0.79rem", color: s.text2, marginBottom: "0.4rem", fontWeight: 500 };

  /* ─── RENDER PAGES ─── */

  const renderHome = () => (
    <>
      {/* HERO */}
      <div className="min-h-[85vh] md:min-h-[94vh] flex items-center relative overflow-hidden pt-16 md:pt-[68px] pb-8 md:pb-0">
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse 70% 70% at 100% 50%,rgba(201,168,76,0.07) 0%,transparent 65%),radial-gradient(ellipse 60% 90% at 0% 100%,rgba(74,108,247,0.05) 0%,transparent 60%),linear-gradient(180deg,${s.dark} 0%,${s.dark2} 100%)` }} />
        <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(201,168,76,0.035) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.035) 1px,transparent 1px)", backgroundSize: "72px 72px", maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%,black,transparent)" }} />
        <div className="lp-wrap relative z-[2] w-full">
          <div className="max-w-[740px] relative z-[2]">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[0.72rem] md:text-[0.76rem] font-semibold mb-6 md:mb-8" style={{ background: s.goldDim, border: `1px solid ${s.goldBorder}`, color: s.gold, letterSpacing: "0.04em" }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: s.gold }} />
              CRM Imobiliar #1 în România
            </div>
            <h1 className="text-[2.2rem] md:text-[clamp(2.8rem,5vw,5rem)] font-black leading-[1.08] tracking-tight" style={{ fontFamily: "'Playfair Display',serif" }}>
              Imobiliare<br />profesionale<br /><i style={{ color: s.gold }}>fără compromisuri.</i>
            </h1>
            <p className="text-[0.95rem] md:text-[1.15rem] leading-relaxed mt-4 mb-6 md:mt-6 md:mb-10 max-w-[580px]" style={{ color: s.text2 }}>
              SocietyHUB este singura platformă construită complet în România care îți oferă toate instrumentele pentru a construi sau scala o afacere imobiliară profitabilă.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-8 md:mb-14">
              <BtnPrimary onClick={() => nav("signup")}>Accesează CRM-ul →</BtnPrimary>
              <BtnSecondary onClick={() => navigate("/dashboard")}>🖥️ Demo Dashboard</BtnSecondary>
              <BtnSecondary onClick={() => nav("func")}>Descoperă funcționalitățile</BtnSecondary>
            </div>
            <div className="flex flex-wrap gap-5 md:gap-14">
              {[
                { num: "1.200+", label: "Agenți și agenții\nactive în platformă" },
                { num: "34.000+", label: "Proprietăți gestionate\nlunar prin CRM" },
                { num: "4.9 ★", label: "Rating mediu\nutilizatori verificați" },
              ].map(st => (
                <div key={st.num} className="flex flex-col gap-1">
                  <span className="text-2xl md:text-[2.1rem] font-black leading-none" style={{ fontFamily: "'Playfair Display',serif", color: s.gold }}>{st.num}</span>
                  <span className="text-[0.72rem] md:text-[0.79rem] leading-snug whitespace-pre-line" style={{ color: s.text3 }}>{st.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* CRM Mockup - desktop only */}
        <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-[46%] max-w-[700px] z-[1] pr-4">
          <div style={{ background: s.surface, border: `1px solid ${s.goldBorder}`, borderRadius: 18, overflow: "hidden", boxShadow: "0 48px 100px rgba(0,0,0,0.65),0 0 0 1px rgba(201,168,76,0.08),inset 0 1px 0 rgba(255,255,255,0.04)" }}>
            <div className="flex items-center gap-2 px-4 py-3" style={{ background: s.dark3, borderBottom: `1px solid ${s.subtleBorder}` }}>
              <div className="w-2.5 h-2.5 rounded-full bg-[#FF5757]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#FFB224]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#22C55E]" />
              <span className="ml-2 text-[0.71rem]" style={{ color: s.text3 }}>SocietyHUB CRM — Proprietăți</span>
            </div>
            <div className="grid grid-cols-[190px_1fr] h-[400px]">
              <div className="flex flex-col gap-0.5 py-4" style={{ background: s.dark2, borderRight: `1px solid ${s.subtleBorder}` }}>
                {["Dashboard", "Proprietăți", "Cereri", "Contacte", "Calendar", "Pipeline", "Campanii", "Contracte", "Rapoarte", "MLS"].map((item, i) => (
                  <div key={item} className="flex items-center gap-2 px-4 py-2 text-[0.76rem]" style={{ color: i === 0 ? s.gold : s.text3, background: i === 0 ? s.goldDim : "transparent" }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: "currentColor", opacity: 0.6 }} />
                    {item}
                  </div>
                ))}
              </div>
              <div className="p-3.5 flex flex-col gap-2.5 overflow-hidden">
                {[
                  { emoji: "🏠", name: "Apartament 3 cam. Floreasca", loc: "București, Sector 2 · 78mp", chip: "Activ", chipColor: s.green, price: "€185.000" },
                  { emoji: "🏢", name: "Birouri 450mp Pipera", loc: "București, Voluntari", chip: "Vizionare azi", chipColor: s.gold, price: "€4.200/lună" },
                  { emoji: "🏡", name: "Vilă 5 cam. Snagov", loc: "Ilfov, Snagov · 320mp", chip: "Nou adăugat", chipColor: s.green, price: "€350.000" },
                  { emoji: "🏗️", name: "Teren intravilan 2.000mp", loc: "Cluj-Napoca, Florești", chip: "Ofertă trimisă", chipColor: "#7B9FF9", price: "€120.000" },
                  { emoji: "🛍️", name: "Spațiu comercial 120mp", loc: "Timișoara, Centru", chip: "Negociere", chipColor: s.gold, price: "€1.800/lună" },
                ].map(p => (
                  <div key={p.name} className="flex items-center gap-2.5 p-2.5 rounded-[10px]" style={{ background: s.dark3, border: `1px solid ${s.subtleBorder}` }}>
                    <div className="w-[58px] h-[44px] rounded-[7px] flex items-center justify-center text-xl shrink-0" style={{ background: "linear-gradient(135deg,rgba(201,168,76,0.12),rgba(74,108,247,0.1))" }}>{p.emoji}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[0.76rem] font-semibold truncate">{p.name}</div>
                      <div className="text-[0.67rem] mt-0.5" style={{ color: s.text3 }}>{p.loc}</div>
                      <span className="inline-block px-2 py-0.5 rounded-full text-[0.62rem] font-bold mt-1" style={{ background: `${p.chipColor}22`, color: p.chipColor }}>{p.chip}</span>
                    </div>
                    <div className="text-[0.78rem] font-bold whitespace-nowrap ml-auto" style={{ color: s.gold }}>{p.price}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PROBLEM */}
      <section className="lp-section" style={{ background: s.dark2, borderTop: `1px solid ${s.subtleBorder}`, borderBottom: `1px solid ${s.subtleBorder}` }}>
        <div className="lp-wrap">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-20 items-center mb-10 md:mb-16">
            <div>
              <Tag>Realitatea pieței</Tag>
              <h2 className="text-xl md:text-[clamp(2rem,3.5vw,3.2rem)] font-bold leading-tight" style={{ fontFamily: "'Playfair Display',serif" }}>Munca haotică îți<br />costă bani în <i style={{ color: s.gold }}>fiecare zi</i></h2>
              <p className="text-[0.9rem] md:text-[1.1rem] leading-relaxed max-w-[600px] mt-3 md:mt-4" style={{ color: s.text2 }}>
                Majoritatea agenților imobiliari din România pierd 4–6 ore pe zi pe sarcini administrative: trimit oferte manual, țin evidența clienților în Excel sau pe hârtie, pierd lead-uri pentru că nu au un sistem de urmărire și publică același anunț de 8 ori, pe fiecare portal în parte.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              {[
                { num: "73%", t: "din agenții imobiliari nu au un CRM dedicat", d: "Lucrează cu Excel și WhatsApp — și pierd în medie 2 tranzacții pe lună." },
                { num: "4–6h", t: "pierdute zilnic pe sarcini administrative", d: "Timp care ar putea fi petrecut cu clienții sau la vizionări, nu la tastatură." },
                { num: "€2.500", t: "comision mediu pierdut lunar din lead-uri neurmărite", d: "Calculat pe baza ratei medii de conversie din piața imobiliară din România." },
              ].map(ps => (
                <div key={ps.num} className="flex items-start gap-3 md:gap-5 p-4 md:p-5 rounded-[14px]" style={{ background: s.surface, border: `1px solid ${s.subtleBorder}` }}>
                  <div className="text-xl md:text-[2rem] font-black leading-none shrink-0 whitespace-nowrap" style={{ fontFamily: "'Playfair Display',serif", color: s.gold }}>{ps.num}</div>
                  <div>
                    <strong className="block text-[0.85rem] md:text-[0.9rem] font-semibold mb-1">{ps.t}</strong>
                    <span className="text-[0.78rem] md:text-[0.82rem] leading-relaxed" style={{ color: s.text2 }}>{ps.d}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
            {[
              { icon: "📋", t: "Excel și agende fizice nu mai sunt suficiente", d: "Când portofoliul crește, sistemele improvizate colapsează. Pierzi clienți și ratezi follow-up-uri critice." },
              { icon: "⏰", t: "Publicarea manuală pe portale durează ore", d: "Orice modificare de preț înseamnă 4 actualizări manuale pe OLX, Storia, Imobiliare.ro etc." },
              { icon: "💸", t: "Lead-urile se pierd fără un pipeline clar", d: "Un client interesat te contactează, nu îl urmărești la timp și vânzarea se duce la alt agent." },
            ].map(pc => (
              <div key={pc.t} className="p-5 md:p-7 rounded-[14px]" style={{ background: s.surface, border: `1px solid ${s.subtleBorder}`, borderLeft: `3px solid ${s.gold}` }}>
                <div className="text-2xl mb-3">{pc.icon}</div>
                <div className="text-[0.9rem] font-semibold mb-2">{pc.t}</div>
                <div className="text-[0.82rem] leading-relaxed" style={{ color: s.text2 }}>{pc.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MODULES */}
      <section className="lp-section">
        <div className="lp-wrap">
          <div className="text-center">
            <Tag>CRM Complet</Tag>
            <h2 className="text-xl md:text-[clamp(2rem,3.5vw,3.2rem)] font-bold leading-tight mt-1" style={{ fontFamily: "'Playfair Display',serif" }}>12 module integrate<br />pentru tot ce ai nevoie</h2>
            <p className="text-[0.9rem] md:text-[1.1rem] leading-relaxed max-w-[600px] mx-auto mt-3" style={{ color: s.text2 }}>SocietyHUB nu este un simplu tool de organizare. Este un ecosistem complet care acoperă fiecare etapă a activității imobiliare.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mt-8 md:mt-14">
            {modules.map(m => (
              <div key={m.title} className="p-5 rounded-[14px] relative overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-1" style={{ background: s.surface, border: `1px solid ${s.subtleBorder}` }}>
                {m.badge && <div className="absolute top-3 right-3 text-[0.6rem] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full" style={{ background: "rgba(74,108,247,0.15)", border: "1px solid rgba(74,108,247,0.25)", color: "#7B9FF9" }}>{m.badge}</div>}
                <div className="text-2xl mb-3">{m.icon}</div>
                <div className="text-[0.9rem] font-semibold mb-1">{m.title}</div>
                <div className="text-[0.78rem] leading-relaxed" style={{ color: s.text2 }}>{m.desc}</div>
                <div className="flex flex-col gap-1 mt-3">
                  {m.chips.map(c => <span key={c} className="text-[0.7rem]" style={{ color: s.text3 }}>↗ {c}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROFILES */}
      <section className="lp-section" style={{ background: s.dark2, borderTop: `1px solid ${s.subtleBorder}`, borderBottom: `1px solid ${s.subtleBorder}` }}>
        <div className="lp-wrap">
          <div className="text-center">
            <Tag>Profiluri</Tag>
            <h2 className="text-xl md:text-[clamp(2rem,3.5vw,3.2rem)] font-bold leading-tight mt-1" style={{ fontFamily: "'Playfair Display',serif" }}>SocietyHUB este construit<br />pentru tine dacă…</h2>
            <p className="text-[0.9rem] md:text-[1.1rem] leading-relaxed max-w-[600px] mx-auto mt-3" style={{ color: s.text2 }}>Indiferent de unde ești în cariera ta imobiliară, platforma se adaptează nevoilor tale specifice.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8 md:mt-12">
            {[
              { icon: "🚀", title: "Pornești de la zero", sub: "Vrei să intri în imobiliare dar nu știi de unde să începi", items: ["Onboarding ghidat pas cu pas", "Procese predefinite testate", "Training integrat în platformă", "Suport dedicat pentru primele luni"] },
              { icon: "👤", title: "Ești agent independent", sub: "Ai experiență, ai clienți, dar pierzi timp pe administrare", items: ["CRM personal configurat rapid", "Automatizare lead management", "Publicare pe toate portalele", "Contracte generate în 2 minute"] },
              { icon: "🏬", title: "Conduci o agenție", sub: "Ai o echipă și vrei vizibilitate pe performanță", items: ["Dashboard centralizat pentru echipă", "Leaderboard și target-uri agenți", "Permisiuni și roluri configurabile", "Rapoarte exportabile management"] },
            ].map(p => (
              <div key={p.title} className="p-6 md:p-8 rounded-[14px] transition-all duration-200" style={{ background: s.surface, border: `1px solid ${s.subtleBorder}` }}>
                <div className="text-3xl mb-4">{p.icon}</div>
                <div className="text-lg font-bold mb-1" style={{ fontFamily: "'Playfair Display',serif" }}>{p.title}</div>
                <div className="text-[0.82rem] italic mb-4" style={{ color: s.text3 }}>{p.sub}</div>
                <ul className="list-none p-0">
                  {p.items.map(item => (
                    <li key={item} className="text-[0.82rem] py-1.5 pl-5 relative" style={{ color: s.text2, borderBottom: `1px solid ${s.subtleBorder}` }}>
                      <span className="absolute left-0 text-[0.75rem]" style={{ color: s.green }}>✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPARISON */}
      <section className="lp-section">
        <div className="lp-wrap">
          <div className="text-center">
            <Tag>Comparație</Tag>
            <h2 className="text-xl md:text-[clamp(2rem,3.5vw,3.2rem)] font-bold leading-tight mt-1" style={{ fontFamily: "'Playfair Display',serif" }}>SocietyHUB vs.<br /><i style={{ color: s.gold }}>alternativele din piață</i></h2>
            <p className="text-[0.9rem] md:text-[1.1rem] leading-relaxed max-w-[600px] mx-auto mt-3" style={{ color: s.text2 }}>De ce profesioniștii imobiliari din România aleg SocietyHUB față de soluțiile internaționale.</p>
          </div>
          <div className="mt-8 md:mt-12 overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
            <table className="w-full border-collapse min-w-[600px] md:min-w-[680px]">
              <thead>
                <tr>
                  <th className="p-3 md:p-4 text-[0.72rem] md:text-[0.78rem] font-semibold uppercase tracking-wider text-left" style={{ color: s.text3 }}>Funcționalitate</th>
                  <th className="p-3 md:p-4 text-[0.72rem] md:text-[0.78rem] font-semibold uppercase tracking-wider text-left rounded-t-lg" style={{ color: s.gold, background: s.goldDim }}>SocietyHUB</th>
                  <th className="p-3 md:p-4 text-[0.72rem] md:text-[0.78rem] font-semibold uppercase tracking-wider text-left" style={{ color: s.text3 }}>CRM Internațional</th>
                  <th className="p-3 md:p-4 text-[0.72rem] md:text-[0.78rem] font-semibold uppercase tracking-wider text-left" style={{ color: s.text3 }}>Excel + WhatsApp</th>
                </tr>
              </thead>
              <tbody>
                {compRows.map(r => (
                  <tr key={r.label}>
                    <td className="px-3 md:px-5 py-3 text-[0.8rem] md:text-[0.875rem] font-medium" style={{ color: s.text, borderBottom: `1px solid ${s.subtleBorder}` }}>{r.label}</td>
                    <td className="px-3 md:px-5 py-3 text-[0.8rem] md:text-[0.875rem]" style={{ borderBottom: `1px solid ${s.subtleBorder}`, background: "rgba(201,168,76,0.04)" }}>
                      <span style={{ color: r.s === "✓" ? s.green : s.text3, fontWeight: r.s === "✓" ? 700 : 400 }}>{r.s}</span>
                    </td>
                    <td className="px-3 md:px-5 py-3 text-[0.8rem] md:text-[0.875rem]" style={{ color: s.text2, borderBottom: `1px solid ${s.subtleBorder}` }}>
                      <span style={{ color: r.i === "✓" ? s.green : r.i === "✗" ? s.text3 : "#F0A500", fontWeight: r.i === "✓" ? 700 : 400 }}>{r.i}</span>
                    </td>
                    <td className="px-3 md:px-5 py-3 text-[0.8rem] md:text-[0.875rem]" style={{ color: s.text2, borderBottom: `1px solid ${s.subtleBorder}` }}>
                      <span style={{ color: r.e === "✓" ? s.green : r.e === "✗" ? s.text3 : "#F0A500", fontWeight: r.e === "✓" ? 700 : 400 }}>{r.e}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="lp-section" style={{ background: s.dark2, borderTop: `1px solid ${s.subtleBorder}` }}>
        <div className="lp-wrap">
          <div className="text-center">
            <Tag>Testimoniale</Tag>
            <h2 className="text-xl md:text-[clamp(2rem,3.5vw,3.2rem)] font-bold leading-tight mt-1" style={{ fontFamily: "'Playfair Display',serif" }}>Ce spun <i style={{ color: s.gold }}>utilizatorii noștri</i></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8 md:mt-14">
            {[
              { quote: "Am trecut de la Excel la SocietyHUB. Am economisit 3 ore pe zi și în prima lună am închis cu 40% mai multe tranzacții. Nu mai pot lucra altfel.", name: "Alexandru M.", role: "Agent independent · București", init: "A" },
              { quote: "Ca director de agenție, aveam zero vizibilitate. Acum văd în timp real fiecare lead și performanța fiecăruia. Dashboard-ul mi-a schimbat business-ul.", name: "Raluca C.", role: "Director agenție · Cluj-Napoca", init: "R" },
              { quote: "Am pornit de la zero în imobiliare la 32 de ani. Fără SocietyHUB nu știam de unde să încep. Onboarding-ul m-a ajutat să am tranzacții rapid.", name: "Mihai I.", role: "Agent nou · Timișoara", init: "M" },
            ].map(t => (
              <div key={t.name} className="p-5 md:p-7 rounded-[14px]" style={{ background: s.surface, border: `1px solid ${s.subtleBorder}` }}>
                <div className="text-[0.85rem] tracking-wider mb-3" style={{ color: s.gold }}>★★★★★</div>
                <p className="text-[0.85rem] md:text-[0.9rem] italic leading-relaxed mb-5" style={{ color: s.text2 }}>{t.quote}</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-[0.9rem]" style={{ background: `linear-gradient(135deg,${s.gold},${s.goldLight})`, fontFamily: "'Playfair Display',serif", color: s.dark }}>{t.init}</div>
                  <div>
                    <div className="text-[0.84rem] font-semibold">{t.name}</div>
                    <div className="text-[0.72rem]" style={{ color: s.text3 }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="lp-section">
        <div className="lp-wrap">
          <CtaBanner
            title={<>Fii cu un pas înaintea<br />pieței imobiliare <i style={{ color: s.gold }}>din România.</i></>}
            desc="Fiecare zi în care lucrezi fără un CRM dedicat înseamnă lead-uri pierdute, timp irosit și bani lăsați pe masă."
            btnText="Accesează CRM-ul →"
          />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="pt-10 pb-5 md:pt-16 md:pb-8" style={{ background: s.dark2, borderTop: `1px solid ${s.subtleBorder}` }}>
        <div className="lp-wrap">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-8 md:mb-12">
            <div className="col-span-2 sm:col-span-1">
              <Logo onClick={() => nav("home")} />
              <p className="text-[0.82rem] leading-relaxed mt-3" style={{ color: s.text3 }}>CRM Imobiliar Pro pentru agenții și profesioniști din piața imobiliară românească.</p>
            </div>
            <div>
              <h4 className="text-[0.72rem] font-semibold uppercase tracking-wider mb-4" style={{ color: s.text2 }}>Produs</h4>
              <a onClick={() => nav("func")} className="block text-[0.82rem] mb-2 cursor-pointer" style={{ color: s.text3 }}>Funcționalități</a>
              <a onClick={() => nav("site")} className="block text-[0.82rem] mb-2 cursor-pointer" style={{ color: s.text3 }}>Site Agenție</a>
              <a onClick={() => nav("pret")} className="block text-[0.82rem] mb-2 cursor-pointer" style={{ color: s.text3 }}>Prețuri</a>
              <a onClick={() => nav("signup")} className="block text-[0.82rem] mb-2 cursor-pointer" style={{ color: s.text3 }}>Testează Gratuit</a>
            </div>
            <div>
              <h4 className="text-[0.72rem] font-semibold uppercase tracking-wider mb-4" style={{ color: s.text2 }}>Companie</h4>
              <a onClick={() => nav("despre")} className="block text-[0.82rem] mb-2 cursor-pointer" style={{ color: s.text3 }}>Despre Noi</a>
              <a onClick={() => nav("contact")} className="block text-[0.82rem] mb-2 cursor-pointer" style={{ color: s.text3 }}>Contact</a>
              <a onClick={() => nav("termeni")} className="block text-[0.82rem] mb-2 cursor-pointer" style={{ color: s.text3 }}>Termeni și condiții</a>
              <a onClick={() => nav("termeni")} className="block text-[0.82rem] mb-2 cursor-pointer" style={{ color: s.text3 }}>Confidențialitate</a>
            </div>
            <div>
              <h4 className="text-[0.72rem] font-semibold uppercase tracking-wider mb-4" style={{ color: s.text2 }}>Contact</h4>
              <p className="text-[0.82rem] mb-2" style={{ color: s.text3 }}>📞 0768 676 141</p>
              <p className="text-[0.82rem] mb-2" style={{ color: s.text3 }}>📞 0730 765 131</p>
              <p className="text-[0.82rem] mb-2" style={{ color: s.text3 }}>✉️ contact@societyhub.ro</p>
              <p className="text-[0.82rem] mb-2" style={{ color: s.text3 }}>🕐 L–V: 09:00 – 18:00</p>
              <p className="text-[0.82rem] mb-2" style={{ color: s.text3 }}>📍 București, România</p>
            </div>
          </div>
          <div className="border-t pt-5 md:pt-8 flex flex-col md:flex-row justify-between items-center gap-3" style={{ borderColor: s.subtleBorder }}>
            <div className="text-center md:text-left">
              <p className="text-[0.75rem]" style={{ color: s.text3 }}>© 2026 SocietyHUB — CRM Imobiliar Pro. Toate drepturile rezervate.</p>
              <p className="text-[0.65rem] mt-1" style={{ color: s.text3 }}>MURSE ADVERTISING S.R.L. · CUI: 44923890 · J40/16148/2021 · Înregistrată la 17.09.2021</p>
            </div>
            <div className="flex gap-4">
              <a onClick={() => nav("termeni")} className="text-[0.75rem] cursor-pointer" style={{ color: s.text3 }}>Termeni</a>
              <a onClick={() => nav("termeni")} className="text-[0.75rem] cursor-pointer" style={{ color: s.text3 }}>Confidențialitate</a>
              <a onClick={() => nav("contact")} className="text-[0.75rem] cursor-pointer" style={{ color: s.text3 }}>Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );

  const renderFunc = () => (
    <>
      <div className="lp-hero pt-20 md:pt-24" style={{ background: `linear-gradient(180deg,${s.dark} 0%,${s.dark2} 100%)`, borderBottom: `1px solid ${s.subtleBorder}` }}>
        <div className="lp-wrap">
          <Tag>Funcționalități</Tag>
          <h1 className="text-2xl md:text-[clamp(2.8rem,5vw,5rem)] font-black leading-tight mt-1" style={{ fontFamily: "'Playfair Display',serif" }}>
            Simplu de folosit<br />și intuitiv — <i style={{ color: s.gold }}>gândit pentru tine</i>
          </h1>
          <p className="text-[0.9rem] md:text-[1.1rem] leading-relaxed max-w-[600px] mt-3" style={{ color: s.text2 }}>Descoperă toate instrumentele care transformă SocietyHUB în cel mai complet CRM imobiliar din România.</p>
        </div>
      </div>
      <section className="lp-section">
        <div className="lp-wrap">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {funcItems.map(f => (
              <div key={f.num} className="flex gap-3 md:gap-5 p-4 md:p-7 rounded-[14px] transition-all duration-200" style={{ background: s.surface, border: `1px solid ${s.subtleBorder}` }}>
                <div className="text-3xl md:text-[2.8rem] font-black opacity-20 shrink-0 leading-none -mt-1" style={{ fontFamily: "'Playfair Display',serif", color: s.gold }}>{f.num}</div>
                <div>
                  <div className="text-[0.9rem] md:text-[1rem] font-semibold mb-1.5">{f.title}</div>
                  <div className="text-[0.8rem] md:text-[0.855rem] leading-relaxed" style={{ color: s.text2 }}>{f.desc}</div>
                  {f.subs && (
                    <ul className="list-none mt-2 p-0">
                      {f.subs.map(sub => (
                        <li key={sub} className="text-[0.75rem] md:text-[0.8rem] py-0.5 pl-4 relative" style={{ color: s.text3 }}>
                          <span className="absolute left-0 text-[0.72rem]" style={{ color: s.gold }}>→</span>
                          {sub}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="lp-section-slim">
        <div className="lp-wrap">
          <CtaBanner title="Vrei să vezi totul în acțiune?" desc="14 zile gratuit, fără card de credit necesar." btnText="Testează Gratuit Acum →" />
        </div>
      </section>
      <SmallFooter />
    </>
  );

  const renderSite = () => (
    <>
      <div className="lp-hero pt-20 md:pt-24" style={{ background: `linear-gradient(180deg,${s.dark} 0%,${s.dark2} 100%)`, borderBottom: `1px solid ${s.subtleBorder}` }}>
        <div className="lp-wrap">
          <Tag>Site Agenție Imobiliară</Tag>
          <h1 className="text-2xl md:text-[clamp(2.8rem,5vw,5rem)] font-black leading-tight mt-1" style={{ fontFamily: "'Playfair Display',serif" }}>
            Site modern, 100% funcțional,<br /><i style={{ color: s.gold }}>sincronizat în timp real</i>
          </h1>
          <p className="text-[0.9rem] md:text-[1.1rem] leading-relaxed max-w-[600px] mt-3" style={{ color: s.text2 }}>Website profesional pentru agenția ta, conectat direct cu SocietyHUB CRM și gata în o singură zi.</p>
        </div>
      </div>
      <section className="lp-section">
        <div className="lp-wrap">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {[
              { icon: "🔗", title: "Conectat cu CRM-ul tău", content: "Sincronizat în timp real cu SocietyHUB. Oferim mentenanță și actualizăm permanent sincronizarea." },
              { icon: "⚡", title: "100% Funcțional", content: "Creat să se miște rapid, robust și fără erori. Optimizat pentru o experiență excelentă pe orice dispozitiv." },
              { icon: "✏️", title: "Modifici oricând dorești", list: ["Nu mai aștepți după programatori", "Schimbi complet tema site-ului", "Schimbi texte, imagini, pagini, bannere"] },
              { icon: "🚀", title: "Site activ într-o zi", content: "Dacă ai conținut pregătit, prin SocietyHUB Site Builder poți avea un site gata în 24 de ore." },
            ].map(c => (
              <div key={c.title} className="p-5 md:p-7 rounded-[14px]" style={{ background: s.surface, border: `1px solid ${s.subtleBorder}`, borderLeft: `3px solid ${s.gold}` }}>
                <h3 className="text-[0.9rem] md:text-[1rem] font-semibold mb-2" style={{ color: s.gold }}>{c.icon} {c.title}</h3>
                {c.content && <p className="text-[0.82rem] leading-relaxed" style={{ color: s.text2 }}>{c.content}</p>}
                {c.list && (
                  <ul className="list-none mt-2 p-0">
                    {c.list.map(li => (
                      <li key={li} className="py-1 pl-5 relative text-[0.82rem] leading-relaxed" style={{ color: s.text2 }}>
                        <span className="absolute left-0 text-[0.75rem] top-1" style={{ color: s.green }}>✓</span>
                        {li}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
          <div className="mt-10 md:mt-16">
            <Tag>Pachete Site</Tag>
            <h2 className="text-xl md:text-[clamp(2rem,3.5vw,3.2rem)] font-bold leading-tight mt-1" style={{ fontFamily: "'Playfair Display',serif" }}>Alege planul potrivit</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8 md:mt-10">
              {[
                { tier: "Site Builder", name: "Basic", feats: ["Acces la 2 teme", "Site 100% funcțional", "10 imagini per proprietate", "SEO Basic Google", "2 pagini descriptive", "Sincronizare CRM în timp real"], featured: false },
                { tier: "Site Builder", name: "Standard", feats: ["Acces la 8 teme", "Imagini nelimitate", "SEO Avansat", "Integrare WhatsApp/Messenger", "Video + Tururi virtuale", "Cereri automate din site în CRM", "Campanii marketing FB/Google"], featured: true },
                { tier: "Site Builder", name: "Premium", feats: ["Toate temele disponibile", "Imagini nelimitate", "4 pagini descriptive", "Pagini ansambluri rezidențiale", "Video prezentare prima pagină", "Pagina agentului", "Ajutor prioritar la configurare"], featured: false },
              ].map(p => (
                <div key={p.name} className="p-6 md:p-8 rounded-[14px] relative" style={{ background: p.featured ? `linear-gradient(180deg,rgba(201,168,76,0.05),${s.surface})` : s.surface, border: `1px solid ${p.featured ? s.goldBorder : s.subtleBorder}` }}>
                  {p.featured && <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[0.7rem] font-bold px-4 py-1 rounded-full whitespace-nowrap" style={{ background: `linear-gradient(135deg,${s.gold},${s.goldLight})`, color: s.dark }}>⭐ Popular</div>}
                  <div className="text-[0.72rem] uppercase tracking-wider font-medium mb-3" style={{ color: s.text3 }}>{p.tier}</div>
                  <div className="text-xl font-bold mb-5" style={{ fontFamily: "'Playfair Display',serif" }}>{p.name}</div>
                  <ul className="list-none p-0 mb-6">
                    {p.feats.map(f => (
                      <li key={f} className="py-2 text-[0.82rem] flex items-start gap-2" style={{ color: s.text2, borderBottom: `1px solid ${s.subtleBorder}` }}>
                        <span className="text-[0.78rem] shrink-0 mt-0.5" style={{ color: s.green }}>✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button onClick={() => nav("signup")} className="w-full py-3 rounded-[10px] text-[0.88rem] font-semibold cursor-pointer" style={{ border: p.featured ? "none" : `1px solid rgba(255,255,255,0.1)`, background: p.featured ? `linear-gradient(135deg,${s.gold},${s.goldLight})` : "transparent", color: p.featured ? s.dark : s.text, fontFamily: "'DM Sans',sans-serif" }}>Testează Gratuit</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <SmallFooter />
    </>
  );

  const renderPret = () => (
    <>
      <div className="lp-hero pt-20 md:pt-24 text-center" style={{ background: `linear-gradient(180deg,${s.dark} 0%,${s.dark2} 100%)`, borderBottom: `1px solid ${s.subtleBorder}` }}>
        <div className="lp-wrap">
          <Tag>Prețuri Transparente</Tag>
          <h1 className="text-2xl md:text-[clamp(2.8rem,5vw,5rem)] font-black leading-tight mt-1" style={{ fontFamily: "'Playfair Display',serif" }}>Alege planul tău</h1>
          <p className="text-[0.9rem] md:text-[1.1rem] leading-relaxed max-w-[600px] mx-auto mt-3" style={{ color: s.text2 }}>Plătești doar pentru ceea ce folosești. Fără costuri ascunse.</p>
        </div>
      </div>
      <section className="lp-section">
        <div className="lp-wrap">
          <div className="flex flex-wrap items-center gap-3 justify-center mb-8 md:mb-14">
            <span className="text-[0.85rem]" style={{ color: annual ? s.text3 : s.text }}>Plată lunară</span>
            <div onClick={() => setAnnual(!annual)} className="w-12 h-7 rounded-full relative cursor-pointer transition-all duration-300" style={{ background: annual ? s.goldDim : s.surface2, border: `1px solid ${annual ? s.goldBorder : "rgba(255,255,255,0.1)"}` }}>
              <div className="absolute top-1 w-5 h-5 rounded-full transition-all duration-300" style={{ left: annual ? 24 : 3, background: annual ? s.gold : s.text3 }} />
            </div>
            <span className="text-[0.85rem]" style={{ color: annual ? s.text : s.text3 }}>Plată anuală</span>
            <span className="text-[0.68rem] font-bold px-2.5 py-1 rounded-full" style={{ background: `linear-gradient(135deg,${s.gold},${s.goldLight})`, color: s.dark }}>Discount 50%</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { tier: "SocietyHUB", name: "Basic", feats: ["Anunțuri particulari", "Gestiune proprietăți (50/utilizator)", "Publicare pe max. 3 portaluri", "Modul colaborare", "1 GB upload / utilizator", "Site agenție Basic", "Suport chat & mail"], featured: false },
              { tier: "SocietyHUB", name: "Standard", feats: ["Totul din Basic", "Gestiune cereri", "Matching AI automat", "Trimitere proprietăți pe WhatsApp", "100 proprietăți active / utilizator", "Publicare portaluri nelimitate", "10 GB upload / utilizator", "Site agenție Standard"], featured: true },
              { tier: "SocietyHUB", name: "Premium", feats: ["Totul din Standard", "Rapoarte avansate & Analytics", "Contracte digitale + semnătură", "Analiză Comparativă Piață", "Proprietăți nelimitate", "Upload documente nelimitat", "Site agenție Premium", "Suport telefonic prioritar"], featured: false },
            ].map((p, i) => (
              <div key={p.name} className="p-6 md:p-8 rounded-[14px] relative" style={{ background: p.featured ? `linear-gradient(180deg,rgba(201,168,76,0.05),${s.surface})` : s.surface, border: `1px solid ${p.featured ? s.goldBorder : s.subtleBorder}` }}>
                {p.featured && <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[0.7rem] font-bold px-4 py-1 rounded-full whitespace-nowrap" style={{ background: `linear-gradient(135deg,${s.gold},${s.goldLight})`, color: s.dark }}>⭐ Recomandat</div>}
                <div className="text-[0.72rem] uppercase tracking-wider font-medium mb-3" style={{ color: s.text3 }}>{p.tier}</div>
                <div className="text-xl font-bold mb-5" style={{ fontFamily: "'Playfair Display',serif" }}>{p.name}</div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-lg" style={{ color: s.gold }}>€</span>
                  <span className="text-4xl md:text-5xl font-black" style={{ fontFamily: "'Playfair Display',serif", color: s.gold }}>{prices[i]}</span>
                </div>
                <div className="text-[0.75rem] mb-6" style={{ color: s.text3 }}>+ TVA / utilizator / lună</div>
                <ul className="list-none p-0 mb-6">
                  {p.feats.map(f => (
                    <li key={f} className="py-2 text-[0.82rem] flex items-start gap-2" style={{ color: s.text2, borderBottom: `1px solid ${s.subtleBorder}` }}>
                      <span className="text-[0.78rem] shrink-0 mt-0.5" style={{ color: s.green }}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <button onClick={() => nav("signup")} className="w-full py-3 rounded-[10px] text-[0.88rem] font-semibold cursor-pointer" style={{ border: p.featured ? "none" : `1px solid rgba(255,255,255,0.1)`, background: p.featured ? `linear-gradient(135deg,${s.gold},${s.goldLight})` : "transparent", color: p.featured ? s.dark : s.text, fontFamily: "'DM Sans',sans-serif" }}>Testează Gratuit</button>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="lp-section-slim">
        <div className="lp-wrap">
          <CtaBanner title="Pregătit să începi?" desc="14 zile gratuit, fără card de credit. Anulezi oricând." btnText="Testează Gratuit →" />
        </div>
      </section>
      <SmallFooter />
    </>
  );

  const renderDespre = () => (
    <>
      <div className="lp-hero pt-20 md:pt-24" style={{ background: `linear-gradient(180deg,${s.dark} 0%,${s.dark2} 100%)`, borderBottom: `1px solid ${s.subtleBorder}` }}>
        <div className="lp-wrap">
          <Tag>Despre Noi</Tag>
          <h1 className="text-2xl md:text-[clamp(2.8rem,5vw,5rem)] font-black leading-tight mt-1" style={{ fontFamily: "'Playfair Display',serif" }}>
            Povestea din spatele<br /><i style={{ color: s.gold }}>SocietyHUB</i>
          </h1>
        </div>
      </div>
      <section className="lp-section">
        <div className="lp-wrap">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div>
              <p className="text-[0.88rem] leading-[1.8] mb-4" style={{ color: s.text2 }}>Creat cu pasiune și entuziasm din dorința de a dezvolta o unealtă cu adevărat utilă pentru agenții imobiliari, SocietyHUB a crescut frumos și s-a perfecționat într-o platformă de succes — o soluție completă pentru creșterea productivității și eficienței managerilor, agenților și personalului administrativ din domeniul imobiliar.</p>
              <p className="text-[0.88rem] leading-[1.8] mb-4" style={{ color: s.text2 }}>Bazele acestei platforme au fost puse de oameni care au cunoscut și s-au confruntat cu toate provocările de zi cu zi din domeniu, ajutați de parteneri pasionați de tehnologie. Echipa a crescut an de an, adunând peste 50 de ani de experiență cumulată în imobiliare și software.</p>
              <p className="text-[0.88rem] leading-[1.8]" style={{ color: s.text2 }}>Credem cu tărie că succesul în imobiliare depinde foarte mult de relațiile dintre oameni. De aceea, folosind SocietyHUB, te conectezi nu cu un program software, ci cu noi — o echipă dedicată exclusiv succesului tău.</p>
            </div>
            <div className="hidden lg:flex rounded-[14px] aspect-[4/3] items-center justify-center text-[5rem] opacity-25" style={{ background: s.surface, border: `1px solid ${s.goldBorder}`, color: s.gold }}>🏢</div>
          </div>

          <div className="mt-12 md:mt-20">
            <Tag>Valorile noastre</Tag>
            <h2 className="text-xl md:text-[clamp(2rem,3.5vw,3.2rem)] font-bold leading-tight mt-1" style={{ fontFamily: "'Playfair Display',serif" }}>Pilonii pe care <i style={{ color: s.gold }}>construim</i></h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 mt-8 md:mt-11">
              {[
                { icon: "🏆", title: "Calitate", desc: "Principala noastră preocupare pentru orice facem este calitatea. Un singur produs, făcut foarte bine." },
                { icon: "💪", title: "Echipă Puternică", desc: "Cunoaștem din proprie experiență industria imobiliară. Simțim nevoile și avem abilitățile să le rezolvăm." },
                { icon: "🤝", title: "Suntem Aici Pentru Tine", desc: "Vrem să-ți oferim prilejul de a te bucura mai mult de timpul tău. Răspundem întotdeauna prompt." },
                { icon: "💻", title: "State of the Art Code", desc: "Folosim cele mai moderne tehnologii și scriem cod folosind cele mai bune practici din industrie." },
                { icon: "🔄", title: "Continuitate", desc: "Pentru că facem lucrurile cu pasiune, ne-am luat angajamentul să fim aici, alături de tine, și peste 10 ani." },
                { icon: "💡", title: "Inovare", desc: "Inovăm, creăm și ne adaptăm permanent la nevoile pieței imobiliare în continuă schimbare." },
              ].map(v => (
                <div key={v.title} className="p-5 md:p-7 rounded-[14px] text-center" style={{ background: s.surface, border: `1px solid ${s.subtleBorder}` }}>
                  <div className="w-12 h-12 rounded-[10px] flex items-center justify-center text-xl mx-auto mb-4" style={{ background: s.goldDim, border: `1px solid ${s.goldBorder}` }}>{v.icon}</div>
                  <div className="text-[0.9rem] font-semibold mb-2">{v.title}</div>
                  <div className="text-[0.82rem] leading-relaxed" style={{ color: s.text2 }}>{v.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 md:mt-20">
            <Tag>Echipa</Tag>
            <h2 className="text-xl md:text-[clamp(2rem,3.5vw,3.2rem)] font-bold leading-tight mt-1" style={{ fontFamily: "'Playfair Display',serif" }}>Oamenii din spatele <i style={{ color: s.gold }}>platformei</i></h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 mt-8 md:mt-11">
              {teamMembers.map(t => (
                <div key={t.name} className="p-4 md:p-5 rounded-[14px] text-center transition-all duration-200" style={{ background: s.surface, border: `1px solid ${s.subtleBorder}` }}>
                  <div className="w-14 h-14 md:w-[68px] md:h-[68px] rounded-full flex items-center justify-center text-lg md:text-xl font-bold mx-auto mb-3" style={{ background: `linear-gradient(135deg,${s.goldDim},rgba(74,108,247,0.15))`, border: `2px solid ${s.goldBorder}`, fontFamily: "'Playfair Display',serif", color: s.gold }}>{t.initials}</div>
                  <div className="text-[0.82rem] md:text-[0.9rem] font-semibold mb-0.5">{t.name}</div>
                  <div className="text-[0.68rem] md:text-[0.75rem]" style={{ color: s.gold }}>{t.role}</div>
                </div>
              ))}
              <div onClick={() => nav("contact")} className="p-4 md:p-5 rounded-[14px] text-center cursor-pointer" style={{ background: s.surface, border: `1px dashed ${s.subtleBorder}` }}>
                <div className="w-14 h-14 md:w-[68px] md:h-[68px] rounded-full flex items-center justify-center text-lg md:text-xl font-bold mx-auto mb-3" style={{ background: s.dark3, fontFamily: "'Playfair Display',serif", color: s.gold }}>+</div>
                <div className="text-[0.82rem] md:text-[0.9rem] font-semibold mb-0.5">Vino alături!</div>
                <div className="text-[0.68rem] md:text-[0.75rem]" style={{ color: s.gold }}>Căutăm oameni buni</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="lp-section-slim">
        <div className="lp-wrap">
          <CtaBanner title="Alătură-te comunității SocietyHUB" desc="1.200+ profesioniști ne-au ales deja. Tu ești următorul." btnText="Testează Gratuit →" />
        </div>
      </section>
      <SmallFooter />
    </>
  );

  const renderContact = () => (
    <>
      <div className="lp-hero pt-20 md:pt-24" style={{ background: `linear-gradient(180deg,${s.dark} 0%,${s.dark2} 100%)`, borderBottom: `1px solid ${s.subtleBorder}` }}>
        <div className="lp-wrap">
          <Tag>Contact</Tag>
          <h1 className="text-2xl md:text-[clamp(2.8rem,5vw,5rem)] font-black leading-tight mt-1" style={{ fontFamily: "'Playfair Display',serif" }}>
            Suntem <i style={{ color: s.gold }}>aici pentru tine</i>
          </h1>
          <p className="text-[0.9rem] md:text-[1.1rem] leading-relaxed max-w-[600px] mt-3" style={{ color: s.text2 }}>Scrie-ne, sună-ne sau vino la birou. Îți răspundem rapid și cu drag.</p>
        </div>
      </div>
      <section className="lp-section">
        <div className="lp-wrap">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.65fr] gap-6 md:gap-12">
            <div className="flex flex-col gap-4">
              <div className="p-5 md:p-6 rounded-[14px]" style={{ background: s.surface, border: `1px solid ${s.subtleBorder}` }}>
                <div className="text-[0.72rem] font-semibold uppercase tracking-wider mb-3" style={{ color: s.gold }}>📞 Vânzări</div>
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-start gap-2 text-[0.84rem]" style={{ color: s.text2 }}><span style={{ color: s.gold }}>📱</span>0768 676 141</div>
                  <div className="flex items-start gap-2 text-[0.84rem]" style={{ color: s.text2 }}><span style={{ color: s.gold }}>📱</span>0730 765 131</div>
                  <div className="flex items-start gap-2 text-[0.84rem]" style={{ color: s.text2 }}><span style={{ color: s.gold }}>✉️</span>vanzari@societyhub.ro</div>
                  <div className="flex items-start gap-2 text-[0.84rem]" style={{ color: s.text2 }}><span style={{ color: s.gold }}>🕐</span>09:00 – 18:00 (L–V)</div>
                </div>
              </div>
              <div className="p-5 md:p-6 rounded-[14px]" style={{ background: s.surface, border: `1px solid ${s.subtleBorder}` }}>
                <div className="text-[0.72rem] font-semibold uppercase tracking-wider mb-3" style={{ color: s.gold }}>🛠️ Suport Tehnic</div>
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-start gap-2 text-[0.84rem]" style={{ color: s.text2 }}><span style={{ color: s.gold }}>✉️</span>suport@societyhub.ro</div>
                  <div className="flex items-start gap-2 text-[0.84rem]" style={{ color: s.text2 }}><span style={{ color: s.gold }}>🕐</span>09:00 – 17:30 (L–V)</div>
                </div>
              </div>
              <div className="p-5 md:p-6 rounded-[14px]" style={{ background: s.surface, border: `1px solid ${s.subtleBorder}` }}>
                <div className="text-[0.72rem] font-semibold uppercase tracking-wider mb-3" style={{ color: s.gold }}>📍 Biroul Nostru</div>
                <div className="flex items-start gap-2 text-[0.84rem]" style={{ color: s.text2 }}><span style={{ color: s.gold }}>🏢</span><span>București, România</span></div>
                <div className="flex items-start gap-2 mt-2.5 text-[0.75rem]" style={{ color: s.text3 }}><span style={{ color: s.gold }}>📄</span><span>MURSE ADVERTISING S.R.L.<br />CUI: 44923890<br />Nr. Înmatriculare: J40/16148/2021<br />Data înființării: 17.09.2021</span></div>
              </div>
            </div>
            <div className="p-5 md:p-8 rounded-[14px]" style={{ background: s.surface, border: `1px solid ${s.subtleBorder}` }}>
              <h3 className="text-lg md:text-xl mb-5 md:mb-6" style={{ fontFamily: "'Playfair Display',serif" }}>Trimite-ne un mesaj</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-4">
                <div><label style={labelStyle}>Prenume</label><input type="text" placeholder="Ion" style={inputStyle} /></div>
                <div><label style={labelStyle}>Nume</label><input type="text" placeholder="Popescu" style={inputStyle} /></div>
              </div>
              <div className="mb-4"><label style={labelStyle}>Email</label><input type="email" placeholder="ion@agentie.ro" style={inputStyle} /></div>
              <div className="mb-4"><label style={labelStyle}>Telefon</label><input type="tel" placeholder="07XX XXX XXX" style={inputStyle} /></div>
              <div className="mb-4"><label style={labelStyle}>Subiect</label>
                <select style={inputStyle}>
                  <option>Vreau o demonstrație</option><option>Informații prețuri</option><option>Suport tehnic</option><option>Parteneriat</option><option>Altele</option>
                </select>
              </div>
              <div className="mb-4"><label style={labelStyle}>Mesaj</label><textarea placeholder="Descrie-ne cum te putem ajuta..." style={{ ...inputStyle, resize: "vertical" as const, minHeight: 100 }} /></div>
              <BtnPrimary onClick={() => alert("Mesaj trimis! Te vom contacta în scurt timp.")}>Trimite Mesajul →</BtnPrimary>
            </div>
          </div>
        </div>
      </section>
      <SmallFooter />
    </>
  );

  const renderAuth = () => (
    <div className="min-h-screen flex items-center justify-center p-4 pt-20" style={{ background: `radial-gradient(ellipse at center,rgba(201,168,76,0.055) 0%,${s.dark} 65%)` }}>
      <div className="w-full max-w-[440px] p-6 md:p-10 rounded-2xl" style={{ background: s.surface, border: `1px solid ${s.goldBorder}` }}>
        <div className="flex justify-center mb-6 md:mb-8"><Logo /></div>
        <h2 className="text-xl md:text-2xl font-bold text-center mb-1" style={{ fontFamily: "'Playfair Display',serif" }}>Bun venit înapoi</h2>
        <p className="text-[0.84rem] text-center mb-6 md:mb-8" style={{ color: s.text2 }}>Autentifică-te în contul tău SocietyHUB</p>
        <div className="mb-4"><label style={labelStyle}>Email</label><input type="email" placeholder="email@agentie.ro" style={inputStyle} /></div>
        <div className="mb-4"><label style={labelStyle}>Parolă</label><input type="password" placeholder="••••••••" style={inputStyle} /></div>
        <div className="flex justify-between items-center mb-5">
          <label className="flex items-center gap-2 text-[0.8rem] cursor-pointer" style={{ color: s.text2 }}><input type="checkbox" style={{ accentColor: s.gold }} />Ține-mă minte</label>
          <span className="text-[0.8rem] cursor-pointer" style={{ color: s.gold }}>Ai uitat parola?</span>
        </div>
        <button onClick={() => navigate("/dashboard")} className="w-full flex justify-center items-center gap-2 py-3 rounded-[10px] text-[0.9rem] font-semibold cursor-pointer border-none" style={{ background: `linear-gradient(135deg,${s.gold},${s.goldLight})`, color: s.dark, fontFamily: "'DM Sans',sans-serif" }}>Intră în Cont →</button>
        <div className="text-center mt-5 text-[0.82rem]" style={{ color: s.text3 }}>Nu ai cont? <span onClick={() => nav("signup")} className="cursor-pointer" style={{ color: s.gold }}>Creează unul gratuit</span></div>
      </div>
    </div>
  );

  const renderSignup = () => (
    <div className="min-h-screen flex items-center justify-center p-4 pt-20" style={{ background: `radial-gradient(ellipse at top right,rgba(201,168,76,0.06) 0%,${s.dark} 55%)` }}>
      <div className="w-full max-w-[540px] p-6 md:p-10 rounded-2xl" style={{ background: s.surface, border: `1px solid ${s.goldBorder}` }}>
        <div className="flex justify-center mb-6 md:mb-8"><Logo /></div>
        <h2 className="text-xl md:text-2xl font-bold text-center mb-1" style={{ fontFamily: "'Playfair Display',serif" }}>14 Zile Gratuit</h2>
        <p className="text-[0.84rem] text-center mb-6 md:mb-8" style={{ color: s.text2 }}>Fără card de credit. Anulezi oricând. Completezi în 2 minute.</p>
        <Tag>Alege planul de start</Tag>
        <div className="grid grid-cols-3 gap-2 md:gap-3 mb-6 md:mb-8">
          {["Basic", "Standard", "Premium"].map((p, i) => (
            <div key={p} onClick={() => setSelectedPlan(i)} className="rounded-[10px] p-3 text-center cursor-pointer transition-all duration-200" style={{ border: `1px solid ${selectedPlan === i ? s.goldBorder : "rgba(255,255,255,0.09)"}`, background: selectedPlan === i ? s.goldDim : "transparent" }}>
              <div className="text-[0.75rem] font-semibold">{p}</div>
              <div className="text-base font-bold mt-0.5" style={{ color: s.gold }}>€{prices[i]}</div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-4">
          <div><label style={labelStyle}>Prenume</label><input type="text" placeholder="Ion" style={inputStyle} /></div>
          <div><label style={labelStyle}>Nume</label><input type="text" placeholder="Popescu" style={inputStyle} /></div>
        </div>
        <div className="mb-4"><label style={labelStyle}>Email profesional</label><input type="email" placeholder="ion@agentie.ro" style={inputStyle} /></div>
        <div className="mb-4"><label style={labelStyle}>Telefon</label><input type="tel" placeholder="07XX XXX XXX" style={inputStyle} /></div>
        <div className="mb-4"><label style={labelStyle}>Numele agenției</label><input type="text" placeholder="Agentia Mea Imobiliară SRL" style={inputStyle} /></div>
        <div className="mb-4"><label style={labelStyle}>Număr de agenți</label>
          <select style={inputStyle}>
            <option>1 agent</option><option>2–5 agenți</option><option>6–15 agenți</option><option>16–30 agenți</option><option>30+ agenți</option>
          </select>
        </div>
        <div className="mb-4"><label style={labelStyle}>Parolă</label><input type="password" placeholder="Minim 8 caractere" style={inputStyle} /></div>
        <button onClick={() => alert("Înregistrare simulată! Verifică emailul pentru activare.")} className="w-full flex justify-center items-center gap-2 py-3 rounded-[10px] text-[0.9rem] font-semibold cursor-pointer border-none" style={{ background: `linear-gradient(135deg,${s.gold},${s.goldLight})`, color: s.dark, fontFamily: "'DM Sans',sans-serif" }}>Creează Contul Gratuit →</button>
        <div className="text-center mt-5 text-[0.82rem]" style={{ color: s.text3 }}>Ai deja cont? <span onClick={() => nav("auth")} className="cursor-pointer" style={{ color: s.gold }}>Autentifică-te</span></div>
      </div>
    </div>
  );

  const renderTermeni = () => (
    <>
      <div className="lp-hero pt-20 md:pt-24" style={{ background: `linear-gradient(180deg,${s.dark} 0%,${s.dark2} 100%)`, borderBottom: `1px solid ${s.subtleBorder}` }}>
        <div className="lp-wrap">
          <Tag>Legal</Tag>
          <h1 className="text-2xl md:text-[clamp(2.8rem,5vw,5rem)] font-black leading-tight mt-1" style={{ fontFamily: "'Playfair Display',serif" }}>
            Termeni și <i style={{ color: s.gold }}>Condiții</i>
          </h1>
        </div>
      </div>
      <section className="lp-section">
        <div className="lp-wrap" style={{ maxWidth: 800 }}>
          <div className="p-5 md:p-8 rounded-[14px]" style={{ background: s.surface, border: `1px solid ${s.subtleBorder}` }}>
            <h2 className="text-lg md:text-xl font-bold mb-4" style={{ fontFamily: "'Playfair Display',serif" }}>1. Informații despre operator</h2>
            <p className="text-[0.85rem] leading-relaxed mb-5" style={{ color: s.text2 }}>
              Platforma SocietyHUB este operată de <strong style={{ color: s.text }}>MURSE ADVERTISING S.R.L.</strong>, societate comercială înregistrată în România.<br /><br />
              • Cod Unic de Înregistrare (CUI): <strong style={{ color: s.text }}>44923890</strong><br />
              • Număr de înmatriculare: <strong style={{ color: s.text }}>J40/16148/2021</strong><br />
              • EUID: ROONRC.J40/16148/2021<br />
              • Data înființării: <strong style={{ color: s.text }}>17 septembrie 2021</strong><br />
              • Sediu: București, România<br />
              • Email: contact@societyhub.ro
            </p>

            <h2 className="text-lg md:text-xl font-bold mb-4" style={{ fontFamily: "'Playfair Display',serif" }}>2. Acceptarea termenilor</h2>
            <p className="text-[0.85rem] leading-relaxed mb-5" style={{ color: s.text2 }}>
              Prin accesarea și utilizarea platformei SocietyHUB, acceptați în mod expres acești Termeni și Condiții. Dacă nu sunteți de acord cu oricare dintre prevederile de mai jos, vă rugăm să nu utilizați platforma.
            </p>

            <h2 className="text-lg md:text-xl font-bold mb-4" style={{ fontFamily: "'Playfair Display',serif" }}>3. Descrierea serviciilor</h2>
            <p className="text-[0.85rem] leading-relaxed mb-5" style={{ color: s.text2 }}>
              SocietyHUB este o platformă CRM destinată profesioniștilor din domeniul imobiliar, oferind funcționalități precum: gestionarea proprietăților, a clienților și a tranzacțiilor, publicare pe portaluri imobiliare, generare de contracte, campanii de marketing, analytics și colaborare MLS.
            </p>

            <h2 className="text-lg md:text-xl font-bold mb-4" style={{ fontFamily: "'Playfair Display',serif" }}>4. Contul de utilizator</h2>
            <p className="text-[0.85rem] leading-relaxed mb-5" style={{ color: s.text2 }}>
              Utilizatorii sunt responsabili pentru confidențialitatea credențialelor de acces. Orice activitate desfășurată prin contul dumneavoastră este responsabilitatea dumneavoastră. Vă obligați să furnizați informații corecte și actualizate la înregistrare.
            </p>

            <h2 className="text-lg md:text-xl font-bold mb-4" style={{ fontFamily: "'Playfair Display',serif" }}>5. Politica de confidențialitate și cookie-uri</h2>
            <p className="text-[0.85rem] leading-relaxed mb-5" style={{ color: s.text2 }}>
              Colectăm și procesăm date personale în conformitate cu Regulamentul (UE) 2016/679 (GDPR). Datele sunt utilizate exclusiv pentru furnizarea și îmbunătățirea serviciilor noastre.<br /><br />
              <strong style={{ color: s.text }}>Cookie-uri utilizate:</strong><br />
              • <strong style={{ color: s.text }}>Cookie-uri esențiale</strong> — necesare pentru funcționarea platformei<br />
              • <strong style={{ color: s.text }}>Cookie-uri analitice</strong> — pentru înțelegerea modului de utilizare a platformei<br />
              • <strong style={{ color: s.text }}>Cookie-uri de marketing</strong> — pentru personalizarea experienței și a comunicărilor<br /><br />
              Puteți gestiona preferințele cookie-urilor din setările browserului dumneavoastră.
            </p>

            <h2 className="text-lg md:text-xl font-bold mb-4" style={{ fontFamily: "'Playfair Display',serif" }}>6. Proprietate intelectuală</h2>
            <p className="text-[0.85rem] leading-relaxed mb-5" style={{ color: s.text2 }}>
              Toate drepturile de proprietate intelectuală asupra platformei SocietyHUB, inclusiv designul, codul sursă, conținutul și marca, aparțin MURSE ADVERTISING S.R.L. Este interzisă reproducerea, distribuirea sau modificarea fără acord scris.
            </p>

            <h2 className="text-lg md:text-xl font-bold mb-4" style={{ fontFamily: "'Playfair Display',serif" }}>7. Plăți și facturare</h2>
            <p className="text-[0.85rem] leading-relaxed mb-5" style={{ color: s.text2 }}>
              Prețurile afișate sunt exprimate în EUR, fără TVA. Facturarea se realizează lunar sau anual, conform planului ales. Anularea abonamentului poate fi efectuată oricând din contul de utilizator.
            </p>

            <h2 className="text-lg md:text-xl font-bold mb-4" style={{ fontFamily: "'Playfair Display',serif" }}>8. Limitarea răspunderii</h2>
            <p className="text-[0.85rem] leading-relaxed mb-5" style={{ color: s.text2 }}>
              MURSE ADVERTISING S.R.L. nu va fi responsabilă pentru daune indirecte, pierderi de date sau întreruperi ale serviciului cauzate de factori externi. Depunem eforturi rezonabile pentru a asigura disponibilitatea și securitatea platformei.
            </p>

            <h2 className="text-lg md:text-xl font-bold mb-4" style={{ fontFamily: "'Playfair Display',serif" }}>9. Legea aplicabilă</h2>
            <p className="text-[0.85rem] leading-relaxed mb-5" style={{ color: s.text2 }}>
              Acești Termeni și Condiții sunt guvernați de legislația din România. Orice litigiu va fi soluționat de instanțele competente din București.
            </p>

            <div className="border-t pt-5 mt-4" style={{ borderColor: s.subtleBorder }}>
              <p className="text-[0.78rem]" style={{ color: s.text3 }}>Ultima actualizare: Martie 2026</p>
            </div>
          </div>
        </div>
      </section>
      <SmallFooter />
    </>
  );

  const pages: Record<PageKey, () => JSX.Element> = {
    home: renderHome,
    func: renderFunc,
    site: renderSite,
    pret: renderPret,
    despre: renderDespre,
    contact: renderContact,
    auth: renderAuth,
    signup: renderSignup,
    termeni: renderTermeni,
  };

  return (
    <div className="overflow-x-hidden min-h-screen" style={{ fontFamily: "'DM Sans',sans-serif", background: s.dark, color: s.text }}>
      {/* MOBILE MENU */}
      <div className="fixed inset-0 z-[998] flex flex-col items-center justify-center gap-6 transition-transform duration-300" style={{ background: "rgba(9,9,14,0.97)", transform: mobOpen ? "translateX(0)" : "translateX(100%)" }}>
        <span onClick={() => setMobOpen(false)} className="absolute top-5 right-6 text-xl cursor-pointer" style={{ color: s.text3 }}>✕</span>
        <a onClick={() => nav("home")} className="text-2xl cursor-pointer" style={{ fontFamily: "'Playfair Display',serif" }}>Acasă</a>
        {NAV_ITEMS.map(n => (
          <a key={n.key} onClick={() => nav(n.key)} className="text-2xl cursor-pointer" style={{ fontFamily: "'Playfair Display',serif" }}>{n.label}</a>
        ))}
        <a onClick={() => navigate("/dashboard")} className="text-lg cursor-pointer" style={{ color: s.gold }}>🖥️ Demo Dashboard</a>
        <a onClick={() => nav("auth")} className="text-base cursor-pointer" style={{ color: s.text2 }}>Autentificare</a>
        <a onClick={() => nav("signup")} className="text-base cursor-pointer" style={{ color: s.gold }}>Testează Gratuit</a>
      </div>

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-[1000]" style={{ background: "rgba(9,9,14,0.88)", backdropFilter: "blur(24px)", borderBottom: `1px solid ${s.goldBorder}` }}>
        <div className="lp-wrap flex items-center justify-between h-14 md:h-[68px]">
          <Logo onClick={() => nav("home")} />
          <div className="hidden md:flex items-center gap-0">
            {NAV_ITEMS.map(n => (
              <a key={n.key} onClick={() => nav(n.key)} className="px-3 py-1.5 rounded-lg text-[0.82rem] cursor-pointer transition-all duration-150" style={{ color: page === n.key ? s.gold : s.text2, background: page === n.key ? s.goldDim : "transparent" }}>{n.label}</a>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-2">
            <button onClick={() => nav("auth")} className="px-3 py-1.5 rounded-lg text-[0.82rem] cursor-pointer bg-transparent" style={{ border: `1px solid rgba(255,255,255,0.1)`, color: s.text2, fontFamily: "'DM Sans',sans-serif" }}>Autentificare</button>
            <button onClick={() => nav("signup")} className="px-3 py-2 rounded-lg text-[0.82rem] font-semibold cursor-pointer border-none" style={{ background: `linear-gradient(135deg,${s.gold},${s.goldLight})`, color: s.dark, fontFamily: "'DM Sans',sans-serif" }}>Testează Gratuit</button>
          </div>
          <div className="flex md:hidden flex-col gap-[5px] cursor-pointer p-2" onClick={() => setMobOpen(true)}>
            <span className="block w-5 h-0.5 rounded-sm" style={{ background: s.text2 }} />
            <span className="block w-5 h-0.5 rounded-sm" style={{ background: s.text2 }} />
            <span className="block w-5 h-0.5 rounded-sm" style={{ background: s.text2 }} />
          </div>
        </div>
      </nav>

      {/* PAGE CONTENT */}
      <div className="min-h-[calc(100vh-56px)] md:min-h-[calc(100vh-68px)]">
        {pages[page]()}
      </div>

      {/* COOKIE CONSENT BANNER */}
      {!cookieAccepted && (
        <div className="fixed bottom-0 left-0 right-0 z-[1001] px-4 py-3 md:py-4 md:px-8" style={{ background: "rgba(9,9,14,0.97)", backdropFilter: "blur(16px)", borderTop: `1px solid ${s.goldBorder}` }}>
          <div className="lp-wrap flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p className="text-[0.78rem] md:text-[0.84rem] leading-relaxed flex-1 min-w-0" style={{ color: s.text2 }}>
              🍪 Folosim cookie-uri pentru a îmbunătăți experiența ta pe platformă. Prin continuarea navigării, ești de acord cu{" "}
              <span onClick={() => nav("termeni")} className="underline cursor-pointer" style={{ color: s.gold }}>Politica de Cookie-uri și Termenii și Condițiile</span> noastre.
            </p>
            <div className="flex gap-2 shrink-0 w-full sm:w-auto">
              <button onClick={() => { setCookieAccepted(true); localStorage.setItem("cookie_accepted", "true"); }} className="flex-1 sm:flex-initial px-4 py-2 rounded-lg text-[0.8rem] font-semibold cursor-pointer border-none" style={{ background: `linear-gradient(135deg,${s.gold},${s.goldLight})`, color: s.dark, fontFamily: "'DM Sans',sans-serif" }}>Accept toate</button>
              <button onClick={() => { setCookieAccepted(true); localStorage.setItem("cookie_accepted", "true"); }} className="flex-1 sm:flex-initial px-4 py-2 rounded-lg text-[0.8rem] font-semibold cursor-pointer bg-transparent" style={{ border: `1px solid rgba(255,255,255,0.12)`, color: s.text2, fontFamily: "'DM Sans',sans-serif" }}>Doar esențiale</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
