"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { addYears, format, isValid, parseISO } from "date-fns";
import { createClient } from "@/lib/supabase/server";
import { generateRecommendations } from "@/lib/recommendations/gemini";
import { saveRecommendations } from "@/lib/recommendations/save";
import { trackValidationEvent } from "@/lib/validation-events";
import { ageRangeForAge } from "@/lib/occasions";

const CreateEventSchema = z.object({
  occasion_type: z.enum([
    "birthday",
    "anniversary",
    "wedding",
    "baby_shower",
    "graduation",
    "housewarming",
    "holiday"
  ]),
  event_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(value => {
    const date = parseISO(value);
    if (!isValid(date) || format(date, "yyyy-MM-dd") !== value) return false;
    const today = format(new Date(), "yyyy-MM-dd");
    const latest = format(addYears(new Date(), 10), "yyyy-MM-dd");
    return value >= today && value <= latest;
  }, "Choose a valid date within the next 10 years"),
  recipient_name: z.string().trim().min(1).max(100),
  relationship: z.string().trim().max(80).optional(),
  age: z.number().int().min(0).max(120).optional(),
  gender: z.string().trim().max(80).optional(),
  archetypes: z.array(z.string().trim().min(1).max(80)).max(15).default([]),
  interests: z.string().trim().max(2000).optional(),
  budget_tier: z.string().trim().max(40).optional(),
  past_gifts: z.string().trim().max(2000).optional()
});

export type CreateEventInput = z.infer<typeof CreateEventSchema>;

export async function createEvent(input: CreateEventInput) {
  const validation = CreateEventSchema.safeParse(input);
  if (!validation.success) return { error: validation.error.issues[0]?.message ?? "Please check the event details" };
  const parsed = validation.data;
  const ageRange = ageRangeForAge(parsed.age);
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data: event, error: eventErr } = await supabase
    .from("events")
    .insert({
      user_id: user.id,
      occasion_type: parsed.occasion_type,
      event_date: parsed.event_date,
      recipient_name: parsed.recipient_name
    })
    .select("id")
    .single();
  if (eventErr || !event) return { error: eventErr?.message ?? "Failed to create event" };

  const { error: profErr } = await supabase.from("recipient_profiles").insert({
    event_id: event.id,
    relationship: parsed.relationship || null,
    age: parsed.age ?? null,
    age_range: ageRange,
    gender: parsed.gender || null,
    archetypes: parsed.archetypes,
    interests: parsed.interests || null,
    budget_tier: parsed.budget_tier || null,
    past_gifts: parsed.past_gifts || null
  });
  if (profErr) {
    await supabase.from("events").delete().eq("id", event.id);
    return { error: profErr.message };
  }
  await trackValidationEvent(user.id, "occasion_created", { occasion_type: parsed.occasion_type });

  try {
    const recs = await generateRecommendations({
      recipient_name: parsed.recipient_name,
      occasion_type: parsed.occasion_type,
      event_date: parsed.event_date,
      relationship: parsed.relationship,
      age: parsed.age,
      age_range: ageRange,
      gender: parsed.gender,
      archetypes: parsed.archetypes,
      interests: parsed.interests,
      budget_tier: parsed.budget_tier,
      past_gifts: parsed.past_gifts
    });
    await saveRecommendations(supabase, event.id, recs);
  } catch (e) {
    // Continue even if generation fails — user can retry from event page.
    console.error("Recommendation generation failed:", e);
  }

  revalidatePath("/dashboard");
  return { id: event.id };
}

export async function regenerateRecommendations(eventId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data: event } = await supabase
    .from("events")
    .select("id, recipient_name, occasion_type, event_date")
    .eq("id", eventId)
    .single();
  if (!event) return { error: "Not found" };

  const { data: profile } = await supabase
    .from("recipient_profiles")
    .select("relationship, age, age_range, gender, archetypes, interests, budget_tier, past_gifts")
    .eq("event_id", eventId)
    .maybeSingle();

  const recs = await generateRecommendations({
    recipient_name: event.recipient_name,
    occasion_type: event.occasion_type,
    event_date: event.event_date,
    relationship: profile?.relationship,
    age: profile?.age,
    age_range: profile?.age_range,
    gender: profile?.gender,
    archetypes: profile?.archetypes ?? [],
    interests: profile?.interests,
    budget_tier: profile?.budget_tier,
    past_gifts: profile?.past_gifts
  });
  await saveRecommendations(supabase, eventId, recs);
  revalidatePath(`/events/${eventId}`);
  return { ok: true };
}

export async function updateEventProfile(eventId: string, input: CreateEventInput) {
  const validation = CreateEventSchema.safeParse(input);
  if (!validation.success) return { error: validation.error.issues[0]?.message ?? "Please check the profile details" };
  const parsed = validation.data;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data: event } = await supabase
    .from("events")
    .select("id")
    .eq("id", eventId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!event) return { error: "Event not found" };

  const { error: eventError } = await supabase
    .from("events")
    .update({
      occasion_type: parsed.occasion_type,
      event_date: parsed.event_date,
      recipient_name: parsed.recipient_name
    })
    .eq("id", eventId)
    .eq("user_id", user.id);
  if (eventError) return { error: eventError.message };

  const { error: profileError } = await supabase
    .from("recipient_profiles")
    .update({
      relationship: parsed.relationship || null,
      ...(parsed.age !== undefined ? { age: parsed.age, age_range: ageRangeForAge(parsed.age) } : {}),
      gender: parsed.gender || null,
      archetypes: parsed.archetypes,
      interests: parsed.interests || null,
      budget_tier: parsed.budget_tier || null,
      past_gifts: parsed.past_gifts || null
    })
    .eq("event_id", eventId);
  if (profileError) return { error: profileError.message };

  revalidatePath(`/events/${eventId}`);
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function toggleRecommendationSaved(recId: string, eventId: string, saved: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };
  const { error } = await supabase
    .from("recommendations")
    .update({ is_saved: saved })
    .eq("id", recId);
  if (error) return { error: error.message };
  if (saved) await trackValidationEvent(user.id, "recommendation_saved");
  revalidatePath(`/events/${eventId}`);
  revalidatePath("/recommendations");
  return { ok: true };
}

export async function deleteEvent(eventId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("events").delete().eq("id", eventId);
  if (error) return { error: error.message };
  revalidatePath("/dashboard");
  redirect("/dashboard");
}
