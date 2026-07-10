import React, { useState } from 'react';
import Icon from '../../../shared/components/ui/Icon';
import { EGGS_PER_CARTON, formatStock } from '../../../shared/utils/stockUtils';

export default function InvoiceCartPanel({
  cart,
  setCart,
  products,
  productsLoading,
  subtotal,
  grandTotal,
  onConfirm,
  onCancel,
  isSubmitting,
  invoiceType,
  paymentType,
  paidAmount,
  setPaidAmount
}) {
  const handleAddProduct = (product) => {
    const existingIndex = cart.findIndex(item => item.product_id === product.id);
    const defaultPrice = Number(invoiceType === 'purchase' ? product.cost_price : product.sale_price) || 0;
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
          stock_quantity: Number(product.stock_quantity) || 0,
          quantity: EGGS_PER_CARTON, // Default to 1 Carton
          unit_price: defaultPrice,
          total_price: defaultPrice
        }
      ]);
    }
  };

  const handleUpdateUnits = (index, deltaCartons, deltaEggs) => {
    const newCart = [...cart];
    let currentQty = newCart[index].quantity;
    const newQty = currentQty + (deltaCartons * EGGS_PER_CARTON) + deltaEggs;

    if (newQty <= 0) {
      handleRemoveItem(index);
      return;
    }

    newCart[index].quantity = newQty;
    const cartonPrice = newCart[index].unit_price;
    const eggPrice = cartonPrice / EGGS_PER_CARTON;
    const totalCartons = Math.floor(newQty / EGGS_PER_CARTON);
    const totalEggs = newQty % EGGS_PER_CARTON;
    newCart[index].total_price = (totalCartons * cartonPrice) + (totalEggs * eggPrice);

    setCart(newCart);
  };

  const handleSetUnits = (index, inputCartons, inputEggs) => {
    const c = Number(inputCartons) || 0;
    const e = Number(inputEggs) || 0;

    // Smart formatting handles if user types 35 in eggs -> auto formats to 1 carton 5 eggs via absolute quantity logic
    const absoluteQty = (c * EGGS_PER_CARTON) + e;

    if (absoluteQty <= 0) {
      handleRemoveItem(index);
      return;
    }

    const newCart = [...cart];
    newCart[index].quantity = absoluteQty;
    const cartonPrice = newCart[index].unit_price;
    const eggPrice = cartonPrice / EGGS_PER_CARTON;
    const totalCartons = Math.floor(absoluteQty / EGGS_PER_CARTON);
    const totalEggs = absoluteQty % EGGS_PER_CARTON;
    newCart[index].total_price = (totalCartons * cartonPrice) + (totalEggs * eggPrice);

    setCart(newCart);
  };

  const handleUpdatePrice = (index, newPrice) => {
    const newCart = [...cart];
    const cartonPrice = Number(newPrice);
    newCart[index].unit_price = cartonPrice;

    const eggPrice = cartonPrice / EGGS_PER_CARTON;
    const totalCartons = Math.floor(newCart[index].quantity / EGGS_PER_CARTON);
    const totalEggs = newCart[index].quantity % EGGS_PER_CARTON;

    newCart[index].total_price = (totalCartons * cartonPrice) + (totalEggs * eggPrice);
    setCart(newCart);
  };

  const handleRemoveItem = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const hasAnyStockError = invoiceType === 'sale' && cart.some(item => item.quantity > item.stock_quantity);

  return (
    <div className="w-full flex flex-col gap-stack-md h-full relative z-10">

      {/* Product Choices */}
      <div className="space-y-2 mb-2">
        <label className="block font-label-caps text-label-caps text-on-surface-variant">اختر الأصناف للإضافة</label>
        {productsLoading ? (
          <div className="text-on-surface-variant text-body-md">جاري تحميل الأصناف...</div>
        ) : (
          <div className="flex flex-wrap gap-2 max-h-[140px] overflow-y-auto custom-scrollbar p-1">
            {(products || []).map(product => {
              const inCart = cart.some(item => item.product_id === product.id);
              return (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => handleAddProduct(product)}
                  className={`px-4 py-2.5 rounded-xl border text-right transition-all duration-200 flex flex-col justify-between min-w-[130px] flex-1 sm:flex-none ${
                    inCart
                      ? 'bg-primary-container/20 border-primary text-primary shadow-[0_0_12px_rgba(212,175,55,0.15)] font-bold'
                      : 'bg-surface-container-low hover:bg-surface-container border-white/5 text-on-surface hover:border-white/10'
                  }`}
                >
                  <span className="font-body-md text-sm leading-snug">{product.name}</span>
                  <div className="flex justify-between items-center mt-1.5 w-full gap-2">
                    <span className="text-[10px] text-on-surface-variant font-data-mono">SKU: {product.sku}</span>
                    <span className="text-xs font-data-mono font-bold text-secondary">
                      {Number(invoiceType === 'purchase' ? product.cost_price : product.sale_price).toFixed(2)} ج.م
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Cart Table */}
      <div className="w-full overflow-x-auto hide-scrollbar glass-panel rounded-xl flex-1 flex flex-col shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
        <table className="w-full text-right border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-surface-container-low/50 border-b border-white/5">
              <th className="py-3 px-4 font-label-caps text-label-caps text-on-surface-variant font-medium w-12">#</th>
              <th className="py-3 px-4 font-label-caps text-label-caps text-on-surface-variant font-medium text-right">الصنف</th>
              <th className="py-3 px-4 font-label-caps text-label-caps text-on-surface-variant font-medium text-right w-32">الكمية (كرتونة / بيضة)</th>
              <th className="py-3 px-4 font-label-caps text-label-caps text-on-surface-variant font-medium text-right w-32">سعر الكرتونة (ج.م)</th>
              <th className="py-3 px-4 font-label-caps text-label-caps text-on-surface-variant font-medium text-right w-32">الإجمالي</th>
              <th className="py-3 px-4 w-12"></th>
            </tr>
          </thead>
          <tbody>
            {cart.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-12 text-center text-on-surface-variant">السلة فارغة. اختر أصنافاً لإضافتها.</td>
              </tr>
            ) : (
              cart.map((item, index) => {
                const hasError = invoiceType === 'sale' && item.quantity > item.stock_quantity;
                return (
                  <tr key={index} className={`border-b border-white/5 transition-colors group ${hasError ? 'bg-glow-error' : 'table-row-hover hover:bg-surface-container-high/40'}`}>
                    <td className="py-3 px-4 font-data-mono text-data-mono text-on-surface-variant">{index + 1}</td>
                    <td className="py-3 px-4">
                      <div className="font-body-md text-body-md font-medium text-on-surface">{item.name}</div>
                      <div className="font-data-mono text-data-mono text-on-surface-variant/70 text-[11px]">SKU: {item.sku}</div>
                      {hasError && (
                        <div className="text-error text-xs font-bold mt-1">
                          الكمية المطلوبة ({formatStock(item.quantity)}) غير متوفرة (المتاح: {formatStock(item.stock_quantity)})
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className={`flex flex-col gap-2 rounded-lg p-2 transition-colors ${hasError ? 'bg-glow-error border border-error/20' : 'bg-surface-container-highest/30 border border-white/5'}`}>

                        {/* Cartons Input */}
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[11px] font-label-caps text-on-surface-subtle w-10">كرتونة</span>
                          <div className="flex bg-surface-container-low rounded-md overflow-hidden border border-white/5">
                            <button onClick={() => handleUpdateUnits(index, 1, 0)} className="w-7 h-7 flex items-center justify-center text-on-surface-variant hover:bg-primary/20 hover:text-primary transition-colors">
                              <Icon name="add" className="text-[14px]" />
                            </button>
                            <input
                              type="number"
                              min="0"
                              value={Math.floor(item.quantity / EGGS_PER_CARTON)}
                              onChange={(e) => handleSetUnits(index, e.target.value, item.quantity % EGGS_PER_CARTON)}
                              className="font-data-mono text-data-mono w-10 text-center bg-transparent border-none focus:ring-0 p-0 text-on-surface [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                            <button onClick={() => handleUpdateUnits(index, -1, 0)} className="w-7 h-7 flex items-center justify-center text-on-surface-variant hover:bg-error/20 hover:text-error transition-colors">
                              <Icon name="remove" className="text-[14px]" />
                            </button>
                          </div>
                        </div>

                        {/* Eggs Input */}
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[11px] font-label-caps text-on-surface-subtle w-10">بيضة</span>
                          <div className="flex bg-surface-container-low rounded-md overflow-hidden border border-white/5">
                            <button onClick={() => handleUpdateUnits(index, 0, 1)} className="w-7 h-7 flex items-center justify-center text-on-surface-variant hover:bg-primary/20 hover:text-primary transition-colors">
                              <Icon name="add" className="text-[14px]" />
                            </button>
                            <input
                              type="number"
                              min="0"
                              value={item.quantity % EGGS_PER_CARTON}
                              onChange={(e) => handleSetUnits(index, Math.floor(item.quantity / EGGS_PER_CARTON), e.target.value)}
                              className="font-data-mono text-data-mono w-10 text-center bg-transparent border-none focus:ring-0 p-0 text-on-surface [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                            <button onClick={() => handleUpdateUnits(index, 0, -1)} className="w-7 h-7 flex items-center justify-center text-on-surface-variant hover:bg-error/20 hover:text-error transition-colors">
                              <Icon name="remove" className="text-[14px]" />
                            </button>
                          </div>
                        </div>

                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unit_price}
                        onChange={(e) => handleUpdatePrice(index, e.target.value)}
                        className="w-full bg-surface-container-low border border-white/5 text-on-surface rounded-md py-1.5 px-2 font-data-mono text-data-mono text-right focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all shadow-inner"
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
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Totals & Action Bar */}
      <div className="glass-panel rounded-xl p-stack-md flex flex-col md:flex-row justify-between items-end gap-stack-lg border-t-2 border-primary/20">
        <div className="w-full md:w-1/2 flex flex-col gap-2">
          <div className="flex justify-between items-center text-on-surface-variant">
            <span className="font-body-md text-body-md">المجموع الفرعي:</span>
            <span className="font-data-mono text-data-mono">{subtotal.toFixed(2)} ج.م</span>
          </div>

          <div className="h-px bg-white/10 my-1 w-full"></div>
          <div className="flex justify-between items-center text-primary">
            <span className="font-headline-md text-headline-md font-bold">الإجمالي الكلي:</span>
            <span className="font-headline-lg-mobile text-headline-lg-mobile font-bold font-data-mono">{grandTotal.toFixed(2)} ج.م</span>
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
                  <span className="text-on-surface-variant text-sm">ج.م</span>
                </div>
              </div>
              <div className="flex justify-between items-center text-error mt-2">
                <span className="font-body-md text-body-md font-bold">المتبقي الآجل:</span>
                <span className="font-data-mono text-data-mono font-bold">{(grandTotal - Number(paidAmount || 0)).toFixed(2)} ج.م</span>
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
            disabled={isSubmitting || cart.length === 0 || hasAnyStockError}
            className={`flex-1 md:flex-none px-12 py-4 rounded-lg font-headline-md text-headline-md font-bold transition-colors shadow-lg ambient-glow flex items-center justify-center gap-2 ${isSubmitting || cart.length === 0 || hasAnyStockError
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
