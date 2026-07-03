import React from 'react';

export default function RecentActivityTable({ invoices, transactions, loading }) {
  // Combine invoices and transactions into a single feed and sort by date
  const combinedActivity = [
    ...(invoices || []).map(inv => ({
      id: inv.id,
      date: new Date(inv.created_at),
      type: inv.type === 'sale' ? 'مبيعات - تجزئة' : 'مشتريات',
      entityName: inv.customers_suppliers?.name || 'عميل عام',
      amount: inv.total_amount,
      status: 'مكتمل',
      isPositive: inv.type === 'sale'
    })),
    ...(transactions || []).map(trx => ({
      id: trx.id,
      date: new Date(trx.created_at),
      type: trx.type === 'receipt' ? 'إيداع نقدي' : 'مدفوعات',
      entityName: trx.customers_suppliers?.name || 'خزينة',
      amount: trx.amount,
      status: 'مرحل',
      isPositive: trx.type === 'receipt'
    }))
  ].sort((a, b) => b.date - a.date).slice(0, 8); // Top 8 recent

  return (
    <div className="glass-panel rounded-2xl flex flex-col overflow-hidden lg:col-span-2">
      <div className="p-6 border-b border-surface-variant/20 flex justify-between items-center">
        <h2 className="font-headline-md text-headline-md text-on-surface">آخر العمليات</h2>
        <button className="text-primary font-body-md text-body-md hover:underline flex items-center gap-1 group">
          عرض الكل
          <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">arrow_back</span>
        </button>
      </div>
      <div className="overflow-x-auto w-full no-scrollbar">
        <table className="w-full text-right">
          <thead className="bg-surface-container-low/50">
            <tr>
              <th className="py-4 px-6 font-label-caps text-label-caps text-on-surface-variant font-medium">العميل / الجهة</th>
              <th className="py-4 px-6 font-label-caps text-label-caps text-on-surface-variant font-medium">نوع العملية</th>
              <th className="py-4 px-6 font-label-caps text-label-caps text-on-surface-variant font-medium">المبلغ</th>
              <th className="py-4 px-6 font-label-caps text-label-caps text-on-surface-variant font-medium">الوقت</th>
              <th className="py-4 px-6 font-label-caps text-label-caps text-on-surface-variant font-medium">الحالة</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-variant/10">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="py-4 px-6"><div className="h-4 w-32 bg-surface-variant/30 rounded" /></td>
                  <td className="py-4 px-6"><div className="h-4 w-24 bg-surface-variant/30 rounded" /></td>
                  <td className="py-4 px-6"><div className="h-4 w-20 bg-surface-variant/30 rounded" /></td>
                  <td className="py-4 px-6"><div className="h-4 w-16 bg-surface-variant/30 rounded" /></td>
                  <td className="py-4 px-6"><div className="h-6 w-16 bg-surface-variant/30 rounded-full" /></td>
                </tr>
              ))
            ) : combinedActivity.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-8 text-center text-on-surface-variant">لا توجد عمليات حديثة</td>
              </tr>
            ) : (
              combinedActivity.map((activity, index) => (
                <tr key={`${activity.id}-${index}`} className="table-row-hover group">
                  <td className="py-4 px-6 font-body-md text-body-md text-on-surface font-medium">{activity.entityName}</td>
                  <td className="py-4 px-6 text-on-surface-variant">{activity.type}</td>
                  <td className="py-4 px-6 font-data-mono text-data-mono">
                    <span className={activity.isPositive ? 'text-on-surface' : 'text-error'}>
                      {activity.isPositive ? '' : '-'}
                      {Number(activity.amount).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                    </span>
                    <span className="text-xs text-on-surface-variant mr-1">ج.م</span>
                  </td>
                  <td className="py-4 px-6 font-data-mono text-on-surface-variant">
                    {activity.date.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      activity.status === 'مكتمل' 
                        ? 'bg-secondary/10 text-secondary border-secondary/20'
                        : activity.status === 'مرحل'
                        ? 'bg-error/10 text-error border-error/20'
                        : 'bg-primary/10 text-primary border-primary/20'
                    }`}>
                      {activity.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
