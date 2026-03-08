import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const calDayHeaders = ["Lu", "Ma", "Mi", "Jo", "Vi", "Sâ", "Du"];

const days = [
  { day: 24, other: true }, { day: 25, other: true }, { day: 26, other: true },
  { day: 27, other: true }, { day: 28, other: true }, { day: 1, event: true }, { day: 2 },
  { day: 3, event: true }, { day: 4, today: true }, { day: 5, event: true },
  { day: 6 }, { day: 7, event: true }, { day: 8 }, { day: 9 },
  { day: 10 }, { day: 11, event: true }, { day: 12 }, { day: 13, event: true },
  { day: 14 }, { day: 15, event: true }, { day: 16 },
];

const events = [
  { time: "10:00", color: "bg-gold", name: "Vizionare · Ap. Floreasca", meta: "Radu & Ioana Marinescu · 📍 B-ul Aviatorilor" },
  { time: "14:30", color: "bg-teal", name: "Semnare Contract · Dorobanți", meta: "Familia Ionescu · Intermediere vânzare" },
  { time: "17:00", color: "bg-info", name: "Vizionare · Casa Baneasa", meta: "Cristian Popescu · 📍 Str. Plopilor" },
];

export function CalendarCard() {
  const navigate = useNavigate();
  const [selectedDay, setSelectedDay] = useState<number | null>(4);

  const handleDayClick = (day: number, isOther?: boolean) => {
    if (isOther) return;
    setSelectedDay(day);
    toast({ title: `📅 ${day} Martie 2026`, description: day === 4 ? "3 evenimente programate azi" : "Niciun eveniment programat." });
  };

  const handleEventClick = (name: string) => {
    navigate("/vizionari");
    toast({ title: "📅 Eveniment", description: `Deschizi detaliile: ${name}` });
  };

  return (
    <div className="bg-surface border border-subtle rounded-xl overflow-hidden">
      <div className="px-5 py-4 flex items-center justify-between border-b border-subtle">
        <div className="text-sm font-semibold flex items-center gap-2">
          <span>📅</span> Calendar Vizionări
        </div>
        <button
          onClick={() => navigate("/vizionari")}
          className="text-xs text-gold font-medium hover:opacity-80 bg-transparent border-none cursor-pointer"
        >
          Martie 2026
        </button>
      </div>
      <div className="px-5 py-2">
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-0.5 mb-3">
          {calDayHeaders.map((h) => (
            <div key={h} className="text-center text-[10px] text-dim2 py-1">{h}</div>
          ))}
          {days.map((d, i) => (
            <div
              key={i}
              onClick={() => handleDayClick(d.day, d.other)}
              className={`text-center text-xs py-1.5 rounded-md cursor-pointer transition-colors relative
                ${d.day === selectedDay && !d.other ? "bg-gold text-primary-foreground font-bold" : ""}
                ${d.other ? "text-dim2 cursor-default" : ""}
                ${d.day !== selectedDay && !d.other && d.event ? "font-semibold" : ""}
                ${d.day !== selectedDay ? "hover:bg-surface2" : ""}
                ${d.day !== selectedDay && !d.other ? "text-dim" : ""}
              `}
            >
              {d.day}
              {d.event && d.day !== selectedDay && (
                <div className="w-1 h-1 bg-teal rounded-full absolute bottom-0 left-1/2 -translate-x-1/2" />
              )}
            </div>
          ))}
        </div>

        {/* Events */}
        {events.map((e, i) => (
          <div
            key={i}
            onClick={() => handleEventClick(e.name)}
            className="flex gap-2.5 items-start py-[9px] border-b border-subtle last:border-b-0 cursor-pointer hover:bg-surface2 rounded-md transition-colors px-1 -mx-1"
          >
            <div className="text-[11px] text-dim2 min-w-[40px] mt-0.5">{e.time}</div>
            <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1 ${e.color}`} />
            <div className="flex-1">
              <div className="text-[13px]">{e.name}</div>
              <div className="text-[11px] text-dim2 mt-0.5">{e.meta}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
