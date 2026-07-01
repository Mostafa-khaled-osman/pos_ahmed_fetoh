import { useCallback } from 'react';
import { useSupabaseQuery } from '../../../core/hooks/useSupabaseQuery';
import { fetchProducts, updateProduct } from '../../../core/supabase/api';

// Fallback Mock Data for UI building if DB is empty or fails
const MOCK_PRODUCTS = [
  {
    id: '1',
    sku: 'EW-01',
    name: 'بيض أبيض - درجة أولى',
    subtitle: 'كرتونة 30 بيضة',
    price: 145,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCXJIzD-0SH_Dmx4Wd7SGmoX7dSsRibikFyj7MRsKDp5a72j8sQyS-Ik_TguYKHub9kLnbavhZW9AL2DZXv06QUNTXY11uq1S1OTgmrg0XexzhwNztlb-KkkrP4GmSB7ph3iAGgXiL08OAFwECQQA5xZ-n_g15ZDxIxAlZECeTPzHH5H9o1TgqmLjpb3BAV3vZ0FV-uDCknVnwLdnlzNoHIaSZ6wfWBD4Eg7Qz8wpZZDe00IG60u_D3',
    badge: null,
  },
  {
    id: '2',
    sku: 'EB-02',
    name: 'بيض بني عضوي',
    subtitle: 'كرتونة 30 بيضة',
    price: 160,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA67E_OxF-7XgHikPgvw42rEGuM52k9dzHL8wNHePyq-DNLWxQ0cgQ-ocHPfexZTBCSScvQRFVmNB4hqziK_7TbkbpFjfOFvXXQNPpMoH8_-d1yBxYiIyTt53bNwTVP1QeycEnRgZHIfHMdhAjAGEdyx5T4VSXmJdnJbgDqjEkDLYdV6VEzKUE_l2-rz1ei0NXHjDCQAqj6_rKeC-oz5kxE3LxYjJh8_HsxrQojajRxj_758cZcLrov',
    badge: null,
  }
];

export function useGetProducts() {
  const { data, loading, error, refetch } = useSupabaseQuery(fetchProducts);

  // Expose an update function that automatically refetches the data after success
  const updateProductData = useCallback(async (id, updates) => {
    try {
      await updateProduct(id, updates);
      await refetch(); // <--- UI Synchronization: strict refetching after DB mutation
    } catch (err) {
      console.error("Failed to update product:", err);
      throw err;
    }
  }, [refetch]);

  // Normalize data (Supabase NUMERIC columns are sometimes returned as strings)
  const rawProducts = data || (error ? MOCK_PRODUCTS : []);
  const products = rawProducts.map(p => ({
    ...p,
    price: Number(p.price || 0)
  }));

  return { products, loading, error, updateProductData, refetch };
}
