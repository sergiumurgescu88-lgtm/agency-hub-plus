import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface Comision {
  id: number; prop: string; client: string; agent: string; agColor: string;
  val: number; pct: number; status: 'inc'|'pend'|'rest'; date: string;
}

const INITIAL: Comision[] = [
  { id:1, prop:'Penthouse Aviatorilor 180mp', client:'Elena Dumitrescu', agent:'Andrei Ionescu', agColor:'hsl(40,100%,47%)', val:320000, pct:2, status:'inc', date:'20 Feb 2026' },
  { id:2, prop:'Apartament 3 cam. Floreasca', client:'Mihai Popescu', agent:'Maria Popa', agColor:'hsl(217,85%,65%)', val:185000, pct:2, status:'pend', date:'01 Mar 2026' },
  { id:3, prop:'Vila Baneasa 450mp', client:'Cristian Marin', agent:'Andrei Ionescu', agColor:'hsl(40,100%,47%)', val:650000, pct:1.5, status:'pend', date:'04 Mar 2026' },
  { id:4, prop:'Studio Pipera 45mp', client:'Ioana Stancu', agent:'Alex Gheorghiu', agColor:'hsl(165,87%,43%)', val:72000, pct:2, status:'rest', date:'10 Feb 2026' },
  { id:5, prop:'Casa Otopeni 300mp', client:'Ana Ionescu', agent:'Maria Popa', agColor:'hsl(217,85%,65%)', val:280000, pct:2, status:'inc', date:'15 Feb 2026' },
  { id:6, prop:'Garsonieră Titan', client:'Dan Stoica', agent:'Alex Gheorghiu', agColor:'hsl(165,87%,43%)', val:55000, pct:2, status:'inc', date:'22 Feb 2026' },
  { id:7, prop:'Penthouse Dorobanți 220mp', client:'Victor Pana', agent:'Andrei Ionescu', agColor:'hsl(40,100%,47%)', val:450000, pct:2, status:'pend', date:'01 Mar 2026' },
];

const FACTURI = [
  { nr:'FCT-2026-031', client:'Elena Dumitrescu', date:'20 Feb', scad:'20 Mar', val:6400, status:'inc' as const },
  { nr:'FCT-2026-032', client:'Mihai Popescu', date:'01 Mar', scad:'31 Mar', val:3700, status:'pend' as const },
  { nr:'FCT-2026-033', client:'Cristian Marin', date:'04 Mar', scad:'03 Apr', val:9750, status:'pend' as const },
  { nr:'FCT-2026-034', client:'Ioana Stancu', date:'10 Feb', scad:'10 Mar', val:1440, status:'rest' as const },
  { nr:'PRF-2026-012', client:'Victor Pana', date:'01 Mar', scad:'15 Mar', val:9000, status:'pend' as const },
];

const AGENTS_SPLIT = [
  { n:'Andrei Ionescu', role:'Agent Senior', c:'hsl(40,100%,47%)', split:65, tranz:7, total:24800, inc:16000, pend:8800 },
  { n:'Maria Popa', role:'Agent Intermediar', c:'hsl(217,85%,65%)', split:60, tranz:5, total:18600, inc:12000, pend:6600 },
  { n:'Alex Gheorghiu', role:'Agent Junior', c:'hsl(165,87%,43%)', split:55, tranz:4, total:11200, inc:7000, pend:4200 },
];

const CF_BREAKDOWN = [
  { l:'Comisioane Vânzare', v:28500, colorClass:'text-gold', dotCls:'bg-gold' },
  { l:'Comisioane Închiriere', v:12800, colorClass:'text-info-blue', dotCls:'bg-[hsl(var(--blue))]' },
  { l:'Comisioane Exclusivitate', v:7200, colorClass:'text-purple', dotCls:'bg-[hsl(var(--purple))]' },
  { l:'Co-broking MLS', v:3400, colorClass:'text-teal', dotCls:'bg-teal' },
  { l:'Restante Recuperate', v:1800, colorClass:'text-gold', dotCls:'bg-gold' },
  { l:'Total Previzionat', v:53700, colorClass:'text-gold', dotCls:'bg-gold', bold:true },
];

