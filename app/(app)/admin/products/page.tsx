import Image from "next/image";
import { redirect } from "next/navigation";
import { PackagePlus, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import ProductForm from "./ProductForm";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: appUser } = await supabase.from("users").select("is_admin").eq("id", user.id).maybeSingle();
  if (!appUser?.is_admin) redirect("/dashboard");

  const { data: products } = await supabase.from("products").select("id, name, category, image_url, created_at").order("created_at", { ascending: false }).limit(12);

  return (
    <div className="min-h-screen bg-[#fbfaf7] pb-24">
      <div className="mx-auto max-w-6xl px-4 py-8 min-[390px]:px-5 sm:px-8 sm:py-10">
        <header className="border-b border-cream-200 pb-8">
          <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-accent-700"><ShieldCheck size={16} /> Admin only</p>
          <h1 className="display-type mt-3 text-4xl font-black tracking-[-0.04em] text-primary sm:text-5xl">Add products to the shop.</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-primary-500">Upload a verified product, choose who it fits, and it will become available to Shop filters and future recommendation batches.</p>
        </header>

        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <ProductForm />
          <aside className="rounded-[24px] border border-cream-200 bg-white p-5 shadow-soft lg:sticky lg:top-24">
            <div className="flex items-center gap-2"><PackagePlus size={17} className="text-accent" /><h2 className="text-sm font-bold text-primary">Recently added</h2></div>
            <div className="mt-4 space-y-3">
              {(products ?? []).map(product => <div key={product.id} className="flex items-center gap-3 rounded-xl bg-cream-50 p-2.5"><span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-[#f5f0e8]">{product.image_url && <Image src={product.image_url} alt="" fill sizes="48px" className="object-contain p-1 mix-blend-multiply" />}</span><span className="min-w-0"><strong className="block truncate text-xs text-primary">{product.name}</strong><span className="mt-1 block text-[11px] text-primary-400">{product.category ?? "Uncategorized"}</span></span></div>)}
              {(products ?? []).length === 0 && <p className="text-sm leading-6 text-primary-400">Your uploaded products will appear here.</p>}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
