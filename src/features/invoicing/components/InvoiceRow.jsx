import React from 'react';
import Icon from '../../../shared/components/ui/Icon';

export default function InvoiceRow({ invoice, onView, onEdit, onDelete }) {
  const isSale = invoice.invoice_type === 'sale';
  const isCredit = invoice.payment_type === 'credit';

  // Format dates
  const invoiceDate = new Date(invoice.created_at).toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
      <td className="py-4 px-4">
        <div className="font-data-mono text-data-mono text-on-surface-variant group-hover:text-primary transition-colors">
          #{invoice.id.split('-')[0]}
        </div>
      </td>
      <td className="py-4 px-4">
        <div className="font-body-md text-body-md text-on-surface">
          {invoiceDate}
        </div>
      </td>
      <td className="py-4 px-4">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isSale ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-secondary/10 text-secondary border border-secondary/20'
          }`}>
          {isSale ? 'بيع' : 'شراء'}
        </span>
      </td>
      <td className="py-4 px-4">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isCredit ? 'bg-error/10 text-error border border-error/20' : 'bg-surface-variant text-on-surface border border-white/10'
          }`}>
          {isCredit ? 'آجل' : 'فوري (نقدي)'}
        </span>
      </td>
      <td className="py-4 px-4">
        <div className="font-body-md text-body-md font-medium text-on-surface">
          {invoice.customers_suppliers?.name || 'عميل عام'}
        </div>
      </td>
      <td className="py-4 px-4 font-data-mono text-data-mono font-medium text-right text-on-surface">
        {Number(invoice.total_amount).toFixed(2)} ج.م
      </td>
      <td className="py-4 px-4 text-left">
        <div className="flex items-center gap-2 justify-end">
          <button
            onClick={() => onDelete && onDelete(invoice)}
            aria-label={`حذف الفاتورة رقم ${invoice.id.split('-')[0]}`}
            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-surface-container hover:bg-error/20 text-on-surface-variant hover:text-error transition-colors focus:outline-none focus:ring-2 focus:ring-error/50"
          >
            <Icon name="delete" className="text-[18px]" />
          </button>
          <button
            onClick={() => onEdit && onEdit(invoice.id)}
            aria-label={`تعديل الفاتورة رقم ${invoice.id.split('-')[0]}`}
            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-surface-container hover:bg-secondary/20 text-on-surface-variant hover:text-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-secondary/50"
          >
            <Icon name="edit" className="text-[18px]" />
          </button>
          <button
            onClick={() => onView(invoice.id)}
            aria-label={`عرض الفاتورة رقم ${invoice.id.split('-')[0]}`}
            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-surface-container hover:bg-primary/20 text-on-surface-variant hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <Icon name="visibility" className="text-[18px]" />
          </button>
        </div>
      </td>
    </tr>
  );
}
