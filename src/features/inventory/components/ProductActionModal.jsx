import React, { useState, useEffect } from 'react';
import Icon from '../../../shared/components/ui/Icon';

export default function ProductActionModal({ isOpen, onClose, onSubmit, initialData }) {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    sale_price: '',
    cost_price: '',
    stock_quantity: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        sku: initialData.sku || '',
        category: initialData.category || '',
        sale_price: initialData.sale_price || '',
        cost_price: initialData.cost_price || '',
        stock_quantity: initialData.stock_quantity || ''
      });
    } else {
      setFormData({ name: '', sku: '', category: '', sale_price: '', cost_price: '', stock_quantity: '' });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit({
        ...formData,
        sale_price: Number(formData.sale_price),
        cost_price: Number(formData.cost_price),
        stock_quantity: Number(formData.stock_quantity)
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg glass-panel rounded-xl shadow-2xl border border-white/10 flex flex-col overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-surface-container-low/50">
          <h2 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
            <Icon name={initialData ? "edit" : "add_box"} className="text-primary" />
            {initialData ? 'تعديل بيانات المنتج' : 'إضافة منتج جديد'}
          </h2>
          <button onClick={onClose} className="text-on-surface-variant hover:text-error transition-colors p-1">
            <Icon name="close" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1.5">اسم المنتج</label>
              <input name="name" value={formData.name} onChange={handleChange} required type="text" className="w-full bg-surface-container-lowest border border-surface-variant rounded-md px-3 py-2 text-on-surface font-body-md focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
            </div>
            <div>
              <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1.5">SKU</label>
              <input name="sku" value={formData.sku} onChange={handleChange} required type="text" className="w-full bg-surface-container-lowest border border-surface-variant rounded-md px-3 py-2 text-on-surface font-data-mono focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
            </div>
            <div>
              <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1.5">الفئة</label>
              <input name="category" value={formData.category} onChange={handleChange} required type="text" className="w-full bg-surface-container-lowest border border-surface-variant rounded-md px-3 py-2 text-on-surface font-body-md focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
            </div>
            <div>
              <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1.5">سعر البيع</label>
              <input name="sale_price" value={formData.sale_price} onChange={handleChange} required min="0" step="0.01" type="number" className="w-full bg-surface-container-lowest border border-surface-variant rounded-md px-3 py-2 text-on-surface font-data-mono focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
            </div>
            <div>
              <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1.5">سعر الشراء</label>
              <input name="cost_price" value={formData.cost_price} onChange={handleChange} required min="0" step="0.01" type="number" className="w-full bg-surface-container-lowest border border-surface-variant rounded-md px-3 py-2 text-on-surface font-data-mono focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
            </div>
            <div className="col-span-2">
              <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1.5">المخزون الافتتاحي</label>
              <input name="stock_quantity" value={formData.stock_quantity} onChange={handleChange} required min="0" type="number" disabled={!!initialData} className="w-full bg-surface-container-lowest border border-surface-variant rounded-md px-3 py-2 text-on-surface font-data-mono focus:border-primary focus:ring-1 focus:ring-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed" />
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 flex gap-3">
            <button type="submit" disabled={isSubmitting} className="flex-1 bg-primary text-on-primary py-2.5 rounded-lg font-body-md font-bold hover:bg-primary-fixed transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              <Icon name="save" className="text-[20px]" />
              {isSubmitting ? 'جارٍ الحفظ...' : 'حفظ المنتج'}
            </button>
            <button type="button" onClick={onClose} disabled={isSubmitting} className="px-6 border border-white/10 hover:bg-white/5 text-on-surface-variant py-2.5 rounded-lg font-body-md transition-colors">
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
