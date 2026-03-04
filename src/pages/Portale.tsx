import ComingSoonPage from "@/components/ComingSoonPage";

export default function Portale() {
  return (
    <ComingSoonPage
      title="Portale Imobiliare"
      subtitle="Publică anunțuri simultan pe 8-10 platforme: OLX, Storia, Imobiliare.ro, Publi24 și altele, dintr-un singur click."
      icon="📤"
      accentColor="teal"
      features={[
        { icon: "🔄", title: "Sincronizare Automată", description: "Actualizare preț, descriere și poze pe toate portalele simultan." },
        { icon: "📊", title: "Statistici per Portal", description: "Vizualizări, contacte și performanță pentru fiecare platformă în parte." },
        { icon: "🎨", title: "Template-uri Anunțuri", description: "Descrieri optimizate SEO generate automat, adaptate pentru fiecare portal." },
        { icon: "⚡", title: "Publicare One-Click", description: "Selectează portalele, apasă un buton – anunțul e live pe toate platformele." },
      ]}
    />
  );
}
