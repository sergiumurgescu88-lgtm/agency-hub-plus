import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ChevronRight,
  Building2,
  Target,
  Wallet,
  UserCircle2,
  Search,
  Globe,
  ArrowUpRight,
} from "lucide-react";

/* ─── DATA ─── */
const modules = [
  { icon: "🏠", title: "Proprietăți", desc: "Gestionează portofoliul complet de proprietăți – apartamente, case, terenuri și spații comerciale, totul într-un singur loc.", features: ["Galerie Foto & Video", "Localizare pe Hartă"], path: "/proprietati" },
  { icon: "👥", title: "Clienți & Leads", desc: "Centralizează toți clienții și lead-urile într-o bază de date inteligentă cu scoring automat și segmentare avansată.", features: ["Lead Scoring AI", "Istoric Interacțiuni"], path: "/clienti", status: "ÎN DEZVOLTARE" },
  { icon: "📋", title: "Pipeline Tranzacții", desc: "Vizualizare Kanban completă a tranzacțiilor în curs, de la lead nou până la contract semnat.", features: ["Board Kanban", "Timere & Deadline-uri"], path: "/pipeline", status: "ÎN DEZVOLTARE" },
  { icon: "🎯", title: "Matching AI", desc: "Motor inteligent de potrivire între proprietăți și cerințele clienților, cu sugestii automate și scoring de compatibilitate.", features: ["Algoritm AI de Potrivire", "Notificări Automate"], path: "/matching", status: "ÎN DEZVOLTARE" },
  { icon: "📤", title: "Portale Imobiliare", desc: "Publică anunțuri simultan pe 8-10 platforme: OLX, Storia, Imobiliare.ro, Publi24 și altele, dintr-un singur click.", features: ["Sincronizare Automată", "Statistici per Portal"], path: "/portale", status: "ÎN DEZVOLTARE" },
  { icon: "🌐", title: "Site Agenție", desc: "Website profesional generat automat cu listing-urile tale, pagini de agent și formulare de contact integrate.", features: ["Template-uri Premium", "Listing-uri Live"], path: "/site", status: "ÎN DEZVOLTARE" },
  { icon: "📱", title: "Campanii WA/Email", desc: "Trimite campanii targetate pe WhatsApp și Email către clienți segmentați, cu template-uri profesionale.", features: ["WhatsApp Business API", "Email Marketing"], path: "/campanii", status: "ÎN DEZVOLTARE" },
  { icon: "📝", title: "Contracte", desc: "Generează, semnează și arhivează contracte digitale – de intermediere, pre-contracte și acte adiționale.", features: ["Template-uri Contract", "Semnătură Electronică"], path: "/contracte", status: "ÎN DEZVOLTARE" },
  { icon: "📅", title: "Vizionări", desc: "Programează, gestionează și urmărește toate vizionările – cu calendar integrat și feedback automat.", features: ["Calendar Inteligent", "Checklist Vizionare"], path: "/vizionari", status: "ÎN DEZVOLTARE" },
  { icon: "💰", title: "Comisioane", desc: "Tracking complet al comisioanelor – calculate, facturate și încasate, cu split automat între agenți.", features: ["Calcul Automat", "Dashboard Financiar"], path: "/comisioane", status: "ÎN DEZVOLTARE" },
  { icon: "📊", title: "Analytics", desc: "Rapoarte detaliate și insight-uri despre performanța agenției, agenților și a pieței imobiliare.", features: ["Grafice Interactive", "Leaderboard Agenți"], path: "/analytics", status: "ÎN DEZVOLTARE" },
  { icon: "🤝", title: "MLS Partener", desc: "Colaborează cu alte agenții prin sistemul MLS – share proprietăți, split comisioane și extinde-ți portofoliul.", features: ["Rețea de Agenții", "Reguli de Colaborare"], path: "/mls", status: "ÎN DEZVOLTARE" },
];

const comparisonData = [
  { label: "Adaptat pieței din România", society: "✓", intl: "✗", manual: "✗" },
  { label: "Publicare pe portale RO (OLX, Storia)", society: "✓", intl: "✗", manual: "✗" },
  { label: "Contracte în legislație RO", society: "✓", intl: "✗", manual: "✗" },
  { label: "Pipeline vizual Kanban", society: "✓", intl: "✓", manual: "✗" },
  { label: "Matching AI cerere–ofertă", society: "✓", intl: "Limitat", manual: "✗" },
  { label: "Campanii WhatsApp integrate", society: "✓", intl: "Contra cost", manual: "Manual" },
  { label: "Site agenție generat automat", society: "✓", intl: "Separat", manual: "✗" },
  { label: "Suport în limba română", society: "✓", intl: "✗", manual: "✗" },
  { label: "Preț accesibil piața RO", society: "✓", intl: "Scump", manual: "✗" },
];

