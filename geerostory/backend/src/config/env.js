import 'dotenv/config';

export const env = {
  port: Number(process.env.PORT) || 5050,
  corsOrigin: process.env.CORS_ORIGIN || '*',

  anthropicApiKey: process.env.ANTHROPIC_API_KEY || '',
  anthropicModel: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-20250514',

  openaiApiKey: process.env.OPENAI_API_KEY || '',
  openaiTtsModel: process.env.OPENAI_TTS_MODEL || 'tts-1',
  openaiTtsVoice: process.env.OPENAI_TTS_VOICE || 'alloy',
  openaiImageModel: process.env.OPENAI_IMAGE_MODEL || 'dall-e-3',

  firebaseProjectId: process.env.FIREBASE_PROJECT_ID || '',
  firebaseClientEmail: process.env.FIREBASE_CLIENT_EMAIL || '',
  firebasePrivateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
  firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET || '',

  stripeSecretKey: process.env.STRIPE_SECRET_KEY || '',
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  stripePriceIdMonthly: process.env.STRIPE_PRICE_ID_MONTHLY || '',
  stripePriceIdYearly: process.env.STRIPE_PRICE_ID_YEARLY || '',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
};

export const features = {
  hasFirebase: Boolean(
    env.firebaseProjectId && env.firebaseClientEmail && env.firebasePrivateKey,
  ),
  hasAnthropic: Boolean(env.anthropicApiKey),
  hasOpenAiText: Boolean(env.openaiApiKey),
  hasOpenAiTts: Boolean(env.openaiApiKey),
  hasOpenAiImage: Boolean(env.openaiApiKey),
  hasStripe: Boolean(env.stripeSecretKey),
};
