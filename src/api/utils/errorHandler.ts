/**
 * @fileoverview Error Handler - Zentrales Error-Handling für API-Calls
 *
 * ZWECK:
 * - Custom Error-Klasse mit HTTP-Status-Code
 * - User-freundliche Error-Messages (DE)
 * - Toast-Integration für UI-Feedback
 * - Safe API-Call Wrapper
 *
 * ERROR-TYPES:
 * - ApiError: Custom Error mit statusCode, timestamp, originalError
 * - Axios Response Error: Server-Response mit Error-Status
 * - Axios Request Error: Keine Response (Netzwerk-Fehler)
 * - Setup Error: Andere Fehler (Code-Fehler, Config-Fehler)
 *
 * USE-CASES:
 * - API-Call Error-Handling (401, 404, 500, etc.)
 * - User-Feedback via Toast-Notifications
 * - Entwickler-Logging (console.error in dev)
 *
 * AUTOR: Liberius (MaklerMate MVP)
 * LETZTE ÄNDERUNG: 2025-11-15
 * STATUS: 🟢 Production-Ready (TypeScript Migration)
 */

import toast from 'react-hot-toast';

// ==================== TYPES ====================

/**
 * Axios Error mit Response
 */
interface AxiosError extends Error {
  response?: {
    status: number;
    data?: {
      error?: string;
      message?: string;
      [key: string]: unknown;
    };
  };
  request?: unknown;
  config?: unknown;
}

/**
 * Safe API Call Options
 */
export interface SafeApiCallOptions<T> {
  /** Error-Handler (default: showErrorToast) */
  onError?: (error: ApiError) => void;

  /** Success-Handler */
  onSuccess?: (result: T) => void;

  /** Error werfen statt zu catchen (default: false) */
  throwError?: boolean;
}

/**
 * Safe API Call Result
 */
export interface SafeApiCallResult<T> {
  data: T | null;
  error: ApiError | null;
}

/**
 * API Error JSON-Serialization
 */
export interface ApiErrorJSON {
  name: string;
  message: string;
  statusCode: number;
  timestamp: string;
}

// ==================== API ERROR CLASS ====================

/**
 * Custom API-Error-Klasse
 *
 * FEATURES:
 * - HTTP-Status-Code
 * - Timestamp für Logging
 * - Original-Error für Debugging
 * - JSON-Serialization
 *
 * @example
 * throw new ApiError('Not Found', 404);
 *
 * @example
 * const error = new ApiError('Validation Error', 400, originalError);
 * console.log(error.toJSON());
 */
export class ApiError extends Error {
  public readonly name = 'ApiError';
  public readonly statusCode: number;
  public readonly originalError: Error | null;
  public readonly timestamp: string;

  constructor(message: string, statusCode: number, originalError: Error | null = null) {
    super(message);

    // Maintain proper prototype chain
    Object.setPrototypeOf(this, ApiError.prototype);

    this.statusCode = statusCode;
    this.originalError = originalError;
    this.timestamp = new Date().toISOString();

    // Capture stack trace (V8 only)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }

  /**
   * JSON-Serialization für Logging
   */
  toJSON(): ApiErrorJSON {
    return {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
      timestamp: this.timestamp,
    };
  }
}

// ==================== ERROR HANDLING ====================

/**
 * Konvertiert Axios-Errors in ApiError mit user-friendly Messages
 *
 * ERROR-TYPES:
 * 1. Response Error: Server hat geantwortet, aber mit Error-Status (4xx, 5xx)
 * 2. Request Error: Keine Response erhalten (Netzwerk-Fehler, Timeout)
 * 3. Setup Error: Anderer Fehler (Code-Fehler, Config-Fehler)
 *
 * @param error - Axios Error oder Standard Error
 * @returns ApiError mit user-friendly Message
 *
 * @example
 * try {
 *   await apiClient.post('/api/endpoint', data);
 * } catch (error) {
 *   const apiError = handleApiError(error);
 *   console.error(apiError.toJSON());
 * }
 */
export function handleApiError(error: unknown): ApiError {
  const axiosError = error as AxiosError;

  // Axios Response Error (Server hat geantwortet, aber mit Error-Status)
  if (axiosError.response) {
    const status = axiosError.response.status;
    const data = axiosError.response.data;

    const message =
      data?.error || data?.message || getDefaultErrorMessage(status);

    return new ApiError(message, status, axiosError);
  }

  // Axios Request Error (Keine Response erhalten, z.B. Netzwerk-Fehler)
  if (axiosError.request) {
    return new ApiError(
      'Netzwerkfehler. Bitte Internetverbindung prüfen.',
      0,
      axiosError
    );
  }

  // Anderer Error (z.B. Setup-Fehler)
  const standardError = error as Error;
  return new ApiError(
    standardError.message || 'Unbekannter Fehler',
    500,
    standardError
  );
}

/**
 * Gibt user-friendly Error-Message basierend auf HTTP-Status zurück
 *
 * HTTP-STATUS-MAPPING:
 * - 4xx: Client-Fehler (User kann fixen)
 * - 5xx: Server-Fehler (User kann nichts tun)
 * - 0: Netzwerk-Fehler (keine Response)
 *
 * @param statusCode - HTTP-Status-Code
 * @returns User-friendly Error-Message (DE)
 */
function getDefaultErrorMessage(statusCode: number): string {
  const messages: Record<number, string> = {
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

// ==================== TOAST INTEGRATION ====================

/**
 * Zeigt Error-Toast mit user-friendly Message
 *
 * FEATURES:
 * - Automatische Konvertierung zu ApiError
 * - 5 Sekunden Anzeige-Dauer
 * - Top-Right Position
 * - Developer-Logging in Console (nur dev)
 *
 * @param error - Fehler der angezeigt werden soll
 *
 * @example
 * try {
 *   await apiCall();
 * } catch (error) {
 *   showErrorToast(error);
 * }
 */
export function showErrorToast(error: Error | ApiError): void {
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

// ==================== SAFE API CALL WRAPPER ====================

/**
 * Wrapper für sichere API-Calls mit Error-Handling
 *
 * FEATURES:
 * - Automatisches Error-Handling
 * - Success/Error-Callbacks
 * - Optionales Error-Throwing
 * - Typed Result-Object
 *
 * VERWENDUNG:
 * - Wrap API-Calls um Error-Handling zu zentralisieren
 * - Ergebnis als { data, error } Object
 * - Bei throwError: false wird Error nicht geworfen (default)
 *
 * @param apiFunction - Async API-Funktion
 * @param options - Optionen (onError, onSuccess, throwError)
 * @returns Result-Object { data: T | null, error: ApiError | null }
 *
 * @example
 * // Standard-Verwendung (Error wird getoasted, nicht geworfen)
 * const { data, error } = await safeApiCall(
 *   () => exposeService.generateExpose(formData, style)
 * );
 *
 * if (error) {
 *   console.log('Fehler aufgetreten:', error.message);
 *   return;
 * }
 *
 * console.log('Erfolg:', data);
 *
 * @example
 * // Mit Custom Callbacks
 * const { data } = await safeApiCall(
 *   () => apiClient.post('/api/endpoint', payload),
 *   {
 *     onError: (err) => console.error('Custom Error:', err),
 *     onSuccess: (res) => toast.success('Erfolgreich!'),
 *     throwError: false,
 *   }
 * );
 */
export async function safeApiCall<T>(
  apiFunction: () => Promise<T>,
  options: SafeApiCallOptions<T> = {}
): Promise<SafeApiCallResult<T>> {
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
