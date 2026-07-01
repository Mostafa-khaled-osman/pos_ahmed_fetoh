import { useCallback } from 'react';
import { useSupabaseQuery } from '../../../core/hooks/useSupabaseQuery';
import {
  fetchTreasuryBalance,
  fetchActiveSession,
  fetchTodayExpenses,
  insertExpense,
  closeSession,
  openSession,
} from '../../../core/supabase/api';

/**
 * Hook: Treasury Balance
 * Fetches the total treasury balance from Supabase.
 */
export function useTreasuryBalance() {
  const { data, loading, error, refetch } = useSupabaseQuery(fetchTreasuryBalance);
  return { treasury: data, loading, error, refetch };
}

/**
 * Hook: Active Daily Session
 * Fetches the currently open session + exposes endSession mutation.
 */
export function useActiveSession() {
  const { data, loading, error, refetch } = useSupabaseQuery(fetchActiveSession);

  const endSession = useCallback(async () => {
    if (!data?.id) return;
    try {
      await closeSession(data.id);
      await refetch();
    } catch (err) {
      console.error('Failed to close session:', err);
      throw err;
    }
  }, [data, refetch]);

  const startSession = useCallback(async () => {
    if (data?.id) return; // Already open
    try {
      await openSession();
      await refetch();
    } catch (err) {
      console.error('Failed to open session:', err);
      throw err;
    }
  }, [data, refetch]);

  return { session: data, loading, error, refetch, endSession, startSession };
}

/**
 * Hook: Today's Expenses
 * Fetches expense records for today + exposes addExpense mutation.
 */
export function useTodayExpenses(sessionId) {
  const queryFn = useCallback(() => fetchTodayExpenses(sessionId), [sessionId]);
  const { data, loading, error, refetch } = useSupabaseQuery(queryFn, !!sessionId);

  const expenses = data || [];
  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);

  const addExpense = useCallback(async (expenseData) => {
    if (!sessionId) throw new Error("No active session");
    try {
      await insertExpense({ ...expenseData, session_id: sessionId });
      await refetch();
    } catch (err) {
      console.error('Failed to add expense:', err);
      throw err;
    }
  }, [sessionId, refetch]);

  return { expenses, totalExpenses, loading, error, refetch, addExpense };
}
