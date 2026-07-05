import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Sidebar from '../../shared/components/layout/Sidebar';
import Icon from '../../shared/components/ui/Icon';
import InvoiceRow from './components/InvoiceRow';
import ConfirmDeleteModal from './components/ConfirmDeleteModal';
import { useGetInvoices, useDeleteInvoice } from './hooks/useInvoices';

export default function InvoicesListPage() {
  const navigate = useNavigate();
  const { invoices, loading, error, refetch } = useGetInvoices();
  const { executeDelete, isDeleting } = useDeleteInvoice();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all' | 'sale' | 'purchase'
  const [filterPayment, setFilterPayment] = useState('all'); // 'all' | 'cash' | 'credit'

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Toast notification state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Client-side filtering logic using useMemo
  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv => {
      // Search matching (Invoice ID or Customer Name)
      const matchesSearch = 
        inv.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (inv.customers_suppliers?.name || 'عميل عام').toLowerCase().includes(searchQuery.toLowerCase());
      
      // Type filtering
      const invoiceType = inv.invoice_type || 'sale'; // Default to sale if missing
      const matchesType = filterType === 'all' || invoiceType === filterType;

      // Payment filtering
      const paymentType = inv.payment_type || 'cash';
      const matchesPayment = filterPayment === 'all' || paymentType === filterPayment;

      return matchesSearch && matchesType && matchesPayment;
    });
  }, [invoices, searchQuery, filterType, filterPayment]);

  const handleViewInvoice = (id) => {
    navigate(`/invoices/${id}`);
  };

  const handleEditInvoice = (id) => {
    navigate(`/invoices/${id}/edit`);
  };

  const handleDeleteClick = (invoice) => {
    setDeleteTarget(invoice);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      await executeDelete(deleteTarget);
      setDeleteTarget(null);
      showToast('تم حذف الفاتورة واسترجاع المخزون بنجاح.', 'success');
      refetch();
    } catch (err) {
      const errorMessage = err?.message || 'خطأ غير معروف';
      showToast(`فشل حذف الفاتورة: ${errorMessage}`, 'error');
    }
  };

  const handleCancelDelete = () => {
    if (!isDeleting) {
      setDeleteTarget(null);
    }
  };

  return (
    <>
      <Helmet>
        <title>سجل الفواتير - الأتيليه التنفيذي</title>
        <meta name="description" content="إدارة وعرض جميع فواتير البيع والشراء" />
      </Helmet>

      {/* SideNavBar */}
      <Sidebar activePath="/invoices" />

      {/* Main Content */}
      <main className="pr-72 pt-12 pb-12 pl-margin-edge min-h-screen bg-background text-on-surface rtl font-body-md relative z-10">
        
        {/* Background Atmosphere */}
        <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] pointer-events-none -z-10"></div>
        <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>

        <div className="max-w-[1440px] mx-auto flex flex-col gap-stack-lg">
          
          {/* Header & Filters */}
          <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4">
            <div>
              <h1 className="font-headline-lg text-headline-lg text-on-surface mb-2 font-bold flex items-center gap-3">
                <Icon name="receipt_long" className="text-primary text-3xl" />
                سجل الفواتير
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant">
                عرض وإدارة جميع فواتير المبيعات والمشتريات الخاصة بالنظام
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <div className="relative flex-1 lg:flex-none min-w-[250px]">
                <Icon name="search" className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                <input
                  type="text"
                  placeholder="ابحث برقم الفاتورة أو اسم العميل..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-surface-container border border-white/10 rounded-xl py-2.5 pr-10 pl-4 text-on-surface focus:outline-none focus:border-primary transition-colors font-body-md text-body-md"
                />
              </div>

              <select 
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-surface-container border border-white/10 rounded-xl py-2.5 px-4 text-on-surface focus:outline-none focus:border-primary transition-colors font-body-md cursor-pointer"
              >
                <option value="all">كل الفواتير</option>
                <option value="sale">المبيعات فقط</option>
                <option value="purchase">المشتريات فقط</option>
              </select>

              <select 
                value={filterPayment}
                onChange={(e) => setFilterPayment(e.target.value)}
                className="bg-surface-container border border-white/10 rounded-xl py-2.5 px-4 text-on-surface focus:outline-none focus:border-primary transition-colors font-body-md cursor-pointer"
              >
                <option value="all">طرق الدفع</option>
                <option value="cash">فوري (نقدي)</option>
                <option value="credit">آجل</option>
              </select>
            </div>
          </header>

          {/* Invoices Data Grid */}
          <section className="glass-panel rounded-2xl flex flex-col overflow-hidden shadow-2xl border border-white/5">
            <div className="overflow-x-auto w-full">
              <table className="w-full text-right border-collapse whitespace-nowrap">
                <thead className="bg-surface-container-low/50">
                  <tr className="border-b border-white/5">
                    <th className="py-4 px-4 font-label-caps text-label-caps text-on-surface-variant font-medium">رقم الفاتورة</th>
                    <th className="py-4 px-4 font-label-caps text-label-caps text-on-surface-variant font-medium">التاريخ والوقت</th>
                    <th className="py-4 px-4 font-label-caps text-label-caps text-on-surface-variant font-medium">النوع</th>
                    <th className="py-4 px-4 font-label-caps text-label-caps text-on-surface-variant font-medium">الدفع</th>
                    <th className="py-4 px-4 font-label-caps text-label-caps text-on-surface-variant font-medium">الجهة</th>
                    <th className="py-4 px-4 font-label-caps text-label-caps text-on-surface-variant font-medium text-right">الإجمالي</th>
                    <th className="py-4 px-4 font-label-caps text-label-caps text-on-surface-variant font-medium w-16">إجراء</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    // Skeleton Loaders
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="border-b border-white/5">
                        <td className="py-4 px-4"><div className="h-4 w-20 bg-white/10 rounded animate-pulse"></div></td>
                        <td className="py-4 px-4"><div className="h-4 w-32 bg-white/10 rounded animate-pulse"></div></td>
                        <td className="py-4 px-4"><div className="h-5 w-12 bg-white/10 rounded-full animate-pulse"></div></td>
                        <td className="py-4 px-4"><div className="h-5 w-16 bg-white/10 rounded-full animate-pulse"></div></td>
                        <td className="py-4 px-4"><div className="h-4 w-32 bg-white/10 rounded-full animate-pulse"></div></td>
                        <td className="py-4 px-4"><div className="h-4 w-20 bg-white/10 rounded animate-pulse mr-auto"></div></td>
                        <td className="py-4 px-4"><div className="h-8 w-8 bg-white/10 rounded-full animate-pulse"></div></td>
                      </tr>
                    ))
                  ) : error ? (
                    <tr>
                      <td colSpan="7" className="py-12 text-center text-error">
                        <Icon name="error" className="text-4xl mb-2 opacity-50 block mx-auto" />
                        حدث خطأ أثناء تحميل الفواتير. يرجى المحاولة مرة أخرى.
                      </td>
                    </tr>
                  ) : filteredInvoices.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-16 text-center text-on-surface-variant">
                        <Icon name="receipt" className="text-5xl mb-3 opacity-20 block mx-auto" />
                        <div className="font-headline-md text-headline-md">لا توجد فواتير مطابقة لبحثك</div>
                      </td>
                    </tr>
                  ) : (
                    filteredInvoices.map((invoice) => (
                      <InvoiceRow 
                        key={invoice.id} 
                        invoice={invoice} 
                        onView={handleViewInvoice} 
                        onEdit={handleEditInvoice}
                        onDelete={handleDeleteClick}
                      />
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

        </div>
      </main>

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        invoice={deleteTarget}
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] px-6 py-3 rounded-xl shadow-2xl border backdrop-blur-md flex items-center gap-3 animate-[slideUp_300ms_ease-out] ${
          toast.type === 'success'
            ? 'bg-primary/20 border-primary/30 text-primary'
            : 'bg-error/20 border-error/30 text-error'
        }`}>
          <Icon
            name={toast.type === 'success' ? 'check_circle' : 'error'}
            className="text-xl"
          />
          <span className="font-body-md text-body-md font-medium">{toast.message}</span>
        </div>
      )}
    </>
  );
}
