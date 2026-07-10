/**
 * TreasuryLayout — Dashboard-variant layout shell.
 * Wide sidebar + fixed top app bar + scrollable main content.
 */
import Sidebar from '../../../shared/components/layout/Sidebar';
import Icon from '../../../shared/components/ui/Icon';

const PROFILE_IMG = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAUfu9WHys4aoAQkfR0D84UuFll3UWBO2vl36JAxJxamBk9BtW9mh4K9sdFDg7Atle_T1ZTz51fDk75deDQfABCdgrt5sKssjTInUEJmAg71ZR7Kj8GAJC4_G8MKAaX2x0az81YcfFApxuOrXzQfnBWctkm0adEtcwm9WOFvCXKSxVuEbFenWJAlCq_WkhDYNn3JoopiFxO7hm4uLY258LqftJt4vZshUPlyqACno55n3Knyyer3Gd3';

export default function TreasuryLayout({ children }) {
  return (
    <>
      {/* Ambient Background Light */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] mix-blend-screen -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] mix-blend-screen translate-y-1/3 -translate-x-1/3" />
      </div>

      {/* Wide Dashboard Sidebar */}
      <Sidebar variant="dashboard" activePath="/treasury" />

      {/* Top App Bar */}
      <header className="fixed top-0 right-64 left-0 h-16 bg-surface-container-highest/80 backdrop-blur-2xl border-b border-white/5 z-30 flex flex-row-reverse justify-between items-center px-gutter w-[calc(100%-256px)] transition-all duration-300">
        <div className="flex items-center gap-3">
          <div className="h-4 w-px bg-white/20 mx-2" />
          <span className="font-body-lg text-body-lg text-on-surface">إدارة الخزينة</span>
        </div>

        <div className="flex items-center gap-6">
          {/* <div className="relative hidden lg:block">
            <Icon name="search" className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
            <input
              type="text"
              className="w-64 bg-surface-container rounded-full border-none text-body-md font-body-md py-2 pr-10 pl-4 text-on-surface placeholder:text-on-surface-variant/50 focus:ring-1 focus:ring-primary focus:bg-surface-container-high transition-all outline-none"
              placeholder="بحث في الخزينة..."
            />
          </div> */}

          <div className="h-8 w-px bg-white/10" />

          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="text-left hidden sm:block">
              <div className="font-label-caps text-label-caps text-on-surface group-hover:text-primary transition-colors">احمد فتوح</div>
              <div className="font-label-caps text-label-caps text-primary-fixed/70 text-xs">جلسة نشطة</div>
            </div>
            <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 group-hover:border-primary transition-colors">
              <img alt="Profile" className="w-full h-full object-cover" src={PROFILE_IMG} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="pt-24 pb-12 pr-[280px] pl-gutter w-full min-h-screen relative z-10 overflow-y-auto h-screen">
        <div className="max-w-container-max mx-auto flex flex-col gap-gutter">
          {children}
        </div>
      </main>
    </>
  );
}