const STATUS_MAP = { inc: { l:'Încasat', cls:'bg-teal-dim text-teal' }, pend: { l:'În Așteptare', cls:'bg-[hsl(40_100%_47%/0.12)] text-gold' }, rest: { l:'Restant', cls:'bg-red-dim text-danger' } };
const euro = (v: number) => v >= 1e6 ? `€${(v/1e6).toFixed(2)}M` : v >= 1000 ? `€${(v/1000).toFixed(0)}K` : `€${v}`;
const initials = (name: string) => name.split(' ').map(w => w[0]).join('');

const PROPS = ['Penthouse Aviatorilor 180mp','Apartament 3 cam. Floreasca','Vila Baneasa 450mp'];
const CLIENTS = ['Mihai Popescu','Elena Dumitrescu','Cristian Marin'];
const AGENTS = ['Andrei Ionescu','Maria Popa','Alex Gheorghiu'];

export default function Comisioane() {
  const { toast } = useToast();
  const [tab, setTab] = useState<'tranzactii'|'agenti'|'cashflow'|'facturi'>('tranzactii');
  const [data, setData] = useState<Comision[]>(INITIAL);
  const [newOpen, setNewOpen] = useState(false);
  const [periodo, setPeriodo] = useState('luna');

  const [mVal, setMVal] = useState(0);
  const [mPct, setMPct] = useState(2);
  const [mSplit, setMSplit] = useState(60);
  const comTotal = mVal * mPct / 100;

  const markPaid = (id: number) => {
    setData(prev => prev.map(c => c.id === id ? { ...c, status: 'inc' as const } : c));
    const c = data.find(x => x.id === id);
    if (c) toast({ title: `✅ Comision marcat ca încasat: ${euro(c.val * c.pct / 100)}` });
  };

  const saveCom = () => {
    setNewOpen(false);
    toast({ title: '✅ Comision înregistrat cu succes!' });
  };

  const TABS: { id: typeof tab; label: string }[] = [
    { id:'tranzactii', label:'💼 Tranzacții' },
    { id:'agenti', label:'👥 Split Agenți' },
    { id:'cashflow', label:'📈 Cash-Flow' },
    { id:'facturi', label:'🧾 Facturi' },
  ];

  const trendMonths = ['Oct','Nov','Dec','Ian','Feb','Mar'];
  const trendVals = [32000,28500,41200,38000,35600,48500];
  const trendMax = Math.max(...trendVals);
  const trendColors = ['hsl(40,100%,47%)','hsl(217,85%,65%)','hsl(270,70%,75%)','hsl(165,87%,43%)','hsl(40,100%,47%)','hsl(40,100%,47%)'];

  const cfMonths = ['Apr','Mai','Iun','Iul','Aug','Sep'];
  const cfVals = [52000,48000,61000,55000,67000,59000];
  const cfMax = Math.max(...cfVals);

  const agentRank = [
    { n:'Andrei Ionescu', c:'hsl(40,100%,47%)', v:24800 },
    { n:'Maria Popa', c:'hsl(217,85%,65%)', v:18600 },
    { n:'Alex Gheorghiu', c:'hsl(165,87%,43%)', v:11200 },
  ];

  return (
    <DashboardLayout>
      <div className="bg-surface border-b border-subtle px-4 md:px-7 h-[52px] md:h-[58px] flex items-center gap-2 md:gap-4 sticky top-0 z-40">
        <div className="flex items-center gap-1.5 text-[13px] text-dim">
          <a href="/" className="hover:text-gold transition-colors">SocietyHUB</a>
          <span className="text-dim2">›</span>
          <span className="text-foreground font-medium">💰 Comisioane</span>
        </div>
        <div className="ml-auto flex items-center gap-1.5 md:gap-2.5">
          <select value={periodo} onChange={e => { setPeriodo(e.target.value); toast({ title: `🔍 Filtrare: ${e.target.options[e.target.selectedIndex].text}` }); }} className="bg-surface2 border border-subtle rounded-lg px-2 md:px-3 py-[7px] text-[12px] md:text-[13px] text-foreground outline-none cursor-pointer">
            <option value="luna">Luna Curentă</option>
            <option value="trimestru">Trimestrul I</option>
            <option value="an">Anul 2026</option>
          </select>
          <button onClick={() => toast({ title: '🧾 Se generează factură…' })} className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium border border-subtle text-dim hover:bg-surface2 hover:text-foreground transition-all">🧾 Generează Factură</button>
          <button onClick={() => toast({ title: '📤 Export Excel' })} className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium border border-subtle text-dim hover:bg-surface2 hover:text-foreground transition-all">📤 Export</button>
          <button onClick={() => setNewOpen(true)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] md:text-[12px] font-bold bg-gradient-to-r from-[hsl(var(--gold))] to-[hsl(var(--gold2))] text-primary-foreground hover:opacity-90 transition-all">＋ <span className="hidden sm:inline">Comision</span> Nou</button>
        </div>
      </div>

      <div className="p-4 md:p-6 flex flex-col gap-4 md:gap-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-3.5 animate-fade-up">
          {[
            { label:'Comisioane Luna', value:'€48.5K', sub:'↑ +12% față de Feb', accent:'gradient-gold-bottom', green:true },
            { label:'Încasate', value:'€31.2K', sub:'64% din total', accent:'gradient-teal-bottom' },
            { label:'În Așteptare', value:'€12.8K', sub:'termen 30 zile', accent:'bg-[hsl(var(--gold))]' },
            { label:'Restante', value:'€4.5K', sub:'↑ 2 facturi', accent:'gradient-red-bottom', red:true },
          ].map((s, i) => (
            <div key={i} className="bg-surface border border-subtle rounded-xl p-[18px] relative overflow-hidden hover:border-gold/25 hover:-translate-y-px transition-all">
              <div className={`absolute top-0 left-0 right-0 h-[2px] ${s.accent}`} />
              <div className="text-[11px] font-semibold tracking-wider uppercase text-dim mb-[7px]">{s.label}</div>
              <div className="text-[26px] font-extrabold leading-none">{s.value}</div>
              <div className={`text-xs mt-[5px] ${s.green ? 'text-teal' : s.red ? 'text-danger' : 'text-dim'}`}>{s.sub}</div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3.5 animate-fade-up-delay-1">
          <div className="flex gap-0.5 bg-surface border border-subtle rounded-[10px] p-1">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} className={`px-[18px] py-2 rounded-[7px] text-[13px] font-medium transition-all ${tab === t.id ? 'bg-surface2 text-foreground shadow-md' : 'text-dim hover:text-foreground'}`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {tab === 'tranzactii' && (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4 animate-fade-up-delay-2">
            <div className="bg-surface border border-subtle rounded-xl overflow-hidden">
              <div className="px-[18px] py-3.5 border-b border-subtle text-[13px] font-bold">💼 Comisioane Tranzacții — Martie 2026</div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>{['Proprietate','Client','Agent','Val. Tranzacție','Comision','Status','Acțiuni'].map(h => (
                      <th key={h} className="px-3.5 py-2.5 text-left text-[11px] font-bold tracking-wider uppercase text-dim border-b border-subtle bg-[rgba(255,255,255,0.02)]">{h}</th>
                    ))}</tr>
                  </thead>
                  <tbody>
                    {data.map(c => {
                      const com = c.val * c.pct / 100;
                      return (
                        <tr key={c.id} className="hover:bg-[rgba(255,255,255,0.02)] border-b border-subtle/30 last:border-b-0">
                          <td className="px-3.5 py-3 text-[13px] font-medium">{c.prop}</td>
                          <td className="px-3.5 py-3 text-[13px]">{c.client}</td>
                          <td className="px-3.5 py-3">
                            <div className="flex items-center gap-1.5">
                              <div className="w-[22px] h-[22px] rounded-[5px] flex items-center justify-center text-[9px] font-bold text-primary-foreground" style={{ background: c.agColor }}>{initials(c.agent)}</div>
                              <span className="text-[13px]">{c.agent}</span>
                            </div>
                          </td>
                          <td className="px-3.5 py-3">
                            <div className="text-[13px] font-bold">{euro(c.val)}</div>
                            <div className="text-[11px] text-dim">{c.pct}% comision</div>
                          </td>
                          <td className="px-3.5 py-3 text-sm font-bold text-gold">{euro(com)}</td>
                          <td className="px-3.5 py-3"><span className={`inline-flex px-2 py-[3px] rounded-[5px] text-[11px] font-semibold ${STATUS_MAP[c.status].cls}`}>{STATUS_MAP[c.status].l}</span></td>
                          <td className="px-3.5 py-3">
                            <div className="flex gap-1">
                              <button onClick={() => toast({ title: `🧾 Factură generată pentru ${c.client}` })} className="px-2 py-1 rounded-[5px] text-xs border border-subtle text-dim hover:bg-surface2 hover:text-foreground transition-all">🧾</button>
                              {c.status !== 'inc' && <button onClick={() => markPaid(c.id)} className="px-2 py-1 rounded-[5px] text-xs border border-gold/30 text-gold bg-gold-dim hover:bg-gold/20 transition-all">✓ Încasat</button>}
                              <button onClick={() => toast({ title: '📤 Export PDF' })} className="px-2 py-1 rounded-[5px] text-xs border border-subtle text-dim hover:bg-surface2 hover:text-foreground transition-all">⬇️</button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div className="bg-surface border border-subtle rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-subtle text-[13px] font-bold">👥 Top Agenți Luna</div>
                {agentRank.map((a, i) => (
                  <div key={i} className="flex items-center gap-2.5 px-3.5 py-2.5 border-b border-subtle/30 last:border-b-0">
                    <div className="w-[30px] h-[30px] rounded-[7px] flex items-center justify-center font-bold text-[11px] text-primary-foreground shrink-0" style={{ background: a.c }}>{initials(a.n)}</div>
                    <div className="text-[13px] font-medium flex-1">{a.n}</div>
                    <div className="text-[13px] font-bold text-gold">{euro(a.v)}</div>
                  </div>
                ))}
              </div>
              <div className="bg-surface border border-subtle rounded-xl p-4">
                <div className="text-[13px] font-bold mb-3.5">📈 Trend Lunar</div>
                <div className="flex items-end gap-2 h-[130px] px-1">
                  {trendVals.map((v, i) => (
                    <div key={i} className="flex-1"><div className="w-full rounded-t" style={{ height: `${v / trendMax * 120}px`, background: trendColors[i], opacity: i === 5 ? 1 : 0.5 }} /></div>
                  ))}
                </div>
                <div className="flex gap-2 mt-1.5">
                  {trendMonths.map((m, i) => (
                    <div key={i} className={`flex-1 text-center text-[11px] ${i === 5 ? 'text-gold' : 'text-dim'}`}>{m}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'agenti' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 animate-fade-up-delay-2">
            {AGENTS_SPLIT.map((a, i) => (
              <div key={i} className="bg-surface border border-subtle rounded-xl p-[18px]">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-base text-primary-foreground mb-2.5" style={{ background: a.c }}>{initials(a.n)}</div>
                <div className="text-sm font-bold mb-[3px]">{a.n}</div>
                <div className="text-xs text-dim mb-3">{a.role} · Split {a.split}%</div>
                {[
                  { l:'Total Comisioane', v: euro(a.total), cls:'text-gold' },
                  { l:'Încasate', v: euro(a.inc), cls:'text-teal' },
                  { l:'În așteptare', v: euro(a.pend), cls:'text-gold' },
                  { l:'Tranzacții', v: String(a.tranz), cls:'text-foreground' },
                ].map((m, j) => (
                  <div key={j} className="flex justify-between items-center py-[5px] border-b border-subtle/30 last:border-b-0">
                    <span className="text-xs text-dim">{m.l}</span>
                    <span className={`text-[13px] font-bold ${m.cls}`}>{m.v}</span>
                  </div>
                ))}
                <div className="mt-3">
                  <div className="text-[11px] text-dim mb-1">Split agenție {100 - a.split}% = {euro(Math.round(a.total * (100 - a.split) / 100))}</div>
                  <div className="h-1.5 bg-surface2 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${a.split}%`, background: a.c, transition: 'width 0.6s' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'cashflow' && (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 animate-fade-up-delay-2">
            <div className="bg-surface border border-subtle rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-subtle text-[13px] font-bold">📊 Proiecție Cash-Flow 6 luni</div>
              <div className="p-4 flex items-end gap-2.5 h-[180px]">
                {cfVals.map((v, i) => (
                  <div key={i} className="flex-1 rounded-t border border-gold/20 cursor-pointer hover:opacity-80 transition-opacity" style={{ height: `${v / cfMax * 160}px`, background: `hsl(40 100% 47% / ${0.3 + i * 0.1})` }} title={euro(v)} />
                ))}
              </div>
              <div className="flex gap-2.5 px-4 pb-3.5">
                {cfMonths.map((m, i) => (
                  <div key={i} className="flex-1 text-center text-[11px] text-dim">{m}<br /><span className="text-xs font-bold text-foreground">{euro(cfVals[i])}</span></div>
                ))}
              </div>
            </div>
            <div className="bg-surface border border-subtle rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-subtle text-[13px] font-bold">💳 Structură Plăți</div>
              {CF_BREAKDOWN.map((r, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-2.5 border-b border-subtle/30 last:border-b-0">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${r.dotCls}`} />
                  <div className={`text-[13px] flex-1 ${r.bold ? 'font-semibold' : 'text-dim'}`}>{r.l}</div>
                  <div className={`text-[13px] font-bold ${r.colorClass}`}>{euro(r.v)}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'facturi' && (
          <div className="bg-surface border border-subtle rounded-xl overflow-hidden animate-fade-up-delay-2">
            <div className="px-[18px] py-3.5 border-b border-subtle flex items-center gap-2.5">
              <div className="text-[13px] font-bold flex-1">🧾 Facturi & Proforma</div>
              <button onClick={() => toast({ title: '🧾 Factură nouă generată' })} className="px-2 py-1 rounded-[5px] text-xs border border-gold/30 text-gold bg-gold-dim hover:bg-gold/20 transition-all">＋ Factură Nouă</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>{['Nr. Factură','Client','Data','Scadență','Valoare','Status','Acțiuni'].map(h => (
                    <th key={h} className="px-3.5 py-2.5 text-left text-[11px] font-bold tracking-wider uppercase text-dim border-b border-subtle bg-[rgba(255,255,255,0.02)]">{h}</th>
                  ))}</tr>
                </thead>
                <tbody>
                  {FACTURI.map((f, i) => (
                    <tr key={i} className="hover:bg-[rgba(255,255,255,0.02)] border-b border-subtle/30 last:border-b-0">
                      <td className="px-3.5 py-3 text-[13px] font-bold text-gold">{f.nr}</td>
                      <td className="px-3.5 py-3 text-[13px]">{f.client}</td>
                      <td className="px-3.5 py-3 text-dim text-xs">{f.date} 2026</td>
                      <td className={`px-3.5 py-3 text-xs ${f.status === 'rest' ? 'text-danger' : 'text-dim'}`}>{f.scad} 2026</td>
                      <td className="px-3.5 py-3 text-sm font-bold text-gold">€{f.val.toLocaleString('ro')}</td>
                      <td className="px-3.5 py-3"><span className={`inline-flex px-2 py-[3px] rounded-[5px] text-[11px] font-semibold ${STATUS_MAP[f.status].cls}`}>{STATUS_MAP[f.status].l}</span></td>
                      <td className="px-3.5 py-3">
                        <div className="flex gap-1">
                          <button onClick={() => toast({ title: `⬇️ ${f.nr}.pdf` })} className="px-2 py-1 rounded-[5px] text-xs border border-subtle text-dim hover:bg-surface2 hover:text-foreground transition-all">⬇️ PDF</button>
                          {f.status !== 'inc' && <button onClick={() => toast({ title: '✅ Marcată ca încasată' })} className="px-2 py-1 rounded-[5px] text-xs border border-gold/30 text-gold bg-gold-dim hover:bg-gold/20 transition-all">✓ Încasată</button>}
                          <button onClick={() => toast({ title: '📧 Reminder trimis' })} className="px-2 py-1 rounded-[5px] text-xs border border-subtle text-dim hover:bg-surface2 hover:text-foreground transition-all">📧</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <Dialog open={newOpen} onOpenChange={setNewOpen}>
        <DialogContent className="bg-surface border-subtle2 max-w-[580px]">
          <DialogHeader>
            <DialogTitle>💰 Înregistrare Comision</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3.5 mb-3.5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold tracking-wider uppercase text-dim">Proprietate</label>
              <select className="bg-surface2 border border-subtle rounded-lg px-3 py-2 text-[13px] text-foreground outline-none focus:border-gold transition-colors">
                {PROPS.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold tracking-wider uppercase text-dim">Client</label>
              <select className="bg-surface2 border border-subtle rounded-lg px-3 py-2 text-[13px] text-foreground outline-none focus:border-gold transition-colors">
                {CLIENTS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3.5 mb-3.5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold tracking-wider uppercase text-dim">Agent Principal</label>
              <select className="bg-surface2 border border-subtle rounded-lg px-3 py-2 text-[13px] text-foreground outline-none focus:border-gold transition-colors">
                {AGENTS.map(a => <option key={a}>{a}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold tracking-wider uppercase text-dim">Agent Co-broker</label>
              <select className="bg-surface2 border border-subtle rounded-lg px-3 py-2 text-[13px] text-foreground outline-none focus:border-gold transition-colors">
                <option value="">— Fără co-broker —</option>
                {AGENTS.map(a => <option key={a}>{a}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3.5 mb-3.5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold tracking-wider uppercase text-dim">Valoare Tranzacție (€)</label>
              <input type="number" value={mVal || ''} onChange={e => setMVal(Number(e.target.value))} placeholder="250000" className="bg-surface2 border border-subtle rounded-lg px-3 py-2 text-[13px] text-foreground outline-none focus:border-gold transition-colors" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold tracking-wider uppercase text-dim">Comision (%)</label>
              <input type="number" value={mPct} onChange={e => setMPct(Number(e.target.value))} className="bg-surface2 border border-subtle rounded-lg px-3 py-2 text-[13px] text-foreground outline-none focus:border-gold transition-colors" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3.5 mb-3.5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold tracking-wider uppercase text-dim">Split Agent (%)</label>
              <input type="number" value={mSplit} onChange={e => setMSplit(Number(e.target.value))} className="bg-surface2 border border-subtle rounded-lg px-3 py-2 text-[13px] text-foreground outline-none focus:border-gold transition-colors" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold tracking-wider uppercase text-dim">Data Tranzacției</label>
              <input type="date" defaultValue="2026-03-04" className="bg-surface2 border border-subtle rounded-lg px-3 py-2 text-[13px] text-foreground outline-none focus:border-gold transition-colors" />
            </div>
          </div>
          <div className="bg-gold-dim border border-gold/15 rounded-lg px-4 py-3.5 mt-1">
            <div className="text-[11px] text-dim font-semibold tracking-wide uppercase mb-2">Previzualizare Calcul</div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <div className="text-[11px] text-dim mb-[3px]">Comision Total</div>
                <div className="text-base font-bold text-gold">{comTotal > 0 ? euro(comTotal) : '—'}</div>
              </div>
              <div>
                <div className="text-[11px] text-dim mb-[3px]">Agent ({mSplit}%)</div>
                <div className="text-base font-bold text-teal">{comTotal > 0 ? euro(comTotal * mSplit / 100) : '—'}</div>
              </div>
              <div>
                <div className="text-[11px] text-dim mb-[3px]">Agenție ({100 - mSplit}%)</div>
                <div className="text-base font-bold text-info-blue">{comTotal > 0 ? euro(comTotal * (100 - mSplit) / 100) : '—'}</div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <button onClick={() => setNewOpen(false)} className="px-4 py-2 rounded-lg text-[13px] font-medium border border-subtle text-dim hover:bg-surface2 transition-all">Anulează</button>
            <button onClick={saveCom} className="px-4 py-2 rounded-lg text-[13px] font-bold bg-gradient-to-r from-[hsl(var(--gold))] to-[hsl(var(--gold2))] text-primary-foreground hover:opacity-90 transition-all">✅ Înregistrează</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
