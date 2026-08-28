import { ShoppingBag } from "lucide-react";
import { getLiveCatalogProducts } from "@/lib/catalog";
import ShopCatalog from "./ShopCatalog";

export const dynamic = "force-dynamic";

export default async function ShopPage() {
  const products = await getLiveCatalogProducts(100);

  return (
    <div className="min-h-screen bg-[#fbfaf7] pb-24">
      <div className="mx-auto max-w-7xl px-4 py-8 min-[390px]:px-5 sm:px-8 sm:py-10 lg:px-10">
        <header className="relative overflow-hidden rounded-[28px] bg-primary px-6 py-9 text-white shadow-soft sm:px-10 sm:py-12">
          <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full border border-white/10" aria-hidden="true" />
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 text-accent"><ShoppingBag size={21} /></span>
          <p className="mt-6 text-xs font-bold uppercase tracking-[0.16em] text-accent">The gift shop</p>
          <h1 className="display-type mt-2 text-4xl font-black tracking-[-0.04em] sm:text-5xl">Thoughtful finds, all in one place.</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-primary-200 sm:text-base">Browse every verified product in the emptyhanded catalog. Filter the collection, then open the item directly with the retailer.</p>
        </header>
        <ShopCatalog products={products} />
      </div>
    </div>
  );
}
