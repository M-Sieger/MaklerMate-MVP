// ❌ errorHandler.js – Zentrales Error-Handling für API-Calls
// ✅ Custom Error-Klasse mit Status-Code
// ✅ User-freundliche Error-Messages
// ✅ Toast-Integration
// ✅ safeApiCall-Wrapper

import toast from 'react-hot-toast';

/**
 * Custom API-Error-Klasse
 */
export class ApiError extends Error {
  constructor(message, statusCode, originalError = null) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.originalError = originalError;
    this.timestamp = new Date().toISOString();
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
      timestamp: this.timestamp,
    };
  }
}

/**
 * Konvertiert Axios-Errors in ApiError mit user-friendly Messages
 * @param {Error} error - Axios Error
 * @returns {ApiError} Konvertierter Error
 */
export function handleApiError(error) {
  // Axios Response Error (Server hat geantwortet, aber mit Error-Status)
  if (error.response) {
    const status = error.response.status;
    const data = error.response.data;

    const message =
      data?.error || data?.message || getDefaultErrorMessage(status);

    return new ApiError(message, status, error);
  }

  // Axios Request Error (Keine Response erhalten, z.B. Netzwerk-Fehler)
  if (error.request) {
    return new ApiError(
      'Netzwerkfehler. Bitte Internetverbindung prüfen.',
      0,
      error
    );
  }

  // Anderer Error (z.B. Setup-Fehler)
  return new ApiError(error.message || 'Unbekannter Fehler', 500, error);
}

/**
 * Gibt user-friendly Error-Message basierend auf HTTP-Status zurück
 * @param {number} statusCode - HTTP-Status-Code
 * @returns {string} User-friendly Error-Message
 */
function getDefaultErrorMessage(statusCode) {
  const messages = {
    400: 'Ungültige Anfrage. Bitte Eingaben prüfen.',
    401: 'Nicht angemeldet. Bitte einloggen.',
    403: 'Zugriff verweigert.',
    404: 'Ressource nicht gefunden.',
    408: 'Anfrage hat zu lange gedauert.',
    429: 'Zu viele Anfragen. Bitte kurz warten.',
    500: 'Serverfehler. Bitte später erneut versuchen.',
    502: 'Server nicht erreichbar.',
    503: 'Service vorübergehend nicht verfügbar.',
  };

  return messages[statusCode] || `Fehler ${statusCode}`;
}

/**
 * Zeigt Error-Toast mit user-friendly Message
 * @param {Error|ApiError} error - Fehler der angezeigt werden soll
 */
export function showErrorToast(error) {
  const apiError =
    error instanceof ApiError ? error : handleApiError(error);

  toast.error(apiError.message, {
    duration: 5000,
    position: 'top-right',
  });

  if (process.env.NODE_ENV === 'development') {
    console.error('[API Error]', apiError.toJSON(), apiError.originalError);
  }
}

/**
 * Wrapper für sichere API-Calls mit Error-Handling
 * @param {Function} apiFunction - Async API-Funktion
 * @param {Object} options - Optionen
 * @param {Function} options.onError - Error-Handler (default: showErrorToast)
 * @param {Function} options.onSuccess - Success-Handler
 * @param {boolean} options.throwError - Error werfen statt zu catchen (default: false)
 * @returns {Promise<{data: any, error: ApiError|null}>} Result-Object
 */
export async function safeApiCall(apiFunction, options = {}) {
  const {
    onError = showErrorToast,
    onSuccess = null,
    throwError = false,
  } = options;

  try {
    const result = await apiFunction();

    if (onSuccess) onSuccess(result);

    return { data: result, error: null };
  } catch (error) {
    const apiError = handleApiError(error);

    if (onError) onError(apiError);

    if (throwError) throw apiError;

    return { data: null, error: apiError };
  }
}
