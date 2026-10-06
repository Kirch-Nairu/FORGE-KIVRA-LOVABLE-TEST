import { PersonaProfile, MoneyCentavos } from '../types';
import { calculateSafeToSpend } from './safeToSpend';

export interface AffordabilityVerdict {
  canAffordWithoutRisk: boolean;
  stsImpactCentavos: MoneyCentavos;
  newStsDailyCentavos: MoneyCentavos;
  runwayImpactDays: number;
  suggestedAction: 'buy_now' | 'wait_48h' | 'split_payment' | 'add_to_wants';
  rationale: string;
}

export function evaluateAffordability(
  profile: PersonaProfile,
  amountCentavos: MoneyCentavos,
  currentDate: Date
): AffordabilityVerdict {
  const currentSts = calculateSafeToSpend(profile, currentDate);
  const diff = currentSts.stsTotalCentavos - amountCentavos;

  if (diff >= currentSts.horizonDays * 10000) {
    return {
      canAffordWithoutRisk: true,
      stsImpactCentavos: amountCentavos,
      newStsDailyCentavos: Math.max(0, Math.round(diff / currentSts.horizonDays)),
      runwayImpactDays: 0,
      suggestedAction: 'buy_now',
      rationale: 'Purchase leaves ample daily buffer before payday without risking fixed obligations.',
    };
  } else if (diff >= 0) {
    return {
      canAffordWithoutRisk: false,
      stsImpactCentavos: amountCentavos,
      newStsDailyCentavos: Math.max(0, Math.round(diff / currentSts.horizonDays)),
      runwayImpactDays: 1,
      suggestedAction: 'wait_48h',
      rationale: 'Leaves your daily discretionary budget near zero. Waiting 48h helps confirm intentionality.',
    };
  } else {
    return {
      canAffordWithoutRisk: false,
      stsImpactCentavos: amountCentavos,
      newStsDailyCentavos: 0,
      runwayImpactDays: Math.ceil(Math.abs(diff) / profile.essentialDailyRunRateCentavos),
      suggestedAction: 'add_to_wants',
      rationale: 'Exceeds current Safe-to-Spend. Buying now cuts into committed rent or debt minimums.',
    };
  }
}
