import { useCallback } from 'react';
import { useSupabaseQuery } from '../../../core/hooks/useSupabaseQuery';
import {
  fetchTreasuryBalance,
  fetchActiveSession,
  fetchRecentInvoices,
  fetchRecentTransactions,
  fetchLowStockProducts,
  fetchSessionSalesTotal,
  fetchNetProfitMetrics,
} from '../../../core/supabase/api';

export function useDashboardMetrics() {
  const { data: treasury, loading: treasuryLoading } = useSupabaseQuery(fetchTreasuryBalance);
  const { data: session, loading: sessionLoading } = useSupabaseQuery(fetchActiveSession);
  const { data: profitMetrics, loading: profitLoading } = useSupabaseQuery(fetchNetProfitMetrics);
  
  // Compute real sales from invoices table for the active session
  const fetchSalesCb = useCallback(
    () => fetchSessionSalesTotal(session?.id),
    [session?.id]
  );
  const { data: salesData, loading: salesLoading } = useSupabaseQuery(fetchSalesCb, !!session?.id);

  return {
    treasury,
    session,
    salesData: salesData || { totalSales: 0, totalPurchases: 0, invoiceCount: 0 },
    netProfit: profitMetrics?.netProfit || 0,
    loading: treasuryLoading || sessionLoading || salesLoading || profitLoading,
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
