import ComingSoonPage from "@/components/ComingSoonPage";

export default function Analytics() {
  return (
    <ComingSoonPage
      title="Analytics"
      subtitle="Rapoarte detaliate și insight-uri despre performanța agenției, agenților și a pieței imobiliare."
      icon="📊"
      accentColor="purple"
      features={[
        { icon: "📈", title: "Grafice Interactive", description: "Vizualizări de date cu filtre pe perioadă, agent, zonă și tip proprietate." },
        { icon: "🏆", title: "Leaderboard Agenți", description: "Clasament în timp real pe comisioane, tranzacții finalizate și satisfacție clienți." },
        { icon: "🗺️", title: "Heatmap Zone", description: "Hartă termică cu zonele cele mai active, prețuri medii și cerere/ofertă." },
        { icon: "📋", title: "Rapoarte Exportabile", description: "Export PDF și Excel pentru rapoarte lunare către management sau franciză." },
      ]}
    />
  );
}
