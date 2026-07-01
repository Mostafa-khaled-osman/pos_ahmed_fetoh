import React from 'react';
import Sidebar from '../../../shared/components/layout/Sidebar';
import CartSidebar from './CartSidebar';
import Icon from '../../../shared/components/ui/Icon';

export default function POSLayout({ children, cart }) {
  return (
    <>
      {/* SideNavBar (Right docked in RTL) */}
      <Sidebar activePath="/" />

      {/* TopNavBar (Mobile only) */}
      <header className="flex md:hidden justify-between items-center px-margin-edge h-20 w-full bg-surface-dim/80 backdrop-blur-xl text-primary font-headline-md text-headline-md fixed top-0 z-50 border-b border-white/5 shadow-sm">
        <div className="font-headline-lg-mobile text-headline-lg-mobile font-bold text-primary">
          نظام الأتيليه التنفيذي
        </div>
        <div className="flex gap-4">
          <Icon name="notifications" className="cursor-pointer hover:text-primary transition-colors active:scale-95 text-on-surface-variant" />
          <Icon name="settings" className="cursor-pointer hover:text-primary transition-colors active:scale-95 text-on-surface-variant" />
          <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 cursor-pointer">
            <img
              alt="Manager Profile"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmA7s3C8H_SYyJ9zNwdZ33YGMCM6tDNzPZI7XnXdNIb6Vb2_i-BVsKmjltVmSGgeRi7kxXtGDb1FhT5Im-kIBJakwcVUZcoVYvGxbW7_HmVd5it3uGyVVZN2C-bAh2H_LrDv59IRncPX6XRJC1CCJnfwbIjkCAIt5iOUokJ1pnoPJjcS1kHbZDTdtZl6IdWbM1DCrFxyaXAx_yFSjJLmeNN3dlUJZ2gKqkmE7xT_bEbDB-30dXkwaq"
            />
          </div>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="flex-1 flex flex-col md:flex-row mr-0 md:mr-64 pt-20 md:pt-0 h-screen overflow-hidden">
        {/* Right Side: Product Grid Area */}
        <section className="flex-1 p-gutter overflow-y-auto no-scrollbar relative flex flex-col">
          {children}
        </section>

        {/* Left Side: Checkout Sidebar */}
        <CartSidebar cart={cart} />
      </main>
    </>
  );
}
