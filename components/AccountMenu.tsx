"use client";

import Link from "next/link";
import { LayoutDashboard, ShieldCheck, UserRound } from "lucide-react";

export default function AccountMenu({ email, name, isAdmin = false }: { email?: string; name?: string; isAdmin?: boolean }) {
  const displayName = name?.trim() || email?.trim() || "Gift giver";
  const initials = displayName.split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]).join("").toUpperCase() || "GG";

  return (
    <details className="group relative">
      <summary className="grid h-9 w-9 cursor-pointer list-none place-items-center rounded-full bg-accent-100 text-xs font-bold text-accent-700 transition hover:bg-accent-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 [&::-webkit-details-marker]:hidden" aria-label="Open account menu">{initials}</summary>
      <div className="absolute right-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-2xl border border-cream-200 bg-white p-1.5 shadow-soft">
        <Link href="/dashboard" className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-primary-500 transition hover:bg-cream-100 hover:text-primary"><LayoutDashboard size={15} /> Dashboard</Link>
        <Link href="/profile" className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-primary-500 transition hover:bg-cream-100 hover:text-primary"><UserRound size={15} /> Your profile</Link>
        {isAdmin && <Link href="/admin/products" className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-primary-500 transition hover:bg-cream-100 hover:text-primary"><ShieldCheck size={15} /> Products</Link>}
        <div className="my-1 h-px bg-cream-200" />
        <form action="/auth/signout" method="post"><button type="submit" className="w-full rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-primary-500 transition hover:bg-cream-100 hover:text-primary">Sign out</button></form>
      </div>
    </details>
  );
}
