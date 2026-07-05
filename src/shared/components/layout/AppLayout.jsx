import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Icon from '../ui/Icon';

export default function AppLayout({ children, activePath, title, subtitle, headerActions }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen bg-background text-on-surface rtl font-body-md relative overflow-hidden">
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div className={`fixed inset-y-0 right-0 z-50 transform transition-transform duration-300 ease-in-out lg:fixed lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <Sidebar activePath={activePath} />
      </div>

      {/* Main Content Canvas */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto custom-scrollbar relative lg:pr-64">
        
        {/* Top Header (Mobile Toggle & Utilities) */}
        <header className="sticky top-0 z-30 bg-surface/80 backdrop-blur-xl border-b border-white/5 h-16 flex items-center justify-between px-4 lg:px-6 print:hidden">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/20 rounded-lg transition-colors cursor-pointer"
              onClick={toggleSidebar}
            >
              <Icon name="menu" className="text-2xl" />
            </button>
            {/* <div className="hidden lg:flex items-center gap-2">
              <div className="relative">
                <Icon name="search" className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                <input
                  type="text"
                  placeholder="بحث سريع..."
                  className="w-64 bg-surface-container rounded-full border border-white/5 py-2 pr-10 pl-4 text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                />
              </div>
            </div> */}
          </div>
          
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high/50 transition-colors relative">
              <Icon name="notifications" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full"></span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 w-full max-w-[1440px] mx-auto p-4 md:p-6 lg:p-8 flex flex-col gap-6 relative z-10 print:p-0 print:block">
          
          {/* Page Header Area */}
          {(title || headerActions) && (
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4 mb-2 print:hidden">
              <div>
                {title && <h1 className="font-headline-lg text-headline-lg text-on-surface mb-2 font-bold tracking-tight">{title}</h1>}
                {subtitle && <p className="font-body-md text-body-md text-on-surface-variant">{subtitle}</p>}
              </div>
              {headerActions && (
                <div className="w-full lg:w-auto">
                  {headerActions}
                </div>
              )}
            </div>
          )}

          {/* Children Content */}
          {children}
        </main>
      </div>
    </div>
  );
}
