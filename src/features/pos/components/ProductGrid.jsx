import React from 'react';
import ProductCard from './ProductCard';

export default function ProductGrid({ products, loading, onAddToCart, onEditProduct }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-on-surface-variant">
        جاري تحميل الكتالوج...
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-on-surface-variant">
        لا توجد منتجات.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-gutter pb-32">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
          onEditProduct={onEditProduct}
        />
      ))}
    </div>
  );
}
