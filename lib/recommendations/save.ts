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
  const rows = recs.map(r => ({
    event_id: eventId,
    product_name: r.product_name,
    asin: r.asin ?? null,
    amazon_url: amazonUrlFor(r),
    budget_range: r.budget_range ?? null,
    reason: r.reason,
    is_saved: false
  }));
  const { error } = await supabase.from("recommendations").insert(rows);
  if (error) throw error;
}
