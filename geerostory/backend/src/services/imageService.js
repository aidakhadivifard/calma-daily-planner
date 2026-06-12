import { randomUUID } from 'crypto';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import OpenAI from 'openai';
import { env, features } from '../config/env.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const IMAGES_DIR = path.join(__dirname, '../../public/images');

const client = features.hasOpenAiImage ? new OpenAI({ apiKey: env.openaiApiKey }) : null;

function buildImagePrompt({ promptSeed, themeLabels }) {
  return [
    `A cozy, whimsical children's-book illustration of a scene for this story moment: ${promptSeed}.`,
    `Show only the setting and environment — no people, no children, no human characters, no text or words in the image.`,
    themeLabels?.length ? `Style influences: ${themeLabels.join(', ')}.` : '',
    `Soft painterly style, warm and dreamy color palette suited for a bedtime story, gentle lighting, inviting and magical atmosphere.`,
  ]
    .filter(Boolean)
    .join(' ');
}

/**
 * Generates a single cover illustration for a story (scene/world only, no
 * characters). Returns an imageUrl served by the API, or null when no image
 * provider is configured — the frontend falls back to a themed gradient cover.
 */
export async function generateStoryImage({ promptSeed, themeLabels }) {
  if (!client) return null;

  await mkdir(IMAGES_DIR, { recursive: true });

  const response = await client.images.generate({
    model: env.openaiImageModel,
    prompt: buildImagePrompt({ promptSeed, themeLabels }),
    size: '1024x1024',
    response_format: 'b64_json',
    n: 1,
  });

  const b64 = response.data[0]?.b64_json;
  if (!b64) return null;

  const filename = `${randomUUID()}.png`;
  await writeFile(path.join(IMAGES_DIR, filename), Buffer.from(b64, 'base64'));
  return `/api/images/${filename}`;
}
