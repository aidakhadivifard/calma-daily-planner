import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { env, features } from './config/env.js';
import meRoutes from './routes/me.js';
import childRoutes from './routes/child.js';
import storiesRoutes from './routes/stories.js';
import billingRoutes, { stripeWebhookHandler } from './routes/billing.js';
import feedbackRoutes from './routes/feedback.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, '../public');

const app = express();

app.use(cors({ origin: env.corsOrigin }));

// Stripe needs the raw request body to verify the webhook signature, so this
// route is registered before the global JSON body parser.
app.post('/api/billing/webhook', express.raw({ type: 'application/json' }), stripeWebhookHandler);

app.use(express.json());
app.use('/api/audio', express.static(path.join(PUBLIC_DIR, 'audio')));
app.use('/api/images', express.static(path.join(PUBLIC_DIR, 'images')));

app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    mode: {
      firebase: features.hasFirebase ? 'live' : 'mock',
      anthropic: features.hasAnthropic ? 'live' : 'mock',
      tts: features.hasOpenAiTts ? 'live' : 'mock',
      images: features.hasOpenAiImage ? 'live' : 'mock',
      stripe: features.hasStripe ? 'live' : 'mock',
    },
  });
});

app.use('/api', meRoutes);
app.use('/api', childRoutes);
app.use('/api', storiesRoutes);
app.use('/api', billingRoutes);
app.use('/api', feedbackRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Not found.', code: 'not_found' });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error.', code: 'internal_error' });
});

app.listen(env.port, () => {
  console.log(`Geero API listening on http://localhost:${env.port}`);
  console.log(
    `Mode — firebase: ${features.hasFirebase ? 'live' : 'mock'}, anthropic: ${features.hasAnthropic ? 'live' : 'mock'}, tts/images: ${features.hasOpenAiTts ? 'live' : 'mock'}, stripe: ${features.hasStripe ? 'live' : 'mock'}`,
  );
});
