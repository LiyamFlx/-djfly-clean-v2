import * as Sentry from '@sentry/react';

export function initSentry() {
  if (import.meta.env.PROD) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      // Basic error tracking
      environment: import.meta.env.MODE,
      release: `djfly@${import.meta.env.VITE_APP_VERSION || '0.0.0'}`,
      // Configure what user data is sent with events (if any)
      sendDefaultPii: false,
      // Ignore specific errors if needed
      ignoreErrors: [
        // Add any error messages or patterns to ignore
      ],
      // Performance monitoring (simplified)
      integrations: [],
      tracesSampleRate: 0.2, // Adjust as needed
    });
  }
}

export { Sentry };
