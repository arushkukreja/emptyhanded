import type { SupabaseClient } from "@supabase/supabase-js";
import type { Recommendation } from "./gemini";

export function amazonUrlFor(rec: Recommendation): string {
  const q = encodeURIComponent(rec.product_name);
  return `https://www.amazon.com/s?k=${q}&tag=emptyhanded-20`;
}

export async function saveRecommendations(
  supabase: SupabaseClient,
  eventId: string,
  recs: Recommendation[]
) {
  if (recs.length === 0) return;
  const asins = Array.from(new Set(recs.map((recommendation) => recommendation.asin).filter((asin): asin is string => Boolean(asin))));
  const productUrlByAsin = new Map<string, string>();
  if (asins.length > 0) {
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("asin, amazon_url")
      .in("asin", asins);
    if (productsError) throw productsError;
    for (const product of products ?? []) productUrlByAsin.set(product.asin, product.amazon_url);
  }
  const rows = recs.map(r => ({
    event_id: eventId,
    product_name: r.product_name,
    asin: r.asin ?? null,
    amazon_url: (r.asin ? productUrlByAsin.get(r.asin) : null) ?? amazonUrlFor(r),
    budget_range: r.budget_range ?? null,
    reason: r.reason,
    is_saved: false
  }));
  const { error } = await supabase.from("recommendations").insert(rows);
  if (error) throw error;
}
