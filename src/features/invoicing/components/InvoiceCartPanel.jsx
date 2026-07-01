import React, { useState } from 'react';
import Icon from '../../../shared/components/ui/Icon';

export default function InvoiceCartPanel({
  cart,
  setCart,
  products,
  productsLoading,
  subtotal,
  tax,
  grandTotal,
  onConfirm,
  onCancel,
  isSubmitting,
  paymentType,
  paidAmount,
  setPaidAmount
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = products?.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.sku?.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 5) || []; // limit to 5 suggestions

  const handleAddProduct = (product) => {
    const existingIndex = cart.findIndex(item => item.product_id === product.id);
    if (existingIndex >= 0) {
      const newCart = [...cart];
      newCart[existingIndex].quantity += 1;
      newCart[existingIndex].total_price = newCart[existingIndex].quantity * newCart[existingIndex].unit_price;
      setCart(newCart);
    } else {
      setCart([
        ...cart,
        {
          product_id: product.id,
          name: product.name,
          sku: product.sku,
          quantity: 1,
          unit_price: Number(product.sale_price) || 0,
          total_price: Number(product.sale_price) || 0
        }
      ]);
    }
    setSearchQuery('');
  };

  const handleUpdateQuantity = (index, delta) => {
    const newCart = [...cart];
    const newQuantity = newCart[index].quantity + delta;
    if (newQuantity <= 0) {
      handleRemoveItem(index);
      return;
    }
    newCart[index].quantity = newQuantity;
    newCart[index].total_price = newQuantity * newCart[index].unit_price;
    setCart(newCart);
  };

  const handleSetQuantity = (index, newQuantity) => {
    const qty = Number(newQuantity);
    if (qty <= 0) {
      handleRemoveItem(index);
      return;
    }
    const newCart = [...cart];
    newCart[index].quantity = qty;
    newCart[index].total_price = qty * newCart[index].unit_price;
    setCart(newCart);
  };

  const handleUpdatePrice = (index, newPrice) => {
    const newCart = [...cart];
    newCart[index].unit_price = Number(newPrice);
    newCart[index].total_price = newCart[index].quantity * Number(newPrice);
    setCart(newCart);
  };

  const handleRemoveItem = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full lg:w-2/3 flex flex-col gap-stack-md h-full relative z-10">
      
      {/* Search & Quick Add */}
      <div className="relative z-20">
        <div className="relative">
          <Icon name="search" className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="البحث عن صنف لضافته (الاسم أو SKU)..."
            className="w-full bg-surface-container border border-white/10 rounded-xl py-3 pr-10 pl-4 text-on-surface focus:outline-none focus:border-primary transition-colors font-body-md text-body-md"
          />
        </div>
        
        {searchQuery && (
          <div className="absolute top-full mt-2 w-full bg-surface-container-high border border-white/10 rounded-xl shadow-2xl overflow-hidden">
            {productsLoading ? (
              <div className="p-4 text-center text-on-surface-variant">جاري التحميل...</div>
            ) : filteredProducts.length === 0 ? (
              <div className="p-4 text-center text-on-surface-variant">لا توجد نتائج مطابقة</div>
            ) : (
              <ul className="divide-y divide-white/5">
                {filteredProducts.map(product => (
                  <li key={product.id}>
                    <button
                      onClick={() => handleAddProduct(product)}
                      className="w-full text-right p-3 hover:bg-white/5 transition-colors flex justify-between items-center group"
                    >
                      <div>
                        <div className="font-body-md text-body-md font-bold text-on-surface group-hover:text-primary transition-colors">{product.name}</div>
                        <div className="font-data-mono text-data-mono text-xs text-on-surface-variant">SKU: {product.sku}</div>
                      </div>
                      <div className="font-data-mono text-data-mono text-secondary font-bold">
                        {Number(product.sale_price).toFixed(2)} ر.س
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Cart Table */}
      <div className="glass-panel rounded-xl flex-1 overflow-hidden flex flex-col border border-white/5 shadow-2xl">
        <div className="overflow-x-auto custom-scrollbar flex-1">
          <table className="w-full text-right border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-surface-container-low/50 border-b border-white/5">
                <th className="py-3 px-4 font-label-caps text-label-caps text-on-surface-variant font-medium w-12">#</th>
                <th className="py-3 px-4 font-label-caps text-label-caps text-on-surface-variant font-medium text-right">الصنف</th>
                <th className="py-3 px-4 font-label-caps text-label-caps text-on-surface-variant font-medium text-center w-32">الكمية</th>
                <th className="py-3 px-4 font-label-caps text-label-caps text-on-surface-variant font-medium text-right w-32">السعر (ر.س)</th>
                <th className="py-3 px-4 font-label-caps text-label-caps text-on-surface-variant font-medium text-right w-32">الإجمالي</th>
                <th className="py-3 px-4 w-12"></th>
              </tr>
            </thead>
            <tbody>
              {cart.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-on-surface-variant">السلة فارغة. ابحث عن أصناف لإضافتها.</td>
                </tr>
              ) : (
                cart.map((item, index) => (
                  <tr key={index} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                    <td className="py-3 px-4 font-data-mono text-data-mono text-on-surface-variant">{index + 1}</td>
                    <td className="py-3 px-4">
                      <div className="font-body-md text-body-md font-medium text-on-surface">{item.name}</div>
                      <div className="font-data-mono text-data-mono text-on-surface-variant/70 text-[11px]">SKU: {item.sku}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-2 bg-[#0A0B0D] rounded-md border border-white/10 p-1">
                        <button onClick={() => handleUpdateQuantity(index, 1)} className="w-6 h-6 rounded flex items-center justify-center text-on-surface-variant hover:bg-white/10 hover:text-white transition-colors">
                          <Icon name="add" className="text-[16px]" />
                        </button>
                        <input 
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleSetQuantity(index, e.target.value)}
                          className="font-data-mono text-data-mono w-16 text-center bg-transparent border-none focus:ring-0 p-0 text-on-surface [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <button onClick={() => handleUpdateQuantity(index, -1)} className="w-6 h-6 rounded flex items-center justify-center text-on-surface-variant hover:bg-white/10 hover:text-white transition-colors">
                          <Icon name="remove" className="text-[16px]" />
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <input 
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unit_price}
                        onChange={(e) => handleUpdatePrice(index, e.target.value)}
                        className="w-full bg-surface-container border border-outline-variant text-on-surface rounded-md py-1.5 px-2 font-data-mono text-data-mono text-right focus:outline-none focus:border-primary transition-all"
                      />
                    </td>
                    <td className="py-3 px-4 font-data-mono text-data-mono font-medium text-primary text-right">
                      {item.total_price.toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      <button onClick={() => handleRemoveItem(index)} className="text-error/70 hover:text-error opacity-0 group-hover:opacity-100 transition-all">
                        <Icon name="delete" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Totals & Action Bar */}
      <div className="glass-panel rounded-xl p-stack-md flex flex-col md:flex-row justify-between items-end gap-stack-lg border-t-2 border-primary/20">
        <div className="w-full md:w-1/2 flex flex-col gap-2">
          <div className="flex justify-between items-center text-on-surface-variant">
            <span className="font-body-md text-body-md">المجموع الفرعي:</span>
            <span className="font-data-mono text-data-mono">{subtotal.toFixed(2)} ر.س</span>
          </div>

          <div className="h-px bg-white/10 my-1 w-full"></div>
          <div className="flex justify-between items-center text-primary">
            <span className="font-headline-md text-headline-md font-bold">الإجمالي الكلي:</span>
            <span className="font-headline-lg-mobile text-headline-lg-mobile font-bold font-data-mono">{grandTotal.toFixed(2)} ر.س</span>
          </div>

          {paymentType === 'credit' && (
            <>
              <div className="flex justify-between items-center text-on-surface mt-2">
                <span className="font-body-md text-body-md">الدفعة المقدمة (المدفوع):</span>
                <div className="flex items-center gap-2">
                  <input 
                    type="number"
                    min="0"
                    max={grandTotal}
                    step="0.01"
                    value={paidAmount}
                    onChange={(e) => setPaidAmount(e.target.value)}
                    className="w-32 bg-surface-container border border-outline-variant text-on-surface rounded-md py-1.5 px-2 font-data-mono text-data-mono text-right focus:outline-none focus:border-primary transition-all"
                  />
                  <span className="text-on-surface-variant text-sm">ر.س</span>
                </div>
              </div>
              <div className="flex justify-between items-center text-error mt-2">
                <span className="font-body-md text-body-md font-bold">المتبقي الآجل:</span>
                <span className="font-data-mono text-data-mono font-bold">{(grandTotal - Number(paidAmount || 0)).toFixed(2)} ر.س</span>
              </div>
            </>
          )}
        </div>
        <div className="w-full md:w-auto mt-auto flex gap-4">
          <button 
            onClick={onCancel}
            className="px-6 py-4 rounded-lg border border-white/10 text-on-surface hover:bg-white/5 transition-colors font-body-md text-body-md font-medium"
          >
            إلغاء
          </button>
          <button 
            onClick={onConfirm}
            disabled={isSubmitting || cart.length === 0}
            className={`flex-1 md:flex-none px-12 py-4 rounded-lg font-headline-md text-headline-md font-bold transition-colors shadow-lg ambient-glow flex items-center justify-center gap-2 ${
              isSubmitting || cart.length === 0 
                ? 'bg-surface-variant text-on-surface-variant cursor-not-allowed' 
                : 'bg-primary text-[#1A1D23] hover:bg-primary-fixed'
            }`}
          >
            <Icon name="check_circle" className="font-bold" />
            {isSubmitting ? 'جاري الحفظ...' : 'تأكيد الفاتورة'}
          </button>
        </div>
      </div>

    </div>
  );
}