const profiles = [
  { avatar: "🚀", title: "Pornești de la zero", desc: "Vrei să intri în imobiliare dar nu știi de unde să începi. SocietyHUB îți dă infrastructura ca să lansezi profesionist.", items: ["Onboarding ghidat pas cu pas", "Procese predefinite testate", "Training integrat în platformă", "Suport dedicat pentru primele luni"] },
  { avatar: "👤", title: "Ești agent independent", desc: "Ai experiență, ai clienți, dar pierzi timp pe administrare. Automatizează tot ce nu generează direct bani.", items: ["CRM personal configurat rapid", "Automatizare lead management", "Publicare pe toate portalele", "Contracte generate în 2 minute"] },
  { avatar: "🏬", title: "Conduci o agenție", desc: "Ai o echipă și vrei vizibilitate pe performanță, să elimini duplicarea efortului și să scalezi business-ul.", items: ["Dashboard centralizat pentru echipă", "Leaderboard și target-uri agenți", "Permisiuni și roluri configurabile", "Rapoarte exportabile management"] },
];

const testimonials = [
  { quote: "Am trecut de la Excel la SocietyHUB. Am economisit 3 ore pe zi și în prima lună am închis cu 40% mai multe tranzacții. Nu mai pot lucra altfel.", author: "Alexandru M.", role: "Agent independent · București" },
  { quote: "Ca director de agenție, aveam zero vizibilitate. Acum văd în timp real fiecare lead și performanța fiecăruia. Dashboard-ul mi-a schimbat business-ul.", author: "Raluca C.", role: "Director agenție · Cluj-Napoca" },
  { quote: "Am pornit de la zero în imobiliare la 32 de ani. Fără SocietyHUB nu știam de unde să încep. Onboarding-ul m-a ajutat să am tranzacții rapid.", author: "Mihai I.", role: "Agent nou · Timișoara" },
];

/* ─── COMPONENTS ─── */
function TrustItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="p-6 md:p-7 flex flex-col gap-1.5 border-r border-[rgba(212,168,67,0.15)] last:border-r-0 hover:bg-[#111] transition-colors group">
      <span className="font-number text-4xl font-semibold leading-none tracking-tighter bg-gradient-to-b from-[#fff4b5] via-[#f9e272] to-[#996515] bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(212,175,55,0.3)]">
        {value}
      </span>
      <span className="text-[14px] text-[#8b735b] font-normal group-hover:text-[#f4e4c1] transition-colors">{label}</span>
    </div>
  );
}

