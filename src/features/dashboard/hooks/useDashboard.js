import { useCallback } from 'react';
import { useSupabaseQuery } from '../../../core/hooks/useSupabaseQuery';
import {
  fetchTreasuryBalance,
  fetchActiveSession,
  fetchRecentInvoices,
  fetchRecentTransactions,
  fetchLowStockProducts,
} from '../../../core/supabase/api';

export function useDashboardMetrics() {
  const { data: treasury, loading: treasuryLoading } = useSupabaseQuery(fetchTreasuryBalance);
  const { data: session, loading: sessionLoading } = useSupabaseQuery(fetchActiveSession);
  
  return {
    treasury,
    session,
    loading: treasuryLoading || sessionLoading,
  };
}

export function useRecentActivity(limit = 5) {
  const fetchInvoicesCb = useCallback(() => fetchRecentInvoices(limit), [limit]);
  const fetchTransactionsCb = useCallback(() => fetchRecentTransactions(limit), [limit]);

  const { data: invoices, loading: invoicesLoading } = useSupabaseQuery(fetchInvoicesCb);
  const { data: transactions, loading: transactionsLoading } = useSupabaseQuery(fetchTransactionsCb);
  
  return {
    invoices: invoices || [],
    transactions: transactions || [],
    loading: invoicesLoading || transactionsLoading,
  };
}

export function useLowStockProducts(threshold = 10, limit = 5) {
  const fetchLowStockCb = useCallback(() => fetchLowStockProducts(threshold, limit), [threshold, limit]);
  const { data: products, loading } = useSupabaseQuery(fetchLowStockCb);
  
  return {
    products: products || [],
    loading,
  };
}
