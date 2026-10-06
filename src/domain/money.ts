import { MoneyCentavos } from './types';

export function toCentavos(pesos: number): MoneyCentavos {
  return Math.round(pesos * 100);
}

export function toPesos(centavos: MoneyCentavos): number {
  return centavos / 100;
}

export function formatPesos(centavos: MoneyCentavos, options: { showDecimals?: boolean; sign?: boolean } = {}): string {
  const pesos = centavos / 100;
  const abs = Math.abs(pesos);
  const formatted = abs.toLocaleString('en-PH', {
    minimumFractionDigits: options.showDecimals ? 2 : 0,
    maximumFractionDigits: options.showDecimals ? 2 : 0,
  });
  const prefix = options.sign && centavos > 0 ? '+' : centavos < 0 ? '-' : '';
  return `${prefix}₱${formatted}`;
}
