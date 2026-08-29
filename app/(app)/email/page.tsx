import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CalendarDays, Mail, Package } from "lucide-react";
import { format, parseISO } from "date-fns";
import { createClient } from "@/lib/supabase/server";
import { getProductImage } from "@/lib/product-images";
import { OCCASION_LABEL } from "@/lib/occasions";
import EmptyState from "@/components/EmptyState";
import Button from "@/components/Button";
import Logo from "@/components/Logo";

export const dynamic = "force-dynamic";

export default async function EmailPreviewPage() {
  const supabase = await createClient();
  const today = format(new Date(), "yyyy-MM-dd");

  const { data: event, error: eventError } = await supabase
    .from("events")
    .select("id, recipient_name, occasion_type, event_date")
    .gte("event_date", today)
    .order("event_date", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (eventError) throw eventError;

  if (!event) {
    return <div className="mx-auto max-w-4xl px-5 py-12 sm:px-8"><EmptyState icon={<Mail size={32} />} title="Your reminder preview is waiting." description="Add an upcoming occasion to see exactly what your seven-day reminder email will look like." action={<Link href="/events/new"><Button size="lg">Add an occasion</Button></Link>} /></div>;
  }

  const { data: recommendations, error: recommendationsError } = await supabase
    .from("recommendations")
    .select("id, product_name, asin, amazon_url, is_saved")
    .eq("event_id", event.id)
    .order("is_saved", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(3);
  if (recommendationsError) throw recommendationsError;

  const catalogAsins = Array.from(new Set((recommendations ?? []).map(item => item.asin).filter((asin): asin is string => Boolean(asin))));
  const { data: catalogProducts } = catalogAsins.length > 0
    ? await supabase.from("products").select("asin, image_url").in("asin", catalogAsins)
    : { data: [] };
  const catalogImageByAsin = new Map((catalogProducts ?? []).map(product => [product.asin, product.image_url]));

  const recipientFirstName = event.recipient_name.split(" ")[0];
  const occasion = OCCASION_LABEL[event.occasion_type] ?? event.occasion_type;
  const sender = process.env.EMAIL_FROM ?? "Sender domain not configured";

  return (
    <div className="bg-[#eeeae3] px-3 py-7 pb-16 min-[390px]:px-4 sm:px-8 sm:py-10 sm:pb-24">
      <div className="mx-auto mb-4 flex max-w-xl flex-col items-start gap-1 text-[11px] text-[#6b6358] sm:flex-row sm:items-center sm:gap-2 sm:text-xs"><span className="inline-flex items-center gap-2"><Mail size={14} /> Inbox · Reminder preview</span><span className="sm:ml-auto">From: {sender}</span></div>
      <article className="mx-auto max-w-xl overflow-hidden rounded-[18px] border border-cream-200 bg-white shadow-lift sm:rounded-[22px]">
        <header className="border-b border-cream-200 px-5 py-4 sm:px-7"><p className="text-[10px] font-bold tracking-[0.12em] text-primary-400">SUBJECT</p><p className="mt-1 text-sm font-bold leading-5 text-primary sm:text-base">{event.recipient_name}&apos;s {occasion.toLowerCase()} is in 7 days 🎁</p></header>
        <div className="flex items-center justify-center bg-primary px-5 py-5 text-center sm:px-7"><Logo inverted /></div>
        <div className="px-5 py-7 sm:px-9 sm:py-9">
          <div className="text-center"><span className="inline-flex max-w-full items-center gap-2 rounded-2xl bg-accent-100 px-3 py-1.5 text-[10px] font-bold leading-4 tracking-[0.05em] text-accent-700"><CalendarDays size={13} className="shrink-0" /> {recipientFirstName.toUpperCase()}&apos;S {occasion.toUpperCase()} · 7 DAYS</span></div>
          <h1 className="display-type mt-5 text-2xl font-black leading-tight tracking-[-0.035em] text-primary min-[390px]:text-3xl">Three picks for {recipientFirstName}.</h1>
          <p className="mt-3 text-sm leading-7 text-primary-500">Coming up on {format(parseISO(event.event_date), "MMMM d")}.</p>
          {(recommendations ?? []).length > 0 ? <div className="mt-7 space-y-3">{recommendations?.map((pick, index) => {
            const productImage = (pick.asin ? catalogImageByAsin.get(pick.asin) : null) || getProductImage(pick.product_name);
            return <div key={pick.id} className="flex min-h-24 items-center gap-2.5 rounded-2xl border border-cream-200 bg-cream p-2.5 sm:gap-3 sm:p-3"><span className="relative grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-xl bg-[#f5f0e8] text-accent-700 sm:h-16 sm:w-16">{productImage ? <Image src={productImage} alt="" fill sizes="64px" className="object-contain p-1.5" /> : <Package size={22} />}</span><div className="min-w-0 flex-1"><p className="text-[10px] font-bold tracking-[0.1em] text-accent-700">PICK {String(index + 1).padStart(2, "0")}{pick.is_saved ? " · SAVED" : ""}</p><p className="mt-1 line-clamp-2 text-xs font-bold leading-snug text-primary min-[390px]:text-sm">{pick.product_name}</p></div><a href={pick.amazon_url} target="_blank" rel="noopener noreferrer" aria-label={`View ${pick.product_name}`} className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary text-white"><ArrowRight size={14} /></a></div>;
          })}</div> : <div className="mt-7 rounded-2xl bg-cream p-5 text-sm text-primary-500">Generate recommendations for this occasion to preview the picks that will appear here.</div>}
          <div className="mt-8 text-center"><Link href={`/events/${event.id}`} className="text-sm font-semibold text-accent-700 underline decoration-accent-300 underline-offset-4">See all picks →</Link></div>
        </div>
        <footer className="bg-cream-100 px-5 py-6 text-center sm:px-7 sm:py-7"><Logo /><p className="mt-4 text-[11px] leading-5 text-primary-400">You added {event.recipient_name} to your emptyhanded calendar.<br />Some links may earn us a commission.</p></footer>
      </article>
    </div>
  );
}
