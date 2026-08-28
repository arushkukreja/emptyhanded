"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import RecommendationCard from "@/components/RecommendationCard";
import EmptyState from "@/components/EmptyState";
import type { CatalogProduct } from "@/lib/catalog";

export default function ShopCatalog({ products }: { products: CatalogProduct[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [ageGroup, setAgeGroup] = useState("All");
  const categories = useMemo(() => ["All", ...Array.from(new Set(products.map(item => item.category).filter((value): value is string => Boolean(value)))).sort()], [products]);
  const ageGroups = useMemo(() => ["All", ...Array.from(new Set(products.map(item => item.age_group).filter((value): value is string => Boolean(value))))], [products]);
  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return products.filter(product => {
      const matchesQuery = !normalizedQuery || `${product.name} ${product.category ?? ""}`.toLowerCase().includes(normalizedQuery);
      const matchesCategory = category === "All" || product.category === category;
      const matchesAge = ageGroup === "All" || product.age_group === ageGroup;
      return matchesQuery && matchesCategory && matchesAge;
    });
  }, [ageGroup, category, products, query]);

  return (
    <section className="mt-8" aria-labelledby="shop-products-title">
      <div className="rounded-[22px] border border-cream-200 bg-white p-4 shadow-soft sm:p-5">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-primary-400"><SlidersHorizontal size={15} /> Filter the shop</div>
        <div className="mt-4 grid gap-3 md:grid-cols-[minmax(0,1fr)_220px_180px]">
          <label className="relative"><span className="sr-only">Search products</span><Search size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-primary-300" /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search products or categories" className="h-12 w-full rounded-xl border border-cream-200 bg-cream-50 pl-11 pr-4 text-sm font-medium text-primary outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/10" /></label>
          <label><span className="sr-only">Filter by category</span><select value={category} onChange={event => setCategory(event.target.value)} className="h-12 w-full rounded-xl border border-cream-200 bg-white px-4 text-sm font-semibold text-primary outline-none focus:border-accent focus:ring-4 focus:ring-accent/10">{categories.map(item => <option key={item} value={item}>{item === "All" ? "All categories" : item}</option>)}</select></label>
          <label><span className="sr-only">Filter by age</span><select value={ageGroup} onChange={event => setAgeGroup(event.target.value)} className="h-12 w-full rounded-xl border border-cream-200 bg-white px-4 text-sm font-semibold text-primary outline-none focus:border-accent focus:ring-4 focus:ring-accent/10">{ageGroups.map(item => <option key={item} value={item}>{item === "All" ? "All ages" : `Ages ${item}`}</option>)}</select></label>
        </div>
      </div>

      <div className="mb-5 mt-9 flex items-end justify-between gap-4">
        <div><p className="eyebrow">Browse everything</p><h2 id="shop-products-title" className="display-type mt-2 text-3xl font-bold text-primary">Shop all gifts</h2></div>
        <span className="rounded-full bg-accent-100 px-3 py-1.5 text-xs font-bold text-accent-700">{filtered.length} {filtered.length === 1 ? "item" : "items"}</span>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-[22px] border border-cream-200 bg-white p-8"><EmptyState title="No products match those filters." description="Try a broader search or reset one of the filters." /></div>
      ) : (
        <div className="grid items-stretch gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product, index) => <RecommendationCard key={product.id} id={`shop-${product.id}`} eventId="shop" product_name={product.name} amazon_url={product.amazon_url} budget_range={product.budget_tier} reason="" is_saved={false} image_url={product.image_url} index={index} simple />)}
        </div>
      )}
    </section>
  );
}
