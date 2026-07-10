import React, { useRef, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useReactToPrint } from 'react-to-print';
import Sidebar from '../../shared/components/layout/Sidebar';
import Icon from '../../shared/components/ui/Icon';
import { useGetStatement } from './hooks/useStatement';
import LedgerTable from './components/LedgerTable';

export default function StatementOfAccountPage() {
  const { id } = useParams(); // Using 'id' based on the route mapping /customers/:id/statement
  const navigate = useNavigate();
  const { entity, ledger, loading, error, refetch, finalBalance } = useGetStatement(id);

  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `كشف_حساب_${entity?.name || id}`,
  });

  if (loading) {
    return (
      <div className="flex-1 flex min-w-0 mr-0 md:mr-64 h-screen bg-background text-on-surface rtl relative">
        <Sidebar activePath="/customers" />
        <main className="flex-1 p-gutter flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-on-surface-variant font-body-md text-body-md">جاري إعداد كشف الحساب...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !entity) {
    return (
      <div className="flex-1 flex min-w-0 mr-0 md:mr-64 h-screen bg-background text-on-surface rtl relative">
        <Sidebar activePath="/customers" />
        <main className="flex-1 p-gutter flex items-center justify-center">
          <div className="text-center">
            <Icon name="error" className="text-5xl text-error mb-4" />
            <h2 className="text-headline-md font-bold mb-2">تعذر تحميل كشف الحساب</h2>
            <button
              onClick={() => navigate('/customers')}
              className="mt-4 px-6 py-2 bg-surface-container rounded-lg hover:bg-surface-variant transition-colors"
            >
              العودة للعملاء
            </button>
          </div>
        </main>
      </div>
    );
  }

  const printDate = new Date().toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <>
      <Helmet>
        <title>كشف حساب | {entity.name} - الأتيليه التنفيذي</title>
      </Helmet>

      <div className="flex-1 flex flex-col min-w-0 mr-0 md:mr-64 h-screen bg-background text-on-surface antialiased rtl overflow-hidden relative print:block print:bg-white print:text-black print:m-0 print:p-0 print:h-auto">
        <div className="print:hidden">
          <Sidebar activePath="/customers" />
        </div>

        {/* Ambient Background - Hidden in print */}
        <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10 opacity-50 print:hidden"></div>
        <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none -z-10 opacity-30 print:hidden"></div>

        <main className="flex-1 flex flex-col h-screen pt-4 relative z-10 overflow-y-auto overflow-x-hidden print:overflow-visible print:p-0 print:block">

          {/* Action Bar - Hidden in print */}
          <div className="px-gutter mb-6 flex justify-between items-center print:hidden">
            <button
              onClick={() => navigate('/customers')}
              className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-body-md text-body-md"
            >
              <Icon name="arrow_forward" className="text-xl" />
              العودة للعملاء
            </button>

            <button
              onClick={() => handlePrint()}
              className="flex items-center gap-2 bg-primary text-[#1A1D23] px-6 py-2.5 rounded-lg font-headline-md text-headline-md font-bold hover:bg-primary-fixed transition-colors shadow-lg ambient-glow"
            >
              <Icon name="print" />
              طباعة كشف الحساب
            </button>
          </div>

          {/* Printable Area */}
          <div className="px-gutter pb-12 flex justify-center print:p-0 print:m-0 print:block">

            {/* The Document */}
            <div
              ref={componentRef}
              className="glass-panel rounded-2xl w-full max-w-[900px] p-8 md:p-12 relative overflow-hidden print:shadow-none print:border-none print:bg-transparent print:rounded-none print:w-full print:max-w-none print:p-8"
              style={{ minHeight: '800px' }}
            >
              {/* Header */}
              <div className="flex justify-between items-start border-b border-white/10 print:border-gray-300 pb-8 mb-8">
                <div>
                  <h1 className="font-headline-lg text-headline-lg font-bold text-primary print:text-black mb-1">
                    Executive Atelier
                  </h1>
                  <p className="font-body-sm text-body-sm text-on-surface-variant print:text-gray-600">
                    نظام الإدارة الفاخرة ونقاط البيع
                  </p>
                </div>
                <div className="text-left">
                  <h2 className="font-headline-md text-headline-md font-bold text-on-surface print:text-black tracking-widest">
                    كشف حساب تفصيلي
                  </h2>
                  <div className="font-data-mono text-data-mono text-on-surface-variant mt-2 print:text-gray-700">
                    تاريخ الطباعة: {printDate}
                  </div>
                </div>
              </div>

              {/* Entity Info */}
              <div className="grid grid-cols-2 gap-8 mb-10">
                <div>
                  <h3 className="font-label-caps text-label-caps text-on-surface-variant print:text-gray-500 mb-2">معلومات الجهة:</h3>
                  <div className="font-body-lg text-body-lg font-bold text-on-surface print:text-black">
                    {entity.name}
                  </div>
                  <div className="font-data-mono text-data-mono text-on-surface-variant print:text-gray-600 mt-1 flex flex-wrap gap-2">
                    <span>{entity.phone || 'لا يوجد هاتف'}</span>
                    <span className="opacity-30">|</span>
                    <span>البلد: {entity.country || 'مصر'}</span>
                  </div>
                </div>
                <div className="text-left">
                  <h3 className="font-label-caps text-label-caps text-on-surface-variant print:text-gray-500 mb-2">ملخص الحساب:</h3>
                  <div className="font-data-mono text-data-mono text-on-surface print:text-black">
                    <span className="text-on-surface-variant print:text-gray-600 ml-2">الرصيد الكلي:</span>
                    <span className={`font-bold ${finalBalance > 0 ? 'text-primary print:text-black' : finalBalance < 0 ? 'text-error print:text-black' : 'text-on-surface print:text-black'}`}>
                      {Math.abs(finalBalance).toFixed(2)} {finalBalance > 0 ? '(عليه)' : finalBalance < 0 ? '(له)' : ''}
                    </span>
                  </div>
                </div>
              </div>

              {/* Ledger Table */}
              <div className="mb-10">
                <LedgerTable ledger={ledger} loading={loading} refetch={refetch} />
              </div>

              {/* Footer */}
              <div className="absolute bottom-8 left-12 right-12 text-center border-t border-white/10 print:border-gray-300 pt-6">
                <p className="font-body-sm text-body-sm text-on-surface-variant print:text-gray-500">
                  يعتبر هذا الكشف نهائياً ما لم يردنا اعتراض خلال 15 يوماً من تاريخه.
                </p>
              </div>

            </div>
          </div>
        </main>
      </div>
    </>
  );
}
