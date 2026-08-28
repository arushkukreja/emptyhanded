"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    router.replace("/dashboard");
    router.refresh();
  }

  return (
    <div>
      <p className="eyebrow">Account recovery</p>
      <h1 className="display-type mt-2 text-[30px] font-black leading-tight tracking-[-0.04em] text-primary sm:text-[34px]">Choose a new password.</h1>
      <p className="mt-2 text-base leading-7 text-primary-600">Use at least eight characters and avoid a password you use elsewhere.</p>
      <form onSubmit={onSubmit} className="mt-7 space-y-4">
        <label className="block">
          <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.06em] text-primary-600">New password</span>
          <input type="password" required minLength={8} value={password} onChange={event => setPassword(event.target.value)} autoComplete="new-password" className="focus-ring h-[58px] w-full rounded-xl border-0 bg-[#f3efe9] px-5 text-base text-primary" />
        </label>
        <label className="block">
          <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.06em] text-primary-600">Confirm password</span>
          <input type="password" required minLength={8} value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)} autoComplete="new-password" className="focus-ring h-[58px] w-full rounded-xl border-0 bg-[#f3efe9] px-5 text-base text-primary" />
        </label>
        {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
        <button type="submit" disabled={loading} className="flex h-[58px] w-full items-center justify-center gap-2 rounded-full bg-primary px-6 text-base font-bold text-white transition hover:bg-primary-800 disabled:opacity-50">
          {loading ? "Updating..." : <>Update password <ArrowRight size={18} /></>}
        </button>
      </form>
    </div>
  );
}
