import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";

export type ValidationEventName =
  | "account_created"
  | "occasion_created"
  | "recommendation_saved"
  | "checkout_started"
  | "subscription_activated";

export async function trackValidationEvent(
  userId: string,
  eventName: ValidationEventName,
  properties: Record<string, string | number | boolean | null> = {}
) {
  const { error } = await createAdminClient()
    .from("validation_events")
    .upsert(
      { user_id: userId, event_name: eventName, properties },
      { onConflict: "user_id,event_name", ignoreDuplicates: true }
    );

  if (error) console.error(`Unable to record validation event: ${eventName}`);
}
