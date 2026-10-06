import { PersonaProfile, MoneyCentavos } from '../types';

export interface DailyProjection {
  date: string;
  projectedBalanceCentavos: MoneyCentavos;
  netChangeCentavos: MoneyCentavos;
  events: string[];
}

function manilaDateString(date: Date): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Manila',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

function manilaDayOfMonth(date: Date): number {
  return Number(
    new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Manila',
      day: 'numeric',
    }).format(date)
  );
}

export function projectCashFlow(
  profile: PersonaProfile,
  startDate: Date,
  days: number = 30
): DailyProjection[] {
  let runningBalance = profile.accounts
    .filter((account) => account.isSpendable)
    .reduce((sum, account) => sum + account.balanceCentavos, 0);

  const projections: DailyProjection[] = [];

  for (let i = 0; i < days; i++) {
    const d = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
    const dateStr = manilaDateString(d);
    const dayOfMonth = manilaDayOfMonth(d);
    let net = 0;
    const events: string[] = [];

    if (profile.paydayDays.includes(dayOfMonth)) {
      const paydayAmount = Math.round(
        profile.monthlyNetCentavos / Math.max(1, profile.paydayDays.length)
      );
      net += paydayAmount;
      events.push('Expected income');
    }

    profile.commitments.forEach((commitment) => {
      if (!commitment.isPaid && commitment.dueDate === dateStr) {
        net -= commitment.amountCentavos;
        events.push(commitment.title);
      }
    });

    profile.debts.forEach((debt) => {
      if (debt.minimumDueCentavos > 0 && debt.dueDate === dateStr) {
        net -= debt.minimumDueCentavos;
        events.push(`${debt.name} minimum due`);
      }
    });

    profile.ious.forEach((iou) => {
      if (
        iou.direction === 'i_owe' &&
        iou.status !== 'settled' &&
        iou.amountCentavos > 0 &&
        iou.dueDate === dateStr
      ) {
        net -= iou.amountCentavos;
        events.push(`IOU due to ${iou.personName}`);
      }
    });

    net -= profile.essentialDailyRunRateCentavos;
    runningBalance += net;

    projections.push({
      date: dateStr,
      projectedBalanceCentavos: runningBalance,
      netChangeCentavos: net,
      events,
    });
  }

  return projections;
}
