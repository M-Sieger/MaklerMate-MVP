/**
 * @fileoverview Fetch with Authentication
 *
 * ZWECK:
 * - Serverless-Endpoints mit Supabase Access-Token aufrufen
 * - Auto-Authentication
 * - Timeout-Handling
 *
 * AUTOR: Liberius (MaklerMate MVP)
 * STATUS: 🟢 Production-Ready (TypeScript Migration)
 */

import { supabase } from '../lib/supabaseClient';

/**
 * Fetch Options with Timeout
 */
interface FetchWithAuthOptions extends RequestInit {
  timeout?: number;
}

/**
 * Fetch mit Auto-Authentication und Timeout
 *
 * FEATURES:
 * - Auto-inject Supabase Access Token
 * - Timeout-Support
 * - Type-safe Headers
 *
 * @param url - API-Endpoint
 * @param options - Fetch-Options mit optionalem Timeout
 * @returns Response Promise
 * @throws Error bei Timeout oder Netzwerkfehlern
 *
 * @example
 * const response = await fetchWithAuth('/api/endpoint', {
 *   method: 'POST',
 *   body: JSON.stringify(data),
 *   timeout: 10000,
 * });
 */
export async function fetchWithAuth(
  url: string,
  options: FetchWithAuthOptions = {}
): Promise<Response> {
  const { data } = await supabase.auth.getSession();
  const token = data?.session?.access_token;

  const headers = new Headers(options.headers || {});
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const timeout = options.timeout || 30000; // 30s default
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Request timeout after ${timeout}ms`);
    }

    throw error;
  }
}
