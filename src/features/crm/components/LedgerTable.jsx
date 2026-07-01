import React, { useState } from 'react';
import Icon from '../../../shared/components/ui/Icon';

export default function LedgerTable({ transactions = [], loading = false }) {
  const [filterType, setFilterType] = useState('all');

  if (loading) {
    return (
      <div className="glass-panel rounded-xl overflow-hidden flex flex-col border border-white/5 h-96 animate-pulse p-6 space-y-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-12 bg-surface-variant/30 rounded w-full" />
        ))}
      </div>
    );
  }

  const safeTransactions = transactions || [];

  const filteredTransactions = safeTransactions.filter(tx => {
    if (filterType === 'all') return true;
    if (filterType === 'receipt') return tx.type === 'receipt';
    if (filterType === 'payment') return tx.type === 'payment';
    return true;
  });

  // Calculate running balance.
  // Assuming transactions are fetched sorted by created_at DESC (newest first).
  // We need to calculate the running balance from oldest to newest.
  let runningBalance = 0;
  const reversedTransactions = [...filteredTransactions].reverse();
  const txWithBalance = reversedTransactions.map(tx => {
    if (tx.type === 'payment') {
      runningBalance -= Number(tx.amount); // Payment decreases our debt to them / increases their debt to us
    } else if (tx.type === 'receipt') {
      runningBalance += Number(tx.amount); // Receipt increases our debt to them / decreases their debt to us
    }
    return { ...tx, runningBalance };
  }).reverse(); // Reverse back for newest first display

  return (
    <div className="space-y-gutter">
      {/* Transaction Filters Bar */}
      <div className="glass-panel rounded-xl p-4 flex flex-wrap items-center gap-gutter">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-on-surface-variant">نوع العملية:</span>
          <div className="flex gap-2">
            <button 
              onClick={() => setFilterType('all')}
              className={`px-4 py-1.5 rounded-full text-xs transition-all ${filterType === 'all' ? 'bg-primary/20 text-primary border border-primary/40 font-bold' : 'bg-white/5 text-on-surface-variant border border-transparent hover:border-white/10'}`}
            >
              الكل
            </button>
            <button 
              onClick={() => setFilterType('payment')}
              className={`px-4 py-1.5 rounded-full text-xs transition-all ${filterType === 'payment' ? 'bg-primary/20 text-primary border border-primary/40 font-bold' : 'bg-white/5 text-on-surface-variant border border-transparent hover:border-white/10'}`}
            >
              دفعات
            </button>
            <button 
              onClick={() => setFilterType('receipt')}
              className={`px-4 py-1.5 rounded-full text-xs transition-all ${filterType === 'receipt' ? 'bg-primary/20 text-primary border border-primary/40 font-bold' : 'bg-white/5 text-on-surface-variant border border-transparent hover:border-white/10'}`}
            >
              مقبوضات
            </button>
          </div>
        </div>
        <div className="flex-1 flex justify-end gap-2">
          <button className="p-2 bg-white/5 rounded-lg text-on-surface-variant hover:text-primary transition-colors">
            <Icon name="filter_list" />
          </button>
        </div>
      </div>

      {/* Detailed Ledger Table */}
      <div className="glass-panel rounded-xl overflow-hidden flex flex-col border border-white/5">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-right border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-surface-container-high/50 border-b border-white/10">
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant tracking-wider uppercase">التاريخ</th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant tracking-wider uppercase">نوع العملية</th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant tracking-wider uppercase">المرجع</th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant tracking-wider uppercase">مقبوضات (Receipt)</th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant tracking-wider uppercase">مدفوعات (Payment)</th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant tracking-wider uppercase">الرصيد التراكمي</th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant tracking-wider uppercase text-left">ملاحظات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {txWithBalance.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-on-surface-variant">لا توجد حركات مالية</td>
                </tr>
              ) : (
                txWithBalance.map((tx) => {
                  const date = new Date(tx.created_at).toLocaleDateString('ar-EG');
                  const isPayment = tx.type === 'payment';
                  const isReceipt = tx.type === 'receipt';
                  
                  return (
                    <tr key={tx.id} className="table-row-hover transition-colors group">
                      <td className="px-6 py-4 text-sm font-data-mono text-on-surface">{date}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Icon 
                            name={isPayment ? "account_balance_wallet" : "payments"} 
                            className={`text-lg ${isPayment ? 'text-error' : 'text-secondary'}`} 
                          />
                          <span className="text-sm font-medium">
                            {isPayment ? 'سند صرف (دفع)' : 'سند قبض (استلام)'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-data-mono text-on-surface-variant group-hover:text-primary transition-colors">
                        {tx.id.split('-')[0].toUpperCase()}
                      </td>
                      <td className="px-6 py-4 text-sm font-data-mono font-bold">
                        {isReceipt ? <span className="text-secondary">{Number(tx.amount).toFixed(2)}</span> : <span className="text-on-surface-variant opacity-30">0.00</span>}
                      </td>
                      <td className="px-6 py-4 text-sm font-data-mono font-bold">
                        {isPayment ? <span className="text-error">{Number(tx.amount).toFixed(2)}</span> : <span className="text-on-surface-variant opacity-30">0.00</span>}
                      </td>
                      <td className="px-6 py-4 text-sm font-data-mono text-on-surface font-bold">
                        {tx.runningBalance.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-xs text-on-surface-variant text-left italic">
                        {tx.notes || '—'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
