"use client";

import Logo from "./Logo";
import SiteMenu from "./SiteMenu";

export default function Nav({ email, name, authenticated = false }: { email?: string; name?: string; authenticated?: boolean }) {
  const displayName = name?.trim() || email?.trim() || "Gift giver";
  const initials = displayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0])
    .join("")
    .toUpperCase() || "GG";

  return (
    <nav className="sticky top-0 z-40 border-b border-cream-200 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:h-[72px] sm:px-8">
        <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
          <SiteMenu />
          <Logo href="/" />
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          {authenticated && (
            <details className="group relative">
              <summary
                className="grid h-9 w-9 cursor-pointer list-none place-items-center rounded-full bg-accent-100 text-xs font-bold text-accent-700 transition hover:bg-accent-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 [&::-webkit-details-marker]:hidden"
                aria-label="Open account menu"
              >
                {initials}
              </summary>
              <div className="absolute right-0 top-full z-50 mt-2 w-36 overflow-hidden rounded-2xl border border-cream-200 bg-white p-1.5 shadow-soft">
                <form action="/auth/signout" method="post">
                  <button type="submit" className="w-full rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-primary-500 transition hover:bg-cream-100 hover:text-primary focus:outline-none focus-visible:bg-cream-100">
                    Sign out
                  </button>
                </form>
              </div>
            </details>
          )}
        </div>
      </div>
    </nav>
  );
}
