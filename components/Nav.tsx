"use client";

import Logo from "./Logo";
import SiteMenu from "./SiteMenu";
import AccountMenu from "./AccountMenu";

export default function Nav({ email, name, authenticated = false, isAdmin = false }: { email?: string; name?: string; authenticated?: boolean; isAdmin?: boolean }) {
  return (
    <nav className="sticky top-0 z-40 border-b border-cream-200 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:h-[72px] sm:px-8">
        <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
          <SiteMenu />
          <Logo href="/" />
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          {authenticated && <AccountMenu email={email} name={name} isAdmin={isAdmin} />}
        </div>
      </div>
    </nav>
  );
}
