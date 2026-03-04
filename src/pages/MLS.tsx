import ComingSoonPage from "@/components/ComingSoonPage";

export default function MLS() {
  return (
    <ComingSoonPage
      title="MLS Partener"
      subtitle="Colaborează cu alte agenții prin sistemul MLS – share proprietăți, split comisioane și extinde-ți portofoliul."
      icon="🤝"
      accentColor="teal"
      features={[
        { icon: "🔗", title: "Rețea de Agenții", description: "Conectare directă cu agenții partenere pentru share de portofoliu." },
        { icon: "📋", title: "Reguli de Colaborare", description: "Setează automat split-ul de comision și condițiile de co-broking." },
        { icon: "🔍", title: "Căutare MLS", description: "Accesează proprietăți de la parteneri direct din CRM-ul tău." },
        { icon: "📊", title: "Tracking Colaborări", description: "Monitorizare tranzacții comune, comisioane partajate și performanță parteneriat." },
      ]}
    />
  );
}
