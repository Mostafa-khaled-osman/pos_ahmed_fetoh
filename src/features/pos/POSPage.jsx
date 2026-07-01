import React, { useState, useMemo } from 'react';
import POSLayout from './components/POSLayout';
import ProductGrid from './components/ProductGrid';
import TopBar from './components/TopBar';
import { usePOSCart } from './hooks/usePOSCart';
import { useGetProducts } from './hooks/useGetProducts';

export default function POSPage() {
  const { products, loading, error } = useGetProducts();
  const cart = usePOSCart();
  
  // Search State
  const [searchQuery, setSearchQuery] = useState('');

  // Filter products based on search query
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    
    const lowerQuery = searchQuery.toLowerCase();
    return products.filter((product) => 
      product.name.toLowerCase().includes(lowerQuery) ||
      product.sku.toLowerCase().includes(lowerQuery)
    );
  }, [products, searchQuery]);

  return (
    <POSLayout cart={cart}>
      <TopBar 
        searchQuery={searchQuery} 
        onSearchChange={setSearchQuery} 
      />
      
      {error ? (
        <div className="flex-1 flex flex-col items-center justify-center text-error bg-error-container/10 border border-error/20 rounded-xl p-6 mb-32">
          <span className="material-symbols-outlined text-4xl mb-2">error</span>
          <p className="font-headline-md">حدث خطأ أثناء تحميل الكتالوج</p>
          <p className="text-sm opacity-80 mt-1">{error.message || 'يرجى المحاولة مرة أخرى لاحقاً'}</p>
        </div>
      ) : (
        <ProductGrid 
          products={filteredProducts} 
          loading={loading} 
          onAddToCart={cart.addToCart} 
        />
      )}
    </POSLayout>
  );
}
