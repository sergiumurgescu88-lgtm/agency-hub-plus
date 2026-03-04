import { DashboardLayout } from "@/components/DashboardLayout";
import { useNavigate } from "react-router-dom";

const BusinessPlan = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      {/* Topbar */}
      <div className="bg-surface border-b border-subtle px-4 md:px-7 h-[52px] md:h-[58px] flex items-center gap-3 md:gap-4 sticky top-0 z-40">
        <button onClick={() => navigate("/")} className="text-dim hover:text-gold transition-colors bg-transparent border-none cursor-pointer text-sm">
          ← Înapoi
        </button>
        <div className="flex-1 min-w-0">
          <span className="font-serif text-base md:text-xl">Plan de Afaceri</span>
          <span className="text-dim2 text-xs md:text-sm ml-2 md:ml-2.5 font-sans hidden sm:inline">SocietyHUB · Versiunea 1.0</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto py-6 md:py-10 px-4 md:px-6">
        {/* Cover */}
        <div className="bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] rounded-2xl p-8 md:p-16 text-center mb-8 md:mb-10">
          <div className="font-serif text-[36px] md:text-[52px] font-bold tracking-tight mb-1">
            Society<span className="text-[#38bdf8]">HUB</span>
          </div>
          <div className="text-[15px] md:text-[19px] text-[#7dd3fc] font-light mb-2.5">
            CRM Imobiliar Dual — Agenții & Utilizatorul Final Anti-Comision
          </div>
          <p className="text-xs md:text-sm text-[#94a3b8] max-w-[580px] mx-auto leading-relaxed mb-6">
            Platforma care vinde servicii complete agenților imobiliare și, în același timp, oferă utilizatorului final care vrea să „sară agențiile" un bot AI direct conectat la proprietari — prin API OLX & Storia.
          </p>
          <div className="flex justify-center gap-2 md:gap-3 flex-wrap mb-7">
            {[
              { text: "🚀 Inovație Radicală", gold: true },
              { text: "🤖 Bot AI Anti-Comision", gold: false },
              { text: "🏢 CRM Complet B2B", gold: false },
              { text: "👤 Platformă B2C Unică", gold: false },
              { text: "🇷🇴 First-Mover România", gold: true },
            ].map((b) => (
              <span
                key={b.text}
                className={`px-3 md:px-[18px] py-1.5 rounded-full text-[11px] md:text-[13px] border ${
                  b.gold
                    ? "bg-[rgba(251,191,36,0.15)] border-[rgba(251,191,36,0.3)] text-[#fbbf24]"
                    : "bg-[rgba(56,189,248,0.15)] border-[rgba(56,189,248,0.3)] text-[#7dd3fc]"
                }`}
              >
                {b.text}
              </span>
            ))}
          </div>
          <div className="text-[10px] md:text-xs text-[#475569]">Plan de Afaceri Complet · Versiunea 1.0 · Martie 2026 · Confidențial</div>
        </div>

        {/* TOC */}
        <Section title="📋 Cuprins">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-1">
            {[
              "01 — Rezumat Executiv", "02 — Problema pe care o rezolvăm",
              "03 — Soluția — Ce este SocietyHUB", "04 — Analiza pieței & Competitori",
              "05 — Feature Matrix — Noi vs. Toți", "06 — Arhitectura produsului",
              "07 — Botul AI — OLX & Storia", "08 — Modelul de venituri & Prețuri",
              "09 — Proiecții financiare", "10 — Roadmap de dezvoltare (12 luni)",
              "11 — Strategie de Go-to-Market", "12 — Analiza SWOT",
              "13 — Riscuri & Viabilitate juridică", "14 — Concluzii strategice",
            ].map((item) => (
              <div key={item} className="py-1.5 text-sm text-dim">
                <span className="text-info-blue font-bold mr-1.5">{item.split(" — ")[0]}</span>
                {item.split(" — ")[1]}
              </div>
            ))}
          </div>
        </Section>

        {/* 01 REZUMAT EXECUTIV */}
        <NumberedSection num="01" title="Rezumat Executiv">
          <p className="text-sm text-dim leading-7 mb-3">
            <strong>SocietyHUB</strong> este o platformă software imobiliară dual-sided care servește simultan două segmente de piață complet diferite: agenții imobiliare (B2B) și utilizatorii finali care doresc să cumpere sau să închirieze o proprietate fără a plăti comision agenției (B2C).
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-base font-semibold mb-3 border-l-4 border-info pl-3">Ce oferim agenților (B2B)</h3>
              <BulletList items={[
                "CRM complet pentru gestiunea portofoliului și clienților",
                "Publicare automată pe OLX, Storia, Imobiliare.ro cu 1 click",
                "Matching AI cerere-ofertă cu notificări instant",
                "Contracte digitale + semnătură electronică",
                "Analytics avansat pentru manageri de agenție",
                "Site propriu al agenției inclus în abonament",
                "Facturare automată (SmartBill / Oblio)",
              ]} />
            </div>
            <div>
              <h3 className="text-base font-semibold mb-3 border-l-4 border-teal pl-3">Ce oferim utilizatorului final (B2C)</h3>
              <BulletList items={[
                "Bot AI care caută doar proprietari particulari pe OLX & Storia",
                "Alerte push mobile când apare un anunț potrivit",
                "Contact direct cu proprietarul — fără intermediar, fără comision",
                'Evaluare preț AI: "Este prețul corect față de piață?"',
                "Detector agenți mascați sub profil de persoană fizică",
                "Ghid tranzacție directă + checklist documente",
                "Simulare credit bancar direct în pagina proprietății",
              ]} />
            </div>
          </div>
          <HighlightBox
            title="💡 Unicitatea absolută pe piața românească"
            text="Niciun CRM din România — nici REBS, nici Zarina, nici Softimobiliar, nici ImmoFlux — nu are un modul pentru utilizatorul final și niciun bot AI conversațional. Segmentul B2C anti-comision este complet neocupat."
            tag="🚀 First-mover advantage confirmat"
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
            {[
              { label: "Piață Adresabilă", val: "~8.000", sub: "agenții imobiliare RO" },
              { label: "Utilizatori B2C Potențiali", val: "500K+", sub: "tranzacții/an în RO" },
              { label: "Comision Mediu Evitat", val: "2.000€", sub: "per tranzacție la 2%" },
              { label: "Target Venit An 1", val: "~200K€", sub: "B2B + B2C combinate" },
            ].map((f) => (
              <div key={f.label} className="bg-gradient-to-br from-[#0f2027] to-[#0c4a6e] rounded-xl p-4 md:p-5 text-center">
                <div className="text-[10px] md:text-[11px] text-[#94a3b8] tracking-wider uppercase mb-1.5">{f.label}</div>
                <div className="text-xl md:text-2xl font-bold text-[#38bdf8]">{f.val}</div>
                <div className="text-[10px] md:text-[11px] text-[#475569] mt-1">{f.sub}</div>
              </div>
            ))}
          </div>
        </NumberedSection>

        {/* 02 PROBLEMA */}
        <NumberedSection num="02" title="Problema pe care o Rezolvăm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-base font-semibold mb-3 border-l-4 border-info pl-3">🏢 Problema agenților imobiliare</h3>
              <BulletList variant="red" items={[
                "Pierd ore zilnic cu publicarea manuală pe fiecare portal",
                "Nu au vizibilitate clară a pipeline-ului de tranzacții",
                "Matching manual între cereri și proprietăți — lent",
                "Contractele se semnează fizic, necesitând prezență",
                "Nu există sistem de colaborare inter-agenții (MLS)",
                "Managerii nu pot monitoriza activitatea în timp real",
                "Facturarea în sisteme separate deconectate",
              ]} />
            </div>
            <div>
              <h3 className="text-base font-semibold mb-3 border-l-4 border-danger pl-3">👤 Problema utilizatorului final</h3>
              <BulletList variant="red" items={[
                "Plătesc 2–3% comision pentru un simplu număr de telefon",
                "Agenții blochează accesul direct la proprietar",
                'Practica "taxei de vizionare"',
                "Clauzele de neocolire blochează contactul direct",
                "Agenții postează sub profil de particular",
                "Nu știu dacă prețul cerut este corect",
                "Procesul juridic este opac și intimidant",
              ]} />
            </div>
          </div>
          <WarningBox
            title="⚡ Dimensiunea problemei în cifre"
            text="Un apartament de 2 camere la periferie costă 85.000–100.000€. La un comision de 3%, cumpărătorul plătește echivalentul mai multor salarii medii nete pentru un serviciu care uneori nu adaugă nicio valoare reală."
          />
        </NumberedSection>

        {/* 03 SOLUTIA */}
        <NumberedSection num="03" title="Soluția — Ce este SocietyHUB">
          <p className="text-sm text-dim leading-7 mb-4">
            SocietyHUB funcționează ca o platformă cu două intrări distincte, unite de aceeași infrastructură de date. Ambele segmente se alimentează reciproc, creând un efect de rețea auto-amplificat.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="border border-subtle rounded-xl p-4 md:p-5 border-t-4 border-t-info">
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-dim text-info-blue">LATURA A</span>
              <h3 className="text-base font-bold mt-3 mb-1">SocietyHUB pentru Agenții</h3>
              <div className="text-xs text-dim2 mb-4">CRM profesional complet · Abonament lunar · B2B</div>
              <BulletList items={[
                "Gestiune portofoliu proprietăți nelimitat",
                "Publicare 1 click pe 15+ portale imobiliare",
                "CRM clienți cu pipeline vizual (Kanban)",
                "Matching AI cerere-ofertă cu scor de compatibilitate",
                "Calendar vizionări + reminder WhatsApp automat",
                "Generare contracte din template-uri românești",
                "Semnătură electronică integrată",
                "Dashboard analytics complet pentru manager",
                "Modul MLS — colaborare inter-agenții",
                "Site propriu agenție inclus",
              ]} />
            </div>
            <div className="border border-subtle rounded-xl p-4 md:p-5 border-t-4 border-t-teal">
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-teal-dim text-teal">LATURA B</span>
              <h3 className="text-base font-bold mt-3 mb-1">SocietyHUB pentru Cumpărători</h3>
              <div className="text-xs text-dim2 mb-4">Bot AI anti-comision · Abonament mic · B2C</div>
              <BulletList items={[
                'Bot AI: "Caut 2 camere în Floreasca, max 800€" - proprietari direct',
                "Filtrare exclusivă anunțuri de la particulari reali",
                "Alerte push în secunde după apariția unui anunț",
                "Contact direct telefon/WhatsApp cu proprietarul",
                "Evaluare preț AI față de media zonei (AVM)",
                "Detector agenți mascați sub profil particular",
                "Checklist tranzacție directă pas cu pas",
                "Verificare carte funciară + ipoteci (ANCPI)",
                "Comparator proprietăți side-by-side",
                "Simulare credit ING / BT / BCR în timp real",
              ]} />
            </div>
          </div>
          <HighlightBox
            title="🔄 Efectul de Rețea (Flywheel)"
            text="Mai mulți utilizatori B2C → mai mulți proprietari contactați direct → mai mulți agenți vor să acceseze leads calificați → mai mulți agenți B2B → date mai bune pentru botul AI → bot mai precis → mai mulți utilizatori B2C. Cele două laturi se amplifică reciproc continuu."
          />
        </NumberedSection>

        {/* 05 FEATURE MATRIX */}
        <NumberedSection num="05" title="Feature Matrix — SocietyHUB vs. Toți Competitorii">
          <div className="overflow-x-auto -mx-4 md:mx-0">
            <table className="w-full text-[12px] md:text-[13px] border-collapse min-w-[700px]">
              <thead>
                <tr>
                  <th className="bg-[#0f2027] text-foreground p-2.5 md:p-3 text-left min-w-[180px] md:min-w-[220px] rounded-tl-lg">Funcționalitate</th>
                  {["REBS", "Zarina", "Softimob.", "ImmoFlux", "Argus.me"].map((h) => (
                    <th key={h} className="bg-[#0f2027] text-foreground p-2.5 md:p-3 text-center">{h}</th>
                  ))}
                  <th className="bg-info text-foreground p-2.5 md:p-3 text-center rounded-tr-lg font-bold">SocietyHUB</th>
                </tr>
              </thead>
              <tbody>
                <tr><td colSpan={7} className="text-[10px] md:text-[11px] tracking-widest uppercase text-dim2 p-2.5 bg-surface2">— Funcții Standard CRM —</td></tr>
                {[
                  ["Gestiune portofoliu proprietăți", "✓","✓","✓","✓","✗","✓"],
                  ["CRM clienți + pipeline vizual", "✓","✓","✓","✓","✗","✓"],
                  ["Publicare automată portale (1 click)", "✓","✓","✓","✓","✗","✓"],
                  ["Matching automat cerere-ofertă", "✓","✓","✓","✓","✗","✓"],
                ].map(([feat, ...vals], i) => (
                  <tr key={i} className="border-b border-subtle hover:bg-surface2/50">
                    <td className="p-2.5">{feat}</td>
                    {vals.map((v, j) => (
                      <td key={j} className={`p-2.5 text-center font-bold ${v === "✓" ? "text-teal" : v === "✗" ? "text-danger" : "text-gold"}`}>{v}</td>
                    ))}
                  </tr>
                ))}
                <tr><td colSpan={7} className="text-[10px] md:text-[11px] tracking-widest uppercase text-teal p-2.5 bg-teal-dim/30 font-bold">— EXCLUSIV SocietyHUB —</td></tr>
                {[
                  ["🤖 Bot AI conversațional", "✗","✗","✗","✗","✗","EXCLUSIV"],
                  ["👤 Modul B2C anti-comision", "✗","✗","✗","✗","✗","EXCLUSIV"],
                  ["🔔 Alerte push instant", "✗","✗","✗","✗","~","EXCLUSIV"],
                  ["💰 Evaluare preț AI (AVM)", "✗","✗","✗","✗","✗","EXCLUSIV"],
                  ["🛡️ Detectare agenți mascați", "✗","✗","✗","✗","~","EXCLUSIV"],
                  ["📋 Ghid juridic tranzacție", "✗","✗","✗","✗","✗","EXCLUSIV"],
                  ["🏦 Simulare credit bancar", "✗","✗","✗","✗","✗","EXCLUSIV"],
                  ["📈 Istoric prețuri + trend", "✗","✗","✗","✗","✗","EXCLUSIV"],
                ].map(([feat, ...vals], i) => (
                  <tr key={i} className="border-b border-subtle bg-teal-dim/10">
                    <td className="p-2.5 font-semibold">{feat}</td>
                    {vals.map((v, j) => (
                      <td key={j} className={`p-2.5 text-center font-bold ${v === "EXCLUSIV" ? "text-info-blue text-[10px] md:text-[11px] tracking-wider uppercase" : v === "✗" ? "text-danger" : "text-gold"}`}>{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </NumberedSection>

        {/* 08 PRICING */}
        <NumberedSection num="08" title="Modelul de Venituri & Prețuri">
          <h3 className="text-base font-semibold mb-4 border-l-4 border-info pl-3">🏢 Planuri B2B — Agenții Imobiliare</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[
              { name: "Starter", price: "39€", per: "/agent/lună", featured: false, items: ["Până la 3 agenți", "Proprietăți nelimitate", "Publicare OLX + Storia + Imobiliare.ro", "CRM clienți de bază", "Calendar vizionări", "1 template site inclus"] },
              { name: "Professional", price: "29€", per: "/agent/lună (min 5)", featured: true, items: ["Tot ce include Starter", "Matching AI cerere-ofertă", "Contracte digitale + semnătură", "Reminder WhatsApp automat", "Dashboard analytics manager", "3 template-uri site"] },
              { name: "Enterprise", price: "19€", per: "/agent/lună (min 20)", featured: false, items: ["Tot ce include Professional", "Modul MLS inter-agenții", "Licitații open house", "Facturare SmartBill / Oblio", "Ansambluri rezidențiale", "White-label complet"] },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`border rounded-xl p-5 md:p-6 text-center ${plan.featured ? "border-info shadow-[0_0_0_3px_rgba(14,165,233,0.12)]" : "border-subtle"}`}
              >
                <h3 className="text-[15px] font-bold mb-2">{plan.name}</h3>
                <div className="text-3xl md:text-4xl font-bold text-info-blue leading-none">{plan.price}</div>
                <div className="text-xs text-dim2 mt-1 mb-4">{plan.per}</div>
                <ul className="text-left space-y-1">
                  {plan.items.map((item) => (
                    <li key={item} className="text-xs text-dim pl-4 relative before:content-['✓'] before:absolute before:left-0 before:text-teal before:font-bold">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <h3 className="text-base font-semibold mb-4 border-l-4 border-teal pl-3">👤 Planuri B2C — Utilizatorul Final</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: "Gratuit", price: "0", per: "RON/lună", items: ["3 alerte proprietăți noi/zi", "Filtrare particulari vs. agenții", "Evaluare preț de bază"] },
              { name: "PropDirect", price: "29", per: "RON/lună", featured: true, items: ["Alerte nelimitate instant push", "Bot AI conversațional complet", "Contact direct proprietar", "Detector agenți mascați", "Checklist tranzacție directă", "Simulare credit bancar"] },
              { name: "PropDirect+", price: "49", per: "RON/lună", items: ["Tot ce include PropDirect", "Verificare carte funciară ANCPI", "Raport complet zonă & istoric", 'Alertă prioritară "first to know"', "Suport dedicat WhatsApp", "Garanție returnare 30 zile"] },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`border rounded-xl p-5 md:p-6 text-center ${(plan as any).featured ? "border-teal shadow-[0_0_0_3px_rgba(16,185,129,0.12)]" : "border-subtle"}`}
              >
                <h3 className="text-[15px] font-bold mb-2">{plan.name}</h3>
                <div className="text-3xl md:text-4xl font-bold text-teal leading-none">{plan.price}</div>
                <div className="text-xs text-dim2 mt-1 mb-4">{plan.per}</div>
                <ul className="text-left space-y-1">
                  {plan.items.map((item) => (
                    <li key={item} className="text-xs text-dim pl-4 relative before:content-['✓'] before:absolute before:left-0 before:text-teal before:font-bold">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </NumberedSection>

        {/* 10 ROADMAP */}
        <NumberedSection num="10" title="Roadmap de Dezvoltare (12 Luni)">
          <div className="space-y-4">
            {[
              { q: "Luna 1–3", title: "MVP & Lansare Beta", color: "border-info", items: ["Core CRM: proprietăți, clienți, pipeline", "Publicare OLX + Storia API", "Landing page B2C cu lista de așteptare", "Beta testing cu 5 agenții pilot"] },
              { q: "Luna 4–6", title: "Expansiune & Bot AI", color: "border-teal", items: ["Bot AI conversațional v1 pentru B2C", "Matching AI cerere-ofertă B2B", "Contracte digitale cu semnătură", "Integrare Imobiliare.ro + Publi24", "Mobile app (React Native)"] },
              { q: "Luna 7–9", title: "Monetizare & Scale", color: "border-gold", items: ["Lansare publică B2C cu plată", "Dashboard analytics avansat", "MLS inter-agenții", "Facturare automată SmartBill", "Target: 50 agenții B2B + 1.000 useri B2C"] },
              { q: "Luna 10–12", title: "Enterprise & Expansiune", color: "border-purple", items: ["White-label enterprise", "Ansambluri rezidențiale modul", "Expansiune Bulgaria / Ungaria", "Seria Seed: target 300K–500K€", "Target: 150 agenții + 5.000 useri B2C"] },
            ].map((phase) => (
              <div key={phase.q} className={`border-l-4 ${phase.color} pl-4 md:pl-6 py-3 md:py-4`}>
                <div className="text-[11px] text-dim2 tracking-wider uppercase mb-1">{phase.q}</div>
                <h3 className="text-base font-bold mb-2">{phase.title}</h3>
                <ul className="space-y-1">
                  {phase.items.map((item) => (
                    <li key={item} className="text-xs text-dim pl-4 relative before:content-['→'] before:absolute before:left-0 before:text-dim2">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </NumberedSection>

        {/* 12 SWOT */}
        <NumberedSection num="12" title="Analiza SWOT">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: "💪 Strengths", color: "border-t-teal", items: ["First-mover pe segmentul B2C anti-comision", "Dual-sided platform cu efect de rețea", "Bot AI unic pe piața românească", "Echipă cu experiență în imobiliare + tech"] },
              { title: "⚠️ Weaknesses", color: "border-t-gold", items: ["Startup fără brand recognition", "Dependență de API-uri terțe (OLX, Storia)", "Resurse limitate în faza inițială", "Necesită educarea pieței B2C"] },
              { title: "🚀 Opportunities", color: "border-t-info", items: ["Piață de 8.000 agenții nedeservite corespunzător", "Trend global anti-intermediar", "Digitalizare accelerată post-COVID", "Expansiune regională (Bulgaria, Ungaria)"] },
              { title: "🛡️ Threats", color: "border-t-danger", items: ["Reacția industriei imobiliare la modulul B2C", "Schimbări în API-urile portalurilor", "Competitori existenți pot copia features", "Reglementări legislative noi"] },
            ].map((quad) => (
              <div key={quad.title} className={`border border-subtle ${quad.color} border-t-4 rounded-xl p-4 md:p-5`}>
                <h3 className="text-sm font-bold mb-3">{quad.title}</h3>
                <ul className="space-y-1.5">
                  {quad.items.map((item) => (
                    <li key={item} className="text-xs text-dim pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-dim2">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </NumberedSection>

        {/* 14 CONCLUZII */}
        <NumberedSection num="14" title="Concluzii Strategice">
          <div className="bg-gradient-to-br from-[#0f2027] to-[#0c4a6e] rounded-xl p-6 md:p-8 text-center">
            <div className="font-serif text-2xl md:text-3xl font-bold mb-4">
              Society<span className="text-[#38bdf8]">HUB</span> = Viitorul Imobiliarelor
            </div>
            <p className="text-sm text-[#94a3b8] max-w-[600px] mx-auto leading-relaxed mb-6">
              Prima platformă din România care servește simultan ambele laturi ale pieței imobiliare. CRM profesional pentru agenți + Bot AI anti-comision pentru utilizatorul final. Două produse, o singură platformă, un singur brand.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {[
                { val: "~200K€", label: "Venit estimat An 1" },
                { val: "8.000+", label: "Agenții potențiale" },
                { val: "500K+", label: "Tranzacții/an în RO" },
              ].map((s) => (
                <div key={s.label} className="bg-[rgba(56,189,248,0.1)] rounded-lg p-4">
                  <div className="text-xl md:text-2xl font-bold text-[#38bdf8]">{s.val}</div>
                  <div className="text-[11px] text-[#94a3b8] mt-1">{s.label}</div>
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-2.5 bg-gold text-primary-foreground font-semibold rounded-lg text-sm hover:bg-gold/90 transition-colors"
            >
              ← Explorează Dashboard-ul
            </button>
          </div>
        </NumberedSection>

        {/* Footer */}
        <div className="text-center py-8 border-t border-subtle mt-10">
          <div className="font-serif text-xl tracking-tight">
            Society<span className="text-gold">HUB</span>
          </div>
          <p className="text-[11px] text-dim2 mt-1">CRM Imobiliar Pro · Plan de Afaceri v1.0 · Martie 2026</p>
          <p className="text-[10px] text-dim2 mt-0.5">Document confidențial — Toate drepturile rezervate</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

/* ── Helper components ── */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-surface border border-subtle rounded-xl p-5 md:p-6 mb-6">
      <h2 className="text-lg font-bold mb-4">{title}</h2>
      {children}
    </div>
  );
}

function NumberedSection({ num, title, children }: { num: string; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-surface border border-subtle rounded-xl p-5 md:p-8 mb-6">
      <div className="flex items-center gap-3 mb-5">
        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-dim text-info-blue">{num}</span>
        <h2 className="text-lg font-bold">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function BulletList({ items, variant }: { items: string[]; variant?: "red" }) {
  const bulletColor = variant === "red" ? "before:text-danger" : "before:text-teal";
  return (
    <ul className="space-y-1.5">
      {items.map((item) => (
        <li key={item} className={`text-xs text-dim pl-4 relative before:content-['✓'] before:absolute before:left-0 before:font-bold ${bulletColor}`}>
          {item}
        </li>
      ))}
    </ul>
  );
}

function HighlightBox({ title, text, tag }: { title: string; text: string; tag?: string }) {
  return (
    <div className="bg-gradient-to-r from-[rgba(56,189,248,0.08)] to-transparent border border-[rgba(56,189,248,0.2)] rounded-xl p-4 md:p-5 mt-4">
      <h3 className="text-sm font-bold mb-2">{title}</h3>
      <p className="text-xs text-dim leading-relaxed">{text}</p>
      {tag && <span className="inline-block mt-2 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-dim text-info-blue">{tag}</span>}
    </div>
  );
}

function WarningBox({ title, text }: { title: string; text: string }) {
  return (
    <div className="bg-gradient-to-r from-[rgba(251,191,36,0.08)] to-transparent border border-[rgba(251,191,36,0.2)] rounded-xl p-4 md:p-5 mt-4">
      <h3 className="text-sm font-bold mb-2">{title}</h3>
      <p className="text-xs text-dim leading-relaxed">{text}</p>
    </div>
  );
}

export default BusinessPlan;
