import Anthropic from '@anthropic-ai/sdk';
import { env, features } from '../config/env.js';

const client = features.hasAnthropic ? new Anthropic({ apiKey: env.anthropicApiKey }) : null;

const WORDS_PER_MINUTE = 145;
const TARGET_WORD_COUNT = 700;

export function estimateDurationSeconds(text) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(60, Math.round((words / WORDS_PER_MINUTE) * 60));
}

function buildSystemPrompt({ child, episodeNumber }) {
  const descriptionRule = child.physicalDescription
    ? `The grown-ups have shared this description of ${child.name}, and you may weave it in naturally: "${child.physicalDescription}".`
    : `Do NOT describe ${child.name}'s physical appearance (hair, eyes, clothing, etc.) — let every family picture their own hero. Refer to them only by name.`;

  return [
    `You are Geero, a warm, gentle giraffe who writes personalized bedtime stories for children.`,
    `You are writing for ${child.name}, age ${child.age}. ${child.name} is the hero of every story.`,
    descriptionRule,
    `Write approximately ${TARGET_WORD_COUNT} words (roughly a 5-minute read-aloud). Use simple, vivid, age-appropriate language for a ${child.age}-year-old.`,
    `Tone: warm, encouraging, cozy, and never scary. The story should wind down toward a calm, sleepy ending suitable for bedtime.`,
    `Structure the story as 5 to 7 short paragraphs separated by a blank line, so it can be shown one paragraph at a time.`,
    episodeNumber > 1
      ? `This is episode ${episodeNumber} of an ongoing series. Continue naturally from the story so far, then bring this episode to a gentle, satisfying close while leaving a small thread that could continue another night.`
      : `This is the first episode of a new series. End this episode with a gentle resolution, while leaving a small thread that could continue another night.`,
    `Only ever feature ${child.name} as the human character — do not introduce other human children or adults as central characters.`,
    `Respond with ONLY a JSON object (no markdown fences, no extra text) with exactly these keys:`,
    `{"story": "the full story text, paragraphs separated by \\n\\n", "summary": "a warm 2-3 sentence recap of this episode's events, written for parents, usable as a blurb and as context for the next episode"}`,
  ].join('\n');
}

function buildUserPrompt({ promptSeed, episodeNumber, previousSummary }) {
  if (episodeNumber > 1 && previousSummary) {
    return [
      `Here is what happened so far in this adventure: ${previousSummary}`,
      `Write the next episode, continuing this story.`,
    ].join('\n');
  }
  return `Write a bedtime story based on this premise: ${promptSeed}`;
}

function parseJsonResponse(raw) {
  const cleaned = raw.trim().replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
  const parsed = JSON.parse(cleaned);
  if (!parsed.story || !parsed.summary) throw new Error('Missing story or summary in AI response.');
  return { text: parsed.story.trim(), summary: parsed.summary.trim() };
}

function mockStoryEpisode({ child, promptSeed, episodeNumber, previousSummary }) {
  const { name } = child;
  const opening =
    episodeNumber > 1 && previousSummary
      ? `${name} stretched and looked around, remembering everything that had happened so far: ${previousSummary}`
      : `One quiet evening, ${name} noticed something magical waiting just beyond the ordinary world. ${promptSeed}`;

  const paragraphs = [
    `${opening} With a deep breath and a brave little smile, ${name} stepped forward to see what would happen next.`,
    `The air shimmered with soft light, and ${name} could hear gentle sounds drifting from somewhere nearby — a hum, a rustle, a friendly little chirp. Curious as ever, ${name} followed the sound, taking careful steps and noticing tiny wonderful details all along the way: colors that seemed to glow, shapes that seemed to dance, and a feeling that something kind was waiting up ahead.`,
    `Soon ${name} arrived at the heart of it all, and there was a small problem to solve — nothing too scary, just a puzzle that needed a clever and caring friend. ${name} thought carefully, the way ${name} always did, turning the puzzle over and over in their mind until a wonderful idea began to form.`,
    `${name} tried the idea, and at first it didn't quite work. But ${name} didn't give up. Instead, ${name} took a moment to breathe, to look again with fresh eyes, and to remember that every good adventure has a tricky part right before the best part.`,
    `With one more gentle try — and maybe a little help from a new friend along the way — everything clicked into place. The problem was solved, and a warm, happy feeling spread through the whole scene, like sunlight after rain. Everyone nearby cheered softly for ${name}, grateful for such a kind and clever visitor.`,
    `As the adventure settled into a peaceful close, ${name} felt proud, sleepy, and so very glad to have helped. The world around them seemed to glow a little softer now, tucking itself in for the night. "Thank you, ${name}," it seemed to whisper, "come back again soon." And with that, ${name}'s eyes grew heavy, ready for cozy dreams and another adventure another night.`,
  ];

  const text = paragraphs.join('\n\n');
  const summary =
    episodeNumber > 1
      ? `${name} continued the adventure, solved a new gentle challenge with kindness and cleverness, and ended the night feeling proud and sleepy.`
      : `${name} discovered a magical new world, solved a friendly little problem with patience and creativity, and made the world around them feel happier — ending the night feeling proud and cozy.`;

  return { text, summary };
}

export async function generateStoryEpisode({ child, promptSeed, episodeNumber = 1, previousSummary = null }) {
  if (!client) {
    return mockStoryEpisode({ child, promptSeed, episodeNumber, previousSummary });
  }

  const response = await client.messages.create({
    model: env.anthropicModel,
    max_tokens: 2000,
    system: buildSystemPrompt({ child, episodeNumber }),
    messages: [{ role: 'user', content: buildUserPrompt({ promptSeed, episodeNumber, previousSummary }) }],
  });

  const raw = response.content.find((block) => block.type === 'text')?.text || '';
  return parseJsonResponse(raw);
}
