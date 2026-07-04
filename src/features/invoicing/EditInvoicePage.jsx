import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../../shared/components/layout/Sidebar';
import InvoiceSettingsPanel from './components/InvoiceSettingsPanel';
import InvoiceCartPanel from './components/InvoiceCartPanel';
import { useSupabaseQuery } from '../../core/hooks/useSupabaseQuery';
import { fetchProducts, fetchEntities, updateInvoice, updateProduct } from '../../core/supabase/api';
import { useInvoiceDetails } from './hooks/useInvoices';

export default function EditInvoicePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Data fetching
  const { data: products, loading: productsLoading } = useSupabaseQuery(fetchProducts);
  const { data: entities, loading: entitiesLoading } = useSupabaseQuery(fetchEntities);
  const { invoiceData, loading: invoiceLoading } = useInvoiceDetails(id);

  // Form State
  const [invoiceType, setInvoiceType] = useState('sale');
  const [paymentType, setPaymentType] = useState('cash');
  const [selectedEntityId, setSelectedEntityId] = useState('');
  const [invoiceDate, setInvoiceDate] = useState('');
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');
  const [paidAmount, setPaidAmount] = useState(''); // We keep this for UI consistency, but editing payments is usually handled separately
  
  // Cart State
  const [cart, setCart] = useState([]);
  const [originalItems, setOriginalItems] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize state from existing invoice
  useEffect(() => {
    if (invoiceData) {
      setInvoiceType(invoiceData.invoice_type || 'sale');
      setPaymentType(invoiceData.payment_type || 'cash');
      setSelectedEntityId(invoiceData.customer_id || '');
      setInvoiceDate(invoiceData.created_at ? new Date(invoiceData.created_at).toISOString().split('T')[0] : '');
      // Setup cart with existing items
      const mappedItems = (invoiceData.items || []).map(item => ({
        id: item.id, // Important: retain the id so we can update it rather than insert
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.total_price,
        name: item.products?.name || 'صنف غير معروف',
        sku: item.products?.sku || ''
      }));
      setCart(mappedItems);
      setOriginalItems(mappedItems);
    }
  }, [invoiceData]);

  // Calculations
  const { subtotal, tax, grandTotal } = useMemo(() => {
    const sub = cart.reduce((acc, item) => acc + item.total_price, 0);
    const t = 0; // No VAT
    const grand = sub + t;
    return { subtotal: sub, tax: t, grandTotal: grand };
  }, [cart]);

  // Submission
  const handleConfirm = async () => {
    // Validation
    if (cart.length === 0) {
      alert("يرجى إضافة أصناف للفاتورة.");
      return;
    }
    if (paymentType === 'credit' && !selectedEntityId) {
      alert("يجب اختيار جهة (عميل/مورد) للفاتورة الآجلة.");
      return;
    }

    try {
      setIsSubmitting(true);
      
      const updatedData = {
        customer_id: selectedEntityId || null,
        total_amount: grandTotal,
        payment_type: paymentType,
        invoice_type: invoiceType,
      };

      const newItems = cart.map(item => ({
        id: item.id, // Might be undefined for newly added items, which is what we want!
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.total_price
      }));

      await updateInvoice(id, updatedData, originalItems, newItems);
      
      // Update cost_price on purchase invoices if changed
      if (invoiceType === 'purchase') {
        const updatePromises = cart.map(async (item) => {
          const originalProduct = products.find(p => p.id === item.product_id);
          if (originalProduct && Number(originalProduct.cost_price) !== Number(item.unit_price)) {
            return updateProduct(item.product_id, { cost_price: Number(item.unit_price) });
          }
        });
        await Promise.all(updatePromises.filter(Boolean));
      }

      alert("تم تعديل الفاتورة بنجاح!");
      navigate('/invoices'); 
    } catch (err) {
      console.error('Failed to update invoice:', err);
      alert("حدث خطأ أثناء تعديل الفاتورة. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm("هل أنت متأكد من إلغاء التعديلات؟")) {
      navigate('/invoices');
    }
  };

  const isPageLoading = productsLoading || entitiesLoading || invoiceLoading;

  if (isPageLoading) {
    return (
      <div className="flex-1 flex min-w-0 mr-0 md:mr-64 h-screen bg-background text-on-surface rtl relative">
        <Sidebar activePath="/invoices" />
        <main className="flex-1 p-gutter flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-on-surface-variant font-body-md text-body-md">جاري جلب بيانات الفاتورة...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 mr-0 md:mr-64 h-screen bg-background text-on-surface antialiased rtl overflow-hidden relative">
      <Sidebar activePath="/invoices" />

      {/* Atmospheric Background Element */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10 opacity-50"></div>
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none -z-10 opacity-30"></div>

      <main className="flex-1 flex flex-col h-screen pt-4 md:pt-0 relative z-10">
        <div className="flex-1 p-gutter overflow-hidden flex flex-col lg:flex-row gap-gutter">
          
          <InvoiceSettingsPanel 
            invoiceType={invoiceType}
            setInvoiceType={setInvoiceType}
            paymentType={paymentType}
            setPaymentType={setPaymentType}
            selectedEntityId={selectedEntityId}
            setSelectedEntityId={setSelectedEntityId}
            reference={reference}
            setReference={setReference}
            notes={notes}
            setNotes={setNotes}
            entities={entities}
            entitiesLoading={entitiesLoading}
            invoiceDate={invoiceDate}
            setInvoiceDate={setInvoiceDate}
            isEditMode={true} // Custom prop to lock certain fields if necessary
          />

          <InvoiceCartPanel 
            cart={cart}
            setCart={setCart}
            products={products}
            productsLoading={productsLoading}
            subtotal={subtotal}
            tax={tax}
            grandTotal={grandTotal}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
            invoiceType={invoiceType}
            paymentType={paymentType}
            paidAmount={paidAmount}
            setPaidAmount={setPaidAmount}
          />

        </div>
      </main>
    </div>
  );
}
