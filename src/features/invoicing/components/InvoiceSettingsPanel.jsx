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
    <div className="w-full glass-panel rounded-xl flex flex-col h-full overflow-y-auto border border-white/5 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
      <div className="p-4 border-b border-white/5 flex justify-between items-center bg-surface-container-low/30 backdrop-blur-md">
        <h2 className="font-headline-md text-headline-md font-bold text-primary">تفاصيل الفاتورة</h2>
        <span className="font-data-mono text-data-mono bg-primary/20 text-primary px-2 rounded-full">جديدة</span>
      </div>

      <div className="p-6 flex-1 flex flex-col gap-6">

        {/* Invoice Type Toggle */}
        <div className="flex bg-surface-container-highest rounded-xl p-1 border border-white/5 relative shadow-inner">
          <button
            onClick={() => {
              setInvoiceType('sale');
              setSelectedEntityId('');
            }}
            className={`flex-1 py-2 text-center rounded-lg font-body-md text-body-md font-bold transition-all z-10 ${invoiceType === 'sale' ? 'bg-primary text-on-primary shadow-md' : 'text-on-surface-variant hover:text-on-surface'}`}
          >
            فاتورة بيع
          </button>
          <button
            onClick={() => {
              setInvoiceType('purchase');
              setSelectedEntityId('');
            }}
            className={`flex-1 py-2 text-center rounded-lg font-body-md text-body-md font-bold transition-all z-10 ${invoiceType === 'purchase' ? 'bg-primary text-on-primary shadow-md' : 'text-on-surface-variant hover:text-on-surface'}`}
          >
            فاتورة شراء
          </button>
        </div>

        {/* Payment Type Segmented Control */}
        <div className="flex bg-surface-container-highest rounded-xl p-1 border border-white/5 relative shadow-inner">
          <button
            onClick={() => setPaymentType('cash')}
            className={`flex-1 py-2 text-center rounded-lg font-body-md text-body-md font-bold transition-all z-10 ${paymentType === 'cash' ? 'bg-secondary text-on-secondary shadow-md' : 'text-on-surface-variant hover:text-on-surface'}`}
          >
            نقدي (فوري)
          </button>
          <button
            onClick={() => setPaymentType('credit')}
            className={`flex-1 py-2 text-center rounded-lg font-body-md text-body-md font-bold transition-all z-10 ${paymentType === 'credit' ? 'bg-secondary text-on-secondary shadow-md' : 'text-on-surface-variant hover:text-on-surface'}`}
          >
            آجل (ذمم)
          </button>
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
              className="w-full bg-surface-container-low border border-white/5 text-on-surface rounded-xl py-3 px-4 font-body-md text-body-md appearance-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all hover:bg-surface-container/80"
            >
              <option value="">
                {paymentType === 'cash' ? (invoiceType === 'sale' ? 'عميل نقدي عام' : 'مورد نقدي عام') : 'اختر جهة...'}
              </option>
              {entitiesLoading ? (
                <option disabled>جاري التحميل...</option>
              ) : (
                filteredEntities.map(entity => (
                  <option key={entity.id} value={entity.id}>
                    {entity.name} {entity.phone ? `(${entity.phone})` : ''}
                  </option>
                ))
              )}
            </select>
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
              expand_more
            </span>
          </div>
        </div>

        {/* Date & Reference */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="font-label-caps text-label-caps text-on-surface-variant">تاريخ الفاتورة</label>
            <div className="relative">
              <input
                type="date"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
                className="w-full bg-surface-container-low border border-white/5 text-on-surface rounded-xl py-3 px-4 font-data-mono text-data-mono focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all [color-scheme:dark]"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-label-caps text-label-caps text-on-surface-variant">المرجع</label>
            <input
              type="text"
              placeholder="اختياري"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              className="w-full bg-surface-container-low border border-white/5 text-on-surface rounded-xl py-3 px-4 font-body-md text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all placeholder-on-surface-variant/50"
            />
          </div>
        </div>

        {/* Notes */}
        <div className="flex flex-col gap-2">
          <label className="font-label-caps text-label-caps text-on-surface-variant">ملاحظات</label>
          <textarea
            rows="3"
            placeholder="أضف ملاحظات الفاتورة هنا..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-surface-container-low border border-white/5 text-on-surface rounded-xl py-3 px-4 font-body-md text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all placeholder-on-surface-variant/50 resize-none"
          ></textarea>
        </div>

      </div>
    </div>
  );
}
