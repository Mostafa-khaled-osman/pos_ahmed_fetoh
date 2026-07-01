import React, { useState, useEffect } from 'react';
import Icon from '../../../shared/components/ui/Icon';

export default function FinancialTransactionModal({ isOpen, onClose, onSubmit, entity, initialType = 'receipt' }) {
  const [formData, setFormData] = useState({
    type: initialType,
    amount: '',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({ type: initialType, amount: '', notes: '' });
    }
  }, [isOpen, initialType]);

  if (!isOpen || !entity) return null;

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit({
        entityId: entity.id,
        type: formData.type,
        amount: Number(formData.amount),
        notes: formData.notes
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isReceipt = formData.type === 'receipt';
  const headerColor = isReceipt ? 'text-secondary' : 'text-error';
  const buttonColor = isReceipt ? 'bg-secondary text-on-secondary hover:bg-secondary/90' : 'bg-error text-on-error hover:bg-error/90';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md glass-panel rounded-xl shadow-2xl border border-white/10 flex flex-col overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-surface-container-low/50">
          <h2 className={`font-headline-md text-headline-md flex items-center gap-2 ${headerColor}`}>
            <Icon name={isReceipt ? "payments" : "account_balance_wallet"} />
            {isReceipt ? 'سند قبض (استلام نقدية)' : 'سند صرف (دفع نقدية)'}
          </h2>
          <button onClick={onClose} className="text-on-surface-variant hover:text-error transition-colors p-1">
            <Icon name="close" />
          </button>
        </div>
        
        <div className="bg-surface-container-low p-4 mx-6 mt-6 rounded-lg border border-white/5 flex flex-col items-center justify-center">
          <span className="text-on-surface-variant text-sm mb-1">الطرف المستهدف</span>
          <span className="font-headline-md text-on-surface">{entity.name}</span>
          <span className="font-data-mono text-primary mt-1">الرصيد: {Math.abs(Number(entity.current_balance || 0)).toFixed(2)} ج.م</span>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 rtl">
          <div className="space-y-2">
            <label className="block font-label-caps text-label-caps text-on-surface-variant">نوع المعاملة</label>
            <div className="relative">
              <select 
                name="type" 
                value={formData.type} 
                onChange={handleChange} 
                required 
                className="w-full bg-surface-container-lowest border border-surface-variant rounded-md px-3 py-2 text-on-surface font-body-md focus:border-primary focus:ring-1 focus:ring-primary transition-all appearance-none"
              >
                <option value="receipt">قبض (استلام نقدية من العميل/المورد)</option>
                <option value="payment">دفع (سداد نقدية للعميل/المورد)</option>
              </select>
              <Icon name="arrow_drop_down" className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block font-label-caps text-label-caps text-on-surface-variant">المبلغ (ج.م)</label>
            <input 
              name="amount" 
              value={formData.amount} 
              onChange={handleChange} 
              required 
              min="0.01"
              step="0.01"
              type="number" 
              className="w-full bg-surface-container-lowest border border-surface-variant rounded-md px-3 py-2 text-on-surface font-data-mono focus:border-primary focus:ring-1 focus:ring-primary transition-all text-lg text-center" 
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <label className="block font-label-caps text-label-caps text-on-surface-variant">البيان / ملاحظات</label>
            <textarea 
              name="notes" 
              value={formData.notes} 
              onChange={handleChange} 
              className="w-full bg-surface-container-lowest border border-surface-variant rounded-md px-3 py-2 text-on-surface font-body-md focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none h-24" 
              placeholder="اكتب سبب المعاملة هنا..."
            />
          </div>
          
          <div className="pt-4 border-t border-white/5 flex gap-3">
            <button type="submit" disabled={isSubmitting} className={`flex-1 py-3 rounded-lg font-body-lg font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg ${buttonColor}`}>
              <Icon name="check_circle" className="text-[20px]" />
              {isSubmitting ? 'جارٍ التنفيذ...' : 'تأكيد المعاملة'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
