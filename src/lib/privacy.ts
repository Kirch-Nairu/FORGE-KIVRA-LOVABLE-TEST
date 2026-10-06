export const HIDDEN_AMOUNT = '₱••••••';

export function maskCurrencyText(text: string, masked: boolean): string {
  if (!masked) return text;

  // Redact peso-denominated amounts without disturbing ordinary numbers/dates.
  return text.replace(/(?:[+-]\s*)?₱\s?\d[\d,]*(?:\.\d+)?(?:\s*\/\s*(?:day|mo|month|week))?/gi, HIDDEN_AMOUNT);
}

export function privacyMoneyText(
  centavos: number,
  masked: boolean,
  options: { sign?: boolean; decimals?: boolean } = {}
): string {
  if (masked) return HIDDEN_AMOUNT;
  const pesos = centavos / 100;
  const abs = Math.abs(pesos).toLocaleString('en-PH', {
    minimumFractionDigits: options.decimals ? 2 : 0,
    maximumFractionDigits: options.decimals ? 2 : 0,
  });
  const sign = options.sign ? (centavos > 0 ? '+' : centavos < 0 ? '-' : '') : centavos < 0 ? '-' : '';
  return `${sign}₱${abs}`;
}
