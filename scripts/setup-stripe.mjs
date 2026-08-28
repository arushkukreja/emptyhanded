import { spawnSync } from "node:child_process";
import Stripe from "stripe";

const secretKey = process.env.STRIPE_SECRET_KEY;
if (!secretKey) throw new Error("STRIPE_SECRET_KEY is not available");

const appUrl = "https://emptyhanded.app";
const stripe = new Stripe(secretKey, { apiVersion: "2026-07-29.dahlia" });

function setVercelEnv(name, value, sensitive = false) {
  const args = [
    "env", "add", name, "production,preview,development",
    "--value", value, "--force", "--yes",
    sensitive ? "--sensitive" : "--no-sensitive"
  ];
  const result = spawnSync("vercel", args, { cwd: process.cwd(), encoding: "utf8" });
  if (result.status !== 0) throw new Error(`Unable to set ${name}: ${result.stderr || result.stdout}`);
}

const products = await stripe.products.list({ active: true, limit: 100 });
let product = products.data.find(item => item.metadata.emptyhanded_plan === "premium");
if (!product) {
  product = await stripe.products.create({
    name: "EmptyHanded Premium",
    description: "Unlimited recipients, fresh recommendations, and seven-day occasion reminders.",
    metadata: { emptyhanded_plan: "premium" }
  });
}

const prices = await stripe.prices.list({ product: product.id, active: true, type: "recurring", limit: 100 });
let price = prices.data.find(item =>
  item.currency === "usd" &&
  item.unit_amount === 499 &&
  item.recurring?.interval === "month" &&
  item.recurring.interval_count === 1
);
if (!price) {
  price = await stripe.prices.create({
    product: product.id,
    currency: "usd",
    unit_amount: 499,
    recurring: { interval: "month" },
    nickname: "Premium monthly"
  });
}

const portalConfigurations = await stripe.billingPortal.configurations.list({ active: true, limit: 100 });
let portalConfiguration = portalConfigurations.data[0];
if (!portalConfiguration) {
  portalConfiguration = await stripe.billingPortal.configurations.create({
    business_profile: {
      headline: "Manage your EmptyHanded Premium subscription",
      privacy_policy_url: `${appUrl}/privacy`,
      terms_of_service_url: `${appUrl}/terms`
    },
    default_return_url: `${appUrl}/upgrade`,
    features: {
      customer_update: { enabled: true, allowed_updates: ["email", "address"] },
      invoice_history: { enabled: true },
      payment_method_update: { enabled: true },
      subscription_cancel: { enabled: true, mode: "at_period_end" }
    }
  });
}

const webhookUrl = `${appUrl}/api/stripe/webhook`;
const webhookEndpoints = await stripe.webhookEndpoints.list({ limit: 100 });
let webhookEndpoint = webhookEndpoints.data.find(item => item.url === webhookUrl && item.status === "enabled");
let webhookSecret;
if (!webhookEndpoint) {
  webhookEndpoint = await stripe.webhookEndpoints.create({
    url: webhookUrl,
    description: "EmptyHanded production subscription lifecycle",
    enabled_events: [
      "checkout.session.completed",
      "checkout.session.async_payment_succeeded",
      "checkout.session.async_payment_failed",
      "customer.subscription.created",
      "customer.subscription.updated",
      "customer.subscription.deleted",
      "invoice.paid",
      "invoice.payment_failed"
    ]
  });
  webhookSecret = webhookEndpoint.secret;
}

setVercelEnv("STRIPE_PRICE_ID", price.id);
setVercelEnv("STRIPE_PORTAL_CONFIGURATION_ID", portalConfiguration.id);
if (webhookSecret) setVercelEnv("STRIPE_WEBHOOK_SECRET", webhookSecret, true);

console.log(JSON.stringify({
  product: product.id,
  price: price.id,
  portal_configuration: portalConfiguration.id,
  webhook_endpoint: webhookEndpoint.id,
  webhook_secret_configured: Boolean(webhookSecret)
}, null, 2));
