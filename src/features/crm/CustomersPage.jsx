import React, { useState } from 'react';
import { useCRM, useFinancialTransaction } from './hooks/useCRM';
import { useActiveSession } from '../treasury/hooks/useTreasury';
import Sidebar from '../../shared/components/layout/Sidebar';
import Icon from '../../shared/components/ui/Icon';
import EntityTable from './components/EntityTable';
import EntityFormModal from './components/EntityFormModal';
import FinancialTransactionModal from './components/FinancialTransactionModal';

export default function CustomersPage() {
  const { entities, loading: entitiesLoading, addEntity, editEntity, removeEntity, refetch } = useCRM();
  const { session } = useActiveSession();
  const { processTransaction } = useFinancialTransaction(session?.id, refetch);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingEntity, setEditingEntity] = useState(null);

  const [isFinModalOpen, setIsFinModalOpen] = useState(false);
  const [finEntity, setFinEntity] = useState(null);
  const [finType, setFinType] = useState('receipt'); // 'receipt' or 'payment'

  // Profile Management
  const handleOpenAddForm = () => {
    setEditingEntity(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditForm = (entity) => {
    setEditingEntity(entity);
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = async (data) => {
    if (editingEntity) {
      await editEntity(editingEntity.id, data);
    } else {
      await addEntity(data);
    }
  };

  // Financial Management
  const handleOpenTransaction = (entity, type) => {
    if (!session) {
      alert("لا يمكن إجراء معاملات مالية لأنه لا توجد وردية مفتوحة حالياً. يرجى فتح وردية من شاشة إدارة الخزينة أولاً.");
      return;
    }
    setFinEntity(entity);
    setFinType(type);
    setIsFinModalOpen(true);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 mr-0 md:mr-64 h-screen">
      <Sidebar activePath="/customers" />
      
      <header className="fixed top-0 left-0 right-0 md:right-64 h-16 z-40 bg-surface-dim/60 backdrop-blur-2xl border-b border-white/5 flex flex-row-reverse justify-between items-center px-gutter rtl">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-surface-container-highest overflow-hidden border border-white/10">
            <img alt="User Profile" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBj259SVMSSjJYhfvjD3r3H-V1rN4-Kvz526wpJOir0rZkS6RKwcr57mLNfBa7UmecMRzCCFwn3vffqiriyZ0wM0ZY_1LvtQpuGLuo7fvDYqki4oKWYYxb6hAljzCucbOiWuPe9dMyOx-Y6pzt1MNvivw0U0svPuFR4SKGTybK4PpBqqgLKA1bBHmw_YYOS8Gldg2NH2p9cE0KX8imrjqQUt6TdHV_NvPdwZwIs04nsn9pum58vduI9" />
          </div>
        </div>
        <div className="flex-1 flex justify-start pl-8 max-w-md">
          <div className="relative w-full">
            <Icon name="search" className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]" />
            <input
              className="w-full bg-surface-container-lowest border border-surface-variant rounded-full py-2 pr-10 pl-4 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-on-surface-variant/50"
              placeholder="بحث في جهات الاتصال (الاسم أو رقم الهاتف)..."
              type="text"
            />
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pt-24 px-gutter pb-stack-lg rtl">
        <div className="max-w-container-max mx-auto space-y-stack-lg">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">العملاء والحسابات</h2>
              <p className="text-on-surface-variant mt-2">إدارة قاعدة بيانات العملاء والموردين والأرصدة المالية</p>
            </div>
            <button
              onClick={handleOpenAddForm}
              className="bg-primary-container text-on-primary-container px-6 py-2 rounded-lg font-body-md font-semibold hover:bg-primary transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(212,175,55,0.2)]"
            >
              <Icon name="person_add" className="text-[20px]" />
              إضافة جهة جديدة
            </button>
          </div>

          <div className="grid grid-cols-1 gap-gutter">
            <EntityTable 
              entities={entities} 
              loading={entitiesLoading} 
              onEdit={handleOpenEditForm}
              onTransaction={handleOpenTransaction}
              onDelete={removeEntity}
            />
          </div>
        </div>
      </main>

      <EntityFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingEntity}
      />

      <FinancialTransactionModal
        isOpen={isFinModalOpen}
        onClose={() => setIsFinModalOpen(false)}
        onSubmit={processTransaction}
        entity={finEntity}
        initialType={finType}
      />
    </div>
  );
}
