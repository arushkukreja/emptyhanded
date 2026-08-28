import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const LeadSchema = z.object({
  email: z.string().trim().email().max(320),
  source: z.string().trim().max(120).optional(),
  utm_source: z.string().trim().max(200).optional(),
  utm_medium: z.string().trim().max(200).optional(),
  utm_campaign: z.string().trim().max(200).optional(),
  utm_content: z.string().trim().max(200).optional(),
  utm_term: z.string().trim().max(200).optional(),
  company: z.string().max(0).optional()
});

function optionalFormValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function signupRedirect(request: Request, email: string, status: "captured" | "error") {
  const url = new URL("/signup", request.url);
  url.searchParams.set("email", email);
  url.searchParams.set("lead", status);
  return NextResponse.redirect(url, { status: 303 });
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const parsed = LeadSchema.safeParse({
    email: formData.get("email"),
    source: optionalFormValue(formData, "source"),
    utm_source: optionalFormValue(formData, "utm_source"),
    utm_medium: optionalFormValue(formData, "utm_medium"),
    utm_campaign: optionalFormValue(formData, "utm_campaign"),
    utm_content: optionalFormValue(formData, "utm_content"),
    utm_term: optionalFormValue(formData, "utm_term"),
    company: optionalFormValue(formData, "company")
  });

  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase();
  if (parsed.data.company) return signupRedirect(request, email, "captured");

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error("Lead capture is missing SUPABASE_SERVICE_ROLE_KEY");
    return signupRedirect(request, email, "error");
  }

  const now = new Date().toISOString();
  const referrer = request.headers.get("referer")?.slice(0, 1000) ?? null;
  const { error } = await createAdminClient().from("launch_leads").upsert({
    email,
    source: parsed.data.source ?? "landing",
    utm_source: parsed.data.utm_source ?? null,
    utm_medium: parsed.data.utm_medium ?? null,
    utm_campaign: parsed.data.utm_campaign ?? null,
    utm_content: parsed.data.utm_content ?? null,
    utm_term: parsed.data.utm_term ?? null,
    referrer,
    landing_path: "/",
    consent_scope: "product_updates",
    consent_at: now,
    updated_at: now
  }, { onConflict: "email" });

  if (error) {
    console.error("Lead capture failed", error.message);
    return signupRedirect(request, email, "error");
  }

  return signupRedirect(request, email, "captured");
}
