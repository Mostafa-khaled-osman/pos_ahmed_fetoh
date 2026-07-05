import React from 'react';
import Icon from '../../../shared/components/ui/Icon';
import { formatStock, EGGS_PER_CARTON } from '../../../shared/utils/stockUtils';

export default function ProductsTable({ products = [], loading = false, onEditProduct }) {
  if (loading) {
    return (
      <div className="xl:col-span-3 glass-panel rounded-xl overflow-hidden flex flex-col h-[600px] ambient-glow">
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-surface-container-low/50">
          <h3 className="font-headline-md text-headline-md text-on-surface">شبكة المنتجات النشطة</h3>
        </div>
        <div className="p-6 space-y-4 animate-pulse flex-1">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-12 bg-surface-variant/30 rounded w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="xl:col-span-3 glass-panel rounded-xl overflow-hidden flex flex-col h-[600px] ambient-glow">
      <div className="p-6 border-b border-white/5 flex justify-between items-center bg-surface-container-low/50">
        <h3 className="font-headline-md text-headline-md text-on-surface">شبكة المنتجات النشطة</h3>
        <button className="text-primary hover:text-primary-fixed-dim transition-colors text-sm flex items-center gap-1">
          <Icon name="filter_list" className="text-[18px]" />
          تصفية
        </button>
      </div>
      <div className="overflow-y-auto overflow-x-auto flex-1 relative custom-scrollbar">
        <table className="w-full text-right border-collapse min-w-[800px]">
          <thead className="sticky top-0 bg-surface-container/90 backdrop-blur-md z-10">
            <tr className="border-b border-white/5">
              <th className="p-4 font-label-caps text-label-caps text-on-surface-variant">المنتج</th>
              <th className="p-4 font-label-caps text-label-caps text-on-surface-variant">SKU</th>
              <th className="p-4 font-label-caps text-label-caps text-on-surface-variant">الفئة</th>
              <th className="p-4 font-label-caps text-label-caps text-on-surface-variant">سعر القطاعي</th>
              <th className="p-4 font-label-caps text-label-caps text-on-surface-variant">سعر الجملة</th>
              <th className="p-4 font-label-caps text-label-caps text-on-surface-variant">المخزون الحالي</th>
              <th className="p-4 font-label-caps text-label-caps text-on-surface-variant text-center">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="font-body-md text-body-md">
            {!products || products.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-8 text-center text-on-surface-variant">لا توجد منتجات مسجلة</td>
              </tr>
            ) : (
              products.map((product) => {
                const isLowStock = product.stock_quantity <= (20 * EGGS_PER_CARTON); // 20 Cartons threshold
                return (
                  <tr key={product.id} className={`border-b border-white/5 hover:bg-white/5 transition-colors ${isLowStock ? 'bg-error-container/10' : ''}`}>
                    <td className="p-4 font-medium text-on-surface">{product.name}</td>
                    <td className="p-4 font-data-mono text-data-mono text-on-surface-variant">{product.sku}</td>
                    <td className="p-4 text-on-surface-variant">{product.category}</td>
                    <td className="p-4 font-data-mono text-data-mono text-primary">{Number(product.sale_price).toFixed(2)} ج.م</td>
                    <td className="p-4 font-data-mono text-data-mono text-on-surface-variant">{Number(product.cost_price).toFixed(2)} ج.م</td>
                    <td className="p-4">
                      {isLowStock ? (
                        <div className="flex flex-col gap-1 items-start">
                          <span className="inline-flex items-center px-2 py-1 rounded-full bg-error-container/40 text-error border border-error/20 text-xs font-medium">
                            {formatStock(product.stock_quantity)}
                          </span>
                          <span className="text-[10px] text-error font-bold flex items-center gap-1">
                            <Icon name="warning" className="text-[12px]" />
                            رصيد منخفض
                          </span>
                        </div>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full bg-secondary-container/20 text-secondary border border-secondary/20 text-xs font-medium">
                          {formatStock(product.stock_quantity)}
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => onEditProduct(product)}
                        className="px-3 py-1.5 border border-primary/30 text-primary rounded hover:bg-primary/10 transition-colors text-sm"
                      >
                        تعديل
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
