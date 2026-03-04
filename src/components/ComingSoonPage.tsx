import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "./DashboardLayout";
import comingSoonHero from "@/assets/coming-soon-hero.png";

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface ComingSoonPageProps {
  title: string;
  subtitle: string;
  icon: string;
  accentColor?: "gold" | "teal" | "blue" | "purple" | "red";
  features: Feature[];
}

const accentMap = {
  gold: { text: "text-gold", bg: "bg-gold-dim", border: "border-gold/20", gradient: "from-gold/20 to-transparent" },
  teal: { text: "text-teal", bg: "bg-teal-dim", border: "border-teal/20", gradient: "from-teal/20 to-transparent" },
  blue: { text: "text-info-blue", bg: "bg-blue-dim", border: "border-blue/20", gradient: "from-blue/20 to-transparent" },
  purple: { text: "text-purple", bg: "bg-purple-dim", border: "border-purple/20", gradient: "from-purple/20 to-transparent" },
  red: { text: "text-danger", bg: "bg-red-dim", border: "border-red/20", gradient: "from-red/20 to-transparent" },
};

export default function ComingSoonPage({ title, subtitle, icon, accentColor = "gold", features }: ComingSoonPageProps) {
  const navigate = useNavigate();
  const accent = accentMap[accentColor];

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6 md:space-y-8 animate-fade-up p-4 md:p-0">
        {/* Hero */}
        <div className="relative rounded-2xl overflow-hidden border border-subtle bg-surface">
          <div className={`absolute inset-0 bg-gradient-to-br ${accent.gradient} opacity-40`} />
          <div className="relative flex flex-col md:flex-row items-center gap-4 md:gap-6 p-6 md:p-12">
            <div className="flex-1 space-y-3 md:space-y-4">
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${accent.bg} ${accent.text} border ${accent.border}`}>
                <span>ÎN DEZVOLTARE</span>
              </div>
              <h1 className="text-2xl md:text-4xl font-bold text-foreground">
                <span className="text-3xl md:text-4xl mr-2 md:mr-3">{icon}</span>
                {title}
              </h1>
              <p className="text-dim text-sm md:text-base leading-relaxed max-w-md">{subtitle}</p>
              <div className="flex flex-col sm:flex-row gap-2 md:gap-3 pt-2">
                <button
                  onClick={() => navigate("/")}
                  className="px-5 py-2.5 bg-gold text-primary-foreground font-semibold rounded-lg text-sm hover:bg-gold/90 transition-colors"
                >
                  ← Înapoi la Dashboard
                </button>
                <button
                  onClick={() => navigate("/business-plan")}
                  className="px-5 py-2.5 bg-surface2 text-foreground font-semibold rounded-lg text-sm border border-subtle hover:bg-surface2/80 transition-colors"
                >
                  Vezi Planul
                </button>
              </div>
            </div>
            <div className="w-36 md:w-64 flex-shrink-0">
              <img src={comingSoonHero} alt="SocietyHUB" className="w-full rounded-xl opacity-90" />
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Ce va include acest modul</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {features.map((f, i) => (
              <div
                key={i}
                className={`p-4 md:p-5 rounded-xl bg-surface border border-subtle hover:border-subtle2 transition-all animate-fade-up`}
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl md:text-2xl flex-shrink-0">{f.icon}</span>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-1">{f.title}</h3>
                    <p className="text-xs text-dim leading-relaxed">{f.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Brand Footer */}
        <div className="text-center py-6 border-t border-subtle">
          <div className="font-serif text-xl tracking-tight">
            Society<span className="text-gold">HUB</span>
          </div>
          <p className="text-[11px] text-dim2 mt-1">CRM Imobiliar Pro · Toate modulele vor fi disponibile în curând</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
