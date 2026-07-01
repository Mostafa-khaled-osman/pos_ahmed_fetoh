import { useCallback } from 'react';
import { useSupabaseQuery } from '../../../core/hooks/useSupabaseQuery';
import { fetchEntities, insertEntity, updateEntity, deleteEntity, insertFinancialTransaction, fetchEntityById, fetchEntityTransactions } from '../../../core/supabase/api';

export function useCRM() {
  const { data: entities, loading, error, refetch } = useSupabaseQuery(fetchEntities);

  const addEntity = useCallback(async (entityData) => {
    try {
      await insertEntity(entityData);
      await refetch();
    } catch (err) {
      console.error('Failed to add entity:', err);
      throw err;
    }
  }, [refetch]);

  const editEntity = useCallback(async (id, updates) => {
    try {
      await updateEntity(id, updates);
      await refetch();
    } catch (err) {
      console.error('Failed to update entity:', err);
      throw err;
    }
  }, [refetch]);

  const removeEntity = useCallback(async (id) => {
    try {
      await deleteEntity(id);
      await refetch();
    } catch (err) {
      console.error('Failed to delete entity:', err);
      throw err;
    }
  }, [refetch]);

  return {
    entities,
    loading,
    error,
    refetch,
    addEntity,
    editEntity,
    removeEntity,
  };
}

export function useFinancialTransaction(sessionId, onComplete) {
  const processTransaction = useCallback(async ({ entityId, type, amount, notes }) => {
    if (!sessionId) {
      console.error('Cannot process transaction without an active session');
      return;
    }
    if (!entityId || !amount || amount <= 0) return;

    try {
      await insertFinancialTransaction({
        session_id: sessionId,
        entity_id: entityId,
        type, // 'receipt' or 'payment'
        amount: Number(amount),
        notes: notes || '',
      });
      if (onComplete) {
        await onComplete(); // Refetch entities to get updated balance
      }
    } catch (err) {
      console.error('Failed to process financial transaction:', err);
      throw err;
    }
  }, [sessionId, onComplete]);

  return { processTransaction };
}

export function useEntityLedger(entityId) {
  const fetchDetails = useCallback(() => fetchEntityById(entityId), [entityId]);
  const fetchTransactions = useCallback(() => fetchEntityTransactions(entityId), [entityId]);

  const { data: entity, loading: loadingEntity, error: errorEntity, refetch: refetchEntity } = useSupabaseQuery(fetchDetails, !!entityId);
  const { data: transactions, loading: loadingTransactions, error: errorTransactions, refetch: refetchTransactions } = useSupabaseQuery(fetchTransactions, !!entityId);

  const refetchAll = useCallback(async () => {
    await Promise.all([refetchEntity(), refetchTransactions()]);
  }, [refetchEntity, refetchTransactions]);

  return {
    entity,
    transactions,
    loading: loadingEntity || loadingTransactions,
    error: errorEntity || errorTransactions,
    refetchAll
  };
}
