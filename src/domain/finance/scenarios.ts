import { PersonaProfile, MoneyCentavos } from '../types';
import { calculateSafeToSpend, SafeToSpendResult } from './safeToSpend';

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

  const monthsCurrent = remainingCentavos === 0 ? 0 : Math.ceil(remainingCentavos / curMonthly);
  const monthsNew = remainingCentavos === 0 ? 0 : Math.ceil(remainingCentavos / newMonthly);
  const monthsSaved = Math.max(0, monthsCurrent - monthsNew);

  const d1 = new Date(currentDate);
  d1.setMonth(d1.getMonth() + monthsCurrent);

  const d2 = new Date(currentDate);
  d2.setMonth(d2.getMonth() + monthsNew);

  return {
    currentMonthlyPesos: Math.round(curMonthly / 100),
    newMonthlyPesos: Math.round(newMonthly / 100),
    monthsToTargetCurrent: monthsCurrent,
    monthsToTargetNew: monthsNew,
    monthsSaved,
    completionDateCurrent: d1.toISOString().split('T')[0],
    completionDateNew: d2.toISOString().split('T')[0],
  };
}
