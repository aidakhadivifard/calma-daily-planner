import { randomUUID } from 'crypto';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import OpenAI from 'openai';
import { env, features } from '../config/env.js';
import { estimateDurationSeconds } from './claudeService.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const PUBLIC_DIR = path.join(__dirname, '../../public');
const AUDIO_DIR = path.join(PUBLIC_DIR, 'audio');

const client = features.hasOpenAiTts ? new OpenAI({ apiKey: env.openaiApiKey }) : null;

function createSilentWavBuffer(durationSeconds, sampleRate = 8000) {
  const numSamples = Math.max(1, Math.floor(durationSeconds * sampleRate));
  const dataSize = numSamples * 2;
  const buffer = Buffer.alloc(44 + dataSize);

  buffer.write('RIFF', 0, 'ascii');
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8, 'ascii');
  buffer.write('fmt ', 12, 'ascii');
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36, 'ascii');
  buffer.writeUInt32LE(dataSize, 40);

  return buffer;
}

/**
 * Generates narration audio for a story and saves it to /public/audio.
 * Returns { audioUrl, duration } where audioUrl is a path served by the API.
 */
export async function generateStoryAudio(text) {
  await mkdir(AUDIO_DIR, { recursive: true });
  const duration = estimateDurationSeconds(text);

  if (!client) {
    const id = randomUUID();
    const buffer = createSilentWavBuffer(duration);
    const filename = `${id}.wav`;
    await writeFile(path.join(AUDIO_DIR, filename), buffer);
    return { audioUrl: `/api/audio/${filename}`, duration };
  }

  const response = await client.audio.speech.create({
    model: env.openaiTtsModel,
    voice: env.openaiTtsVoice,
    input: text,
  });
  const arrayBuffer = await response.arrayBuffer();
  const id = randomUUID();
  const filename = `${id}.mp3`;
  await writeFile(path.join(AUDIO_DIR, filename), Buffer.from(arrayBuffer));
  return { audioUrl: `/api/audio/${filename}`, duration };
}
