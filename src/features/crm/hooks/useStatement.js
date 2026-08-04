import { useCallback, useMemo } from 'react';
import { useSupabaseQuery } from '../../../core/hooks/useSupabaseQuery';
import { fetchEntityById, fetchEntityTransactions, fetchEntityInvoices } from '../../../core/supabase/api';

export function useGetStatement(entityId) {
  // Callbacks for fetching
  const fetchEntityCb = useCallback(() => fetchEntityById(entityId), [entityId]);
  const fetchTransactionsCb = useCallback(() => fetchEntityTransactions(entityId), [entityId]);
  const fetchInvoicesCb = useCallback(() => fetchEntityInvoices(entityId), [entityId]);

  // Queries
  const { data: entity, loading: entityLoading, error: entityError, refetch: refetchEntity } = useSupabaseQuery(fetchEntityCb, !!entityId);
  const { data: transactions, loading: transLoading, error: transError, refetch: refetchTrans } = useSupabaseQuery(fetchTransactionsCb, !!entityId);
  const { data: invoices, loading: invLoading, error: invError, refetch: refetchInv } = useSupabaseQuery(fetchInvoicesCb, !!entityId);

  const refetch = useCallback(() => {
    refetchEntity();
    refetchTrans();
    refetchInv();
  }, [refetchEntity, refetchTrans, refetchInv]);

  const loading = entityLoading || transLoading || invLoading;
  const error = entityError || transError || invError;

  // Process and merge the ledger data
  const ledger = useMemo(() => {
    if (!entity || loading) return [];

    const unifiedList = [];

    // Add Invoices
    if (invoices) {
      invoices.forEach(inv => {
        const isSale = inv.invoice_type === 'sale';

        // For a customer: 
        // - A sale means they OWE us money (Debit)
        // - A purchase (e.g. from a supplier) means WE OWE them (Credit)
        const debit = isSale ? Number(inv.total_amount) : 0;
        const credit = !isSale ? Number(inv.total_amount) : 0;

        unifiedList.push({
          id: `inv-${inv.id}`,
          date: new Date(inv.created_at),
          type: 'invoice',
          description: isSale 
            ? `فاتورة مبيعات ${inv.payment_type === 'cash' ? '(نقدية) ' : ''}رقم #${inv.id.split('-')[0]}` 
            : `فاتورة مشتريات ${inv.payment_type === 'cash' ? '(نقدية) ' : ''}رقم #${inv.id.split('-')[0]}`,
          debit,
          credit,
          originalData: inv
        });

        // If it's a cash invoice and no explicit transaction was recorded, add synthetic cash settlement
        if (inv.payment_type === 'cash') {
          const hasTrx = (transactions || []).some(trx => trx.notes && trx.notes.includes(inv.id));
          if (!hasTrx) {
            const payDebit = !isSale ? Number(inv.total_amount) : 0;
            const payCredit = isSale ? Number(inv.total_amount) : 0;

            unifiedList.push({
              id: `cash-settle-${inv.id}`,
              date: new Date(inv.created_at),
              type: 'transaction',
              description: isSale ? `سداد نقدي فوري` : `صرف نقدي فوري`,
              notes: `سداد آلي للفاتورة النقدية رقم #${inv.id.split('-')[0]}`,
              debit: payDebit,
              credit: payCredit,
              originalData: { type: isSale ? 'receipt' : 'payment', amount: inv.total_amount }
            });
          }
        }
      });
    }

    // Add Financial Transactions (Receipts / Payments)
    if (transactions) {
      transactions.forEach(trx => {
        const isReceipt = trx.type === 'receipt';

        // For a customer:
        // - A receipt (we received money) means their debt decreases (Credit)
        // - A payment (we paid them money) means their balance increases (Debit)
        const debit = !isReceipt ? Number(trx.amount) : 0;
        const credit = isReceipt ? Number(trx.amount) : 0;

        unifiedList.push({
          id: trx.id,
          date: new Date(trx.created_at),
          type: 'transaction',
          description: isReceipt ? `سند قبض نقدي` : `سند صرف نقدي`,
          notes: trx.notes || '',
          debit,
          credit,
          originalData: trx
        });
      });
    }

    // Sort chronologically (Oldest to Newest)
    unifiedList.sort((a, b) => a.date - b.date);

    // Calculate Running Balance
    let runningBalance = 0; // Starting from 0. If entity has opening balance, add it here.

    return unifiedList.map(item => {
      runningBalance = runningBalance + item.debit - item.credit;
      return {
        ...item,
        balance: runningBalance
      };
    });

  }, [entity, invoices, transactions, loading]);

  return {
    entity,
    ledger,
    loading,
    error,
    refetch,
    finalBalance: ledger.length > 0 ? ledger[ledger.length - 1].balance : 0
  };
}