function PainPoint({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-3.5 p-4 bg-[#111] border border-[rgba(212,168,67,0.15)] rounded-md border-l-[3px] border-l-[#996515] problem-card">
      <span className="text-xl shrink-0 mt-0.5">{icon}</span>
      <div>
        <div className="text-[16px] font-bold text-[#f4e4c1] mb-1">{title}</div>
        <div className="text-[14.5px] text-[#8b735b] leading-relaxed">{desc}</div>
      </div>
    </div>
  );
}

function VisualStat({ value, title, desc }: { value: string; title: string; desc: string }) {
  return (
    <div className="p-5 bg-[#111] border border-[rgba(212,168,67,0.2)] rounded-md flex items-center gap-4 hover:border-[rgba(212,168,67,0.4)] hover:bg-[#161616] transition-all group shadow-lg">
      <div className="font-number text-4xl font-bold bg-gradient-to-br from-[#fff4b5] via-[#f9e272] to-[#996515] bg-clip-text text-transparent shrink-0 leading-none min-w-[70px] drop-shadow-[0_2px_10px_rgba(212,175,55,0.4)]">
        {value}
      </div>
      <div>
        <div className="text-[16px] font-bold text-[#f4e4c1] mb-1">{title}</div>
        <div className="text-[14px] text-[#8b735b] leading-relaxed">{desc}</div>
      </div>
    </div>
  );
}

function FeatureItem({ icon, title, desc, type }: { icon: React.ReactNode; title: string; desc: string; type: "gold" | "silver" }) {
  return (
    <div className="flex items-start gap-3.5">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border ${
        type === "gold" ? "bg-[rgba(212,175,55,0.1)] border-[rgba(212,175,55,0.2)]" : "bg-[rgba(184,196,216,0.1)] border-[rgba(184,196,216,0.2)]"
      }`}>
        {icon}
      </div>
      <div>
        <h4 className="text-[16px] font-semibold text-[#f4e4c1] mb-1 tracking-tight">{title}</h4>
        <p className="text-[15px] text-[#8b735b] leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function ProfileCard({ avatar, title, desc, items }: { avatar: string; title: string; desc: string; items: string[] }) {
  return (
    <div className="p-9 bg-[#111] border border-[rgba(212,168,67,0.15)] rounded-md border-t-[3px] border-t-[#996515] hover:bg-[#161616] hover:border-[rgba(212,168,67,0.25)] transition-all duration-300 profile-card">
      <span className="text-4xl mb-4 block">{avatar}</span>
      <h3 className="font-serif text-2xl font-bold text-[#fdf5e6] mb-2.5">{title}</h3>
      <p className="text-base text-[#c5a07a] leading-relaxed mb-5">{desc}</p>
      <div className="flex flex-col gap-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-2.5 text-[14.5px] text-[#8b735b]">
            <div className="w-4 h-4 rounded-sm bg-[rgba(212,175,55,0.12)] border border-[rgba(212,175,55,0.2)] flex items-center justify-center text-[10px] text-[#f9e272] font-bold shrink-0 mt-0.5">✓</div>
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TestimonialCard({ quote, author, role }: { quote: string; author: string; role: string }) {
  return (
    <div className="p-8 bg-[#111] border border-[rgba(212,168,67,0.15)] rounded-md flex flex-col gap-4 hover:bg-[#161616] hover:border-[rgba(212,168,67,0.25)] transition-all duration-300 testimonial-card">
      <div className="text-[#d4af37] text-base tracking-[2px]">
        {[...Array(5)].map((_, i) => (
          <span key={i} className="star">★</span>
        ))}
      </div>
      <p className="font-serif text-lg font-medium italic text-[#f4e4c1] leading-relaxed flex-1">
        <span className="text-[#996515] text-3xl leading-none align-middle mr-1">"</span>{quote}
      </p>
      <div className="flex items-center gap-3 pt-3 border-t border-[rgba(212,168,67,0.15)]">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#996515] to-[#1a1a1a] border border-[rgba(212,168,67,0.25)] flex items-center justify-center font-bold text-[16px] text-[#f9e272]">
          {author.split(" ").map(n => n[0]).join("")}
        </div>
        <div>
          <div className="text-[15px] font-bold text-[#f4e4c1] leading-none mb-1">{author}</div>
          <div className="text-[13.5px] text-[#8b735b] leading-none">{role}</div>
        </div>
      </div>
    </div>
  );
}

/* ─── MAIN LANDING PAGE ─── */
const LandingPage = () => {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLElement>(null);

  // Nav scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const nav = document.querySelector(".sha-nav");
      if (nav) {
        nav.classList.toggle("sha-nav-scrolled", window.scrollY > 60);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("sha-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    const selectors = [
      ".section-tag", ".section-title", ".section-subtitle",
      ".problem-card", ".damage-stat", ".module-card",
      ".profile-card", ".testimonial-card", ".cta-inner > *",
    ];
    selectors.forEach((sel) => {
      document.querySelectorAll(sel).forEach((el, i) => {
        el.classList.add("sha-hidden");
        (el as HTMLElement).style.transitionDelay = `${(i % 4) * 90}ms`;
        observer.observe(el);
      });
    });

    // Solution cards
    const solCards = document.querySelectorAll(".solution-card");
    if (solCards[0]) { solCards[0].classList.add("sha-hidden-left"); observer.observe(solCards[0]); }
    if (solCards[1]) { solCards[1].classList.add("sha-hidden-right"); observer.observe(solCards[1]); }

    // Gold dividers
    const divObs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("sha-divider-visible");
          divObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });
    document.querySelectorAll(".gold-divider").forEach((el) => divObs.observe(el));

    return () => { observer.disconnect(); divObs.disconnect(); };
  }, []);

  const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

  return (
    <div className="min-h-screen selection:bg-[rgba(212,175,55,0.3)] selection:text-[#fff4b5]" style={{ background: "#050405", color: "#f4e4c1", fontFamily: "'Jost', sans-serif" }}>
      {/* Background Layers */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 sha-bg-radial" />
        <div className="absolute inset-0 sha-bg-grid" />
        <div className="absolute inset-0 sha-bg-vignette" />
      </div>

      {/* Navigation */}
      <nav className="sha-nav fixed top-0 left-0 right-0 z-50 h-[70px] flex items-center justify-between px-6 md:px-[60px] bg-[rgba(5,4,5,0.8)] backdrop-blur-2xl border-b border-[rgba(212,168,67,0.15)] sha-nav-animate">
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-4 group cursor-pointer"
        >
          <div className="relative w-[44px] h-[44px] rounded-lg bg-gradient-to-br from-[#f9e272] via-[#d4af37] to-[#996515] flex items-center justify-center shrink-0 shadow-2xl shadow-[rgba(212,175,55,0.3)] overflow-hidden border border-[rgba(249,226,114,0.3)]">
            <span className="font-display font-bold text-2xl text-[#050405] leading-none relative z-10 drop-shadow-sm">S</span>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.5),transparent)]" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-[20px] font-display font-bold bg-gradient-to-b from-[#fff4b5] via-[#f9e272] to-[#996515] bg-clip-text text-transparent tracking-[4px] uppercase">Society</span>
            <span className="text-[10px] font-bold text-[#f9e272] tracking-[5px] uppercase opacity-90">HUB · CRM Imob</span>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-10">
          <a href="#problem" className="text-[15px] font-medium text-[#8b735b] hover:text-[#f4e4c1] transition-colors tracking-wide sha-nav-link">Problema</a>
          <a href="#modules" className="text-[15px] font-medium text-[#8b735b] hover:text-[#f4e4c1] transition-colors tracking-wide sha-nav-link">Module CRM</a>
          <a href="#forwhom" className="text-[15px] font-medium text-[#8b735b] hover:text-[#f4e4c1] transition-colors tracking-wide sha-nav-link">Pentru cine</a>
          <a href="#compare" className="text-[15px] font-medium text-[#8b735b] hover:text-[#f4e4c1] transition-colors tracking-wide sha-nav-link">Comparație</a>
        </div>

        <button
          onClick={() => navigate("/dashboard")}
          className="px-6 py-2.5 rounded-lg border border-[rgba(212,175,55,0.25)] text-[#f9e272] text-[13px] font-semibold hover:bg-[rgba(212,175,55,0.05)] hover:border-[rgba(212,175,55,0.4)] transition-all tracking-wide"
        >
          Începe acum
        </button>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 pt-[120px] pb-[90px] text-center hero">
        <motion.div {...fadeUp} transition={{ duration: 0.8 }} className="w-[60px] h-px bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mb-7" />

        <motion.div {...fadeUp} transition={{ duration: 0.8, delay: 0.1 }} className="flex items-center gap-3 mb-7">
          <div className="w-7 h-px bg-[#996515]" />
          <span className="text-[11px] font-semibold text-[#d4af37] tracking-[3px] uppercase">CRM Imobiliar Pro · România</span>
          <div className="w-7 h-px bg-[#996515]" />
        </motion.div>

        <motion.h1 {...fadeUp} transition={{ duration: 0.8, delay: 0.2 }} className="font-serif text-[clamp(48px,8vw,108px)] font-bold text-[#fdf5e6] leading-[0.92] tracking-tight mb-2">
          <span>Imobiliare</span><br />
          <em className="italic font-normal bg-gradient-to-r from-[#f9e272] via-[#fff4b5] to-[#ffbf00] bg-clip-text text-transparent not-italic drop-shadow-[0_4px_12px_rgba(212,175,55,0.3)] sha-gold-shimmer">profesionale</em>
        </motion.h1>

        <motion.p {...fadeUp} transition={{ duration: 0.8, delay: 0.3 }} className="font-serif text-[clamp(28px,4.5vw,56px)] font-normal italic text-[#5c4d3f] leading-none mb-8">
          fără compromisuri.
        </motion.p>

        <motion.div {...fadeUp} transition={{ duration: 0.8, delay: 0.4 }} className="flex items-center gap-3 mb-7">
          <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#996515]" />
          <div className="w-1.5 h-1.5 bg-[#d4af37] rotate-45" />
          <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#996515]" />
        </motion.div>

        <motion.p {...fadeUp} transition={{ duration: 0.8, delay: 0.5 }} className="max-w-[580px] text-[19px] text-[#c5a07a] leading-relaxed mb-12">
          SocietyHUB este singura platformă construită complet în România care îți oferă <strong className="text-[#f4e4c1]">toate instrumentele</strong> pentru a construi sau scala o afacere imobiliară profitabilă — și care conectează totodată cumpărătorii direct cu proprietarii, <strong className="text-[#f4e4c1]">fără comision</strong>.
        </motion.p>

        <motion.div {...fadeUp} transition={{ duration: 0.8, delay: 0.6 }} className="flex flex-wrap justify-center gap-4 mb-16">
          <button
            onClick={() => navigate("/dashboard")}
            className="relative px-8 py-4 rounded-lg bg-gradient-to-br from-[#d4af37] to-[#ffbf00] text-[#050405] text-[16px] font-bold shadow-lg shadow-[rgba(212,175,55,0.2)] hover:shadow-[rgba(212,175,55,0.3)] hover:-translate-y-0.5 transition-all"
          >
            Accesează CRM-ul →
          </button>
          <a
            href="https://cautaimob.ro"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 rounded-lg border border-[rgba(212,175,55,0.25)] text-[#f9e272] text-[16px] font-semibold hover:bg-[rgba(212,175,55,0.05)] hover:border-[rgba(212,175,55,0.4)] transition-all"
          >
            Caut fără comision ↗
          </a>
        </motion.div>

        {/* Stats Bar */}
        <motion.div {...fadeUp} transition={{ duration: 0.9, delay: 0.7 }} className="w-full max-w-[1100px] grid grid-cols-2 lg:grid-cols-4 bg-[#111] border border-[rgba(212,168,67,0.15)] rounded-sm overflow-hidden">
          <TrustItem value="1.200+" label="Agenți și agenții active în platformă" />
          <TrustItem value="34.000+" label="Proprietăți gestionate lunar prin CRM" />
          <TrustItem value="€0" label="Comision de agenție pentru clienții direcți" />
          <TrustItem value="4.9 ★" label="Rating mediu · utilizatori verificați" />
        </motion.div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-[rgba(212,175,55,0.2)] to-transparent gold-divider" />

      {/* Problem Section */}
      <section id="problem" className="relative z-10 bg-[#0a0a0a] py-24">
        <div className="max-w-[1100px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="flex items-center gap-3 mb-5 section-tag">
              <div className="w-8 h-px bg-[#996515] section-tag-line" />
              <span className="text-[11px] font-semibold text-[#d4af37] tracking-[3px] uppercase">Realitatea pieței</span>
            </div>
            <h2 className="font-serif text-[clamp(34px,3.5vw,52px)] font-bold text-[#fdf5e6] leading-[1.1] mb-5 tracking-tight section-title">
              Munca haotică<br /><em className="italic font-normal text-[#f9e272] not-italic">îți costă bani</em><br />în fiecare zi
            </h2>
            <p className="text-[#c5a07a] text-base leading-relaxed mb-4 section-subtitle">
              Majoritatea agenților imobiliari din România pierd <strong className="font-number text-[#f9e272]">4–6 ore pe zi</strong> pe sarcini administrative: trimit oferte manual, țin evidența clienților în Excel sau pe hârtie, pierd lead-uri pentru că nu au un sistem de urmărire și publică același anunț de <strong className="font-number text-[#f9e272]">8</strong> ori, pe fiecare portal în parte.
            </p>
            <p className="text-[#c5a07a] text-base leading-relaxed mb-8">
              Rezultatul? Tranzacții ratate, clienți frustrați și energie irosită pe operațiuni care pot fi <strong className="text-[#f4e4c1]">automatizate complet</strong>.
            </p>
            <div className="flex flex-col gap-3.5 mt-8">
              <PainPoint icon="📋" title="Excel și agende fizice nu mai sunt suficiente" desc="Când portofoliul crește, sistemele improvizate colapsează. Pierzi clienți și ratezi follow-up-uri." />
              <PainPoint icon="⏰" title="Publicarea manuală pe portale durează ore" desc="Orice modificare de preț înseamnă 4 actualizări manuale pe OLX, Storia, Imobiliare.ro etc." />
              <PainPoint icon="💸" title="Lead-urile se pierd fără un pipeline clar" desc="Un client interesat te contactează, nu îl urmărești la timp și vânzarea se duce la alt agent." />
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <VisualStat value="73%" title="din agenții imobiliari nu au un CRM dedicat" desc="Lucrează cu Excel și WhatsApp — și pierd în medie 2 tranzacții pe lună." />
            <VisualStat value="4–6h" title="pierdute zilnic pe sarcini administrative" desc="Timp care ar putea fi petrecut cu clienții sau la vizionări, nu la tastatură." />
            <VisualStat value="€2.500" title="comision mediu pierdut lunar din lead-uri neurmărite" desc="Calculat pe baza ratei medii de conversie din piața imobiliară din România." />
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-[rgba(212,175,55,0.2)] to-transparent gold-divider" />

      {/* Solution Section */}
      <section id="solution" className="relative z-10 py-24">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="text-center max-w-[640px] mx-auto mb-16">
            <div className="flex items-center justify-center gap-3 mb-5 section-tag">
              <div className="w-8 h-px bg-[#996515] section-tag-line" />
              <span className="text-[11px] font-semibold text-[#d4af37] tracking-[3px] uppercase">Soluția</span>
              <div className="w-8 h-px bg-[#996515] section-tag-line" />
            </div>
            <h2 className="font-serif text-[clamp(36px,4vw,58px)] font-bold text-[#fdf5e6] leading-[1.05] mb-4 tracking-tight section-title">
              Alege cum vrei<br />să folosești<br /><em className="italic font-normal text-[#f9e272] not-italic">platforma</em>
            </h2>
            <p className="text-[#c5a07a] text-lg leading-relaxed section-subtitle">
              SocietyHUB servește două tipuri de utilizatori cu nevoi complet diferite. <strong className="text-[#f4e4c1]">Alege calea ta:</strong>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* CRM Card */}
            <div
              onClick={() => navigate("/dashboard")}
              className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-[#111] to-[#161616] border border-[rgba(212,168,67,0.15)] hover:border-[rgba(212,168,67,0.3)] transition-all duration-500 cursor-pointer shadow-2xl hover:-translate-y-1.5 solution-card"
            >
              <div className="h-[3px] w-full bg-gradient-to-r from-[#996515] via-[#fff4b5] to-[#996515]" />
              <div className="p-8 md:p-11 text-left flex flex-col h-full">
                <div className="flex items-start justify-between mb-7 gap-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm bg-[rgba(212,175,55,0.1)] border border-[rgba(212,175,55,0.2)] text-[#f9e272] text-[11px] font-bold tracking-[1.5px] uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#f9e272] animate-pulse" /> CRM Profesional
                  </span>
                  <span className="font-number text-5xl font-bold bg-gradient-to-b from-[#f9e272] to-[#996515] bg-clip-text text-transparent opacity-40 leading-none tracking-tighter">01</span>
                </div>
                <p className="text-[12px] font-semibold text-[#996515] tracking-[2.5px] uppercase mb-2.5">Pentru profesioniști imobiliari</p>
                <h2 className="font-serif text-[34px] font-bold text-[#fdf5e6] leading-[1.1] mb-3.5">Construiesc sau scalez<br />o afacere imobiliară</h2>
                <p className="text-[16.5px] text-[#c5a07a] leading-relaxed mb-8">
                  Fie că ești <strong className="text-[#f4e4c1]">agent cu experiență</strong>, conduci o <strong className="text-[#f4e4c1]">agenție consacrată</strong> sau vrei să <strong className="text-[#f4e4c1]">pornești de la zero</strong> — SocietyHUB îți oferă toată infrastructura digitală.
                </p>
                <div className="h-px bg-gradient-to-r from-[rgba(212,175,55,0.15)] to-transparent mb-7" />
                <p className="text-[11.5px] font-bold text-[#996515] tracking-[2px] uppercase mb-4">De ce aleg profesioniștii SocietyHUB</p>
                <div className="flex flex-col gap-4 mb-9">
                  <FeatureItem icon={<Building2 size={16} className="text-[#f9e272]" />} title="Portofoliu complet gestionat digital" desc="Adaugă, editează și publică oferte pe toate portalurile majore dintr-un singur loc." type="gold" />
                  <FeatureItem icon={<Target size={16} className="text-[#f9e272]" />} title="Pipeline de vânzări — niciun lead pierdut" desc="Fiecare lead este capturat și urmărit automat. Follow-up-uri automate și matching instant." type="gold" />
                  <FeatureItem icon={<Globe size={16} className="text-[#f9e272]" />} title="Publicare pe 8+ portale dintr-un click" desc="OLX, Storia, Imobiliare.ro și altele — un singur click publică anunțul peste tot." type="gold" />
                </div>
                <div className="mt-auto flex items-center justify-between p-4 rounded-sm bg-gradient-to-br from-[rgba(212,175,55,0.15)] to-[rgba(212,175,55,0.05)] border border-[rgba(212,175,55,0.2)] text-[#f9e272] text-base font-semibold group-hover:bg-[rgba(212,175,55,0.2)] transition-all">
                  <span>Accesează CRM-ul profesional</span>
                  <div className="w-9 h-9 rounded-lg bg-[rgba(212,175,55,0.15)] flex items-center justify-center group-hover:translate-x-1.5 transition-transform">
                    <ChevronRight size={18} />
                  </div>
                </div>
              </div>
            </div>

            {/* Client Card */}
            <a
              href="https://cautaimob.ro"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-[#0a0a0a] to-[#111] border border-[rgba(184,196,216,0.15)] hover:border-[rgba(184,196,216,0.3)] transition-all duration-500 cursor-pointer shadow-2xl hover:-translate-y-1.5 solution-card"
            >
              <div className="h-[3px] w-full bg-gradient-to-r from-transparent via-[#b8c4d8] to-transparent" />
              <div className="p-8 md:p-11 text-left flex flex-col h-full">
                <div className="flex items-start justify-between mb-7 gap-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm bg-[rgba(184,196,216,0.1)] border border-[rgba(184,196,216,0.2)] text-[#b8c4d8] text-[11px] font-bold tracking-[1.5px] uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#b8c4d8] animate-pulse" /> Fără comision
                  </span>
                  <span className="font-number text-5xl font-bold bg-gradient-to-b from-[#b8c4d8] to-[#6b7a8e] bg-clip-text text-transparent opacity-40 leading-none tracking-tighter">02</span>
                </div>
                <p className="text-[12px] font-semibold text-[#8b735b] tracking-[2.5px] uppercase mb-2.5">Pentru cumpărători și chiriași</p>
                <h2 className="font-serif text-[34px] font-bold text-[#f4e4c1] leading-[1.1] mb-3.5">Caut proprietate<br />direct de la proprietar</h2>
                <p className="text-[16.5px] text-[#c5a07a] leading-relaxed mb-8">
                  Ești <strong className="text-[#f4e4c1]">cumpărător sau chiriaș</strong> și nu vrei să plătești 2–4% comision? Pe <strong className="text-[#f4e4c1]">cautaimob.ro</strong> găsești proprietăți listate exclusiv de proprietari.
                </p>
                <div className="h-px bg-gradient-to-r from-[rgba(184,196,216,0.1)] to-transparent mb-7" />
                <p className="text-[11.5px] font-bold text-[#8b735b] tracking-[2px] uppercase mb-4">De ce aleg clienții cautaimob.ro</p>
                <div className="flex flex-col gap-4 mb-9">
                  <FeatureItem icon={<Wallet size={16} className="text-[#b8c4d8]" />} title="Zero comision — garantat" desc="Nu există intermediari pe platformă. Economisești mii de euro pe tranzacție." type="silver" />
                  <FeatureItem icon={<UserCircle2 size={16} className="text-[#b8c4d8]" />} title="Contact direct cu proprietarul real" desc="Vorbești direct cu cel care deține proprietatea, fără filtre sau întârzieri." type="silver" />
                  <FeatureItem icon={<Search size={16} className="text-[#b8c4d8]" />} title="Filtre avansate — găsești rapid" desc="Zeci de filtre pentru a elimina anunțurile irelevante și a ajunge la proprietatea potrivită." type="silver" />
                </div>
                <div className="mt-auto flex items-center justify-between p-4 rounded-sm bg-gradient-to-br from-[rgba(184,196,216,0.1)] to-[rgba(184,196,216,0.05)] border border-[rgba(184,196,216,0.2)] text-[#b8c4d8] text-base font-semibold group-hover:bg-[rgba(184,196,216,0.2)] transition-all">
                  <span>Deschide cautaimob.ro</span>
                  <div className="w-9 h-9 rounded-lg bg-[rgba(184,196,216,0.12)] flex items-center justify-center group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
                    <ArrowUpRight size={18} />
                  </div>
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-[rgba(212,175,55,0.2)] to-transparent gold-divider" />

      {/* Modules Section */}
      <section id="modules" className="relative z-10 bg-[#0a0a0a] py-24">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="text-center max-w-[620px] mx-auto mb-16">
            <div className="flex items-center justify-center gap-3 mb-5 section-tag">
              <div className="w-8 h-px bg-[#996515] section-tag-line" />
              <span className="text-[11px] font-semibold text-[#d4af37] tracking-[3px] uppercase">CRM Complet</span>
              <div className="w-8 h-px bg-[#996515] section-tag-line" />
            </div>
            <h2 className="font-serif text-[clamp(34px,3.8vw,54px)] font-bold text-[#fdf5e6] leading-[1.08] mb-4 tracking-tight section-title">
              12 module integrate<br /><em className="italic font-normal text-[#f9e272] not-italic">pentru tot ce ai nevoie</em>
            </h2>
            <p className="text-[#c5a07a] text-base leading-relaxed section-subtitle">
              SocietyHUB nu este un simplu tool de organizare. Este un <strong className="text-[#f4e4c1]">ecosistem complet</strong> care acoperă fiecare etapă a activității imobiliare.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules.map((m) => (
              <div
                key={m.title}
                onClick={() => navigate(m.path)}
                className="group p-7 bg-[#111] border border-[rgba(212,168,67,0.1)] rounded-sm hover:bg-[#161616] hover:border-[rgba(212,168,67,0.25)] hover:-translate-y-1 transition-all duration-300 cursor-pointer module-card"
              >
                <div className="text-2xl mb-4 block group-hover:scale-110 transition-transform origin-left">{m.icon}</div>
                <h3 className="text-base font-bold text-[#f4e4c1] mb-2 tracking-tight group-hover:text-[#f9e272] transition-colors">{m.title}</h3>
                <p className="text-[13.5px] text-[#8b735b] leading-relaxed mb-4">{m.desc}</p>
                <div className="flex flex-col gap-1.5">
                  {m.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-[12.5px] text-[#5c4d3f]">
                      <div className="w-1 h-1 rounded-full bg-[#996515] shrink-0" />
                      <span className="truncate">{f}</span>
                    </div>
                  ))}
                </div>
                {m.status && (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[rgba(212,175,55,0.05)] border border-[rgba(212,175,55,0.15)] text-[10px] font-semibold text-[#996515] tracking-wider uppercase mt-4">
                    {m.status}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-[rgba(212,175,55,0.2)] to-transparent gold-divider" />

      {/* Profiles Section */}
      <section id="forwhom" className="relative z-10 py-24">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="text-center max-w-[620px] mx-auto mb-16">
            <div className="flex items-center justify-center gap-3 mb-5 section-tag">
              <div className="w-8 h-px bg-[#996515] section-tag-line" />
              <span className="text-[12px] font-semibold text-[#d4af37] tracking-[3px] uppercase">Profiluri</span>
              <div className="w-8 h-px bg-[#996515] section-tag-line" />
            </div>
            <h2 className="font-serif text-[clamp(34px,3.8vw,54px)] font-bold text-[#fdf5e6] leading-[1.08] mb-4 tracking-tight section-title">
              SocietyHUB<br />este construit<br /><em className="italic font-normal text-[#f9e272] not-italic">pentru tine dacă…</em>
            </h2>
            <p className="text-[#c5a07a] text-lg leading-relaxed section-subtitle">Indiferent de unde ești în cariera ta imobiliară, platforma se adaptează nevoilor tale specifice.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {profiles.map((p) => (
              <ProfileCard key={p.title} {...p} />
            ))}
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-[rgba(212,175,55,0.2)] to-transparent gold-divider" />

      {/* Comparison Section */}
      <section id="compare" className="relative z-10 bg-[#0a0a0a] py-24">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="text-center max-w-[600px] mx-auto mb-14">
            <div className="flex items-center justify-center gap-3 mb-5 section-tag">
              <div className="w-8 h-px bg-[#996515] section-tag-line" />
              <span className="text-[12px] font-semibold text-[#d4af37] tracking-[3px] uppercase">Comparație</span>
              <div className="w-8 h-px bg-[#996515] section-tag-line" />
            </div>
            <h2 className="font-serif text-[clamp(32px,3.6vw,50px)] font-bold text-[#fdf5e6] leading-[1.1] mb-3 tracking-tight section-title">
              SocietyHUB vs.<br /><em className="italic font-normal text-[#f9e272] not-italic">alternativele</em> din piață
            </h2>
            <p className="text-[#c5a07a] text-base leading-relaxed section-subtitle">De ce profesioniștii imobiliari din România aleg SocietyHUB față de soluțiile internaționale.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-[#111] border border-[rgba(212,168,67,0.15)] rounded-sm overflow-hidden">
              <thead>
                <tr className="bg-[#161616] border-b border-[rgba(212,168,67,0.15)]">
                  <th className="p-4 text-left text-[11px] font-bold text-[#c5a07a] tracking-widest uppercase">Funcționalitate</th>
                  <th className="p-4 text-left text-[11px] font-bold text-[#f9e272] tracking-widest uppercase bg-[rgba(212,175,55,0.05)]">SocietyHUB</th>
                  <th className="p-4 text-left text-[11px] font-bold text-[#8b735b] tracking-widest uppercase">CRM Internațional</th>
                  <th className="p-4 text-left text-[11px] font-bold text-[#8b735b] tracking-widest uppercase">Excel + WhatsApp</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((r) => (
                  <tr key={r.label} className="hover:bg-[#161616] transition-colors">
                    <td className="p-4 text-base font-medium text-[#f4e4c1] border-b border-[rgba(212,168,67,0.05)]">{r.label}</td>
                    <td className="p-4 text-base font-bold text-[#f9e272] border-b border-[rgba(212,168,67,0.05)] bg-[rgba(212,175,55,0.04)]">
                      {r.society === "✓" ? <span className="text-[#4ade80]">✓</span> : r.society}
                    </td>
                    <td className="p-4 text-base text-[#8b735b] border-b border-[rgba(212,168,67,0.05)]">
                      {r.intl === "✗" ? <span className="text-[#ef4444]">✗</span> : r.intl === "✓" ? <span className="text-[#4ade80]">✓</span> : r.intl}
                    </td>
                    <td className="p-4 text-base text-[#5c4d3f] border-b border-[rgba(212,168,67,0.05)]">
                      {r.manual === "✗" ? <span className="text-[#ef4444]">✗</span> : r.manual}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-[rgba(212,175,55,0.2)] to-transparent gold-divider" />

      {/* Testimonials */}
      <section className="relative z-10 py-24">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="text-center max-w-[580px] mx-auto mb-14">
            <div className="flex items-center justify-center gap-3 mb-5 section-tag">
              <div className="w-8 h-px bg-[#996515] section-tag-line" />
              <span className="text-[11px] font-semibold text-[#d4af37] tracking-[3px] uppercase">Testimoniale</span>
              <div className="w-8 h-px bg-[#996515] section-tag-line" />
            </div>
            <h2 className="font-serif text-[clamp(32px,3.6vw,50px)] font-bold text-[#fdf5e6] leading-[1.1] mb-3 tracking-tight section-title">
              Ce spun<br /><em className="italic font-normal text-[#f9e272] not-italic">utilizatorii noștri</em>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map((t) => (
              <TestimonialCard key={t.author} {...t} />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 bg-[#0a0a0a] py-24 text-center cta-section">
        <div className="max-w-[1100px] mx-auto px-6 flex flex-col items-center cta-inner">
          <div className="flex items-center gap-4 mb-7">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#d4af37]" />
            <div className="w-2 h-2 bg-[#d4af37] rotate-45" />
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#d4af37]" />
          </div>
          <span className="text-[11px] font-semibold text-[#d4af37] tracking-[3px] uppercase mb-6">Începe astăzi</span>
          <h2 className="font-serif text-[clamp(40px,5vw,72px)] font-bold text-[#fdf5e6] leading-none tracking-tighter mb-2.5">
            Fii cu un pas<br /><em className="italic font-normal text-[#f9e272] not-italic">înaintea pieței</em>
          </h2>
          <p className="font-serif text-[clamp(20px,2.5vw,32px)] font-normal italic text-[#5c4d3f] mb-7">imobiliare din România.</p>
          <p className="max-w-[520px] text-[18px] text-[#c5a07a] leading-relaxed mb-11">
            Fiecare zi în care lucrezi fără un CRM dedicat înseamnă <strong className="text-[#f4e4c1]">lead-uri pierdute, timp irosit și bani lăsați pe masă</strong>. SocietyHUB îți oferă toată infrastructura digitală.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="px-8 py-4 rounded-lg bg-gradient-to-br from-[#d4af37] to-[#ffbf00] text-[#050405] text-[16px] font-bold shadow-lg shadow-[rgba(212,175,55,0.2)] hover:shadow-[rgba(212,175,55,0.3)] hover:-translate-y-0.5 transition-all"
            >
              Accesează CRM-ul →
            </button>
            <a
              href="https://cautaimob.ro"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-lg border border-[rgba(212,175,55,0.25)] text-[#f9e272] text-[16px] font-semibold hover:bg-[rgba(212,175,55,0.05)] hover:border-[rgba(212,175,55,0.4)] transition-all"
            >
              Caut fără comision ↗
            </a>
          </div>
          <p className="mt-5 text-[14px] text-[#5c4d3f] tracking-wide">
            Fără card de credit · <span className="text-[#996515]">Setup în 30 de minute</span> · Suport în română
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[rgba(212,168,67,0.15)] px-6 md:px-[60px] py-9 grid grid-cols-1 lg:grid-cols-3 items-center gap-5 text-center lg:text-left">
        <span className="font-serif text-[14.5px] font-medium text-[#5c4d3f] tracking-wide">© 2026 SocietyHUB — CRM Imobiliar Pro</span>
        <div className="hidden lg:flex items-center justify-center gap-2 text-[#5c4d3f]">
          <div className="w-7 h-px bg-[#3d332a]" />
          <div className="w-1 h-1 bg-[#5c4d3f] rotate-45" />
          <div className="w-7 h-px bg-[#3d332a]" />
        </div>
        <div className="flex flex-wrap justify-center lg:justify-end gap-6">
          <a href="#" className="text-[14px] text-[#3d332a] hover:text-[#8b735b] transition-colors tracking-wide">Termeni și condiții</a>
          <a href="#" className="text-[14px] text-[#3d332a] hover:text-[#8b735b] transition-colors tracking-wide">Confidențialitate</a>
          <a href="#" className="text-[14px] text-[#3d332a] hover:text-[#8b735b] transition-colors tracking-wide">Contact</a>
          <a href="https://cautaimob.ro" target="_blank" rel="noopener noreferrer" className="text-[14px] text-[#3d332a] hover:text-[#8b735b] transition-colors tracking-wide">cautaimob.ro ↗</a>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
