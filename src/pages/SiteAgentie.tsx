import ComingSoonPage from "@/components/ComingSoonPage";

export default function SiteAgentie() {
  return (
    <ComingSoonPage
      title="Site Agenție"
      subtitle="Website profesional generat automat cu listing-urile tale, pagini de agent și formulare de contact integrate."
      icon="🌐"
      accentColor="blue"
      features={[
        { icon: "🎨", title: "Template-uri Premium", description: "Design-uri profesionale responsive, personalizabile cu logo-ul și culorile agenției." },
        { icon: "🏠", title: "Listing-uri Live", description: "Proprietățile se sincronizează automat din CRM pe site-ul agenției." },
        { icon: "📱", title: "Mobile-First", description: "Design optimizat pentru mobil cu încărcare rapidă și SEO integrat." },
        { icon: "📝", title: "Formulare de Contact", description: "Lead-urile de pe site intră direct în CRM cu notificare instant." },
      ]}
    />
  );
}
