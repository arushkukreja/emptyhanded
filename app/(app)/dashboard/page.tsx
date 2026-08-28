import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Gift, Heart, Package, Plus } from "lucide-react";
import { differenceInCalendarDays, format, parseISO } from "date-fns";
import { createClient } from "@/lib/supabase/server";
import { getProductImage } from "@/lib/product-images";
import { getBudgetLabel, OCCASION_LABEL } from "@/lib/occasions";
import { getPrivateProfileImageUrl } from "@/lib/media";
import EmptyState from "@/components/EmptyState";
import Button from "@/components/Button";
import DashboardCalendar from "@/components/DashboardCalendar";
import DashboardSwipeCards from "@/components/DashboardSwipeCards";

export const dynamic = "force-dynamic";

type EventRow = { id: string; recipient_name: string; occasion_type: string; event_date: string };
type ProfileRow = { event_id: string; relationship: string | null; archetypes: string[]; interests: string | null; budget_tier: string | null; avatar_path: string | null };
type SavedRecommendation = { id: string; event_id: string; product_name: string; amazon_url: string; budget_range: string | null };
type BestMatch = SavedRecommendation & { asin: string | null; image_url?: string | null };

function initials(name: string) {
  return name.split(/\s+|&/).filter(Boolean).slice(0, 2).map(part => part[0]).join("").toUpperCase();
}

