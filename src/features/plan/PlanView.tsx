import React, { useState } from 'react';
import { useKivra } from '../../state/kivraStore';
import { projectCashFlow } from '../../domain/finance/cashFlow';
import { evaluatePlanScenario } from '../../domain/finance/scenarios';
import { prototypeClock } from '../../domain/clock';
import { CashFlowChart } from '../../components/kivra/CashFlowChart';
import { SectionHeader } from '../../components/kivra/SectionHeader';
import { MoneyFigure } from '../../components/kivra/MoneyFigure';
import { TrendingUp, AlertTriangle, ArrowRight } from 'lucide-react';

export const PlanView: React.FC = () => {
  const { currentPersona, isPrivacyMasked } = useKivra();

  // Scenario toggles
  const [reduceDiscretionary, setReduceDiscretionary] = useState(false);
  const [incomeVariance, setIncomeVariance] = useState(false);
  const [extraGigIncome, setExtraGigIncome] = useState(false);
  const [extraDebtPay, setExtraDebtPay] = useState(false);
  const [plannedPurchase, setPlannedPurchase] = useState(false);

  const scenarioResult = evaluatePlanScenario(currentPersona, prototypeClock.now, {
    reduceDiscretionaryMonthlyCentavos: reduceDiscretionary ? 96000 : 0,
    delayPaydayDays: incomeVariance ? 4 : 0,
    extraIncomeCentavos: extraGigIncome ? 500000 : 0,
    extraDebtPaymentCentavos: extraDebtPay ? 100000 : 0,
    plannedImmediatePurchaseCentavos: plannedPurchase ? 250000 : 0,
  });

  const projections = projectCashFlow(currentPersona, prototypeClock.now, 30);

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-baseline">
        <h1 className="text-xl font-bold tracking-tight text-ink">Cash Flow & Obligations</h1>
        <span className="text-xs text-ink-muted">30-day projection</span>
      </div>

      <CashFlowChart projections={projections} />

      {/* Commitments & Subscriptions */}
      <section className="bg-surface border border-ink-hairline rounded-xl p-4">
        <SectionHeader title="Committed Bills & Subscriptions" />
        <div className="divide-y divide-ink-hairline">
          {currentPersona.commitments.map((c) => (
            <div key={c.id} className="py-2.5 flex justify-between items-center text-sm">
              <div>
                <span className="font-medium text-ink">{c.title}</span>
                <span className="text-xs text-ink-muted block">Due {c.dueDate} · {c.frequency}</span>
              </div>
              <div className="text-right">
                <MoneyFigure centavos={c.amountCentavos} size="sm" semantic="neutral" />
                <span className="text-[10px] text-ink-muted block">{c.isSubscription ? 'Subscription' : 'Fixed Bill'}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 10. INTERACTIVE PLAN WHAT-IF SCENARIOS */}
      <section className="bg-surface border border-ink-hairline rounded-xl p-4 space-y-3">
        <SectionHeader title="Interactive What-If Scenarios" />
        <p className="text-xs text-ink-muted">
          Toggle behavioral hypotheses. All delta metrics below are dynamically computed from your active profile.
        </p>

        {/* Live Scenario Result Banner */}
        <div className="p-3 bg-surface-alt border border-ink-hairline rounded-lg text-xs space-y-1.5">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-ink uppercase tracking-wider text-[10px]">Computed Scenario Impact</span>
            <span className="font-bold tabular-nums text-pine">
              {scenarioResult.dailyDeltaPesos >= 0 ? `+₱${scenarioResult.dailyDeltaPesos}` : `-₱${Math.abs(scenarioResult.dailyDeltaPesos)}`}/day
            </span>
          </div>
          <p className="text-ink-muted">{scenarioResult.summary}</p>
          <div className="pt-2 border-t border-ink-hairline flex justify-between text-ink text-[11px]">
            <span>Simulated STS Daily:</span>
            <span className="font-bold tabular-nums">
              {isPrivacyMasked ? '₱••••••' : `₱${(scenarioResult.simulatedSts.stsDailyCentavos / 100).toFixed(0)} / day`}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          {/* Scenario 1 */}
          <label className="flex items-center justify-between p-3 bg-surface-alt rounded-lg border border-ink-hairline cursor-pointer hover:border-pine/50 transition-colors">
            <div>
              <span className="text-sm font-medium text-ink block">Cap coffee frequency to 3× weekly</span>
              <span className="text-xs text-pine font-medium">+₱960/mo discretionary preservation</span>
            </div>
            <input
              type="checkbox"
              checked={reduceDiscretionary}
              onChange={() => setReduceDiscretionary(!reduceDiscretionary)}
              className="w-4 h-4 text-pine rounded focus:ring-pine"
            />
          </label>

          {/* Scenario 2 */}
          <label className="flex items-center justify-between p-3 bg-surface-alt rounded-lg border border-ink-hairline cursor-pointer hover:border-pine/50 transition-colors">
            <div>
              <span className="text-sm font-medium text-ink block">Model 4-day client invoice delay</span>
              <span className="text-xs text-amber font-medium">Extends runway horizon to next payday</span>
            </div>
            <input
              type="checkbox"
              checked={incomeVariance}
              onChange={() => setIncomeVariance(!incomeVariance)}
              className="w-4 h-4 text-pine rounded focus:ring-pine"
            />
          </label>

          {/* Scenario 3 */}
          <label className="flex items-center justify-between p-3 bg-surface-alt rounded-lg border border-ink-hairline cursor-pointer hover:border-pine/50 transition-colors">
            <div>
              <span className="text-sm font-medium text-ink block">Receive unexpected ₱5,000 gig payout</span>
              <span className="text-xs text-pine font-medium">+₱5,000 immediate cash inflow</span>
            </div>
            <input
              type="checkbox"
              checked={extraGigIncome}
              onChange={() => setExtraGigIncome(!extraGigIncome)}
              className="w-4 h-4 text-pine rounded focus:ring-pine"
            />
          </label>

          {/* Scenario 4 */}
          {currentPersona.debts.length > 0 && (
            <label className="flex items-center justify-between p-3 bg-surface-alt rounded-lg border border-ink-hairline cursor-pointer hover:border-pine/50 transition-colors">
              <div>
                <span className="text-sm font-medium text-ink block">Allocate extra ₱1,000 principal to CC debt</span>
                <span className="text-xs text-slate font-medium">Accelerates debt payoff & stops revolving interest</span>
              </div>
              <input
                type="checkbox"
                checked={extraDebtPay}
                onChange={() => setExtraDebtPay(!extraDebtPay)}
                className="w-4 h-4 text-pine rounded focus:ring-pine"
              />
            </label>
          )}

          {/* Scenario 5 */}
          <label className="flex items-center justify-between p-3 bg-surface-alt rounded-lg border border-ink-hairline cursor-pointer hover:border-pine/50 transition-colors">
            <div>
              <span className="text-sm font-medium text-ink block">Execute planned ₱2,500 purchase right now</span>
              <span className="text-xs text-brick font-medium">Immediately deducts from spendable cash</span>
            </div>
            <input
              type="checkbox"
              checked={plannedPurchase}
              onChange={() => setPlannedPurchase(!plannedPurchase)}
              className="w-4 h-4 text-pine rounded focus:ring-pine"
            />
          </label>
        </div>
      </section>
    </div>
  );
};
