import Link from "next/link";
import { ArrowRight, CalendarDays, ChevronRight, Gift } from "lucide-react";
import { differenceInCalendarDays, format, parseISO } from "date-fns";
import { OCCASION_EMOJI, OCCASION_LABEL } from "@/lib/occasions";
import Badge from "./Badge";

interface EventCardProps {
  id: string;
  recipient_name: string;
  occasion_type: string;
  event_date: string;
  featured?: boolean;
  href?: string;
}

function initials(name: string) {
  return name.split(/\s+|&/).filter(Boolean).slice(0, 2).map(part => part[0]).join("").toUpperCase();
}

export default function EventCard({ id, recipient_name, occasion_type, event_date, featured = false, href }: EventCardProps) {
  const date = parseISO(event_date);
  const days = differenceInCalendarDays(date, new Date());
  const tone = days <= 7 ? "urgent" : days <= 30 ? "warn" : "default";
  const label = days === 0 ? "Today" : days === 1 ? "Tomorrow" : `in ${days} days`;
  const occasion = OCCASION_LABEL[occasion_type] ?? occasion_type;

  if (featured) {
    return (
      <Link href={href ?? `/events/${id}`} className="group grid overflow-hidden rounded-[26px] bg-gradient-to-br from-primary via-[#162b49] to-[#0f2744] text-white shadow-lift transition hover:-translate-y-1 hover:shadow-[0_32px_70px_-22px_rgba(15,23,42,.55)] lg:grid-cols-[1fr_190px]">
        <div className="p-7 sm:p-9">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-accent px-3 py-1.5 text-[11px] font-extrabold tracking-[0.06em] text-primary">⏰ {label.toUpperCase()}</span>
            <span className="text-xs font-semibold uppercase tracking-[0.1em] text-white/40">Most urgent</span>
          </div>
          <div className="mt-6 flex items-center gap-4 sm:gap-5">
            <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full border-2 border-accent/50 bg-accent/15 text-xl font-extrabold text-accent sm:h-[72px] sm:w-[72px] sm:text-2xl">{initials(recipient_name)}</span>
            <div>
              <h2 className="display-type text-2xl font-bold tracking-[-0.025em] sm:text-3xl">{recipient_name}&apos;s {occasion.toLowerCase()}</h2>
              <p className="mt-2 flex items-center gap-2 text-sm text-white/55"><CalendarDays size={15} /> {format(date, "EEEE, MMMM d")}</p>
            </div>
          </div>
          <div className="mt-7 flex items-center gap-3">
            {[0, 1, 2].map(index => <span key={index} className="grid h-14 w-14 place-items-center rounded-xl border border-white/10 bg-white/5 text-accent"><Gift size={20 - index} strokeWidth={1.5} /></span>)}
            <span className="ml-1 text-xs italic text-white/40">Gift ideas waiting</span>
          </div>
          <span className="mt-7 inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-bold text-primary transition group-hover:bg-accent-300">View gift picks <ArrowRight size={15} /></span>
        </div>
        <div className="hidden border-l border-white/10 bg-white/[.035] p-8 lg:flex lg:flex-col lg:items-center lg:justify-center">
          <span className="display-type text-8xl font-black leading-none tracking-[-0.07em] text-accent">{Math.max(days, 0)}</span>
          <span className="mt-2 text-xs font-bold tracking-[0.14em] text-white/35">DAYS LEFT</span>
        </div>
      </Link>
    );
  }

  return (
    <Link href={href ?? `/events/${id}`} className="group grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-2xl border-b border-cream-200 px-3 py-4 transition hover:translate-x-1 hover:border-transparent hover:bg-white hover:px-5 hover:shadow-soft sm:gap-5">
      <span className="grid h-12 w-12 place-items-center rounded-full bg-accent-100 text-sm font-extrabold text-accent-700">{initials(recipient_name)}</span>
      <div className="min-w-0">
        <h3 className="truncate font-bold tracking-[-0.015em] text-primary">{recipient_name}</h3>
        <p className="mt-1 truncate text-xs text-primary-500">{OCCASION_EMOJI[occasion_type] ?? "🎁"} {occasion} · {format(date, "EEE, MMM d")}</p>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <Badge tone={tone}>{label}</Badge>
        <ChevronRight size={18} className="hidden text-primary-300 transition group-hover:text-primary sm:block" />
      </div>
    </Link>
  );
}
