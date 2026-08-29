"use server";

import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyUnsubscribeToken } from "@/lib/email/unsubscribe";

export async function unsubscribeFromReminders(formData: FormData) {
  const token = formData.get("token");
  const userId = verifyUnsubscribeToken(typeof token === "string" ? token : null);
  if (!userId) redirect("/email/unsubscribe?status=invalid");

  const { error } = await createAdminClient()
    .from("users")
    .update({ email_reminders_enabled: false })
    .eq("id", userId);

  if (error) redirect(`/email/unsubscribe?status=error&token=${encodeURIComponent(token as string)}`);
  redirect("/email/unsubscribe?status=success");
}
