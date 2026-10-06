import React, { useState } from 'react';
import { useKivra } from '../../state/kivraStore';
import { MoneyFigure } from '../../components/kivra/MoneyFigure';
import { StatusChip } from '../../components/kivra/StatusChip';
import { SectionHeader } from '../../components/kivra/SectionHeader';
import { TransactionRow } from '../../components/kivra/TransactionRow';
import { Waterfall } from '../../components/kivra/Waterfall';
import { evaluateAffordability } from '../../domain/finance/affordability';
import { deriveAllPatterns } from '../../domain/finance/patterns';
import { prototypeClock } from '../../domain/clock';
import { maskCurrencyText } from '../../lib/privacy';
import { ArrowUpRight, ArrowDownLeft, ShieldCheck, HelpCircle, Calculator, Target, Clock, AlertTriangle } from 'lucide-react';

export const TodayView: React.FC<{ onNavigate: (tab: string) => void; onQuickAdd: () => void }> = ({ onNavigate, onQuickAdd }) => {
  const { currentPersona, safeToSpend, isPrivacyMasked } = useKivra();
  const [showMath, setShowMath] = useState(false);
  const [showAfford, setShowAfford] = useState(false);
  const [affordAmount, setAffordAmount] = useState<string>('500');

  const affordVerdict = evaluateAffordability(
    currentPersona,
    (parseFloat(affordAmount) || 0) * 100,
    prototypeClock.now
  );

  // 7. TODAY - ACTUAL TODAY METRICS (not future payday!)
  const todayDateStr = prototypeClock.isoDate;
  const todayTxns = currentPersona.transactions.filter((t) => t.timestamp.startsWith(todayDateStr));

  // Inflow today = income + incoming IOU repayment (excluding transfers)
  const moneyInTodayCentavos = todayTxns
    .filter(
      (t) =>
        t.type === 'income' ||
        (t.type === 'iou_settlement' &&
          currentPersona.ious.find((i) => i.id === t.personId)?.direction === 'owed_to_me')
    )
    .reduce((s, t) => s + t.amountCentavos, 0);

  // Outflow today = ordinary expense + debt payment + outgoing IOU settlement (excluding transfers and reconciliation)
  const moneyOutTodayCentavos = todayTxns
    .filter(
      (t) =>
        t.type === 'expense' ||
        t.type === 'debt_payment' ||
        (t.type === 'iou_settlement' &&
          currentPersona.ious.find((i) => i.id === t.personId)?.direction === 'i_owe')
    )
    .reduce((s, t) => s + t.amountCentavos, 0);

  const netTodayCentavos = moneyInTodayCentavos - moneyOutTodayCentavos;

  // Up Next: obligations due before next payday
  const nextPaydayTs = new Date(currentPersona.nextPayday + 'T23:59:59+08:00').getTime();
  const upcomingBills = currentPersona.commitments
    .filter((c) => !c.isPaid && new Date(c.dueDate + 'T23:59:59+08:00').getTime() <= nextPaydayTs)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  const upcomingDebts = currentPersona.debts
    .filter((d) => new Date(d.dueDate + 'T23:59:59+08:00').getTime() <= nextPaydayTs);

  // Dynamically derived patterns
  const derivedPatterns = deriveAllPatterns(currentPersona, prototypeClock.now);
  const topPattern = derivedPatterns[0];

  // Primary active goal for goal nudge
  const primaryGoal = currentPersona.goals[0];
  const goalProgress = primaryGoal
    ? Math.min(100, Math.round((primaryGoal.currentCentavos / primaryGoal.targetCentavos) * 100))
    : 0;

  return (
    <div className="space-y-6 pb-20">
      {/* 9. TODAY - HERO SAFE TO SPEND */}
      <section className="bg-surface border border-ink-hairline rounded-xl p-5 shadow-xs">
        <div className="flex justify-between items-start">
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
            Safe to spend today
          </span>
          <StatusChip label={safeToSpend.status} variant={safeToSpend.status.toLowerCase() as any} />
        </div>

        {/* Hero STS figure */}
        <div className="mt-2 flex items-baseline gap-2">
          <MoneyFigure centavos={safeToSpend.stsDailyCentavos} size="hero" semantic="pine" />
          <span className="text-sm font-medium text-ink-muted">/ day</span>
        </div>

        {/* Context subtitle */}
        <div className="mt-1 text-sm text-ink-muted flex items-center gap-1.5 tabular-nums">
          <span className="font-semibold text-ink">
            {isPrivacyMasked ? '₱••••••' : `₱${(safeToSpend.stsTotalCentavos / 100).toLocaleString('en-PH')}`}
          </span>
          <span>until payday</span>
          <span>·</span>
          <span>{safeToSpend.horizonDays} days</span>
        </div>

        {/* Direct Action triggers */}
        <div className="mt-4 flex flex-wrap gap-2 pt-3 border-t border-ink-hairline">
          <button
            onClick={() => setShowMath(!showMath)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-surface-alt border border-ink-hairline rounded-md hover:bg-ink-hairline/40 transition-colors"
          >
            <Calculator className="w-3.5 h-3.5 text-pine" />
            {showMath ? 'Hide calculation' : 'Show the math'}
          </button>
          <button
            onClick={() => setShowAfford(!showAfford)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-surface-alt border border-ink-hairline rounded-md hover:bg-ink-hairline/40 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5 text-slate" />
            Can I afford this?
          </button>
        </div>

        {/* Show the math waterfall */}
        {showMath && (
          <div className="mt-4 p-4 bg-paper border border-ink-hairline rounded-lg">
            <h3 className="text-xs font-semibold uppercase text-ink-muted mb-3">Safe-to-Spend Formula Waterfall</h3>
            <Waterfall math={safeToSpend} />
          </div>
        )}

        {/* Can I afford this interactive simulator */}
        {showAfford && (
          <div className="mt-4 p-4 bg-paper border border-ink-hairline rounded-lg space-y-3">
            <h3 className="text-xs font-semibold uppercase text-ink-muted">Simulate Discretionary Purchase</h3>
            <div className="flex gap-2">
              <span className="inline-flex items-center px-3 text-sm font-bold bg-surface border border-ink-hairline rounded-l-md">₱</span>
              <input
                type="number"
                value={affordAmount}
                onChange={(e) => setAffordAmount(e.target.value)}
                className="w-full px-3 py-1.5 text-sm bg-surface border border-ink-hairline rounded-r-md focus:outline-none focus:ring-1 focus:ring-pine"
                placeholder="Enter amount in Pesos"
              />
            </div>
            <div className="p-3 bg-surface border border-ink-hairline rounded text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="font-semibold text-ink">Impact:</span>
                <span className={affordVerdict.canAffordWithoutRisk ? 'text-pine font-bold' : 'text-brick font-bold'}>
                  {affordVerdict.canAffordWithoutRisk ? 'Safe to buy' : 'Cuts into Runway'}
                </span>
              </div>
              <p className="text-ink-muted">{affordVerdict.rationale}</p>
              <div className="pt-2 flex justify-between border-t border-ink-hairline text-ink">
                <span>New Daily Allowance:</span>
                <span className="tabular-nums font-semibold">
                  {isPrivacyMasked ? '₱••••••' : `₱${(affordVerdict.newStsDailyCentavos / 100).toFixed(0)} / day`}
                </span>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 7. ACTUAL TODAY METRICS STRIP */}
      <section className="grid grid-cols-3 gap-2 bg-surface border border-ink-hairline rounded-xl p-3 text-center">
        <div>
          <span className="text-[11px] font-medium text-ink-muted flex items-center justify-center gap-1">
            <ArrowDownLeft className="w-3 h-3 text-pine" /> Money In Today
          </span>
          <div className="mt-0.5">
            <MoneyFigure centavos={moneyInTodayCentavos} size="sm" semantic={moneyInTodayCentavos > 0 ? 'pine' : 'neutral'} />
          </div>
        </div>
        <div className="border-x border-ink-hairline">
          <span className="text-[11px] font-medium text-ink-muted flex items-center justify-center gap-1">
            <ArrowUpRight className="w-3 h-3 text-ink" /> Money Out Today
          </span>
          <div className="mt-0.5">
            <MoneyFigure centavos={moneyOutTodayCentavos} size="sm" semantic="neutral" />
          </div>
        </div>
        <div>
          <span className="text-[11px] font-medium text-ink-muted flex items-center justify-center gap-1">
            <ShieldCheck className="w-3 h-3 text-slate" /> Net Today
          </span>
          <div className="mt-0.5">
            <MoneyFigure centavos={netTodayCentavos} size="sm" semantic={netTodayCentavos >= 0 ? 'neutral' : 'neutral'} showSign />
          </div>
        </div>
      </section>

      {/* 17. PROTOTYPE-TIME EVENING CHECK-IN */}
      <section className="bg-surface-alt border border-ink-hairline rounded-xl p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Clock className="w-4 h-4 text-pine" />
          <div>
            <span className="text-xs font-bold text-ink block">Evening Financial Check-In (19:30)</span>
            <span className="text-[11px] text-ink-muted">
              {todayTxns.length} entry logged today · Runway intact at {safeToSpend.horizonDays} days
            </span>
          </div>
        </div>
        <button
          onClick={onQuickAdd}
          className="text-xs font-semibold px-2.5 py-1 bg-surface border border-ink-hairline rounded text-ink hover:border-pine"
        >
          Quick Add
        </button>
      </section>

      {/* 17. UP NEXT BEFORE-PAYDAY TIMELINE */}
      <section className="bg-surface border border-ink-hairline rounded-xl p-4">
        <SectionHeader title="Up Next Before Payday" actionText="Plan" onAction={() => onNavigate('plan')} />
        <div className="space-y-2">
          {upcomingBills.length === 0 && upcomingDebts.length === 0 ? (
            <p className="text-xs text-ink-muted py-2">No fixed commitments due before next payday.</p>
          ) : (
            <>
              {upcomingBills.slice(0, 3).map((b) => (
                <div key={b.id} className="flex justify-between items-center text-sm py-1.5 border-b border-ink-hairline last:border-0">
                  <div>
                    <span className="font-medium text-ink block">{b.title}</span>
                    <span className="text-xs text-amber font-medium">Due {b.dueDate}</span>
                  </div>
                  <MoneyFigure centavos={b.amountCentavos} size="sm" semantic="neutral" />
                </div>
              ))}
              {upcomingDebts.slice(0, 2).map((d) => (
                <div key={d.id} className="flex justify-between items-center text-sm py-1.5 border-b border-ink-hairline last:border-0">
                  <div>
                    <span className="font-medium text-ink block">{d.name}</span>
                    <span className="text-xs text-brick font-semibold">Min Due by {d.dueDate}</span>
                  </div>
                  <MoneyFigure centavos={d.minimumDueCentavos} size="sm" semantic="neutral" />
                </div>
              ))}
            </>
          )}
        </div>
      </section>

      {/* 17. GOAL NUDGE ON TODAY */}
      {primaryGoal && (
        <section className="bg-surface border border-ink-hairline rounded-xl p-4">
          <SectionHeader title="Funded Goal Nudge" actionText="Goals" onAction={() => onNavigate('goals')} />
          <div className="p-3 bg-surface-alt rounded-lg border border-ink-hairline space-y-2">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-pine" />
                <div>
                  <h4 className="text-xs font-bold text-ink">{primaryGoal.title}</h4>
                  <span className="text-[11px] text-ink-muted">Target: {primaryGoal.targetDate}</span>
                </div>
              </div>
              <span className="text-xs font-bold text-pine tabular-nums">{goalProgress}%</span>
            </div>
            <div className="w-full bg-ink-hairline h-1.5 rounded-full overflow-hidden">
              <div className="bg-pine h-full rounded-full transition-all" style={{ width: `${goalProgress}%` }} />
            </div>
            <div className="flex justify-between text-[11px] text-ink-muted">
              <span>Saved: <MoneyFigure centavos={primaryGoal.currentCentavos} size="sm" semantic="neutral" /></span>
              <span>Target: <MoneyFigure centavos={primaryGoal.targetCentavos} size="sm" semantic="neutral" /></span>
            </div>
          </div>
        </section>
      )}

      {/* COMPUTED EVIDENCE INSIGHT ON TODAY */}
      <section className="bg-surface border border-ink-hairline rounded-xl p-4">
        <SectionHeader title="Behavioral Insight" actionText="Patterns" onAction={() => onNavigate('patterns')} />
        {topPattern ? (
          <div className="p-3 bg-surface-alt rounded-lg border border-ink-hairline">
            <span className="text-xs font-semibold text-pine uppercase tracking-wider">{maskCurrencyText(topPattern.metric, isPrivacyMasked)}</span>
            <h4 className="text-sm font-bold text-ink mt-0.5">{topPattern.title}</h4>
            <p className="text-xs text-ink-muted mt-1">{maskCurrencyText(topPattern.description, isPrivacyMasked)}</p>
          </div>
        ) : (
          <p className="text-xs text-ink-muted py-2">Not enough entries yet to detect behavioral clusters.</p>
        )}
      </section>

      {/* LATEST ACTIVITY */}
      <section className="bg-surface border border-ink-hairline rounded-xl p-4">
        <SectionHeader title="Recent Activity" actionText="Full ledger" onAction={() => onNavigate('ledger')} />
        <div className="divide-y divide-ink-hairline">
          {currentPersona.transactions.slice(0, 5).map((txn) => (
            <TransactionRow key={txn.id} txn={txn} />
          ))}
        </div>
      </section>
    </div>
  );
};
