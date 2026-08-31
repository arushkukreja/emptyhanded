"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import GoogleAuthButton from "@/components/GoogleAuthButton";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage(props: { searchParams: Promise<{ error?: string; email?: string; next?: string }> }) {
  const searchParams = use(props.searchParams);
  const router = useRouter();
  const [email, setEmail] = useState(searchParams.email ?? "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(
    searchParams.error === "auth_callback"
      ? "We couldn't complete that sign-in. Please try again."
      : searchParams.error === "confirmation_failed"
        ? "That confirmation link is invalid or expired. Sign up again to request a fresh link."
        : null
  );
  const [loading, setLoading] = useState(false);
  const requestedNext = searchParams.next;
  const safeNext = requestedNext?.startsWith("/") && !requestedNext.startsWith("//") ? requestedNext : "/dashboard";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push(safeNext);
    router.refresh();
  }

  async function onForgotPassword() {
    if (!email) {
      setError("Enter your email address first.");
      return;
    }
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/auth/update-password`
    });
    setError(error ? error.message : "Password reset instructions are on their way.");
  }

  return (
    <div>
      <h1 className="display-type text-[30px] font-black leading-tight tracking-[-0.04em] text-primary sm:text-[34px]">Welcome back.</h1>
      <p className="mt-1 text-base text-primary-600">Sign in to your account to continue.</p>
      <div className="mt-7">
        <GoogleAuthButton next={safeNext} />
      </div>
      <div className="my-5 flex items-center gap-3" aria-hidden="true">
        <div className="h-px flex-1 bg-cream-200" />
        <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-primary-400">or use email</span>
        <div className="h-px flex-1 bg-cream-200" />
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        <label className="block">
          <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.06em] text-primary-600">Email address</span>
          <input type="email" required value={email} onChange={event => setEmail(event.target.value)} autoComplete="email" placeholder="you@example.com" className="focus-ring h-[58px] w-full rounded-xl border-0 bg-[#f3efe9] px-5 text-base text-primary placeholder:text-[#7c7c7c]" />
        </label>
        <label className="block">
          <span className="mb-2 flex items-center justify-between gap-4 text-[11px] font-bold uppercase tracking-[0.06em] text-primary-600">Password <button type="button" onClick={onForgotPassword} className="normal-case tracking-normal text-accent-600 transition hover:text-accent-700">Forgot password?</button></span>
          <input type="password" required value={password} onChange={event => setPassword(event.target.value)} autoComplete="current-password" placeholder="••••••••" className="focus-ring h-[58px] w-full rounded-xl border-0 bg-[#f3efe9] px-5 text-base text-primary placeholder:text-[#7c7c7c]" />
        </label>
        {error && <p role="status" className={`rounded-xl px-4 py-3 text-sm ${error.includes("on their way") ? "bg-accent-50 text-accent-700" : "bg-red-50 text-red-700"}`}>{error}</p>}
        <button type="submit" disabled={loading} className="flex h-[58px] w-full items-center justify-center gap-2 rounded-full bg-primary px-6 text-base font-bold text-white transition hover:bg-primary-800 disabled:opacity-50">{loading ? "Signing in..." : <>Sign in <ArrowRight size={18} /></>}</button>
      </form>
      <p className="mt-5 text-center text-sm text-primary-600">No account? <Link href="/signup" className="font-bold text-primary underline underline-offset-4">Sign up free</Link></p>
      <p className="mt-3 text-center text-xs leading-5 text-primary-400">Created your account with Google? Continue with Google above. If you need a password, enter your email and choose Forgot password.</p>
      <p className="mt-4 text-center text-[11px] leading-4 text-primary-400">By signing in you agree to our <Link href="/terms" className="text-primary-600 underline">Terms</Link> and <Link href="/privacy" className="text-primary-600 underline">Privacy Policy</Link>.</p>
    </div>
  );
}
