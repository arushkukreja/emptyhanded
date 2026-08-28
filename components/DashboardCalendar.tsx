"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { addMonths, eachDayOfInterval, endOfMonth, endOfWeek, format, isSameDay, isSameMonth, parseISO, startOfMonth, startOfWeek, subMonths } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { OCCASION_LABEL } from "@/lib/occasions";

type CalendarEvent = {
  id: string;
  recipient_name: string;
  occasion_type: string;
  event_date: string;
};

export default function DashboardCalendar({ events }: { events: CalendarEvent[] }) {
  const firstUpcoming = events.find(event => parseISO(event.event_date) >= new Date());
  const [month, setMonth] = useState(() => firstUpcoming ? startOfMonth(parseISO(firstUpcoming.event_date)) : startOfMonth(new Date()));
  const monthDays = useMemo(() => eachDayOfInterval({
    start: startOfWeek(startOfMonth(month), { weekStartsOn: 0 }),
    end: endOfWeek(endOfMonth(month), { weekStartsOn: 0 })
  }), [month]);
  const monthEvents = events.filter(event => isSameMonth(parseISO(event.event_date), month));

  return (
    <div className="overflow-hidden rounded-[28px] border border-cream-200 bg-white shadow-lift">
      <div className="flex items-center justify-between gap-4 border-b border-cream-200 px-5 py-5 sm:px-8">
        <div>
          <p className="eyebrow">All occasions</p>
          <h2 className="display-type mt-1 text-2xl font-black text-primary sm:text-3xl">{format(month, "MMMM yyyy")}</h2>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setMonth(current => subMonths(current, 1))} aria-label="Previous month" className="grid h-10 w-10 place-items-center rounded-full border border-cream-200 text-primary transition hover:border-accent hover:bg-accent-50"><ChevronLeft size={18} /></button>
          <button type="button" onClick={() => setMonth(startOfMonth(new Date()))} className="rounded-full border border-cream-200 px-4 py-2.5 text-xs font-bold text-primary transition hover:border-accent hover:bg-accent-50">Today</button>
          <button type="button" onClick={() => setMonth(current => addMonths(current, 1))} aria-label="Next month" className="grid h-10 w-10 place-items-center rounded-full border border-cream-200 text-primary transition hover:border-accent hover:bg-accent-50"><ChevronRight size={18} /></button>
        </div>
      </div>

      <div className="grid gap-6 p-4 sm:p-7 lg:grid-cols-[minmax(0,1fr)_310px]">
        <div>
          <div className="grid grid-cols-7 text-center text-[10px] font-extrabold uppercase tracking-[0.12em] text-primary-300">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => <span key={day} className="py-2">{day}</span>)}
          </div>
          <div className="grid grid-cols-7 overflow-hidden rounded-2xl border border-cream-200 bg-cream-200 gap-px">
            {monthDays.map(day => {
              const dayEvents = events.filter(event => isSameDay(parseISO(event.event_date), day));
              return (
                <div key={day.toISOString()} className={`min-h-16 bg-white p-1.5 sm:min-h-20 sm:p-2 ${isSameMonth(day, month) ? "" : "opacity-35"}`}>
                  <span className={`grid h-6 w-6 place-items-center rounded-full text-[11px] font-bold ${isSameDay(day, new Date()) ? "bg-accent text-primary" : "text-primary-500"}`}>{format(day, "d")}</span>
                  <div className="mt-1 space-y-1">
                    {dayEvents.slice(0, 2).map(event => <Link key={event.id} href={`/events/${event.id}`} title={`${event.recipient_name} · ${OCCASION_LABEL[event.occasion_type] ?? event.occasion_type}`} className="block truncate rounded bg-primary px-1.5 py-1 text-[9px] font-bold text-white hover:bg-primary-800"><span className="sm:hidden">•</span><span className="hidden sm:inline">{event.recipient_name.split(" ")[0]}</span></Link>)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <aside className="rounded-2xl bg-[#f5f0e8] p-5">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-primary-400">This month · {monthEvents.length}</p>
          <div className="mt-4 space-y-2">
            {monthEvents.length ? monthEvents.map(event => <Link key={event.id} href={`/events/${event.id}`} className="flex items-center justify-between gap-3 rounded-xl bg-white p-3 transition hover:-translate-y-0.5"><span className="min-w-0"><strong className="block truncate text-sm text-primary">{event.recipient_name}</strong><span className="mt-0.5 block text-xs text-primary-400">{OCCASION_LABEL[event.occasion_type] ?? event.occasion_type}</span></span><time className="shrink-0 text-xs font-bold text-accent-700">{format(parseISO(event.event_date), "MMM d")}</time></Link>) : <p className="rounded-xl bg-white p-4 text-sm leading-6 text-primary-500">No occasions this month. Navigate to another month or add a new event.</p>}
          </div>
        </aside>
      </div>
    </div>
  );
}
