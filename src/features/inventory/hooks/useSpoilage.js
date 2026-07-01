import { useCallback } from 'react';
import { insertSpoilageLog } from '../../../core/supabase/api';

export function useSpoilage(sessionId, onLogSuccess) {
  const logSpoilage = useCallback(async ({ productId, quantity, notes }) => {
    if (!sessionId) {
      console.error('Cannot log spoilage without an active session');
      return;
    }
    if (!productId || !quantity || quantity <= 0) return;

    try {
      await insertSpoilageLog({
        product_id: productId,
        quantity: Number(quantity),
        notes: notes || '',
        session_id: sessionId
      });
      if (onLogSuccess) {
        await onLogSuccess(); // Refetch products typically
      }
    } catch (err) {
      console.error('Failed to log spoilage:', err);
      throw err;
    }
  }, [sessionId, onLogSuccess]);

  return { logSpoilage };
}
