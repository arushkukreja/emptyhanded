import "server-only";

import { createClient } from "@/lib/supabase/server";

export type CatalogProduct = {
  id: string;
  name: string;
  category: string | null;
  age_group: string | null;
  budget_tier: string | null;
  image_url: string;
  amazon_url: string;
};

export async function getLiveCatalogProducts(limit = 50): Promise<CatalogProduct[]> {
  const { data, error } = await (await createClient())
    .from("products")
    .select("id, name, category, age_group, budget_tier, image_url, amazon_url")
    .not("image_url", "is", null)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as CatalogProduct[];
}

export function describeCatalogProduct(product: CatalogProduct) {
  const category = product.category?.toLowerCase() ?? "gift";
  const audience = product.age_group ? ` for ages ${product.age_group}` : "";
  return `A thoughtful ${category} pick selected${audience}.`;
}
