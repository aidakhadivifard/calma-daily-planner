import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { db } from '../services/db.js';
import { generateStoryEpisode } from '../services/claudeService.js';
import { generateStoryAudio } from '../services/ttsService.js';
import { generateStoryImage } from '../services/imageService.js';
import { FREE_STORY_LIMIT } from '../config/constants.js';
import { splitPages, titleCaseId } from '../utils/text.js';

const router = Router();

async function buildEpisode({ uid, child, promptSeed, episodeNumber, previousSummary, themeIds }) {
  const { text, summary } = await generateStoryEpisode({
    child,
    promptSeed,
    episodeNumber,
    previousSummary,
  });

  const themeLabels = (themeIds || []).map(titleCaseId);
  const [{ audioUrl, duration }, imageUrl] = await Promise.all([
    generateStoryAudio(text),
    generateStoryImage({ promptSeed: previousSummary || promptSeed, themeLabels }),
  ]);

  return { text, summary, pages: splitPages(text), audioUrl, duration, imageUrl };
}

router.get('/stories', requireAuth, async (req, res, next) => {
  try {
    const bookmarked = req.query.bookmarked === 'true';
    const stories = await db.listStories(req.user.uid, { bookmarked });
    res.json({ stories });
  } catch (err) {
    next(err);
  }
});

router.get('/stories/:id', requireAuth, async (req, res, next) => {
  try {
    const story = await db.getStory(req.user.uid, req.params.id);
    if (!story) return res.status(404).json({ error: 'Story not found.', code: 'not_found' });
    res.json(story);
  } catch (err) {
    next(err);
  }
});

router.patch('/stories/:id', requireAuth, async (req, res, next) => {
  try {
    const { bookmarked } = req.body || {};
    const updated = await db.updateStory(req.user.uid, req.params.id, {
      bookmarked: Boolean(bookmarked),
    });
    if (!updated) return res.status(404).json({ error: 'Story not found.', code: 'not_found' });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

router.post('/stories/generate', requireAuth, async (req, res, next) => {
  try {
    const { adventureId, themeIds, title, promptSeed } = req.body || {};
    if (!adventureId || !title || !promptSeed) {
      return res.status(400).json({ error: 'Missing adventure details.', code: 'invalid_request' });
    }

    const user = await db.getOrCreateUser(req.user.uid, {
      email: req.user.email,
      name: req.user.name,
    });
    const child = await db.getChild(req.user.uid);
    if (!child) {
      return res.status(400).json({ error: "Please add your child's profile first.", code: 'child_required' });
    }

    const isSubscribed = user.subscriptionStatus === 'active';
    if (!isSubscribed && (user.freeStoriesUsed || 0) >= FREE_STORY_LIMIT) {
      return res.status(402).json({ error: 'Free story limit reached.', code: 'payment_required' });
    }

    const episode = await buildEpisode({
      uid: req.user.uid,
      child,
      promptSeed,
      episodeNumber: 1,
      themeIds,
    });

    const story = await db.createStory(req.user.uid, {
      adventureId,
      seriesTitle: title,
      themeIds: themeIds || [],
      episodeNumber: 1,
      title,
      text: episode.text,
      pages: episode.pages,
      episodeSummary: episode.summary,
      imageUrl: episode.imageUrl,
      audioUrl: episode.audioUrl,
      duration: episode.duration,
    });

    if (!isSubscribed) await db.incrementFreeStoriesUsed(req.user.uid);

    res.status(201).json(story);
  } catch (err) {
    next(err);
  }
});

router.post('/stories/:id/continue', requireAuth, async (req, res, next) => {
  try {
    const user = await db.getOrCreateUser(req.user.uid, {
      email: req.user.email,
      name: req.user.name,
    });
    const child = await db.getChild(req.user.uid);
    if (!child) {
      return res.status(400).json({ error: "Please add your child's profile first.", code: 'child_required' });
    }

    const previous = await db.getStory(req.user.uid, req.params.id);
    if (!previous) return res.status(404).json({ error: 'Story not found.', code: 'not_found' });

    const isSubscribed = user.subscriptionStatus === 'active';
    if (!isSubscribed && (user.freeStoriesUsed || 0) >= FREE_STORY_LIMIT) {
      return res.status(402).json({ error: 'Free story limit reached.', code: 'payment_required' });
    }

    const episodeNumber = (previous.episodeNumber || 1) + 1;
    const seriesTitle = previous.seriesTitle || previous.title;

    const episode = await buildEpisode({
      uid: req.user.uid,
      child,
      promptSeed: previous.episodeSummary,
      episodeNumber,
      previousSummary: previous.episodeSummary,
      themeIds: previous.themeIds,
    });

    const story = await db.createStory(req.user.uid, {
      adventureId: previous.adventureId,
      seriesTitle,
      themeIds: previous.themeIds || [],
      episodeNumber,
      title: `${seriesTitle} — Episode ${episodeNumber}`,
      text: episode.text,
      pages: episode.pages,
      episodeSummary: episode.summary,
      imageUrl: episode.imageUrl,
      audioUrl: episode.audioUrl,
      duration: episode.duration,
      previousStoryId: previous.id,
    });

    if (!isSubscribed) await db.incrementFreeStoriesUsed(req.user.uid);

    res.status(201).json(story);
  } catch (err) {
    next(err);
  }
});

export default router;
