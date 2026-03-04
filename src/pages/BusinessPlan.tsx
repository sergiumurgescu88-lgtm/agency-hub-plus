import { DashboardLayout } from "@/components/DashboardLayout";
import { useNavigate } from "react-router-dom";

const BusinessPlan = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      {/* Topbar */}
      <div className="bg-surface border-b border-subtle px-7 h-[58px] flex items-center gap-4 sticky top-0 z-40">
        <button onClick={() => navigate("/")} className="text-dim hover:text-gold transition-colors bg-transparent border-none cursor-pointer text-sm">
          ← Înapoi la Dashboard
        </button>
        <div className="flex-1">
          <span className="font-serif text-xl">Plan de Afaceri</span>
          <span className="text-dim2 text-sm ml-2.5 font-sans">SocietyHUB · Versiunea 1.0</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto py-10 px-6">
        {/* Cover */}
        <div className="bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] rounded-2xl p-16 text-center mb-10">
          <div className="font-serif text-[52px] font-bold tracking-tight mb-1">
            Society<span className="text-[#38bdf8]">HUB</span>
          </div>
          <div className="text-[19px] text-[#7dd3fc] font-light mb-2.5">
            CRM Imobiliar Dual — Agenții & Utilizatorul Final Anti-Comision
          </div>
          <p className="text-sm text-[#94a3b8] max-w-[580px] mx-auto leading-relaxed mb-6">
            Platforma care vinde servicii complete agenților imobiliare și, în același timp, oferă utilizatorului final care vrea să „sară agențiile" un bot AI direct conectat la proprietari — prin API OLX & Storia.
          </p>
          <div className="flex justify-center gap-3 flex-wrap mb-7">
            {[
              { text: "🚀 Inovație Radicală", gold: true },
              { text: "🤖 Bot AI Anti-Comision", gold: false },
              { text: "🏢 CRM Complet B2B", gold: false },
              { text: "👤 Platformă B2C Unică", gold: false },
              { text: "🇷🇴 First-Mover România", gold: true },
            ].map((b) => (
              <span
                key={b.text}
                className={`px-[18px] py-1.5 rounded-full text-[13px] border ${
                  b.gold
                    ? "bg-[rgba(251,191,36,0.15)] border-[rgba(251,191,36,0.3)] text-[#fbbf24]"
                    : "bg-[rgba(56,189,248,0.15)] border-[rgba(56,189,248,0.3)] text-[#7dd3fc]"
                }`}
              >
                {b.text}
              </span>
            ))}
          </div>
          <div className="text-xs text-[#475569]">Plan de Afaceri Complet · Versiunea 1.0 · Martie 2026 · Confidențial</div>
        </div>

        {/* TOC */}
        <Section title="📋 Cuprins">
          <div className="grid grid-cols-2 gap-x-10 gap-y-1">
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
          <div className="grid grid-cols-2 gap-6 mb-6">
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
          <div className="grid grid-cols-4 gap-3 mt-4">
            {[
              { label: "Piață Adresabilă", val: "~8.000", sub: "agenții imobiliare RO" },
              { label: "Utilizatori B2C Potențiali", val: "500K+", sub: "tranzacții/an în RO" },
              { label: "Comision Mediu Evitat", val: "2.000€", sub: "per tranzacție la 2%" },
              { label: "Target Venit An 1", val: "~200K€", sub: "B2B + B2C combinate" },
            ].map((f) => (
              <div key={f.label} className="bg-gradient-to-br from-[#0f2027] to-[#0c4a6e] rounded-xl p-5 text-center">
                <div className="text-[11px] text-[#94a3b8] tracking-wider uppercase mb-1.5">{f.label}</div>
                <div className="text-2xl font-bold text-[#38bdf8]">{f.val}</div>
                <div className="text-[11px] text-[#475569] mt-1">{f.sub}</div>
              </div>
            ))}
          </div>
        </NumberedSection>

        {/* 02 PROBLEMA */}
        <NumberedSection num="02" title="Problema pe care o Rezolvăm">
          <div className="grid grid-cols-2 gap-6">
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
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="border border-subtle rounded-xl p-5 border-t-4 border-t-info">
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
            <div className="border border-subtle rounded-xl p-5 border-t-4 border-t-teal">
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

        {/* 04-14 in abbreviated form for key sections */}

        {/* 05 FEATURE MATRIX */}
        <NumberedSection num="05" title="Feature Matrix — SocietyHUB vs. Toți Competitorii">
          <div className="overflow-x-auto">
            <table className="w-full text-[13px] border-collapse">
              <thead>
                <tr>
                  <th className="bg-[#0f2027] text-foreground p-3 text-left min-w-[220px] rounded-tl-lg">Funcționalitate</th>
                  {["REBS", "Zarina", "Softimob.", "ImmoFlux", "Argus.me"].map((h) => (
                    <th key={h} className="bg-[#0f2027] text-foreground p-3 text-center">{h}</th>
                  ))}
                  <th className="bg-info text-foreground p-3 text-center rounded-tr-lg font-bold">SocietyHUB</th>
                </tr>
              </thead>
              <tbody>
                <tr><td colSpan={7} className="text-[11px] tracking-widest uppercase text-dim2 p-2.5 bg-surface2">— Funcții Standard CRM —</td></tr>
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
                <tr><td colSpan={7} className="text-[11px] tracking-widest uppercase text-teal p-2.5 bg-teal-dim/30 font-bold">— EXCLUSIV SocietyHUB —</td></tr>
                {[
                  ["🤖 Bot AI conversațional (în română)", "✗","✗","✗","✗","✗","EXCLUSIV"],
                  ["👤 Modul User Final B2C anti-comision", "✗","✗","✗","✗","✗","EXCLUSIV"],
                  ["🔔 Alerte push instant pe mobil", "✗","✗","✗","✗","~","EXCLUSIV"],
                  ["💰 Evaluare preț AI automată (AVM)", "✗","✗","✗","✗","✗","EXCLUSIV"],
                  ["🛡️ Detectare agenți mascați", "✗","✗","✗","✗","~","EXCLUSIV"],
                  ["📋 Ghid juridic tranzacție directă", "✗","✗","✗","✗","✗","EXCLUSIV"],
                  ["🏦 Simulare credit bancar în timp real", "✗","✗","✗","✗","✗","EXCLUSIV"],
                  ["📈 Istoric prețuri + trend zonă", "✗","✗","✗","✗","✗","EXCLUSIV"],
                ].map(([feat, ...vals], i) => (
                  <tr key={i} className="border-b border-subtle bg-teal-dim/10">
                    <td className="p-2.5 font-semibold">{feat}</td>
                    {vals.map((v, j) => (
                      <td key={j} className={`p-2.5 text-center font-bold ${v === "EXCLUSIV" ? "text-info-blue text-[11px] tracking-wider uppercase" : v === "✗" ? "text-danger" : "text-gold"}`}>{v}</td>
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
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { name: "Starter", price: "39€", per: "/agent/lună", featured: false, items: ["Până la 3 agenți", "Proprietăți nelimitate", "Publicare OLX + Storia + Imobiliare.ro", "CRM clienți de bază", "Calendar vizionări", "1 template site inclus"] },
              { name: "Professional", price: "29€", per: "/agent/lună (min 5)", featured: true, items: ["Tot ce include Starter", "Matching AI cerere-ofertă", "Contracte digitale + semnătură", "Reminder WhatsApp automat", "Dashboard analytics manager", "3 template-uri site"] },
              { name: "Enterprise", price: "19€", per: "/agent/lună (min 20)", featured: false, items: ["Tot ce include Professional", "Modul MLS inter-agenții", "Licitații open house", "Facturare SmartBill / Oblio", "Ansambluri rezidențiale", "White-label complet"] },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`border rounded-xl p-6 text-center ${plan.featured ? "border-info shadow-[0_0_0_3px_rgba(14,165,233,0.12)]" : "border-subtle"}`}
              >
                <h3 className="text-[15px] font-bold mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold text-info-blue leading-none">{plan.price}</div>
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
          <div className="grid grid-cols-3 gap-4">
            {[
              { name: "Gratuit", price: "0", per: "RON/lună", items: ["3 alerte proprietăți noi/zi", "Filtrare particulari vs. agenții", "Evaluare preț de bază"] },
              { name: "PropDirect", price: "29", per: "RON/lună", featured: true, items: ["Alerte nelimitate instant push", "Bot AI conversațional complet", "Contact direct proprietar", "Detector agenți mascați", "Checklist tranzacție directă", "Simulare credit bancar"] },
              { name: "Premium", price: "79", per: "RON/lună", items: ["Tot ce include PropDirect", "Due diligence ANCPI automat", "Raport complet proprietate", "Consultanță AI negociere preț", "Istoric prețuri + trend zonă 3 ani", "Verificare ipoteci + sarcini CF"] },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`border rounded-xl p-6 text-center ${plan.featured ? "border-teal shadow-[0_0_0_3px_rgba(14,207,176,0.12)]" : "border-subtle"}`}
              >
                <h3 className="text-[15px] font-bold mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold text-info-blue leading-none">{plan.price}</div>
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

          {/* ROI Strip */}
          <div className="bg-gradient-to-br from-[#0f2027] to-[#0c4a6e] rounded-xl p-7 mt-5">
            <h4 className="text-base text-[#7dd3fc] mb-4">💡 Argumentul ROI irezistibil pentru utilizatorul B2C</h4>
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: "Preț mediu apartament", val: "100K€", sub: "2 camere periferie" },
                { label: "Comision agenție evitat", val: "2.000€", sub: "la 2% din preț" },
                { label: "Cost abonament anual", val: "70€", sub: "~348 RON/an" },
                { label: "ROI utilizator", val: "2.757%", sub: "dintr-o singură tranzacție" },
              ].map((r) => (
                <div key={r.label} className="text-center">
                  <div className="text-[10px] text-[#94a3b8] tracking-wider uppercase mb-1">{r.label}</div>
                  <div className="text-2xl font-bold text-[#fbbf24]">{r.val}</div>
                  <div className="text-[11px] text-[#64748b]">{r.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </NumberedSection>

        {/* 09 PROIECTII */}
        <NumberedSection num="09" title="Proiecții Financiare">
          <h3 className="text-base font-semibold mb-3 border-l-4 border-info pl-3">Scenariul Conservator — An 1</h3>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-[13px] border-collapse">
              <thead>
                <tr>
                  {["Segment", "Volum țintă", "ARPU lunar", "Venit lunar", "Venit anual"].map((h) => (
                    <th key={h} className="bg-[#0f2027] text-foreground p-3 text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["B2B — Agenții Starter", "50 agenții × 2 agenți", "39€/agent", "3.900€", "46.800€"],
                  ["B2B — Agenții Professional", "30 agenții × 8 agenți", "29€/agent", "6.960€", "83.520€"],
                  ["B2C — PropDirect", "2.000 utilizatori", "~6€", "12.000€", "144.000€"],
                  ["B2C — Premium", "300 utilizatori", "~16€", "4.800€", "57.600€"],
                ].map((row, i) => (
                  <tr key={i} className="border-b border-subtle hover:bg-surface2/50">
                    {row.map((cell, j) => (
                      <td key={j} className={`p-2.5 ${j === 0 ? "font-semibold" : ""}`}>{cell}</td>
                    ))}
                  </tr>
                ))}
                <tr className="bg-teal-dim/20 font-bold">
                  <td className="p-2.5">TOTAL VENITURI AN 1</td>
                  <td className="p-2.5" colSpan={2}></td>
                  <td className="p-2.5 text-teal">~27.660€</td>
                  <td className="p-2.5 text-teal">~331.920€</td>
                </tr>
              </tbody>
            </table>
          </div>
        </NumberedSection>

        {/* 10 ROADMAP */}
        <NumberedSection num="10" title="Roadmap de Dezvoltare — 12 Luni">
          {[
            { phase: "1", color: "bg-info", timeline: "Luna 1–3 · MVP", title: "Fundația + Botul AI Minimal", tags: ["⭐ Bot AI conectat OLX + Storia", "⭐ Filtrare particular vs. agenție mascată", "CRM agenții de bază", "App web responsive", "10 agenții beta-testeri"] },
            { phase: "2", color: "bg-gold", timeline: "Luna 4–6 · Core Product", title: "Diferențiatorii Cheie — Lansare Oficială", tags: ["⭐ Alerte push instant pe mobil", "⭐ Evaluare preț AI (AVM)", "Matching AI avansat cu scor", "Contracte digitale + semnătură", "Lansare publică"] },
            { phase: "3", color: "bg-teal", timeline: "Luna 7–9 · Growth", title: "Extensii de Valoare + Creștere", tags: ["⭐ Simulare credit ING / BT / BCR", "⭐ Ghid tranzacție directă", "Modul MLS", "Facturare SmartBill / Oblio"] },
            { phase: "4", color: "bg-purple", timeline: "Luna 10–12 · Scale", title: "Extindere & Enterprise", tags: ["⭐ Ansambluri rezidențiale", "⭐ Due diligence ANCPI", "API public", "Pilot Bulgaria / Moldova"] },
          ].map((r) => (
            <div key={r.phase} className="flex gap-5 py-[18px] border-b border-subtle last:border-b-0 items-start">
              <div className={`w-[46px] h-[46px] rounded-full ${r.color} flex items-center justify-center font-bold text-[17px] text-primary-foreground flex-shrink-0`}>
                {r.phase}
              </div>
              <div>
                <div className="text-[11px] text-info-blue font-semibold tracking-wider uppercase mb-1.5">{r.timeline}</div>
                <h4 className="text-[15px] font-bold mb-2">{r.title}</h4>
                <div className="flex flex-wrap gap-1.5">
                  {r.tags.map((t) => (
                    <span key={t} className={`text-xs px-2.5 py-[3px] rounded-md ${t.startsWith("⭐") ? "bg-blue-dim text-info-blue font-semibold" : "bg-surface2 text-dim"}`}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </NumberedSection>

        {/* 12 SWOT */}
        <NumberedSection num="12" title="Analiza SWOT">
          <div className="grid grid-cols-2 gap-0.5">
            {[
              { type: "s", title: "💪 STRENGTHS", color: "text-teal", bg: "bg-teal-dim/30", items: ["Unicul produs B2C anti-comision din România", "Bot AI conversațional în română — inexistent la competiție", "Model dual B2B + B2C cu efect de rețea", "ROI extrem de clar (2.757% la o tranzacție)"] },
              { type: "w", title: "⚠️ WEAKNESSES", color: "text-danger", bg: "bg-red-dim/30", items: ["Produs nou fără tracțiune inițială", "Dependență critică de API-ul OLX", "Necesită educarea pieței B2C", "Ciclu lung de vânzare B2B (30–90 zile)"] },
              { type: "o", title: "🚀 OPPORTUNITIES", color: "text-info-blue", bg: "bg-blue-dim/30", items: ["Segment B2C complet neocupat", "Trendul de dezintermediere crește", "Gen Z / Millennials preferă digital-first", "Expansiune Bulgaria / Moldova"] },
              { type: "t", title: "🔴 THREATS", color: "text-gold", bg: "bg-gold-dim/30", items: ["Argus.me poate adăuga chatbot AI rapid", "OLX poate restricționa API-ul", "Jucător internațional poate intra agresiv", "Rezistența organizată a agențiilor"] },
            ].map((s) => (
              <div key={s.type} className={`p-5 ${s.bg}`}>
                <h4 className={`text-sm font-bold mb-3 ${s.color}`}>{s.title}</h4>
                <ul className="space-y-1">
                  {s.items.map((item) => (
                    <li key={item} className="text-[13px] text-dim pl-4 relative">
                      <span className={`absolute left-0 font-bold ${s.color}`}>•</span>
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
          <HighlightBox
            title="🏆 Concluzia principală"
            text="SocietyHUB are o oportunitate de piață reală, confirmată de cercetare, cu un gap competitiv clar și neocupat. Fereastra de first-mover în segmentul B2C anti-comision este deschisă acum, dar nu va rămâne deschisă la nesfârșit."
            tag="✓ Oportunitate validată"
          />
          <h3 className="text-base font-semibold mb-3 mt-6 border-l-4 border-gold pl-3">Cele 5 priorități imediate</h3>
          <BulletList variant="star" items={[
            "Prioritatea 1 — Înregistrare și acord API OLX",
            "Prioritatea 2 — MVP în 90 de zile: bot AI + alerte + CRM de bază",
            "Prioritatea 3 — Validare cu 10 agenții + 50 utilizatori B2C",
            "Prioritatea 4 — Consultanță juridică legată de statutul platformei",
            "Prioritatea 5 — Recrutarea echipei tehnice (2 fullstack + 1 AI/ML)",
          ]} />
        </NumberedSection>

        {/* Footer */}
        <div className="bg-[#0f2027] rounded-xl text-center py-8 mt-10 text-xs text-[#475569]">
          <strong className="text-[#38bdf8]">SocietyHUB</strong> · Plan de Afaceri Confidențial · Versiunea 1.0 · Martie 2026
          <br />Toate datele sunt estimări bazate pe cercetare de piață publică și nu constituie garanții comerciale.
        </div>
      </div>
    </DashboardLayout>
  );
};

// Helper Components
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-surface border border-subtle rounded-xl p-8 mb-8">
      <h2 className="text-xl font-bold mb-5 border-b-2 border-info pb-2.5">{title}</h2>
      {children}
    </div>
  );
}

function NumberedSection({ num, title, children }: { num: string; title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <div className="bg-gradient-to-r from-info to-[#0284c7] text-foreground py-[18px] px-7 rounded-t-xl text-[21px] font-bold">
        <span className="opacity-65 mr-2.5 text-lg">{num}</span> {title}
      </div>
      <div className="bg-surface p-8 rounded-b-xl border border-t-0 border-subtle">
        {children}
      </div>
    </div>
  );
}

function BulletList({ items, variant = "check" }: { items: string[]; variant?: "check" | "red" | "star" }) {
  const icon = variant === "check" ? "✓" : variant === "red" ? "✗" : "★";
  const color = variant === "check" ? "text-teal" : variant === "red" ? "text-danger" : "text-gold";
  return (
    <ul className="space-y-0.5">
      {items.map((item) => (
        <li key={item} className={`text-sm text-dim py-1.5 pl-[22px] relative border-b border-subtle/50 last:border-b-0`}>
          <span className={`absolute left-0 font-bold ${color}`}>{icon}</span>
          <span dangerouslySetInnerHTML={{ __html: item }} />
        </li>
      ))}
    </ul>
  );
}

function HighlightBox({ title, text, tag }: { title: string; text: string; tag?: string }) {
  return (
    <div className="bg-gradient-to-br from-teal-dim/40 to-teal-dim/20 border border-teal/30 rounded-xl p-5 my-4">
      <h4 className="text-[15px] font-bold text-teal mb-1.5">{title}</h4>
      <p className="text-[13px] text-teal/80">{text}</p>
      {tag && <span className="inline-block bg-teal text-primary-foreground text-[11px] px-2.5 py-0.5 rounded-full mt-2 font-semibold">{tag}</span>}
    </div>
  );
}

function WarningBox({ title, text }: { title: string; text: string }) {
  return (
    <div className="bg-gold-dim/30 border border-gold/30 rounded-xl p-5 my-4">
      <h4 className="text-sm font-bold text-gold mb-1.5">{title}</h4>
      <p className="text-[13px] text-gold/80">{text}</p>
    </div>
  );
}

export default BusinessPlan;
