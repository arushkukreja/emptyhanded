import "server-only";

import { createAdminClient, hasSupabaseAdminKey } from "@/lib/supabase/admin";
import { trackValidationEvent } from "@/lib/validation-events";

export async function completeSignin(user: { id: string; email?: string | null }) {
  if (!user.email || !hasSupabaseAdminKey()) return;

  const now = new Date().toISOString();
  await createAdminClient()
    .from("launch_leads")
    .update({ converted_user_id: user.id, converted_at: now, updated_at: now })
    .eq("email", user.email.trim().toLowerCase());

  await trackValidationEvent(user.id, "account_created");
}
