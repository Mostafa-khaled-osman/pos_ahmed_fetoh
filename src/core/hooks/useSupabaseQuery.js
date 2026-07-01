import { useState, useEffect, useCallback } from 'react';

/**
 * A custom hook for executing Supabase queries.
 * Manages loading, data, and error states seamlessly, providing a refetch function.
 * 
 * @param {Function} queryFn - An async function that fetches data from Supabase.
 * @param {boolean} [immediate=true] - Whether to execute the query immediately on mount.
 */
export function useSupabaseQuery(queryFn, immediate = true) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await queryFn();
      setData(response);
      return response;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [queryFn]);

  useEffect(() => {
    if (immediate) {
      execute().catch((err) => {
        console.error('Supabase query failed:', err);
      });
    }
  }, [execute, immediate]);

  return { data, loading, error, refetch: execute };
}
