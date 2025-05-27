'use client';

import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to monitoring service
    console.error('ErrorBoundary caught:', error, errorInfo);
    
    // In production, send to error tracking service
    if (process.env.NODE_ENV === 'production') {
      // TODO: Integrate with Sentry or similar
      // logErrorToService(error, errorInfo);
    }
    
    this.setState({
      error,
      errorInfo
    });
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return <>{this.props.fallback}</>;
      }

      return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-gray-800 rounded-2xl shadow-2xl p-8 text-center">
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-10 h-10 text-red-500" />
            </div>
            
            <h1 className="text-2xl font-bold text-white mb-2">
              Etwas ist schiefgelaufen
            </h1>
            
            <p className="text-gray-400 mb-6">
              Ein unerwarteter Fehler ist aufgetreten. Wir arbeiten daran, 
              das Problem zu beheben.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-6 text-left">
                <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-300">
                  Technische Details
                </summary>
                <pre className="mt-2 p-4 bg-gray-900 rounded text-xs text-red-400 overflow-auto">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            <div className="flex gap-4 justify-center">
              <button
                onClick={this.resetError}
                className="flex items-center gap-2 px-4 py-2 bg-primary/20 text-primary hover:bg-primary/30 rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Erneut versuchen
              </button>
              
              <Link href="/">
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white hover:bg-gray-600 rounded-lg transition-colors">
                  <Home className="w-4 h-4" />
                  Zur Startseite
                </button>
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook for functional components
export function useErrorHandler() {
  return (error: Error) => {
    throw error; // This will be caught by the nearest error boundary
  };
}