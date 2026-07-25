import { useState, useCallback } from 'react';
import { useSupabaseQuery } from '../../../core/hooks/useSupabaseQuery';
import { fetchAllInvoices, fetchInvoiceDetails, fetchInvoiceItems, deleteInvoice, updateProduct } from '../../../core/supabase/api';

export function useGetInvoices() {
  const fetchInvoicesCb = useCallback(() => fetchAllInvoices(), []);
  const { data: invoices, loading, error, refetch } = useSupabaseQuery(fetchInvoicesCb);
  
  return {
    invoices: invoices || [],
    loading,
    error,
    refetch
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

/**
 * useDeleteInvoice — Handles full invoice deletion.
 * Stock reversal is handled automatically by the database trigger (sync_inventory_on_invoice_edit).
 */
export function useDeleteInvoice() {
  const [isDeleting, setIsDeleting] = useState(false);

  const executeDelete = useCallback(async (invoice) => {
    setIsDeleting(true);
    try {
      // Delete invoice (and its items). The database trigger handles stock reversal automatically.
      await deleteInvoice(invoice.id);
      return true;
    } catch (err) {
      console.error('Failed to delete invoice:', err);
      throw err;
    } finally {
      setIsDeleting(false);
    }
  }, []);

  return { executeDelete, isDeleting };
}
