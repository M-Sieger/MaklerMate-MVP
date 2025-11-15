/**
 * @fileoverview Zentraler API-Client mit Auth & Error-Handling
 *
 * FEATURES:
 * - Axios-basiert mit Interceptors
 * - Auto-Auth via Supabase
 * - Session-Refresh bei 401
 * - Timeout-Configuration
 *
 * AUTOR: Liberius (MaklerMate MVP)
 * STATUS: 🟢 Production-Ready (TypeScript Migration)
 */

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

import { supabase } from '../../lib/supabaseClient';

/**
 * Axios Config mit Retry-Flag
 */
interface RetryAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

/**
 * Zentraler API-Client
 */
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || '',
  timeout: 30000, // 30s default
  headers: {
    'Content-Type': 'application/json',
  },
});

// 🔑 Request-Interceptor: Auto-Auth
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const { data } = await supabase.auth.getSession();
      const token = data?.session?.access_token;

      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    } catch (error) {
      console.error('❌ Auth-Interceptor-Fehler:', error);
      return config;
    }
  },
  (error: AxiosError) => Promise.reject(error)
);

// 🔄 Response-Interceptor: Error-Handling & Session-Refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as RetryAxiosRequestConfig;

    // 401: Session refresh versuchen
    if (error.response?.status === 401 && config && !config._retry) {
      config._retry = true;

      try {
        const { data } = await supabase.auth.refreshSession();

        if (data?.session?.access_token && config.headers) {
          config.headers.Authorization = `Bearer ${data.session.access_token}`;
          return apiClient(config);
        }
      } catch (refreshError) {
        console.error('❌ Session-Refresh fehlgeschlagen:', refreshError);
        // Optional: Redirect to login
        // window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
