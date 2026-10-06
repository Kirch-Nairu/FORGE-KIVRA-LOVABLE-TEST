import { PersonaProfile, MoneyCentavos } from '../types';
import { calculateSafeToSpend, SafeToSpendResult } from './safeToSpend';

export interface PlanScenarioOptions {
  reduceDiscretionaryMonthlyCentavos?: MoneyCentavos; // e.g. coffee cap
  incomeVariancePercent?: number; // e.g. -20% or +10%
  delayPaydayDays?: number; // e.g. +4 days
  extraIncomeCentavos?: MoneyCentavos; // e.g. +₱5,000 gig
  extraDebtPaymentCentavos?: MoneyCentavos; // e.g. +₱1,000 to CC
  plannedImmediatePurchaseCentavos?: MoneyCentavos; // e.g. buy ₱2,500 item now
}

export interface PlanScenarioResult {
  baselineSts: SafeToSpendResult;
  simulatedSts: SafeToSpendResult;
  dailyDeltaPesos: number;
  totalDeltaPesos: number;
  runwayDeltaDays: number;
  summary: string;
}

export function evaluatePlanScenario(
  profile: PersonaProfile,
  currentDate: Date,
  options: PlanScenarioOptions
): PlanScenarioResult {
  const baseline = calculateSafeToSpend(profile, currentDate);

  // Clone profile for simulation
  const simProfile: PersonaProfile = JSON.parse(JSON.stringify(profile));

  if (options.delayPaydayDays && options.delayPaydayDays !== 0) {
    const curDate = new Date(simProfile.nextPayday);
    curDate.setDate(curDate.getDate() + options.delayPaydayDays);
    simProfile.nextPayday = curDate.toISOString().split('T')[0];
  }

  if (options.plannedImmediatePurchaseCentavos) {
    // Deduct from first spendable account
    const acc = simProfile.accounts.find((a) => a.isSpendable);
    if (acc) {
      acc.balanceCentavos = Math.max(0, acc.balanceCentavos - options.plannedImmediatePurchaseCentavos);
    }
  }

  if (options.extraIncomeCentavos) {
    const acc = simProfile.accounts.find((a) => a.isSpendable);
    if (acc) {
      acc.balanceCentavos += options.extraIncomeCentavos;
    }
  }

  if (options.extraDebtPaymentCentavos && simProfile.debts.length > 0) {
    const acc = simProfile.accounts.find((a) => a.isSpendable);
    if (acc) {
      acc.balanceCentavos = Math.max(0, acc.balanceCentavos - options.extraDebtPaymentCentavos);
    }
    const debt = simProfile.debts[0];
    debt.remainingBalanceCentavos = Math.max(0, debt.remainingBalanceCentavos - options.extraDebtPaymentCentavos);
  }

  if (options.reduceDiscretionaryMonthlyCentavos) {
    // Lowers daily essential/discretionary run rate pressure
    const dailySaving = Math.round(options.reduceDiscretionaryMonthlyCentavos / 30);
    simProfile.essentialDailyRunRateCentavos = Math.max(1000, simProfile.essentialDailyRunRateCentavos - dailySaving);
  }

  const simulated = calculateSafeToSpend(simProfile, currentDate);

  const dailyDeltaPesos = Math.round((simulated.stsDailyCentavos - baseline.stsDailyCentavos) / 100);
  const totalDeltaPesos = Math.round((simulated.stsTotalCentavos - baseline.stsTotalCentavos) / 100);
  const runwayDeltaDays = simulated.horizonDays - baseline.horizonDays;

  let summary = 'Scenario maintains baseline projection.';
  if (dailyDeltaPesos > 0) {
    summary = `Expands daily Safe-to-Spend by +₱${dailyDeltaPesos}/day (+₱${totalDeltaPesos.toLocaleString('en-PH')} total).`;
  } else if (dailyDeltaPesos < 0) {
    summary = `Reduces daily Safe-to-Spend by ₱${Math.abs(dailyDeltaPesos)}/day (₱${Math.abs(totalDeltaPesos).toLocaleString('en-PH')} total).`;
  }

  return {
    baselineSts: baseline,
    simulatedSts: simulated,
    dailyDeltaPesos,
    totalDeltaPesos,
    runwayDeltaDays,
    summary,
  };
}

export interface GoalWhatIfResult {
  currentMonthlyPesos: number;
  newMonthlyPesos: number;
  monthsToTargetCurrent: number;
  monthsToTargetNew: number;
  monthsSaved: number;
  completionDateCurrent: string;
  completionDateNew: string;
}

export function evaluateGoalWhatIf(
  currentCentavos: MoneyCentavos,
  targetCentavos: MoneyCentavos,
  baseMonthlyCentavos: MoneyCentavos,
  deltaMonthlyCentavos: MoneyCentavos,
  currentDate: Date
): GoalWhatIfResult {
  const remainingCentavos = Math.max(0, targetCentavos - currentCentavos);
  const curMonthly = Math.max(10000, baseMonthlyCentavos);
  const newMonthly = Math.max(10000, baseMonthlyCentavos + deltaMonthlyCentavos);

  const monthsCurrent = Math.ceil(remainingCentavos / curMonthly);
  const monthsNew = Math.ceil(remainingCentavos / newMonthly);
  const monthsSaved = Math.max(0, monthsCurrent - monthsNew);

  const d1 = new Date(currentDate);
  d1.setMonth(d1.getMonth() + monthsCurrent);
  const completionDateCurrent = d1.toISOString().split('T')[0];

  const d2 = new Date(currentDate);
  d2.setMonth(d2.getMonth() + monthsNew);
  const completionDateNew = d2.toISOString().split('T')[0];

  return {
    currentMonthlyPesos: Math.round(curMonthly / 100),
    newMonthlyPesos: Math.round(newMonthly / 100),
    monthsToTargetCurrent: monthsCurrent,
    monthsToTargetNew: monthsNew,
    monthsSaved,
    completionDateCurrent,
    completionDateNew,
  };
}
