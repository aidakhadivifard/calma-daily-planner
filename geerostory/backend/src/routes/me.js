import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { db } from '../services/db.js';

const router = Router();

router.get('/me', requireAuth, async (req, res, next) => {
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

export default router;
