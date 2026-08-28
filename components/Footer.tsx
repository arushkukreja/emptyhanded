import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Logo from "./Logo";

export default function Footer({ signedIn = false }: { signedIn?: boolean }) {
  return (
    <footer className="bg-primary px-5 py-10 text-white sm:px-8 sm:py-12 lg:px-12">
      <div className="mx-auto grid max-w-[1480px] grid-cols-2 items-start gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        <div className="col-span-2 flex flex-col items-start lg:col-span-1 lg:-mt-2">
          <Logo inverted />
          <Link href={signedIn ? "/dashboard" : "/signup"} className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-bold text-primary transition hover:bg-accent-400">{signedIn ? "Open dashboard" : "Get started free"} <ArrowRight size={15} /></Link>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/30">Product</p>
          <div className="mt-5 space-y-3 text-sm text-white/50">
            {signedIn ? (
              <>
                <Link className="block hover:text-white" href="/dashboard">Dashboard</Link>
                <Link className="block hover:text-white" href="/recommendations">Recommendations</Link>
              </>
            ) : (
              <>
                <Link className="block hover:text-white" href="/#how-it-works">How it works</Link>
                <Link className="block hover:text-white" href="/#pricing">Pricing</Link>
              </>
            )}
          </div>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/30">Company</p>
          <div className="mt-5 space-y-3 text-sm text-white/50"><Link className="block hover:text-white" href="/#about">About</Link><a className="block hover:text-white" href="mailto:hello@emptyhanded.app">Contact</a></div>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/30">Legal</p>
          <div className="mt-5 space-y-3 text-sm text-white/50"><Link className="block hover:text-white" href="/terms">Terms & Conditions</Link><Link className="block hover:text-white" href="/privacy">Privacy Policy</Link></div>
        </div>
      </div>
      <p className="mx-auto mt-10 max-w-[1480px] border-t border-white/10 pt-6 text-center text-xs leading-6 text-white/35">Some product links are affiliate links. If you buy through them, emptyhanded may earn a commission at no extra cost to you.</p>
      <p className="mx-auto mt-5 max-w-[1480px] text-center text-xs text-white/25">© 2026 EmptyHanded. All rights reserved.</p>
    </footer>
  );
}
