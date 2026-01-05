import Stripe from "stripe";

const stripeKey = process.env.STRIPE_SECRET_KEY;

if (!stripeKey) {
  console.error("❌ STRIPE_SECRET_KEY is missing");
  process.exit(1);
}

const stripe = new Stripe(stripeKey, {
  apiVersion: "2023-10-16",
});

export default stripe;
