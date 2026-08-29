"use client";

import { useActionState } from "react";
import { Bell, Save } from "lucide-react";
import { updateReminderPreference, type ReminderPreferenceState } from "./reminder-actions";

const initialState: ReminderPreferenceState = { ok: false, message: "" };

export default function ReminderPreferences({ enabled }: { enabled: boolean }) {
  const [state, action, pending] = useActionState(updateReminderPreference, initialState);

  return (
    <form action={action} className="mt-5 rounded-[24px] border border-cream-200 bg-white p-5 shadow-soft sm:p-7">
      <div className="flex items-center justify-between gap-5">
        <div className="flex min-w-0 items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent-100 text-accent-700"><Bell size={18} /></span>
          <div><p className="text-sm font-bold text-primary">Email reminders</p><p className="mt-1 text-xs leading-5 text-primary-400">Receive a thoughtful reminder seven days before each occasion.</p></div>
        </div>
        <label className="relative inline-flex shrink-0 cursor-pointer items-center">
          <input name="email_reminders_enabled" type="checkbox" defaultChecked={enabled} className="peer sr-only" />
          <span className="inline-block h-7 w-12 rounded-full bg-primary-200 transition peer-checked:bg-accent peer-focus-visible:ring-4 peer-focus-visible:ring-accent/20 after:absolute after:left-1 after:top-1 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow-sm after:transition-transform peer-checked:after:translate-x-5" />
          <span className="sr-only">Enable email reminders</span>
        </label>
      </div>
      {state.message && <p role="status" className={`mt-4 rounded-xl p-3 text-sm font-semibold ${state.ok ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>{state.message}</p>}
      <div className="mt-5 flex justify-end"><button disabled={pending} className="inline-flex items-center gap-2 rounded-full border border-primary px-5 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white disabled:opacity-50"><Save size={15} className="text-accent" />{pending ? "Saving…" : "Save reminder settings"}</button></div>
    </form>
  );
}
