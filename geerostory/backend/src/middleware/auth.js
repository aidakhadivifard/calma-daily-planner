import { admin } from '../config/firebaseAdmin.js';
import { features } from '../config/env.js';

/**
 * Verifies the Firebase ID token from the Authorization header.
 * When Firebase Admin isn't configured, falls back to parsing the
 * `mock.<uid>.<name>` tokens issued by the frontend's mock auth context.
 */
export async function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Missing Authorization header.', code: 'unauthenticated' });
  }

  if (features.hasFirebase) {
    try {
      const decoded = await admin.auth().verifyIdToken(token);
      req.user = {
        uid: decoded.uid,
        name: decoded.name || decoded.email || decoded.phone_number || 'Parent',
        email: decoded.email || null,
      };
      return next();
    } catch {
      return res.status(401).json({ error: 'Invalid or expired session.', code: 'unauthenticated' });
    }
  }

  const mockMatch = token.match(/^mock\.([^.]+)\.(.*)$/);
  if (mockMatch) {
    req.user = {
      uid: mockMatch[1],
      name: decodeURIComponent(mockMatch[2] || '') || 'Parent',
      email: null,
    };
    return next();
  }

  return res.status(401).json({ error: 'Invalid session token.', code: 'unauthenticated' });
}
