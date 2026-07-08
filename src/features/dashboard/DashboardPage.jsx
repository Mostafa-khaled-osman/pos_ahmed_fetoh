import React from 'react';
import { Helmet } from 'react-helmet-async';
import Sidebar from '../../shared/components/layout/Sidebar';
import Icon from '../../shared/components/ui/Icon';
import KPICard from './components/KPICard';
import RecentActivityTable from './components/RecentActivityTable';
import LowStockAlerts from './components/LowStockAlerts';
import { useDashboardMetrics, useRecentActivity, useLowStockProducts } from './hooks/useDashboard';

export default function DashboardPage() {
  const { treasury, session, salesData, netProfit, loading: metricsLoading } = useDashboardMetrics();
  const { invoices, transactions, loading: activityLoading } = useRecentActivity(8);
  const { products: lowStockProducts, loading: stockLoading } = useLowStockProducts(20, 5);

  const treasuryBalance = treasury?.total_balance || 0;
  const openingBalance = session?.opening_balance || 0;
  const sessionStatus = session ? (session.status === 'open' ? 'مفتوحة' : 'مغلقة') : 'لا توجد جلسة';

  return (
    <>
      <Helmet>
        <title>بيضة الذهب - لوحة القيادة</title>
        <meta name="description" content="ملخص الأداء المالي والتشغيلي لليوم في نظام الأتيليه التنفيذي" />
      </Helmet>

      {/* TopAppBar */}
      <header className="fixed top-0 left-0 right-0 z-50 flex flex-row-reverse justify-between items-center px-margin-edge h-20 bg-surface/80 backdrop-blur-2xl border-b border-surface-variant/10 shadow-sm transition-all">
        <div className="flex flex-row-reverse items-center gap-stack-lg">
          {/* <div className="relative hidden md:flex items-center">
            <Icon name="search" className="absolute right-4 text-on-surface-variant" />
            <input
              className="w-80 h-10 bg-surface-container-low border border-surface-variant rounded-full pr-12 pl-4 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all placeholder-on-surface-variant/50"
              placeholder="البحث في النظام..."
              type="text"
            />
          </div> */}
        </div>
        <div className="flex flex-row-reverse items-center gap-stack-md">
          {/* <button className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high/50 transition-colors cursor-pointer active:scale-95 duration-200 relative group">
            <Icon name="notifications" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full ring-2 ring-surface"></span>
          </button> */}
          {/* <button className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high/50 transition-colors cursor-pointer active:scale-95 duration-200">
            <Icon name="settings" />
          </button> */}
          <div className="w-px h-6 bg-surface-variant mx-2"></div>
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="text-right hidden sm:block">
              <div className="font-body-md text-body-md text-on-surface font-medium">المدير التنفيذي</div>
              <div className="font-label-caps text-label-caps text-on-surface-variant">الإدارة العليا</div>
            </div>
            <img
              className="w-10 h-10 rounded-full border-2 border-surface-variant object-cover"
              alt="Manager Profile"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4ot4g4s3GC37-4bvfHkCJpMzW7pSVwzk48liFykuEr86lSyJuT_A7SPsvr8pJRl8Gbmb4MCE5xM5avA_XVuTFnxzeIBvm7zeKzORq-d6cOvzS2UzrVHZR0qRI2qd-pYwrYo4_LXcIXwDfmivGFzSP10DD1cAzEkeYyyLgdcZoj2n-W2QAGvxhCKVOAtYWTGMBidnbXprxUYojZuNU5wDUlxE3VT2WPpbcXdAgWT2LXNlBi_WM6_zj"
            />
          </div>
        </div>
      </header>

      {/* SideNavBar */}
      <Sidebar activePath="/dashboard" />

      {/* Main Content Canvas */}
      <main className="pr-72 pt-28 pb-12 pl-margin-edge min-h-screen bg-background text-on-surface rtl font-body-md">
        <div className="max-w-[1440px] mx-auto flex flex-col gap-gutter">

          {/* Header Section */}
          <div className="flex justify-between items-end mb-4">
            <div>
              <h1 className="font-headline-lg text-headline-lg text-on-surface mb-2">نظرة عامة</h1>
              <p className="font-body-md text-body-md text-on-surface-variant">ملخص الأداء المالي والتشغيلي لليوم</p>
            </div>
            {/* <div className="flex gap-4">
              <button className="bg-primary text-on-primary px-6 py-2.5 rounded-lg font-body-md text-body-md font-medium hover:bg-primary-fixed transition-colors shadow-[0_4px_20px_rgba(212,175,55,0.2)] flex items-center gap-2">
                <Icon name="download" className="text-lg" />
                تصدير التقرير
              </button>
            </div> */}
          </div>

          {/* Top Row: KPI Cards (Bento Grid Style) */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-gutter">
            <KPICard
              title="رصيد الخزينة"
              value={treasuryBalance}
              unit="ج.م"
              icon="account_balance"
              variant="glow"
              loading={metricsLoading}
            />
            <KPICard
              title="مبيعات اليوم"
              value={salesData.totalSales}
              unit="ج.م"
              icon="point_of_sale"
              loading={metricsLoading}
            />
            <KPICard
              title="مشتريات اليوم"
              value={salesData.totalPurchases}
              unit="ج.م"
              icon="shopping_cart"
              loading={metricsLoading}
            />
            <KPICard
              title="صافي الربح"
              value={netProfit}
              unit="ج.م"
              icon={netProfit >= 0 ? "trending_up" : "trending_down"}
              variant={netProfit >= 0 ? "glow" : "error"}
              loading={metricsLoading}
            />
            <KPICard
              title="حالة الجلسة الحالية"
              value={sessionStatus}
              icon="storefront"
              variant={session?.status === 'closed' ? 'error' : 'default'}
              loading={metricsLoading}
            />
          </div>

          {/* Middle Row: Charts & Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter mt-4">
            <LowStockAlerts products={lowStockProducts} loading={stockLoading} />

            {/* Monthly Profit Trends Chart Placeholder */}
            <div className="glass-panel rounded-2xl p-6 flex flex-col h-[400px]">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-headline-md text-headline-md text-on-surface">اتجاهات المبيعات الشهرية</h3>
                <button className="text-on-surface-variant hover:text-on-surface transition-colors">
                  <Icon name="more_vert" />
                </button>
              </div>
              <div className="flex-1 flex items-center justify-center relative">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 500 200" preserveAspectRatio="none">
                  <path d="M 0 150 L 100 80 L 200 120 L 300 40 L 400 60 L 500 0" fill="none" className="chart-glow-line" />
                  <circle cx="0" cy="150" r="4" fill="#d4af37" />
                  <circle cx="100" cy="80" r="4" fill="#d4af37" />
                  <circle cx="200" cy="120" r="4" fill="#d4af37" />
                  <circle cx="300" cy="40" r="4" fill="#d4af37" />
                  <circle cx="400" cy="60" r="4" fill="#d4af37" />
                  <circle cx="500" cy="0" r="4" fill="#d4af37" />
                </svg>
              </div>
            </div>
          </div>

          {/* Bottom Row: Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter mt-4">
            <RecentActivityTable invoices={invoices} transactions={transactions} loading={activityLoading} />
          </div>

        </div>
      </main>
    </>
  );
}
