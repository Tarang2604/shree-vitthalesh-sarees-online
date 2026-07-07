/**
 * Centralized error handling helper.
 *
 * Backend/database errors can contain sensitive implementation details
 * (table names, RLS policy names, constraint names). We must never surface
 * those to end users or leak them through the browser console in production.
 *
 * - In development, full errors are logged to aid debugging.
 * - In production, nothing is logged to the console, and callers should only
 *   ever show the returned generic, user-friendly message.
 */
export const logError = (context: string, error: unknown): void => {
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.error(`[${context}]`, error);
  }
  // Intentionally silent in production to avoid leaking internal details.
};

export const getSafeErrorMessage = (
  fallback = "Something went wrong. Please try again."
): string => fallback;
