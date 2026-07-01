/**
 * DailySessionCard — Active session details + close shift button.
 */
import Icon from '../../../shared/components/ui/Icon';

export default function DailySessionCard({ session, loading = false, onEndSession, onStartSession }) {
  if (loading) {
    return (
      <section className="lg:col-span-5 glass-panel rounded-xl p-stack-md flex flex-col animate-pulse">
        <div className="h-8 w-48 bg-surface-variant/40 rounded mb-6" />
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="h-20 bg-surface-variant/30 rounded-lg" />
          <div className="h-20 bg-surface-variant/30 rounded-lg" />
        </div>
        <div className="h-28 bg-surface-variant/20 rounded-lg" />
      </section>
    );
  }

  const openingTime = session?.opened_at
    ? new Date(session.opened_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
    : '--:--';
  const openingBalance = Number(session?.opening_balance || 0).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const cashSales = Number(session?.total_cash_sales || 0).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const isOpen = session?.status === 'open';

  return (
    <section className="lg:col-span-5 glass-panel rounded-xl p-stack-md flex flex-col">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/5">
        <h3 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
          <Icon name="calendar_today" className="text-primary" />
          جلسة اليوم
        </h3>
        {isOpen && (
          <div className="bg-secondary/10 border border-secondary/30 text-secondary px-3 py-1 rounded-full font-label-caps text-label-caps flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            مفتوحة
          </div>
        )}
      </div>

      <div className="space-y-6 flex-1">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-surface-container-low p-4 rounded-lg border border-white/5">
            <p className="font-body-md text-body-md text-on-surface-variant mb-1">وقت الافتتاح</p>
            <p className="font-data-mono text-data-mono text-on-surface text-lg">{openingTime}</p>
          </div>
          <div className="bg-surface-container-low p-4 rounded-lg border border-white/5">
            <p className="font-body-md text-body-md text-on-surface-variant mb-1">الرصيد الافتتاحي</p>
            <p className="font-data-mono text-data-mono text-on-surface text-lg">
              {openingBalance} <span className="text-sm text-on-surface/50">ج.م</span>
            </p>
          </div>
        </div>

        <div className="bg-surface-container p-5 rounded-lg border border-primary/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent" />
          <div className="relative z-10">
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-2">إجمالي المبيعات النقدية (اليوم)</p>
            <div className="flex items-baseline gap-2">
              <span className="font-headline-lg text-headline-lg text-primary">{cashSales}</span>
              <span className="font-body-md text-body-md text-primary/70">ج.م</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4">
        {isOpen ? (
          <button
            onClick={() => {
              if (window.confirm('هل أنت متأكد من إنهاء وإغلاق الوردية؟ لا يمكن التراجع عن هذا الإجراء.')) {
                onEndSession();
              }
            }}
            className="w-full bg-surface-container border border-error/30 hover:bg-error/10 hover:border-error/50 text-error px-6 py-4 rounded-lg font-body-lg text-body-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 active:scale-[0.98] group"
          >
            <Icon name="power_settings_new" className="group-hover:rotate-90 transition-transform duration-300" />
            إنهاء وإغلاق الوردية
          </button>
        ) : (
          <button
            onClick={onStartSession}
            className="w-full bg-primary text-[#1A1D23] px-6 py-4 rounded-lg font-body-lg text-body-lg font-bold transition-all duration-300 flex items-center justify-center gap-2 hover:bg-primary-fixed shadow-lg ambient-glow active:scale-[0.98]"
          >
            <Icon name="play_arrow" />
            بدء الجلسة
          </button>
        )}
      </div>
    </section>
  );
}
