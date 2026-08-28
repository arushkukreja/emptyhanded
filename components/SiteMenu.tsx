"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { House, LayoutDashboard, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home", description: "About emptyhanded", icon: House },
  { href: "/dashboard", label: "Dashboard", description: "Your occasion calendar", icon: LayoutDashboard }
];

export default function SiteMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function closeOnOutsideClick(event: MouseEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={open}
        aria-controls="site-menu"
        onClick={() => setOpen(current => !current)}
        className="grid h-11 w-11 place-items-center rounded-full border border-cream-200 bg-white text-primary shadow-sm transition hover:border-accent hover:bg-accent-50 focus:outline-none focus:ring-4 focus:ring-accent/15"
      >
        {open ? <X size={20} /> : <Menu size={21} />}
      </button>

      {open && (
        <div id="site-menu" className="absolute left-0 top-[calc(100%+12px)] z-50 w-[min(330px,calc(100vw-32px))] overflow-hidden rounded-[22px] border border-cream-200 bg-white p-2 shadow-lift">
          <div className="px-3 pb-2 pt-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-primary-400">Explore emptyhanded</p>
          </div>
          {links.map(({ href, label, description, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`group flex items-center gap-3 rounded-2xl px-3 py-3 transition ${active ? "bg-primary text-white" : "text-primary hover:bg-cream"}`}
              >
                <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${active ? "bg-white/10 text-accent" : "bg-cream-100 text-primary-500 group-hover:bg-accent-100 group-hover:text-accent-700"}`}><Icon size={18} /></span>
                <span className="min-w-0">
                  <span className="block text-sm font-bold">{label}</span>
                  <span className={`mt-0.5 block text-[11px] ${active ? "text-white/50" : "text-primary-400"}`}>{description}</span>
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
