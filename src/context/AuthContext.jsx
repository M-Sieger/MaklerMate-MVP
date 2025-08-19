// 📄 src/context/AuthContext.jsx
// Zweck: Globaler Auth-Context mit Session-State, Login/Signup/Logout-Methoden.
// Wird in main.jsx als Provider um die App gelegt.

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);        // 👤 Aktueller User (oder null)
  const [loading, setLoading] = useState(true);  // ⏳ Bootstrapping-Status (Session check)
  const [error, setError] = useState(null);      // ❗ Letzter Auth-Fehler (optional für UI)

  // 🔁 Beim Laden der App aktuelle Session laden + auf Änderungen hören
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (mounted) setUser(data?.session?.user ?? null);
      } catch (e) {
        if (mounted) setError(e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  // 🔐 Email/Passwort Login
  async function signInWithPassword({ email, password }) {
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error);
    return error;
  }

  // ✉️ Magic Link (optional)
  async function signInWithMagicLink({ email }) {
    setError(null);
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) setError(error);
    return error;
  }

  // ➕ Registrierung
  async function signUp({ email, password }) {
    setError(null);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setError(error);
    return error;
  }

  // 🚪 Logout
  async function signOut() {
    setError(null);
    const { error } = await supabase.auth.signOut();
    if (error) setError(error);
    return error;
  }

  // 🎫 Zugriffstoken (z. B. für Serverless-Calls)
  async function getAccessToken() {
    const { data } = await supabase.auth.getSession();
    return data?.session?.access_token ?? null;
  }

  const value = useMemo(
    () => ({ user, loading, error, signInWithPassword, signInWithMagicLink, signUp, signOut, getAccessToken }),
    [user, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}
