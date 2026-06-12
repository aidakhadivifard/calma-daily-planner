import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(null);
const STORAGE_KEY = 'geero_night_mode';

export function ThemeProvider({ children }) {
  const [nightMode, setNightMode] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    document.documentElement.classList.toggle('night-mode', nightMode);
    try {
      localStorage.setItem(STORAGE_KEY, String(nightMode));
    } catch {
      // ignore storage errors (e.g. private browsing)
    }
  }, [nightMode]);

  return (
    <ThemeContext.Provider value={{ nightMode, setNightMode }}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
