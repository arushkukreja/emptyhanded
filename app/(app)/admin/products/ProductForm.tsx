"use client";

import Image from "next/image";
import { useActionState, useEffect, useRef, useState } from "react";
import { Check, ImagePlus, PackagePlus } from "lucide-react";
import { ARCHETYPES, BUDGET_TIERS, AGE_RANGES } from "@/lib/occasions";
import { createCatalogProduct, type ProductFormState } from "./actions";

const initialState: ProductFormState = { ok: false, message: "" };
const labelClass = "text-xs font-bold uppercase tracking-[0.12em] text-primary-400";
const inputClass = "mt-2 h-12 w-full rounded-xl border border-cream-200 bg-white px-4 text-sm font-semibold text-primary outline-none transition placeholder:text-primary-300 focus:border-accent focus:ring-4 focus:ring-accent/10";

export default function ProductForm() {
  const [state, action, pending] = useActionState(createCatalogProduct, initialState);
  const [preview, setPreview] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!state.ok) return;
    formRef.current?.reset();
    const timeout = window.setTimeout(() => setPreview(current => {
      if (current) URL.revokeObjectURL(current);
      return null;
    }), 0);
    return () => window.clearTimeout(timeout);
  }, [state]);

  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview);
  }, [preview]);

  function onImageChange(file?: File) {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(file ? URL.createObjectURL(file) : null);
  }

  return (
    <form ref={formRef} action={action} className="space-y-6 rounded-[24px] border border-cream-200 bg-white p-5 shadow-soft sm:p-7">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="sm:col-span-2"><span className={labelClass}>Product name</span><input name="name" required maxLength={180} placeholder="Fellow Stagg EKG Electric Kettle" className={inputClass} /></label>
        <label><span className={labelClass}>Category</span><input name="category" required maxLength={80} placeholder="Coffee & tea" className={inputClass} /></label>
        <label><span className={labelClass}>ASIN or internal ID</span><input name="asin" maxLength={40} placeholder="Optional — generated if blank" className={inputClass} /></label>
        <label><span className={labelClass}>Age audience</span><select name="age_group" className={inputClass}><option value="">Any age</option>{AGE_RANGES.map(item => <option key={item} value={item}>{item}</option>)}</select></label>
        <label><span className={labelClass}>Budget range</span><select name="budget_tier" className={inputClass}><option value="">Not specified</option>{BUDGET_TIERS.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
        <label className="sm:col-span-2"><span className={labelClass}>Retailer URL</span><input name="retailer_url" required type="url" placeholder="https://..." className={inputClass} /></label>
      </div>

      <fieldset>
        <legend className={labelClass}>Interest categories</legend>
        <p className="mt-2 text-sm text-primary-500">These categories control which recipient profiles this product can match.</p>
        <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {ARCHETYPES.map(item => <label key={item} className="group relative cursor-pointer"><input type="checkbox" name="tags" value={item} className="peer sr-only" /><span className="flex min-h-11 items-center justify-between gap-2 rounded-xl border border-cream-200 px-3 py-2.5 text-sm font-semibold text-primary transition peer-checked:border-accent peer-checked:bg-accent-100 peer-checked:text-accent-700"><span>{item}</span><Check size={15} className="opacity-0 transition group-has-[:checked]:opacity-100" /></span></label>)}
        </div>
      </fieldset>

      <label className="block">
        <span className={labelClass}>Product image</span>
        <span className="mt-2 flex min-h-44 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border border-dashed border-cream-300 bg-[#f5f0e8] transition hover:border-accent">
          {preview ? <Image src={preview} alt="Product preview" width={320} height={220} unoptimized className="h-44 w-full object-contain p-4" /> : <span className="flex flex-col items-center gap-2 text-sm font-semibold text-primary-400"><ImagePlus size={28} className="text-accent" />Upload JPG, PNG, or WebP · 5 MB max</span>}
        </span>
        <input name="image" required type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={event => onImageChange(event.target.files?.[0])} />
      </label>

      {state.message && <p role="status" className={`rounded-xl p-3 text-sm font-semibold ${state.ok ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>{state.message}</p>}
      <button disabled={pending} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-primary-800 disabled:cursor-not-allowed disabled:opacity-50"><PackagePlus size={17} className="text-accent" />{pending ? "Uploading product…" : "Add product to shop"}</button>
    </form>
  );
}
