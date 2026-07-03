import React from 'react';

export default function LowStockAlerts({ products, loading }) {
  return (
    <div className="glass-panel rounded-2xl flex flex-col overflow-hidden h-[400px]">
      <div className="p-6 border-b border-surface-variant/20 flex justify-between items-center bg-surface-container-low/30">
        <h2 className="font-headline-md text-headline-md text-on-surface">تنبيهات نقص المخزون</h2>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-primary animate-pulse" />
          <span className="font-label-caps text-label-caps text-primary">يحتاج إعادة طلب</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto no-scrollbar p-6">
        {loading ? (
          <div className="flex flex-col gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse flex justify-between items-center p-4 rounded-xl border border-surface-variant/20 bg-surface-container-low">
                <div className="flex flex-col gap-2">
                  <div className="h-4 w-32 bg-surface-variant/30 rounded" />
                  <div className="h-3 w-20 bg-surface-variant/20 rounded" />
                </div>
                <div className="h-6 w-12 bg-primary/20 rounded-md" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="h-full flex items-center justify-center text-on-surface-variant text-center flex-col gap-4">
            <span className="material-symbols-outlined text-4xl opacity-50">inventory</span>
            <p>جميع المنتجات متوفرة بكميات كافية.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {products.map(product => (
              <div key={product.id} className="flex justify-between items-center p-4 rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors group">
                <div className="flex flex-col gap-1">
                  <h3 className="font-body-md text-body-md font-medium text-on-surface group-hover:text-primary transition-colors">{product.name}</h3>
                  <span className="font-data-mono text-[11px] text-on-surface-variant opacity-70">SKU: {product.sku}</span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="font-data-mono text-lg font-bold text-primary">{product.stock_quantity}</div>
                  <span className="font-label-caps text-[10px] text-on-surface-variant">متبقي</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
