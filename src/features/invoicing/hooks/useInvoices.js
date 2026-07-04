import { useCallback } from 'react';
import { useSupabaseQuery } from '../../../core/hooks/useSupabaseQuery';
import { fetchAllInvoices, fetchInvoiceDetails } from '../../../core/supabase/api';

export function useGetInvoices() {
  const fetchInvoicesCb = useCallback(() => fetchAllInvoices(), []);
  const { data: invoices, loading, error } = useSupabaseQuery(fetchInvoicesCb);
  
  return {
    invoices: invoices || [],
    loading,
    error
  };
}

export function useInvoiceDetails(id) {
  const fetchDetailsCb = useCallback(() => fetchInvoiceDetails(id), [id]);
  // Only execute if id exists
  const { data: invoiceData, loading, error } = useSupabaseQuery(fetchDetailsCb, !!id);
  
  return {
    invoiceData,
    loading,
    error
  };
}
