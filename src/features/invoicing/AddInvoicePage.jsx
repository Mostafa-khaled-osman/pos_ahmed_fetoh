import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../shared/components/layout/Sidebar';
import InvoiceSettingsPanel from './components/InvoiceSettingsPanel';
import InvoiceCartPanel from './components/InvoiceCartPanel';
import { useSupabaseQuery } from '../../core/hooks/useSupabaseQuery';
import { fetchProducts, fetchEntities, insertInvoice, insertFinancialTransaction, updateProduct } from '../../core/supabase/api';
import { useActiveSession } from '../treasury/hooks/useTreasury';

export default function AddInvoicePage() {
  const navigate = useNavigate();
  const { session } = useActiveSession();

  // Data fetching
  const { data: products, loading: productsLoading } = useSupabaseQuery(fetchProducts);
  const { data: entities, loading: entitiesLoading } = useSupabaseQuery(fetchEntities);

  // Form State
  const [invoiceType, setInvoiceType] = useState('sale'); // 'sale' | 'purchase'
  const [paymentType, setPaymentType] = useState('cash'); // 'cash' | 'credit'
  const [selectedEntityId, setSelectedEntityId] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');
  const [paidAmount, setPaidAmount] = useState('');
  
  // Cart State
  const [cart, setCart] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculations
  const { subtotal, tax, grandTotal } = useMemo(() => {
    const sub = cart.reduce((acc, item) => acc + item.total_price, 0);
    const t = 0; // No VAT
    const grand = sub + t;
    return { subtotal: sub, tax: t, grandTotal: grand };
  }, [cart]);

  // Submission
  const handleConfirm = async () => {
    if (!session) {
      alert("لا يمكن إنشاء فاتورة لأنه لا توجد وردية مفتوحة حالياً. يرجى فتح وردية من شاشة الخزينة أولاً.");
      return;
    }

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
      
      const invoiceData = {
        session_id: session.id,
        customer_id: selectedEntityId || null,
        total_amount: grandTotal,
        payment_type: paymentType,
      };

      const invoiceItems = cart.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.total_price
      }));

      const invoice = await insertInvoice(invoiceData, invoiceItems);
      
      // Handle upfront partial payment for credit invoices
      if (paymentType === 'credit' && Number(paidAmount) > 0 && selectedEntityId) {
        await insertFinancialTransaction({
          session_id: session.id,
          entity_id: selectedEntityId,
          type: invoiceType === 'sale' ? 'receipt' : 'payment',
          amount: Number(paidAmount),
          notes: `دفعة مقدمة لفاتورة رقم ${invoice.id}`
        });
      }

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

      alert("تم حفظ الفاتورة بنجاح!");
      navigate('/'); // Redirect to POS or Dashboard after success
    } catch (err) {
      console.error('Failed to insert invoice:', err);
      alert("حدث خطأ أثناء حفظ الفاتورة. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (cart.length > 0) {
      if (window.confirm("هل أنت متأكد من إلغاء الفاتورة؟ سيتم مسح جميع البيانات المدخلة.")) {
        navigate('/');
      }
    } else {
      navigate('/');
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 mr-0 md:mr-64 h-screen bg-background text-on-surface antialiased rtl overflow-hidden relative">
      <Sidebar activePath="/add-invoice" />

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
            paymentType={paymentType}
            paidAmount={paidAmount}
            setPaidAmount={setPaidAmount}
          />

        </div>
      </main>
    </div>
  );
}
