import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Icon from '../../../shared/components/ui/Icon';
import TransactionEditModal from './TransactionEditModal';

export default function LedgerTable({
  ledger = [],
  loading = false,
  refetch,
  startDate: externalStartDate,
  endDate: externalEndDate,
  onStartDateChange,
  onEndDateChange,
}) {
  const navigate = useNavigate();
  const [filterType, setFilterType] = useState('all'); // 'all', 'sales', 'purchases', 'transactions'
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const [internalStartDate, setInternalStartDate] = useState('');
  const [internalEndDate, setInternalEndDate] = useState('');
  const [activePreset, setActivePreset] = useState('all'); // 'all', 'today', 'month', 'year', 'custom'

  const startDate = externalStartDate !== undefined ? externalStartDate : internalStartDate;
  const endDate = externalEndDate !== undefined ? externalEndDate : internalEndDate;

  const setStartDate = (val) => {
    if (onStartDateChange) onStartDateChange(val);
    else setInternalStartDate(val);
  };

  const setEndDate = (val) => {
    if (onEndDateChange) onEndDateChange(val);
    else setInternalEndDate(val);
  };

  const handlePreset = (presetType) => {
    setActivePreset(presetType);
    const now = new Date();
    if (presetType === 'all') {
      setStartDate('');
      setEndDate('');
    } else if (presetType === 'today') {
      const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      setStartDate(todayStr);
      setEndDate(todayStr);
    } else if (presetType === 'month') {
      const startStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
      const endStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      setStartDate(startStr);
      setEndDate(endStr);
    } else if (presetType === 'year') {
      const startStr = `${now.getFullYear()}-01-01`;
      const endStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      setStartDate(startStr);
      setEndDate(endStr);
    }
  };

  // Dynamic Filtering and Balance Recalculation
  const filteredLedger = useMemo(() => {
    let filtered = ledger;
    
    if (filterType === 'sales') {
      filtered = filtered.filter(item => item.type === 'invoice' && item.originalData.invoice_type === 'sale');
    } else if (filterType === 'purchases') {
      filtered = filtered.filter(item => item.type === 'invoice' && item.originalData.invoice_type === 'purchase');
    } else if (filterType === 'transactions') {
      filtered = filtered.filter(item => item.type === 'transaction');
    }

    if (startDate) {
      const start = new Date(startDate + 'T00:00:00');
      filtered = filtered.filter(item => item.date >= start);
    }
    if (endDate) {
      const end = new Date(endDate + 'T23:59:59.999');
      filtered = filtered.filter(item => item.date <= end);
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
  }, [ledger, filterType, startDate, endDate]);

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
      {/* Glassmorphic Filter Bar with Date Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 mt-6 print:hidden">
        {/* Type Filters */}
        <div className="flex bg-surface-container/50 border border-white/5 rounded-lg p-1 backdrop-blur-md">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${filterType === 'all' ? 'bg-primary text-[#1A1D23]' : 'text-on-surface-variant hover:text-on-surface'}`}
          >
            الكل
          </button>
          <button
            onClick={() => setFilterType('sales')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${filterType === 'sales' ? 'bg-primary text-[#1A1D23]' : 'text-on-surface-variant hover:text-on-surface'}`}
          >
            فواتير البيع
          </button>
          <button
            onClick={() => setFilterType('purchases')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${filterType === 'purchases' ? 'bg-primary text-[#1A1D23]' : 'text-on-surface-variant hover:text-on-surface'}`}
          >
            فواتير الشراء
          </button>
          <button
            onClick={() => setFilterType('transactions')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${filterType === 'transactions' ? 'bg-primary text-[#1A1D23]' : 'text-on-surface-variant hover:text-on-surface'}`}
          >
            السندات
          </button>
        </div>

        {/* Date Filter Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Quick Presets */}
          <div className="flex bg-surface-container/50 border border-white/5 rounded-lg p-1 backdrop-blur-md">
            <button
              onClick={() => handlePreset('all')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${activePreset === 'all' && !startDate && !endDate ? 'bg-primary/20 text-primary font-bold' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              كل التواريخ
            </button>
            <button
              onClick={() => handlePreset('today')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${activePreset === 'today' ? 'bg-primary/20 text-primary font-bold' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              اليوم
            </button>
            <button
              onClick={() => handlePreset('month')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${activePreset === 'month' ? 'bg-primary/20 text-primary font-bold' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              هذا الشهر
            </button>
            <button
              onClick={() => handlePreset('year')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${activePreset === 'year' ? 'bg-primary/20 text-primary font-bold' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              هذه السنة
            </button>
          </div>

          {/* Date Range Inputs */}
          <div className="flex items-center gap-2 bg-surface-container/50 border border-white/5 rounded-lg px-3 py-1 backdrop-blur-md">
            <Icon name="calendar_today" className="text-on-surface-variant text-sm" />
            <div className="flex items-center gap-1.5">
              <label className="text-on-surface-variant text-xs whitespace-nowrap">من:</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setActivePreset('custom');
                }}
                className="bg-surface-container-low border border-white/10 rounded-md py-1 px-2 text-on-surface text-xs font-data-mono focus:outline-none focus:border-primary transition-colors cursor-pointer"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <label className="text-on-surface-variant text-xs whitespace-nowrap">إلى:</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setActivePreset('custom');
                }}
                className="bg-surface-container-low border border-white/10 rounded-md py-1 px-2 text-on-surface text-xs font-data-mono focus:outline-none focus:border-primary transition-colors cursor-pointer"
              />
            </div>

            {(startDate || endDate) && (
              <button
                onClick={() => {
                  setStartDate('');
                  setEndDate('');
                  setActivePreset('all');
                }}
                className="p-1 text-on-surface-variant hover:text-error transition-colors rounded"
                title="مسح تصفية التاريخ"
                type="button"
              >
                <Icon name="close" className="text-sm" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-right border-collapse">
          <thead>
            <tr className="border-b-2 border-white/20 print:border-gray-400 bg-surface-container-low/50 print:bg-gray-100">
              <th className="py-3 px-3 font-label-caps text-label-caps text-on-surface-variant print:text-gray-700 w-32">التاريخ</th>
              <th className="py-3 px-3 font-label-caps text-label-caps text-on-surface-variant print:text-gray-700">البيان</th>
              <th className="py-3 px-3 font-label-caps text-label-caps text-on-surface-variant print:text-gray-700 text-left w-24">مدين</th>
              <th className="py-3 px-3 font-label-caps text-label-caps text-on-surface-variant print:text-gray-700 text-left w-24">دائن</th>
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
                      {item.type === 'invoice' ? (
                        <Link
                          to={`/invoices/${item.originalData?.id || item.id}`}
                          className="font-body-md font-medium text-primary hover:text-primary-fixed-dim hover:underline transition-colors print:text-black cursor-pointer"
                        >
                          {item.description}
                        </Link>
                      ) : (
                        <div className="font-body-md font-medium text-on-surface print:text-black">
                          {item.description}
                        </div>
                      )}
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
