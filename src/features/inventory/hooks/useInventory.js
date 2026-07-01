import { useCallback } from 'react';
import { useSupabaseQuery } from '../../../core/hooks/useSupabaseQuery';
import { fetchProducts, insertProduct, updateProduct, deleteProduct } from '../../../core/supabase/api';

export function useInventory() {
  const { data: products, loading, error, refetch } = useSupabaseQuery(fetchProducts);

  const addProduct = useCallback(async (productData) => {
    try {
      await insertProduct(productData);
      await refetch();
    } catch (err) {
      console.error('Failed to add product:', err);
      throw err;
    }
  }, [refetch]);

  const editProduct = useCallback(async (id, updates) => {
    try {
      await updateProduct(id, updates);
      await refetch();
    } catch (err) {
      console.error('Failed to update product:', err);
      throw err;
    }
  }, [refetch]);

  const removeProduct = useCallback(async (id) => {
    try {
      await deleteProduct(id);
      await refetch();
    } catch (err) {
      console.error('Failed to delete product:', err);
      throw err;
    }
  }, [refetch]);

  return {
    products,
    loading,
    error,
    refetch,
    addProduct,
    editProduct,
    removeProduct,
  };
}
