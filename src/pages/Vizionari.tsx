import { useState, useCallback } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

// ─── DATA ───
const MONTHS = ['Ianuarie','Februarie','Martie','Aprilie','Mai','Iunie','Iulie','August','Septembrie','Octombrie','Noiembrie','Decembrie'];

interface Vizionare {
  id: number; prop: string; client: string; agent: string; date: string; time: string;
  status: 'confirmat'|'asteptare'|'anulat'|'finalizat'; rating: number; interest: string; color: string;
}

const INITIAL_DATA: Vizionare[] = [
  { id:1, prop:'Apartament 3 cam. Floreasca', client:'Mihai Popescu', agent:'Maria Popa', date:'04 Mar 2026', time:'09:00', status:'confirmat', rating:4, interest:'Ofertă', color:'hsl(40,100%,47%)' },
  { id:2, prop:'Penthouse Aviatorilor 180mp', client:'Elena Dumitrescu', agent:'Andrei Ionescu', date:'04 Mar 2026', time:'11:30', status:'confirmat', rating:5, interest:'Face Ofertă', color:'hsl(217,85%,65%)' },
  { id:3, prop:'Vila Baneasa 450mp', client:'Cristian Marin', agent:'Alex Gheorghiu', date:'04 Mar 2026', time:'15:00', status:'asteptare', rating:0, interest:'', color:'hsl(270,70%,75%)' },
  { id:4, prop:'Studio Pipera 45mp', client:'Ioana Stancu', agent:'Andrei Ionescu', date:'05 Mar 2026', time:'10:00', status:'confirmat', rating:3, interest:'Alt imobil', color:'hsl(165,87%,43%)' },
  { id:5, prop:'Garsonieră Titan', client:'Dan Stoica', agent:'Maria Popa', date:'06 Mar 2026', time:'14:30', status:'asteptare', rating:0, interest:'', color:'hsl(40,100%,47%)' },
  { id:6, prop:'Casa Otopeni 300mp', client:'Ana Ionescu', agent:'Alex Gheorghiu', date:'01 Mar 2026', time:'10:00', status:'finalizat', rating:5, interest:'Ofertă', color:'hsl(165,87%,43%)' },
  { id:7, prop:'Apartament 2 cam. Titan', client:'Sorin Lungu', agent:'Andrei Ionescu', date:'28 Feb 2026', time:'11:00', status:'anulat', rating:0, interest:'', color:'hsl(0,100%,69%)' },
  { id:8, prop:'Garsonieră Drumul Taberei', client:'Laura Dinu', agent:'Maria Popa', date:'27 Feb 2026', time:'16:00', status:'finalizat', rating:4, interest:'A doua vizionare', color:'hsl(270,70%,75%)' },
];

const CAL_EVENTS: Record<number, string[]> = {
  4:['blue 09:00 Floreasca','gold 11:30 Aviatorilor','purple 15:00 Baneasa'],
  5:['teal 10:00 Pipera'], 6:['gold 14:30 Titan'], 10:['blue 09:00 Dorobanți'],
  12:['gold 15:00 Otopeni'], 18:['blue 10:00 Floreasca'], 22:['purple 11:00 Titan'], 25:['teal 14:00 Pipera'],
};

const PRE_CHECK = ['Confirmat întâlnirea cu clientul (telefon/SMS)','Verificat accesul la proprietate (cheie/cod)','Pregătit documentație proprietate','Verificat utilitățile funcționale (lumina, apa)','Curățenie și prezentare optimă','Pregătit materiale marketing (broșură, poze)','Parcare disponibilă pentru client','Verificat temperatura ambientală'];
const POST_CHECK = ['Completat formularul de feedback','Trimis email de mulțumire clientului','Actualizat statusul în CRM','Notat obiecțiile și interesul clientului','Programat follow-up la 24h','Actualizat statistici vizionare','Verificat dacă clientul dorește altă proprietate'];

