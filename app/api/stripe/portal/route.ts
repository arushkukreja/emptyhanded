import { NextResponse } from "next/server";
import { getAppUrl } from "@/lib/app-url";
import { getStripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: userRow, error } = await supabase
    .from("users")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .maybeSingle();

  if (error) return NextResponse.json({ error: "Unable to load billing details" }, { status: 500 });
  if (!userRow?.stripe_customer_id) {
    return NextResponse.json({ error: "No billing account was found" }, { status: 404 });
  }

  let session;
  try {
    session = await getStripe().billingPortal.sessions.create({
      customer: userRow.stripe_customer_id,
      configuration: process.env.STRIPE_PORTAL_CONFIGURATION_ID || undefined,
      return_url: `${getAppUrl()}/upgrade`
    });
  } catch {
    return NextResponse.json({ error: "Billing management is temporarily unavailable" }, { status: 502 });
  }

  return NextResponse.json({ url: session.url });
}
