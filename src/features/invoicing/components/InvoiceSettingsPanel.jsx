import React from 'react';

export default function InvoiceSettingsPanel({
  invoiceType,
  setInvoiceType,
  paymentType,
  setPaymentType,
  selectedEntityId,
  setSelectedEntityId,
  reference,
  setReference,
  notes,
  setNotes,
  entities,
  entitiesLoading,
  invoiceDate,
  setInvoiceDate,
}) {
  const filteredEntities = entities?.filter(e => {
    if (invoiceType === 'sale') return e.type === 'customer';
    if (invoiceType === 'purchase') return e.type === 'supplier';
    return true;
  }) || [];

  return (
    <div className="w-full lg:w-1/3 glass-panel rounded-xl flex flex-col h-full overflow-y-auto border border-white/5 shadow-2xl">
      <div className="p-stack-md border-b border-white/5 flex justify-between items-center bg-surface-container-low/30">
        <h2 className="font-headline-md text-headline-md font-bold text-primary">تفاصيل الفاتورة</h2>
        {/* We can show a temporary ID or 'جديدة' here */}
        <span className="font-data-mono text-data-mono text-on-surface-variant">جديدة</span>
      </div>
      
      <div className="p-stack-md flex-1 flex flex-col gap-stack-md">
        
        {/* Invoice Type Toggle */}
        <div className="flex bg-surface-container-low rounded-lg p-1 border border-white/5">
          <button 
            onClick={() => {
              setInvoiceType('sale');
              setSelectedEntityId('');
            }}
            className={`flex-1 py-2 text-center rounded-md font-body-md text-body-md font-bold transition-all shadow-sm ${invoiceType === 'sale' ? 'bg-primary-container text-on-primary-container' : 'text-on-surface-variant hover:text-on-surface'}`}
          >
            فاتورة بيع
          </button>
          <button 
            onClick={() => {
              setInvoiceType('purchase');
              setSelectedEntityId('');
            }}
            className={`flex-1 py-2 text-center rounded-md font-body-md text-body-md font-bold transition-all shadow-sm ${invoiceType === 'purchase' ? 'bg-primary-container text-on-primary-container' : 'text-on-surface-variant hover:text-on-surface'}`}
          >
            فاتورة شراء
          </button>
        </div>

        {/* Payment Type Toggle */}
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="radio" 
              name="payment_type" 
              value="cash"
              checked={paymentType === 'cash'}
              onChange={(e) => setPaymentType(e.target.value)}
              className="text-primary focus:ring-primary bg-[#0A0B0D] border-outline-variant" 
            />
            <span className="font-body-md text-body-md text-on-surface">نقدي (فوري)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="radio" 
              name="payment_type" 
              value="credit"
              checked={paymentType === 'credit'}
              onChange={(e) => setPaymentType(e.target.value)}
              className="text-primary focus:ring-primary bg-[#0A0B0D] border-outline-variant" 
            />
            <span className="font-body-md text-body-md text-on-surface">آجل (ذمم)</span>
          </label>
        </div>

        {/* Entity Selection */}
        <div className="flex flex-col gap-2">
          <label className="font-label-caps text-label-caps text-on-surface-variant">
            {invoiceType === 'sale' ? 'العميل' : 'المورد'}
            {paymentType === 'credit' && <span className="text-error ml-1">*</span>}
          </label>
          <div className="relative">
            <select 
              value={selectedEntityId}
              onChange={(e) => setSelectedEntityId(e.target.value)}
              className="w-full bg-surface-container border border-outline-variant text-on-surface rounded-lg py-2.5 px-3 font-body-md text-body-md appearance-none focus:outline-none focus:border-primary transition-all"
            >
              <option value="">
                {paymentType === 'cash' ? (invoiceType === 'sale' ? 'عميل نقدي عام' : 'مورد نقدي عام') : 'اختر جهة...'}
              </option>
              {entitiesLoading ? (
                <option disabled>جاري التحميل...</option>
              ) : (
                filteredEntities.map(entity => (
                  <option key={entity.id} value={entity.id}>{entity.name}</option>
                ))
              )}
            </select>
          </div>
        </div>

        {/* Date & Ref */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="font-label-caps text-label-caps text-on-surface-variant">التاريخ</label>
            <input 
              type="date" 
              value={invoiceDate}
              onChange={(e) => setInvoiceDate(e.target.value)}
              className="w-full bg-surface-container border border-outline-variant text-on-surface rounded-lg py-2 px-3 font-data-mono text-data-mono focus:outline-none focus:border-primary transition-all" 
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-label-caps text-label-caps text-on-surface-variant">المرجع</label>
            <input 
              type="text" 
              placeholder="اختياري" 
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              className="w-full bg-surface-container border border-outline-variant text-on-surface rounded-lg py-2 px-3 font-body-md text-body-md focus:outline-none focus:border-primary transition-all" 
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 flex-1">
          <label className="font-label-caps text-label-caps text-on-surface-variant">ملاحظات</label>
          <textarea 
            placeholder="أضف ملاحظات الفاتورة هنا..." 
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-surface-container border border-outline-variant text-on-surface rounded-lg py-2 px-3 font-body-md text-body-md flex-1 resize-none focus:outline-none focus:border-primary transition-all"
          />
        </div>
      </div>
    </div>
  );
}
