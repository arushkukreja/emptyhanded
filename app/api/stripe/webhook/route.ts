import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { trackValidationEvent } from "@/lib/validation-events";

export const runtime = "nodejs";

type SubscriptionStatus = "free" | "active" | "canceled" | "past_due";

function customerId(value: string | Stripe.Customer | Stripe.DeletedCustomer | null): string | null {
  if (!value) return null;
  return typeof value === "string" ? value : value.id;
}

function mappedStatus(status: Stripe.Subscription.Status): SubscriptionStatus {
  switch (status) {
    case "active":
    case "trialing":
      return "active";
    case "past_due":
    case "unpaid":
      return "past_due";
    case "canceled":
      return "canceled";
    default:
      return "free";
  }
}

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !secret) {
    return NextResponse.json({ error: "Webhook is not configured" }, { status: 400 });
  }

  const stripe = getStripe();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(await request.text(), signature, secret);
  } catch {
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  const admin = createAdminClient();

  async function setUserSubscription(
    userId: string,
    status: SubscriptionStatus,
    stripeCustomerId: string | null
  ) {
    const { error } = await admin
      .from("users")
      .update({
        subscription_status: status,
        ...(stripeCustomerId ? { stripe_customer_id: stripeCustomerId } : {})
      })
      .eq("id", userId);
    if (error) throw error;
    if (status === "active") await trackValidationEvent(userId, "subscription_activated");
  }

  async function userIdFromCustomer(stripeCustomerId: string): Promise<string | null> {
    const { data, error } = await admin
      .from("users")
      .select("id")
      .eq("stripe_customer_id", stripeCustomerId)
      .maybeSingle();
    if (error) throw error;
    return data?.id ?? null;
  }

  async function updateFromCheckout(session: Stripe.Checkout.Session) {
    const userId = session.client_reference_id ?? session.metadata?.user_id ?? null;
    const stripeCustomerId = customerId(session.customer);
    if (!userId) return;

    if (session.payment_status === "unpaid") {
      if (stripeCustomerId) {
        const { error } = await admin
          .from("users")
          .update({ stripe_customer_id: stripeCustomerId })
          .eq("id", userId);
        if (error) throw error;
      }
      return;
    }

    await setUserSubscription(userId, "active", stripeCustomerId);
  }

  async function updateFromSubscription(subscription: Stripe.Subscription) {
    const stripeCustomerId = customerId(subscription.customer);
    if (!stripeCustomerId) return;
    const userId = subscription.metadata?.user_id || await userIdFromCustomer(stripeCustomerId);
    if (userId) await setUserSubscription(userId, mappedStatus(subscription.status), stripeCustomerId);
  }

  async function updateFromInvoice(invoice: Stripe.Invoice, status: SubscriptionStatus) {
    if (invoice.parent?.type !== "subscription_details") return;
    const stripeCustomerId = customerId(invoice.customer);
    if (!stripeCustomerId) return;
    const userId = await userIdFromCustomer(stripeCustomerId);
    if (userId) await setUserSubscription(userId, status, stripeCustomerId);
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded":
        await updateFromCheckout(event.data.object as Stripe.Checkout.Session);
        break;
      case "checkout.session.async_payment_failed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.client_reference_id ?? session.metadata?.user_id ?? null;
        if (userId) await setUserSubscription(userId, "free", customerId(session.customer));
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        await updateFromSubscription(event.data.object as Stripe.Subscription);
        break;
      case "invoice.paid":
        await updateFromInvoice(event.data.object as Stripe.Invoice, "active");
        break;
      case "invoice.payment_failed":
        await updateFromInvoice(event.data.object as Stripe.Invoice, "past_due");
        break;
      default:
        break;
    }
  } catch {
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
