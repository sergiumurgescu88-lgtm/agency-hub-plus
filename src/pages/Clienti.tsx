import ComingSoonPage from "@/components/ComingSoonPage";

export default function Clienti() {
  return (
    <ComingSoonPage
      title="Clienți & Leads"
      subtitle="Centralizează toți clienții și lead-urile într-o bază de date inteligentă cu scoring automat și segmentare avansată."
      icon="👥"
      accentColor="red"
      features={[
        { icon: "🎯", title: "Lead Scoring AI", description: "Algoritm de scoring automat bazat pe comportament, buget și urgență." },
        { icon: "📞", title: "Istoric Interacțiuni", description: "Toate apelurile, emailurile, WhatsApp-urile și vizionările într-un timeline cronologic." },
        { icon: "🏷️", title: "Segmentare Inteligentă", description: "Grupare automată pe criterii: cumpărător/vânzător, buget, zonă, tip proprietate." },
        { icon: "🔔", title: "Notificări & Follow-up", description: "Alerte automate pentru follow-up, aniversări și oportunități de re-contactare." },
      ]}
    />
  );
}
