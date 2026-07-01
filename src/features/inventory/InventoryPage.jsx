import React, { useState } from 'react';
import { useInventory } from './hooks/useInventory';
import { useSpoilage } from './hooks/useSpoilage';
import { useActiveSession } from '../treasury/hooks/useTreasury';
import ProductsTable from './components/ProductsTable';
import SpoilagePanel from './components/SpoilagePanel';
import ProductActionModal from './components/ProductActionModal';
import Sidebar from '../../shared/components/layout/Sidebar';
import Icon from '../../shared/components/ui/Icon';

export default function InventoryPage() {
  const { products, loading: productsLoading, addProduct, editProduct, removeProduct, refetch } = useInventory();
  const { session } = useActiveSession();
  const { logSpoilage } = useSpoilage(session?.id, refetch);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (data) => {
    if (editingProduct) {
      await editProduct(editingProduct.id, data);
    } else {
      await addProduct(data);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 mr-0 md:mr-64 h-screen">
      <Sidebar activePath="/inventory" />
      
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
              placeholder="بحث في المنتجات (الاسم أو SKU)..."
              type="text"
            />
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pt-24 px-gutter pb-stack-lg rtl">
        <div className="max-w-container-max mx-auto space-y-stack-lg">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">إدارة المخزون</h2>
              <p className="text-on-surface-variant mt-2">نظرة عامة على المنتجات وتسجيل الهالك</p>
            </div>
            <button
              onClick={handleOpenAddModal}
              className="bg-primary-container text-on-primary-container px-6 py-2 rounded-lg font-body-md font-semibold hover:bg-primary transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(212,175,55,0.2)]"
            >
              <Icon name="add" className="text-[20px]" />
              إضافة منتج جديد
            </button>
          </div>
          
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-gutter">
            <ProductsTable
              products={products}
              loading={productsLoading}
              onEditProduct={handleOpenEditModal}
            />
            <SpoilagePanel
              products={products}
              loading={productsLoading}
              onLogSpoilage={logSpoilage}
            />
          </div>
        </div>
      </main>

      <ProductActionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={editingProduct}
      />
    </div>
  );
}
