// 🔄 retry.js – Exponential Backoff Retry-Logic
// ✅ Wiederholungsversuche mit exponentieller Verzögerung
// ✅ Jitter gegen Thundering Herd
// ✅ Konfigurierbare retryable Status-Codes

/**
 * Führt eine Funktion mit Exponential Backoff Retry aus
 * @param {Function} fn - Async-Funktion die ausgeführt werden soll
 * @param {Object} options - Retry-Konfiguration
 * @param {number} options.maxRetries - Max. Anzahl Wiederholungen (default: 3)
 * @param {number} options.initialDelay - Initiale Verzögerung in ms (default: 1000)
 * @param {number} options.maxDelay - Maximale Verzögerung in ms (default: 10000)
 * @param {number} options.backoffFactor - Multiplikator für Backoff (default: 2)
 * @param {number[]} options.retryableStatuses - HTTP-Status-Codes die retry auslösen
 * @param {Function} options.onRetry - Callback bei Retry (attempt, delay, error)
 * @returns {Promise<any>} Ergebnis der Funktion
 * @throws {Error} Letzter Fehler wenn alle Retries fehlschlagen
 */
export async function retryWithBackoff(fn, options = {}) {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    backoffFactor = 2,
    retryableStatuses = [408, 429, 500, 502, 503, 504],
    onRetry = null,
  } = options;

  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      const status = error.response?.status;
      const isRetryable = !status || retryableStatuses.includes(status);

      // Letzter Versuch oder nicht retryable -> sofort werfen
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
        onRetry(attempt + 1, actualDelay, error);
      }

      if (process.env.NODE_ENV === 'development') {
        console.warn(
          `🔄 Retry ${attempt + 1}/${maxRetries} nach ${Math.round(actualDelay)}ms`,
          error.message
        );
      }

      await new Promise((resolve) => setTimeout(resolve, actualDelay));
    }
  }

  throw lastError;
}

/**
 * Wrapper-Funktion für Retry-Logic
 * @param {Function} fn - Funktion die wrapped werden soll
 * @param {Object} retryOptions - Retry-Optionen
 * @returns {Function} Wrapped function mit Retry-Logic
 */
export function withRetry(fn, retryOptions = {}) {
  return (...args) => retryWithBackoff(() => fn(...args), retryOptions);
}
