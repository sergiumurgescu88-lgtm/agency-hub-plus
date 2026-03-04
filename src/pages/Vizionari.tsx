import ComingSoonPage from "@/components/ComingSoonPage";

export default function Vizionari() {
  return (
    <ComingSoonPage
      title="Vizionări"
      subtitle="Programează, gestionează și urmărește toate vizionările – cu calendar integrat și feedback automat."
      icon="📅"
      accentColor="blue"
      features={[
        { icon: "📅", title: "Calendar Inteligent", description: "Programare vizionări cu evitare suprapuneri și rutare optimizată pe zone." },
        { icon: "📋", title: "Checklist Vizionare", description: "Liste de verificare pre și post vizionare pentru fiecare proprietate." },
        { icon: "⭐", title: "Feedback Instant", description: "Formular de feedback trimis automat clientului după vizionare." },
        { icon: "📊", title: "Rapoarte Vizionări", description: "Statistici: rata de conversie vizionare → ofertă, proprietăți cele mai vizionate." },
      ]}
    />
  );
}
