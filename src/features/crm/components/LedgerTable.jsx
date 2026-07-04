import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../shared/components/ui/Icon';
import TransactionEditModal from './TransactionEditModal';

export default function LedgerTable({ ledger = [], loading = false, refetch }) {
  const navigate = useNavigate();
  const [filterType, setFilterType] = useState('all'); // 'all', 'sales', 'purchases', 'transactions'
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // Dynamic Filtering and Balance Recalculation
  const filteredLedger = useMemo(() => {
    let filtered = ledger;
    
    if (filterType === 'sales') {
      filtered = ledger.filter(item => item.type === 'invoice' && item.originalData.invoice_type === 'sale');
    } else if (filterType === 'purchases') {
      filtered = ledger.filter(item => item.type === 'invoice' && item.originalData.invoice_type === 'purchase');
    } else if (filterType === 'transactions') {
      filtered = ledger.filter(item => item.type === 'transaction');
    }

    // Recalculate Running Balance on the filtered set
    let runningBalance = 0;
    return filtered.map(item => {
      runningBalance = runningBalance + item.debit - item.credit;
      return {
        ...item,
        balance: runningBalance
      };
    });
  }, [ledger, filterType]);

  const handleEditRow = (item) => {
    if (item.type === 'invoice') {
      navigate(`/invoices/${item.id}/edit`);
    } else if (item.type === 'transaction') {
      setSelectedTransaction(item.originalData);
    }
  };

  if (loading) {
    return (
      <div className="glass-panel rounded-xl overflow-hidden flex flex-col border border-white/5 h-96 animate-pulse p-6 space-y-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-12 bg-surface-variant/30 rounded w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Glassmorphic Filter Bar */}
      <div className="flex bg-surface-container/50 border border-white/5 rounded-lg p-1 backdrop-blur-md mb-6 mt-6 w-fit print:hidden">
        <button
          onClick={() => setFilterType('all')}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${filterType === 'all' ? 'bg-primary text-[#1A1D23]' : 'text-on-surface-variant hover:text-on-surface'}`}
        >
          الكل
        </button>
        <button
          onClick={() => setFilterType('sales')}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${filterType === 'sales' ? 'bg-primary text-[#1A1D23]' : 'text-on-surface-variant hover:text-on-surface'}`}
        >
          فواتير البيع
        </button>
        <button
          onClick={() => setFilterType('purchases')}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${filterType === 'purchases' ? 'bg-primary text-[#1A1D23]' : 'text-on-surface-variant hover:text-on-surface'}`}
        >
          فواتير الشراء
        </button>
        <button
          onClick={() => setFilterType('transactions')}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${filterType === 'transactions' ? 'bg-primary text-[#1A1D23]' : 'text-on-surface-variant hover:text-on-surface'}`}
        >
          السندات
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-right border-collapse">
          <thead>
            <tr className="border-b-2 border-white/20 print:border-gray-400 bg-surface-container-low/50 print:bg-gray-100">
              <th className="py-3 px-3 font-label-caps text-label-caps text-on-surface-variant print:text-gray-700 w-32">التاريخ</th>
              <th className="py-3 px-3 font-label-caps text-label-caps text-on-surface-variant print:text-gray-700">البيان</th>
              <th className="py-3 px-3 font-label-caps text-label-caps text-on-surface-variant print:text-gray-700 text-left w-24">مدين (له)</th>
              <th className="py-3 px-3 font-label-caps text-label-caps text-on-surface-variant print:text-gray-700 text-left w-24">دائن (عليه)</th>
              <th className="py-3 px-3 font-label-caps text-label-caps text-on-surface-variant print:text-gray-700 text-left w-28">الرصيد</th>
              <th className="py-3 px-3 font-label-caps text-label-caps text-on-surface-variant text-center w-16 print:hidden">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filteredLedger.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-8 text-center text-on-surface-variant print:text-gray-500">
                  لا توجد حركات متطابقة مع الفلتر الحالي.
                </td>
              </tr>
            ) : (
              filteredLedger.map((item, index) => {
                const rowDate = new Intl.DateTimeFormat('ar-EG', { year: 'numeric', month: 'numeric', day: 'numeric' }).format(item.date);
                return (
                  <tr key={`${item.type}-${item.id}-${index}`} className="border-b border-white/5 print:border-gray-200">
                    <td className="py-3 px-3 font-data-mono text-sm text-on-surface-variant print:text-gray-600">
                      {rowDate}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-body-md font-medium text-on-surface print:text-black">
                        {item.description}
                      </div>
                      {item.notes && (
                        <div className="font-body-sm text-on-surface-variant print:text-gray-500 mt-0.5">
                          {item.notes}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-3 font-data-mono text-sm text-on-surface print:text-black text-left">
                      {item.debit > 0 ? item.debit.toFixed(2) : '-'}
                    </td>
                    <td className="py-3 px-3 font-data-mono text-sm text-on-surface print:text-black text-left">
                      {item.credit > 0 ? item.credit.toFixed(2) : '-'}
                    </td>
                    <td className="py-3 px-3 font-data-mono text-sm font-bold text-primary print:text-black text-left">
                      {item.balance.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-center print:hidden">
                      <button
                        onClick={() => handleEditRow(item)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-surface-container hover:bg-secondary/20 text-on-surface-variant hover:text-secondary transition-colors focus:outline-none"
                        title="تعديل"
                        aria-label={item.type === 'invoice' ? 'تعديل الفاتورة' : 'تعديل السند'}
                      >
                        <Icon name="edit" className="text-[18px]" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <TransactionEditModal
        isOpen={!!selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
        transaction={selectedTransaction}
        onSuccess={() => refetch && refetch()}
      />
    </div>
  );
}
