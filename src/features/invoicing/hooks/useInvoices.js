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
 * useDeleteInvoice — Handles full invoice deletion with frontend stock reversal.
 * 
 * Steps:
 * 1. Fetch the invoice's items from DB
 * 2. Reverse stock for each item (add back for sales, deduct for purchases)
 * 3. Delete invoice_items then the invoice itself
 */
export function useDeleteInvoice() {
  const [isDeleting, setIsDeleting] = useState(false);

  const executeDelete = useCallback(async (invoice) => {
    setIsDeleting(true);
    try {
      // 1. Fetch the invoice items to know what stock to reverse
      const items = await fetchInvoiceItems(invoice.id);
      const invoiceType = (invoice.invoice_type || 'sale').trim().toLowerCase();

      // 2. Reverse stock for each item
      if (items && items.length > 0) {
        const stockReversals = items.map(async (item) => {
          // We need the current stock from the product — but since we don't have it here,
          // we use a relative approach: fetch the product, calculate, then update.
          // However, the updateProduct API sets the absolute value, so we must
          // read current stock first. We'll use a direct supabase call through updateProduct.
          // Instead, we use the Supabase increment pattern via the API.
          
          // For safety, we'll fetch the current product stock inline
          const { supabase } = await import('../../../core/supabase/client');
          const { data: product, error: prodError } = await supabase
            .from('products')
            .select('stock_quantity')
            .eq('id', item.product_id)
            .single();

          if (prodError || !product) return null;

          const currentStock = Number(product.stock_quantity || 0);
          const itemQty = Number(item.quantity || 0);

          let newStock;
          if (invoiceType === 'sale') {
            // Was a sale → items were deducted → ADD them back
            newStock = currentStock + itemQty;
          } else {
            // Was a purchase → items were added → DEDUCT them
            newStock = Math.max(0, currentStock - itemQty);
          }

          return updateProduct(item.product_id, { stock_quantity: newStock });
        });

        await Promise.all(stockReversals.filter(Boolean));
      }

      // 3. Delete the invoice (and its items)
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
