export const EGGS_PER_CARTON = 30;

/**
 * Formats the total number of eggs into a string displaying Cartons and Eggs.
 * @param {number|string} totalEggs - The absolute base quantity in eggs.
 * @returns {string} - Formatted string (e.g., "3 كرتونة و 5 بيضة" or "2 كرتونة").
 */
export function formatStock(totalEggs) {
  const total = Number(totalEggs) || 0;
  if (total === 0) return '0 بيضة';

  const isNegative = total < 0;
  const absTotal = Math.abs(total);

  const cartons = Math.floor(absTotal / EGGS_PER_CARTON);
  const eggs = absTotal % EGGS_PER_CARTON;

  const parts = [];
  if (cartons > 0) {
    parts.push(`${cartons} كرتونة`);
  }
  if (eggs > 0) {
    parts.push(`${eggs} بيضة`);
  }

  const resultString = parts.join(' و ');
  return isNegative ? `- (${resultString})` : resultString;
}
