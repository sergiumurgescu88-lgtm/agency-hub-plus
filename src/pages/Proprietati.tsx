import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";

type PropertyStatus = "disponibil" | "rezervat" | "vandut";
type PropertyType = "Apartament" | "Casă" | "Teren" | "Spațiu Comercial" | "Garsonieră";

interface Property {
  id: number;
  type: PropertyType;
  status: PropertyStatus;
  title: string;
  address: string;
  price: number;
  area: number;
  rooms?: number;
  bathrooms?: number;
  floor?: string;
  extra?: { label: string; value: string }[];
  agent: { initials: string; name: string; color: string };
  views: number;
  interested: number;
  isNew?: boolean;
  isFavorite?: boolean;
  emoji: string;
  gradient: string;
}

const initialProperties: Property[] = [
  {
    id: 1, type: "Apartament", status: "disponibil",
    title: "Apartament 3 camere – Floreasca Residence",
    address: "Str. Floreasca 42, Sector 1, București",
    price: 185000, area: 78, rooms: 3, bathrooms: 2, floor: "Et. 5",
    agent: { initials: "AI", name: "Andrei I.", color: "from-primary to-amber-700" },
    views: 342, interested: 8, isNew: true, emoji: "🏢",
    gradient: "from-[hsl(220,30%,12%)] to-[hsl(220,25%,8%)]",
  },
  {
    id: 2, type: "Casă", status: "rezervat",
    title: "Vilă D+P+1 – Pipera Exclusive",
    address: "Aleea Privighetorilor 7, Pipera",
    price: 425000, area: 220, rooms: 5, bathrooms: 3, floor: "Parter",
    agent: { initials: "MC", name: "Maria C.", color: "from-blue-400 to-blue-600" },
    views: 567, interested: 14, emoji: "🏠",
    gradient: "from-[hsl(235,25%,12%)] to-[hsl(220,35%,14%)]",
  },
  {
    id: 3, type: "Teren", status: "disponibil",
    title: "Teren intravilan – zona Baneasa, front stradal",
    address: "Bd. Aerogării 15A, Baneasa",
    price: 68500, area: 450,
    extra: [{ label: "POT", value: "40%" }, { label: "CUT", value: "1.5" }],
    agent: { initials: "RP", name: "Radu P.", color: "from-green-400 to-green-600" },
    views: 189, interested: 3, emoji: "🏗️",
    gradient: "from-[hsl(190,30%,8%)] to-[hsl(185,25%,15%)]",
  },
  {
    id: 4, type: "Spațiu Comercial", status: "vandut",
    title: "Spațiu comercial parter – Dorobanți Center",
    address: "Calea Dorobanților 120, Sector 1",
    price: 290000, area: 145,
    extra: [{ label: "Vitrina", value: "12m" }, { label: "Intrări", value: "2" }],
    agent: { initials: "DM", name: "Diana M.", color: "from-pink-400 to-pink-600" },
    views: 423, interested: 0, emoji: "🏬",
    gradient: "from-[hsl(270,40%,10%)] to-[hsl(260,50%,18%)]",
  },
  {
    id: 5, type: "Apartament", status: "disponibil",
    title: "Apartament 2 camere – Vitan Mall Area",
    address: "Str. Vitan-Bârzești 4, Sector 4",
    price: 112000, area: 54, rooms: 2, bathrooms: 1, floor: "Et. 3",
    agent: { initials: "AI", name: "Andrei I.", color: "from-primary to-amber-700" },
    views: 211, interested: 5, emoji: "🏢",
    gradient: "from-[hsl(185,40%,7%)] to-[hsl(190,50%,14%)]",
  },
  {
    id: 6, type: "Casă", status: "rezervat",
    title: "Casă P+1 – Voluntari, cartier nou",
    address: "Str. Trandafirilor 8, Voluntari",
    price: 195000, area: 120, rooms: 4, bathrooms: 2, floor: "Parter",
    agent: { initials: "SN", name: "Sofia N.", color: "from-yellow-400 to-yellow-600" },
    views: 298, interested: 11, emoji: "🏠",
    gradient: "from-[hsl(15,30%,8%)] to-[hsl(20,35%,12%)]",
  },
];