function profileSummary(profile: ProfileRow | undefined) {
  if (!profile) return "Open their profile to revisit the details behind each recommendation.";
  const parts = [profile.relationship, ...profile.archetypes.slice(0, 2), profile.interests].filter(Boolean);
  return parts.length > 0 ? parts.join(" · ") : "Their gift profile is ready for thoughtful recommendations.";
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const today = new Date();
  const todayString = format(today, "yyyy-MM-dd");
  const [{ data: userProfile }, { data: events, error: eventsError }] = await Promise.all([
    supabase.from("users").select("display_name").eq("id", user.id).maybeSingle(),
    supabase.from("events").select("id, recipient_name, occasion_type, event_date").order("event_date", { ascending: true })
  ]);
  if (eventsError) throw eventsError;

  const profileName = userProfile?.display_name ?? user.user_metadata?.full_name ?? user.user_metadata?.name;
  const firstName = typeof profileName === "string" && profileName.trim() ? profileName.trim().split(/\s+/)[0] : "there";
  const allEvents = (events ?? []) as EventRow[];
  const upcoming = allEvents.filter(event => event.event_date >= todayString);
  const eventIds = allEvents.map(event => event.id);
  let profiles: ProfileRow[] = [];
  let savedRecommendations: SavedRecommendation[] = [];

  if (eventIds.length > 0) {
    const [{ data: profileRows, error: profilesError }, { data: recRows, error: recsError }] = await Promise.all([
      supabase.from("recipient_profiles").select("event_id, relationship, archetypes, interests, budget_tier, avatar_path").in("event_id", eventIds),
      supabase.from("recommendations").select("id, event_id, product_name, amazon_url, budget_range").in("event_id", eventIds).eq("is_saved", true).order("created_at", { ascending: false })
    ]);
    if (profilesError) throw profilesError;
    if (recsError) throw recsError;
    profiles = (profileRows ?? []) as ProfileRow[];
    savedRecommendations = (recRows ?? []) as SavedRecommendation[];
  }

  const avatarEntries = await Promise.all(profiles.map(async profile => [profile.event_id, await getPrivateProfileImageUrl(profile.avatar_path)] as const));
  const avatarByEvent = new Map(avatarEntries);
  const profileByEvent = new Map(profiles.map(profile => [profile.event_id, profile]));
  const savedByEvent = new Map<string, SavedRecommendation[]>();
  for (const recommendation of savedRecommendations) {
    const items = savedByEvent.get(recommendation.event_id) ?? [];
    items.push(recommendation);
    savedByEvent.set(recommendation.event_id, items);
  }

  const first = upcoming[0];
  let bestMatch: BestMatch | null = null;
  if (first) {
    const { data: matchRows } = await supabase
      .from("recommendations")
      .select("id, event_id, product_name, amazon_url, budget_range, asin, created_at")
      .eq("event_id", first.id)
      .order("created_at", { ascending: false })
      .order("id", { ascending: true })
      .limit(1);
    bestMatch = (matchRows?.[0] as BestMatch | undefined) ?? null;
    if (bestMatch?.asin) {
      const { data: product } = await supabase.from("products").select("image_url").eq("asin", bestMatch.asin).maybeSingle();
      bestMatch.image_url = product?.image_url ?? null;
    }
  }

  const peopleByName = new Map<string, { event: EventRow; profile?: ProfileRow; avatarUrl: string | null; eventCount: number }>();
  for (const event of allEvents) {
    const key = event.recipient_name.trim().toLocaleLowerCase();
    const existing = peopleByName.get(key);
    const shouldReplace = !existing || (existing.event.event_date < todayString && event.event_date >= todayString);
    if (shouldReplace) {
      peopleByName.set(key, { event, profile: profileByEvent.get(event.id), avatarUrl: avatarByEvent.get(event.id) ?? null, eventCount: (existing?.eventCount ?? 0) + 1 });
    } else if (existing) {
      existing.eventCount += 1;
    }
  }
  const people = Array.from(peopleByName.values()).sort((a, b) => a.event.recipient_name.localeCompare(b.event.recipient_name));
  const dueSoon = upcoming.filter(event => {
    const days = differenceInCalendarDays(parseISO(event.event_date), today);
    return days >= 0 && days <= 14;
  }).length;

  return (
    <div className="bg-[#fbfaf7]">
      <div className="mx-auto max-w-[1280px] px-4 py-8 pb-24 min-[390px]:px-5 sm:px-8 sm:py-10 lg:px-12 lg:py-14">
        <header className="border-b border-cream-200 pb-8 lg:flex lg:items-end lg:justify-between">
          <div>
            <p className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-accent-600"><span className="h-2 w-2 rounded-full bg-accent" />{format(today, "EEEE, MMMM d")}</p>
            <h1 className="display-type mt-5 max-w-4xl text-[clamp(2.35rem,11vw,5.5rem)] font-black leading-[.9] tracking-[-0.055em] text-primary sm:text-[clamp(2.7rem,6vw,5.5rem)]">Good morning, {firstName}.<br />You have <em className="font-bold text-accent">{dueSoon} {dueSoon === 1 ? "gift" : "gifts"}</em> due soon.</h1>
          </div>
          <div className="mt-7 lg:mb-2 lg:mt-0 lg:text-right"><p className="text-sm font-bold text-primary">Free early access</p><p className="mt-2 text-[11px] font-bold uppercase tracking-[0.12em] text-primary-400">{upcoming.length} upcoming {upcoming.length === 1 ? "occasion" : "occasions"}</p></div>
        </header>

        <DashboardSwipeCards labels={["Up next", "Calendar"]}>
          {first ? (
            <div className="grid min-h-[470px] overflow-hidden rounded-[28px] border border-cream-200 bg-white shadow-lift lg:grid-cols-[1.15fr_.85fr]">
              <div className="relative overflow-hidden bg-gradient-to-br from-primary via-[#17243b] to-[#24262d] p-6 text-white sm:p-10 lg:p-12">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-accent">Up next · {format(parseISO(first.event_date), "MMM d")}</p>
                <h2 className="display-type mt-5 text-4xl font-black leading-[.95] tracking-[-0.045em] min-[390px]:text-5xl sm:text-6xl">{first.recipient_name}&apos;s<br /><em className="font-bold text-accent">{(OCCASION_LABEL[first.occasion_type] ?? first.occasion_type).toLowerCase()}.</em></h2>
                <p className="mt-6 max-w-xl text-sm leading-7 text-white/60 sm:text-base">{profileSummary(profileByEvent.get(first.id))}</p>
                <div className="mt-10 flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between"><div className="flex items-end gap-3"><span className="display-type text-6xl font-black leading-none sm:text-7xl">{Math.max(0, differenceInCalendarDays(parseISO(first.event_date), today))}</span><span className="display-type mb-1 text-2xl font-bold text-accent">days<br /><small className="font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-white/45">to go</small></span></div><Link href={`/events/${first.id}`} className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-bold text-primary transition hover:bg-accent-400">See all picks <ArrowRight size={15} /></Link></div>
              </div>
              <div className="flex flex-col justify-center bg-[#f5f0e8] p-5 sm:p-9">
                <div className="flex items-center gap-3"><Gift size={15} className="text-accent" /><p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-primary-400">Best match</p><span className="h-px flex-1 bg-[#e2dbcf]" /></div>
                {bestMatch ? (() => {
                  const imageUrl = bestMatch.image_url || getProductImage(bestMatch.product_name);
                  return <a href={bestMatch.amazon_url} target="_blank" rel="noopener noreferrer" className="mt-5 block overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-0.5"><span className="relative grid h-52 w-full place-items-center overflow-hidden bg-white text-accent-700">{imageUrl ? <Image src={imageUrl} alt={bestMatch.product_name} fill sizes="(max-width: 1024px) 100vw, 420px" className="object-contain p-5" /> : <Package size={34} />}</span><span className="block border-t border-cream-200 p-5"><strong className="block text-lg text-primary">{bestMatch.product_name}</strong><span className="mt-2 block text-sm text-primary-400">{bestMatch.budget_range ?? "Personalized gift idea"}</span></span></a>;
                })() : <div className="mt-5 rounded-2xl bg-white p-5 text-sm leading-6 text-primary-500">Open this occasion to generate its best match.</div>}
              </div>
            </div>
          ) : <div className="grid min-h-[470px] place-items-center rounded-[28px] border border-cream-200 bg-white p-8 shadow-lift"><EmptyState icon={<CalendarDays size={34} />} title="No upcoming occasions." description="Add someone you care about and EmptyHanded will create their first gift ideas." action={<Link href="/events/new"><Button size="lg">Add an occasion</Button></Link>} /></div>}
          <DashboardCalendar events={allEvents} />
        </DashboardSwipeCards>

        {upcoming.length > 0 && <section className="mt-16">
          <div className="mb-6 flex items-end justify-between gap-4"><h2 className="display-type text-3xl font-black tracking-[-0.035em] text-primary sm:text-4xl">Upcoming <em className="text-accent">occasions</em></h2><Link href="/events/new" className="text-sm font-bold text-primary">+ Add new</Link></div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{upcoming.map((event, index) => {
            const days = Math.max(0, differenceInCalendarDays(parseISO(event.event_date), today));
            const profile = profileByEvent.get(event.id);
            const savedCount = savedByEvent.get(event.id)?.length ?? 0;
            const budgetLabel = getBudgetLabel(profile?.budget_tier);
            const avatarUrl = avatarByEvent.get(event.id);
            return <Link key={event.id} href={`/events/${event.id}`} className={`rounded-[22px] border p-6 transition hover:-translate-y-1 hover:shadow-soft ${index === 0 ? "border-accent bg-accent-50" : "border-cream-200 bg-white"}`}><div className="flex items-start justify-between"><span className="relative grid h-14 w-14 place-items-center overflow-hidden rounded-full bg-primary text-lg font-black text-white">{avatarUrl ? <Image src={avatarUrl} alt={event.recipient_name} fill sizes="56px" className="object-cover" /> : initials(event.recipient_name)}</span><p><span className="display-type text-4xl font-black text-primary">{days}</span><span className="ml-1 text-xs font-semibold text-primary-400">days</span></p></div><h3 className="mt-5 text-xl font-bold text-primary">{event.recipient_name}</h3><p className="mt-1 text-sm text-primary-400">{OCCASION_LABEL[event.occasion_type] ?? event.occasion_type}{budgetLabel ? ` · ${budgetLabel}` : ""}</p><div className="mt-5 flex items-center justify-between border-t border-dashed border-cream-200 pt-4 text-xs"><span className="inline-flex items-center gap-1.5 font-semibold text-primary-500"><Heart size={13} className="text-accent" fill={savedCount ? "currentColor" : "none"} /> {savedCount} saved</span><span className="font-bold text-accent-700">View picks →</span></div></Link>;
          })}</div>
        </section>}

        <section className="mt-16">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3"><div><p className="eyebrow">Recipient profiles</p><h2 className="display-type mt-1 text-3xl font-black tracking-[-0.035em] text-primary sm:text-4xl">Your <em className="text-accent">people</em></h2></div><Link href="/events/new" className="text-sm font-bold text-primary">+ Add someone</Link></div>
          {people.length === 0 ? <div className="rounded-[22px] border border-cream-200 bg-white p-8"><EmptyState title="Your people will appear here." description="Create an occasion to start a recipient profile." /></div> : <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{people.map(({ event, profile, avatarUrl, eventCount }) => <Link key={event.recipient_name.toLocaleLowerCase()} href={`/events/${event.id}/edit`} className="group rounded-[22px] border border-cream-200 bg-white p-6 shadow-soft transition hover:-translate-y-1"><div className="flex items-center gap-4"><span className="relative grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-2xl bg-primary text-lg font-black text-accent">{avatarUrl ? <Image src={avatarUrl} alt={event.recipient_name} fill sizes="64px" className="object-cover" /> : initials(event.recipient_name)}</span><span className="min-w-0"><strong className="block truncate text-lg text-primary">{event.recipient_name}</strong><span className="mt-1 block text-xs font-semibold text-primary-400">{profile?.relationship || "Recipient"} · {eventCount} {eventCount === 1 ? "occasion" : "occasions"}</span></span></div><div className="mt-5 flex flex-wrap gap-2">{profile?.archetypes.slice(0, 3).map(item => <span key={item} className="rounded-full bg-cream-100 px-3 py-1 text-[10px] font-bold text-primary-500">{item}</span>)}</div><p className="mt-5 border-t border-cream-200 pt-4 text-xs font-bold text-accent-700">Edit profile →</p></Link>)}</div>}
        </section>

        <section className="mt-16">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3"><h2 className="display-type text-3xl font-black tracking-[-0.035em] text-primary sm:text-4xl">Your <em className="text-accent">saved gifts</em> <span className="font-sans text-sm font-medium tracking-normal text-primary-400">· {savedRecommendations.length}</span></h2><Link href="/recommendations" className="text-sm font-bold text-primary">View all →</Link></div>
          {savedRecommendations.length === 0 ? <div className="rounded-[22px] border border-cream-200 bg-white p-8"><EmptyState icon={<Gift size={30} />} title="Your saved shelf is empty." description="Open an occasion and heart a recommendation to keep it here." /></div> : <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{savedRecommendations.slice(0, 6).map(item => <a key={item.id} href={item.amazon_url} target="_blank" rel="noopener noreferrer" className="rounded-[22px] border border-cream-200 bg-white p-6 shadow-soft transition hover:-translate-y-1"><span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-accent">For {allEvents.find(event => event.id === item.event_id)?.recipient_name ?? "your recipient"}</span><h3 className="mt-3 text-lg font-bold text-primary">{item.product_name}</h3><p className="mt-2 text-sm text-primary-400">{item.budget_range ?? "Saved gift idea"}</p></a>)}</div>}
        </section>
      </div>
      <Link href="/events/new" aria-label="Add occasion" className="fixed bottom-4 right-4 z-30 grid h-14 w-14 place-items-center rounded-full bg-primary text-white shadow-[0_16px_34px_-10px_rgba(15,23,42,.6)] transition hover:rotate-90 hover:scale-110 sm:bottom-6 sm:right-6 sm:h-16 sm:w-16"><Plus size={24} /></Link>
    </div>
  );
}
