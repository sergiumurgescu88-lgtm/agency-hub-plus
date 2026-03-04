import ComingSoonPage from "@/components/ComingSoonPage";

export default function Matching() {
  return (
    <ComingSoonPage
      title="Matching AI"
      subtitle="Motor inteligent de potrivire între proprietăți și cerințele clienților, cu sugestii automate și scoring de compatibilitate."
      icon="🎯"
      accentColor="gold"
      features={[
        { icon: "🤖", title: "Algoritm AI de Potrivire", description: "Analiză multi-criteriu: locație, buget, suprafață, camere, facilități, stil de viață." },
        { icon: "📧", title: "Notificări Automate", description: "Trimite automat email/WhatsApp clienților când apare o proprietate potrivită." },
        { icon: "⭐", title: "Scor Compatibilitate", description: "Procentaj de potrivire vizual pentru fiecare recomandare, cu detalii pe criterii." },
        { icon: "📋", title: "Rapoarte Matching", description: "Statistici de eficiență: câte potriviri au condus la vizionări și tranzacții." },
      ]}
    />
  );
}
