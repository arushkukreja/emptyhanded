import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { getAppUrl } from "@/lib/app-url";
import { trackValidationEvent } from "@/lib/validation-events";

export async function POST() {
  if (process.env.PAID_PLANS_ENABLED !== "true") {
    return NextResponse.json(
      { error: "Paid plans are paused while EmptyHanded is free during early access." },
      { status: 409 }
    );
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const priceId = process.env.STRIPE_PRICE_ID;
  if (!priceId) return NextResponse.json({ error: "Missing STRIPE_PRICE_ID" }, { status: 500 });

  const appUrl = getAppUrl();

  const { data: userRow } = await supabase
    .from("users")
    .select("stripe_customer_id, subscription_status")
    .eq("id", user.id)
    .maybeSingle();

  if (userRow?.subscription_status === "active" || userRow?.subscription_status === "past_due") {
    return NextResponse.json(
      { error: "You already have a subscription. Use Manage billing instead." },
      { status: 409 }
    );
  }

  let session;
  try {
    const stripe = getStripe();
    session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      customer: userRow?.stripe_customer_id ?? undefined,
      customer_email: userRow?.stripe_customer_id ? undefined : (user.email ?? undefined),
      success_url: `${appUrl}/dashboard?upgraded=1`,
      cancel_url: `${appUrl}/upgrade`,
      client_reference_id: user.id,
      integration_identifier: "emptyhanded_v1_kqmdzrst",
      subscription_data: { metadata: { user_id: user.id } },
      metadata: { user_id: user.id }
    });
  } catch {
    return NextResponse.json({ error: "Checkout is temporarily unavailable" }, { status: 502 });
  }

  if (!session.url) {
    return NextResponse.json({ error: "Stripe did not return a checkout URL" }, { status: 502 });
  }
  await trackValidationEvent(user.id, "checkout_started", { price_id: priceId });
  return NextResponse.json({ url: session.url });
}
