import { NextResponse } from "next/server";
import { Resend } from "resend";
import { addDays, format, parseISO } from "date-fns";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateRecommendations } from "@/lib/recommendations/gemini";
import { amazonUrlFor } from "@/lib/recommendations/save";
import { renderReminderEmail } from "@/lib/email/reminder";
import { OCCASION_EMOJI, OCCASION_LABEL } from "@/lib/occasions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) return NextResponse.json({ error: "Missing RESEND_API_KEY" }, { status: 500 });
  const emailFrom = process.env.EMAIL_FROM?.trim();
  if (!emailFrom) return NextResponse.json({ error: "Missing EMAIL_FROM" }, { status: 500 });
  const emailReplyTo = process.env.EMAIL_REPLY_TO?.trim();
  const resend = new Resend(resendKey);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const admin = createAdminClient();
  const target = format(addDays(new Date(), 7), "yyyy-MM-dd");

  const { data: events, error } = await admin
    .from("events")
    .select("id, user_id, recipient_name, occasion_type, event_date")
    .eq("event_date", target);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const results: Array<{ event_id: string; status: string; reason?: string }> = [];

  for (const ev of events ?? []) {
    const { data: alreadySent } = await admin
      .from("reminders_sent")
      .select("id")
      .eq("event_id", ev.id)
      .maybeSingle();
    if (alreadySent) {
      results.push({ event_id: ev.id, status: "skipped", reason: "already_sent" });
      continue;
    }

    const { data: userRow } = await admin
      .from("users")
      .select("id, email")
      .eq("id", ev.user_id)
      .maybeSingle();
    if (!userRow) {
      results.push({ event_id: ev.id, status: "skipped", reason: "user_not_found" });
      continue;
    }
    if (!userRow.email) {
      results.push({ event_id: ev.id, status: "skipped", reason: "no_email" });
      continue;
    }

    let { data: recs } = await admin
      .from("recommendations")
      .select("product_name, asin, amazon_url, budget_range, reason")
      .eq("event_id", ev.id)
      .eq("is_saved", true)
      .order("created_at", { ascending: false })
      .limit(3);

    if (!recs || recs.length === 0) {
      try {
        const { data: profile } = await admin
          .from("recipient_profiles")
          .select("relationship, age, age_range, gender, archetypes, interests, budget_tier, past_gifts")
          .eq("event_id", ev.id)
          .maybeSingle();
        const fresh = await generateRecommendations({
          recipient_name: ev.recipient_name,
          occasion_type: ev.occasion_type,
          event_date: ev.event_date,
          relationship: profile?.relationship,
          age: profile?.age,
          age_range: profile?.age_range,
          gender: profile?.gender,
          archetypes: profile?.archetypes ?? [],
          interests: profile?.interests,
          budget_tier: profile?.budget_tier,
          past_gifts: profile?.past_gifts
        });
        recs = fresh.slice(0, 3).map(r => ({
          product_name: r.product_name,
          asin: r.asin ?? null,
          amazon_url: amazonUrlFor(r),
          budget_range: r.budget_range ?? null,
          reason: r.reason
        }));
      } catch {
        results.push({ event_id: ev.id, status: "error", reason: "gen_failed" });
        continue;
      }
    }

    const { subject, html } = renderReminderEmail({
      recipient_name: ev.recipient_name,
      occasion_label: OCCASION_LABEL[ev.occasion_type] ?? ev.occasion_type,
      occasion_emoji: OCCASION_EMOJI[ev.occasion_type] ?? "🎁",
      formatted_date: format(parseISO(ev.event_date), "MMMM d, yyyy"),
      recommendations: recs ?? [],
      app_url: appUrl,
      event_id: ev.id
    });

    try {
      const { error: sendError } = await resend.emails.send({
        from: emailFrom,
        to: userRow.email,
        subject,
        html,
        ...(emailReplyTo ? { replyTo: emailReplyTo } : {})
      }, {
        idempotencyKey: `event-reminder-${ev.id}-${target}`
      });
      if (sendError) throw new Error(sendError.message);

      const { error: recordError } = await admin.from("reminders_sent").insert({ event_id: ev.id });
      if (recordError && recordError.code !== "23505") throw recordError;
      results.push({ event_id: ev.id, status: "sent" });
    } catch {
      results.push({
        event_id: ev.id,
        status: "error",
        reason: "send_failed"
      });
    }
  }

  return NextResponse.json({ ok: true, target_date: target, results });
}
