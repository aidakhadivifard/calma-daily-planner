import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { api } from '../services/api';

const AppDataContext = createContext(null);

export function AppDataProvider({ children }) {
  const { user, initializing, getIdToken } = useAuth();
  const [child, setChild] = useState(null);
  const [stories, setStories] = useState([]);
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    if (!user) {
      setChild(null);
      setStories([]);
      setAccount(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const token = await getIdToken();
      const [me, childData, storiesData] = await Promise.all([
        api.getMe(token),
        api.getChild(token),
        api.listStories(token),
      ]);
      setAccount(me);
      setChild(childData);
      setStories(storiesData.stories || []);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [user, getIdToken]);

  useEffect(() => {
    // Wait for AuthContext to resolve the current user before deciding
    // whether a child profile exists — otherwise a hard reload can briefly
    // see `user === null` and bounce a signed-in user to /onboarding.
    if (initializing) return;
    refresh();
  }, [refresh, initializing]);

  const saveChild = useCallback(
    async (data) => {
      const token = await getIdToken();
      const updated = await api.saveChild(token, data);
      setChild(updated);
      return updated;
    },
    [getIdToken],
  );

  const toggleBookmark = useCallback(
    async (storyId, bookmarked) => {
      const token = await getIdToken();
      const updated = await api.toggleBookmark(token, storyId, bookmarked);
      setStories((prev) => prev.map((s) => (s.id === storyId ? updated : s)));
      return updated;
    },
    [getIdToken],
  );

  const upsertStory = useCallback((story) => {
    setStories((prev) => {
      const exists = prev.some((s) => s.id === story.id);
      if (exists) return prev.map((s) => (s.id === story.id ? story : s));
      return [story, ...prev];
    });
  }, []);

  const refreshAccount = useCallback(async () => {
    const token = await getIdToken();
    const me = await api.getMe(token);
    setAccount(me);
    return me;
  }, [getIdToken]);

  const value = {
    child,
    stories,
    account,
    loading,
    error,
    hasChild: Boolean(child),
    refresh,
    refreshAccount,
    saveChild,
    toggleBookmark,
    upsertStory,
  };

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider');
  return ctx;
}
