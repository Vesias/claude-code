'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Dashboard error:', error);
  }, [error]);

  return (
    <div className="flex min-h-[400px] items-center justify-center p-8">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
          <AlertTriangle className="h-8 w-8 text-red-500" />
        </div>
        <h2 className="mb-2 text-2xl font-semibold text-white">
          Dashboard-Fehler
        </h2>
        <p className="mb-6 text-gray-400">
          Ein Fehler ist beim Laden des Dashboards aufgetreten.
        </p>
        <button
          onClick={reset}
          className="flex items-center gap-2 mx-auto px-4 py-2 bg-primary/20 text-primary hover:bg-primary/30 rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Erneut versuchen
        </button>
      </div>
    </div>
  );
}