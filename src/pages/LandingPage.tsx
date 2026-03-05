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

/* ─── STYLES (matching the HTML CSS) ─── */
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
    <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: s.goldDim, border: `1px solid ${s.goldBorder}`, borderRadius: 100, padding: "5px 14px", fontSize: "0.73rem", color: s.gold, fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: "1.25rem" }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: s.gold, flexShrink: 0 }} />
      {children}
    </div>
  );

  const BtnPrimary = ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <button onClick={onClick} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "0.85rem 1.9rem", borderRadius: 10, fontSize: "0.95rem", fontWeight: 600, cursor: "pointer", border: "none", background: `linear-gradient(135deg,${s.gold},${s.goldLight})`, color: s.dark, fontFamily: "'DM Sans',sans-serif", transition: "all 0.22s" }}
      onMouseOver={e => { (e.target as HTMLElement).style.transform = "translateY(-2px)"; (e.target as HTMLElement).style.boxShadow = "0 10px 32px rgba(201,168,76,0.38)"; }}
      onMouseOut={e => { (e.target as HTMLElement).style.transform = ""; (e.target as HTMLElement).style.boxShadow = ""; }}
    >{children}</button>
  );

  const BtnSecondary = ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <button onClick={onClick} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "0.85rem 1.9rem", borderRadius: 10, fontSize: "0.95rem", fontWeight: 600, cursor: "pointer", background: "transparent", border: "1px solid rgba(255,255,255,0.12)", color: s.text, fontFamily: "'DM Sans',sans-serif", transition: "all 0.22s" }}
      onMouseOver={e => { (e.target as HTMLElement).style.borderColor = s.goldBorder; (e.target as HTMLElement).style.color = s.gold; }}
      onMouseOut={e => { (e.target as HTMLElement).style.borderColor = "rgba(255,255,255,0.12)"; (e.target as HTMLElement).style.color = s.text; }}
    >{children}</button>
  );

  const Logo = ({ onClick }: { onClick?: () => void }) => (
    <div onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", userSelect: "none" }}>
      <div style={{ width: 34, height: 34, borderRadius: 8, background: `linear-gradient(135deg,${s.gold},${s.goldLight})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Playfair Display',serif", fontWeight: 900, color: s.dark, fontSize: 17, flexShrink: 0 }}>S</div>
      <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.2rem", fontWeight: 700, letterSpacing: "0.01em" }}>Society<span style={{ color: s.gold }}>HUB</span></div>
    </div>
  );

  const CtaBanner = ({ title, desc, btnText }: { title: React.ReactNode; desc: string; btnText: string }) => (
    <div style={{ background: `linear-gradient(135deg,${s.dark3} 0%,${s.surface2} 100%)`, border: `1px solid ${s.goldBorder}`, borderRadius: 20, padding: "5rem", textAlign: "center", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "-40%", left: "50%", transform: "translateX(-50%)", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle,rgba(201,168,76,0.07),transparent 65%)", pointerEvents: "none" }} />
      <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(2rem,3.5vw,3.2rem)", fontWeight: 700, lineHeight: 1.12, position: "relative", zIndex: 1 }}>{title}</h2>
      <p style={{ position: "relative", zIndex: 1, color: s.text2, fontSize: "1rem", margin: "1.25rem auto 2.5rem", maxWidth: 500, lineHeight: 1.7 }}>{desc}</p>
      <div style={{ position: "relative", zIndex: 1 }}>
        <BtnPrimary onClick={() => nav("signup")}>{btnText}</BtnPrimary>
      </div>
    </div>
  );

  const SmallFooter = () => (
    <footer style={{ background: s.dark2, borderTop: `1px solid ${s.subtleBorder}`, padding: "2rem 0" }}>
      <div className="wrap" style={{ maxWidth: 1300, margin: "0 auto", padding: "0 2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <p style={{ fontSize: "0.8rem", color: s.text3 }}>© 2026 SocietyHUB. Toate drepturile rezervate.</p>
            <p style={{ fontSize: "0.7rem", color: s.text3, marginTop: "0.3rem" }}>MURSE ADVERTISING S.R.L. · CUI: 44923890 · J40/16148/2021</p>
          </div>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            <a onClick={() => nav("termeni")} style={{ fontSize: "0.8rem", color: s.text3, cursor: "pointer" }}>Termeni</a>
            <a onClick={() => nav("contact")} style={{ fontSize: "0.8rem", color: s.text3, cursor: "pointer" }}>Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );

  const wrap: React.CSSProperties = { maxWidth: 1300, margin: "0 auto", padding: "0 2rem" };
  const sectionPad: React.CSSProperties = { padding: "6rem 0" };
  const sectionSlim: React.CSSProperties = { padding: "4rem 0" };
  const pageHero: React.CSSProperties = { padding: "5.5rem 0 3.5rem", background: `linear-gradient(180deg,${s.dark} 0%,${s.dark2} 100%)`, borderBottom: `1px solid ${s.subtleBorder}` };

  /* ─── RENDER PAGES ─── */

  const renderHome = () => (
    <>
      {/* HERO */}
      <div style={{ minHeight: "94vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden", paddingTop: 68 }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 70% 70% at 100% 50%,rgba(201,168,76,0.07) 0%,transparent 65%),radial-gradient(ellipse 60% 90% at 0% 100%,rgba(74,108,247,0.05) 0%,transparent 60%),linear-gradient(180deg,${s.dark} 0%,${s.dark2} 100%)` }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(201,168,76,0.035) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.035) 1px,transparent 1px)", backgroundSize: "72px 72px", maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%,black,transparent)" }} />
        <div style={{ ...wrap, position: "relative", zIndex: 2, width: "100%" }}>
          <div style={{ maxWidth: 740, position: "relative", zIndex: 2 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: s.goldDim, border: `1px solid ${s.goldBorder}`, borderRadius: 100, padding: "6px 15px", fontSize: "0.76rem", color: s.gold, fontWeight: 600, marginBottom: "2rem", letterSpacing: "0.04em" }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: s.gold, animation: "pulse 2s infinite" }} />
              CRM Imobiliar #1 în România
            </div>
            <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(2.8rem,5vw,5rem)", fontWeight: 900, lineHeight: 1.06, letterSpacing: "-0.02em" }}>
              Imobiliare<br />profesionale<br /><i style={{ color: s.gold }}>fără compromisuri.</i>
            </h1>
            <p style={{ fontSize: "1.15rem", color: s.text2, lineHeight: 1.72, margin: "1.5rem 0 2.5rem", maxWidth: 580 }}>
              SocietyHUB este singura platformă construită complet în România care îți oferă toate instrumentele pentru a construi sau scala o afacere imobiliară profitabilă.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginBottom: "3.5rem" }}>
              <BtnPrimary onClick={() => nav("signup")}>Accesează CRM-ul →</BtnPrimary>
              <BtnSecondary onClick={() => navigate("/dashboard")}>🖥️ Demo Dashboard</BtnSecondary>
              <BtnSecondary onClick={() => nav("func")}>Descoperă funcționalitățile</BtnSecondary>
            </div>
            <div className="flex flex-wrap gap-6 md:gap-14">
              {[
                { num: "1.200+", label: "Agenți și agenții\nactive în platformă" },
                { num: "34.000+", label: "Proprietăți gestionate\nlunar prin CRM" },
                { num: "4.9 ★", label: "Rating mediu\nutilizatori verificați" },
              ].map(st => (
                <div key={st.num} className="flex flex-col gap-1">
                  <span style={{ fontFamily: "'Playfair Display',serif", fontSize: "2.1rem", fontWeight: 900, color: s.gold, lineHeight: 1 }}>{st.num}</span>
                  <span style={{ fontSize: "0.79rem", color: s.text3, lineHeight: 1.4, whiteSpace: "pre-line" }}>{st.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* CRM Mockup - desktop only */}
        <div className="hidden lg:block" style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)", width: "46%", maxWidth: 700, zIndex: 1, paddingRight: "1rem" }}>
          <div style={{ background: s.surface, border: `1px solid ${s.goldBorder}`, borderRadius: 18, overflow: "hidden", boxShadow: "0 48px 100px rgba(0,0,0,0.65),0 0 0 1px rgba(201,168,76,0.08),inset 0 1px 0 rgba(255,255,255,0.04)" }}>
            <div style={{ background: s.dark3, padding: "12px 16px", display: "flex", alignItems: "center", gap: 8, borderBottom: `1px solid ${s.subtleBorder}` }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#FF5757" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#FFB224" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#22C55E" }} />
              <span style={{ marginLeft: 8, fontSize: "0.71rem", color: s.text3 }}>SocietyHUB CRM — Proprietăți</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "190px 1fr", height: 400 }}>
              <div style={{ background: s.dark2, borderRight: `1px solid ${s.subtleBorder}`, padding: "1rem 0", display: "flex", flexDirection: "column", gap: 2 }}>
                {["Dashboard", "Proprietăți", "Cereri", "Contacte", "Calendar", "Pipeline", "Campanii", "Contracte", "Rapoarte", "MLS"].map((item, i) => (
                  <div key={item} style={{ padding: "9px 16px", fontSize: "0.76rem", color: i === 0 ? s.gold : s.text3, display: "flex", alignItems: "center", gap: 9, background: i === 0 ? s.goldDim : "transparent" }}>
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: "currentColor", opacity: 0.6 }} />
                    {item}
                  </div>
                ))}
              </div>
              <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 10, overflow: "hidden" }}>
                {[
                  { emoji: "🏠", name: "Apartament 3 cam. Floreasca", loc: "București, Sector 2 · 78mp", chip: "Activ", chipColor: s.green, price: "€185.000" },
                  { emoji: "🏢", name: "Birouri 450mp Pipera", loc: "București, Voluntari", chip: "Vizionare azi", chipColor: s.gold, price: "€4.200/lună" },
                  { emoji: "🏡", name: "Vilă 5 cam. Snagov", loc: "Ilfov, Snagov · 320mp", chip: "Nou adăugat", chipColor: s.green, price: "€350.000" },
                  { emoji: "🏗️", name: "Teren intravilan 2.000mp", loc: "Cluj-Napoca, Florești", chip: "Ofertă trimisă", chipColor: "#7B9FF9", price: "€120.000" },
                  { emoji: "🛍️", name: "Spațiu comercial 120mp", loc: "Timișoara, Centru", chip: "Negociere", chipColor: s.gold, price: "€1.800/lună" },
                ].map(p => (
                  <div key={p.name} style={{ background: s.dark3, border: `1px solid ${s.subtleBorder}`, borderRadius: 10, padding: 11, display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 58, height: 44, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem", background: "linear-gradient(135deg,rgba(201,168,76,0.12),rgba(74,108,247,0.1))", flexShrink: 0 }}>{p.emoji}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "0.76rem", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
                      <div style={{ fontSize: "0.67rem", color: s.text3, marginTop: 1 }}>{p.loc}</div>
                      <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: 20, fontSize: "0.62rem", fontWeight: 700, marginTop: 5, background: `${p.chipColor}22`, color: p.chipColor }}>{p.chip}</span>
                    </div>
                    <div style={{ fontSize: "0.78rem", fontWeight: 700, color: s.gold, whiteSpace: "nowrap", marginLeft: "auto" }}>{p.price}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PROBLEM */}
      <section style={{ ...sectionPad, background: s.dark2, borderTop: `1px solid ${s.subtleBorder}`, borderBottom: `1px solid ${s.subtleBorder}` }}>
        <div style={wrap}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 items-center mb-16">
            <div>
              <Tag>Realitatea pieței</Tag>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(2rem,3.5vw,3.2rem)", fontWeight: 700, lineHeight: 1.12 }}>Munca haotică îți<br />costă bani în <i style={{ color: s.gold }}>fiecare zi</i></h2>
              <p style={{ fontSize: "1.1rem", color: s.text2, lineHeight: 1.75, maxWidth: 600, marginTop: "1rem" }}>
                Majoritatea agenților imobiliari din România pierd 4–6 ore pe zi pe sarcini administrative: trimit oferte manual, țin evidența clienților în Excel sau pe hârtie, pierd lead-uri pentru că nu au un sistem de urmărire și publică același anunț de 8 ori, pe fiecare portal în parte.
              </p>
            </div>
            <div className="flex flex-col gap-5">
              {[
                { num: "73%", t: "din agenții imobiliari nu au un CRM dedicat", d: "Lucrează cu Excel și WhatsApp — și pierd în medie 2 tranzacții pe lună." },
                { num: "4–6h", t: "pierdute zilnic pe sarcini administrative", d: "Timp care ar putea fi petrecut cu clienții sau la vizionări, nu la tastatură." },
                { num: "€2.500", t: "comision mediu pierdut lunar din lead-uri neurmărite", d: "Calculat pe baza ratei medii de conversie din piața imobiliară din România." },
              ].map(ps => (
                <div key={ps.num} style={{ display: "flex", alignItems: "flex-start", gap: "1.25rem", padding: "1.5rem", background: s.surface, border: `1px solid ${s.subtleBorder}`, borderRadius: s.radius }}>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "2rem", fontWeight: 900, color: s.gold, lineHeight: 1, flexShrink: 0, whiteSpace: "nowrap" }}>{ps.num}</div>
                  <div>
                    <strong style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, marginBottom: 4 }}>{ps.t}</strong>
                    <span style={{ fontSize: "0.82rem", color: s.text2, lineHeight: 1.55 }}>{ps.d}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { icon: "📋", t: "Excel și agende fizice nu mai sunt suficiente", d: "Când portofoliul crește, sistemele improvizate colapsează. Pierzi clienți și ratezi follow-up-uri critice." },
              { icon: "⏰", t: "Publicarea manuală pe portale durează ore", d: "Orice modificare de preț înseamnă 4 actualizări manuale pe OLX, Storia, Imobiliare.ro etc." },
              { icon: "💸", t: "Lead-urile se pierd fără un pipeline clar", d: "Un client interesat te contactează, nu îl urmărești la timp și vânzarea se duce la alt agent." },
            ].map(pc => (
              <div key={pc.t} style={{ padding: "1.75rem", background: s.surface, border: `1px solid ${s.subtleBorder}`, borderRadius: s.radius, borderLeft: `3px solid ${s.gold}` }}>
                <div style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>{pc.icon}</div>
                <div style={{ fontSize: "0.95rem", fontWeight: 600, marginBottom: "0.5rem" }}>{pc.t}</div>
                <div style={{ fontSize: "0.85rem", color: s.text2, lineHeight: 1.65 }}>{pc.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MODULES */}
      <section style={sectionPad}>
        <div style={wrap}>
          <div style={{ textAlign: "center" }}>
            <Tag>CRM Complet</Tag>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(2rem,3.5vw,3.2rem)", fontWeight: 700, lineHeight: 1.12, marginTop: "0.25rem" }}>12 module integrate<br />pentru tot ce ai nevoie</h2>
            <p style={{ fontSize: "1.1rem", color: s.text2, lineHeight: 1.75, maxWidth: 600, margin: "1rem auto 0" }}>SocietyHUB nu este un simplu tool de organizare. Este un ecosistem complet care acoperă fiecare etapă a activității imobiliare.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-14">
            {modules.map(m => (
              <div key={m.title} style={{ padding: "1.6rem", background: s.surface, border: `1px solid ${s.subtleBorder}`, borderRadius: s.radius, transition: "all 0.25s", position: "relative", overflow: "hidden", cursor: "pointer" }}
                onMouseOver={e => { (e.currentTarget as HTMLElement).style.borderColor = s.goldBorder; (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"; }}
                onMouseOut={e => { (e.currentTarget as HTMLElement).style.borderColor = s.subtleBorder; (e.currentTarget as HTMLElement).style.transform = ""; }}
              >
                {m.badge && <div style={{ position: "absolute", top: 12, right: 12, background: "rgba(74,108,247,0.15)", border: "1px solid rgba(74,108,247,0.25)", color: "#7B9FF9", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.05em", padding: "3px 8px", borderRadius: 20, textTransform: "uppercase" }}>{m.badge}</div>}
                <div style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>{m.icon}</div>
                <div style={{ fontSize: "0.95rem", fontWeight: 600, marginBottom: "0.4rem" }}>{m.title}</div>
                <div style={{ fontSize: "0.8rem", color: s.text2, lineHeight: 1.6 }}>{m.desc}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: "0.75rem" }}>
                  {m.chips.map(c => <span key={c} style={{ fontSize: "0.7rem", color: s.text3 }}>↗ {c}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROFILES */}
      <section style={{ ...sectionPad, background: s.dark2, borderTop: `1px solid ${s.subtleBorder}`, borderBottom: `1px solid ${s.subtleBorder}` }}>
        <div style={wrap}>
          <div style={{ textAlign: "center" }}>
            <Tag>Profiluri</Tag>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(2rem,3.5vw,3.2rem)", fontWeight: 700, lineHeight: 1.12, marginTop: "0.25rem" }}>SocietyHUB este construit<br />pentru tine dacă…</h2>
            <p style={{ fontSize: "1.1rem", color: s.text2, lineHeight: 1.75, maxWidth: 600, margin: "1rem auto 0" }}>Indiferent de unde ești în cariera ta imobiliară, platforma se adaptează nevoilor tale specifice.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {[
              { icon: "🚀", title: "Pornești de la zero", sub: "Vrei să intri în imobiliare dar nu știi de unde să începi", items: ["Onboarding ghidat pas cu pas", "Procese predefinite testate", "Training integrat în platformă", "Suport dedicat pentru primele luni"] },
              { icon: "👤", title: "Ești agent independent", sub: "Ai experiență, ai clienți, dar pierzi timp pe administrare", items: ["CRM personal configurat rapid", "Automatizare lead management", "Publicare pe toate portalele", "Contracte generate în 2 minute"] },
              { icon: "🏬", title: "Conduci o agenție", sub: "Ai o echipă și vrei vizibilitate pe performanță", items: ["Dashboard centralizat pentru echipă", "Leaderboard și target-uri agenți", "Permisiuni și roluri configurabile", "Rapoarte exportabile management"] },
            ].map(p => (
              <div key={p.title} style={{ padding: "2.25rem", background: s.surface, border: `1px solid ${s.subtleBorder}`, borderRadius: s.radius, transition: "all 0.25s" }}>
                <div style={{ fontSize: "2rem", marginBottom: "1.25rem" }}>{p.icon}</div>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.3rem", fontWeight: 700, marginBottom: "0.25rem" }}>{p.title}</div>
                <div style={{ fontSize: "0.85rem", color: s.text3, fontStyle: "italic", marginBottom: "1.25rem" }}>{p.sub}</div>
                <ul style={{ listStyle: "none", padding: 0 }}>
                  {p.items.map(item => (
                    <li key={item} style={{ fontSize: "0.85rem", color: s.text2, padding: "5px 0", paddingLeft: 18, position: "relative", borderBottom: `1px solid ${s.subtleBorder}` }}>
                      <span style={{ position: "absolute", left: 0, color: s.green, fontSize: "0.75rem" }}>✓</span>
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
      <section style={sectionPad}>
        <div style={wrap}>
          <div style={{ textAlign: "center" }}>
            <Tag>Comparație</Tag>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(2rem,3.5vw,3.2rem)", fontWeight: 700, lineHeight: 1.12, marginTop: "0.25rem" }}>SocietyHUB vs.<br /><i style={{ color: s.gold }}>alternativele din piață</i></h2>
            <p style={{ fontSize: "1.1rem", color: s.text2, lineHeight: 1.75, maxWidth: 600, margin: "1rem auto 0" }}>De ce profesioniștii imobiliari din România aleg SocietyHUB față de soluțiile internaționale.</p>
          </div>
          <div style={{ marginTop: "3rem", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 680 }}>
              <thead>
                <tr>
                  <th style={{ padding: "1rem 1.25rem", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", textAlign: "left", color: s.text3 }}>Funcționalitate</th>
                  <th style={{ padding: "1rem 1.25rem", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", textAlign: "left", color: s.gold, background: s.goldDim, borderRadius: "8px 8px 0 0" }}>SocietyHUB</th>
                  <th style={{ padding: "1rem 1.25rem", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", textAlign: "left", color: s.text3 }}>CRM Internațional</th>
                  <th style={{ padding: "1rem 1.25rem", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", textAlign: "left", color: s.text3 }}>Excel + WhatsApp</th>
                </tr>
              </thead>
              <tbody>
                {compRows.map(r => (
                  <tr key={r.label}>
                    <td style={{ padding: "0.9rem 1.25rem", fontSize: "0.875rem", color: s.text, fontWeight: 500, borderBottom: `1px solid ${s.subtleBorder}` }}>{r.label}</td>
                    <td style={{ padding: "0.9rem 1.25rem", fontSize: "0.875rem", borderBottom: `1px solid ${s.subtleBorder}`, background: "rgba(201,168,76,0.04)" }}>
                      <span style={{ color: r.s === "✓" ? s.green : s.text3, fontWeight: r.s === "✓" ? 700 : 400 }}>{r.s}</span>
                    </td>
                    <td style={{ padding: "0.9rem 1.25rem", fontSize: "0.875rem", color: s.text2, borderBottom: `1px solid ${s.subtleBorder}` }}>
                      <span style={{ color: r.i === "✓" ? s.green : r.i === "✗" ? s.text3 : "#F0A500", fontWeight: r.i === "✓" ? 700 : 400, fontSize: r.i !== "✓" && r.i !== "✗" ? "0.8rem" : undefined }}>{r.i}</span>
                    </td>
                    <td style={{ padding: "0.9rem 1.25rem", fontSize: "0.875rem", color: s.text2, borderBottom: `1px solid ${s.subtleBorder}` }}>
                      <span style={{ color: r.e === "✓" ? s.green : r.e === "✗" ? s.text3 : "#F0A500", fontWeight: r.e === "✓" ? 700 : 400, fontSize: r.e !== "✓" && r.e !== "✗" ? "0.8rem" : undefined }}>{r.e}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ ...sectionPad, background: s.dark2, borderTop: `1px solid ${s.subtleBorder}` }}>
        <div style={wrap}>
          <div style={{ textAlign: "center" }}>
            <Tag>Testimoniale</Tag>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(2rem,3.5vw,3.2rem)", fontWeight: 700, lineHeight: 1.12, marginTop: "0.25rem" }}>Ce spun <i style={{ color: s.gold }}>utilizatorii noștri</i></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14">
            {[
              { quote: "Am trecut de la Excel la SocietyHUB. Am economisit 3 ore pe zi și în prima lună am închis cu 40% mai multe tranzacții. Nu mai pot lucra altfel.", name: "Alexandru M.", role: "Agent independent · București", init: "A" },
              { quote: "Ca director de agenție, aveam zero vizibilitate. Acum văd în timp real fiecare lead și performanța fiecăruia. Dashboard-ul mi-a schimbat business-ul.", name: "Raluca C.", role: "Director agenție · Cluj-Napoca", init: "R" },
              { quote: "Am pornit de la zero în imobiliare la 32 de ani. Fără SocietyHUB nu știam de unde să încep. Onboarding-ul m-a ajutat să am tranzacții rapid.", name: "Mihai I.", role: "Agent nou · Timișoara", init: "M" },
            ].map(t => (
              <div key={t.name} style={{ padding: "2rem", background: s.surface, border: `1px solid ${s.subtleBorder}`, borderRadius: s.radius }}>
                <div style={{ color: s.gold, letterSpacing: 2, fontSize: "0.85rem", marginBottom: "1rem" }}>★★★★★</div>
                <p style={{ fontSize: "0.9rem", color: s.text2, lineHeight: 1.72, fontStyle: "italic", marginBottom: "1.5rem" }}>{t.quote}</p>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div style={{ width: 38, height: 38, borderRadius: "50%", background: `linear-gradient(135deg,${s.gold},${s.goldLight})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Playfair Display',serif", fontWeight: 700, color: s.dark, fontSize: "0.95rem" }}>{t.init}</div>
                  <div>
                    <div style={{ fontSize: "0.875rem", fontWeight: 600 }}>{t.name}</div>
                    <div style={{ fontSize: "0.76rem", color: s.text3 }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={sectionPad}>
        <div style={wrap}>
          <CtaBanner
            title={<>Fii cu un pas înaintea<br />pieței imobiliare <i style={{ color: s.gold }}>din România.</i></>}
            desc="Fiecare zi în care lucrezi fără un CRM dedicat înseamnă lead-uri pierdute, timp irosit și bani lăsați pe masă."
            btnText="Accesează CRM-ul →"
          />
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: s.dark2, borderTop: `1px solid ${s.subtleBorder}`, padding: "4rem 0 2rem" }}>
        <div style={wrap}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div>
              <Logo onClick={() => nav("home")} />
              <p style={{ fontSize: "0.855rem", color: s.text3, lineHeight: 1.72, marginTop: "1rem" }}>CRM Imobiliar Pro pentru agenții și profesioniști din piața imobiliară românească. Simplu, puternic și mereu alături de tine.</p>
            </div>
            <div>
              <h4 style={{ fontSize: "0.76rem", fontWeight: 600, color: s.text2, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: "1.2rem" }}>Produs</h4>
              <a onClick={() => nav("func")} style={{ display: "block", fontSize: "0.855rem", color: s.text3, marginBottom: "0.55rem", cursor: "pointer" }}>Funcționalități</a>
              <a onClick={() => nav("site")} style={{ display: "block", fontSize: "0.855rem", color: s.text3, marginBottom: "0.55rem", cursor: "pointer" }}>Site Agenție</a>
              <a onClick={() => nav("pret")} style={{ display: "block", fontSize: "0.855rem", color: s.text3, marginBottom: "0.55rem", cursor: "pointer" }}>Prețuri</a>
              <a onClick={() => nav("signup")} style={{ display: "block", fontSize: "0.855rem", color: s.text3, marginBottom: "0.55rem", cursor: "pointer" }}>Testează Gratuit</a>
            </div>
            <div>
              <h4 style={{ fontSize: "0.76rem", fontWeight: 600, color: s.text2, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: "1.2rem" }}>Companie</h4>
              <a onClick={() => nav("despre")} style={{ display: "block", fontSize: "0.855rem", color: s.text3, marginBottom: "0.55rem", cursor: "pointer" }}>Despre Noi</a>
              <a onClick={() => nav("contact")} style={{ display: "block", fontSize: "0.855rem", color: s.text3, marginBottom: "0.55rem", cursor: "pointer" }}>Contact</a>
              <a onClick={() => nav("termeni")} style={{ display: "block", fontSize: "0.855rem", color: s.text3, marginBottom: "0.55rem", cursor: "pointer" }}>Termeni și condiții</a>
              <a onClick={() => nav("termeni")} style={{ display: "block", fontSize: "0.855rem", color: s.text3, marginBottom: "0.55rem", cursor: "pointer" }}>Confidențialitate</a>
            </div>
            <div>
              <h4 style={{ fontSize: "0.76rem", fontWeight: 600, color: s.text2, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: "1.2rem" }}>Contact</h4>
              <p style={{ fontSize: "0.855rem", color: s.text3, marginBottom: "0.55rem" }}>📞 0768 676 141</p>
              <p style={{ fontSize: "0.855rem", color: s.text3, marginBottom: "0.55rem" }}>📞 0730 765 131</p>
              <p style={{ fontSize: "0.855rem", color: s.text3, marginBottom: "0.55rem" }}>✉️ contact@societyhub.ro</p>
              <p style={{ fontSize: "0.855rem", color: s.text3, marginBottom: "0.55rem" }}>🕐 L–V: 09:00 – 18:00</p>
              <p style={{ fontSize: "0.855rem", color: s.text3, marginBottom: "0.55rem" }}>📍 București, România</p>
            </div>
          </div>
          <div style={{ borderTop: `1px solid ${s.subtleBorder}`, paddingTop: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <p style={{ fontSize: "0.8rem", color: s.text3 }}>© 2026 SocietyHUB — CRM Imobiliar Pro. Toate drepturile rezervate.</p>
              <p style={{ fontSize: "0.72rem", color: s.text3, marginTop: "0.4rem" }}>MURSE ADVERTISING S.R.L. · CUI: 44923890 · J40/16148/2021 · Înregistrată la 17.09.2021</p>
            </div>
            <div style={{ display: "flex", gap: "1.5rem" }}>
              <a onClick={() => nav("termeni")} style={{ fontSize: "0.8rem", color: s.text3, cursor: "pointer" }}>Termeni</a>
              <a onClick={() => nav("termeni")} style={{ fontSize: "0.8rem", color: s.text3, cursor: "pointer" }}>Confidențialitate</a>
              <a onClick={() => nav("contact")} style={{ fontSize: "0.8rem", color: s.text3, cursor: "pointer" }}>Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );

  const renderFunc = () => (
    <>
      <div style={{ ...pageHero, paddingTop: "5.5rem" }}>
        <div style={wrap}>
          <Tag>Funcționalități</Tag>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(2.8rem,5vw,5rem)", fontWeight: 900, lineHeight: 1.06, marginTop: "0.25rem" }}>
            Simplu de folosit<br />și intuitiv — <i style={{ color: s.gold }}>gândit pentru tine</i>
          </h1>
          <p style={{ fontSize: "1.1rem", color: s.text2, lineHeight: 1.75, maxWidth: 600, marginTop: "1rem" }}>Descoperă toate instrumentele care transformă SocietyHUB în cel mai complet CRM imobiliar din România.</p>
        </div>
      </div>
      <section style={sectionPad}>
        <div style={wrap}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {funcItems.map(f => (
              <div key={f.num} style={{ display: "flex", gap: "1.5rem", padding: "2rem", background: s.surface, border: `1px solid ${s.subtleBorder}`, borderRadius: s.radius, transition: "all 0.25s" }}>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "2.8rem", fontWeight: 900, color: s.gold, opacity: 0.2, flexShrink: 0, lineHeight: 1, marginTop: -6 }}>{f.num}</div>
                <div>
                  <div style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "0.5rem" }}>{f.title}</div>
                  <div style={{ fontSize: "0.855rem", color: s.text2, lineHeight: 1.67 }}>{f.desc}</div>
                  {f.subs && (
                    <ul style={{ listStyle: "none", marginTop: "0.75rem", padding: 0 }}>
                      {f.subs.map(sub => (
                        <li key={sub} style={{ fontSize: "0.8rem", color: s.text3, padding: "3px 0 3px 16px", position: "relative" }}>
                          <span style={{ position: "absolute", left: 0, color: s.gold, fontSize: "0.72rem" }}>→</span>
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
      <section style={sectionSlim}>
        <div style={wrap}>
          <CtaBanner title="Vrei să vezi totul în acțiune?" desc="14 zile gratuit, fără card de credit necesar." btnText="Testează Gratuit Acum →" />
        </div>
      </section>
      <SmallFooter />
    </>
  );

  const renderSite = () => (
    <>
      <div style={{ ...pageHero, paddingTop: "5.5rem" }}>
        <div style={wrap}>
          <Tag>Site Agenție Imobiliară</Tag>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(2.8rem,5vw,5rem)", fontWeight: 900, lineHeight: 1.06, marginTop: "0.25rem" }}>
            Site modern, 100% funcțional,<br /><i style={{ color: s.gold }}>sincronizat în timp real</i>
          </h1>
          <p style={{ fontSize: "1.1rem", color: s.text2, lineHeight: 1.75, maxWidth: 600, marginTop: "1rem" }}>Website profesional pentru agenția ta, conectat direct cu SocietyHUB CRM și gata în o singură zi.</p>
        </div>
      </div>
      <section style={sectionPad}>
        <div style={wrap}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: "🔗", title: "Conectat cu CRM-ul tău", content: "Sincronizat în timp real cu SocietyHUB. Oferim mentenanță și actualizăm permanent sincronizarea." },
              { icon: "⚡", title: "100% Funcțional", content: "Creat să se miște rapid, robust și fără erori. Optimizat pentru o experiență excelentă pe orice dispozitiv." },
              { icon: "✏️", title: "Modifici oricând dorești", list: ["Nu mai aștepți după programatori", "Schimbi complet tema site-ului", "Schimbi texte, imagini, pagini, bannere"] },
              { icon: "🚀", title: "Site activ într-o zi", content: "Dacă ai conținut pregătit, prin SocietyHUB Site Builder poți avea un site gata în 24 de ore." },
            ].map(c => (
              <div key={c.title} style={{ padding: "2rem", background: s.surface, border: `1px solid ${s.subtleBorder}`, borderRadius: s.radius, borderLeft: `3px solid ${s.gold}` }}>
                <h3 style={{ fontSize: "1rem", fontWeight: 600, color: s.gold, marginBottom: "0.75rem" }}>{c.icon} {c.title}</h3>
                {c.content && <p style={{ fontSize: "0.875rem", color: s.text2, lineHeight: 1.67 }}>{c.content}</p>}
                {c.list && (
                  <ul style={{ listStyle: "none", marginTop: "0.5rem", padding: 0 }}>
                    {c.list.map(li => (
                      <li key={li} style={{ padding: "4px 0 4px 18px", position: "relative", fontSize: "0.875rem", color: s.text2, lineHeight: 1.67 }}>
                        <span style={{ position: "absolute", left: 0, color: s.green, fontSize: "0.75rem", top: 5 }}>✓</span>
                        {li}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
          <div style={{ marginTop: "4.5rem" }}>
            <Tag>Pachete Site</Tag>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(2rem,3.5vw,3.2rem)", fontWeight: 700, lineHeight: 1.12, marginTop: "0.25rem" }}>Alege planul potrivit</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
              {[
                { tier: "Site Builder", name: "Basic", feats: ["Acces la 2 teme", "Site 100% funcțional", "10 imagini per proprietate", "SEO Basic Google", "2 pagini descriptive", "Sincronizare CRM în timp real"], featured: false },
                { tier: "Site Builder", name: "Standard", feats: ["Acces la 8 teme", "Imagini nelimitate", "SEO Avansat", "Integrare WhatsApp/Messenger", "Video + Tururi virtuale", "Cereri automate din site în CRM", "Campanii marketing FB/Google"], featured: true },
                { tier: "Site Builder", name: "Premium", feats: ["Toate temele disponibile", "Imagini nelimitate", "4 pagini descriptive", "Pagini ansambluri rezidențiale", "Video prezentare prima pagină", "Pagina agentului", "Ajutor prioritar la configurare"], featured: false },
              ].map(p => (
                <div key={p.name} style={{ padding: "2.5rem", background: p.featured ? `linear-gradient(180deg,rgba(201,168,76,0.05),${s.surface})` : s.surface, border: `1px solid ${p.featured ? s.goldBorder : s.subtleBorder}`, borderRadius: s.radius, position: "relative" }}>
                  {p.featured && <div style={{ position: "absolute", top: -13, left: "50%", transform: "translateX(-50%)", background: `linear-gradient(135deg,${s.gold},${s.goldLight})`, color: s.dark, fontSize: "0.7rem", fontWeight: 700, padding: "4px 16px", borderRadius: 20, whiteSpace: "nowrap" }}>⭐ Popular</div>}
                  <div style={{ fontSize: "0.75rem", color: s.text3, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.85rem" }}>{p.tier}</div>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem" }}>{p.name}</div>
                  <ul style={{ listStyle: "none", padding: 0, marginBottom: "2rem" }}>
                    {p.feats.map(f => (
                      <li key={f} style={{ padding: "8px 0", fontSize: "0.875rem", color: s.text2, borderBottom: `1px solid ${s.subtleBorder}`, display: "flex", alignItems: "flex-start", gap: 8 }}>
                        <span style={{ color: s.green, fontSize: "0.78rem", flexShrink: 0, marginTop: 1 }}>✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button onClick={() => nav("signup")} style={{ width: "100%", padding: "0.85rem", borderRadius: 10, fontSize: "0.9rem", fontWeight: 600, cursor: "pointer", border: p.featured ? "none" : `1px solid rgba(255,255,255,0.1)`, background: p.featured ? `linear-gradient(135deg,${s.gold},${s.goldLight})` : "transparent", color: p.featured ? s.dark : s.text, fontFamily: "'DM Sans',sans-serif" }}>Testează Gratuit</button>
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
      <div style={{ ...pageHero, paddingTop: "5.5rem", textAlign: "center" }}>
        <div style={wrap}>
          <Tag>Prețuri Transparente</Tag>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(2.8rem,5vw,5rem)", fontWeight: 900, lineHeight: 1.06, marginTop: "0.25rem" }}>Alege planul tău</h1>
          <p style={{ fontSize: "1.1rem", color: s.text2, lineHeight: 1.75, maxWidth: 600, margin: "1rem auto 0" }}>Plătești doar pentru ceea ce folosești. Fără costuri ascunse.</p>
        </div>
      </div>
      <section style={sectionPad}>
        <div style={wrap}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", justifyContent: "center", marginBottom: "3.5rem" }}>
            <span style={{ fontSize: "0.9rem", color: annual ? s.text3 : s.text }}>Plată lunară</span>
            <div onClick={() => setAnnual(!annual)} style={{ width: 50, height: 27, background: annual ? s.goldDim : s.surface2, borderRadius: 100, border: `1px solid ${annual ? s.goldBorder : "rgba(255,255,255,0.1)"}`, cursor: "pointer", position: "relative", transition: "all 0.3s" }}>
              <div style={{ position: "absolute", top: 3, left: annual ? 26 : 3, width: 19, height: 19, borderRadius: "50%", background: annual ? s.gold : s.text3, transition: "all 0.3s" }} />
            </div>
            <span style={{ fontSize: "0.9rem", color: annual ? s.text : s.text3 }}>Plată anuală</span>
            <span style={{ background: `linear-gradient(135deg,${s.gold},${s.goldLight})`, color: s.dark, fontSize: "0.72rem", fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>Discount 50%</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { tier: "SocietyHUB", name: "Basic", feats: ["Anunțuri particulari", "Gestiune proprietăți (50/utilizator)", "Publicare pe max. 3 portaluri", "Modul colaborare", "1 GB upload / utilizator", "Site agenție Basic", "Suport chat & mail"], featured: false },
              { tier: "SocietyHUB", name: "Standard", feats: ["Totul din Basic", "Gestiune cereri", "Matching AI automat", "Trimitere proprietăți pe WhatsApp", "100 proprietăți active / utilizator", "Publicare portaluri nelimitate", "10 GB upload / utilizator", "Site agenție Standard"], featured: true },
              { tier: "SocietyHUB", name: "Premium", feats: ["Totul din Standard", "Rapoarte avansate & Analytics", "Contracte digitale + semnătură", "Analiză Comparativă Piață", "Proprietăți nelimitate", "Upload documente nelimitat", "Site agenție Premium", "Suport telefonic prioritar"], featured: false },
            ].map((p, i) => (
              <div key={p.name} style={{ padding: "2.5rem", background: p.featured ? `linear-gradient(180deg,rgba(201,168,76,0.05),${s.surface})` : s.surface, border: `1px solid ${p.featured ? s.goldBorder : s.subtleBorder}`, borderRadius: s.radius, position: "relative" }}>
                {p.featured && <div style={{ position: "absolute", top: -13, left: "50%", transform: "translateX(-50%)", background: `linear-gradient(135deg,${s.gold},${s.goldLight})`, color: s.dark, fontSize: "0.7rem", fontWeight: 700, padding: "4px 16px", borderRadius: 20, whiteSpace: "nowrap" }}>⭐ Recomandat</div>}
                <div style={{ fontSize: "0.75rem", color: s.text3, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.85rem" }}>{p.tier}</div>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem" }}>{p.name}</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 3, marginBottom: 4 }}>
                  <span style={{ fontSize: "1.1rem", color: s.gold }}>€</span>
                  <span style={{ fontFamily: "'Playfair Display',serif", fontSize: "3rem", fontWeight: 900, color: s.gold }}>{prices[i]}</span>
                </div>
                <div style={{ fontSize: "0.78rem", color: s.text3, marginBottom: "2rem" }}>+ TVA / utilizator / lună</div>
                <ul style={{ listStyle: "none", padding: 0, marginBottom: "2rem" }}>
                  {p.feats.map(f => (
                    <li key={f} style={{ padding: "8px 0", fontSize: "0.875rem", color: s.text2, borderBottom: `1px solid ${s.subtleBorder}`, display: "flex", alignItems: "flex-start", gap: 8 }}>
                      <span style={{ color: s.green, fontSize: "0.78rem", flexShrink: 0, marginTop: 1 }}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <button onClick={() => nav("signup")} style={{ width: "100%", padding: "0.85rem", borderRadius: 10, fontSize: "0.9rem", fontWeight: 600, cursor: "pointer", border: p.featured ? "none" : `1px solid rgba(255,255,255,0.1)`, background: p.featured ? `linear-gradient(135deg,${s.gold},${s.goldLight})` : "transparent", color: p.featured ? s.dark : s.text, fontFamily: "'DM Sans',sans-serif" }}>Testează Gratuit</button>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section style={sectionSlim}>
        <div style={wrap}>
          <CtaBanner title="Pregătit să începi?" desc="14 zile gratuit, fără card de credit. Anulezi oricând." btnText="Testează Gratuit →" />
        </div>
      </section>
      <SmallFooter />
    </>
  );

  const renderDespre = () => (
    <>
      <div style={{ ...pageHero, paddingTop: "5.5rem" }}>
        <div style={wrap}>
          <Tag>Despre Noi</Tag>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(2.8rem,5vw,5rem)", fontWeight: 900, lineHeight: 1.06, marginTop: "0.25rem" }}>
            Povestea din spatele<br /><i style={{ color: s.gold }}>SocietyHUB</i>
          </h1>
        </div>
      </div>
      <section style={sectionPad}>
        <div style={wrap}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-18 items-center">
            <div>
              <p style={{ fontSize: "0.94rem", color: s.text2, lineHeight: 1.82, marginBottom: "1.1rem" }}>Creat cu pasiune și entuziasm din dorința de a dezvolta o unealtă cu adevărat utilă pentru agenții imobiliari, SocietyHUB a crescut frumos și s-a perfecționat într-o platformă de succes — o soluție completă pentru creșterea productivității și eficienței managerilor, agenților și personalului administrativ din domeniul imobiliar.</p>
              <p style={{ fontSize: "0.94rem", color: s.text2, lineHeight: 1.82, marginBottom: "1.1rem" }}>Bazele acestei platforme au fost puse de oameni care au cunoscut și s-au confruntat cu toate provocările de zi cu zi din domeniu, ajutați de parteneri pasionați de tehnologie. Echipa a crescut an de an, adunând peste 50 de ani de experiență cumulată în imobiliare și software.</p>
              <p style={{ fontSize: "0.94rem", color: s.text2, lineHeight: 1.82 }}>Credem cu tărie că succesul în imobiliare depinde foarte mult de relațiile dintre oameni. De aceea, folosind SocietyHUB, te conectezi nu cu un program software, ci cu noi — o echipă dedicată exclusiv succesului tău.</p>
            </div>
            <div className="hidden lg:flex" style={{ background: s.surface, border: `1px solid ${s.goldBorder}`, borderRadius: s.radius, aspectRatio: "4/3", alignItems: "center", justifyContent: "center", fontSize: "5rem", color: s.gold, opacity: 0.25 }}>🏢</div>
          </div>

          <div style={{ marginTop: "5rem" }}>
            <Tag>Valorile noastre</Tag>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(2rem,3.5vw,3.2rem)", fontWeight: 700, lineHeight: 1.12, marginTop: "0.25rem" }}>Pilonii pe care <i style={{ color: s.gold }}>construim</i></h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-11">
              {[
                { icon: "🏆", title: "Calitate", desc: "Principala noastră preocupare pentru orice facem este calitatea. Un singur produs, făcut foarte bine." },
                { icon: "💪", title: "Echipă Puternică", desc: "Cunoaștem din proprie experiență industria imobiliară. Simțim nevoile și avem abilitățile să le rezolvăm." },
                { icon: "🤝", title: "Suntem Aici Pentru Tine", desc: "Vrem să-ți oferim prilejul de a te bucura mai mult de timpul tău. Răspundem întotdeauna prompt." },
                { icon: "💻", title: "State of the Art Code", desc: "Folosim cele mai moderne tehnologii și scriem cod folosind cele mai bune practici din industrie." },
                { icon: "🔄", title: "Continuitate", desc: "Pentru că facem lucrurile cu pasiune, ne-am luat angajamentul să fim aici, alături de tine, și peste 10 ani." },
                { icon: "💡", title: "Inovare", desc: "Inovăm, creăm și ne adaptăm permanent la nevoile pieței imobiliare în continuă schimbare." },
              ].map(v => (
                <div key={v.title} style={{ padding: "2rem", background: s.surface, border: `1px solid ${s.subtleBorder}`, borderRadius: s.radius, textAlign: "center" }}>
                  <div style={{ width: 52, height: 52, borderRadius: 10, background: s.goldDim, border: `1px solid ${s.goldBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem", margin: "0 auto 1.1rem" }}>{v.icon}</div>
                  <div style={{ fontSize: "0.95rem", fontWeight: 600, marginBottom: "0.5rem" }}>{v.title}</div>
                  <div style={{ fontSize: "0.845rem", color: s.text2, lineHeight: 1.65 }}>{v.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: "5rem" }}>
            <Tag>Echipa</Tag>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(2rem,3.5vw,3.2rem)", fontWeight: 700, lineHeight: 1.12, marginTop: "0.25rem" }}>Oamenii din spatele <i style={{ color: s.gold }}>platformei</i></h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-11">
              {teamMembers.map(t => (
                <div key={t.name} style={{ padding: "1.5rem", background: s.surface, border: `1px solid ${s.subtleBorder}`, borderRadius: s.radius, textAlign: "center", transition: "all 0.25s" }}>
                  <div style={{ width: 68, height: 68, borderRadius: "50%", background: `linear-gradient(135deg,${s.goldDim},rgba(74,108,247,0.15))`, border: `2px solid ${s.goldBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: "1.4rem", color: s.gold, margin: "0 auto 1rem" }}>{t.initials}</div>
                  <div style={{ fontSize: "0.9rem", fontWeight: 600, marginBottom: 3 }}>{t.name}</div>
                  <div style={{ fontSize: "0.75rem", color: s.gold }}>{t.role}</div>
                </div>
              ))}
              <div onClick={() => nav("contact")} style={{ padding: "1.5rem", background: s.surface, border: `1px dashed ${s.subtleBorder}`, borderRadius: s.radius, textAlign: "center", cursor: "pointer" }}>
                <div style={{ width: 68, height: 68, borderRadius: "50%", background: s.dark3, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: "1.4rem", color: s.gold, margin: "0 auto 1rem" }}>+</div>
                <div style={{ fontSize: "0.9rem", fontWeight: 600, marginBottom: 3 }}>Vino alături!</div>
                <div style={{ fontSize: "0.75rem", color: s.gold }}>Căutăm oameni buni</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section style={sectionSlim}>
        <div style={wrap}>
          <CtaBanner title="Alătură-te comunității SocietyHUB" desc="1.200+ profesioniști ne-au ales deja. Tu ești următorul." btnText="Testează Gratuit →" />
        </div>
      </section>
      <SmallFooter />
    </>
  );

  const renderContact = () => (
    <>
      <div style={{ ...pageHero, paddingTop: "5.5rem" }}>
        <div style={wrap}>
          <Tag>Contact</Tag>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(2.8rem,5vw,5rem)", fontWeight: 900, lineHeight: 1.06, marginTop: "0.25rem" }}>
            Suntem <i style={{ color: s.gold }}>aici pentru tine</i>
          </h1>
          <p style={{ fontSize: "1.1rem", color: s.text2, lineHeight: 1.75, maxWidth: 600, marginTop: "1rem" }}>Scrie-ne, sună-ne sau vino la birou. Îți răspundem rapid și cu drag.</p>
        </div>
      </div>
      <section style={sectionPad}>
        <div style={wrap}>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.65fr] gap-12">
            <div className="flex flex-col gap-5">
              <div style={{ padding: "1.75rem", background: s.surface, border: `1px solid ${s.subtleBorder}`, borderRadius: s.radius }}>
                <div style={{ fontSize: "0.74rem", color: s.gold, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "1rem" }}>📞 Vânzări</div>
                <div className="flex flex-col gap-3">
                  <div className="flex items-start gap-2.5" style={{ fontSize: "0.89rem", color: s.text2 }}><span style={{ color: s.gold, width: 22 }}>📱</span>0768 676 141</div>
                  <div className="flex items-start gap-2.5" style={{ fontSize: "0.89rem", color: s.text2 }}><span style={{ color: s.gold, width: 22 }}>📱</span>0730 765 131</div>
                  <div className="flex items-start gap-2.5" style={{ fontSize: "0.89rem", color: s.text2 }}><span style={{ color: s.gold, width: 22 }}>✉️</span>vanzari@societyhub.ro</div>
                  <div className="flex items-start gap-2.5" style={{ fontSize: "0.89rem", color: s.text2 }}><span style={{ color: s.gold, width: 22 }}>🕐</span>09:00 – 18:00 (L–V)</div>
                </div>
              </div>
              <div style={{ padding: "1.75rem", background: s.surface, border: `1px solid ${s.subtleBorder}`, borderRadius: s.radius }}>
                <div style={{ fontSize: "0.74rem", color: s.gold, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "1rem" }}>🛠️ Suport Tehnic</div>
                <div className="flex flex-col gap-3">
                  <div className="flex items-start gap-2.5" style={{ fontSize: "0.89rem", color: s.text2 }}><span style={{ color: s.gold, width: 22 }}>✉️</span>suport@societyhub.ro</div>
                  <div className="flex items-start gap-2.5" style={{ fontSize: "0.89rem", color: s.text2 }}><span style={{ color: s.gold, width: 22 }}>🕐</span>09:00 – 17:30 (L–V)</div>
                </div>
              </div>
              <div style={{ padding: "1.75rem", background: s.surface, border: `1px solid ${s.subtleBorder}`, borderRadius: s.radius }}>
                <div style={{ fontSize: "0.74rem", color: s.gold, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "1rem" }}>📍 Biroul Nostru</div>
                <div className="flex items-start gap-2.5" style={{ fontSize: "0.89rem", color: s.text2 }}><span style={{ color: s.gold, width: 22 }}>🏢</span><span>București, România</span></div>
                <div className="flex items-start gap-2.5 mt-3" style={{ fontSize: "0.78rem", color: s.text3 }}><span style={{ color: s.gold, width: 22 }}>📄</span><span>MURSE ADVERTISING S.R.L.<br />CUI: 44923890<br />Nr. Înmatriculare: J40/16148/2021<br />Data înființării: 17.09.2021</span></div>
              </div>
            </div>
            <div style={{ padding: "2.5rem", background: s.surface, border: `1px solid ${s.subtleBorder}`, borderRadius: s.radius }}>
              <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.5rem", marginBottom: "1.75rem" }}>Trimite-ne un mesaj</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                <div><label style={{ display: "block", fontSize: "0.79rem", color: s.text2, marginBottom: "0.45rem", fontWeight: 500 }}>Prenume</label><input type="text" placeholder="Ion" style={{ width: "100%", background: s.dark3, border: `1px solid rgba(255,255,255,0.09)`, borderRadius: 8, padding: "0.72rem 1rem", fontSize: "0.88rem", color: s.text, outline: "none" }} /></div>
                <div><label style={{ display: "block", fontSize: "0.79rem", color: s.text2, marginBottom: "0.45rem", fontWeight: 500 }}>Nume</label><input type="text" placeholder="Popescu" style={{ width: "100%", background: s.dark3, border: `1px solid rgba(255,255,255,0.09)`, borderRadius: 8, padding: "0.72rem 1rem", fontSize: "0.88rem", color: s.text, outline: "none" }} /></div>
              </div>
              <div style={{ marginBottom: "1.2rem" }}><label style={{ display: "block", fontSize: "0.79rem", color: s.text2, marginBottom: "0.45rem", fontWeight: 500 }}>Email</label><input type="email" placeholder="ion@agentie.ro" style={{ width: "100%", background: s.dark3, border: `1px solid rgba(255,255,255,0.09)`, borderRadius: 8, padding: "0.72rem 1rem", fontSize: "0.88rem", color: s.text, outline: "none" }} /></div>
              <div style={{ marginBottom: "1.2rem" }}><label style={{ display: "block", fontSize: "0.79rem", color: s.text2, marginBottom: "0.45rem", fontWeight: 500 }}>Telefon</label><input type="tel" placeholder="07XX XXX XXX" style={{ width: "100%", background: s.dark3, border: `1px solid rgba(255,255,255,0.09)`, borderRadius: 8, padding: "0.72rem 1rem", fontSize: "0.88rem", color: s.text, outline: "none" }} /></div>
              <div style={{ marginBottom: "1.2rem" }}><label style={{ display: "block", fontSize: "0.79rem", color: s.text2, marginBottom: "0.45rem", fontWeight: 500 }}>Subiect</label>
                <select style={{ width: "100%", background: s.dark3, border: `1px solid rgba(255,255,255,0.09)`, borderRadius: 8, padding: "0.72rem 1rem", fontSize: "0.88rem", color: s.text, outline: "none" }}>
                  <option>Vreau o demonstrație</option><option>Informații prețuri</option><option>Suport tehnic</option><option>Parteneriat</option><option>Altele</option>
                </select>
              </div>
              <div style={{ marginBottom: "1.2rem" }}><label style={{ display: "block", fontSize: "0.79rem", color: s.text2, marginBottom: "0.45rem", fontWeight: 500 }}>Mesaj</label><textarea placeholder="Descrie-ne cum te putem ajuta..." style={{ width: "100%", background: s.dark3, border: `1px solid rgba(255,255,255,0.09)`, borderRadius: 8, padding: "0.72rem 1rem", fontSize: "0.88rem", color: s.text, outline: "none", resize: "vertical", minHeight: 116 }} /></div>
              <BtnPrimary onClick={() => alert("Mesaj trimis! Te vom contacta în scurt timp.")}>Trimite Mesajul →</BtnPrimary>
            </div>
          </div>
        </div>
      </section>
      <SmallFooter />
    </>
  );

  const renderAuth = () => (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", background: `radial-gradient(ellipse at center,rgba(201,168,76,0.055) 0%,${s.dark} 65%)`, paddingTop: 68 }}>
      <div style={{ background: s.surface, border: `1px solid ${s.goldBorder}`, borderRadius: 20, padding: "3rem", width: "100%", maxWidth: 440 }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "2.25rem" }}><Logo /></div>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.75rem", fontWeight: 700, textAlign: "center", marginBottom: "0.4rem" }}>Bun venit înapoi</h2>
        <p style={{ fontSize: "0.86rem", color: s.text2, textAlign: "center", marginBottom: "2.5rem" }}>Autentifică-te în contul tău SocietyHUB</p>
        <div style={{ marginBottom: "1.2rem" }}><label style={{ display: "block", fontSize: "0.79rem", color: s.text2, marginBottom: "0.45rem", fontWeight: 500 }}>Email</label><input type="email" placeholder="email@agentie.ro" style={{ width: "100%", background: s.dark3, border: `1px solid rgba(255,255,255,0.09)`, borderRadius: 8, padding: "0.72rem 1rem", fontSize: "0.88rem", color: s.text, outline: "none" }} /></div>
        <div style={{ marginBottom: "1.2rem" }}><label style={{ display: "block", fontSize: "0.79rem", color: s.text2, marginBottom: "0.45rem", fontWeight: 500 }}>Parolă</label><input type="password" placeholder="••••••••" style={{ width: "100%", background: s.dark3, border: `1px solid rgba(255,255,255,0.09)`, borderRadius: 8, padding: "0.72rem 1rem", fontSize: "0.88rem", color: s.text, outline: "none" }} /></div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.82rem", color: s.text2, cursor: "pointer" }}><input type="checkbox" style={{ accentColor: s.gold }} />Ține-mă minte</label>
          <span style={{ fontSize: "0.82rem", color: s.gold, cursor: "pointer" }}>Ai uitat parola?</span>
        </div>
        <button onClick={() => navigate("/dashboard")} style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: 8, padding: "0.85rem 1.9rem", borderRadius: 10, fontSize: "0.95rem", fontWeight: 600, cursor: "pointer", border: "none", background: `linear-gradient(135deg,${s.gold},${s.goldLight})`, color: s.dark, fontFamily: "'DM Sans',sans-serif" }}>Intră în Cont →</button>
        <div style={{ textAlign: "center", marginTop: "1.75rem", fontSize: "0.84rem", color: s.text3 }}>Nu ai cont? <span onClick={() => nav("signup")} style={{ color: s.gold, cursor: "pointer" }}>Creează unul gratuit</span></div>
      </div>
    </div>
  );

  const renderSignup = () => (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", background: `radial-gradient(ellipse at top right,rgba(201,168,76,0.06) 0%,${s.dark} 55%)`, paddingTop: 68 }}>
      <div style={{ background: s.surface, border: `1px solid ${s.goldBorder}`, borderRadius: 20, padding: "3rem", width: "100%", maxWidth: 540 }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "2.25rem" }}><Logo /></div>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.75rem", fontWeight: 700, textAlign: "center", marginBottom: "0.4rem" }}>14 Zile Gratuit</h2>
        <p style={{ fontSize: "0.86rem", color: s.text2, textAlign: "center", marginBottom: "2.5rem" }}>Fără card de credit. Anulezi oricând. Completezi în 2 minute.</p>
        <Tag>Alege planul de start</Tag>
        <div className="grid grid-cols-3 gap-3 mb-8">
          {["Basic", "Standard", "Premium"].map((p, i) => (
            <div key={p} onClick={() => setSelectedPlan(i)} style={{ border: `1px solid ${selectedPlan === i ? s.goldBorder : "rgba(255,255,255,0.09)"}`, borderRadius: 10, padding: "0.9rem", textAlign: "center", cursor: "pointer", background: selectedPlan === i ? s.goldDim : "transparent" }}>
              <div style={{ fontSize: "0.78rem", fontWeight: 600 }}>{p}</div>
              <div style={{ fontSize: "1.05rem", fontWeight: 700, color: s.gold, marginTop: 2 }}>€{prices[i]}</div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <div><label style={{ display: "block", fontSize: "0.79rem", color: s.text2, marginBottom: "0.45rem", fontWeight: 500 }}>Prenume</label><input type="text" placeholder="Ion" style={{ width: "100%", background: s.dark3, border: `1px solid rgba(255,255,255,0.09)`, borderRadius: 8, padding: "0.72rem 1rem", fontSize: "0.88rem", color: s.text, outline: "none" }} /></div>
          <div><label style={{ display: "block", fontSize: "0.79rem", color: s.text2, marginBottom: "0.45rem", fontWeight: 500 }}>Nume</label><input type="text" placeholder="Popescu" style={{ width: "100%", background: s.dark3, border: `1px solid rgba(255,255,255,0.09)`, borderRadius: 8, padding: "0.72rem 1rem", fontSize: "0.88rem", color: s.text, outline: "none" }} /></div>
        </div>
        <div style={{ marginBottom: "1.2rem" }}><label style={{ display: "block", fontSize: "0.79rem", color: s.text2, marginBottom: "0.45rem", fontWeight: 500 }}>Email profesional</label><input type="email" placeholder="ion@agentie.ro" style={{ width: "100%", background: s.dark3, border: `1px solid rgba(255,255,255,0.09)`, borderRadius: 8, padding: "0.72rem 1rem", fontSize: "0.88rem", color: s.text, outline: "none" }} /></div>
        <div style={{ marginBottom: "1.2rem" }}><label style={{ display: "block", fontSize: "0.79rem", color: s.text2, marginBottom: "0.45rem", fontWeight: 500 }}>Telefon</label><input type="tel" placeholder="07XX XXX XXX" style={{ width: "100%", background: s.dark3, border: `1px solid rgba(255,255,255,0.09)`, borderRadius: 8, padding: "0.72rem 1rem", fontSize: "0.88rem", color: s.text, outline: "none" }} /></div>
        <div style={{ marginBottom: "1.2rem" }}><label style={{ display: "block", fontSize: "0.79rem", color: s.text2, marginBottom: "0.45rem", fontWeight: 500 }}>Numele agenției</label><input type="text" placeholder="Agentia Mea Imobiliară SRL" style={{ width: "100%", background: s.dark3, border: `1px solid rgba(255,255,255,0.09)`, borderRadius: 8, padding: "0.72rem 1rem", fontSize: "0.88rem", color: s.text, outline: "none" }} /></div>
        <div style={{ marginBottom: "1.2rem" }}><label style={{ display: "block", fontSize: "0.79rem", color: s.text2, marginBottom: "0.45rem", fontWeight: 500 }}>Număr de agenți</label>
          <select style={{ width: "100%", background: s.dark3, border: `1px solid rgba(255,255,255,0.09)`, borderRadius: 8, padding: "0.72rem 1rem", fontSize: "0.88rem", color: s.text, outline: "none" }}>
            <option>1 agent</option><option>2–5 agenți</option><option>6–15 agenți</option><option>16–30 agenți</option><option>30+ agenți</option>
          </select>
        </div>
        <div style={{ marginBottom: "1.2rem" }}><label style={{ display: "block", fontSize: "0.79rem", color: s.text2, marginBottom: "0.45rem", fontWeight: 500 }}>Parolă</label><input type="password" placeholder="Minim 8 caractere" style={{ width: "100%", background: s.dark3, border: `1px solid rgba(255,255,255,0.09)`, borderRadius: 8, padding: "0.72rem 1rem", fontSize: "0.88rem", color: s.text, outline: "none" }} /></div>
        <button onClick={() => alert("Înregistrare simulată! Verifică emailul pentru activare.")} style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: 8, padding: "0.85rem 1.9rem", borderRadius: 10, fontSize: "0.95rem", fontWeight: 600, cursor: "pointer", border: "none", background: `linear-gradient(135deg,${s.gold},${s.goldLight})`, color: s.dark, fontFamily: "'DM Sans',sans-serif" }}>Creează Contul Gratuit →</button>
        <div style={{ textAlign: "center", marginTop: "1.75rem", fontSize: "0.84rem", color: s.text3 }}>Ai deja cont? <span onClick={() => nav("auth")} style={{ color: s.gold, cursor: "pointer" }}>Autentifică-te</span></div>
      </div>
    </div>
  );

  const renderTermeni = () => (
    <>
      <div style={{ ...pageHero, paddingTop: "5.5rem" }}>
        <div style={wrap}>
          <Tag>Legal</Tag>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(2.8rem,5vw,5rem)", fontWeight: 900, lineHeight: 1.06, marginTop: "0.25rem" }}>
            Termeni și <i style={{ color: s.gold }}>Condiții</i>
          </h1>
        </div>
      </div>
      <section style={sectionPad}>
        <div style={{ ...wrap, maxWidth: 800 }}>
          <div style={{ background: s.surface, border: `1px solid ${s.subtleBorder}`, borderRadius: s.radius, padding: "2.5rem" }}>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem" }}>1. Informații despre operator</h2>
            <p style={{ fontSize: "0.9rem", color: s.text2, lineHeight: 1.75, marginBottom: "1.5rem" }}>
              Platforma SocietyHUB este operată de <strong style={{ color: s.text }}>MURSE ADVERTISING S.R.L.</strong>, societate comercială înregistrată în România.<br /><br />
              • Cod Unic de Înregistrare (CUI): <strong style={{ color: s.text }}>44923890</strong><br />
              • Număr de înmatriculare: <strong style={{ color: s.text }}>J40/16148/2021</strong><br />
              • EUID: ROONRC.J40/16148/2021<br />
              • Data înființării: <strong style={{ color: s.text }}>17 septembrie 2021</strong><br />
              • Sediu: București, România<br />
              • Email: contact@societyhub.ro
            </p>

            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem" }}>2. Acceptarea termenilor</h2>
            <p style={{ fontSize: "0.9rem", color: s.text2, lineHeight: 1.75, marginBottom: "1.5rem" }}>
              Prin accesarea și utilizarea platformei SocietyHUB, acceptați în mod expres acești Termeni și Condiții. Dacă nu sunteți de acord cu oricare dintre prevederile de mai jos, vă rugăm să nu utilizați platforma.
            </p>

            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem" }}>3. Descrierea serviciilor</h2>
            <p style={{ fontSize: "0.9rem", color: s.text2, lineHeight: 1.75, marginBottom: "1.5rem" }}>
              SocietyHUB este o platformă CRM destinată profesioniștilor din domeniul imobiliar, oferind funcționalități precum: gestionarea proprietăților, a clienților și a tranzacțiilor, publicare pe portaluri imobiliare, generare de contracte, campanii de marketing, analytics și colaborare MLS.
            </p>

            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem" }}>4. Contul de utilizator</h2>
            <p style={{ fontSize: "0.9rem", color: s.text2, lineHeight: 1.75, marginBottom: "1.5rem" }}>
              Utilizatorii sunt responsabili pentru confidențialitatea credențialelor de acces. Orice activitate desfășurată prin contul dumneavoastră este responsabilitatea dumneavoastră. Vă obligați să furnizați informații corecte și actualizate la înregistrare.
            </p>

            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem" }}>5. Politica de confidențialitate și cookie-uri</h2>
            <p style={{ fontSize: "0.9rem", color: s.text2, lineHeight: 1.75, marginBottom: "1.5rem" }}>
              Colectăm și procesăm date personale în conformitate cu Regulamentul (UE) 2016/679 (GDPR). Datele sunt utilizate exclusiv pentru furnizarea și îmbunătățirea serviciilor noastre.<br /><br />
              <strong style={{ color: s.text }}>Cookie-uri utilizate:</strong><br />
              • <strong style={{ color: s.text }}>Cookie-uri esențiale</strong> — necesare pentru funcționarea platformei<br />
              • <strong style={{ color: s.text }}>Cookie-uri analitice</strong> — pentru înțelegerea modului de utilizare a platformei<br />
              • <strong style={{ color: s.text }}>Cookie-uri de marketing</strong> — pentru personalizarea experienței și a comunicărilor<br /><br />
              Puteți gestiona preferințele cookie-urilor din setările browserului dumneavoastră.
            </p>

            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem" }}>6. Proprietate intelectuală</h2>
            <p style={{ fontSize: "0.9rem", color: s.text2, lineHeight: 1.75, marginBottom: "1.5rem" }}>
              Toate drepturile de proprietate intelectuală asupra platformei SocietyHUB, inclusiv designul, codul sursă, conținutul și marca, aparțin MURSE ADVERTISING S.R.L. Este interzisă reproducerea, distribuirea sau modificarea fără acord scris.
            </p>

            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem" }}>7. Plăți și facturare</h2>
            <p style={{ fontSize: "0.9rem", color: s.text2, lineHeight: 1.75, marginBottom: "1.5rem" }}>
              Prețurile afișate sunt exprimate în EUR, fără TVA. Facturarea se realizează lunar sau anual, conform planului ales. Anularea abonamentului poate fi efectuată oricând din contul de utilizator.
            </p>

            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem" }}>8. Limitarea răspunderii</h2>
            <p style={{ fontSize: "0.9rem", color: s.text2, lineHeight: 1.75, marginBottom: "1.5rem" }}>
              MURSE ADVERTISING S.R.L. nu va fi responsabilă pentru daune indirecte, pierderi de date sau întreruperi ale serviciului cauzate de factori externi. Depunem eforturi rezonabile pentru a asigura disponibilitatea și securitatea platformei.
            </p>

            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem" }}>9. Legea aplicabilă</h2>
            <p style={{ fontSize: "0.9rem", color: s.text2, lineHeight: 1.75, marginBottom: "1.5rem" }}>
              Acești Termeni și Condiții sunt guvernați de legislația din România. Orice litigiu va fi soluționat de instanțele competente din București.
            </p>

            <div style={{ borderTop: `1px solid ${s.subtleBorder}`, paddingTop: "1.5rem", marginTop: "1rem" }}>
              <p style={{ fontSize: "0.8rem", color: s.text3 }}>Ultima actualizare: Martie 2026</p>
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
    <div style={{ fontFamily: "'DM Sans',sans-serif", background: s.dark, color: s.text, overflowX: "hidden", minHeight: "100vh" }}>
      {/* MOBILE MENU */}
      <div style={{ position: "fixed", inset: 0, zIndex: 998, background: "rgba(9,9,14,0.97)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1.75rem", transform: mobOpen ? "translateX(0)" : "translateX(100%)", transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)" }}>
        <span onClick={() => setMobOpen(false)} style={{ position: "absolute", top: "1.5rem", right: "1.75rem", fontSize: "1.4rem", color: s.text3, cursor: "pointer" }}>✕</span>
        <a onClick={() => nav("home")} style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.6rem", cursor: "pointer" }}>Acasă</a>
        {NAV_ITEMS.map(n => (
          <a key={n.key} onClick={() => nav(n.key)} style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.6rem", cursor: "pointer" }}>{n.label}</a>
        ))}
        <a onClick={() => nav("auth")} style={{ fontSize: "1.1rem", color: s.text2, cursor: "pointer" }}>Autentificare</a>
        <a onClick={() => nav("signup")} style={{ color: s.gold, cursor: "pointer", fontSize: "1.1rem" }}>Testează Gratuit</a>
      </div>

      {/* NAV */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000, background: "rgba(9,9,14,0.88)", backdropFilter: "blur(24px)", borderBottom: `1px solid ${s.goldBorder}` }}>
        <div style={{ maxWidth: 1300, margin: "0 auto", padding: "0 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>
          <Logo onClick={() => nav("home")} />
          <div className="hidden md:flex items-center gap-0">
            {NAV_ITEMS.map(n => (
              <a key={n.key} onClick={() => nav(n.key)} style={{ padding: "0.45rem 0.85rem", borderRadius: 8, fontSize: "0.85rem", color: page === n.key ? s.gold : s.text2, background: page === n.key ? s.goldDim : "transparent", cursor: "pointer", transition: "all 0.18s" }}>{n.label}</a>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-2.5">
            <button onClick={() => nav("auth")} style={{ padding: "0.45rem 1rem", border: `1px solid rgba(255,255,255,0.1)`, borderRadius: 8, fontSize: "0.85rem", color: s.text2, cursor: "pointer", background: "transparent", fontFamily: "'DM Sans',sans-serif" }}>Autentificare</button>
            <button onClick={() => nav("signup")} style={{ padding: "0.5rem 1.2rem", background: `linear-gradient(135deg,${s.gold},${s.goldLight})`, borderRadius: 8, fontSize: "0.85rem", fontWeight: 600, color: s.dark, cursor: "pointer", border: "none", fontFamily: "'DM Sans',sans-serif" }}>Testează Gratuit</button>
          </div>
          <div className="flex md:hidden flex-col gap-[5px] cursor-pointer p-1" onClick={() => setMobOpen(true)}>
            <span style={{ display: "block", width: 22, height: 2, background: s.text2, borderRadius: 2 }} />
            <span style={{ display: "block", width: 22, height: 2, background: s.text2, borderRadius: 2 }} />
            <span style={{ display: "block", width: 22, height: 2, background: s.text2, borderRadius: 2 }} />
          </div>
        </div>
      </nav>

      {/* PAGE CONTENT */}
      <div style={{ minHeight: "calc(100vh - 68px)", paddingTop: page === "home" ? 0 : 0 }}>
        {pages[page]()}
      </div>

      {/* COOKIE CONSENT BANNER */}
      {!cookieAccepted && (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 1001, background: "rgba(9,9,14,0.97)", backdropFilter: "blur(16px)", borderTop: `1px solid ${s.goldBorder}`, padding: "1.25rem 2rem" }}>
          <div style={{ maxWidth: 1300, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
            <p style={{ fontSize: "0.84rem", color: s.text2, flex: 1, minWidth: 280, lineHeight: 1.6 }}>
              🍪 Folosim cookie-uri pentru a îmbunătăți experiența ta pe platformă. Prin continuarea navigării, ești de acord cu{" "}
              <span onClick={() => nav("termeni")} style={{ color: s.gold, cursor: "pointer", textDecoration: "underline" }}>Politica de Cookie-uri și Termenii și Condițiile</span> noastre.
            </p>
            <div style={{ display: "flex", gap: "0.75rem", flexShrink: 0 }}>
              <button onClick={() => { setCookieAccepted(true); localStorage.setItem("cookie_accepted", "true"); }} style={{ padding: "0.6rem 1.5rem", borderRadius: 8, fontSize: "0.84rem", fontWeight: 600, cursor: "pointer", border: "none", background: `linear-gradient(135deg,${s.gold},${s.goldLight})`, color: s.dark, fontFamily: "'DM Sans',sans-serif" }}>Accept toate</button>
              <button onClick={() => { setCookieAccepted(true); localStorage.setItem("cookie_accepted", "true"); }} style={{ padding: "0.6rem 1.5rem", borderRadius: 8, fontSize: "0.84rem", fontWeight: 600, cursor: "pointer", background: "transparent", border: `1px solid rgba(255,255,255,0.12)`, color: s.text2, fontFamily: "'DM Sans',sans-serif" }}>Doar esențiale</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
