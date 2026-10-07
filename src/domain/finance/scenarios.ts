import { PersonaProfile, MoneyCentavos } from '../types';
import { calculateSafeToSpend, SafeToSpendResult } from './safeToSpend';
import { getManilaDateKey } from '../clock';

export interface PlanScenarioOptions {
  reduceDiscretionaryMonthlyCentavos?: MoneyCentavos;
  delayPaydayDays?: number;
  extraIncomeCentavos?: MoneyCentavos;
  extraDebtPaymentCentavos?: MoneyCentavos;
  plannedImmediatePurchaseCentavos?: MoneyCentavos;
}

export interface PlanScenarioResult {
  baselineSts: SafeToSpendResult;
  simulatedSts: SafeToSpendResult;
  dailyDeltaPesos: number;
  totalDeltaPesos: number;
  runwayDeltaDays: number;
  behavioralSavingsPesos: number;
  debtMinimumReliefPesos: number;
  unfundedPurchasePesos: number;
  summary: string;
  effects: string[];
}

function withdrawFromSpendable(profile: PersonaProfile, requestedCentavos: number): number {
  let remaining = Math.max(0, requestedCentavos);

  for (const account of profile.accounts) {
    if (!account.isSpendable || remaining <= 0) continue;
    const taken = Math.min(account.balanceCentavos, remaining);
    account.balanceCentavos -= taken;
    remaining -= taken;
  }

  return requestedCentavos - remaining;
}

function depositToFirstSpendable(profile: PersonaProfile, amountCentavos: number) {
  const account = profile.accounts.find((a) => a.isSpendable);
  if (account) account.balanceCentavos += Math.max(0, amountCentavos);
}

export function evaluatePlanScenario(
  profile: PersonaProfile,
  currentDate: Date,
  options: PlanScenarioOptions
): PlanScenarioResult {
  const baseline = calculateSafeToSpend(profile, currentDate);
  const simProfile: PersonaProfile = JSON.parse(JSON.stringify(profile));
  const effects: string[] = [];

  let behavioralSavingsCentavos = 0;
  let debtMinimumReliefCentavos = 0;
  let unfundedPurchaseCentavos = 0;

  if (options.delayPaydayDays && options.delayPaydayDays !== 0) {
    const nextIncome = new Date(`${simProfile.nextPayday}T12:00:00+08:00`);
    nextIncome.setDate(nextIncome.getDate() + options.delayPaydayDays);
    simProfile.nextPayday = nextIncome.toISOString().split('T')[0];
    effects.push(`Next confirmed income moved by ${options.delayPaydayDays} day(s).`);
  }

  if (options.plannedImmediatePurchaseCentavos && options.plannedImmediatePurchaseCentavos > 0) {
    const requested = options.plannedImmediatePurchaseCentavos;
    const funded = withdrawFromSpendable(simProfile, requested);
    unfundedPurchaseCentavos = Math.max(0, requested - funded);

    effects.push(
      unfundedPurchaseCentavos > 0
        ? `Only ₱${Math.round(funded / 100).toLocaleString('en-PH')} of the planned purchase is fundable from current spendable accounts; ₱${Math.round(
            unfundedPurchaseCentavos / 100
          ).toLocaleString('en-PH')} remains unfunded.`
        : `Planned purchase removes ₱${Math.round(requested / 100).toLocaleString('en-PH')} from spendable cash now.`
    );
  }

  if (options.extraIncomeCentavos && options.extraIncomeCentavos > 0) {
    depositToFirstSpendable(simProfile, options.extraIncomeCentavos);
    effects.push(
      `Extra confirmed income adds ₱${Math.round(options.extraIncomeCentavos / 100).toLocaleString('en-PH')} to spendable cash.`
    );
  }

  if (options.extraDebtPaymentCentavos && options.extraDebtPaymentCentavos > 0 && simProfile.debts.length > 0) {
    const debt = simProfile.debts[0];
    const requested = Math.min(options.extraDebtPaymentCentavos, debt.remainingBalanceCentavos);
    const funded = withdrawFromSpendable(simProfile, requested);

    if (funded > 0) {
      debt.remainingBalanceCentavos = Math.max(0, debt.remainingBalanceCentavos - funded);
      debtMinimumReliefCentavos = Math.min(debt.minimumDueCentavos, funded);
      debt.minimumDueCentavos = Math.max(0, debt.minimumDueCentavos - debtMinimumReliefCentavos);
      effects.push(
        `Extra debt payment applies ₱${Math.round(funded / 100).toLocaleString(
          'en-PH'
        )}; ₱${Math.round(debtMinimumReliefCentavos / 100).toLocaleString(
          'en-PH'
        )} of the current minimum obligation is satisfied in this simplified model.`
      );
    }
  }

  if (options.reduceDiscretionaryMonthlyCentavos && options.reduceDiscretionaryMonthlyCentavos > 0) {
    // Discretionary habit reductions are not essential-cost reductions.
    // They therefore do not alter the current STS waterfall directly.
    behavioralSavingsCentavos = options.reduceDiscretionaryMonthlyCentavos;
    effects.push(
      `Behavior change preserves about ₱${Math.round(behavioralSavingsCentavos / 100).toLocaleString(
        'en-PH'
      )}/month outside the essential-cost STS waterfall.`
    );
  }

  const simulated = calculateSafeToSpend(simProfile, currentDate);

  const dailyDeltaPesos = Math.round(
    (simulated.stsDailyCentavos - baseline.stsDailyCentavos) / 100
  );
  const totalDeltaPesos = Math.round(
    (simulated.stsTotalCentavos - baseline.stsTotalCentavos) / 100
  );
  const runwayDeltaDays = simulated.horizonDays - baseline.horizonDays;

  let summary = 'Scenario maintains the current Safe-to-Spend position.';
  if (dailyDeltaPesos > 0) {
    summary = `Expands current Safe-to-Spend by +₱${dailyDeltaPesos}/day (+₱${totalDeltaPesos.toLocaleString(
      'en-PH'
    )} total).`;
  } else if (dailyDeltaPesos < 0) {
    summary = `Reduces current Safe-to-Spend by ₱${Math.abs(
      dailyDeltaPesos
    )}/day (₱${Math.abs(totalDeltaPesos).toLocaleString('en-PH')} total).`;
  } else if (behavioralSavingsCentavos > 0) {
    summary = `Today's STS is unchanged; the selected behavior change preserves about ₱${Math.round(
      behavioralSavingsCentavos / 100
    ).toLocaleString('en-PH')}/month for future allocation.`;
  }

  return {
    baselineSts: baseline,
    simulatedSts: simulated,
    dailyDeltaPesos,
    totalDeltaPesos,
    runwayDeltaDays,
    behavioralSavingsPesos: Math.round(behavioralSavingsCentavos / 100),
    debtMinimumReliefPesos: Math.round(debtMinimumReliefCentavos / 100),
    unfundedPurchasePesos: Math.round(unfundedPurchaseCentavos / 100),
    summary,
    effects,
  };
}

