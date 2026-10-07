import React, { useEffect, useState } from 'react';
import { useKivra } from '../../state/kivraStore';
import { evaluateGoalWhatIf } from '../../domain/finance/scenarios';
import { prototypeClock } from '../../domain/clock';
import { SectionHeader } from '../../components/kivra/SectionHeader';
import { MoneyFigure } from '../../components/kivra/MoneyFigure';
import { ArrowUpCircle, Trash2 } from 'lucide-react';
import { privacyMoneyText } from '../../lib/privacy';

export const GoalsView: React.FC = () => {
  const { currentPersona, updateWantStatus, promoteWantToGoal, isPrivacyMasked } = useKivra();
  const [selectedGoalId, setSelectedGoalId] = useState<string>(currentPersona.goals[0]?.id || '');
  const [extraContributionPesos, setExtraContributionPesos] = useState<number>(1000);

  useEffect(() => {
    if (!currentPersona.goals.some((g) => g.id === selectedGoalId)) {
      setSelectedGoalId(currentPersona.goals[0]?.id || '');
    }
  }, [currentPersona.id, currentPersona.goals, selectedGoalId]);

  const selectedGoal = currentPersona.goals.find((g) => g.id === selectedGoalId) || currentPersona.goals[0];

  const whatIfResult = selectedGoal
    ? evaluateGoalWhatIf(
        selectedGoal.currentCentavos,
        selectedGoal.targetCentavos,
        selectedGoal.monthlyContributionCentavos,
        extraContributionPesos * 100,
        prototypeClock.now
      )
    : null;

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-baseline">
        <h1 className="text-xl font-bold tracking-tight text-ink">Goals & Wants</h1>
        <span className="text-xs text-ink-muted">Funded objectives</span>
      </div>

      {/* Active Goals */}
      <section className="bg-surface border border-ink-hairline rounded-xl p-4 space-y-4">
        <SectionHeader title="Active Goals" />
        {currentPersona.goals.map((g) => {
          const progress = Math.min(100, Math.round((g.currentCentavos / g.targetCentavos) * 100));
          return (
            <div
              key={g.id}
              onClick={() => setSelectedGoalId(g.id)}
              className={`p-3 rounded-lg border transition-all cursor-pointer ${
                selectedGoalId === g.id ? 'bg-pine-soft border-pine' : 'bg-surface-alt border-ink-hairline'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-semibold text-ink">{g.title}</h3>
                  <span className="text-xs text-ink-muted">
                    Target: {g.targetDate} · {privacyMoneyText(g.monthlyContributionCentavos, isPrivacyMasked)}/mo
                  </span>
                </div>
                <span className="text-xs font-bold text-pine tabular-nums">{progress}%</span>
              </div>
              <div className="w-full bg-ink-hairline h-2 rounded-full overflow-hidden mt-2">
                <div className="bg-pine h-full rounded-full transition-all" style={{ width: `${progress}%` }} />
              </div>
              <div className="flex justify-between text-xs text-ink-muted mt-2">
                <span>Current: <MoneyFigure centavos={g.currentCentavos} size="sm" semantic="neutral" /></span>
                <span>Target: <MoneyFigure centavos={g.targetCentavos} size="sm" semantic="neutral" /></span>
              </div>
            </div>
          );
        })}
      </section>

      {/* 11. GOALS WHAT-IF SCENARIO */}
      {selectedGoal && whatIfResult && (
        <section className="bg-surface border border-ink-hairline rounded-xl p-4 space-y-3">
          <SectionHeader title={`What-If Acceleration (${selectedGoal.title})`} />
          <p className="text-xs text-ink-muted">
            Test how boosting monthly allocations accelerates goal completion date.
          </p>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-ink-muted uppercase">Extra Monthly:</span>
            {[500, 1000, 2000].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setExtraContributionPesos(val)}
                className={`px-3 py-1 text-xs rounded border tabular-nums ${
                  extraContributionPesos === val ? 'bg-pine text-white border-pine font-bold' : 'bg-surface-alt border-ink-hairline text-ink'
                }`}
              >
                {`+${privacyMoneyText(val * 100, isPrivacyMasked)}`}
              </button>
            ))}
          </div>

          <div className="p-3 bg-surface-alt border border-ink-hairline rounded-lg text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-ink-muted">Monthly plan:</span>
              <span className="font-semibold text-ink tabular-nums">
                {privacyMoneyText(whatIfResult.currentMonthlyPesos * 100, isPrivacyMasked)} → {privacyMoneyText(whatIfResult.newMonthlyPesos * 100, isPrivacyMasked)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-muted">
                {whatIfResult.monthsToTargetCurrent !== null
                  ? `Base Pace (${whatIfResult.monthsToTargetCurrent} months):`
                  : 'Base Pace:'}
              </span>
              <span className="font-semibold text-ink">
                {whatIfResult.completionDateCurrent !== null ? whatIfResult.completionDateCurrent : 'Not projected'}
              </span>
            </div>
            <div className="flex justify-between font-bold text-pine">
              <span>
                {whatIfResult.monthsToTargetNew !== null
                  ? `Accelerated Pace (${whatIfResult.monthsToTargetNew} months):`
                  : 'Accelerated Pace:'}
              </span>
              <span>
                {whatIfResult.completionDateNew !== null ? whatIfResult.completionDateNew : 'Not projected'}
              </span>
            </div>
            <div className="pt-2 border-t border-ink-hairline flex justify-between items-center text-ink">
              <span>Time Saved:</span>
              <span className="font-bold bg-pine-soft text-pine px-2 py-0.5 rounded">
                {whatIfResult.monthsSaved !== null ? `${whatIfResult.monthsSaved} months sooner` : 'Not comparable'}
              </span>
            </div>
          </div>
        </section>
      )}

      {/* 11. WANTS & COOLING-OFF MANAGEMENT */}
      <section className="bg-surface border border-ink-hairline rounded-xl p-4 space-y-3">
        <SectionHeader title="Wants & Cooling-Off List" />
        <p className="text-xs text-ink-muted">
          Test impulses before buying. Drop unwanted desires or promote funded items into active goals.
        </p>

        {currentPersona.wants.length === 0 ? (
          <p className="text-xs text-ink-muted py-2">No active items in cooling off.</p>
        ) : (
          <div className="divide-y divide-ink-hairline">
            {currentPersona.wants.map((w) => (
              <div key={w.id} className="py-3 space-y-2">
                <div className="flex justify-between items-start text-sm">
                  <div>
                    <span className="font-medium text-ink block">{w.title}</span>
                    <span className="text-xs text-ink-muted">{w.notes || 'In cooling off'}</span>
                  </div>
                  <div className="text-right">
                    <MoneyFigure centavos={w.priceCentavos} size="sm" semantic="neutral" />
                    <span className={`text-[10px] block font-semibold ${w.status === 'cooling_off' ? 'text-amber' : w.status === 'promoted_to_goal' ? 'text-pine' : 'text-ink-muted'}`}>
                      {w.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>

                {w.status === 'cooling_off' && (
                  <div className="flex gap-2 pt-1 text-xs">
                    <button
                      onClick={() => promoteWantToGoal(w.id, 200000)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-pine-soft text-pine border border-pine/30 rounded font-semibold hover:bg-pine/20"
                    >
                      <ArrowUpCircle className="w-3.5 h-3.5" /> Promote to Goal
                    </button>
                    <button
                      onClick={() => updateWantStatus(w.id, 'decided_drop')}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-surface-alt text-ink-muted border border-ink-hairline rounded hover:text-brick"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Drop impulse
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
