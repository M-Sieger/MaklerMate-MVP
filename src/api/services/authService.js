// 🔐 authService.js – Service-Layer für Authentication
// ✅ Wraps Supabase Auth-Methods
// ✅ Einheitliches Error-Handling
// ✅ Type-Safe Return-Values

import { handleApiError } from '../utils/errorHandler';
import { supabase } from '../../lib/supabaseClient';

class AuthService {
  /**
   * Meldet User mit Email/Password an
   * @param {string} email - Email-Adresse
   * @param {string} password - Passwort
   * @returns {Promise<{user: Object, session: Object}>} User & Session
   * @throws {ApiError} Bei Authentifizierungsfehlern
   */
  async signIn(email, password) {
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
   * @param {string} email - Email-Adresse
   * @param {string} password - Passwort
   * @returns {Promise<{user: Object, session: Object}>} User & Session
   * @throws {ApiError} Bei Registrierungsfehlern
   */
  async signUp(email, password) {
    try {
      const { data, error} = await supabase.auth.signUp({
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
   * @throws {ApiError} Bei Logout-Fehlern
   */
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) throw error;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Gibt aktuelle Session zurück
   * @returns {Promise<Object|null>} Session oder null
   * @throws {ApiError} Bei Session-Fehlern
   */
  async getSession() {
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
   * @param {Object} metadata - Metadata-Object
   * @returns {Promise<Object>} Updated User
   * @throws {ApiError} Bei Update-Fehlern
   */
  async updateUserMetadata(metadata) {
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
   * @param {string} email - Email-Adresse
   * @throws {ApiError} Bei Reset-Fehlern
   */
  async resetPassword(email) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);

      if (error) throw error;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Prüft ob User eingeloggt ist
   * @returns {Promise<boolean>} True wenn eingeloggt
   */
  async isAuthenticated() {
    try {
      const session = await this.getSession();
      return !!session;
    } catch {
      return false;
    }
  }
}

export default new AuthService();
