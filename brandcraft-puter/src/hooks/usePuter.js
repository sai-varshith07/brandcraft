import { useState, useEffect, useCallback } from "react";
import {
  puterSignIn, puterSignOut, puterGetUser, puterIsSignedIn,
  puterKVSet, puterKVGet, isPuterReady,
} from "../utils/puter";

// ─── usePuterAuth ─────────────────────────────────────────────────────────────
export function usePuterAuth() {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      if (!isPuterReady()) { setTimeout(checkAuth, 300); return; }
      if (puterIsSignedIn()) setUser(puterGetUser());
      setLoading(false);
    };
    checkAuth();
  }, []);

  const signIn = useCallback(async () => {
    setLoading(true);
    try {
      const u = await puterSignIn();
      setUser(u);
      return u;
    } finally { setLoading(false); }
  }, []);

  const signOut = useCallback(async () => {
    await puterSignOut();
    setUser(null);
  }, []);

  return { user, loading, signIn, signOut, isSignedIn: !!user };
}

// ─── usePuterStorage ──────────────────────────────────────────────────────────
// Persistent KV store backed by puter.kv, with in-memory fallback.
export function usePuterStorage(key, defaultValue = null) {
  const [value, setValue]   = useState(defaultValue);
  const [synced, setSynced] = useState(false);

  // Load on mount
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!isPuterReady() || !puterIsSignedIn()) {
        // fall back to localStorage
        try {
          const raw = localStorage.getItem(`bc:${key}`);
          if (raw && !cancelled) setValue(JSON.parse(raw));
        } catch {}
        setSynced(true);
        return;
      }
      const stored = await puterKVGet(key);
      if (!cancelled && stored !== null) setValue(stored);
      setSynced(true);
    };
    load();
    return () => { cancelled = true; };
  }, [key]);

  const set = useCallback(async (newValue) => {
    setValue(newValue);
    try {
      if (isPuterReady() && puterIsSignedIn()) {
        await puterKVSet(key, newValue);
      } else {
        localStorage.setItem(`bc:${key}`, JSON.stringify(newValue));
      }
    } catch {}
  }, [key]);

  return [value, set, synced];
}
