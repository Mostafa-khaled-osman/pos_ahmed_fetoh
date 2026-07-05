/**
 * Sidebar — Dynamic Navigation Component
 *
 * Supports two variants controlled by the `variant` prop:
 * - "pos"       → Narrow (w-24), icon-only sidebar for the sales workflow.
 * - "dashboard" → Wide (w-64), icon+text sidebar for management pages.
 */
import Icon from '../ui/Icon';
import { POS_NAV_ITEMS, DASHBOARD_NAV_ITEMS } from '../../constants/navigation';

const PROFILE_IMG = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDPrB1RImqQfawvE9iYeUXPOFwIkNEw2XBrzMpi9bPD3cylJOkR9xsbymz8HOsNzjpmGUnPuybzAQdbSEZBjaQ3ZdhHsDnhsE3nwnuWRb6EgvNEFAujA6ofeMJmvJxDKqrZbL-inAyBu5R3u3ONmNVqyT9gJ2mZTjejwroRZufLWMoOmpDbTglRH5c0inC_XO7G-B3bYaMZechYSYIPhf22IT7VYruV63X96sk7oInFczSu6t4-cx3h';

export default function Sidebar({ activePath = '/treasury' }) {
  return (
    <aside className="h-screen w-64 fixed right-0 top-0 flex flex-col bg-surface-container-high/40 backdrop-blur-3xl shadow-[0_0_20px_rgba(212,175,55,0.05)] z-40 border-l border-white/5 rtl py-stack-lg">
      {/* Brand / Profile Header */}
      <div className="px-gutter mb-stack-lg flex items-center gap-4">
        <div className="w-12 h-12 rounded-full overflow-hidden border border-primary/30 shrink-0">
          <img alt="Profile" className="w-full h-full object-cover" src={PROFILE_IMG} />
        </div>
        <div>
          <h1 className="font-headline-md text-headline-md font-bold text-primary">Ahmed fetoh</h1>
          <p className="font-label-caps text-label-caps text-on-surface-variant">إدارة التوزيع الفاخرة</p>
        </div>
      </div>


      <div className="px-4 mb-stack-lg">
        <a 
          href="/add-invoice"
          className="w-full bg-primary-container text-on-primary-container rounded-lg py-3 px-4 flex items-center justify-center gap-2 font-headline-md text-headline-md font-bold hover:bg-primary transition-all shadow-md ambient-glow"
        >
          <Icon name="add" className="text-[20px]" />
          إضافة فاتورة
        </a>
      </div>

      {/* Navigation Tabs */}
      <nav className="flex-1 flex flex-col gap-1 px-4">
        {DASHBOARD_NAV_ITEMS.map((item) => {
          const isActive = activePath === item.path;
          return (
            <a
              key={item.id}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 active:scale-95 transition-transform ${
                isActive
                  ? 'text-primary border-r-2 border-primary bg-primary/10'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/50 group'
              }`}
            >
              <Icon
                name={item.icon}
                filled={isActive}
                className={isActive ? 'text-primary' : 'group-hover:text-primary transition-colors'}
              />
              <span className="font-body-md text-body-md font-medium">{item.label}</span>
            </a>
          );
        })}
      </nav>

      {/* Footer Tabs */}
      <div className="mt-auto flex flex-col gap-1 px-4 border-t border-white/5 pt-4 text-center">
        <p className="font-label-caps text-[9px] text-on-surface-variant/40 tracking-wider">DEVELOPED BY</p>
        <span className="font-body-sm text-body-sm text-on-surface font-bold">Mostafa Khaled</span>
        <span className="font-label-caps text-[10px] text-primary/90">Web Developer</span>
        
        <div className="flex justify-center gap-3 mt-2">
          <a 
            href="https://portifolio-mostafa-khaled.vercel.app/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1 text-[11px]"
          >
            <Icon name="language" className="text-[14px]" />
            الموقع
          </a>
          <a 
            href="https://wa.me/+201551729506" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-on-surface-variant hover:text-secondary transition-colors flex items-center gap-1 text-[11px]"
          >
            <Icon name="chat" className="text-[14px]" />
            واتساب
          </a>
        </div>
      </div>
    </aside>
  );
}
