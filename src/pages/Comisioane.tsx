import ComingSoonPage from "@/components/ComingSoonPage";

export default function Comisioane() {
  return (
    <ComingSoonPage
      title="Comisioane"
      subtitle="Tracking complet al comisioanelor – calculate, facturate și încasate, cu split automat între agenți."
      icon="💰"
      accentColor="gold"
      features={[
        { icon: "🧮", title: "Calcul Automat", description: "Comisioane calculate pe baza valorii tranzacției, tipului de contract și split-ului." },
        { icon: "📊", title: "Dashboard Financiar", description: "Vizualizare comisioane lunare, trimestriale și anuale per agent și agenție." },
        { icon: "🧾", title: "Facturare Integrată", description: "Generare automată de facturi și proforma-uri pentru fiecare comision." },
        { icon: "💳", title: "Tracking Încasări", description: "Monitorizare plăți primite, restante și proiecții de cash-flow." },
      ]}
    />
  );
}
