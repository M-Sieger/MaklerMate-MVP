/**
 * @fileoverview Retry Utils - Exponential Backoff Retry-Logic
 *
 * ZWECK:
 * - Wiederholungsversuche mit exponentieller Verzögerung
 * - Jitter gegen Thundering Herd Problem
 * - Konfigurierbare retryable HTTP-Status-Codes
 * - Callback-Support für Retry-Events
 *
 * ALGORITHMUS:
 * - Exponential Backoff: delay = initialDelay * (backoffFactor ^ attempt)
 * - Jitter: delay += random(0, 0.3 * delay)
 * - Max-Delay-Cap: min(calculatedDelay, maxDelay)
 *
 * USE-CASES:
 * - Netzwerk-Fehler (429, 500, 502, 503, 504)
 * - Timeout-Fehler (408)
 * - API-Rate-Limiting
 *
 * AUTOR: Liberius (MaklerMate MVP)
 * LETZTE ÄNDERUNG: 2025-11-15
 * STATUS: 🟢 Production-Ready (TypeScript Migration)
 */

// ==================== TYPES ====================

/**
 * Retry-Konfiguration
 */
export interface RetryOptions {
  /** Maximale Anzahl Wiederholungen (default: 3) */
  maxRetries?: number;

  /** Initiale Verzögerung in ms (default: 1000) */
  initialDelay?: number;

  /** Maximale Verzögerung in ms (default: 10000) */
  maxDelay?: number;

  /** Multiplikator für Backoff (default: 2) */
  backoffFactor?: number;

  /** HTTP-Status-Codes die retry auslösen (default: [408, 429, 500, 502, 503, 504]) */
  retryableStatuses?: number[];

  /** Callback bei Retry (attempt, delay, error) */
  onRetry?: (attempt: number, delay: number, error: Error) => void;
}

/**
 * Error mit HTTP-Response (z.B. Axios Error)
 */
interface ErrorWithResponse extends Error {
  response?: {
    status?: number;
    data?: unknown;
  };
}

// ==================== RETRY LOGIC ====================

/**
 * Führt eine Funktion mit Exponential Backoff Retry aus
 *
 * ALGORITHMUS:
 * 1. Versuche Funktion auszuführen
 * 2. Bei Fehler: Prüfe ob retryable (Status-Code)
 * 3. Wenn nicht retryable oder maxRetries erreicht → throw
 * 4. Berechne Delay: initialDelay * (backoffFactor ^ attempt)
 * 5. Füge Jitter hinzu: ±30% Variation
 * 6. Warte actualDelay ms
 * 7. Wiederhole ab Schritt 1
 *
 * JITTER:
 * - Verhindert Thundering Herd (alle Clients retrien gleichzeitig)
 * - ±30% Variation des Delays
 * - Beispiel: 1000ms → 700ms - 1300ms
 *
 * @param fn - Async-Funktion die ausgeführt werden soll
 * @param options - Retry-Konfiguration
 * @returns Ergebnis der Funktion
 * @throws Letzter Fehler wenn alle Retries fehlschlagen
 *
 * @example
 * const result = await retryWithBackoff(
 *   () => apiClient.post('/api/generate-expose', data),
 *   { maxRetries: 3, initialDelay: 2000 }
 * );
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    backoffFactor = 2,
    retryableStatuses = [408, 429, 500, 502, 503, 504],
    onRetry = null,
  } = options;

  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      const errorWithResponse = error as ErrorWithResponse;
      const status = errorWithResponse.response?.status;
      const isRetryable = !status || retryableStatuses.includes(status);

      // Letzter Versuch oder nicht retryable → sofort werfen
      if (!isRetryable || attempt === maxRetries) {
        throw error;
      }

      // Exponential Backoff berechnen
      const delay = Math.min(
        initialDelay * Math.pow(backoffFactor, attempt),
        maxDelay
      );

      // Jitter hinzufügen (±30% Variation)
      const jitter = Math.random() * 0.3 * delay;
      const actualDelay = delay + jitter;

      if (onRetry) {
        onRetry(attempt + 1, actualDelay, lastError);
      }

      if (process.env.NODE_ENV === 'development') {
        console.warn(
          `🔄 Retry ${attempt + 1}/${maxRetries} nach ${Math.round(actualDelay)}ms`,
          lastError.message
        );
      }

      await new Promise((resolve) => setTimeout(resolve, actualDelay));
    }
  }

  // TypeScript-Guard: lastError ist immer definiert hier
  throw lastError!;
}

/**
 * Wrapper-Funktion für Retry-Logic
 *
 * VERWENDUNG:
 * - Erstellt eine neue Funktion mit Retry-Logic
 * - Original-Funktion bleibt unverändert
 * - Argumente werden durchgereicht
 *
 * @param fn - Funktion die wrapped werden soll
 * @param retryOptions - Retry-Optionen
 * @returns Wrapped function mit Retry-Logic
 *
 * @example
 * const apiCallWithRetry = withRetry(
 *   (url, data) => apiClient.post(url, data),
 *   { maxRetries: 3 }
 * );
 *
 * // Verwendung
 * const result = await apiCallWithRetry('/api/endpoint', { foo: 'bar' });
 */
export function withRetry<TArgs extends unknown[], TReturn>(
  fn: (...args: TArgs) => Promise<TReturn>,
  retryOptions: RetryOptions = {}
): (...args: TArgs) => Promise<TReturn> {
  return (...args: TArgs) => retryWithBackoff(() => fn(...args), retryOptions);
}
