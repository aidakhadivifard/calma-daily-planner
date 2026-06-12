import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { db } from '../services/db.js';

const router = Router();

router.get('/child', requireAuth, async (req, res, next) => {
  try {
    const child = await db.getChild(req.user.uid);
    res.json(child);
  } catch (err) {
    next(err);
  }
});

router.put('/child', requireAuth, async (req, res, next) => {
  try {
    const { name, age, physicalDescription } = req.body || {};
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: "Child's name is required.", code: 'invalid_request' });
    }
    const child = await db.saveChild(req.user.uid, {
      name: name.trim(),
      age: Number(age) || 6,
      physicalDescription: (physicalDescription || '').trim(),
    });
    res.json(child);
  } catch (err) {
    next(err);
  }
});

export default router;
