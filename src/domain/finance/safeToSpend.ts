import { PersonaProfile, MoneyCentavos } from '../types';

export interface SafeToSpendResult {
  accessibleCentavos: MoneyCentavos;
  reservedCentavos: MoneyCentavos;
  billsCentavos: MoneyCentavos;
  debtMinCentavos: MoneyCentavos;
  essentialsCentavos: MoneyCentavos;
  cushionCentavos: MoneyCentavos;
  stsTotalCentavos: MoneyCentavos;
  stsDailyCentavos: MoneyCentavos;
  horizonDays: number;
  nextIncomeDate: string;
  status: 'Comfortable' | 'Balanced' | 'Tight' | 'Critical';
}

export function calculateSafeToSpend(profile: PersonaProfile, currentDate: Date): SafeToSpendResult {
  // A = spendable balances
  const accessibleCentavos = profile.accounts
    .filter((a) => a.isSpendable)
    .reduce((sum, a) => sum + a.balanceCentavos, 0);

  // H = next confirmed income date
  const currentTimestamp = currentDate.getTime();
  const nextPaydayDate = new Date(profile.nextPayday + 'T00:00:00+08:00');
  
  // Calculate days to H
  const diffTime = nextPaydayDate.getTime() - currentTimestamp;
  const horizonDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  // R = reservations + scheduled goal contributions <= H
  const reservedCentavos = profile.reservations
    .filter((r) => new Date(r.targetDate).getTime() <= nextPaydayDate.getTime())
    .reduce((sum, r) => sum + r.amountCentavos, 0);

  // B = unpaid commitments + subscriptions due <= H
  const billsCentavos = profile.commitments
    .filter((c) => !c.isPaid && new Date(c.dueDate + 'T23:59:59+08:00').getTime() <= nextPaydayDate.getTime())
    .reduce((sum, c) => sum + c.amountCentavos, 0);

  // Debt minimums due <= H
  const debtMinCentavos = profile.debts
    .filter((d) => new Date(d.dueDate + 'T23:59:59+08:00').getTime() <= nextPaydayDate.getTime())
    .reduce((sum, d) => sum + d.minimumDueCentavos, 0);

  // E = essential daily run-rate × days to H
  const essentialsCentavos = profile.essentialDailyRunRateCentavos * horizonDays;

  // C = cushion days × essential daily run-rate
  const cushionCentavos = profile.cushionDays * profile.essentialDailyRunRateCentavos;

  // Canonical formula: STS_total = max(0, A - R - B - Debt - E - C)
  const deductions = reservedCentavos + billsCentavos + debtMinCentavos + essentialsCentavos + cushionCentavos;
  const stsTotalCentavos = Math.max(0, accessibleCentavos - deductions);
  const stsDailyCentavos = Math.round(stsTotalCentavos / horizonDays);

  let status: 'Comfortable' | 'Balanced' | 'Tight' | 'Critical' = 'Tight';
  if (stsDailyCentavos > profile.essentialDailyRunRateCentavos * 1.5) {
    status = 'Comfortable';
  } else if (stsDailyCentavos >= profile.essentialDailyRunRateCentavos) {
    status = 'Balanced';
  } else if (stsDailyCentavos > 0) {
    status = 'Tight';
  } else {
    status = 'Critical';
  }

  return {
    accessibleCentavos,
    reservedCentavos,
    billsCentavos,
    debtMinCentavos,
    essentialsCentavos,
    cushionCentavos,
    stsTotalCentavos,
    stsDailyCentavos,
    horizonDays,
    nextIncomeDate: profile.nextPayday,
    status,
  };
}
