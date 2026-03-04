import ComingSoonPage from "@/components/ComingSoonPage";

export default function Proprietati() {
  return (
    <ComingSoonPage
      title="Proprietăți"
      subtitle="Gestionează portofoliul complet de proprietăți – apartamente, case, terenuri și spații comerciale, totul într-un singur loc."
      icon="🏠"
      accentColor="teal"
      features={[
        { icon: "📸", title: "Galerie Foto & Video", description: "Upload masiv de imagini, tour virtual 360° și video walkthrough pentru fiecare proprietate." },
        { icon: "📍", title: "Localizare pe Hartă", description: "Integrare Google Maps cu zone de interes, facilități și scoruri de vecinătate." },
        { icon: "🏷️", title: "Categorii & Filtre", description: "Organizare pe tipuri, zone, prețuri, suprafețe și status (disponibil, rezervat, vândut)." },
        { icon: "📊", title: "Statistici Proprietate", description: "Vizualizări, interesați, timp pe piață și comparații de preț pentru fiecare listare." },
      ]}
    />
  );
}
