"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import GoogleAuthButton from "@/components/GoogleAuthButton";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage(props: { searchParams: Promise<{ email?: string; next?: string; lead?: string }> }) {
  const searchParams = use(props.searchParams);
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState(searchParams.email ?? "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const requestedNext = searchParams.next;
  const safeNext = requestedNext?.startsWith("/") && !requestedNext.startsWith("//") ? requestedNext : "/dashboard";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(safeNext)}`,
        data: { first_name: firstName, last_name: lastName, full_name: `${firstName} ${lastName}`.trim() }
      }
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    if (data.session) {
      router.push(safeNext);
      router.refresh();
    } else {
      setDone(true);
    }
  }

  if (done) {
    return (
      <>
        <p className="eyebrow">One last step</p>
        <h1 className="display-type mt-2 text-4xl font-black text-primary">Check your email.</h1>
        <p className="mt-3 leading-7 text-primary-500">
          We sent a confirmation link to <strong>{email}</strong>. Click it to finish signing up.
        </p>
      </>
    );
  }

  return (
    <div>
      <h1 className="display-type text-[30px] font-black leading-tight tracking-[-0.04em] text-primary sm:text-[34px]">Create your account.</h1>
      <p className="mt-1 text-base text-primary-600">Free forever. No credit card required.</p>
      {searchParams.lead === "captured" && <p className="mt-4 rounded-xl bg-accent-50 px-4 py-3 text-sm font-medium text-accent-700">You&apos;re on the launch list. Create your free account to try EmptyHanded now.</p>}
      <div className="mt-5">
        <GoogleAuthButton next={safeNext} />
      </div>
      <div className="my-4 flex items-center gap-3" aria-hidden="true">
        <div className="h-px flex-1 bg-cream-200" />
        <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-primary-400">or use email</span>
        <div className="h-px flex-1 bg-cream-200" />
      </div>
      <form onSubmit={onSubmit} className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
          <label className="block"><span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.06em] text-primary-600">First name</span><input required value={firstName} onChange={event => setFirstName(event.target.value)} autoComplete="given-name" placeholder="John" className="focus-ring h-[52px] w-full rounded-xl border-0 bg-[#f3efe9] px-5 text-base text-primary placeholder:text-[#7c7c7c]" /></label>
          <label className="block"><span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.06em] text-primary-600">Last name</span><input required value={lastName} onChange={event => setLastName(event.target.value)} autoComplete="family-name" placeholder="Smith" className="focus-ring h-[52px] w-full rounded-xl border-0 bg-[#f3efe9] px-5 text-base text-primary placeholder:text-[#7c7c7c]" /></label>
        </div>
        <label className="block"><span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.06em] text-primary-600">Email address</span><input type="email" required value={email} onChange={event => setEmail(event.target.value)} autoComplete="email" placeholder="you@example.com" className="focus-ring h-[52px] w-full rounded-xl border-0 bg-[#f3efe9] px-5 text-base text-primary placeholder:text-[#7c7c7c]" /></label>
        <label className="block"><span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.06em] text-primary-600">Password</span><input type="password" required minLength={8} value={password} onChange={event => setPassword(event.target.value)} autoComplete="new-password" placeholder="Min. 8 characters" className="focus-ring h-[52px] w-full rounded-xl border-0 bg-[#f3efe9] px-5 text-base text-primary placeholder:text-[#7c7c7c]" /></label>
        {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
        <button type="submit" disabled={loading} className="flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-accent px-6 text-sm font-bold text-primary transition hover:bg-accent-400 disabled:opacity-50">{loading ? "Creating..." : <>Create free account <ArrowRight size={17} /></>}</button>
      </form>
      <p className="mt-4 text-center text-sm text-primary-600">Already have an account? <Link href="/login" className="font-bold text-primary underline underline-offset-4">Sign in</Link></p>
      <p className="mt-3 text-center text-[11px] leading-4 text-primary-400">By creating an account you agree to our <Link href="/terms" className="text-primary-600 underline">Terms</Link> and <Link href="/privacy" className="text-primary-600 underline">Privacy Policy</Link>.</p>
    </div>
  );
}
