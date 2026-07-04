import React, { useState, useEffect } from 'react';
import Icon from '../../../shared/components/ui/Icon';
import { updateFinancialTransaction } from '../../../core/supabase/api';

export default function TransactionEditModal({ isOpen, onClose, transaction, onSuccess }) {
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (transaction) {
      setAmount(transaction.amount || '');
      setNotes(transaction.notes || '');
    }
  }, [transaction]);

  if (!isOpen || !transaction) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      alert("الرجاء إدخال مبلغ صحيح.");
      return;
    }

    try {
      setIsSubmitting(true);
      await updateFinancialTransaction(transaction.id, {
        amount: Number(amount),
        notes: notes
      });
      alert('تم تعديل السند المالي بنجاح.');
      onSuccess(); // This should trigger a refetch
      onClose();
    } catch (error) {
      console.error('Error updating transaction:', error);
      alert('حدث خطأ أثناء التعديل.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center rtl font-body-md">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      <div className="glass-panel relative w-full max-w-md rounded-2xl border border-white/10 shadow-2xl p-6 mx-4 animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 w-8 h-8 flex items-center justify-center rounded-full bg-surface-container hover:bg-white/10 transition-colors text-on-surface-variant"
        >
          <Icon name="close" className="text-xl" />
        </button>

        <div className="mb-6">
          <h2 className="text-headline-md font-bold text-on-surface flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary/10 border border-primary/20">
              <Icon name="edit_document" className="text-primary text-xl" />
            </div>
            تعديل السند المالي
          </h2>
          <p className="text-on-surface-variant mt-2">
            جاري تعديل السند المرجعي: <span className="font-data-mono">{transaction.id.split('-')[0]}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-1">
              المبلغ (ج.م)
            </label>
            <div className="relative">
              <Icon name="payments" className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
              <input
                type="number"
                step="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-surface-container/50 border border-white/10 rounded-lg py-2.5 pr-10 pl-4 text-on-surface focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-data-mono"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-1">
              ملاحظات البيان
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-surface-container/50 border border-white/10 rounded-lg p-3 text-on-surface focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all resize-none"
              rows="3"
              placeholder="اكتب ملاحظاتك هنا..."
            ></textarea>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-primary text-[#1A1D23] font-bold py-2.5 rounded-lg hover:bg-primary-fixed hover:shadow-lg transition-all disabled:opacity-50 flex justify-center items-center gap-2"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-[#1A1D23] border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Icon name="save" />
                  حفظ التعديلات
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 bg-surface-container text-on-surface hover:bg-surface-variant transition-colors rounded-lg font-medium"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
