/**
 * @fileoverview Authentication Service
 *
 * ZWECK:
 * - Wraps Supabase Auth-Methods
 * - Einheitliches Error-Handling
 * - Type-Safe Return-Values
 *
 * AUTOR: Liberius (MaklerMate MVP)
 * STATUS: 🟢 Production-Ready (TypeScript Migration)
 */

import type { User, Session } from '@supabase/supabase-js';

import { handleApiError } from '../utils/errorHandler';
import { supabase } from '../../lib/supabaseClient';

/**
 * Auth Response Type
 */
interface AuthResponse {
  user: User | null;
  session: Session | null;
}

/**
 * User Metadata Type
 */
interface UserMetadata {
  [key: string]: unknown;
}

/**
 * Authentication Service
 *
 * SINGLETON:
 * - Eine Instance für gesamte App
 * - Export als `export default new AuthService()`
 */
class AuthService {
  /**
   * Meldet User mit Email/Password an
   *
   * @param email - Email-Adresse
   * @param password - Passwort
   * @returns User & Session
   * @throws ApiError bei Authentifizierungsfehlern
   */
  async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      return { user: data.user, session: data.session };
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Registriert neuen User
   *
   * @param email - Email-Adresse
   * @param password - Passwort
   * @returns User & Session
   * @throws ApiError bei Registrierungsfehlern
   */
  async signUp(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      return { user: data.user, session: data.session };
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Meldet User ab
   *
   * @throws ApiError bei Logout-Fehlern
   */
  async signOut(): Promise<void> {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) throw error;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Gibt aktuelle Session zurück
   *
   * @returns Session oder null
   * @throws ApiError bei Session-Fehlern
   */
  async getSession(): Promise<Session | null> {
    try {
      const { data, error } = await supabase.auth.getSession();

      if (error) throw error;

      return data.session;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Aktualisiert User-Metadata
   *
   * @param metadata - Metadata-Object
   * @returns Updated User
   * @throws ApiError bei Update-Fehlern
   */
  async updateUserMetadata(metadata: UserMetadata): Promise<User | null> {
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: metadata,
      });

      if (error) throw error;

      return data.user;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Sendet Password-Reset-Email
   *
   * @param email - Email-Adresse
   * @throws ApiError bei Reset-Fehlern
   */
  async resetPassword(email: string): Promise<void> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);

      if (error) throw error;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Prüft ob User eingeloggt ist
   *
   * @returns True wenn eingeloggt
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      const session = await this.getSession();
      return !!session;
    } catch {
      return false;
    }
  }
}

export default new AuthService();
