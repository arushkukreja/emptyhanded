"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export type ReminderPreferenceState = { ok: boolean; message: string };

export async function updateReminderPreference(
  _previous: ReminderPreferenceState,
  formData: FormData
): Promise<ReminderPreferenceState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "Sign in again to continue" };

  const enabled = formData.get("email_reminders_enabled") === "on";
  const { error } = await createAdminClient()
    .from("users")
    .update({ email_reminders_enabled: enabled })
    .eq("id", user.id);

  if (error) return { ok: false, message: "Could not update reminder settings" };
  revalidatePath("/profile");
  return { ok: true, message: enabled ? "Email reminders are on" : "Email reminders are off" };
}
