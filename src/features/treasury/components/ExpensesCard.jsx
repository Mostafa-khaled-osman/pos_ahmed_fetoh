/**
 * ExpensesCard — Administrative expenses management.
 * Quick-entry form + today's expenses table + totals.
 */
import { useState, useMemo } from 'react';
import Icon from '../../../shared/components/ui/Icon';

const CATEGORIES = ['نثريات', 'صيانة', 'وقود', 'أخرى'];

export default function ExpensesCard({ expenses = [], totalExpenses = 0, loading = false, onAddExpense }) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!amount || Number(amount) <= 0 || !description.trim()) return;
    setSubmitting(true);
    try {
      await onAddExpense({
        amount: Number(amount),
        notes: `[${category}] ${description.trim()}`,
      });
      setAmount('');
      setDescription('');
      setCategory(CATEGORIES[0]);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const formattedTotal = useMemo(() => {
    return Number(totalExpenses).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }, [totalExpenses]);

  return (
    <section className="lg:col-span-7 glass-panel rounded-xl p-stack-md flex flex-col">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/5">
        <h3 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
          <Icon name="receipt_long" className="text-primary" />
          إدارة المصاريف الإدارية
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
        {/* Quick Entry Form */}
        <div className="md:col-span-1 bg-surface-container-low p-4 rounded-lg border border-white/5 flex flex-col gap-4">
          <h4 className="font-body-lg text-body-lg text-on-surface-variant mb-2">إضافة مصروف جديد</h4>
          <div className="space-y-4 flex-1">
            <div>
              <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1.5">المبلغ (ج.م)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-surface border border-surface-variant rounded-md px-3 py-2 text-on-surface font-data-mono text-data-mono focus:border-primary focus:ring-1 focus:ring-primary transition-colors outline-none"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1.5">البيان / الوصف</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-surface border border-surface-variant rounded-md px-3 py-2 text-on-surface font-body-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary transition-colors outline-none"
                placeholder="مثال: وقود للسيارة"
              />
            </div>
            <div>
              <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1.5">التصنيف</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-surface border border-surface-variant rounded-md px-3 py-2 text-on-surface font-body-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary transition-colors outline-none appearance-none"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting || !amount || !description.trim()}
            className="w-full bg-primary/10 border border-primary/30 hover:bg-primary/20 text-primary px-4 py-2 rounded-md font-body-md text-body-md transition-all duration-300 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Icon name="add" className="text-[18px]" />
            {submitting ? 'جارٍ التسجيل...' : 'تسجيل المصروف'}
          </button>
        </div>

        {/* Expenses List */}
        <div className="md:col-span-2 flex flex-col gap-4">
          <h4 className="font-body-lg text-body-lg text-on-surface-variant">مصاريف اليوم</h4>

          <div className="bg-surface-container-lowest rounded-lg border border-white/5 overflow-hidden flex-1">
            {loading ? (
              <div className="p-6 space-y-3 animate-pulse">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-10 bg-surface-variant/30 rounded" />
                ))}
              </div>
            ) : expenses.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-on-surface-variant/50">
                <Icon name="receipt" className="text-[48px] mb-2 opacity-50" />
                <p className="font-body-md">لا توجد مصاريف مسجلة اليوم</p>
              </div>
            ) : (
              <table className="w-full text-right">
                <thead className="bg-surface-container border-b border-white/5 font-label-caps text-label-caps text-on-surface-variant">
                  <tr>
                    <th className="py-3 px-4 font-normal">الوقت</th>
                    <th className="py-3 px-4 font-normal">البيان</th>
                    <th className="py-3 px-4 font-normal">التصنيف</th>
                    <th className="py-3 px-4 font-normal text-left">المبلغ</th>
                  </tr>
                </thead>
                <tbody className="font-body-md text-body-md text-on-surface divide-y divide-white/5">
                  {expenses.map((expense) => {
                    const time = new Date(expense.created_at).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true,
                    });
                    const categoryMatch = expense.notes?.match(/^\[(.*?)\] (.*)$/);
                    const displayCategory = categoryMatch ? categoryMatch[1] : 'أخرى';
                    const displayNotes = categoryMatch ? categoryMatch[2] : expense.notes;

                    return (
                      <tr key={expense.id} className="hover:bg-surface-variant/30 transition-colors">
                        <td className="py-3 px-4 text-on-surface-variant font-data-mono">{time}</td>
                        <td className="py-3 px-4">{displayNotes}</td>
                        <td className="py-3 px-4">
                          <span className="bg-surface-variant px-2 py-1 rounded text-xs">{displayCategory}</span>
                        </td>
                        <td className="py-3 px-4 text-left font-data-mono text-error">
                          {Number(expense.amount).toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          <div className="flex justify-between items-center bg-surface-container p-3 rounded-lg border border-white/5">
            <span className="font-body-md text-body-md text-on-surface-variant">إجمالي المصاريف:</span>
            <span className="font-data-mono text-data-mono text-error text-lg font-medium">{formattedTotal} ج.م</span>
          </div>
        </div>
      </div>
    </section>
  );
}