const stats = [
  { label: "Total Proprietăți", value: "47", sub: "↑ 5 față de luna trecută", subColor: "text-green-400", accent: "bg-primary" },
  { label: "Disponibile", value: "31", sub: "66% din portofoliu", subColor: "text-green-400", accent: "bg-green-400" },
  { label: "Rezervate", value: "9", sub: "Valoare: €2.4M", subColor: "text-info", accent: "bg-info" },
  { label: "Vândute (30 zile)", value: "7", sub: "Comision: €48,200", subColor: "text-primary", accent: "bg-danger" },
];

const features = [
  { icon: "📸", title: "Galerie Foto & Video", desc: "Upload masiv de imagini, tour virtual 360° și video walkthrough.", tag: "COMING SOON" },
  { icon: "📍", title: "Localizare pe Hartă", desc: "Integrare Google Maps cu zone de interes și facilități.", tag: "COMING SOON" },
  { icon: "🏷️", title: "Categorii & Filtre", desc: "Organizare pe tipuri, zone, prețuri, suprafețe și status.", tag: "BETA" },
  { icon: "📊", title: "Statistici Proprietate", desc: "Vizualizări, interesați, timp pe piață și comparații de preț.", tag: "COMING SOON" },
];

const statusBadge: Record<PropertyStatus, { label: string; cls: string }> = {
  disponibil: { label: "● Disponibil", cls: "bg-green-400/20 text-green-400 border border-green-400/30" },
  rezervat: { label: "● Rezervat", cls: "bg-yellow-400/20 text-yellow-400 border border-yellow-400/30" },
  vandut: { label: "● Vândut", cls: "bg-danger/20 text-danger border border-danger/30" },
};

