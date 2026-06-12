import Stripe from 'stripe';
import { env, features } from '../config/env.js';

export const stripeClient = features.hasStripe ? new Stripe(env.stripeSecretKey) : null;

const PRICE_IDS = {
  monthly: env.stripePriceIdMonthly,
  yearly: env.stripePriceIdYearly,
};

export async function createCheckoutSession({ uid, plan, customerEmail }) {
  const priceId = PRICE_IDS[plan];
  if (!priceId) throw new Error(`Unknown subscription plan: ${plan}`);

  const session = await stripeClient.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${env.clientUrl}/app/home?checkout=success`,
    cancel_url: `${env.clientUrl}/paywall?checkout=cancelled`,
    client_reference_id: uid,
    customer_email: customerEmail || undefined,
    metadata: { uid, plan },
  });

  return session.url;
}

export function constructWebhookEvent(payload, signature) {
  return stripeClient.webhooks.constructEvent(payload, signature, env.stripeWebhookSecret);
}

/** Maps a Stripe price ID back to our internal plan name. */
export function planFromPriceId(priceId) {
  if (priceId === env.stripePriceIdMonthly) return 'monthly';
  if (priceId === env.stripePriceIdYearly) return 'yearly';
  return null;
}
