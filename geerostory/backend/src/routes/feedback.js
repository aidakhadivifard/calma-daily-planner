import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { db } from '../services/db.js';

const router = Router();

router.post('/feedback', requireAuth, async (req, res, next) => {
  try {
    const { message } = req.body || {};
    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Feedback message is required.', code: 'invalid_request' });
    }
    await db.addFeedback(req.user.uid, message.trim());
    res.status(201).json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;
