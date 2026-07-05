import React from 'react';
import Icon from '../../../shared/components/ui/Icon';

/**
 * ConfirmDeleteModal — Glassmorphic confirmation dialog for invoice deletion.
 * Warns the user that stock will be reversed and balances adjusted.
 *
 * @param {boolean}  isOpen      - Controls modal visibility
 * @param {object}   invoice     - The invoice object to delete
 * @param {boolean}  isDeleting  - Loading state during deletion
 * @param {Function} onConfirm   - Callback when user confirms deletion
 * @param {Function} onCancel    - Callback when user cancels
 */
export default function ConfirmDeleteModal({ isOpen, invoice, isDeleting, onConfirm, onCancel }) {
  if (!isOpen || !invoice) return null;

  const isSale = invoice.invoice_type === 'sale';
  const invoiceShortId = invoice.id?.split('-')[0] || '';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center rtl">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-[fadeIn_200ms_ease-out]"
        onClick={!isDeleting ? onCancel : undefined}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 glass-panel rounded-2xl border border-white/10 shadow-[0_24px_64px_rgba(0,0,0,0.5)] animate-[scaleIn_250ms_ease-out]">

        {/* Header with danger icon */}
        <div className="flex flex-col items-center pt-8 pb-4 px-6">
          <div className="w-16 h-16 rounded-full bg-error/15 border border-error/20 flex items-center justify-center mb-4">
            <Icon name="warning" className="text-error text-3xl" />
          </div>
          <h3 className="font-headline-md text-headline-md text-on-surface font-bold text-center">
            حذف الفاتورة #{invoiceShortId}
          </h3>
        </div>

        {/* Body */}
        <div className="px-6 pb-6">
          <p className="text-on-surface-variant font-body-md text-body-md text-center leading-relaxed mb-4">
            هل أنت متأكد من حذف هذه الفاتورة نهائياً؟
            <br />
            <span className="text-error font-medium">
              سيتم استرجاع المخزون وتعديل الأرصدة تلقائياً.
            </span>
          </p>

          {/* Invoice summary card */}
          <div className="bg-surface-container-low/50 rounded-xl p-4 border border-white/5 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-on-surface-variant font-body-md text-body-md">النوع</span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isSale ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-secondary/10 text-secondary border border-secondary/20'
                }`}>
                {isSale ? 'بيع' : 'شراء'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-on-surface-variant font-body-md text-body-md">الجهة</span>
              <span className="text-on-surface font-body-md text-body-md font-medium">
                {invoice.customers_suppliers?.name || 'عميل عام'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-on-surface-variant font-body-md text-body-md">الإجمالي</span>
              <span className="text-on-surface font-data-mono text-data-mono font-bold">
                {Number(invoice.total_amount).toFixed(2)} ج.م
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 px-6 pb-6">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 py-3 rounded-xl bg-surface-container border border-white/10 text-on-surface font-body-md text-body-md font-medium hover:bg-surface-container-highest transition-colors disabled:opacity-50"
          >
            إلغاء
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 py-3 rounded-xl bg-error text-on-error font-body-md text-body-md font-bold hover:bg-error/80 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isDeleting ? (
              <>
                <span className="w-4 h-4 border-2 border-on-error/30 border-t-on-error rounded-full animate-spin" />
                جاري الحذف...
              </>
            ) : (
              <>
                <Icon name="delete_forever" className="text-[18px]" />
                حذف نهائياً
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
