import React, { useState } from 'react';
import { useKivra } from '../../state/kivraStore';
import { projectCashFlow } from '../../domain/finance/cashFlow';
import { prototypeClock } from '../../domain/clock';
import { CashFlowChart } from '../../components/kivra/CashFlowChart';
import { SectionHeader } from '../../components/kivra/SectionHeader';
import { MoneyFigure } from '../../components/kivra/MoneyFigure';

export const PlanView: React.FC = () => {
  const { currentPersona } = useKivra();
  const [scenarioCoffee, setScenarioCoffee] = useState(false);
  const [scenarioIncomeDrop, setScenarioIncomeDrop] = useState(false);

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

      {/* What-If Scenarios */}
      <section className="bg-surface border border-ink-hairline rounded-xl p-4">
        <SectionHeader title="Interactive What-If Scenarios" />
        <p className="text-xs text-ink-muted mb-3">Test decision outcomes before moving actual funds.</p>
        <div className="space-y-2">
          <label className="flex items-center justify-between p-3 bg-surface-alt rounded-lg border border-ink-hairline cursor-pointer">
            <div>
              <span className="text-sm font-medium text-ink block">Cut coffee frequency to 3× weekly</span>
              <span className="text-xs text-pine font-medium">+₱960 projected monthly runway</span>
            </div>
            <input
              type="checkbox"
              checked={scenarioCoffee}
              onChange={() => setScenarioCoffee(!scenarioCoffee)}
              className="w-4 h-4 text-pine rounded focus:ring-pine"
            />
          </label>

          <label className="flex items-center justify-between p-3 bg-surface-alt rounded-lg border border-ink-hairline cursor-pointer">
            <div>
              <span className="text-sm font-medium text-ink block">Model 20% irregular income delay</span>
              <span className="text-xs text-amber font-medium">Shortens runway by 4 days</span>
            </div>
            <input
              type="checkbox"
              checked={scenarioIncomeDrop}
              onChange={() => setScenarioIncomeDrop(!scenarioIncomeDrop)}
              className="w-4 h-4 text-pine rounded focus:ring-pine"
            />
          </label>
        </div>
      </section>
    </div>
  );
};
