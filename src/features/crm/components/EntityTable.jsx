import React from 'react';
import Icon from '../../../shared/components/ui/Icon';
import { Link } from 'react-router-dom';

export default function EntityTable({ entities = [], loading = false, onEdit, onTransaction, onDelete }) {
  if (loading) {
    return (
      <div className="glass-panel rounded-xl overflow-hidden flex flex-col h-[600px] ambient-glow">
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-surface-container-low/50">
          <h3 className="font-headline-md text-headline-md text-on-surface">سجل العملاء والموردين</h3>
        </div>
        <div className="p-6 space-y-4 animate-pulse flex-1">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-12 bg-surface-variant/30 rounded w-full" />
          ))}
        </div>
      </div>
    );
  }

  const safeEntities = entities || [];

  return (
    <div className="glass-panel rounded-xl overflow-hidden flex flex-col h-[600px] ambient-glow">
      <div className="p-6 border-b border-white/5 flex justify-between items-center bg-surface-container-low/50">
        <h3 className="font-headline-md text-headline-md text-on-surface">سجل العملاء والموردين</h3>
        <div className="flex gap-2">
          <button className="text-primary hover:text-primary-fixed-dim transition-colors text-sm flex items-center gap-1">
            <Icon name="filter_list" className="text-[18px]" />
            تصفية
          </button>
        </div>
      </div>
      <div className="overflow-y-auto overflow-x-auto flex-1 relative custom-scrollbar">
        <table className="w-full text-right border-collapse min-w-[800px]">
          <thead className="sticky top-0 bg-surface-container/90 backdrop-blur-md z-10">
            <tr className="border-b border-white/5">
              <th className="p-4 font-label-caps text-label-caps text-on-surface-variant">الاسم</th>
              <th className="p-4 font-label-caps text-label-caps text-on-surface-variant">النوع</th>
              <th className="p-4 font-label-caps text-label-caps text-on-surface-variant">رقم الهاتف</th>
              <th className="p-4 font-label-caps text-label-caps text-on-surface-variant">البلد</th>
              <th className="p-4 font-label-caps text-label-caps text-on-surface-variant">الرصيد الحالي</th>
              <th className="p-4 font-label-caps text-label-caps text-on-surface-variant text-center">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="font-body-md text-body-md">
            {safeEntities.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-on-surface-variant">لا توجد سجلات</td>
              </tr>
            ) : (
              safeEntities.map((entity) => {
                const balance = Number(entity.current_balance || 0);
                const isDebt = balance < 0; // Negative balance implies they owe us (or we owe them, depending on accounting rule, but let's just color it).
                
                return (
                  <tr key={entity.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <Link 
                        to={`/customers/${entity.id}`}
                        className="font-medium text-on-surface hover:text-primary transition-colors cursor-pointer"
                      >
                        {entity.name}
                      </Link>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        entity.type === 'supplier' 
                          ? 'bg-secondary-container/20 text-secondary border border-secondary/20' 
                          : 'bg-primary-container/20 text-primary border border-primary/20'
                      }`}>
                        {entity.type === 'supplier' ? 'مورد' : 'عميل'}
                      </span>
                    </td>
                    <td className="p-4 font-data-mono text-data-mono text-on-surface-variant">{entity.phone || '—'}</td>
                    <td className="p-4 font-body-md text-on-surface-variant">{entity.country || 'مصر'}</td>
                    <td className="p-4 font-data-mono text-data-mono">
                      <span className={isDebt ? 'text-error' : 'text-primary'}>
                        {Math.abs(balance).toFixed(2)} ج.م
                      </span>
                      {balance !== 0 && (
                        <span className="text-[10px] ml-1 text-on-surface-variant">
                          {balance < 0 ? '(مدين)' : '(دائن)'}
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => onTransaction(entity, 'receipt')}
                          className="px-3 py-1.5 border border-secondary/30 text-secondary rounded hover:bg-secondary/10 transition-colors text-sm flex items-center gap-1"
                          title="سداد/قبض"
                        >
                          <Icon name="payments" className="text-[16px]" />
                          قبض
                        </button>
                        <button
                          onClick={() => onTransaction(entity, 'payment')}
                          className="px-3 py-1.5 border border-error/30 text-error rounded hover:bg-error/10 transition-colors text-sm flex items-center gap-1"
                        >
                          <Icon name="account_balance_wallet" className="text-[16px]" />
                          دفع
                        </button>
                        <button
                          onClick={() => onEdit(entity)}
                          className="px-3 py-1.5 border border-primary/30 text-primary rounded hover:bg-primary/10 transition-colors text-sm"
                        >
                          تعديل
                        </button>
                        <button
                          onClick={async () => {
                            if (window.confirm('هل أنت متأكد من حذف هذه الجهة؟')) {
                              try {
                                await onDelete(entity.id);
                              } catch (err) {
                                alert('لا يمكن حذف هذه الجهة لأنها مرتبطة بمعاملات مالية أو فواتير مسجلة في النظام.');
                              }
                            }
                          }}
                          className="px-3 py-1.5 border border-error/50 text-error rounded hover:bg-error/10 transition-colors text-sm flex items-center justify-center"
                          title="حذف"
                        >
                          <Icon name="delete" className="text-[16px]" />
                        </button>
                        <Link
                          to={`/customers/${entity.id}`}
                          className="px-3 py-1.5 bg-primary/10 border border-primary/50 text-primary rounded hover:bg-primary hover:text-on-primary transition-colors text-sm font-bold flex items-center gap-1"
                          title="كشف حساب"
                        >
                          <Icon name="receipt_long" className="text-[16px]" />
                          كشف
                        </Link>
                      </div>
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
