/**
 * @fileoverview Globaler Auth-Context
 *
 * ZWECK:
 * - Session-State Management
 * - Login/Signup/Logout-Methoden
 * - Auth-State für gesamte App
 *
 * VERWENDUNG:
 * - In index.tsx als Provider um App gelegt
 * - Via useAuth() Hook in Components verwenden
 *
 * AUTOR: Liberius (MaklerMate MVP)
 * STATUS: 🟢 Production-Ready (TypeScript Migration)
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from 'react';

import type { User, AuthError } from '@supabase/supabase-js';

import { supabase } from '../lib/supabaseClient';

/**
 * Auth Credentials für Login/Signup
 */
interface AuthCredentials {
  email: string;
  password?: string;
}

/**
 * Auth Context Value Type
 */
interface AuthContextValue {
  user: User | null;
  loading: boolean;
  error: AuthError | null;
  signInWithPassword: (credentials: AuthCredentials) => Promise<AuthError | null>;
  signInWithMagicLink: (credentials: { email: string }) => Promise<AuthError | null>;
  signUp: (credentials: AuthCredentials) => Promise<AuthError | null>;
  signOut: () => Promise<AuthError | null>;
  getAccessToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Auth Provider Props
 */
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Auth Provider Component
 *
 * FEATURES:
 * - Session Management
 * - Auth State Change Listener
 * - Error Handling
 */
export function AuthProvider({ children }: AuthProviderProps): React.ReactElement {
  const [user, setUser] = useState<User | null>(null);        // 👤 Aktueller User (oder null)
  const [loading, setLoading] = useState<boolean>(true);     // ⏳ Bootstrapping-Status (Session check)
  const [error, setError] = useState<AuthError | null>(null); // ❗ Letzter Auth-Fehler (optional für UI)

  // 🔁 Beim Laden der App aktuelle Session laden + auf Änderungen hören
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (mounted) setUser(data?.session?.user ?? null);
      } catch (e) {
        if (mounted) setError(e as AuthError);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    const { data: sub } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  // 🔐 Email/Passwort Login
  async function signInWithPassword({
    email,
    password,
  }: AuthCredentials): Promise<AuthError | null> {
    if (!password) {
      const err = new Error('Password required') as AuthError;
      setError(err);
      return err;
    }

    setError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) setError(error);
    return error;
  }

  // ✉️ Magic Link (optional)
  async function signInWithMagicLink({
    email,
  }: {
    email: string;
  }): Promise<AuthError | null> {
    setError(null);
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) setError(error);
    return error;
  }

  // ➕ Registrierung
  async function signUp({
    email,
    password,
  }: AuthCredentials): Promise<AuthError | null> {
    if (!password) {
      const err = new Error('Password required') as AuthError;
      setError(err);
      return err;
    }

    setError(null);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setError(error);
    return error;
  }

  // 🚪 Logout
  async function signOut(): Promise<AuthError | null> {
    setError(null);
    const { error } = await supabase.auth.signOut();
    if (error) setError(error);
    return error;
  }

  // 🎫 Zugriffstoken (z. B. für Serverless-Calls)
  async function getAccessToken(): Promise<string | null> {
    const { data } = await supabase.auth.getSession();
    return data?.session?.access_token ?? null;
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      error,
      signInWithPassword,
      signInWithMagicLink,
      signUp,
      signOut,
      getAccessToken,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * useAuth Hook
 *
 * VERWENDUNG:
 * ```typescript
 * const { user, loading, signInWithPassword } = useAuth();
 * ```
 *
 * @returns Auth Context Value
 * @throws Error wenn außerhalb von AuthProvider verwendet
 */
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}
