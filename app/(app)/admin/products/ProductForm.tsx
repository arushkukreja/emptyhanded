"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";
import { Check, ImagePlus, PackagePlus, Save, X } from "lucide-react";
import { ARCHETYPES, BUDGET_TIERS, AGE_RANGES } from "@/lib/occasions";
import { createCatalogProduct, updateCatalogProduct, type ProductFormState } from "./actions";

const initialState: ProductFormState = { ok: false, message: "" };
const labelClass = "text-xs font-bold uppercase tracking-[0.12em] text-primary-400";
const inputClass = "mt-2 h-12 w-full rounded-xl border border-cream-200 bg-white px-4 text-sm font-semibold text-primary outline-none transition placeholder:text-primary-300 focus:border-accent focus:ring-4 focus:ring-accent/10";

export type CatalogProductFormValue = {
  id: string;
  asin: string;
  name: string;
  category: string | null;
  archetype_tags: string[];
  budget_tier: string | null;
  age_group: string | null;
  image_url: string | null;
  amazon_url: string;
  created_at: string;
};

export default function ProductForm({ product }: { product?: CatalogProductFormValue }) {
  const isEditing = Boolean(product);
  const [state, action, pending] = useActionState(isEditing ? updateCatalogProduct : createCatalogProduct, initialState);
  const [preview, setPreview] = useState<string | null>(product?.image_url ?? null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!state.ok || isEditing) return;
    formRef.current?.reset();
    const timeout = window.setTimeout(() => setPreview(null), 0);
    return () => window.clearTimeout(timeout);
  }, [isEditing, state]);

  useEffect(() => () => {
    if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
  }, [preview]);

  function onImageChange(file?: File) {
    setPreview(file ? URL.createObjectURL(file) : product?.image_url ?? null);
  }

  return (
    <form ref={formRef} action={action} className="space-y-6 rounded-[24px] border border-cream-200 bg-white p-5 shadow-soft sm:p-7">
      {product && <input type="hidden" name="product_id" value={product.id} />}
      <div className="flex items-start justify-between gap-4 border-b border-cream-200 pb-5">
        <div>
          <p className={labelClass}>{isEditing ? "Editing product" : "New product"}</p>
          <h2 className="mt-2 text-xl font-black tracking-[-0.02em] text-primary">{product?.name ?? "Add a product to the catalog"}</h2>
        </div>
        {isEditing && <Link href="/admin/products" className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-xl border border-cream-200 px-3 text-xs font-bold text-primary-500 transition hover:border-primary-200 hover:text-primary"><X size={14} /> Cancel</Link>}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="sm:col-span-2"><span className={labelClass}>Product name</span><input name="name" required maxLength={180} defaultValue={product?.name} placeholder="Fellow Stagg EKG Electric Kettle" className={inputClass} /></label>
        <label><span className={labelClass}>Category</span><input name="category" required maxLength={80} defaultValue={product?.category ?? ""} placeholder="Coffee & tea" className={inputClass} /></label>
        <label><span className={labelClass}>ASIN or internal ID</span><input name="asin" maxLength={40} defaultValue={product?.asin ?? ""} placeholder="Optional — generated if blank" className={inputClass} /></label>
        <label><span className={labelClass}>Age audience</span><select name="age_group" defaultValue={product?.age_group ?? ""} className={inputClass}><option value="">Any age</option>{AGE_RANGES.map(item => <option key={item} value={item}>{item}</option>)}</select></label>
        <label><span className={labelClass}>Budget range</span><select name="budget_tier" defaultValue={product?.budget_tier ?? ""} className={inputClass}><option value="">Not specified</option>{BUDGET_TIERS.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
        <label className="sm:col-span-2"><span className={labelClass}>Retailer URL</span><input name="retailer_url" required type="url" defaultValue={product?.amazon_url ?? ""} placeholder="https://..." className={inputClass} /></label>
      </div>

      <fieldset>
        <legend className={labelClass}>Interest categories</legend>
        <p className="mt-2 text-sm text-primary-500">These categories control which recipient profiles this product can match.</p>
        <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {ARCHETYPES.map(item => <label key={item} className="group relative cursor-pointer"><input type="checkbox" name="tags" value={item} defaultChecked={product?.archetype_tags.includes(item)} className="peer sr-only" /><span className="flex min-h-11 items-center justify-between gap-2 rounded-xl border border-cream-200 px-3 py-2.5 text-sm font-semibold text-primary transition peer-checked:border-accent peer-checked:bg-accent-100 peer-checked:text-accent-700"><span>{item}</span><Check size={15} className="opacity-0 transition group-has-[:checked]:opacity-100" /></span></label>)}
        </div>
      </fieldset>

      <label className="block">
        <span className={labelClass}>Product image</span>
        <span className="mt-2 flex min-h-44 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border border-dashed border-cream-300 bg-[#f5f0e8] transition hover:border-accent">
          {preview ? <Image src={preview} alt="Product preview" width={320} height={220} unoptimized className="h-44 w-full object-contain p-4" /> : <span className="flex flex-col items-center gap-2 text-sm font-semibold text-primary-400"><ImagePlus size={28} className="text-accent" />Upload JPG, PNG, or WebP · 5 MB max</span>}
        </span>
        <input name="image" required={!isEditing} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={event => onImageChange(event.target.files?.[0])} />
        {isEditing && <span className="mt-2 block text-xs leading-5 text-primary-400">Choose a new image only if you want to replace the current one.</span>}
      </label>

      <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-cream-200 bg-cream-50 p-4">
        <input name="remove_background" type="checkbox" defaultChecked className="mt-0.5 h-4 w-4 shrink-0 accent-[#f59e0b]" />
        <span>
          <span className="block text-sm font-bold text-primary">Remove plain image background</span>
          <span className="mt-1 block text-xs leading-5 text-primary-500">Recommended for product photos on white, gray, or solid backgrounds. The upload becomes a transparent PNG and uses the same neutral surface everywhere. Turn this off for lifestyle photos or detailed scenes.</span>
        </span>
      </label>

      {state.message && <p role="status" className={`rounded-xl p-3 text-sm font-semibold ${state.ok ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>{state.message}</p>}
      <button disabled={pending} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-primary-800 disabled:cursor-not-allowed disabled:opacity-50">{isEditing ? <Save size={17} className="text-accent" /> : <PackagePlus size={17} className="text-accent" />}{pending ? (isEditing ? "Saving changes…" : "Uploading product…") : (isEditing ? "Save product changes" : "Add product to shop")}</button>
    </form>
  );
}
