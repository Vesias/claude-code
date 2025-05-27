import { useState, useEffect, useCallback, useRef } from 'react';

interface UseAsyncState<T> {
  data: T | null;
  error: Error | null;
  loading: boolean;
}

interface UseAsyncOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

export function useAsync<T = any>(
  asyncFunction: () => Promise<T>,
  options: UseAsyncOptions = {}
) {
  const { immediate = true, onSuccess, onError } = options;
  const [state, setState] = useState<UseAsyncState<T>>({
    data: null,
    error: null,
    loading: immediate,
  });

  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const execute = useCallback(async () => {
    setState({ data: null, error: null, loading: true });

    try {
      const data = await asyncFunction();
      
      if (isMountedRef.current) {
        setState({ data, error: null, loading: false });
        onSuccess?.(data);
      }
      
      return data;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      
      if (isMountedRef.current) {
        setState({ data: null, error: err, loading: false });
        onError?.(err);
      }
      
      throw err;
    }
  }, [asyncFunction, onSuccess, onError]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return {
    ...state,
    execute,
    refetch: execute,
  };
}

// Hook for handling form submissions with loading state
export function useAsyncForm<T = any>(
  submitHandler: (data: T) => Promise<any>
) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleSubmit = useCallback(async (data: T) => {
    setSubmitting(true);
    setError(null);

    try {
      const result = await submitHandler(data);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setSubmitting(false);
    }
  }, [submitHandler]);

  return {
    handleSubmit,
    submitting,
    error,
    reset: () => setError(null),
  };
}