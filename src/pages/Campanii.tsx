import ComingSoonPage from "@/components/ComingSoonPage";

export default function Campanii() {
  return (
    <ComingSoonPage
      title="Campanii WA/Email"
      subtitle="Trimite campanii targetate pe WhatsApp și Email către clienți segmentați, cu template-uri profesionale."
      icon="📱"
      accentColor="purple"
      features={[
        { icon: "💬", title: "WhatsApp Business API", description: "Mesaje automate, template-uri aprobate și tracking deschideri și răspunsuri." },
        { icon: "📧", title: "Email Marketing", description: "Newsletter-uri cu proprietăți noi, campanii drip și email-uri de follow-up." },
        { icon: "🎯", title: "Segmentare Audiență", description: "Trimite mesaje personalizate pe baza preferințelor și comportamentului clientului." },
        { icon: "📊", title: "Analytics Campanii", description: "Rate de deschidere, click-uri, răspunsuri și conversii per campanie." },
      ]}
    />
  );
}
