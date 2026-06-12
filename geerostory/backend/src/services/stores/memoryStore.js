import { randomUUID } from 'crypto';
import { readFile, writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, '../../../data/db.json');

const EMPTY_STATE = { users: {}, children: {}, stories: {}, feedback: [] };

let state = null;
let saveTimer = null;

async function load() {
  if (state) return state;
  try {
    const raw = await readFile(DATA_FILE, 'utf-8');
    state = { ...EMPTY_STATE, ...JSON.parse(raw) };
  } catch {
    state = structuredClone(EMPTY_STATE);
  }
  return state;
}

function scheduleSave() {
  if (saveTimer) return;
  saveTimer = setTimeout(async () => {
    saveTimer = null;
    await mkdir(path.dirname(DATA_FILE), { recursive: true });
    await writeFile(DATA_FILE, JSON.stringify(state, null, 2));
  }, 200);
}

function newUserRecord() {
  return {
    freeStoriesUsed: 0,
    subscriptionStatus: 'free',
    subscriptionPlan: null,
    createdAt: new Date().toISOString(),
  };
}

export const memoryStore = {
  async getOrCreateUser(uid, profile = {}) {
    await load();
    if (!state.users[uid]) {
      state.users[uid] = { uid, ...newUserRecord(), ...profile };
      scheduleSave();
    }
    return { ...state.users[uid] };
  },

  async getChild(uid) {
    await load();
    return state.children[uid] ? { ...state.children[uid] } : null;
  },

  async saveChild(uid, data) {
    await load();
    const existing = state.children[uid] || { id: uid, createdAt: new Date().toISOString() };
    state.children[uid] = { ...existing, ...data, id: uid, updatedAt: new Date().toISOString() };
    scheduleSave();
    return { ...state.children[uid] };
  },

  async listStories(uid, { bookmarked } = {}) {
    await load();
    let stories = Object.values(state.stories).filter((s) => s.userId === uid);
    if (bookmarked) stories = stories.filter((s) => s.bookmarked);
    return stories
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map((s) => ({ ...s }));
  },

  async getStory(uid, storyId) {
    await load();
    const story = state.stories[storyId];
    if (!story || story.userId !== uid) return null;
    return { ...story };
  },

  async createStory(uid, data) {
    await load();
    const id = randomUUID();
    const story = { id, userId: uid, bookmarked: false, createdAt: new Date().toISOString(), ...data, id };
    state.stories[id] = story;
    scheduleSave();
    return { ...story };
  },

  async updateStory(uid, storyId, patch) {
    await load();
    const story = state.stories[storyId];
    if (!story || story.userId !== uid) return null;
    state.stories[storyId] = { ...story, ...patch, id: storyId, userId: uid };
    scheduleSave();
    return { ...state.stories[storyId] };
  },

  async incrementFreeStoriesUsed(uid) {
    await load();
    const user = state.users[uid] || { uid, ...newUserRecord() };
    user.freeStoriesUsed = (user.freeStoriesUsed || 0) + 1;
    state.users[uid] = user;
    scheduleSave();
    return { ...user };
  },

  async setSubscription(uid, { status, plan }) {
    await load();
    const user = state.users[uid] || { uid, ...newUserRecord() };
    user.subscriptionStatus = status;
    user.subscriptionPlan = plan;
    state.users[uid] = user;
    scheduleSave();
    return { ...user };
  },

  async addFeedback(uid, message) {
    await load();
    state.feedback.push({ uid, message, createdAt: new Date().toISOString() });
    scheduleSave();
  },
};
