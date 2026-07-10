import React, { useState } from 'react';
import Icon from '../../../shared/components/ui/Icon';
import { EGGS_PER_CARTON } from '../../../shared/utils/stockUtils';

export default function SpoilagePanel({ products = [], onLogSpoilage, loading = false }) {
  const [productId, setProductId] = useState('');
  const [cartons, setCartons] = useState('');
  const [eggs, setEggs] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const absoluteQty = (Number(cartons) || 0) * EGGS_PER_CARTON + (Number(eggs) || 0);
    if (!productId || absoluteQty <= 0) return;
    
    setIsSubmitting(true);
    try {
      await onLogSpoilage({
        productId,
        quantity: absoluteQty,
        notes
      });
      setProductId('');
      setCartons('');
      setEggs('');
      setNotes('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateQty = (c, e) => {
    const total = (Number(c) || 0) * EGGS_PER_CARTON + (Number(e) || 0);
    if (total === 0) {
      setCartons('');
      setEggs('');
    } else {
      setCartons(Math.floor(total / EGGS_PER_CARTON).toString());
      setEggs((total % EGGS_PER_CARTON).toString());
    }
  };

  return (
    <div className="xl:col-span-1 glass-panel-danger rounded-xl flex flex-col h-[600px] relative overflow-hidden bg-error-container/5 border border-error/20">
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-error-container/20 to-transparent pointer-events-none" />
      <div className="p-6 relative z-10 flex flex-col h-full px-8">
        <div className="flex items-center gap-3 mb-6">
          <Icon name="delete_sweep" className="text-error text-[28px]" />
          <h3 className="font-headline-md text-headline-md text-error">تسجيل الهالك</h3>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6 flex-1 flex flex-col">
          <div className="space-y-2">
            <label className="block font-label-caps text-label-caps text-on-surface-variant">اختر المنتج</label>
            <div className="relative">
              <select
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                required
                className="w-full bg-surface-container-lowest border border-surface-variant rounded-lg py-3 px-4 text-on-surface appearance-none focus:outline-none focus:border-error focus:ring-1 focus:ring-error/30 transition-all font-body-md"
              >
                <option value="" disabled>اختر منتجاً...</option>
                {(products || []).map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.sku})
                  </option>
                ))}
              </select>
              <Icon name="arrow_drop_down" className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="block font-label-caps text-label-caps text-on-surface-variant">الكمية المهلكة</label>
            <div className="flex gap-4">
              <div className="flex-1 flex flex-col gap-1.5">
                <span className="font-label-caps text-label-caps text-on-surface-variant">الكرتون:</span>
                <input
                  value={cartons}
                  onChange={(e) => handleUpdateQty(e.target.value, eggs)}
                  min="0"
                  type="number"
                  className="w-full bg-surface-container-lowest border border-surface-variant rounded-lg text-on-surface font-data-mono focus:outline-none focus:border-error focus:ring-1 focus:ring-error/30 transition-all text-center"
                  placeholder="0"
                />
              </div>
              <div className="flex-1 flex flex-col gap-1.5">
                <span className="font-label-caps text-label-caps text-on-surface-variant">البيضة:</span>
                <input
                  value={eggs}
                  onChange={(e) => handleUpdateQty(cartons, e.target.value)}
                  min="0"
                  type="number"
                  className="w-full bg-surface-container-lowest border border-surface-variant rounded-lg text-on-surface font-data-mono focus:outline-none focus:border-error focus:ring-1 focus:ring-error/30 transition-all text-center"
                  placeholder="0"
                />
              </div>
            </div>
          </div>
          <div className="space-y-2 flex-1 flex flex-col">
            <label className="block font-label-caps text-label-caps text-on-surface-variant">السبب / ملاحظات</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full flex-1 bg-surface-container-lowest border border-surface-variant rounded-lg py-3 px-4 text-on-surface font-body-md focus:outline-none focus:border-error focus:ring-1 focus:ring-error/30 transition-all resize-none"
              placeholder="أدخل سبب الإهلاك والملاحظات..."
            />
          </div>
          <div className="bg-error-container/20 border border-error/30 rounded-lg p-4 mt-auto">
            <div className="flex items-center gap-2 mb-2 text-error">
              <Icon name="warning" className="text-[20px]" />
              <h4 className="font-label-caps text-label-caps font-bold">تنبيه حرج</h4>
            </div>
            <p className="font-body-md text-sm text-error/90 leading-relaxed">
              هذا الإجراء سيقوم بخصم الكميه وتسجيل خسارة في الحسابات.
            </p>
          </div>
          <button
            type="submit"
            disabled={isSubmitting || loading || !productId || (!cartons && !eggs)}
            className="w-full bg-error text-on-error hover:bg-error/90 py-3 rounded-lg font-body-md font-bold transition-all duration-300 shadow-[0_0_15px_rgba(255,180,171,0.2)] disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            {isSubmitting ? 'جارٍ التسجيل...' : 'تأكيد تسجيل الهالك'}
          </button>
        </form>
      </div>
    </div>
  );
}
