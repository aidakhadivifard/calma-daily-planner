import { features } from '../config/env.js';
import { firestoreStore } from './stores/firestoreStore.js';
import { memoryStore } from './stores/memoryStore.js';

export const db = features.hasFirebase ? firestoreStore : memoryStore;
