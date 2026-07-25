import { create } from 'zustand';
import { supabase } from '../supabase/client';

/**
 * Zustand Store for Invoice management with atomic inventory synchronization.
 * Aligned with Feature-Sliced Design (FSD) architecture in core layer.
 */
export const useInvoiceStore = create((set) => ({
  isLoading: false,
  error: null,

  /**
   * Updates invoice items via Supabase RPC.
   * Trigger on PostgreSQL automatically reconciles product stock levels.
   * 
   * @param {string} invoiceId - UUID of the invoice being edited
   * @param {Array<{id?: string, product_id: string, quantity: number, unit_price: number, total_price: number, cost_price?: number}>} updatedItems
   */
  editInvoice: async (invoiceId, updatedItems) => {
    set({ isLoading: true, error: null });

    try {
      const { data, error } = await supabase.rpc('update_invoice_items', {
        p_invoice_id: invoiceId,
        p_items: updatedItems,
      });

      if (error) {
        throw new Error(error.message || 'Failed to update invoice items');
      }

      set({ isLoading: false, error: null });
      return data;
    } catch (err) {
      const errorMessage = err?.message || 'An error occurred while syncing inventory.';
      set({ isLoading: false, error: errorMessage });
      throw err;
    }
  },

  clearError: () => set({ error: null }),
}));
