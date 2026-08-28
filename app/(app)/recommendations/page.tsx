import { Heart, Sparkles } from "lucide-react";
import RecommendationCard from "@/components/RecommendationCard";
import EmptyState from "@/components/EmptyState";
import { CatalogProduct, getLiveCatalogProducts } from "@/lib/catalog";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type SavedRecommendation = {
  id: string;
  event_id: string;
  product_name: string;
  amazon_url: string;
  budget_range: string | null;
  reason: string;
  is_saved: boolean;
};

function CatalogListing({ product, index }: { product: CatalogProduct; index: number }) {
  return (
    <RecommendationCard
      id={`catalog-${product.id}`}
      eventId="catalog"
      product_name={product.name}
      amazon_url={product.amazon_url}
      budget_range={product.budget_tier}
      reason=""
      is_saved={false}
      image_url={product.image_url}
      index={index}
      simple
    />
  );
}

export default async function RecommendationsPage() {
  const supabase = await createClient();
  const { data: events, error: eventsError } = await supabase.from("events").select("id");
  if (eventsError) throw eventsError;
  const eventIds = (events ?? []).map(event => event.id);

  let saved: SavedRecommendation[] = [];
  if (eventIds.length > 0) {
    const { data, error } = await supabase
      .from("recommendations")
      .select("id, event_id, product_name, amazon_url, budget_range, reason, is_saved")
      .in("event_id", eventIds)
      .eq("is_saved", true)
      .order("created_at", { ascending: false });
    if (error) throw error;
    saved = (data ?? []) as SavedRecommendation[];
  }

  let products: CatalogProduct[] = [];
  try {
    products = await getLiveCatalogProducts(18);
  } catch {
    // Saved recommendations remain available even if the optional catalog is down.
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 pb-20 min-[390px]:px-5 sm:px-8 sm:py-10 sm:pb-24 lg:px-10">
      <header className="border-b border-cream-200 pb-8">
        <p className="eyebrow">Your gift shelf</p>
        <h1 className="display-type mt-2 text-3xl font-black tracking-[-0.04em] text-primary min-[390px]:text-4xl sm:text-5xl">Recommendations</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-primary-500 sm:text-base">The ideas you actually saved, followed by the live gift catalog.</p>
      </header>

      <section className="mt-10">
        <div className="mb-5 flex items-center gap-2">
          <Heart size={17} className="text-accent" fill="currentColor" />
          <h2 className="display-type text-2xl font-bold text-primary">Saved picks</h2>
          <span className="rounded-full bg-accent-100 px-2.5 py-1 text-[11px] font-bold text-accent-700">{saved.length}</span>
        </div>
        {saved.length === 0 ? (
          <div className="rounded-2xl border border-cream-200 bg-white p-8"><EmptyState icon={<Heart size={30} />} title="No saved picks yet." description="Open an occasion and heart any recommendation you want to remember." /></div>
        ) : (
          <div className="grid items-stretch gap-5 md:grid-cols-2 lg:grid-cols-3">
            {saved.map((recommendation, index) => <RecommendationCard key={recommendation.id} {...recommendation} eventId={recommendation.event_id} index={index} />)}
          </div>
        )}
      </section>

      <section className="mt-14 border-t border-cream-200 pt-12">
        <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow !text-primary-400">Browse everything</p>
            <h2 className="display-type mt-2 text-3xl font-bold text-primary">Live product catalog</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-primary-500">General inspiration you can open on Amazon. Personalized picks live inside each occasion.</p>
          </div>
          {products.length > 0 && <span className="w-fit rounded-full bg-accent-100 px-3 py-1.5 text-xs font-bold text-accent-700">{products.length} products</span>}
        </div>
        {products.length === 0 ? <EmptyState icon={<Sparkles size={32} />} title="The catalog is being refreshed." description="Your saved and personalized recommendations are still available." /> : <div className="grid items-stretch gap-5 md:grid-cols-2 lg:grid-cols-3">{products.map((product, index) => <CatalogListing key={product.id} product={product} index={index} />)}</div>}
      </section>
    </div>
  );
}
