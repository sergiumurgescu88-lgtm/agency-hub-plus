import ComingSoonPage from "@/components/ComingSoonPage";

export default function Contracte() {
  return (
    <ComingSoonPage
      title="Contracte"
      subtitle="Generează, semnează și arhivează contracte digitale – de intermediere, pre-contracte și acte adiționale."
      icon="📝"
      accentColor="gold"
      features={[
        { icon: "📄", title: "Template-uri Contract", description: "Modele pre-definite pentru exclusivitate, intermediere, pre-contract și cesiune." },
        { icon: "✍️", title: "Semnătură Electronică", description: "Semnare digitală validă juridic, cu timestamp și verificare identitate." },
        { icon: "📁", title: "Arhivă Digitală", description: "Toate contractele organizate pe tranzacții, cu versioning și backup cloud." },
        { icon: "🔔", title: "Alerte Expirare", description: "Notificări automate pentru contracte care expiră sau au termene limită." },
      ]}
    />
  );
}
