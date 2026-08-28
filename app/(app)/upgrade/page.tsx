import Link from "next/link";
import { Check, Gift, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

const FEATURES = ["Unlimited recipients", "Unlimited recommendation refreshes", "Email reminders seven days before every event", "Saved gifts and preference history"];

export default function UpgradePage() {
  return (
    <div className="relative overflow-hidden px-4 py-10 pb-16 min-[390px]:px-5 sm:px-8 sm:py-14 sm:pb-24">
      <div className="animate-orb-a pointer-events-none absolute -right-72 -top-72 h-[700px] w-[700px] rounded-full bg-[radial-gradient(circle,rgba(245,158,11,.2),transparent_68%)]" />
      <div className="relative z-10 mx-auto max-w-4xl">
        <div className="text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-accent-100 text-accent-700"><Gift size={25} /></span>
          <p className="eyebrow mt-6">Free early access</p>
          <h1 className="display-type mt-3 text-4xl font-black tracking-[-0.04em] text-primary sm:text-6xl">The full product is yours.</h1>
          <p className="mx-auto mt-5 max-w-xl leading-7 text-primary-500">We are focused on learning what helps people give better gifts. Every feature is free during early access—no card or upgrade required.</p>
        </div>

        <div className="mt-9 grid overflow-hidden rounded-[24px] border border-cream-200 bg-white shadow-lift sm:mt-12 sm:rounded-[28px] md:grid-cols-[.8fr_1.2fr]">
          <div className="flex flex-col justify-between bg-primary p-6 text-white sm:p-10">
            <div><p className="text-xs font-bold uppercase tracking-[0.12em] text-accent">One simple plan</p><div className="mt-5 flex items-end gap-2"><span className="display-type text-6xl font-black leading-none">$0</span></div><p className="mt-4 text-sm leading-6 text-white/50">Everything included while EmptyHanded is in early access.</p></div>
            <Sparkles className="mt-12 text-accent" size={34} strokeWidth={1.4} />
          </div>
          <div className="p-6 sm:p-10">
            <p className="text-sm font-bold text-primary">Everything you need to show up well</p>
            <ul className="mt-6 space-y-4">{FEATURES.map(feature => <li key={feature} className="flex items-start gap-3 text-sm leading-6 text-primary-600"><span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent-100 text-accent-700"><Check size={12} strokeWidth={2.5} /></span>{feature}</li>)}</ul>
            <Link href="/dashboard" className="mt-9 inline-flex w-full justify-center rounded-full bg-primary px-5 py-3 text-sm font-bold text-white transition hover:bg-primary-800">Open your dashboard</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
