import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { db } from '../services/db.js';
import { features } from '../config/env.js';
import {
  createCheckoutSession,
  constructWebhookEvent,
  planFromPriceId,
} from '../services/stripeService.js';

const router = Router();

router.get('/billing/status', requireAuth, async (req, res, next) => {
  try {
    const user = await db.getOrCreateUser(req.user.uid, {
      email: req.user.email,
      name: req.user.name,
    });
    res.json(user);
  } catch (err) {
    next(err);
  }
});

router.post('/billing/checkout', requireAuth, async (req, res, next) => {
  try {
    if (!features.hasStripe) {
      return res
        .status(400)
        .json({ error: 'Stripe is not configured on this server.', code: 'stripe_unavailable' });
    }
    const { plan } = req.body || {};
    if (!['monthly', 'yearly'].includes(plan)) {
      return res.status(400).json({ error: 'Unknown plan.', code: 'invalid_request' });
    }
    const url = await createCheckoutSession({ uid: req.user.uid, plan, customerEmail: req.user.email });
    res.json({ url });
  } catch (err) {
    next(err);
  }
});

// Demo-mode subscription toggle, used when Stripe isn't configured.
router.post('/billing/simulate', requireAuth, async (req, res, next) => {
  try {
    const { plan } = req.body || {};
    if (!['monthly', 'yearly'].includes(plan)) {
      return res.status(400).json({ error: 'Unknown plan.', code: 'invalid_request' });
    }
    const user = await db.setSubscription(req.user.uid, { status: 'active', plan });
    res.json(user);
  } catch (err) {
    next(err);
  }
});

export async function stripeWebhookHandler(req, res) {
  if (!features.hasStripe) return res.status(400).send('Stripe is not configured.');

  let event;
  try {
    event = constructWebhookEvent(req.body, req.headers['stripe-signature']);
  } catch {
    return res.status(400).send('Invalid webhook signature.');
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const uid = session.client_reference_id || session.metadata?.uid;
    const plan = session.metadata?.plan || planFromPriceId(session?.line_items?.data?.[0]?.price?.id);
    if (uid) {
      await db.setSubscription(uid, { status: 'active', plan: plan || null });
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object;
    const uid = subscription.metadata?.uid;
    if (uid) {
      await db.setSubscription(uid, { status: 'free', plan: null });
    }
  }

  res.json({ received: true });
}

export default router;
