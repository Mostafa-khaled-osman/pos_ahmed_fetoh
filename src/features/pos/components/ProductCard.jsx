import React, { memo } from 'react';
import Icon from '../../../shared/components/ui/Icon';

const ProductCard = memo(({ product, onAddToCart, onEditProduct, onDeleteProduct }) => {
  return (
    <div className="glass-panel rounded-xl overflow-hidden flex flex-col ambient-glow group hover:-translate-y-1 transition-transform duration-300">
      <div className="h-48 relative overflow-hidden bg-surface-container-lowest flex items-center justify-center">
        {/* Glow effect for premium items */}
        {product.badge && (
          <div className="absolute inset-0 bg-gradient-to-tr from-surface to-surface-container-high opacity-50 z-0"></div>
        )}
        
        <img
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500 z-10 relative"
          src={product.src}
          alt={product.name}
          loading="lazy"
        />

        {/* SKU Badge (or Premium Badge if it exists) */}
        <div className={`absolute top-3 right-3 bg-surface-container-high/80 backdrop-blur-md px-3 py-1 rounded-full border font-data-mono text-xs z-20 ${
          product.badge ? 'border-[#d4af37]/50 text-primary-container' : 'border-white/10'
        }`}>
          {product.badge || `SKU: ${product.sku}`}
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-headline-md text-headline-md mb-1">{product.name}</h3>
        <p className="text-on-surface-variant font-body-sm mb-4">{product.subtitle}</p>
        
        <div className="mt-auto flex justify-between items-end">
          <div className="font-data-mono text-xl text-primary-container">
            {Number(product.sale_price || 0).toFixed(2)} <span className="text-sm text-on-surface-variant">ج.م</span>
          </div>
          <div className="flex gap-2">
            {onEditProduct && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEditProduct(product);
                }}
                className="w-12 h-12 bg-surface-container border border-white/10 rounded-lg flex items-center justify-center hover:bg-white/5 transition-colors text-on-surface-variant group/edit"
                aria-label={`Edit ${product.name}`}
              >
                <Icon name="edit" className="group-hover/edit:scale-110 transition-transform" />
              </button>
            )}
            {onDeleteProduct && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteProduct(product);
                }}
                className="w-12 h-12 bg-surface-container border border-white/10 rounded-lg flex items-center justify-center hover:bg-error-container/20 hover:border-error/30 transition-colors text-error group/delete"
                aria-label={`Delete ${product.name}`}
              >
                <Icon name="delete" className="group-hover/delete:scale-110 transition-transform" />
              </button>
            )}
            <a href={"/add-invoice"} onClick={() => onAddToCart(product)}
              className="w-12 h-12 bg-[#1A1D23] border border-[#d4af37]/30 rounded-lg flex items-center justify-center hover:bg-[#d4af37]/10 transition-colors text-primary-container group/btn"
              aria-label={`Add ${product.name} to cart`}>
              <Icon name="add_shopping_cart" className="group-hover/btn:scale-110 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';
export default ProductCard;
