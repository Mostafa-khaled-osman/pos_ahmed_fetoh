import React from 'react';
import Icon from '../../../shared/components/ui/Icon';

export default function TopSellingProducts({ products, loading }) {
  return (
    <div className="glass-panel rounded-2xl p-6 flex flex-col h-[400px]">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-headline-md text-headline-md text-on-surface">المنتجات المباعة</h3>
        <button className="text-on-surface-variant hover:text-on-surface transition-colors">
          <Icon name="more_vert" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : products && products.length > 0 ? (
          <div className="flex flex-col gap-3">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors border border-surface-variant/30"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Icon name="inventory_2" className="text-[20px]" />
                  </div>
                  <div>
                    <h4 className="font-body-md text-body-md text-on-surface font-medium truncate max-w-[150px] sm:max-w-[200px]">
                      {product.name}
                    </h4>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-label-lg text-label-lg text-primary bg-primary/10 px-2 py-1 rounded-lg">
                    {(() => {
                      const cartons = Math.floor(product.total_quantity / 30);
                      const eggs = product.total_quantity % 30;
                      const parts = [];
                      if (cartons > 0) parts.push(`${cartons} كرتونة`);
                      if (eggs > 0) parts.push(`${eggs} بيضة`);
                      return parts.length > 0 ? parts.join(' و ') : '0 بيضة';
                    })()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-on-surface-variant">
            <Icon name="inventory_2" className="text-4xl mb-2 opacity-50" />
            <p className="font-body-md text-body-md">لا توجد منتجات مباعة بعد</p>
          </div>
        )}
      </div>
    </div>
  );
}
