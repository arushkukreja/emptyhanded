import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CalendarDays, Check, Gift, Heart, Mail, Sparkles } from "lucide-react";
import Logo from "@/components/Logo";
import Footer from "@/components/Footer";
import SiteMenu from "@/components/SiteMenu";
import { hasSupabaseSessionCookie } from "@/lib/auth-session";
import { createClient } from "@/lib/supabase/server";
import AccountMenu from "@/components/AccountMenu";

const steps = [
  { number: "01", title: "Add an occasion", copy: "Birthday, anniversary, baby shower—drop in the date and the person. It takes less than a minute.", icon: CalendarDays },
  { number: "02", title: "Tell us who they are", copy: "A homebody who loves bourbon. A foodie minimalist. The details make every recommendation feel personal.", icon: Sparkles },
  { number: "03", title: "Get thoughtful picks", copy: "Seven days before the event, fresh gift ideas arrive with enough time to choose well.", icon: Mail }
];

const features = [
  { icon: "✦", title: "Personal, never generic", copy: "Recommendations shaped around their interests, personality, your budget, and gifts you have already given." },
  { icon: "◷", title: "Remembered for you", copy: "A timely reminder lands seven days before the occasion, so last-minute panic never gets a vote." },
  { icon: "↗", title: "From idea to ordered", copy: "Every suggestion includes a direct shopping link. Thoughtful can still be beautifully easy." }
];

const freeFeatures = [
  "Unlimited recipients and occasions",
  "Personalized gift recommendations",
  "Unlimited recommendation refreshes",
  "Automatic seven-day email reminders",
  "Saved gifts and preference memory"
];

type LandingSearchParams = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  source?: string;
};

