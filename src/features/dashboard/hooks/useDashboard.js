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
  fetchProductsSoldQuantity,
  fetchTodayGrossProfit,
} from '../../../core/supabase/api';

export function useDashboardMetrics() {
  const { data: treasury, loading: treasuryLoading } = useSupabaseQuery(fetchTreasuryBalance);
  const { data: session, loading: sessionLoading } = useSupabaseQuery(fetchActiveSession);
  const { data: profitMetrics, loading: profitLoading } = useSupabaseQuery(fetchNetProfitMetrics);

  // Compute gross profit for today (00:00 to 23:59)
  const fetchGrossProfitCb = useCallback(
    () => fetchTodayGrossProfit(),
    []
  );
  const { data: grossProfit, loading: grossProfitLoading } = useSupabaseQuery(fetchGrossProfitCb);

  return {
    treasury,
    session,
    salesData: {
      totalSales: profitMetrics?.totalSales || 0,
      totalPurchases: profitMetrics?.totalPurchases || 0,
    },
    netProfit: profitMetrics?.netProfit || 0,
    grossProfit: grossProfit || 0,
    grossProfitLoading,
    loading: treasuryLoading || sessionLoading || profitLoading || grossProfitLoading,
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

export function useTopSellingProducts() {
  const fetchTopCb = useCallback(() => fetchProductsSoldQuantity(), []);
  const { data: products, loading } = useSupabaseQuery(fetchTopCb);

  return {
    products: products || [],
    loading,
  };
}

export function useGrossProfit() {
  const fetchGrossProfitCb = useCallback(() => fetchTodayGrossProfit(), []);
  const { data: grossProfit, loading } = useSupabaseQuery(fetchGrossProfitCb);

  return {
    grossProfit: grossProfit || 0,
    loading,
  };
}

