import React from 'react';
import { SafeToSpendResult } from '../../domain/finance/safeToSpend';
import { MoneyFigure } from './MoneyFigure';
import { useKivra } from '../../state/kivraStore';

interface WaterfallProps {
  math: SafeToSpendResult;
}

export const Waterfall: React.FC<WaterfallProps> = ({ math }) => {
  const { currentPersona, isPrivacyMasked } = useKivra();
  const dailyRunRatePesos = Math.round(currentPersona.essentialDailyRunRateCentavos / 100);

  return (
    <div className="space-y-3 font-sans text-sm">
      <div className="flex justify-between items-center py-1">
        <span className="text-ink font-medium">1. Accessible Spendable Cash</span>
        <MoneyFigure centavos={math.accessibleCentavos} size="sm" semantic="pine" />
      </div>

      <div className="pl-3 border-l-2 border-ink-hairline space-y-2 text-ink-muted">
        <div className="flex justify-between items-center">
          <span>− Ring-Fenced Reservations</span>
          <MoneyFigure centavos={-math.reservedCentavos} size="sm" semantic="neutral" showSign />
        </div>
        <div className="flex justify-between items-center">
          <span>− Unpaid Bills due before payday</span>
          <MoneyFigure centavos={-math.billsCentavos} size="sm" semantic="neutral" showSign />
        </div>
        <div className="flex justify-between items-center">
          <span>− Debt Minimums due</span>
          <MoneyFigure centavos={-math.debtMinCentavos} size="sm" semantic="neutral" showSign />
        </div>
        <div className="flex justify-between items-center">
          <span>
            − Essentials ({math.horizonDays} days × {isPrivacyMasked ? '₱••••••' : `₱${dailyRunRatePesos}`}/day)
          </span>
          <MoneyFigure centavos={-math.essentialsCentavos} size="sm" semantic="neutral" showSign />
        </div>
        <div className="flex justify-between items-center">
          <span>− Safety Cushion ({currentPersona.cushionDays}d)</span>
          <MoneyFigure centavos={-math.cushionCentavos} size="sm" semantic="neutral" showSign />
        </div>
      </div>

      <div className="pt-2 border-t border-ink-hairline flex justify-between items-center font-bold">
        <span className="text-ink">Safe-to-Spend Total</span>
        <MoneyFigure centavos={math.stsTotalCentavos} size="md" semantic="pine" />
      </div>

      <div className="flex justify-between items-center text-xs text-ink-muted">
        <span>Daily Discretionary Allowance (over {math.horizonDays} days)</span>
        <MoneyFigure centavos={math.stsDailyCentavos} size="sm" semantic="pine" />
      </div>
    </div>
  );
};
