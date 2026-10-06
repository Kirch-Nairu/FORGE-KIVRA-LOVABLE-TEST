import { PersonaProfile, FinancialHealthDimension } from '../types';
import { calculateSafeToSpend } from './safeToSpend';

export function evaluateFinancialHealth(profile: PersonaProfile, currentDate: Date): FinancialHealthDimension[] {
  const sts = calculateSafeToSpend(profile, currentDate);
  const totalDebtCentavos = profile.debts.reduce((s, d) => s + d.remainingBalanceCentavos, 0);
  const totalDebtMinCentavos = profile.debts.reduce((s, d) => s + d.minimumDueCentavos, 0);
  const totalAssetsCentavos = profile.accounts.reduce((s, a) => s + a.balanceCentavos, 0);
  const protectedSavingsCentavos = profile.accounts
    .filter((a) => !a.isSpendable || a.type === 'savings' || a.type === 'digital_bank')
    .reduce((s, a) => s + a.balanceCentavos, 0);

  // 1. Cash stability & Runway
  const cashStabilityLevel: 'Robust' | 'Adequate' | 'Tight' | 'Vulnerable' =
    sts.status === 'Comfortable' ? 'Robust' : sts.status === 'Balanced' ? 'Adequate' : sts.status === 'Tight' ? 'Tight' : 'Vulnerable';
  const cashFactors = [
    `Next confirmed inflow scheduled on ${profile.nextPayday}`,
    `Spendable cash isolated across ${profile.accounts.filter((a) => a.isSpendable).length} active transaction accounts`,
  ];

  // 2. Debt pressure
  let debtLevel: 'Robust' | 'Adequate' | 'Tight' | 'Vulnerable' = 'Robust';
  let debtExplanation = 'Zero active debt obligations recorded.';
  let debtFactors: string[] = ['No active revolving or amortized loans'];

  if (profile.debts.length > 0) {
    if (totalDebtCentavos > 2000000 || totalDebtMinCentavos > profile.monthlyNetCentavos * 0.25) {
      debtLevel = 'Tight';
    } else {
      debtLevel = 'Adequate';
    }
    const debtNames = profile.debts.map((d) => d.name).join(', ');
    debtExplanation = `Active obligations require monthly debt service of ₱${(totalDebtMinCentavos / 100).toLocaleString('en-PH')}.`;
    debtFactors = [
      `Obligations: ${debtNames}`,
      `Total outstanding principal: ₱${(totalDebtCentavos / 100).toLocaleString('en-PH')}`,
    ];
  }

  // 3. Emergency Buffer
  const baselineMonthlyCostCentavos = profile.essentialDailyRunRateCentavos * 30;
  const emergencyMonths = baselineMonthlyCostCentavos > 0 ? (protectedSavingsCentavos / baselineMonthlyCostCentavos).toFixed(1) : '0';
  let emergencyLevel: 'Robust' | 'Adequate' | 'Tight' | 'Vulnerable' = 'Tight';
  if (protectedSavingsCentavos >= baselineMonthlyCostCentavos * 3) {
    emergencyLevel = 'Robust';
  } else if (protectedSavingsCentavos >= baselineMonthlyCostCentavos * 1) {
    emergencyLevel = 'Adequate';
  }

  // 4. Spending Control
  const lateNightOrders = profile.transactions.filter((t) => {
    const h = new Date(t.timestamp).getHours();
    return t.type === 'expense' && (h >= 21 || h < 4);
  }).length;
  const spendingControlLevel: 'Robust' | 'Adequate' | 'Tight' =
    lateNightOrders > 3 ? 'Tight' : lateNightOrders > 0 ? 'Adequate' : 'Robust';

  // 5. Goal Momentum
  let goalExplanation = 'No funded goals currently active.';
  let goalFactors = ['Create a goal to allocate surplus cash'];
  let goalLevel: 'Robust' | 'Adequate' | 'Tight' = 'Adequate';

  if (profile.goals.length > 0) {
    const primaryGoal = profile.goals[0];
    const pct = Math.min(100, Math.round((primaryGoal.currentCentavos / primaryGoal.targetCentavos) * 100));
    goalExplanation = `Primary goal "${primaryGoal.title}" is ${pct}% funded (target: ${primaryGoal.targetDate}).`;
    goalFactors = [
      `₱${(primaryGoal.currentCentavos / 100).toLocaleString('en-PH')} saved toward ₱${(primaryGoal.targetCentavos / 100).toLocaleString('en-PH')}`,
      `Monthly allocation: ₱${(primaryGoal.monthlyContributionCentavos / 100).toLocaleString('en-PH')}`,
    ];
    goalLevel = pct >= 50 ? 'Robust' : pct >= 20 ? 'Adequate' : 'Tight';
  }

  // 6. Obligation Coverage
  const billsAndDebtCentavos = sts.billsCentavos + sts.debtMinCentavos;
  const coverageLevel: 'Robust' | 'Adequate' | 'Tight' | 'Vulnerable' =
    sts.accessibleCentavos >= billsAndDebtCentavos + sts.essentialsCentavos
      ? 'Robust'
      : sts.accessibleCentavos >= billsAndDebtCentavos
      ? 'Adequate'
      : 'Vulnerable';

  return [
    {
      id: 'cash_stability',
      name: 'Cash Stability & Runway',
      level: cashStabilityLevel,
      explanation: `${sts.horizonDays} days until next guaranteed inflow; daily safe runway is ₱${(sts.stsDailyCentavos / 100).toFixed(0)}.`,
      factors: cashFactors,
    },
    {
      id: 'debt_pressure',
      name: 'Debt Service Pressure',
      level: debtLevel,
      explanation: debtExplanation,
      factors: debtFactors,
    },
    {
      id: 'emergency_readiness',
      name: 'Emergency Buffer',
      level: emergencyLevel,
      explanation: `Protected savings hold approximately ${emergencyMonths} months of baseline survival costs.`,
      factors: [
        `₱${(protectedSavingsCentavos / 100).toLocaleString('en-PH')} in protected or digital bank accounts`,
        `Baseline essential run-rate: ₱${(profile.essentialDailyRunRateCentavos / 100).toFixed(0)}/day`,
      ],
    },
    {
      id: 'spending_control',
      name: 'Behavioral Spending Control',
      level: spendingControlLevel,
      explanation:
        lateNightOrders > 0
          ? `${lateNightOrders} unbudgeted late-evening orders identified in recent history.`
          : 'Discretionary spending remains within regular daytime cadence.',
      factors: [
        `${profile.transactions.filter((t) => t.type === 'expense').length} tracked expense entries`,
        'Observation pace stable',
      ],
    },
    {
      id: 'goal_momentum',
      name: 'Goal Funding Momentum',
      level: goalLevel,
      explanation: goalExplanation,
      factors: goalFactors,
    },
    {
      id: 'obligation_coverage',
      name: 'Committed Obligation Coverage',
      level: coverageLevel,
      explanation:
        coverageLevel === 'Robust'
          ? 'Accessible cash covers 100% of unpaid bills, debt minimums, and baseline essentials until payday.'
          : 'Accessible cash covers fixed commitments but leaves narrow discretionary cushion.',
      factors: [
        `Unpaid bills & minimums due <= payday: ₱${(billsAndDebtCentavos / 100).toLocaleString('en-PH')}`,
        `Accessible spendable funds: ₱${(sts.accessibleCentavos / 100).toLocaleString('en-PH')}`,
      ],
    },
  ];
}
