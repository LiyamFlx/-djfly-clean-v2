import React from 'react';
import * as Sentry from '@sentry/react';

interface ErrorFallbackProps {
  error: unknown;
  resetError: () => void;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetError,
}) => (
  <div>
    <h2>Something went wrong</h2>
    <p>{error instanceof Error ? error.message : 'An unknown error occurred'}</p>
    <button onClick={resetError}>Try again</button>
  </div>
);

export const AppErrorBoundary: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <Sentry.ErrorBoundary
    fallback={({ error, resetError }) => (
      <ErrorFallback error={error} resetError={resetError} />
    )}
    onError={(error) => {
      console.error('Error caught by error boundary:', error);
    }}
  >
    {children}
  </Sentry.ErrorBoundary>
);
