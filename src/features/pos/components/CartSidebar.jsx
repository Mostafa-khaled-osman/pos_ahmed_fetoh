import React from 'react';
import Icon from '../../../shared/components/ui/Icon';

export default function CartSidebar({ cart }) {
  const { items, subtotal, tax, grandTotal, updateQuantity, clearCart } = cart;

  const handleCheckout = () => {
    // Integrate with Supabase 'invoices'/'invoice_items' here later
    alert('جارٍ تأكيد البيع...');
    clearCart();
  };

  return (
    <aside className="w-full md:w-[400px] h-full flex flex-col border-r border-white/5 bg-surface-container/30 backdrop-blur-xl z-30">
      {/* Header */}
      <div className="p-stack-md border-b border-white/5 flex justify-between items-center bg-surface-container-low/50">
        <h2 className="font-headline-md text-headline-md flex items-center gap-2">
          <Icon name="receipt_long" className="text-primary-container" />
          الطلب الحالي
        </h2>
        <div className="text-xs font-data-mono text-on-surface-variant bg-surface-dim px-2 py-1 rounded">
          #ORD-8924
        </div>
      </div>

      {/* Cart Items List */}
      <div className="flex-1 overflow-y-auto p-stack-md flex flex-col gap-unit no-scrollbar" id="cart-items">
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-on-surface-variant opacity-50">
            <Icon name="shopping_cart" className="text-6xl mb-4" />
            <p>السلة فارغة</p>
          </div>
        ) : (
          items.map((item) => (
            <div key={item.product.id} className="bg-surface-bright/20 rounded-lg p-3 border border-white/5 flex justify-between items-center group">
              <div className="flex-1">
                <div className="font-body-md font-medium">{item.product.name}</div>
                <div className="font-data-mono text-xs text-on-surface-variant mt-1">
                  {item.product.price.toFixed(2)} ج.م x {item.quantity}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="font-data-mono font-medium text-primary-container">
                  {(item.product.price * item.quantity).toFixed(2)}
                </div>
                <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => updateQuantity(item.product.id, 1)}
                    className="w-6 h-6 rounded bg-surface hover:bg-surface-bright flex items-center justify-center text-xs"
                    aria-label="Increase quantity"
                  >
                    <Icon name="add" className="text-[16px]" />
                  </button>
                  <button
                    onClick={() => updateQuantity(item.product.id, -1)}
                    className="w-6 h-6 rounded bg-surface hover:bg-surface-bright flex items-center justify-center text-xs"
                    aria-label="Decrease quantity"
                  >
                    <Icon name="remove" className="text-[16px]" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Checkout Panel Bottom */}
      <div className="glass-panel p-stack-md mt-auto border-t border-white/10 rounded-t-2xl relative shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        {/* Totals */}
        <div className="flex flex-col gap-2 mb-6">
          <div className="flex justify-between text-on-surface-variant font-body-sm">
            <span>المجموع الفرعي</span>
            <span className="font-data-mono">{subtotal.toFixed(2)} ج.م</span>
          </div>
          <div className="flex justify-between text-on-surface-variant font-body-sm">
            <span>الضريبة (14%)</span>
            <span className="font-data-mono">{tax.toFixed(2)} ج.م</span>
          </div>
          <div className="flex justify-between items-end mt-2 pt-2 border-t border-white/10">
            <span className="font-headline-md text-headline-md">الإجمالي الكلي</span>
            <span className="font-data-mono text-3xl font-bold text-primary-container">
              {grandTotal.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button className="h-14 rounded-lg bg-primary-container text-[#0A0B0D] font-headline-md text-headline-md font-bold flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-[0_0_15px_rgba(212,175,55,0.3)]">
            <Icon name="payments" />
            دفع فوري
          </button>
          <button className="h-14 rounded-lg bg-[#1A1D23] border border-white/10 text-on-surface font-headline-md text-headline-md flex items-center justify-center gap-2 hover:bg-surface-bright transition-colors active:scale-95">
            <Icon name="credit_score" className="text-on-surface-variant" />
            آجل
          </button>
        </div>

        {/* Confirm Sale Button (Glowing) */}
        <button 
          onClick={handleCheckout}
          disabled={items.length === 0}
          className="w-full h-16 rounded-xl bg-surface border border-[#d4af37] text-primary-container font-headline-lg-mobile text-headline-lg-mobile font-bold mt-2 hover:bg-[#d4af37]/10 transition-all active:scale-95 flex items-center justify-center gap-3 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {/* Glow effect behind text */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#d4af37]/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
          <Icon name="check_circle" className="text-3xl" />
          تأكيد البيع
        </button>
      </div>
    </aside>
  );
}
