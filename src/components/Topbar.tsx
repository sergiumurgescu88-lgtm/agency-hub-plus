export function Topbar() {
  return (
    <div className="bg-surface border-b border-subtle px-7 h-[58px] flex items-center gap-4 sticky top-0 z-40">
      <div className="flex-1">
        <span className="font-serif text-xl">Bună ziua, Alexandru 👋</span>
        <span className="text-dim2 text-sm ml-2.5 font-sans">Miercuri, 4 Martie 2026</span>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 bg-surface2 border border-subtle rounded-lg px-3.5 py-[7px] w-[220px]">
        <span className="text-dim2">🔍</span>
        <input
          type="text"
          placeholder="Caută proprietăți, clienți..."
          className="bg-transparent border-none outline-none text-foreground text-[13px] w-full placeholder:text-dim2"
        />
        <span className="text-[10px] text-dim2 border border-subtle px-1.5 py-0.5 rounded">⌘K</span>
      </div>

      {/* Add Property */}
      <button className="flex items-center gap-1.5 bg-gold text-primary-foreground border-none rounded-lg px-4 py-2 text-[13px] font-semibold cursor-pointer hover:opacity-90 transition-opacity">
        ＋ Proprietate Nouă
      </button>

      {/* Notifications */}
      <div className="w-9 h-9 bg-surface2 border border-subtle rounded-lg flex items-center justify-center text-base cursor-pointer relative">
        🔔
        <div className="w-2 h-2 bg-danger rounded-full absolute top-1.5 right-1.5 border-2 border-surface" />
      </div>
    </div>
  );
}
