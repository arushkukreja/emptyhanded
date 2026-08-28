import { notFound } from "next/navigation";
import Link from "next/link";
import {
  CalendarDays,
  ChevronRight,
  Clock3,
  Gift,
  PencilLine,
  Sparkles,
  WalletCards,
} from "lucide-react";
import { differenceInCalendarDays, format, isValid, parseISO } from "date-fns";
import { createClient } from "@/lib/supabase/server";
import { getBudgetLabel, OCCASION_LABEL } from "@/lib/occasions";
import { getProductImage } from "@/lib/product-images";
import RecommendationCard from "@/components/RecommendationCard";
import EmptyState from "@/components/EmptyState";
import RegenerateButton from "./RegenerateButton";

export const dynamic = "force-dynamic";

function initials(name: string) {
  return name
    .split(/\s+|&/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function timingLabel(days: number) {
  if (days === 0) return "Today";
  if (days > 0) return `${days} day${days === 1 ? "" : "s"} to go`;
  const elapsed = Math.abs(days);
  return `${elapsed} day${elapsed === 1 ? "" : "s"} ago`;
}

export default async function EventDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const supabase = await createClient();
  const { data: event } = await supabase
    .from("events")
    .select("id, recipient_name, occasion_type, event_date, user_id")
    .eq("id", params.id)
    .maybeSingle();

  if (!event) notFound();

  const [{ data: profile }, { data: recs }] = await Promise.all([
    supabase.from("recipient_profiles").select("*").eq("event_id", params.id).maybeSingle(),
    supabase
      .from("recommendations")
      .select("id, product_name, asin, amazon_url, budget_range, reason, is_saved, created_at")
      .eq("event_id", params.id)
      .order("created_at", { ascending: false })
      .order("id", { ascending: true }),
  ]);

  const latestBatchCreatedAt = recs?.[0]?.created_at;
  const latestRecs = (recs ?? [])
    .filter((item) => item.created_at === latestBatchCreatedAt)
    .slice(0, 6);
  const catalogAsins = Array.from(
    new Set(latestRecs.map((item) => item.asin).filter((asin): asin is string => Boolean(asin)))
  );
  let catalogProducts: Array<{ asin: string; image_url: string | null }> = [];
  if (catalogAsins.length > 0) {
    const { data } = await supabase
      .from("products")
      .select("asin, image_url")
      .in("asin", catalogAsins);
    catalogProducts = data ?? [];
  }
  const catalogImageByAsin = new Map(catalogProducts.map((product) => [product.asin, product.image_url]));
  const recommendations = latestRecs.map((recommendation) => ({
    ...recommendation,
    image_url: recommendation.asin ? catalogImageByAsin.get(recommendation.asin) ?? null : null
  }));
  const firstRecommendationWithImage = recommendations.findIndex(
    (recommendation) => recommendation.image_url || getProductImage(recommendation.product_name)
  );
  const orderedRecommendations = firstRecommendationWithImage > 0
    ? [
        recommendations[firstRecommendationWithImage],
        ...recommendations.filter((_, index) => index !== firstRecommendationWithImage)
      ]
    : recommendations;

  const date = parseISO(event.event_date);
  if (!isValid(date)) notFound();

  const days = differenceInCalendarDays(date, new Date());
  const savedCount = recs?.filter((item) => item.is_saved).length ?? 0;
  const firstName = event.recipient_name.split(" ")[0];
  const occasion = OCCASION_LABEL[event.occasion_type] ?? event.occasion_type;
  const budgetLabel = getBudgetLabel(profile?.budget_tier);
  const profileTags = [...(profile?.archetypes ?? []), budgetLabel].filter(Boolean) as string[];

  return (
    <div className="min-h-screen bg-[#fbfaf7] pb-24">
      <div className="mx-auto max-w-7xl px-4 py-7 min-[390px]:px-5 sm:px-8 sm:py-9 lg:px-10">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-primary-400">
          <Link href="/dashboard" className="transition hover:text-primary">
            Calendar
          </Link>
          <ChevronRight size={13} aria-hidden="true" />
          <span className="truncate text-primary-600">{event.recipient_name}</span>
        </nav>

        <section className="relative mt-5 overflow-hidden rounded-[26px] bg-primary text-white shadow-soft sm:rounded-[30px]">
          <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full border border-white/10" aria-hidden="true" />
          <div className="absolute -right-4 -top-10 h-40 w-40 rounded-full bg-accent/10 blur-2xl" aria-hidden="true" />
          <div className="relative grid lg:grid-cols-[minmax(0,1fr)_390px]">
            <div className="p-6 sm:p-9 lg:p-11">
              <div className="flex items-center gap-4">
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-white/15 bg-white/10 text-lg font-extrabold text-accent sm:h-16 sm:w-16 sm:text-xl">
                  {initials(event.recipient_name)}
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent">Gift plan</p>
                  <h1 className="display-type mt-1 break-words pb-1 text-3xl font-bold leading-[1.08] tracking-[-0.04em] sm:text-4xl lg:text-5xl">
                    {event.recipient_name}
                  </h1>
                </div>
              </div>
              <p className="mt-6 max-w-xl text-sm leading-7 text-primary-200 sm:text-base">
                A focused shortlist for {firstName}&apos;s {occasion.toLowerCase()}, shaped by what they enjoy and what feels personal.
              </p>
              {profileTags.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {profileTags.map((item) => (
                    <span key={item} className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] font-bold text-white">
                      {item}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="grid border-t border-white/10 bg-white/[0.045] sm:grid-cols-3 lg:grid-cols-1 lg:border-l lg:border-t-0">
              <div className="flex items-center gap-3 border-b border-white/10 px-6 py-5 sm:border-b-0 sm:border-r lg:border-b lg:border-r-0">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/10 text-accent"><CalendarDays size={17} aria-hidden="true" /></span>
                <div><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-primary-300">Occasion</p><p className="mt-1 text-sm font-semibold">{occasion}</p></div>
              </div>
              <div className="flex items-center gap-3 border-b border-white/10 px-6 py-5 sm:border-b-0 sm:border-r lg:border-b lg:border-r-0">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/10 text-accent"><Clock3 size={17} aria-hidden="true" /></span>
                <div><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-primary-300">Timing</p><p className="mt-1 text-sm font-semibold">{timingLabel(days)}</p></div>
              </div>
              <div className="flex items-center gap-3 px-6 py-5">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/10 text-accent"><Gift size={17} aria-hidden="true" /></span>
                <div><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-primary-300">Date</p><p className="mt-1 text-sm font-semibold">{format(date, "MMM d, yyyy")}</p></div>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-10 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_310px] xl:gap-10">
          <div>
            <div className="mb-6">
              <p className="eyebrow">Curated for them</p>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                <h2 className="display-type text-3xl font-bold tracking-[-0.035em] text-primary sm:text-4xl">
                  Recommended for {firstName}
                </h2>
                <div className="shrink-0"><RegenerateButton eventId={event.id} /></div>
              </div>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-primary-500">
                A considered mix of useful, personal, and memorable ideas{savedCount > 0 ? ` · ${savedCount} saved` : ""}.
              </p>
            </div>

            {orderedRecommendations.length === 0 ? (
              <EmptyState title="No recommendations yet" description="Try regenerating—we'll pull together a fresh, thoughtful batch." />
            ) : <RecommendationCard {...orderedRecommendations[0]} eventId={event.id} featured index={0} />}
          </div>

          {profile && (
            <aside className="rounded-[22px] border border-cream-200 bg-white p-6 shadow-soft lg:sticky lg:top-24" aria-labelledby="recipient-profile-title">
              <div className="flex items-center justify-between gap-4">
                <p className="eyebrow !text-primary-400">Recipient profile</p>
                <Link href={`/events/${event.id}/edit`} className="inline-flex items-center gap-1.5 rounded-full border border-cream-200 px-3 py-1.5 text-xs font-bold text-primary-500 transition hover:border-accent hover:bg-accent-50 hover:text-primary"><PencilLine size={13} /> Edit</Link>
              </div>
              <h2 id="recipient-profile-title" className="display-type mt-2 text-2xl font-bold text-primary">About {firstName}</h2>

              <dl className="mt-6 divide-y divide-cream-200">
                {profile.relationship && <div className="grid grid-cols-[110px_1fr] gap-3 py-4 first:pt-0"><dt className="text-xs font-semibold text-primary-400">Relationship</dt><dd className="text-sm font-semibold text-primary">{profile.relationship}</dd></div>}
                {profile.age !== null && profile.age !== undefined ? <div className="grid grid-cols-[110px_1fr] gap-3 py-4"><dt className="text-xs font-semibold text-primary-400">Age</dt><dd className="text-sm font-semibold text-primary">{profile.age}</dd></div> : profile.age_range ? <div className="grid grid-cols-[110px_1fr] gap-3 py-4"><dt className="text-xs font-semibold text-primary-400">Age range</dt><dd className="text-sm font-semibold text-primary">{profile.age_range}</dd></div> : null}
                {budgetLabel && <div className="grid grid-cols-[110px_1fr] gap-3 py-4"><dt className="flex items-center gap-1.5 text-xs font-semibold text-primary-400"><WalletCards size={13} aria-hidden="true" /> Budget</dt><dd className="text-sm font-semibold text-primary">{budgetLabel}</dd></div>}
                {profile.interests && <div className="py-4"><dt className="flex items-center gap-1.5 text-xs font-semibold text-primary-400"><Sparkles size={13} aria-hidden="true" /> Interests</dt><dd className="mt-2 text-sm leading-6 text-primary-600">{profile.interests}</dd></div>}
                {profile.past_gifts && <div className="py-4 last:pb-0"><dt className="text-xs font-semibold text-primary-400">Past gifts</dt><dd className="mt-2 text-sm leading-6 text-primary-600">{profile.past_gifts}</dd></div>}
              </dl>
            </aside>
          )}
        </div>

        {orderedRecommendations.length > 1 && (
          <section aria-labelledby="additional-options-title" className="mt-10">
            <div className="mb-5">
              <p className="eyebrow">More to explore</p>
              <h3 id="additional-options-title" className="display-type mt-1 text-2xl font-bold tracking-[-0.025em] text-primary sm:text-3xl">
                Additional options
              </h3>
            </div>
            <div className="grid items-stretch gap-5 md:grid-cols-2 xl:grid-cols-3">
              {orderedRecommendations.slice(1).map((rec, index) => (
                <RecommendationCard key={rec.id} {...rec} eventId={event.id} index={index + 1} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
