// 🌐 apiClient.js – Zentraler API-Client mit Auth & Error-Handling
// ✅ Axios-basiert mit Request/Response-Interceptors
// ✅ Auto-Auth via Supabase
// ✅ Session-Refresh bei 401
// ✅ Timeout-Configuration

import axios from 'axios';

import { supabase } from '../../lib/supabaseClient';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || '',
  timeout: 30000, // 30s default
  headers: {
    'Content-Type': 'application/json',
  },
});

// 🔑 Request-Interceptor: Auto-Auth
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const { data } = await supabase.auth.getSession();
      const token = data?.session?.access_token;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    } catch (error) {
      console.error('❌ Auth-Interceptor-Fehler:', error);
      return config;
    }
  },
  (error) => Promise.reject(error)
);

// 🔄 Response-Interceptor: Error-Handling & Session-Refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // 401: Session refresh versuchen
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;

      try {
        const { data } = await supabase.auth.refreshSession();

        if (data?.session?.access_token) {
          error.config.headers.Authorization = `Bearer ${data.session.access_token}`;
          return apiClient(error.config);
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
