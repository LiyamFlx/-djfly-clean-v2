import React, { Component, ErrorInfo } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Home, AlertTriangle, Bug } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorId: string | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorId: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    const errorId = `err_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    return {
      hasError: true,
      error,
      errorId,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('🚨 ErrorBoundary caught an error:', error, errorInfo);

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorId: null,
    });
  };

  render() {
    if (this.state.hasError) {
      const { error, errorId } = this.state;

      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={error!} retry={this.handleRetry} />;
      }

      return (
        <div className="min-h-screen bg-pure-black text-pure-white flex items-center justify-center p-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="mb-8">
              <AlertTriangle className="w-24 h-24 text-neon-purple mx-auto mb-4" />
            </div>

            <h1 className="heading-primary text-pure-white mb-6">
              Something Went Wrong
            </h1>

            <div className="mb-8">
              <p className="body-large text-gray-300 mb-4">
                We encountered an unexpected error. Don't worry, we're on it!
              </p>

              {process.env.NODE_ENV === 'development' && error && (
                <details className="mt-6 p-4 bg-red-900/20 border border-red-500/30 rounded-xl text-left">
                  <summary className="cursor-pointer text-red-400 font-semibold mb-2">
                    <Bug className="inline w-4 h-4 mr-2" />
                    Error Details
                  </summary>
                  <div className="mt-4 space-y-2">
                    <p className="text-sm text-red-300">
                      <strong>Error:</strong> {error.message}
                    </p>
                    <p className="text-sm text-red-300">
                      <strong>ID:</strong> {errorId}
                    </p>
                  </div>
                </details>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={this.handleRetry}
                className="btn-primary px-8 py-4 text-lg font-semibold hover-lift"
              >
                <RefreshCw className="inline w-5 h-5 mr-2" />
                Try Again
              </button>

              <button
                onClick={() => (window.location.href = '/')}
                className="btn-secondary px-8 py-4 text-lg font-semibold hover-lift"
              >
                <Home className="inline w-5 h-5 mr-2" />
                Go Home
              </button>
            </div>

            <p className="text-sm text-gray-400 mt-8">Error ID: {errorId}</p>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error: unknown;
  resetError: () => void;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetError,
}) => (
  <ErrorBoundary
    fallback={({ error, retry }) => (
      <div className="min-h-64 bg-rich-black rounded-xl flex items-center justify-center p-8">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-neon-purple mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-pure-white mb-2">
            Error Occurred
          </h3>
          <p className="text-gray-400 mb-4">
            {error instanceof Error
              ? error.message
              : 'An unknown error occurred'}
          </p>
          <button onClick={retry} className="btn-primary px-4 py-2">
            <RefreshCw className="inline w-4 h-4 mr-2" />
            Try Again
          </button>
        </div>
      </div>
    )}
  >
    <></>
  </ErrorBoundary>
);

export const AppErrorBoundary: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <ErrorBoundary>{children}</ErrorBoundary>;

export default ErrorBoundary;
