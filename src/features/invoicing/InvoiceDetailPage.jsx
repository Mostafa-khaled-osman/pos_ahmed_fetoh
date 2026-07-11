import React, { useRef } from 'react';
import { formatStock } from '../../shared/utils/stockUtils';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useReactToPrint } from 'react-to-print';
import Sidebar from '../../shared/components/layout/Sidebar';
import Icon from '../../shared/components/ui/Icon';
import { useInvoiceDetails } from './hooks/useInvoices';

export default function InvoiceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { invoiceData, loading, error } = useInvoiceDetails(id);

  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `فاتورة_${id?.split('-')[0] || ''}`,
  });

  if (loading) {
    return (
      <div className="flex-1 flex min-w-0 mr-0 md:mr-64 h-screen bg-background text-on-surface rtl relative">
        <Sidebar activePath="/invoices" />
        <main className="flex-1 p-gutter flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-on-surface-variant font-body-md text-body-md">جاري جلب تفاصيل الفاتورة...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !invoiceData) {
    return (
      <div className="flex-1 flex min-w-0 mr-0 md:mr-64 h-screen bg-background text-on-surface rtl relative">
        <Sidebar activePath="/invoices" />
        <main className="flex-1 p-gutter flex items-center justify-center">
          <div className="text-center">
            <Icon name="error" className="text-5xl text-error mb-4" />
            <h2 className="text-headline-md font-bold mb-2">تعذر تحميل الفاتورة</h2>
            <button
              onClick={() => navigate('/invoices')}
              className="mt-4 px-6 py-2 bg-surface-container rounded-lg hover:bg-surface-variant transition-colors"
            >
              العودة للسجل
            </button>
          </div>
        </main>
      </div>
    );
  }

  const isSale = invoiceData.invoice_type === 'sale';
  const invoiceDate = new Date(invoiceData.created_at).toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <>
      <Helmet>
        <title>تفاصيل الفاتورة - الأتيليه التنفيذي</title>
      </Helmet>

      {/* 
        We hide the Sidebar when printing via 'print:hidden' on its wrapper or globally 
        if we structured it that way. Here we just ensure the layout is clean.
      */}
      <div className="flex-1 flex flex-col min-w-0 mr-0 md:mr-64 h-screen bg-background text-on-surface antialiased rtl overflow-hidden relative print:block print:bg-white print:text-black print:m-0 print:p-0 print:h-auto">
        <div className="print:hidden">
          <Sidebar activePath="/invoices" />
        </div>

        {/* Ambient Background - Hidden in print */}
        <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10 opacity-50 print:hidden"></div>
        <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none -z-10 opacity-30 print:hidden"></div>

        <main className="flex-1 flex flex-col h-screen pt-4 relative z-10 overflow-y-auto overflow-x-hidden print:overflow-visible print:p-0 print:block">

          {/* Action Bar - Hidden in print */}
          <div className="px-gutter mb-6 flex justify-between items-center print:hidden">
            <button
              onClick={() => navigate('/invoices')}
              className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-body-md text-body-md"
            >
              <Icon name="arrow_forward" className="text-xl" />
              العودة للفواتير
            </button>

            <button
              onClick={() => handlePrint()}
              className="flex items-center gap-2 bg-primary text-[#1A1D23] px-6 py-2.5 rounded-lg font-headline-md text-headline-md font-bold hover:bg-primary-fixed transition-colors shadow-lg ambient-glow"
            >
              <Icon name="print" />
              طباعة الفاتورة
            </button>
          </div>

          {/* Printable Area */}
          <div className="px-gutter pb-12 flex justify-center print:p-0 print:m-0 print:block">

            {/* The Invoice Document */}
            <div
              ref={componentRef}
              className="glass-panel rounded-2xl w-full max-w-[800px] p-8 md:p-12 relative overflow-hidden print:shadow-none print:border-none print:bg-transparent print:rounded-none print:w-full print:max-w-none print:p-8"
              style={{ minHeight: '800px' }}
            >
              {/* Document Watermark (Optional, hidden on print for clarity or styled differently) */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none print:hidden">
                <Icon name="diamond" className="text-[400px]" />
              </div>

              {/* Header */}
              <div className="flex justify-between items-start border-b border-white/10 print:border-gray-300 pb-8 mb-8">
                <div>
                  <h1 className="font-headline-lg text-headline-lg font-bold text-primary print:text-black mb-1">
                    بورصة الجعبيري
                  </h1>
                  <p className="font-body-sm text-body-sm text-on-surface-variant print:text-gray-600">
                    نظام الإدارة الفاخرة ونقاط البيع
                  </p>
                </div>
                <div className="text-left">
                  <h2 className="font-headline-md text-headline-md font-bold text-on-surface print:text-black tracking-widest">
                    {isSale ? 'فاتورة مبيعات' : 'فاتورة مشتريات'}
                  </h2>
                  <div className="font-data-mono text-data-mono text-on-surface-variant mt-2 print:text-gray-700">
                    #{invoiceData.id.split('-')[0]}
                  </div>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-8 mb-10">
                <div>
                  <h3 className="font-label-caps text-label-caps text-on-surface-variant print:text-gray-500 mb-2">إصدار إلى:</h3>
                  <div className="font-body-lg text-body-lg font-bold text-on-surface print:text-black">
                    {invoiceData.customers_suppliers?.name || 'عميل عام (نقدي)'}
                  </div>
                </div>
                <div className="text-left">
                  <h3 className="font-label-caps text-label-caps text-on-surface-variant print:text-gray-500 mb-2">تفاصيل الإصدار:</h3>
                  <div className="font-data-mono text-data-mono text-on-surface print:text-black">
                    <span className="text-on-surface-variant print:text-gray-600 ml-2">التاريخ:</span>
                    {invoiceDate}
                  </div>
                  <div className="font-data-mono text-data-mono text-on-surface print:text-black mt-1">
                    <span className="text-on-surface-variant print:text-gray-600 ml-2">طريقة الدفع:</span>
                    {invoiceData.payment_type === 'credit' ? 'آجل' : 'فوري (نقدي)'}
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="mb-10">
                <table className="w-full text-right border-collapse">
                  <thead>
                    <tr className="border-b-2 border-white/20 print:border-gray-400">
                      <th className="py-3 px-2 font-label-caps text-label-caps text-on-surface-variant print:text-gray-600">#</th>
                      <th className="py-3 px-2 font-label-caps text-label-caps text-on-surface-variant print:text-gray-600">الصنف</th>
                      <th className="py-3 px-2 font-label-caps text-label-caps text-on-surface-variant print:text-gray-600 text-center">الكمية</th>
                      <th className="py-3 px-2 font-label-caps text-label-caps text-on-surface-variant print:text-gray-600 text-left">السعر (ج.م)</th>
                      <th className="py-3 px-2 font-label-caps text-label-caps text-on-surface-variant print:text-gray-600 text-left">الإجمالي</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoiceData.items?.map((item, index) => (
                      <tr key={index} className="border-b border-white/5 print:border-gray-200">
                        <td className="py-4 px-2 font-data-mono text-data-mono text-on-surface-variant print:text-gray-600">{index + 1}</td>
                        <td className="py-4 px-2">
                          <div className="font-body-md text-body-md font-bold text-on-surface print:text-black">{item.products?.name || 'صنف غير معروف'}</div>
                          <div className="font-data-mono text-xs text-on-surface-variant print:text-gray-500">SKU: {item.products?.sku || '---'}</div>
                        </td>
                        <td className="py-4 px-2 font-data-mono text-data-mono text-on-surface print:text-black text-center">
                          {formatStock(item.quantity)}
                        </td>
                        <td className="py-4 px-2 font-data-mono text-data-mono text-on-surface print:text-black text-left">
                          {Number(item.unit_price).toFixed(2)}
                        </td>
                        <td className="py-4 px-2 font-data-mono text-data-mono font-bold text-primary print:text-black text-left">
                          {Number(item.total_price).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals Section */}
              <div className="flex justify-end">
                <div className="w-full max-w-[300px]">
                  <div className="flex justify-between items-center py-2 border-b border-white/5 print:border-gray-200">
                    <span className="font-body-md text-body-md text-on-surface-variant print:text-gray-600">المجموع الفرعي:</span>
                    <span className="font-data-mono text-data-mono text-on-surface print:text-black">{Number(invoiceData.total_amount).toFixed(2)} ج.م</span>
                  </div>
                  <div className="flex justify-between items-center py-4 mt-2">
                    <span className="font-headline-md text-headline-md font-bold text-on-surface print:text-black">الإجمالي الكلي:</span>
                    <span className="font-headline-lg-mobile text-headline-lg-mobile font-bold font-data-mono text-primary print:text-black">
                      {Number(invoiceData.total_amount).toFixed(2)} <span className="text-sm">ج.م</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="absolute bottom-8 left-12 right-12 text-center border-t border-white/10 print:border-gray-300 pt-6">
                <p className="font-body-sm text-body-sm text-on-surface-variant print:text-gray-500">
                  شكراً لتعاملكم معنا. نتمنى لكم يوماً سعيداً.
                </p>
              </div>

            </div>
          </div>
        </main>
      </div>
    </>
  );
}
