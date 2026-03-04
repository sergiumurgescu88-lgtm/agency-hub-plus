import ComingSoonPage from "@/components/ComingSoonPage";

export default function Pipeline() {
  return (
    <ComingSoonPage
      title="Pipeline Tranzacții"
      subtitle="Vizualizare Kanban completă a tranzacțiilor în curs, de la lead nou până la contract semnat."
      icon="📋"
      accentColor="blue"
      features={[
        { icon: "📊", title: "Board Kanban", description: "Drag & drop între etape: Lead → Vizionare → Negociere → Ofertă → Contract → Finalizat." },
        { icon: "⏱️", title: "Timere & Deadline-uri", description: "Alerte pentru tranzacții blocate și deadline-uri de contract depășite." },
        { icon: "💰", title: "Proiecție Comisioane", description: "Calcul automat al comisioanelor estimate pe baza valorilor din pipeline." },
        { icon: "📈", title: "Rapoarte Pipeline", description: "Rată de conversie per etapă, timp mediu în fiecare fază și predicții closing." },
      ]}
    />
  );
}
