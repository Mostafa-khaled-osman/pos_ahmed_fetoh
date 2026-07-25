import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../shared/components/ui/Icon';

const PERIOD_OPTIONS = [
  { key: 'day', label: 'اليوم' },
  { key: 'month', label: 'الشهر' },
  { key: 'year', label: 'السنة' },
];

export default function TopSellingProducts({ products, loading, period = 'day', onPeriodChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [internalPeriod, setInternalPeriod] = useState(period);
  const menuRef = useRef(null);

  const activePeriod = onPeriodChange ? period : internalPeriod;

  const handleSelect = (selectedKey) => {
    if (onPeriodChange) {
      onPeriodChange(selectedKey);
    } else {
      setInternalPeriod(selectedKey);
    }
    setIsOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const activeOptionLabel = PERIOD_OPTIONS.find((opt) => opt.key === activePeriod)?.label || 'اليوم';

  return (
    <div className="glass-panel rounded-2xl p-6 flex flex-col h-[400px]">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <h3 className="font-headline-md text-headline-md text-on-surface">المنتجات المباعة</h3>
          <span className="text-xs bg-primary/10 text-primary px-2.5 py-0.5 rounded-full font-medium border border-primary/20">
            {activeOptionLabel}
          </span>
        </div>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className="text-on-surface-variant hover:text-on-surface p-1.5 rounded-lg hover:bg-surface-variant/20 transition-colors flex items-center justify-center"
            title="تصفية حسب الفترة"
            type="button"
          >
            <Icon name="more_vert" />
          </button>

          {isOpen && (
            <div className="absolute left-0 top-full mt-2 w-36 bg-surface-container-high/95 backdrop-blur-xl border border-surface-variant/40 rounded-xl shadow-2xl z-50 py-1.5 overflow-hidden animate-in fade-in duration-150">
              <div className="px-3 py-1 text-[11px] font-semibold text-on-surface-variant/70 border-b border-surface-variant/20 mb-1">
                عرض حسب
              </div>
              {PERIOD_OPTIONS.map((opt) => {
                const isSelected = activePeriod === opt.key;
                return (
                  <button
                    key={opt.key}
                    onClick={() => handleSelect(opt.key)}
                    className={`w-full text-right px-3 py-2 text-sm flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'text-primary font-bold bg-primary/10'
                        : 'text-on-surface hover:bg-surface-variant/30'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {isSelected && <Icon name="check" className="text-base text-primary" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
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
