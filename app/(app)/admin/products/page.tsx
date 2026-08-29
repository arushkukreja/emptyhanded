import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PackagePlus, Pencil, Plus, Search, ShieldCheck, X } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import ProductForm, { type CatalogProductFormValue } from "./ProductForm";

export const dynamic = "force-dynamic";

type AdminProductsPageProps = {
  searchParams: Promise<{ edit?: string | string[]; q?: string | string[] }>;
};

export default async function AdminProductsPage({ searchParams }: AdminProductsPageProps) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: appUser }, { data }, query] = await Promise.all([
    supabase.from("users").select("is_admin").eq("id", user.id).maybeSingle(),
    supabase.from("products").select("id, asin, name, category, archetype_tags, budget_tier, age_group, image_url, amazon_url, created_at").order("created_at", { ascending: false }),
    searchParams
  ]);
  if (!appUser?.is_admin) redirect("/dashboard");

  const products = (data ?? []) as CatalogProductFormValue[];
  const editId = typeof query.edit === "string" ? query.edit : undefined;
  const searchTerm = typeof query.q === "string" ? query.q.trim().slice(0, 120) : "";
  const normalizedSearch = searchTerm.toLocaleLowerCase();
  const visibleProducts = normalizedSearch
    ? products.filter(product => [
        product.name,
        product.category,
        product.asin,
        product.age_group,
        product.budget_tier,
        ...product.archetype_tags
      ].some(value => value?.toLocaleLowerCase().includes(normalizedSearch)))
    : products;
  const selectedProduct = editId ? products.find(product => product.id === editId) : undefined;
  const productFormKey = selectedProduct ? JSON.stringify(selectedProduct) : "new-product";

  return (
    <div className="min-h-screen bg-[#fbfaf7] pb-24">
      <div className="mx-auto max-w-6xl px-4 py-8 min-[390px]:px-5 sm:px-8 sm:py-10">
        <header className="border-b border-cream-200 pb-8">
          <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-accent-700"><ShieldCheck size={16} /> Admin only</p>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="display-type text-4xl font-black tracking-[-0.04em] text-primary sm:text-5xl">Products</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-primary-500">Add new products or edit existing catalog details. Saved changes update the Shop and future recommendation batches.</p>
            </div>
            {selectedProduct && <Link href="/admin/products" className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-white transition hover:bg-primary-800"><Plus size={16} className="text-accent" /> Add new product</Link>}
          </div>
        </header>

        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <ProductForm key={productFormKey} product={selectedProduct} />
          <aside className="rounded-[24px] border border-cream-200 bg-white p-5 shadow-soft lg:sticky lg:top-24">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2"><PackagePlus size={17} className="text-accent" /><h2 className="text-sm font-bold text-primary">Catalog</h2></div>
              <span className="rounded-full bg-cream-100 px-2.5 py-1 text-[11px] font-bold text-primary-400">{searchTerm ? `${visibleProducts.length} of ${products.length}` : products.length} {products.length === 1 ? "product" : "products"}</span>
            </div>
            <p className="mt-2 text-xs leading-5 text-primary-400">Search the catalog, then select a product to edit its details.</p>
            <form action="/admin/products" className="mt-4 flex gap-2">
              <label className="relative min-w-0 flex-1">
                <span className="sr-only">Search products</span>
                <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-primary-300" />
                <input name="q" type="search" defaultValue={searchTerm} maxLength={120} placeholder="Name, category, ID…" className="h-11 w-full rounded-xl border border-cream-200 bg-cream-50 pl-9 pr-3 text-sm font-semibold text-primary outline-none transition placeholder:text-primary-300 focus:border-accent focus:bg-white focus:ring-4 focus:ring-accent/10" />
              </label>
              <button type="submit" className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-3.5 text-xs font-bold text-white transition hover:bg-primary-800">Search</button>
            </form>
            {searchTerm && <div className="mt-3 flex items-center justify-between gap-3 text-xs text-primary-400"><span className="min-w-0 truncate">Results for “{searchTerm}”</span><Link href="/admin/products" className="inline-flex shrink-0 items-center gap-1 font-bold text-accent-700 hover:text-accent-800"><X size={12} /> Clear</Link></div>}
            <div className="mt-4 max-h-[calc(100vh-15rem)] space-y-2 overflow-y-auto pr-1">
              {visibleProducts.map(product => {
                const isSelected = product.id === selectedProduct?.id;
                const editQuery = new URLSearchParams({ edit: product.id, ...(searchTerm ? { q: searchTerm } : {}) });
                return <Link key={product.id} href={`/admin/products?${editQuery.toString()}`} scroll={false} aria-current={isSelected ? "page" : undefined} className={`group flex items-center gap-3 rounded-xl border p-2.5 transition ${isSelected ? "border-accent bg-accent-100" : "border-transparent bg-cream-50 hover:border-cream-300"}`}><span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-[#f5f0e8]">{product.image_url ? <Image src={product.image_url} alt="" fill sizes="48px" className="object-contain p-1 mix-blend-multiply" /> : null}</span><span className="min-w-0 flex-1"><strong className="block truncate text-xs text-primary">{product.name}</strong><span className="mt-1 block truncate text-[11px] text-primary-400">{product.category ?? "Uncategorized"}</span></span><span className={`inline-flex items-center gap-1 text-[11px] font-bold ${isSelected ? "text-accent-700" : "text-primary-300 group-hover:text-accent-700"}`}><Pencil size={12} /> Edit</span></Link>;
              })}
              {products.length === 0 && <p className="rounded-xl bg-cream-50 p-4 text-sm leading-6 text-primary-400">Add your first product using the form.</p>}
              {products.length > 0 && visibleProducts.length === 0 && <p className="rounded-xl bg-cream-50 p-4 text-sm leading-6 text-primary-400">No products match “{searchTerm}”. Try a product name, category, internal ID, or interest tag.</p>}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
