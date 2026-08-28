"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { ArrowUpRight, Heart, Package } from "lucide-react";
import { toggleRecommendationSaved } from "@/app/(app)/events/actions";
import { getProductImage } from "@/lib/product-images";

interface RecommendationCardProps {
  id: string;
  eventId: string;
  product_name: string;
  amazon_url: string;
  budget_range: string | null;
  reason: string;
  is_saved: boolean;
  image_url?: string | null;
  featured?: boolean;
  index?: number;
  simple?: boolean;
}

export default function RecommendationCard({ id, eventId, product_name, amazon_url, budget_range, reason, is_saved, image_url, featured = false, index = 0, simple = false }: RecommendationCardProps) {
  const [pending, start] = useTransition();
  const [saved, setSaved] = useState(is_saved);
  const productImage = image_url || getProductImage(product_name);
  const isProductCutout = Boolean(image_url)
    || productImage?.includes("/images/catalog/")
    || productImage?.includes("/images/recommendations/");
  const productLinkLabel = amazon_url.includes("amazon.com/s?") ? "Find on Amazon" : "View product";
  const toggle = () => {
    const nextSaved = !saved;
    setSaved(nextSaved);
    start(async () => {
      const result = await toggleRecommendationSaved(id, eventId, nextSaved);
      if (result?.error) setSaved(!nextSaved);
    });
  };

  if (simple) {
    return (
      <article className="group grid h-full min-h-[380px] grid-rows-[220px_1fr] overflow-hidden rounded-[20px] border border-cream-200 bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-lift">
        <div className="relative h-[220px] overflow-hidden bg-[#f5f0e8]">
          {productImage ? (
            <Image src={productImage} alt={product_name} fill priority={index < 2} sizes="(max-width: 767px) 100vw, (max-width: 1024px) 50vw, 33vw" className={`object-contain p-6 transition duration-700 group-hover:scale-[1.03] ${productImage.endsWith(".png") ? "" : "mix-blend-multiply"}`} />
          ) : (
            <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-cream to-accent-100 text-accent-700"><Package size={46} strokeWidth={1.25} aria-hidden="true" /></div>
          )}
        </div>
        <div className="flex min-h-0 flex-col p-5">
          <h3 className="line-clamp-2 h-12 overflow-hidden font-bold leading-6 tracking-[-0.015em] text-primary">{product_name}</h3>
          <a href={amazon_url} target="_blank" rel="noopener noreferrer" aria-label={`${productLinkLabel}: ${product_name}`} className="mt-7 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-xs font-semibold text-white transition hover:bg-primary-800">{productLinkLabel} <ArrowUpRight size={14} /></a>
        </div>
      </article>
    );
  }

  if (featured) {
    return (
      <article className="group mb-6 grid overflow-hidden rounded-[22px] border border-cream-200 bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-lift sm:rounded-[24px] lg:grid-cols-[340px_1fr]">
        <div className="relative min-h-[220px] overflow-hidden bg-cream-100 sm:min-h-64 lg:min-h-[330px]">
          {productImage ? (
            <Image src={productImage} alt={product_name} fill priority={index === 0} sizes="(max-width: 1024px) 100vw, 340px" className={`${isProductCutout ? "object-contain p-6" : "object-cover"} transition duration-700 group-hover:scale-105`} />
          ) : (
            <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-cream to-accent-100 text-accent-700"><Package size={54} strokeWidth={1.25} aria-hidden="true" /></div>
          )}
          <span className="absolute inset-0 bg-gradient-to-t from-primary/35 via-transparent to-transparent" />
          {budget_range && <span className="absolute left-4 top-4 rounded-full bg-accent px-3 py-1.5 text-[11px] font-extrabold text-primary">{budget_range}</span>}
          <span className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-bold text-accent-700 backdrop-blur">✦ Best match</span>
        </div>
        <div className="flex flex-col p-5 sm:p-8">
          <p className="eyebrow">Pick 01 · Featured</p>
          <h3 className="display-type mt-3 text-2xl font-bold leading-tight tracking-[-0.025em] text-primary sm:text-3xl">{product_name}</h3>
          <div className="mt-6 rounded-xl border-l-[3px] border-accent bg-cream-100 p-4 text-sm italic leading-7 text-primary-600"><span className="mb-1 block text-[10px] font-bold not-italic tracking-[0.12em] text-accent-700">WHY THIS FITS</span>{reason}</div>
          <div className="mt-auto flex gap-2 pt-5 sm:pt-6">
            <a href={amazon_url} target="_blank" rel="noopener noreferrer" aria-label={`${productLinkLabel}: ${product_name}`} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-primary-800">{productLinkLabel} <ArrowUpRight size={15} /></a>
            <button type="button" onClick={toggle} disabled={pending} aria-label={saved ? "Unsave" : "Save"} className={`grid w-12 place-items-center rounded-xl border transition ${saved ? "border-accent-200 bg-accent-50 text-accent" : "border-cream-200 text-primary-300 hover:border-accent hover:text-accent"}`}><Heart size={20} fill={saved ? "currentColor" : "none"} /></button>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group grid h-full min-h-[470px] grid-rows-[190px_1fr] overflow-hidden rounded-[20px] border border-cream-200 bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-lift">
      <div className="relative h-[190px] overflow-hidden bg-cream-100">
        {productImage ? (
          <Image src={productImage} alt={product_name} fill priority={index === 0} sizes="(max-width: 767px) 100vw, (max-width: 1024px) 50vw, 33vw" className={`${isProductCutout ? "object-contain p-5" : "object-cover"} transition duration-700 group-hover:scale-105`} />
        ) : (
          <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-cream to-accent-100 text-accent-700"><Package size={46} strokeWidth={1.25} aria-hidden="true" /></div>
        )}
        <span className="absolute inset-0 bg-gradient-to-t from-primary/25 via-transparent to-transparent" />
        {budget_range && <span className="absolute left-2 top-2 rounded-full bg-accent px-2.5 py-1 text-[10px] font-extrabold text-primary">{budget_range}</span>}
        <button type="button" onClick={toggle} disabled={pending} aria-label={saved ? "Unsave" : "Save"} className={`absolute right-2 top-2 grid h-9 w-9 place-items-center rounded-full bg-white/90 shadow-sm backdrop-blur transition ${saved ? "text-accent" : "text-primary-300 hover:text-accent"}`}><Heart size={17} fill={saved ? "currentColor" : "none"} /></button>
      </div>
      <div className="grid grid-rows-[16px_48px_80px_44px] gap-3 p-4 sm:p-5">
        <p className="h-4 text-[10px] font-bold leading-4 tracking-[0.12em] text-primary-400">PICK {String(index + 1).padStart(2, "0")}</p>
        <h3 className="line-clamp-2 h-12 overflow-hidden font-bold leading-6 tracking-[-0.015em] text-primary">{product_name}</h3>
        <p className="line-clamp-3 h-20 overflow-hidden rounded-lg border-l-2 border-accent bg-cream-100 p-3 text-xs italic leading-5 text-primary-500">{reason}</p>
        <a href={amazon_url} target="_blank" rel="noopener noreferrer" aria-label={`${productLinkLabel}: ${product_name}`} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-xs font-semibold text-white transition hover:bg-primary-800">{productLinkLabel} <ArrowUpRight size={14} /></a>
      </div>
    </article>
  );
}
