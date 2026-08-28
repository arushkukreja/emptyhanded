import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2026-07-29.dahlia" });

if (process.argv[2] === "delete") {
  const subscriptionId = process.argv[3];
  const customerId = process.argv[4];
  if (!subscriptionId || !customerId) throw new Error("Subscription and customer IDs are required");
  await stripe.subscriptions.cancel(subscriptionId);
  await stripe.customers.del(customerId);
  console.log("Deleted E2E subscription and customer");
} else {
  const userId = process.argv[2];
  const email = process.argv[3];
  if (!userId || !email) throw new Error("User ID and email are required");

  const customer = await stripe.customers.create({ email, metadata: { user_id: userId } });
  const paymentMethod = await stripe.paymentMethods.attach("pm_card_visa", { customer: customer.id });
  await stripe.customers.update(customer.id, {
    invoice_settings: { default_payment_method: paymentMethod.id }
  });
  const subscription = await stripe.subscriptions.create({
    customer: customer.id,
    items: [{ price: process.env.STRIPE_PRICE_ID }],
    metadata: { user_id: userId },
    payment_behavior: "error_if_incomplete"
  });

  console.log(JSON.stringify({ customer: customer.id, subscription: subscription.id, status: subscription.status }));
}
