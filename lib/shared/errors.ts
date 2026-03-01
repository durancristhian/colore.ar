// errors.ts
//
// Centralized error codes and Spanish translations. Server code throws ErrorCode
// values; the UI uses translateError() with ERROR_TRANSLATIONS to show
// user-friendly messages. Keeps i18n in one place and avoids leaking internal messages.
//

export const ErrorCode = {
  UNAUTHORIZED: "ERR_UNAUTHORIZED",
  FORBIDDEN: "ERR_FORBIDDEN",
  INVALID_INPUT: "ERR_INVALID_INPUT",
  NOT_FOUND: "ERR_NOT_FOUND",
  IMAGE_TOO_LARGE: "ERR_IMAGE_TOO_LARGE",
  INVALID_IMAGE_TYPE: "ERR_INVALID_IMAGE_TYPE",
  DESCRIPTION_TOO_LONG: "ERR_DESCRIPTION_TOO_LONG",
  GENERATION_FAILED: "ERR_GENERATION_FAILED",
  SERVICE_UNAVAILABLE: "ERR_SERVICE_UNAVAILABLE",
  GENERIC_ERROR: "ERR_GENERIC_ERROR",
  TELEGRAM_NOT_CONFIGURED: "ERR_TELEGRAM_NOT_CONFIGURED",
  FEEDBACK_UNAVAILABLE: "ERR_FEEDBACK_UNAVAILABLE",
  UMAMI_PROXY_ERROR: "ERR_UMAMI_PROXY_ERROR",
} as const;

export type ErrorCodeType = (typeof ErrorCode)[keyof typeof ErrorCode];

export const ERROR_TRANSLATIONS: Record<string, string> = {
  [ErrorCode.UNAUTHORIZED]: "No autorizado",
  [ErrorCode.FORBIDDEN]: "No tenés permisos para realizar esta acción.",
  [ErrorCode.INVALID_INPUT]: "Los datos enviados no son válidos.",
  [ErrorCode.NOT_FOUND]: "Recurso no encontrado.",
  [ErrorCode.IMAGE_TOO_LARGE]: "La imagen debe pesar como máximo 10MB.",
  [ErrorCode.INVALID_IMAGE_TYPE]: "El tipo de imagen no está permitido.",
  [ErrorCode.DESCRIPTION_TOO_LONG]:
    "La descripción es demasiado larga. Acortála un poco.",
  [ErrorCode.GENERATION_FAILED]:
    "No se pudo generar la imagen. Intentá de nuevo.",
  [ErrorCode.SERVICE_UNAVAILABLE]:
    "El servicio no está disponible en este momento.",
  [ErrorCode.GENERIC_ERROR]: "Algo salió mal. Por favor, intentá de nuevo.",
  [ErrorCode.TELEGRAM_NOT_CONFIGURED]:
    "La configuración de notificaciones está incompleta.",
  [ErrorCode.FEEDBACK_UNAVAILABLE]:
    "El feedback no está disponible temporalmente.",
  [ErrorCode.UMAMI_PROXY_ERROR]: "Servicio de analytics no disponible.",
};

/**
 * Returns a Spanish translation for a given error code or message.
 * If no translation is found, it returns a generic error message.
 */
export function translateError(error: unknown): string {
  const code = error instanceof Error ? error.message : String(error);

  const translated = ERROR_TRANSLATIONS[code];
  if (translated) {
    return translated;
  }

  // Fallback for common patterns if needed, otherwise generic
  return ERROR_TRANSLATIONS[ErrorCode.GENERIC_ERROR] || "Algo salió mal.";
}
