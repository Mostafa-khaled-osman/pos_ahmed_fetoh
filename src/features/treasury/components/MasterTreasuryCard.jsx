/**
 * MasterTreasuryCard — Hero card showing total treasury balance.
 */
import Icon from '../../../shared/components/ui/Icon';

export default function MasterTreasuryCard({ balance = 0, loading = false }) {
  const formatted = Number(balance).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    
    <section className="glass-panel-deep rounded-xl p-stack-lg relative overflow-hidden group">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 p-8 opacity-5">
        <Icon name="account_balance" filled className="text-[180px] text-primary" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-bl from-primary/5 to-transparent pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Icon name="shield_lock" filled className="text-primary" />
            <h2 className="font-headline-md text-headline-md text-on-surface-variant font-medium tracking-wide">الخزينة الإجمالية</h2>
          </div>
          <div className="flex items-baseline gap-2">
            {loading ? (
              <div className="h-14 w-64 bg-surface-variant/40 rounded-lg animate-pulse" />
            ) : (
              <>
                <span className="font-headline-lg text-primary tracking-tight" style={{ fontSize: '3.5rem', lineHeight: 1.1 }}>
                  {formatted}
                </span>
                <span className="font-headline-md text-headline-md text-primary-fixed/60">ج.م</span>
              </>
            )}
          </div>
        </div>

      </div>
    </section>
    
  );
}
