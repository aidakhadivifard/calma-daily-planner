import { admin, db } from '../../config/firebaseAdmin.js';

function newUserRecord() {
  return {
    freeStoriesUsed: 0,
    subscriptionStatus: 'free',
    subscriptionPlan: null,
    createdAt: new Date().toISOString(),
  };
}

export const firestoreStore = {
  async getOrCreateUser(uid, profile = {}) {
    const ref = db.collection('users').doc(uid);
    const snap = await ref.get();
    if (!snap.exists) {
      const record = { uid, ...newUserRecord(), ...profile };
      await ref.set(record);
      return record;
    }
    return { uid, ...snap.data() };
  },

  async getChild(uid) {
    const snap = await db.collection('children').doc(uid).get();
    return snap.exists ? { id: uid, ...snap.data() } : null;
  },

  async saveChild(uid, data) {
    const ref = db.collection('children').doc(uid);
    const record = { ...data, updatedAt: new Date().toISOString() };
    await ref.set(record, { merge: true });
    const snap = await ref.get();
    return { id: uid, ...snap.data() };
  },

  async listStories(uid, { bookmarked } = {}) {
    let query = db.collection('stories').where('userId', '==', uid);
    if (bookmarked) query = query.where('bookmarked', '==', true);
    const snap = await query.get();
    return snap.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async getStory(uid, storyId) {
    const snap = await db.collection('stories').doc(storyId).get();
    if (!snap.exists) return null;
    const data = snap.data();
    if (data.userId !== uid) return null;
    return { id: storyId, ...data };
  },

  async createStory(uid, data) {
    const ref = db.collection('stories').doc();
    const record = { userId: uid, bookmarked: false, createdAt: new Date().toISOString(), ...data };
    await ref.set(record);
    return { id: ref.id, ...record };
  },

  async updateStory(uid, storyId, patch) {
    const ref = db.collection('stories').doc(storyId);
    const snap = await ref.get();
    if (!snap.exists || snap.data().userId !== uid) return null;
    await ref.set(patch, { merge: true });
    const updated = await ref.get();
    return { id: storyId, ...updated.data() };
  },

  async incrementFreeStoriesUsed(uid) {
    const ref = db.collection('users').doc(uid);
    await ref.set(
      { freeStoriesUsed: admin.firestore.FieldValue.increment(1) },
      { merge: true },
    );
    const snap = await ref.get();
    return { uid, ...snap.data() };
  },

  async setSubscription(uid, { status, plan }) {
    const ref = db.collection('users').doc(uid);
    await ref.set({ subscriptionStatus: status, subscriptionPlan: plan }, { merge: true });
    const snap = await ref.get();
    return { uid, ...snap.data() };
  },

  async addFeedback(uid, message) {
    await db.collection('feedback').add({ uid, message, createdAt: new Date().toISOString() });
  },
};
