/**
 * TreasuryPage — Entry point for Treasury Management.
 * Fetches data via hooks and delegates rendering to pure components.
 */
import TreasuryLayout from './components/TreasuryLayout';
// import MasterTreasuryCard from './components/MasterTreasuryCard';
import DailySessionCard from './components/DailySessionCard';
import ExpensesCard from './components/ExpensesCard';
import { useTreasuryBalance, useActiveSession, useTodayExpenses } from './hooks/useTreasury';

export default function TreasuryPage() {
  const { treasury, loading: treasuryLoading } = useTreasuryBalance();
  const { session, loading: sessionLoading, endSession, startSession } = useActiveSession();
  const { expenses, totalExpenses, loading: expensesLoading, addExpense } = useTodayExpenses(session?.id);

  return (
    <TreasuryLayout>
      {/* <MasterTreasuryCard
        balance={treasury?.total_balance || 0}
        loading={treasuryLoading}
      /> */}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        <DailySessionCard
          session={session}
          loading={sessionLoading}
          onEndSession={endSession}
          onStartSession={startSession}
        />
        <ExpensesCard
          expenses={expenses}
          totalExpenses={totalExpenses}
          loading={expensesLoading}
          onAddExpense={addExpense}
        />
      </div>

      <div className="pb-8" />
    </TreasuryLayout>
  );
}
