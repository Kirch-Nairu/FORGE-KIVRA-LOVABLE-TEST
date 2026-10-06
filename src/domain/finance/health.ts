import { PersonaProfile, FinancialHealthDimension } from '../types';
import { calculateSafeToSpend } from './safeToSpend';

export function evaluateFinancialHealth(profile: PersonaProfile, currentDate: Date): FinancialHealthDimension[] {
  const sts = calculateSafeToSpend(profile, currentDate);
  const totalDebt = profile.debts.reduce((s, d) => s + d.remainingBalanceCentavos, 0);
  const totalAssets = profile.accounts.reduce((s, a) => s + a.balanceCentavos, 0);

  return [
    {
      id: 'cash_stability',
      name: 'Cash Stability & Runway',
      level: sts.status === 'Comfortable' ? 'Robust' : sts.status === 'Balanced' ? 'Adequate' : 'Tight',
      explanation: `${sts.horizonDays} days until next guaranteed inflow; daily safe runway is ₱${(sts.stsDailyCentavos / 100).toFixed(0)}.`,
      factors: ['Next confirmed income 15 Oct', 'Spendable cash isolated from savings'],
    },
    {
      id: 'debt_pressure',
      name: 'Debt Service Pressure',
      level: totalDebt > 1000000 ? 'Tight' : totalDebt > 0 ? 'Adequate' : 'Robust',
      explanation: `Active obligations require monthly debt service of ₱${(profile.debts.reduce((s, d) => s + d.minimumDueCentavos, 0) / 100).toFixed(0)}.`,
      factors: ['Credit card revolving balance', 'Salary loan amortization'],
    },
    {
      id: 'emergency_readiness',
      name: 'Emergency Buffer',
      level: totalAssets > profile.essentialDailyRunRateCentavos * 90 ? 'Robust' : 'Adequate',
      explanation: 'Dedicated emergency account holds approximately 1.5 months of baseline survival costs.',
      factors: ['₱25,000 isolated in emergency pocket'],
    },
    {
      id: 'spending_control',
      name: 'Behavioral Spending Control',
      level: 'Adequate',
      explanation: 'Discretionary bursts concentrate heavily around post-payday 48h and late evenings.',
      factors: ['Payday impulse clustering', 'Coffee daily baseline stable'],
    },
    {
      id: 'goal_momentum',
      name: 'Goal Funding Momentum',
      level: 'Adequate',
      explanation: 'Laptop goal is on track with recurring monthly ₱2,000 reservation allocations.',
      factors: ['₱12,400 saved out of ₱35,000 goal'],
    },
    {
      id: 'obligation_coverage',
      name: 'Committed Obligation Coverage',
      level: sts.accessibleCentavos >= (sts.billsCentavos + sts.debtMinCentavos) ? 'Robust' : 'Vulnerable',
      explanation: 'All bills and debt minimums due before payday are 100% covered by accessible cash.',
      factors: ['Rent, Telco, and CC minimums ring-fenced'],
    },
  ];
}
