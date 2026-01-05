import Stripe from "stripe";

const stripeKey = process.env.STRIPE_SECRET_KEY;

// ❌ لا ترمي Error ولا process.exit في serverless
const stripe = stripeKey
  ? new Stripe(stripeKey, { apiVersion: "2023-10-16" })
  : null;

export default stripe;
