import React from 'react';
import { useKivra } from '../../state/kivraStore';
import { SectionHeader } from '../../components/kivra/SectionHeader';
import { MoneyFigure } from '../../components/kivra/MoneyFigure';
import { Target, HeartHandshake } from 'lucide-react';

export const GoalsView: React.FC = () => {
  const { currentPersona } = useKivra();

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-baseline">
        <h1 className="text-xl font-bold tracking-tight text-ink">Goals & Wants</h1>
        <span className="text-xs text-ink-muted">Funded objectives</span>
      </div>

      {/* Goals */}
      <section className="bg-surface border border-ink-hairline rounded-xl p-4 space-y-4">
        <SectionHeader title="Active Goals" />
        {currentPersona.goals.map((g) => {
          const progress = Math.min(100, Math.round((g.currentCentavos / g.targetCentavos) * 100));
          return (
            <div key={g.id} className="p-3 bg-surface-alt rounded-lg border border-ink-hairline space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-semibold text-ink">{g.title}</h3>
                  <span className="text-xs text-ink-muted">Target: {g.targetDate} · ₱{(g.monthlyContributionCentavos / 100).toFixed(0)}/mo</span>
                </div>
                <span className="text-xs font-bold text-pine tabular-nums">{progress}%</span>
              </div>
              <div className="w-full bg-ink-hairline h-2 rounded-full overflow-hidden">
                <div className="bg-pine h-full rounded-full transition-all" style={{ width: `${progress}%` }} />
              </div>
              <div className="flex justify-between text-xs text-ink-muted">
                <span>Current: <MoneyFigure centavos={g.currentCentavos} size="sm" semantic="neutral" /></span>
                <span>Target: <MoneyFigure centavos={g.targetCentavos} size="sm" semantic="neutral" /></span>
              </div>
            </div>
          );
        })}
      </section>

      {/* Wants / Cooling-Off items */}
      <section className="bg-surface border border-ink-hairline rounded-xl p-4">
        <SectionHeader title="Wants & Cooling-Off List" />
        <p className="text-xs text-ink-muted mb-3">Discretionary desires tested before impulse buying.</p>
        {currentPersona.wants.length === 0 ? (
          <p className="text-xs text-ink-muted py-2">No active items in cooling off.</p>
        ) : (
          <div className="divide-y divide-ink-hairline">
            {currentPersona.wants.map((w) => (
              <div key={w.id} className="py-2.5 flex justify-between items-center text-sm">
                <div>
                  <span className="font-medium text-ink block">{w.title}</span>
                  <span className="text-xs text-ink-muted">{w.notes || 'In cooling off period'}</span>
                </div>
                <div className="text-right">
                  <MoneyFigure centavos={w.priceCentavos} size="sm" semantic="neutral" />
                  <span className="text-[10px] text-amber block font-medium">Cooling {w.coolingOffDays}d</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
