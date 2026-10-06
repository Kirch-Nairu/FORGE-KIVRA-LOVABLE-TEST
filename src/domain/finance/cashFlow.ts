import { PersonaProfile, MoneyCentavos } from '../types';

export interface DailyProjection {
  date: string;
  projectedBalanceCentavos: MoneyCentavos;
  netChangeCentavos: MoneyCentavos;
  events: string[];
}

export function projectCashFlow(profile: PersonaProfile, startDate: Date, days: number = 30): DailyProjection[] {
  let runningBalance = profile.accounts.reduce((s, a) => s + a.balanceCentavos, 0);
  const projections: DailyProjection[] = [];

  for (let i = 0; i < days; i++) {
    const d = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
    const dateStr = d.toISOString().split('T')[0];
    const dayOfMonth = d.getDate();
    let net = 0;
    const events: string[] = [];

    // Check paydays
    if (profile.paydayDays.includes(dayOfMonth)) {
      net += profile.monthlyNetCentavos / profile.paydayDays.length;
      events.push('Payday Net Inflow');
    }

    // Check commitments
    profile.commitments.forEach((c) => {
      if (c.dueDate === dateStr) {
        net -= c.amountCentavos;
        events.push(`${c.title} (${c.isSubscription ? 'Sub' : 'Bill'})`);
      }
    });

    // Check debts
    profile.debts.forEach((deb) => {
      if (deb.dueDate === dateStr) {
        net -= deb.minimumDueCentavos;
        events.push(`${deb.name} Min Due`);
      }
    });

    // Run-rate essentials
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
