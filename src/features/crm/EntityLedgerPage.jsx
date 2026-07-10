import React, { useMemo, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetStatement } from './hooks/useStatement';
import Sidebar from '../../shared/components/layout/Sidebar';
import Icon from '../../shared/components/ui/Icon';
import LedgerTable from './components/LedgerTable';
import { useReactToPrint } from 'react-to-print';

export default function EntityLedgerPage() {
  const { id } = useParams();
  const { entity, ledger, loading, error, refetch, finalBalance } = useGetStatement(id);
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `كشف_الجهات_${entity?.name || id}`,
  });

  const stats = useMemo(() => {
    if (!ledger) return { payments: 0, receipts: 0 };
    return ledger.reduce((acc, item) => {
      if (item.type === 'transaction' && item.originalData.type === 'payment') acc.payments += item.debit;
      if (item.type === 'transaction' && item.originalData.type === 'receipt') acc.receipts += item.credit;
      return acc;
    }, { payments: 0, receipts: 0 });
  }, [ledger]);

  if (error) {
    return (
      <div className="flex-1 flex flex-col min-w-0 mr-0 md:mr-64 h-screen items-center justify-center rtl text-error">
        <Icon name="error" className="text-4xl mb-4" />
        <p>حدث خطأ أثناء تحميل كشف الحساب.</p>
        <Link to="/customers" className="mt-4 text-primary hover:underline">العودة لقائمة العملاء</Link>
      </div>
    );
  }

  const balance = Number(entity?.current_balance || 0);

  return (
    <div className="flex-1 flex flex-col min-w-0 mr-0 md:mr-64 h-screen bg-background text-on-background relative overflow-hidden font-body-md antialiased rtl">
      <Sidebar activePath="/customers" />

      {/* Atmospheric Background Element */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10 opacity-50"></div>
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none -z-10 opacity-30"></div>

      <main className="flex-1 overflow-y-auto pt-8 px-gutter pb-stack-lg relative z-10">
        <div className="max-w-container-max mx-auto space-y-stack-lg">

          {/* Header Actions */}
          <div className="flex justify-between items-end">
            <Link to="/customers" className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors">
              <Icon name="arrow_forward" />
              العودة للجهات
            </Link>
            <div className="flex gap-stack-sm">
              <button onClick={refetch} className="flex items-center gap-2 px-4 py-2 bg-surface-container border border-white/10 rounded-lg hover:bg-white/5 transition-all text-on-surface-variant">
                <Icon name="refresh" />
                تحديث
              </button>
              <button onClick={() => handlePrint()} className="flex items-center gap-2 px-6 py-2 bg-primary text-on-primary rounded-lg font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/10">
                <Icon name="print" className="text-[18px]" />
                طباعة الكشف
              </button>
            </div>
          </div>

          {/* Ledger Content */}
          {loading ? (
            <div className="animate-pulse space-y-6">
              <div className="h-32 bg-surface-variant/30 rounded-xl" />
              <div className="h-40 bg-surface-variant/20 rounded-xl" />
            </div>
          ) : (
            <div ref={componentRef} className="print:bg-white print:text-black print:p-8 print:w-full">
              <div className="hidden print:block mb-8 border-b pb-4 border-gray-300">
                <h1 className="text-2xl font-bold mb-1">Executive Atelier</h1>
                <p className="text-gray-600 text-sm">نظام الإدارة الفاخرة ونقاط البيع - كشف حساب مالي</p>
              </div>
              {/* Supplier/Customer Header Summary (Glassmorphism Bento) */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter">
                {/* Main Entity Info */}
                <div className="md:col-span-2 glass-panel rounded-xl p-6 flex items-center gap-6 border-r-4 border-r-primary">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20">
                    <Icon name={entity?.type === 'supplier' ? 'business' : 'person'} className="text-primary text-3xl" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-headline-md text-headline-md text-on-surface">{entity?.name}</h3>
                      <span className={`px-3 py-1 text-[10px] font-bold rounded-full border ${entity?.type === 'supplier'
                          ? 'bg-secondary/10 text-secondary border-secondary/20'
                          : 'bg-primary/10 text-primary border-primary/20'
                        }`}>
                        {entity?.type === 'supplier' ? 'مورد' : 'عميل'}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-on-surface-variant text-sm mt-1">
                      <p className="font-data-mono">
                        {entity?.phone ? `رقم الهاتف: ${entity.phone}` : 'بدون رقم هاتف'}
                      </p>
                      <span className="text-white/20 hidden sm:inline">|</span>
                      <p className="font-body-md flex items-center gap-1">
                        <Icon name="public" className="text-[16px] text-primary" />
                        <span>البلد: {entity?.country || 'مصر'}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="glass-panel rounded-xl p-6 flex flex-col justify-between">
                  <span className="text-on-surface-variant text-xs font-medium">إجمالي المقبوضات (Receipts)</span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-2xl font-bold font-data-mono text-secondary">{stats.receipts.toFixed(2)}</span>
                    <span className="text-[10px] text-on-surface-variant">ج.م</span>
                  </div>
                </div>
                <div className="glass-panel rounded-xl p-6 flex flex-col justify-between">
                  <span className="text-on-surface-variant text-xs font-medium">إجمالي المدفوعات (Payments)</span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-2xl font-bold font-data-mono text-error">{stats.payments.toFixed(2)}</span>
                    <span className="text-[10px] text-on-surface-variant">ج.م</span>
                  </div>
                </div>

                {/* Balance Floating Action Style */}
                <div className="md:col-span-4 bg-primary/5 border border-primary/20 backdrop-blur-md rounded-xl p-6 flex justify-between items-center gold-glow">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                      <Icon name="payments" className="text-on-primary text-2xl" />
                    </div>
                    <div>
                      <span className="text-on-surface-variant text-xs">الرصيد المتبقي</span>
                      <div className="flex items-baseline gap-2">
                        <h2 className={`text-3xl font-bold font-data-mono tracking-tight ${balance < 0 ? 'text-error' : 'text-primary'}`}>
                          {Math.abs(balance).toFixed(2)}
                        </h2>
                        <span className={`text-xs font-bold ${balance < 0 ? 'text-error/80' : 'text-primary/80'}`}>ج.م</span>
                        {balance !== 0 && (
                          <span className="text-xs text-on-surface-variant mr-2">
                            {balance < 0 ? '(مدين لك)' : '(دائن لك)'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-on-surface-variant mb-1 text-left">تاريخ آخر حركة</span>
                    <span className="text-on-surface font-medium font-data-mono">
                      {ledger?.length > 0 ? new Date(ledger[ledger.length - 1].date).toLocaleDateString('ar-EG') : '—'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Ledger Table (Unified) */}
              <LedgerTable ledger={ledger} loading={loading} refetch={refetch} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
