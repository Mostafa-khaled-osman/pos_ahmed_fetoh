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

    // Frontend Safety Net: Check stock availability for sales
    if (invoiceType === 'sale') {
      const outOfStockItem = cart.find(item => {
        const product = products.find(p => p.id === item.product_id);
        return product && item.quantity > product.stock_quantity;
      });

      if (outOfStockItem) {
        const product = products.find(p => p.id === outOfStockItem.product_id);
        alert(`لا يمكن إتمام البيع. الكمية المطلوبة من "${product?.name || 'الصنف'}" تتجاوز المخزون المتاح (${product?.stock_quantity || 0}).`);
        return;
      }
    }

    try {
      setIsSubmitting(true);

      const invoiceData = {
        session_id: session.id,
        customer_id: selectedEntityId || null,
        total_amount: grandTotal,
        payment_type: paymentType,
        invoice_type: invoiceType,
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

      // -------------------------------------------------------------
      // FRONTEND STOCK UPDATE (Fallback or Alternative to DB Trigger)
      // -------------------------------------------------------------
      const stockUpdatePromises = cart.map(async (item) => {
        const originalProduct = products.find(p => p.id === item.product_id);
        if (!originalProduct) return null;

        const currentStock = Number(originalProduct.stock_quantity || 0);
        const quantity = Number(item.quantity || 0);
        
        let newStock = currentStock;
        let updates = {};

        if (invoiceType === 'purchase') {
          newStock = currentStock + quantity;
          // Update cost price only if it changed during purchase
          if (Number(originalProduct.cost_price) !== Number(item.unit_price)) {
            updates.cost_price = Number(item.unit_price);
          }
        } else if (invoiceType === 'sale') {
          newStock = currentStock - quantity;
        }

        updates.stock_quantity = newStock;
        return updateProduct(item.product_id, updates);
      });

      await Promise.all(stockUpdatePromises.filter(Boolean));

      alert("تم حفظ الفاتورة بنجاح!");
      navigate('/'); // Redirect to POS or Dashboard after success
    } catch (err) {
      console.error('Failed to insert invoice:', err);
      const errorMessage = err?.message || err?.details || JSON.stringify(err);
      alert(`حدث خطأ أثناء حفظ الفاتورة. التفاصيل: ${errorMessage}`);
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
      <div className="fixed inset-y-0 right-0 z-50 hidden md:block">
        <Sidebar activePath="/add-invoice" />
      </div>

      {/* Atmospheric Background Element */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10 opacity-50"></div>
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none -z-10 opacity-30"></div>

      <main className="flex-1 flex flex-col h-screen pt-4 md:pt-0 relative z-10 w-full">
        <div className="flex-1 p-gutter overflow-y-auto lg:overflow-hidden flex flex-col lg:grid lg:grid-cols-12 gap-gutter w-full">

          <div className="w-full lg:col-span-4 flex flex-col">
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
          </div>

          <div className="w-full lg:col-span-8 flex flex-col h-full lg:overflow-hidden">
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

        </div>
      </main>
    </div>
  );
}
