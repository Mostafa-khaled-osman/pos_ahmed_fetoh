import React, { useState, useEffect } from 'react';
import Icon from '../../../shared/components/ui/Icon';

export default function EntityFormModal({ isOpen, onClose, onSubmit, initialData }) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'customer',
    phone: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        type: initialData.type || 'customer',
        phone: initialData.phone || '',
      });
    } else {
      setFormData({ name: '', type: 'customer', phone: '' });
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
      await onSubmit(formData);
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
      <div className="relative w-full max-w-md glass-panel rounded-xl shadow-2xl border border-white/10 flex flex-col overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-surface-container-low/50">
          <h2 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
            <Icon name={initialData ? "edit" : "person_add"} className="text-primary" />
            {initialData ? 'تعديل الملف الشخصي' : 'إضافة جهة جديدة'}
          </h2>
          <button onClick={onClose} className="text-on-surface-variant hover:text-error transition-colors p-1">
            <Icon name="close" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4 rtl">
          <div className="space-y-2">
            <label className="block font-label-caps text-label-caps text-on-surface-variant">الاسم</label>
            <input 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
              type="text" 
              className="w-full bg-surface-container-lowest border border-surface-variant rounded-md px-3 py-2 text-on-surface font-body-md focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
              placeholder="الاسم الكامل أو اسم الشركة..."
            />
          </div>

          <div className="space-y-2">
            <label className="block font-label-caps text-label-caps text-on-surface-variant">النوع</label>
            <div className="relative">
              <select 
                name="type" 
                value={formData.type} 
                onChange={handleChange} 
                required 
                className="w-full bg-surface-container-lowest border border-surface-variant rounded-md px-3 py-2 text-on-surface font-body-md focus:border-primary focus:ring-1 focus:ring-primary transition-all appearance-none"
              >
                <option value="customer">عميل</option>
                <option value="supplier">مورد</option>
              </select>
              <Icon name="arrow_drop_down" className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block font-label-caps text-label-caps text-on-surface-variant">رقم الهاتف</label>
            <input 
              name="phone" 
              value={formData.phone} 
              onChange={handleChange} 
              type="text" 
              className="w-full bg-surface-container-lowest border border-surface-variant rounded-md px-3 py-2 text-on-surface font-data-mono focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
              placeholder="01xxxxxxxxx"
            />
          </div>

          <div className="bg-primary-container/10 border border-primary/20 rounded-lg p-4 mt-4">
            <div className="flex items-center gap-2 mb-1 text-primary">
              <Icon name="info" className="text-[18px]" />
              <h4 className="font-label-caps text-label-caps font-bold">ملاحظة</h4>
            </div>
            <p className="font-body-sm text-sm text-on-surface-variant leading-relaxed">
              لا يمكن تعديل الرصيد يدوياً من هنا. الرصيد يتم احتسابه تلقائياً بناءً على حركات البيع، الشراء، المقبوضات، والمدفوعات.
            </p>
          </div>
          
          <div className="pt-4 border-t border-white/5 flex gap-3">
            <button type="submit" disabled={isSubmitting} className="flex-1 bg-primary text-on-primary py-2.5 rounded-lg font-body-md font-bold hover:bg-primary-fixed transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              <Icon name="save" className="text-[20px]" />
              {isSubmitting ? 'جارٍ الحفظ...' : 'حفظ'}
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