export default function Proprietati() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterZone, setFilterZone] = useState("all");
  const [filterPrice, setFilterPrice] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list" | "map">("grid");
  const [modalOpen, setModalOpen] = useState(false);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  const filtered = useMemo(() => {
    return initialProperties.filter((p) => {
      if (search) {
        const q = search.toLowerCase();
        if (!p.title.toLowerCase().includes(q) && !p.address.toLowerCase().includes(q)) return false;
      }
      if (filterType !== "all" && p.type !== filterType) return false;
      if (filterStatus !== "all" && p.status !== filterStatus) return false;
      if (filterPrice !== "all") {
        if (filterPrice === "0-50" && p.price > 50000) return false;
        if (filterPrice === "50-100" && (p.price < 50000 || p.price > 100000)) return false;
        if (filterPrice === "100-200" && (p.price < 100000 || p.price > 200000)) return false;
        if (filterPrice === "200+" && p.price < 200000) return false;
      }
      return true;
    });
  }, [search, filterType, filterStatus, filterPrice]);

  const toggleFav = (id: number) => {
    setFavorites((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  return (
    <DashboardLayout>
      {/* Topbar */}
      <div className="bg-surface border-b border-subtle px-4 md:px-7 h-[52px] md:h-[58px] flex items-center gap-3 sticky top-0 z-40">
        <div className="flex items-center gap-1.5 text-xs md:text-[13px] text-muted-foreground">
          <span className="cursor-pointer hover:text-primary transition-colors" onClick={() => navigate("/")}>⊞ Dashboard</span>
          <span className="text-muted-foreground/40">›</span>
          <span className="text-foreground font-medium">🏠 Proprietăți</span>
        </div>
        <div className="ml-auto flex items-center gap-2 md:gap-3">
          <button onClick={() => setModalOpen(true)} className="hidden sm:flex items-center gap-1.5 border border-subtle bg-transparent text-muted-foreground rounded-lg px-3 py-2 text-xs font-medium hover:bg-surface2 hover:text-foreground transition-all cursor-pointer">
            + Adaugă Proprietate
          </button>
          <button onClick={() => setModalOpen(true)} className="sm:hidden w-9 h-9 bg-primary text-primary-foreground rounded-lg flex items-center justify-center text-lg font-bold">＋</button>
          <button className="flex items-center gap-1.5 bg-gradient-to-r from-primary to-gold text-primary-foreground rounded-lg px-3 md:px-4 py-2 text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer">
            📥 <span className="hidden md:inline">Import CSV</span>
          </button>
        </div>
      </div>

      <div className="p-4 md:p-8 flex-1 space-y-5 md:space-y-6">
        {/* Page Header */}
        <div className="animate-fade-up">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 bg-primary/10 border border-primary/20 rounded-[10px] flex items-center justify-center text-lg">🏠</div>
            <h1 className="font-serif text-xl md:text-[22px] font-bold">Proprietăți</h1>
          </div>
          <p className="text-muted-foreground text-[13px] md:text-sm max-w-lg ml-[52px]">
            Gestionează portofoliul complet – apartamente, case, terenuri și spații comerciale, totul într-un singur loc.
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 animate-fade-up-delay-1">
          {stats.map((s, i) => (
            <div key={i} className="bg-card border border-subtle rounded-xl p-4 md:p-5 relative overflow-hidden group hover:border-primary/30 hover:-translate-y-0.5 transition-all cursor-pointer">
              <div className={`absolute top-0 left-0 right-0 h-[2px] ${s.accent}`} />
              <div className="text-[10px] md:text-[11px] font-medium tracking-wider uppercase text-muted-foreground mb-2">{s.label}</div>
              <div className="font-serif text-2xl md:text-[28px] font-bold">{s.value}</div>
              <div className={`text-[11px] mt-1 ${s.subColor}`}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Plan Banner */}
        <div className="bg-gradient-to-r from-primary/[0.08] to-primary/[0.03] border border-primary/20 rounded-xl p-4 md:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4 animate-fade-up-delay-1">
          <span className="text-2xl md:text-[28px]">✨</span>
          <div className="flex-1 min-w-0">
            <h3 className="font-serif text-sm md:text-[15px] font-bold mb-0.5">Ce va include acest modul — SocietyHUB Pro</h3>
            <p className="text-xs md:text-[13px] text-muted-foreground">Gallery 360°, <span className="text-primary">Localizare Maps</span>, Statistici avansate, Import/Export, <span className="text-primary">Sincronizare Portale</span> și multe altele.</p>
          </div>
          <button onClick={() => navigate("/business-plan")} className="bg-gradient-to-r from-primary to-gold text-primary-foreground px-4 py-2.5 rounded-lg text-xs font-bold hover:opacity-85 transition-opacity whitespace-nowrap cursor-pointer">
            🔓 Vezi Planul
          </button>
        </div>

        {/* Filters Bar */}
        <div className="bg-card border border-subtle rounded-xl p-3 md:p-4 flex flex-wrap items-center gap-2 md:gap-3 animate-fade-up-delay-2">
          <div className="relative flex-1 min-w-[160px] md:min-w-[200px]">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm pointer-events-none">🔍</span>
            <Input
              value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Caută după titlu, adresă..."
              className="pl-9 bg-surface2 border-subtle text-[13px] h-9"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-auto min-w-[120px] bg-surface2 border-subtle text-xs h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toate tipurile</SelectItem>
              <SelectItem value="Apartament">Apartament</SelectItem>
              <SelectItem value="Casă">Casă</SelectItem>
              <SelectItem value="Teren">Teren</SelectItem>
              <SelectItem value="Spațiu Comercial">Spațiu Comercial</SelectItem>
              <SelectItem value="Garsonieră">Garsonieră</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-auto min-w-[130px] bg-surface2 border-subtle text-xs h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toate statusurile</SelectItem>
              <SelectItem value="disponibil">Disponibil</SelectItem>
              <SelectItem value="rezervat">Rezervat</SelectItem>
              <SelectItem value="vandut">Vândut</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterPrice} onValueChange={setFilterPrice}>
            <SelectTrigger className="w-auto min-w-[110px] bg-surface2 border-subtle text-xs h-9 hidden md:flex"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Preț: Toate</SelectItem>
              <SelectItem value="0-50">€0 – €50K</SelectItem>
              <SelectItem value="50-100">€50K – €100K</SelectItem>
              <SelectItem value="100-200">€100K – €200K</SelectItem>
              <SelectItem value="200+">€200K+</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex bg-surface2 border border-subtle rounded-lg overflow-hidden ml-auto">
            {(["grid", "list", "map"] as const).map((v) => (
              <button key={v} onClick={() => setViewMode(v)}
                className={`px-2.5 py-1.5 text-sm border-none cursor-pointer transition-all ${viewMode === v ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                {v === "grid" ? "⊞" : v === "list" ? "☰" : "🗺"}
              </button>
            ))}
          </div>
        </div>

        {/* Property Grid */}
        {filtered.length > 0 ? (
          <div className={`animate-fade-up-delay-2 ${viewMode === "list"
            ? "flex flex-col gap-3"
            : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-[18px]"}`}>
            {filtered.map((p) => (
              <PropertyCard key={p.id} property={p} isFav={favorites.has(p.id)} onToggleFav={() => toggleFav(p.id)} viewMode={viewMode} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-5xl opacity-30 mb-4">🏠</div>
            <div className="font-serif text-lg font-semibold mb-2">Nicio proprietate găsită</div>
            <p className="text-muted-foreground text-sm mb-5">Ajustează filtrele sau adaugă o proprietate nouă.</p>
            <button onClick={() => setModalOpen(true)} className="bg-gradient-to-r from-primary to-gold text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-semibold cursor-pointer hover:opacity-90 transition-opacity">
              + Adaugă Proprietate
            </button>
          </div>
        )}

        {/* Features Section */}
        <div className="mt-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-serif text-sm font-semibold text-muted-foreground tracking-wide">Ce va include acest modul</span>
            <div className="flex-1 h-px bg-border" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {features.map((f, i) => (
              <div key={i} className="bg-card border border-subtle rounded-xl p-4 md:p-5 hover:border-primary/25 hover:-translate-y-0.5 transition-all cursor-pointer">
                <span className="text-xl md:text-[22px] block mb-2.5">{f.icon}</span>
                <div className="font-serif text-[13px] font-semibold mb-1">{f.title}</div>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                <span className="inline-block mt-2 px-2 py-0.5 bg-primary/10 rounded text-[10px] text-primary font-semibold tracking-wide">{f.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Property Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="bg-card border-subtle max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-base font-bold">🏠 Adaugă Proprietate Nouă</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-medium text-muted-foreground tracking-wider uppercase block mb-1.5">Tip Proprietate</label>
                <Select defaultValue="Apartament">
                  <SelectTrigger className="bg-surface2 border-subtle text-[13px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Apartament">Apartament</SelectItem>
                    <SelectItem value="Casă">Casă / Vilă</SelectItem>
                    <SelectItem value="Teren">Teren</SelectItem>
                    <SelectItem value="Spațiu Comercial">Spațiu Comercial</SelectItem>
                    <SelectItem value="Garsonieră">Garsonieră</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-[11px] font-medium text-muted-foreground tracking-wider uppercase block mb-1.5">Status</label>
                <Select defaultValue="disponibil">
                  <SelectTrigger className="bg-surface2 border-subtle text-[13px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="disponibil">Disponibil</SelectItem>
                    <SelectItem value="rezervat">Rezervat</SelectItem>
                    <SelectItem value="vandut">Vândut</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="text-[11px] font-medium text-muted-foreground tracking-wider uppercase block mb-1.5">Titlu Anunț</label>
              <Input className="bg-surface2 border-subtle text-[13px]" placeholder="ex. Apartament 3 camere – Floreasca" />
            </div>
            <div>
              <label className="text-[11px] font-medium text-muted-foreground tracking-wider uppercase block mb-1.5">Adresă</label>
              <Input className="bg-surface2 border-subtle text-[13px]" placeholder="Stradă, număr, sector, oraș" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-medium text-muted-foreground tracking-wider uppercase block mb-1.5">Preț (€)</label>
                <Input className="bg-surface2 border-subtle text-[13px]" type="number" placeholder="ex. 185000" />
              </div>
              <div>
                <label className="text-[11px] font-medium text-muted-foreground tracking-wider uppercase block mb-1.5">Suprafață (m²)</label>
                <Input className="bg-surface2 border-subtle text-[13px]" type="number" placeholder="ex. 78" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-medium text-muted-foreground tracking-wider uppercase block mb-1.5">Camere</label>
                <Input className="bg-surface2 border-subtle text-[13px]" type="number" placeholder="ex. 3" />
              </div>
              <div>
                <label className="text-[11px] font-medium text-muted-foreground tracking-wider uppercase block mb-1.5">Băi</label>
                <Input className="bg-surface2 border-subtle text-[13px]" type="number" placeholder="ex. 2" />
              </div>
            </div>
            <div>
              <label className="text-[11px] font-medium text-muted-foreground tracking-wider uppercase block mb-1.5">Descriere Scurtă</label>
              <Textarea className="bg-surface2 border-subtle text-[13px]" rows={3} placeholder="Descriere proprietate, caracteristici principale..." />
            </div>
          </div>
          <div className="flex gap-3 justify-end pt-4 border-t border-subtle mt-2">
            <button onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg border border-subtle text-muted-foreground text-xs font-medium hover:bg-surface2 transition-colors cursor-pointer bg-transparent">Anulează</button>
            <button onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-gold text-primary-foreground text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer">✓ Salvează Proprietatea</button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}

/* ─── Property Card ─── */
function PropertyCard({ property: p, isFav, onToggleFav, viewMode }: {
  property: Property; isFav: boolean; onToggleFav: () => void; viewMode: string;
}) {
  const badge = statusBadge[p.status];

  if (viewMode === "list") {
    return (
      <div className="bg-card border border-subtle rounded-xl p-3 md:p-4 flex items-center gap-4 hover:border-primary/30 transition-all cursor-pointer group">
        <div className={`w-16 h-16 md:w-20 md:h-20 rounded-lg bg-gradient-to-br ${p.gradient} flex items-center justify-center text-2xl md:text-3xl flex-shrink-0`}>
          {p.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className={`text-[10px] px-1.5 py-0.5 rounded ${badge.cls}`}>{badge.label}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/15 text-primary border border-primary/25">{p.type}</span>
          </div>
          <div className="font-serif text-sm md:text-base font-bold text-primary mb-0.5">€{p.price.toLocaleString()}</div>
          <div className="text-xs md:text-[13px] font-medium truncate">{p.title}</div>
          <div className="text-[11px] text-muted-foreground">📍 {p.address}</div>
        </div>
        <div className="hidden md:flex items-center gap-3 text-xs text-muted-foreground flex-shrink-0">
          <span><strong className="text-foreground">{p.area}</strong> m²</span>
          {p.rooms && <span><strong className="text-foreground">{p.rooms}</strong> cam.</span>}
          <span>👁 {p.views}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-subtle rounded-xl overflow-hidden hover:border-primary/35 hover:-translate-y-[3px] hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)] transition-all cursor-pointer group">
      {/* Image area */}
      <div className={`relative h-[160px] md:h-[180px] bg-gradient-to-br ${p.gradient}`}>
        <div className="w-full h-full flex items-center justify-center text-4xl opacity-30">{p.emoji}</div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />
        <div className="absolute top-2.5 left-2.5 flex gap-1.5 flex-wrap">
          <span className={`text-[10px] md:text-[11px] px-2 py-1 rounded-md font-semibold ${badge.cls}`}>{badge.label}</span>
          <span className="text-[10px] md:text-[11px] px-2 py-1 rounded-md font-semibold bg-primary/15 text-primary border border-primary/25">{p.type}</span>
          {p.isNew && <span className="text-[10px] md:text-[11px] px-2 py-1 rounded-md font-semibold bg-info/20 text-info border border-info/30">NOU</span>}
        </div>
        <button onClick={(e) => { e.stopPropagation(); onToggleFav(); }}
          className={`absolute top-2.5 right-2.5 w-7 h-7 md:w-8 md:h-8 bg-black/60 rounded-md border-none cursor-pointer flex items-center justify-center text-sm transition-colors ${isFav ? "text-danger" : "text-foreground/70 hover:bg-primary/30"}`}>
          {isFav ? "♥" : "♡"}
        </button>
      </div>

      {/* Body */}
      <div className="p-3.5 md:p-4">
        <div className={`font-serif text-lg md:text-xl font-bold mb-1 ${p.status === "vandut" ? "text-muted-foreground line-through text-base" : "text-primary"}`}>
          €{p.price.toLocaleString()}
        </div>
        <div className="text-xs md:text-[13px] font-medium truncate mb-1">{p.title}</div>
        <div className="text-[11px] md:text-xs text-muted-foreground flex items-center gap-1 mb-3">📍 {p.address}</div>

        {/* Specs */}
        <div className="flex gap-3 py-2.5 border-y border-subtle mb-2.5">
          <div className="text-[11px] md:text-xs text-muted-foreground"><strong className="text-foreground font-medium">{p.area}</strong> m²</div>
          {p.rooms && <div className="text-[11px] md:text-xs text-muted-foreground"><strong className="text-foreground font-medium">{p.rooms}</strong> cam.</div>}
          {p.bathrooms && <div className="text-[11px] md:text-xs text-muted-foreground"><strong className="text-foreground font-medium">{p.bathrooms}</strong> băi</div>}
          {p.floor && <div className="text-[11px] md:text-xs text-muted-foreground"><strong className="text-foreground font-medium">{p.floor}</strong></div>}
          {p.extra?.map((e, i) => (
            <div key={i} className="text-[11px] md:text-xs text-muted-foreground"><strong className="text-foreground font-medium">{e.label}</strong> {e.value}</div>
          ))}
        </div>

        {/* Meta */}
        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className={`w-5 h-5 md:w-[22px] md:h-[22px] rounded-md text-[9px] md:text-[10px] font-bold flex items-center justify-center text-primary-foreground bg-gradient-to-br ${p.agent.color}`}>
              {p.agent.initials}
            </div>
            <span>{p.agent.name}</span>
          </div>
          <div className="flex items-center gap-1">👁 {p.views}</div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-3 md:px-4 pb-3 md:pb-3.5 flex gap-2">
        {p.status === "vandut" ? (
          <>
            <ActionBtn label="📄 Contract" />
            <ActionBtn label="📊 Raport" />
          </>
        ) : (
          <>
            <ActionBtn label="✏️ Editează" />
            <ActionBtn label={`📞 Interesați (${p.interested})`} />
          </>
        )}
        <ActionBtn label="→ Detalii" primary />
      </div>
    </div>
  );
}

function ActionBtn({ label, primary }: { label: string; primary?: boolean }) {
  return (
    <button className={`flex-1 py-2 rounded-lg text-[11px] md:text-xs font-medium flex items-center justify-center gap-1 cursor-pointer transition-all ${
      primary
        ? "bg-primary/10 border border-primary/25 text-primary hover:bg-primary/20"
        : "bg-transparent border border-subtle text-muted-foreground hover:bg-surface2 hover:text-foreground"
    }`}>
      {label}
    </button>
  );
}