export interface GoalWhatIfResult {
  currentMonthlyPesos: number;
  newMonthlyPesos: number;
  monthsToTargetCurrent: number | null;
  monthsToTargetNew: number | null;
  monthsSaved: number | null;
  completionDateCurrent: string | null;
  completionDateNew: string | null;
}

// Add month to Manila date with day-of-month clamping
function addMonthsManilaDate(date: Date, months: number): string {
  const dateKey = getManilaDateKey(date);
  const [year, month, day] = dateKey.split('-').map(Number);
  
  let newMonth = month + months;
  let newYear = year;
  
  while (newMonth > 12) {
    newMonth -= 12;
    newYear += 1;
  }
  while (newMonth < 1) {
    newMonth += 12;
    newYear -= 1;
  }
  
  // Clamp day to valid range for target month
  const lastDayOfMonth = new Date(newYear, newMonth, 0).getDate();
  const clampedDay = Math.min(day, lastDayOfMonth);
  
  return `${newYear}-${String(newMonth).padStart(2, '0')}-${String(clampedDay).padStart(2, '0')}`;
}

export function evaluateGoalWhatIf(
  currentCentavos: MoneyCentavos,
  targetCentavos: MoneyCentavos,
  baseMonthlyCentavos: MoneyCentavos,
  deltaMonthlyCentavos: MoneyCentavos,
  currentDate: Date
): GoalWhatIfResult {
  const remainingCentavos = Math.max(0, targetCentavos - currentCentavos);
  const curMonthly = Math.max(0, baseMonthlyCentavos);
  const newMonthly = Math.max(0, baseMonthlyCentavos + deltaMonthlyCentavos);
  const currentDateKey = getManilaDateKey(currentDate);

  // Rule B: Already achieved
  if (remainingCentavos === 0) {
    return {
      currentMonthlyPesos: Math.round(curMonthly / 100),
      newMonthlyPesos: Math.round(newMonthly / 100),
      monthsToTargetCurrent: 0,
      monthsToTargetNew: 0,
      monthsSaved: 0,
      completionDateCurrent: currentDateKey,
      completionDateNew: currentDateKey,
    };
  }

  // Rule C: Zero contribution means unreachable
  const monthsCurrent = curMonthly > 0 ? Math.ceil(remainingCentavos / curMonthly) : null;
  const monthsNew = newMonthly > 0 ? Math.ceil(remainingCentavos / newMonthly) : null;

  // Rule E: monthsSaved only when both projections are reachable
  const monthsSaved =
    monthsCurrent !== null && monthsNew !== null ? Math.max(0, monthsCurrent - monthsNew) : null;

  // Completion dates use Manila date authority
  const completionDateCurrent = monthsCurrent !== null ? addMonthsManilaDate(currentDate, monthsCurrent) : null;
  const completionDateNew = monthsNew !== null ? addMonthsManilaDate(currentDate, monthsNew) : null;

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
