import ComingSoonPage from "@/components/ComingSoonPage";

export default function Setari() {
  return (
    <ComingSoonPage
      title="Setări Agenție"
      subtitle="Configurează agenția, agenții, permisiunile, integrările și preferințele sistemului."
      icon="⚙️"
      accentColor="blue"
      features={[
        { icon: "🏢", title: "Profil Agenție", description: "Logo, date fiscale, adresă, contact și informații de branding." },
        { icon: "👤", title: "Management Agenți", description: "Adaugă agenți, setează roluri, permisiuni și target-uri individuale." },
        { icon: "🔌", title: "Integrări", description: "Conectare cu portale imobiliare, email, WhatsApp, calendar și contabilitate." },
        { icon: "🎨", title: "Personalizare", description: "Teme de culori, template-uri email, câmpuri custom și workflow-uri automatizate." },
      ]}
    />
  );
}