const PROPS_LIST = ['Apartament 3 cam. Floreasca','Penthouse Aviatorilor 180mp','Vila Baneasa 450mp','Studio Pipera 45mp','Garsonieră Titan'];
const CLIENTS_LIST = ['Mihai Popescu','Elena Dumitrescu','Cristian Marin','Ioana Stancu','Dan Stoica'];
const AGENTS_LIST = ['Andrei Ionescu','Maria Popa','Alex Gheorghiu'];

const STATUS_LABELS: Record<string, string> = { confirmat:'Confirmat', asteptare:'Așteptare', anulat:'Anulat', finalizat:'Finalizat' };
const STATUS_CLASSES: Record<string, string> = {
  confirmat:'bg-teal-dim text-teal', asteptare:'bg-[hsl(40_100%_47%/0.12)] text-gold',
  anulat:'bg-red-dim text-danger', finalizat:'bg-blue-dim text-info-blue',
};

const EVENT_COLORS: Record<string, string> = {
  blue: 'bg-blue-dim text-info-blue', gold: 'bg-gold-dim text-gold',
  teal: 'bg-teal-dim text-teal', purple: 'bg-purple-dim text-purple',
};

// ─── COMPONENT ───
export default function Vizionari() {
  const { toast } = useToast();
  const [tab, setTab] = useState<'calendar'|'list'|'checklist'|'raport'>('calendar');
  const [data, setData] = useState<Vizionare[]>(INITIAL_DATA);
  const [curMonth, setCurMonth] = useState(2); // March
  const [curYear, setCurYear] = useState(2026);

  // Modals
  const [newOpen, setNewOpen] = useState(false);
  const [fbOpen, setFbOpen] = useState(false);
  const [fbProp, setFbProp] = useState('');
  const [starRating, setStarRating] = useState(0);
  const [curInterest, setCurInterest] = useState('');
  const [fbNotes, setFbNotes] = useState('');

  // New form
  const [nvProp, setNvProp] = useState(PROPS_LIST[0]);
  const [nvClient, setNvClient] = useState(CLIENTS_LIST[0]);
  const [nvAgent, setNvAgent] = useState(AGENTS_LIST[0]);
  const [nvDate, setNvDate] = useState('2026-03-06');
  const [nvTime, setNvTime] = useState('10:00');
  const [nvDuration, setNvDuration] = useState('45');
  const [nvNotes, setNvNotes] = useState('');

  // Checklists
  const [preChecked, setPreChecked] = useState<boolean[]>(new Array(PRE_CHECK.length).fill(false));
  const [postChecked, setPostChecked] = useState<boolean[]>(new Array(POST_CHECK.length).fill(false));

  const initials = (name: string) => name.split(' ').map(w => w[0]).join('');

  const changeMonth = (dir: number) => {
    let m = curMonth + dir, y = curYear;
    if (m > 11) { m = 0; y++; } if (m < 0) { m = 11; y--; }
    setCurMonth(m); setCurYear(y);
  };

  const saveViz = () => {
    const newV: Vizionare = {
      id: Date.now(), prop: nvProp, client: nvClient, agent: nvAgent,
      date: nvDate, time: nvTime, status: 'asteptare', rating: 0, interest: '', color: 'hsl(40,100%,47%)',
    };
    setData(prev => [newV, ...prev]);
    setNewOpen(false);
    toast({ title: '✅ Vizionare programată!', description: 'Notificare SMS trimisă clientului.' });
  };

  const openFeedback = (prop: string) => {
    setFbProp(prop); setStarRating(0); setCurInterest(''); setFbNotes(''); setFbOpen(true);
  };

  const saveFeedback = () => {
    setFbOpen(false);
    toast({ title: '⭐ Feedback salvat!', description: `${starRating ? `${starRating}/5★` : ''}${curInterest ? ` · ${curInterest}` : ''}. Follow-up setat la 24h.` });
  };

  // ─── Calendar rendering ───
  const renderCalendar = useCallback(() => {
    const firstDay = new Date(curYear, curMonth, 1).getDay();
    const offset = firstDay === 0 ? 6 : firstDay - 1;
    const daysInMonth = new Date(curYear, curMonth + 1, 0).getDate();
    const prevMonthDays = new Date(curYear, curMonth, 0).getDate();
    const cells: React.ReactNode[] = [];

    for (let i = 0; i < offset; i++) {
      cells.push(
        <div key={`p${i}`} className="min-h-[72px] bg-surface2 rounded-[7px] p-[5px] opacity-30">
          <div className="text-[11px] font-semibold text-dim2">{prevMonthDays - offset + 1 + i}</div>
        </div>
      );
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const isToday = d === 4 && curMonth === 2 && curYear === 2026;
      const events = CAL_EVENTS[d] || [];
      cells.push(
        <div
          key={d}
          onClick={() => toast({ title: `📅 ${d} ${MONTHS[curMonth]}`, description: `${events.length} vizionări programate` })}
          className={`min-h-[72px] bg-surface2 rounded-[7px] p-[5px] cursor-pointer transition-all border ${isToday ? 'border-gold' : 'border-transparent hover:border-gold/25'}`}
        >
          <div className={`text-[11px] font-semibold mb-[3px] ${isToday ? 'text-gold font-bold' : 'text-dim2'}`}>{d}</div>
          {events.map((e, i) => {
            const [colorKey, ...rest] = e.split(' ');
            return (
              <div key={i} className={`text-[9.5px] px-1 py-[2px] rounded-[3px] mb-[2px] leading-tight truncate ${EVENT_COLORS[colorKey] || ''}`}>
                {rest.join(' ')}
              </div>
            );
          })}
        </div>
      );
    }
    return cells;
  }, [curMonth, curYear, toast]);

  // ─── TABS ───
  const TABS: { id: typeof tab; label: string }[] = [
    { id: 'calendar', label: '📅 Calendar' },
    { id: 'list', label: '📋 Listă' },
    { id: 'checklist', label: '✅ Checklist' },
    { id: 'raport', label: '📊 Raport' },
  ];

  // ─── RAPORT DATA ───
  const convProps = [
    { n:'Apt Floreasca', viz:24, conv:8 }, { n:'Penthouse Avia.', viz:18, conv:7 },
    { n:'Vila Baneasa', viz:12, conv:3 }, { n:'Studio Pipera', viz:20, conv:5 }, { n:'Casa Otopeni', viz:9, conv:4 },
  ];
  const ratingBars = [{ s:5, c:42 },{ s:4, c:35 },{ s:3, c:15 },{ s:2, c:5 },{ s:1, c:3 }];
  const topProps = [{ n:'Floreasca 3cam', v:24 },{ n:'Studio Pipera', v:20 },{ n:'Penthouse Avia.', v:18 },{ n:'Vila Baneasa', v:12 },{ n:'Casa Otopeni', v:9 }];
  const monthData = { labels:['Oct','Nov','Dec','Ian','Feb','Mar'], vals:[32,28,41,38,35,43] };
  const maxMonth = Math.max(...monthData.vals);

  return (
    <DashboardLayout>
      {/* Custom topbar */}
      <div className="bg-surface border-b border-subtle px-4 md:px-7 h-[52px] md:h-[58px] flex items-center gap-2 md:gap-4 sticky top-0 z-40">
        <div className="flex items-center gap-1.5 text-[13px] text-dim">
          <a href="/" className="hover:text-gold transition-colors">SocietyHUB</a>
          <span className="text-dim2">›</span>
          <span className="text-foreground font-medium">📅 Vizionări</span>
        </div>
        <div className="ml-auto flex items-center gap-1.5 md:gap-2.5">
          <button onClick={() => setTab('raport')} className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium border border-subtle text-dim hover:bg-surface2 hover:text-foreground transition-all">📊 Raport</button>
          <button onClick={() => toast({ title: '📤 Export Calendar .ics' })} className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium border border-subtle text-dim hover:bg-surface2 hover:text-foreground transition-all">📤 Export</button>
          <button onClick={() => setNewOpen(true)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] md:text-[12px] font-bold bg-gradient-to-r from-[hsl(var(--gold))] to-[hsl(var(--gold2))] text-primary-foreground hover:opacity-90 transition-all"><span className="hidden md:inline">＋ Programează Vizionare</span><span className="md:hidden">＋ Vizionare</span></button>
        </div>
      </div>

      <div className="p-4 md:p-6 flex flex-col gap-4 md:gap-5">
        {/* KPI STATS */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5 md:gap-3.5 animate-fade-up">
          {[
            { label:'Vizionări Azi', value:'3', sub:'08:00 – 17:00', accent:'gradient-gold-bottom' },
            { label:'Săptămâna Aceasta', value:'8', sub:'↑ +2 față de prev', accent:'gradient-blue-bottom', green: true },
            { label:'Rată Conversie', value:'28%', sub:'viz → ofertă', accent:'gradient-teal-bottom' },
            { label:'Feedback Primit', value:'94%', sub:'din total vizionări', accent:'bg-purple' },
            { label:'Scor Mediu', value:'4.2★', sub:'satisfacție client', accent:'bg-[hsl(var(--gold))]' },
          ].map((s, i) => (
            <div key={i} className="bg-surface border border-subtle rounded-xl p-4 relative overflow-hidden hover:border-gold/25 hover:-translate-y-px transition-all">
              <div className={`absolute top-0 left-0 right-0 h-[2px] ${s.accent}`} />
              <div className="text-[10px] font-semibold tracking-wider uppercase text-dim mb-1.5">{s.label}</div>
              <div className="font-serif text-2xl font-bold leading-none">{s.value}</div>
              <div className={`text-[11px] mt-1 ${s.green ? 'text-teal' : 'text-dim'}`}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* TABS */}
        <div className="flex items-center gap-3.5 animate-fade-up-delay-1">
          <div className="flex gap-0.5 bg-surface border border-subtle rounded-[10px] p-1">
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-4 py-2 rounded-[7px] text-[13px] font-medium transition-all ${tab === t.id ? 'bg-surface2 text-foreground shadow-md' : 'text-dim hover:text-foreground'}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* ═══ CALENDAR TAB ═══ */}
        {tab === 'calendar' && (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 animate-fade-up-delay-2">
            <div className="bg-surface border border-subtle rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-subtle flex items-center gap-3">
                <div className="font-serif text-sm font-bold">{MONTHS[curMonth]} {curYear}</div>
                <div className="flex gap-1 ml-auto">
                  <button onClick={() => changeMonth(-1)} className="bg-surface2 border border-subtle rounded-[7px] px-2.5 py-1 text-[13px] hover:border-gold hover:text-gold transition-all">◀</button>
                  <button onClick={() => changeMonth(1)} className="bg-surface2 border border-subtle rounded-[7px] px-2.5 py-1 text-[13px] hover:border-gold hover:text-gold transition-all">▶</button>
                </div>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-7 gap-0.5 mb-1">
                  {['Lun','Mar','Mie','Joi','Vin','Sâm','Dum'].map(d => (
                    <div key={d} className="text-center text-[10.5px] font-bold tracking-wide uppercase text-dim p-1">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-0.5">
                  {renderCalendar()}
                </div>
              </div>
            </div>

            {/* Side panel */}
            <div className="flex flex-col gap-3">
              <div className="bg-surface border border-subtle rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-subtle flex items-center justify-between">
                  <div className="font-serif text-[12.5px] font-bold">📅 Vizionări Azi</div>
                  <span className="text-[11px] text-gold font-semibold">4 Mar 2026</span>
                </div>
                {data.filter(v => v.date === '04 Mar 2026').map(v => (
                  <div key={v.id} onClick={() => openFeedback(v.prop)} className="px-3.5 py-3 border-b border-subtle cursor-pointer hover:bg-surface2 transition-colors last:border-b-0">
                    <div className="font-serif text-[12px] font-bold text-gold mb-0.5">{v.time} – {parseInt(v.time) < 12 ? `${parseInt(v.time)}:45` : `${parseInt(v.time)+1}:15`}</div>
                    <div className="text-[13px] font-medium mb-0.5">{v.prop}</div>
                    <div className="text-[11.5px] text-dim">👤 {v.client} · {v.agent}</div>
                    <span className={`inline-flex px-1.5 py-0.5 rounded text-[10.5px] font-semibold mt-1 ${STATUS_CLASSES[v.status]}`}>
                      {v.status === 'confirmat' ? '✓' : '⏳'} {STATUS_LABELS[v.status]}
                    </span>
                  </div>
                ))}
              </div>
              <div className="bg-surface border border-subtle rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-subtle">
                  <div className="font-serif text-[12.5px] font-bold">⏰ Urmează</div>
                </div>
                <div className="px-3.5 py-3 border-b border-subtle">
                  <div className="font-serif text-[12px] font-bold text-gold">Mâine 10:00</div>
                  <div className="text-[13px] font-medium">Studio Pipera 45mp</div>
                  <div className="text-[11.5px] text-dim">👤 Ioana Stancu</div>
                </div>
                <div className="px-3.5 py-3">
                  <div className="font-serif text-[12px] font-bold text-gold">6 Mar 14:30</div>
                  <div className="text-[13px] font-medium">Garsonieră Titan</div>
                  <div className="text-[11.5px] text-dim">👤 Dan Stoica</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══ LIST TAB ═══ */}
        {tab === 'list' && (
          <div className="flex flex-col gap-2.5 animate-fade-up-delay-2">
            {data.map(v => (
              <div key={v.id} className="bg-surface border border-subtle rounded-xl px-3 md:px-5 py-3 md:py-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4 hover:border-gold/20 hover:-translate-y-px transition-all">
                <div className="w-11 h-11 rounded-[10px] flex items-center justify-center font-serif font-bold text-sm text-primary-foreground shrink-0" style={{ background: v.color }}>
                  {initials(v.client)}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold">{v.prop}</div>
                  <div className="flex gap-4 text-[12px] text-dim mt-1">
                    <span>👤 {v.client}</span><span>🧑‍💼 {v.agent}</span><span>📅 {v.date} {v.time}</span>
                    {v.rating > 0 && <span>{'★'.repeat(v.rating)}{'☆'.repeat(5 - v.rating)} ({v.rating}/5)</span>}
                  </div>
                </div>
                <span className={`inline-flex px-2 py-1 rounded-[5px] text-[11.5px] font-semibold ${STATUS_CLASSES[v.status]}`}>
                  {STATUS_LABELS[v.status]}
                </span>
                <div className="flex gap-1.5">
                  {(v.status === 'confirmat' || v.status === 'asteptare') && (
                    <button onClick={() => openFeedback(v.prop)} className="px-2 py-1 rounded-[5px] text-[11.5px] border border-gold/30 text-gold bg-gold-dim hover:bg-gold/20 transition-all">⭐ Feedback</button>
                  )}
                  <button onClick={() => toast({ title: `📞 Apel inițiat: ${v.client}` })} className="px-2 py-1 rounded-[5px] text-[11.5px] border border-subtle text-dim hover:bg-surface2 hover:text-foreground transition-all">📞</button>
                  <button onClick={() => toast({ title: '📤 WhatsApp trimis' })} className="px-2 py-1 rounded-[5px] text-[11.5px] border border-subtle text-dim hover:bg-surface2 hover:text-foreground transition-all">💬</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ═══ CHECKLIST TAB ═══ */}
        {tab === 'checklist' && (
          <div className="grid grid-cols-2 gap-4 animate-fade-up-delay-2">
            <div className="bg-surface border border-subtle rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-subtle flex items-center justify-between">
                <div className="font-serif text-[12.5px] font-bold">✅ Pre-Vizionare</div>
                <span className="text-[11px] text-dim">Floreasca – 04 Mar</span>
              </div>
              <div className="p-4">
                {PRE_CHECK.map((item, i) => (
                  <div key={i} onClick={() => setPreChecked(p => { const n = [...p]; n[i] = !n[i]; return n; })} className="flex items-center gap-2.5 py-2 border-b border-subtle/30 cursor-pointer last:border-b-0">
                    <div className={`w-[18px] h-[18px] rounded flex items-center justify-center shrink-0 text-[11px] transition-all ${preChecked[i] ? 'bg-teal border-teal text-primary-foreground' : 'border-[1.5px] border-subtle2'}`}>
                      {preChecked[i] && '✓'}
                    </div>
                    <span className={`text-[13px] transition-colors ${preChecked[i] ? 'text-dim line-through' : ''}`}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-surface border border-subtle rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-subtle flex items-center justify-between">
                <div className="font-serif text-[12.5px] font-bold">📋 Post-Vizionare</div>
                <span className="text-[11px] text-dim">Floreasca – 04 Mar</span>
              </div>
              <div className="p-4">
                {POST_CHECK.map((item, i) => (
                  <div key={i} onClick={() => setPostChecked(p => { const n = [...p]; n[i] = !n[i]; return n; })} className="flex items-center gap-2.5 py-2 border-b border-subtle/30 cursor-pointer last:border-b-0">
                    <div className={`w-[18px] h-[18px] rounded flex items-center justify-center shrink-0 text-[11px] transition-all ${postChecked[i] ? 'bg-teal border-teal text-primary-foreground' : 'border-[1.5px] border-subtle2'}`}>
                      {postChecked[i] && '✓'}
                    </div>
                    <span className={`text-[13px] transition-colors ${postChecked[i] ? 'text-dim line-through' : ''}`}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══ RAPORT TAB ═══ */}
        {tab === 'raport' && (
          <div className="grid grid-cols-2 gap-4 animate-fade-up-delay-2">
            {/* Conversie */}
            <div className="bg-surface border border-subtle rounded-xl p-5">
              <div className="font-serif text-[13px] font-bold mb-4">📈 Conversie per Proprietate</div>
              {convProps.map((p, i) => (
                <div key={i} className="flex items-center gap-2.5 mb-2">
                  <div className="text-[12px] w-[140px] text-dim">{p.n}</div>
                  <div className="flex-1 h-[7px] bg-surface2 rounded overflow-hidden">
                    <div className="h-full rounded bg-gold" style={{ width: `${Math.round(p.conv / p.viz * 100)}%` }} />
                  </div>
                  <div className="font-serif text-[12px] font-bold text-gold w-10 text-right">{Math.round(p.conv / p.viz * 100)}%</div>
                </div>
              ))}
            </div>

            {/* Feedback */}
            <div className="bg-surface border border-subtle rounded-xl p-5">
              <div className="font-serif text-[13px] font-bold mb-4">⭐ Feedback Clienți</div>
              <div className="flex justify-center items-center gap-5 py-3 mb-4">
                <div className="text-center">
                  <div className="font-serif text-[42px] font-extrabold text-gold">4.2</div>
                  <div className="text-[13px] text-dim">Scor Mediu</div>
                </div>
                <div className="flex-1">
                  {ratingBars.map((r, i) => (
                    <div key={i} className="flex items-center gap-2.5 mb-2">
                      <div className="text-[12px] w-[60px] text-dim">{'★'.repeat(r.s)}</div>
                      <div className="flex-1 h-[7px] bg-surface2 rounded overflow-hidden">
                        <div className="h-full rounded bg-[hsl(var(--gold))]" style={{ width: `${r.c}%` }} />
                      </div>
                      <div className="text-[12px] text-dim w-10 text-right">{r.c}%</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top Proprietăți */}
            <div className="bg-surface border border-subtle rounded-xl p-5">
              <div className="font-serif text-[13px] font-bold mb-4">🏆 Top Proprietăți Vizionate</div>
              {topProps.map((t, i) => (
                <div key={i} className="flex items-center gap-2.5 mb-2">
                  <div className="font-serif text-[13px] font-bold text-dim w-[18px]">#{i + 1}</div>
                  <div className="flex-1 text-[13px]">{t.n}</div>
                  <div className="w-20 h-[7px] bg-surface2 rounded overflow-hidden">
                    <div className="h-full rounded bg-info-blue" style={{ width: `${t.v / 24 * 100}%` }} />
                  </div>
                  <div className="font-serif text-[12px] font-bold text-info-blue">{t.v}</div>
                </div>
              ))}
            </div>

            {/* Vizionări / Lună */}
            <div className="bg-surface border border-subtle rounded-xl p-5">
              <div className="font-serif text-[13px] font-bold mb-4">📅 Vizionări / Lună</div>
              <div className="flex items-end gap-1.5 h-[100px] pb-1">
                {monthData.vals.map((v, i) => (
                  <div key={i} className="flex-1 rounded-t" style={{ height: `${v / maxMonth * 100}%`, background: `hsl(40 100% 47% / ${0.2 + i * 0.12})` }} title={`${v} vizionări`} />
                ))}
              </div>
              <div className="flex gap-1.5 mt-1">
                {monthData.labels.map((m, i) => (
                  <div key={i} className="flex-1 text-center text-[10.5px] text-dim">
                    {m}<br /><span className="font-serif text-[11px] font-bold text-foreground">{monthData.vals[i]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ═══ NEW VIZIONARE MODAL ═══ */}
      <Dialog open={newOpen} onOpenChange={setNewOpen}>
        <DialogContent className="bg-surface border-subtle2 max-w-[580px]">
          <DialogHeader>
            <DialogTitle className="font-serif">📅 Programează Vizionare</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3.5 mb-3.5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10.5px] font-bold tracking-wider uppercase text-dim">Proprietate</label>
              <select value={nvProp} onChange={e => setNvProp(e.target.value)} className="bg-surface2 border border-subtle rounded-lg px-3 py-2 text-[13px] text-foreground outline-none focus:border-gold transition-colors">
                {PROPS_LIST.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10.5px] font-bold tracking-wider uppercase text-dim">Client</label>
              <select value={nvClient} onChange={e => setNvClient(e.target.value)} className="bg-surface2 border border-subtle rounded-lg px-3 py-2 text-[13px] text-foreground outline-none focus:border-gold transition-colors">
                {CLIENTS_LIST.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3.5 mb-3.5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10.5px] font-bold tracking-wider uppercase text-dim">Data</label>
              <input type="date" value={nvDate} onChange={e => setNvDate(e.target.value)} className="bg-surface2 border border-subtle rounded-lg px-3 py-2 text-[13px] text-foreground outline-none focus:border-gold transition-colors" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10.5px] font-bold tracking-wider uppercase text-dim">Ora</label>
              <input type="time" value={nvTime} onChange={e => setNvTime(e.target.value)} className="bg-surface2 border border-subtle rounded-lg px-3 py-2 text-[13px] text-foreground outline-none focus:border-gold transition-colors" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3.5 mb-3.5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10.5px] font-bold tracking-wider uppercase text-dim">Agent Responsabil</label>
              <select value={nvAgent} onChange={e => setNvAgent(e.target.value)} className="bg-surface2 border border-subtle rounded-lg px-3 py-2 text-[13px] text-foreground outline-none focus:border-gold transition-colors">
                {AGENTS_LIST.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10.5px] font-bold tracking-wider uppercase text-dim">Durată (min)</label>
              <select value={nvDuration} onChange={e => setNvDuration(e.target.value)} className="bg-surface2 border border-subtle rounded-lg px-3 py-2 text-[13px] text-foreground outline-none focus:border-gold transition-colors">
                {['30','45','60','90'].map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10.5px] font-bold tracking-wider uppercase text-dim">Note</label>
            <textarea value={nvNotes} onChange={e => setNvNotes(e.target.value)} placeholder="Informații speciale, acces, parcare…" className="bg-surface2 border border-subtle rounded-lg px-3 py-2 text-[13px] text-foreground outline-none focus:border-gold transition-colors resize-y min-h-[70px]" />
          </div>
          <DialogFooter>
            <button onClick={() => setNewOpen(false)} className="px-4 py-2 rounded-lg text-[13px] font-medium border border-subtle text-dim hover:bg-surface2 transition-all">Anulează</button>
            <button onClick={saveViz} className="px-4 py-2 rounded-lg text-[13px] font-bold bg-gradient-to-r from-[hsl(var(--gold))] to-[hsl(var(--gold2))] text-primary-foreground hover:opacity-90 transition-all">✅ Programează</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ═══ FEEDBACK MODAL ═══ */}
      <Dialog open={fbOpen} onOpenChange={setFbOpen}>
        <DialogContent className="bg-surface border-subtle2 max-w-[580px]">
          <DialogHeader>
            <DialogTitle className="font-serif">⭐ Feedback — {fbProp.slice(0, 25)}</DialogTitle>
          </DialogHeader>
          <div className="bg-surface2 rounded-lg px-3.5 py-3 mb-4 text-[13px]">
            📌 <strong>{fbProp}</strong> · 👤 Mihai Popescu · 🕘 04 Mar 2026 09:00
          </div>
          <div className="mb-4">
            <div className="text-[13px] font-medium mb-2.5">Cum evaluează clientul proprietatea?</div>
            <div className="flex gap-1">
              {[1,2,3,4,5].map(n => (
                <span key={n} onClick={() => setStarRating(n)} className={`text-2xl cursor-pointer transition-opacity ${n <= starRating ? 'opacity-100' : 'opacity-30'}`}>★</span>
              ))}
            </div>
          </div>
          <div className="mb-3.5">
            <div className="text-[13px] font-medium mb-2">Interes de continuare:</div>
            <div className="flex gap-2 flex-wrap">
              {[
                { icon: '💰', label: 'Face Ofertă' },
                { icon: '🔍', label: 'Vrea Alt Imobil' },
                { icon: '🔄', label: 'A doua vizionare' },
                { icon: '❌', label: 'Nu e interesat' },
              ].map(opt => (
                <button
                  key={opt.label}
                  onClick={() => setCurInterest(opt.label)}
                  className={`px-2.5 py-1 rounded-[5px] text-[11.5px] border transition-all ${curInterest === opt.label ? 'border-gold/30 text-gold bg-gold-dim' : 'border-subtle text-dim hover:bg-surface2 hover:text-foreground'}`}
                >
                  {opt.icon} {opt.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10.5px] font-bold tracking-wider uppercase text-dim">Observații client</label>
            <textarea value={fbNotes} onChange={e => setFbNotes(e.target.value)} placeholder="Ce a plăcut, ce nu a plăcut, obiecții…" className="bg-surface2 border border-subtle rounded-lg px-3 py-2 text-[13px] text-foreground outline-none focus:border-gold transition-colors resize-y min-h-[70px]" />
          </div>
          <DialogFooter>
            <button onClick={() => setFbOpen(false)} className="px-4 py-2 rounded-lg text-[13px] font-medium border border-subtle text-dim hover:bg-surface2 transition-all">Anulează</button>
            <button onClick={saveFeedback} className="px-4 py-2 rounded-lg text-[13px] font-bold bg-gradient-to-r from-[hsl(var(--gold))] to-[hsl(var(--gold2))] text-primary-foreground hover:opacity-90 transition-all">✅ Salvează Feedback</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
