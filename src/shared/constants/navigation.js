/**
 * Navigation Configuration
 *
 * Single source of truth for all sidebar variants.
 * The sidebar reads the current route and selects the matching config.
 */

export const APP_NAME_AR = 'الأتيليه';
export const APP_NAME_EN = 'Executive Atelier';

/* ── POS Sidebar (narrow, icon-only) ─────────────────── */
export const POS_NAV_ITEMS = [
  { id: 'sales', label: 'المبيعات', icon: 'point_of_sale', path: '/' },
  { id: 'returns', label: 'المرتجعات', icon: 'assignment_return', path: '/returns' },
  { id: 'catalog', label: 'الكتالوج', icon: 'grid_view', path: '/catalog' },
  { id: 'employees', label: 'الموظفين', icon: 'badge', path: '/employees' },
  { id: 'analytics', label: 'التحليلات', icon: 'monitoring', path: '/analytics' },
  { id: 'support', label: 'الدعم', icon: 'help', path: '/support' },
];

/* ── Dashboard Sidebar (wide, text + icon) ───────────── */
export const DASHBOARD_NAV_ITEMS = [
  { id: 'dashboard', label: 'لوحة القيادة', icon: 'dashboard', path: '/dashboard', description: 'لوحة التحكم الرئيسية' },
  { id: 'pos', label: 'نقطة البيع', icon: 'point_of_sale', path: '/', description: 'واجهة نقطة البيع' },
  { id: 'treasury', label: 'إدارة الخزينة', icon: 'account_balance_wallet', path: '/treasury', description: 'إدارة الجلسات المالية' },
  { id: 'inventory', label: 'المخزون', icon: 'inventory_2', path: '/inventory', description: 'إدارة المنتجات والمخزون' },
  { id: 'customers', label: 'العملاء والموردين', icon: 'group', path: '/customers', description: 'إدارة العملاء' },
  { id: 'reports', label: 'التقارير', icon: 'analytics', path: '/reports', description: 'التقارير والإحصائيات' },
];

/* ── Route Matching ──────────────────────────────────── */
const POS_ROUTES = ['/', '/returns', '/catalog', '/employees', '/analytics', '/support'];

export function isPOSRoute(pathname) {
  return POS_ROUTES.includes(pathname);
}
