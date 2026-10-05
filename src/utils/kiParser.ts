const MULTIPLIERS: Record<string, number> = {
  thousand: 1e3,
  million: 1e6,
  billion: 1e9,
  trillion: 1e12,
  quadrillion: 1e15,
  quintillion: 1e18,
  sextillion: 1e21,
  septillion: 1e24,
};

/**
 * Parses a Dragon Ball API Ki string (e.g., '60.000.000', '250 Billion', '90 Septillion')
 * into a comparable numeric value for sorting.
 */
export function parseKiValue(kiStr: string | null | undefined): number {
  if (!kiStr) return 0;
  const cleaned = kiStr.trim().toLowerCase();
  if (cleaned === '0' || cleaned === 'unknown' || cleaned === '') return 0;

  for (const [word, multiplier] of Object.entries(MULTIPLIERS)) {
    if (cleaned.includes(word)) {
      const numPart = cleaned.replace(word, '').replace(/\./g, '').trim();
      const val = parseFloat(numPart.replace(',', '.'));
      return isNaN(val) ? 0 : val * multiplier;
    }
  }

  // European dot separators: e.g. "60.000.000" -> "60000000"
  const normalizedDots = cleaned.replace(/\./g, '').replace(/,/g, '');
  const parsed = parseFloat(normalizedDots);
  return isNaN(parsed) ? 0 : parsed;
}
