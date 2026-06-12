import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  GoogleAuthProvider,
  RecaptchaVerifier,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPhoneNumber,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../firebase/config';

const AuthContext = createContext(null);

const MOCK_STORAGE_KEY = 'geero_mock_user';

function readMockUser() {
  try {
    const raw = localStorage.getItem(MOCK_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeMockUser(user) {
  if (user) {
    localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(MOCK_STORAGE_KEY);
  }
}

function randomMockUid() {
  return `mock-${Math.random().toString(36).slice(2, 10)}`;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    if (isFirebaseConfigured) {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          setUser({
            uid: firebaseUser.uid,
            name:
              firebaseUser.displayName ||
              firebaseUser.email ||
              firebaseUser.phoneNumber ||
              'Parent',
            email: firebaseUser.email,
            phoneNumber: firebaseUser.phoneNumber,
            photoURL: firebaseUser.photoURL,
          });
        } else {
          setUser(null);
        }
        setInitializing(false);
      });
      return unsubscribe;
    }

    setUser(readMockUser());
    setInitializing(false);
    return undefined;
  }, []);

  const signInWithGoogle = useCallback(async () => {
    if (isFirebaseConfigured) {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      return result.user;
    }
    const mockUser = {
      uid: 'mock-google-user',
      name: 'Alex Parent',
      email: 'alex.parent@example.com',
      photoURL: null,
      phoneNumber: null,
      provider: 'google',
    };
    writeMockUser(mockUser);
    setUser(mockUser);
    return mockUser;
  }, []);

  const signUpWithEmail = useCallback(async (email, password, name) => {
    if (isFirebaseConfigured) {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      if (name) {
        await updateProfile(credential.user, { displayName: name });
      }
      return credential.user;
    }
    const mockUser = {
      uid: randomMockUid(),
      name: name || email.split('@')[0],
      email,
      photoURL: null,
      phoneNumber: null,
      provider: 'email',
    };
    writeMockUser(mockUser);
    setUser(mockUser);
    return mockUser;
  }, []);

  const signInWithEmail = useCallback(async (email, password) => {
    if (isFirebaseConfigured) {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      return credential.user;
    }
    const mockUser = {
      uid: randomMockUid(),
      name: email.split('@')[0],
      email,
      photoURL: null,
      phoneNumber: null,
      provider: 'email',
    };
    writeMockUser(mockUser);
    setUser(mockUser);
    return mockUser;
  }, []);

  const setupRecaptcha = useCallback((containerId) => {
    if (!isFirebaseConfigured) return null;
    return new RecaptchaVerifier(auth, containerId, { size: 'invisible' });
  }, []);

  const sendPhoneVerification = useCallback(
    async (phoneNumber, containerId) => {
      if (isFirebaseConfigured) {
        const verifier = setupRecaptcha(containerId);
        return signInWithPhoneNumber(auth, phoneNumber, verifier);
      }
      return {
        mock: true,
        phoneNumber,
        confirm: async (code) => {
          if (!/^\d{6}$/.test(code)) {
            throw new Error('Enter the 6-digit code we sent you.');
          }
          const mockUser = {
            uid: randomMockUid(),
            name: 'New Parent',
            email: null,
            photoURL: null,
            phoneNumber,
            provider: 'phone',
          };
          writeMockUser(mockUser);
          setUser(mockUser);
          return mockUser;
        },
      };
    },
    [setupRecaptcha],
  );

  const signOutUser = useCallback(async () => {
    if (isFirebaseConfigured) {
      await signOut(auth);
    } else {
      writeMockUser(null);
      setUser(null);
    }
  }, []);

  const getIdToken = useCallback(async () => {
    if (isFirebaseConfigured && auth.currentUser) {
      return auth.currentUser.getIdToken();
    }
    if (user) {
      return `mock.${user.uid}.${encodeURIComponent(user.name || '')}`;
    }
    return null;
  }, [user]);

  const value = {
    user,
    initializing,
    isMock: !isFirebaseConfigured,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    sendPhoneVerification,
    signOutUser,
    getIdToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