export default async function LandingPage({ searchParams }: { searchParams: Promise<LandingSearchParams> }) {
  const campaign = await searchParams;
  let user: { id: string; email?: string } | null = null;
  let appUser: { display_name: string | null; is_admin: boolean } | null = null;
  if (await hasSupabaseSessionCookie()) {
    try {
      const supabase = await createClient();
      const result = await supabase.auth.getUser();
      user = result.data.user ? { id: result.data.user.id, email: result.data.user.email } : null;
      if (user) {
        const profileResult = await supabase.from("users").select("display_name, is_admin").eq("id", user.id).maybeSingle();
        appUser = profileResult.data;
      }
    } catch {
      user = null;
    }
  }
  const startHref = user ? "/dashboard" : "/signup";

  return (
    <main className="min-h-screen overflow-hidden bg-cream">
      <header className="relative z-30 border-b border-cream-200 bg-cream/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:h-[76px] sm:px-8 lg:px-10">
          <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
            <SiteMenu />
            <Logo />
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            {user ? (
              <AccountMenu email={user.email} name={appUser?.display_name ?? undefined} isAdmin={Boolean(appUser?.is_admin)} />
            ) : (
              <>
                <Link href="/login" className="hidden text-sm font-semibold text-primary-600 transition hover:text-primary sm:block">Sign in</Link>
                <Link href="/signup" className="whitespace-nowrap rounded-full bg-primary px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-primary-800 sm:px-5 sm:text-sm">Get started</Link>
              </>
            )}
          </div>
        </div>
      </header>

      <section className="relative">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="animate-orb-a absolute -right-56 -top-52 h-[760px] w-[760px] rounded-full bg-[radial-gradient(circle_at_40%_40%,rgba(245,158,11,.28),rgba(245,158,11,.06)_46%,transparent_70%)]" />
          <div className="animate-orb-b absolute -bottom-96 -left-64 h-[850px] w-[850px] rounded-full bg-[radial-gradient(circle,rgba(15,23,42,.08),rgba(15,23,42,.025)_52%,transparent_70%)]" />
          <div className="absolute left-[38%] top-[24%] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(254,243,199,.85),transparent_68%)]" />
        </div>

        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-9 px-5 py-10 sm:grid-cols-[1.03fr_.97fr] sm:gap-5 sm:px-8 sm:py-12 lg:gap-12 lg:px-10 lg:py-16">
          <div className="animate-fade-up">
            <h1 className="display-type max-w-3xl text-[clamp(2.35rem,11vw,4.8rem)] font-black leading-[.95] tracking-[-0.05em] text-primary sm:text-[clamp(2.7rem,5.4vw,4.8rem)]">
              Never show up empty handed <em className="font-bold text-accent">again.</em>
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-6 text-primary-600 lg:text-lg lg:leading-8">
              Add the people who matter. We learn what they love. Before every birthday, anniversary, or shower, thoughtful gift ideas arrive right on time.
            </p>

            <form id="start" action={user ? startHref : "/api/leads"} method={user ? "get" : "post"} className="mt-7 flex max-w-lg flex-col items-stretch gap-1.5 rounded-[24px] border border-cream-200 bg-white/90 p-1.5 shadow-lift backdrop-blur min-[390px]:flex-row min-[390px]:items-center min-[390px]:gap-1 min-[390px]:rounded-full sm:gap-2">
              {!user && <>
                <input name="email" type="email" required autoComplete="email" aria-label="Email address" placeholder="you@goodfriend.com" className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-primary outline-none placeholder:text-primary-400" />
                <input type="hidden" name="source" value={campaign.source ?? "landing"} />
                <input type="hidden" name="utm_source" value={campaign.utm_source ?? ""} />
                <input type="hidden" name="utm_medium" value={campaign.utm_medium ?? ""} />
                <input type="hidden" name="utm_campaign" value={campaign.utm_campaign ?? ""} />
                <input type="hidden" name="utm_content" value={campaign.utm_content ?? ""} />
                <input type="hidden" name="utm_term" value={campaign.utm_term ?? ""} />
                <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-px w-px opacity-0" />
              </>}
              <button className={`inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full bg-primary px-4 py-3 text-xs font-semibold text-white transition hover:bg-primary-800 sm:gap-2 sm:px-5 sm:text-sm ${user ? "w-full" : "max-[389px]:w-full"}`}>
                {user ? "Open your calendar" : "Start free"} <ArrowRight size={16} />
              </button>
            </form>
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium text-primary-400">
              <span className="inline-flex items-center gap-1.5"><Check size={14} className="text-accent-600" /> Completely free during early access</span>
              <span className="inline-flex items-center gap-1.5"><Check size={14} className="text-accent-600" /> No card required</span>
            </div>
            {!user && <p className="mt-3 max-w-lg text-[11px] leading-5 text-primary-400">By continuing, you agree to the <Link href="/terms" className="underline">Terms</Link> and <Link href="/privacy" className="underline">Privacy Policy</Link> and may receive occasional product updates. Unsubscribe anytime.</p>}
          </div>

          <div className="relative mx-auto flex h-[470px] w-full max-w-[510px] flex-col gap-4 min-[390px]:h-[500px] sm:h-[535px] sm:gap-6 lg:h-[550px]">
            <div className="animate-card-float-back shrink-0 rounded-[22px] border border-cream-200 bg-white/85 p-4 shadow-soft backdrop-blur">
              <p className="text-[10px] font-bold tracking-[0.14em] text-primary-400">NEXT UP</p>
              <div className="mt-3 flex items-center gap-3">
                <span className="relative block h-11 w-11 shrink-0 overflow-hidden rounded-full ring-2 ring-white"><Image src="/images/david-lila.jpg" alt="David and Lila" fill sizes="44px" className="object-cover" /></span>
                <div><p className="font-bold text-primary">David & Lila&apos;s anniversary</p><p className="mt-1 text-xs text-primary-500">Nov 4 · 19 days away</p></div>
              </div>
            </div>

            <div className="animate-card-float flex min-h-0 flex-1 flex-col overflow-hidden rounded-[22px] border border-cream-200 bg-white p-4 shadow-[0_24px_70px_-20px_rgba(245,158,11,.36)] sm:rounded-[24px] sm:p-5 lg:p-6">
              <div className="flex items-center justify-between gap-4">
                <p className="text-[10px] font-bold tracking-[0.14em] text-primary-400">UPCOMING</p>
                <span className="rounded-full bg-accent px-3 py-1.5 text-[11px] font-extrabold text-primary">⏰ in 7 days</span>
              </div>
              <div className="mt-4 flex items-center gap-4">
                <span className="relative block h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-accent-200"><Image src="/images/maya.jpg" alt="Maya" fill sizes="56px" className="object-cover" /></span>
                <div><h2 className="display-type text-xl font-bold text-primary sm:text-2xl">Maya&apos;s birthday</h2><p className="mt-1 text-xs text-primary-500">Tuesday, Oct 23 · turns 32</p></div>
              </div>
              <div className="mt-4 rounded-2xl bg-cream-100 p-3.5">
                <p className="text-[10px] font-bold tracking-[0.12em] text-accent-700">WHY THIS FITS MAYA</p>
                <p className="mt-2 text-sm italic leading-6 text-primary-600">“She carries a notebook everywhere. This linen-bound journal gets better with every year.”</p>
              </div>
              <div className="mt-auto grid grid-cols-3 gap-2 pt-4">
                {[Gift, Heart, Sparkles].map((Icon, index) => (
                  <div key={index} className="grid h-14 place-items-center rounded-xl bg-gradient-to-br from-[#f6efe5] to-[#ede6dc] text-[#987451]"><Icon size={22} strokeWidth={1.5} /></div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-cream-200 pt-4">
                <p className="text-xs font-bold text-primary sm:text-sm">5 thoughtful picks ready</p>
                <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-white"><ArrowRight size={16} /></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="bg-white px-5 py-16 sm:px-8 sm:py-24 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="eyebrow">A thoughtful system</p>
            <h2 className="display-type mx-auto mt-3 max-w-2xl text-4xl font-bold tracking-[-0.035em] text-primary sm:text-5xl">Good gifting, minus the guesswork.</h2>
          </div>
          <div className="mt-10 grid gap-10 sm:mt-16 md:grid-cols-3">
            {steps.map(({ number, title, copy, icon: Icon }) => (
              <article key={number} className="group border-t border-cream-200 pt-7">
                <div className="flex items-center justify-between"><span className="display-type text-5xl font-black text-accent-700 transition group-hover:text-accent-800">{number}</span><span className="grid h-11 w-11 place-items-center rounded-xl bg-cream text-primary"><Icon size={20} /></span></div>
                <h3 className="display-type mt-5 text-2xl font-bold text-primary">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-primary-600">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="bg-primary px-5 py-16 text-white sm:px-8 sm:py-20 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-3">
          {features.map(feature => (
            <article key={feature.title}>
              <span className="text-3xl text-accent">{feature.icon}</span>
              <h3 className="display-type mt-5 text-xl font-bold">{feature.title}</h3>
              <p className="mt-3 text-sm leading-7 text-white/55">{feature.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="pricing" className="px-5 py-16 sm:px-8 sm:py-24 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Early-access pricing</p>
          <h2 className="display-type mt-3 text-4xl font-bold tracking-[-0.035em] text-primary sm:text-5xl">Everything is free while we learn.</h2>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-primary-500">Use the full product, invite every important person into your calendar, and tell us what makes it useful. No card and no hidden upgrade.</p>
          <div className="mt-9 overflow-hidden rounded-[24px] border border-cream-200 bg-white text-left shadow-soft sm:mt-12 sm:rounded-[28px]">
            <div className="flex h-full flex-col p-6 sm:p-10">
              <div className="text-center"><p className="eyebrow !text-primary-400">Free early access</p><p className="display-type mt-3 text-5xl font-black text-primary">$0</p></div>
              <ul className="mt-8 grid flex-1 gap-4 text-sm text-primary-600 sm:grid-cols-2">{freeFeatures.map(item => <li key={item} className="flex gap-3"><Check size={17} className="shrink-0 text-accent" />{item}</li>)}</ul>
              <Link href={startHref} className="mt-9 inline-flex w-full justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-800">Start free</Link>
            </div>
          </div>
        </div>
      </section>

      <Footer signedIn={Boolean(user)} />
    </main>
  );
}
