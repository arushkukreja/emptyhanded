import Link from "next/link";
import { BellOff, CheckCircle2 } from "lucide-react";
import Logo from "@/components/Logo";
import { verifyUnsubscribeToken } from "@/lib/email/unsubscribe";
import { unsubscribeFromReminders } from "./actions";

export default async function UnsubscribePage({
  searchParams
}: {
  searchParams: Promise<{ token?: string; status?: string }>;
}) {
  const { token, status } = await searchParams;
  const validToken = status ? null : verifyUnsubscribeToken(token);

  return (
    <main className="grid min-h-screen place-items-center bg-[#eeeae3] px-5 py-12">
      <section className="w-full max-w-md rounded-[28px] border border-cream-200 bg-white p-7 text-center shadow-lift sm:p-10">
        <div className="flex justify-center"><Logo /></div>
        {status === "success" ? (
          <>
            <CheckCircle2 className="mx-auto mt-8 text-emerald-600" size={38} />
            <h1 className="display-type mt-4 text-3xl font-black tracking-[-0.04em] text-primary">Reminders are off.</h1>
            <p className="mt-3 text-sm leading-7 text-primary-500">You will no longer receive occasion reminder emails. You can turn them back on anytime from your profile.</p>
            <Link href="/profile" className="mt-7 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white">Open profile</Link>
          </>
        ) : validToken ? (
          <>
            <BellOff className="mx-auto mt-8 text-accent" size={38} />
            <h1 className="display-type mt-4 text-3xl font-black tracking-[-0.04em] text-primary">Turn off reminders?</h1>
            <p className="mt-3 text-sm leading-7 text-primary-500">This stops seven-day occasion reminders only. Account and security emails will still be delivered.</p>
            <form action={unsubscribeFromReminders} className="mt-7">
              <input type="hidden" name="token" value={token} />
              <button className="w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white">Unsubscribe from reminders</button>
            </form>
          </>
        ) : (
          <>
            <h1 className="display-type mt-8 text-3xl font-black tracking-[-0.04em] text-primary">This link is not valid.</h1>
            <p className="mt-3 text-sm leading-7 text-primary-500">Open your profile to manage reminder emails securely.</p>
            <Link href="/profile" className="mt-7 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white">Open profile</Link>
          </>
        )}
      </section>
    </main>
  );
}
