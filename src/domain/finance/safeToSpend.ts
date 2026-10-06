import { PersonaProfile, MoneyCentavos } from '../types';

export interface SafeToSpendResult {
  accessibleCentavos: MoneyCentavos;
  reservedCentavos: MoneyCentavos;
  billsCentavos: MoneyCentavos;
  debtMinCentavos: MoneyCentavos;
  iouPayablesCentavos: MoneyCentavos;
  essentialsCentavos: MoneyCentavos;
  cushionCentavos: MoneyCentavos;
  stsTotalCentavos: MoneyCentavos;
  stsDailyCentavos: MoneyCentavos;
  horizonDays: number;
  nextIncomeDate: string;
  status: 'Comfortable' | 'Balanced' | 'Tight' | 'Critical';
}

function atManilaEndOfDay(date: string): number {
  return new Date(`${date}T23:59:59+08:00`).getTime();
}

export function calculateSafeToSpend(profile: PersonaProfile, currentDate: Date): SafeToSpendResult {
  const accessibleCentavos = profile.accounts
    .filter((a) => a.isSpendable)
    .reduce((sum, a) => sum + a.balanceCentavos, 0);

  const nextPaydayDate = new Date(`${profile.nextPayday}T00:00:00+08:00`);
  const diffTime = nextPaydayDate.getTime() - currentDate.getTime();
  const horizonDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const reservedCentavos = profile.reservations
    .filter((r) => atManilaEndOfDay(r.targetDate) <= atManilaEndOfDay(profile.nextPayday))
    .reduce((sum, r) => sum + r.amountCentavos, 0);

  const billsCentavos = profile.commitments
    .filter(
      (c) =>
        !c.isPaid &&
        atManilaEndOfDay(c.dueDate) <= atManilaEndOfDay(profile.nextPayday)
    )
    .reduce((sum, c) => sum + c.amountCentavos, 0);

  const debtMinCentavos = profile.debts
    .filter((d) => atManilaEndOfDay(d.dueDate) <= atManilaEndOfDay(profile.nextPayday))
    .reduce((sum, d) => sum + d.minimumDueCentavos, 0);

  const iouPayablesCentavos = profile.ious
    .filter(
      (iou) =>
        iou.direction === 'i_owe' &&
        iou.status !== 'settled' &&
        iou.amountCentavos > 0 &&
        !!iou.dueDate &&
        atManilaEndOfDay(iou.dueDate) <= atManilaEndOfDay(profile.nextPayday)
    )
    .reduce((sum, iou) => sum + iou.amountCentavos, 0);

  const essentialsCentavos = profile.essentialDailyRunRateCentavos * horizonDays;
  const cushionCentavos = profile.cushionDays * profile.essentialDailyRunRateCentavos;

  const deductions =
    reservedCentavos +
    billsCentavos +
    debtMinCentavos +
    iouPayablesCentavos +
    essentialsCentavos +
    cushionCentavos;

  const stsTotalCentavos = Math.max(0, accessibleCentavos - deductions);
  const stsDailyCentavos = Math.round(stsTotalCentavos / horizonDays);

  let status: SafeToSpendResult['status'];
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
    iouPayablesCentavos,
    essentialsCentavos,
    cushionCentavos,
    stsTotalCentavos,
    stsDailyCentavos,
    horizonDays,
    nextIncomeDate: profile.nextPayday,
    status,
  };
}
