import React, { useState } from 'react';
import { useKivra } from '../../state/kivraStore';
import { MoneyFigure } from '../../components/kivra/MoneyFigure';
import { StatusChip } from '../../components/kivra/StatusChip';
import { SectionHeader } from '../../components/kivra/SectionHeader';
import { TransactionRow } from '../../components/kivra/TransactionRow';
import { Waterfall } from '../../components/kivra/Waterfall';
import { evaluateAffordability } from '../../domain/finance/affordability';
import { prototypeClock } from '../../domain/clock';
import { ArrowUpRight, ArrowDownLeft, ShieldCheck, HelpCircle, Calculator, ChevronRight } from 'lucide-react';

export const TodayView: React.FC<{ onNavigate: (tab: string) => void }> = ({ onNavigate }) => {
  const { currentPersona, safeToSpend } = useKivra();
  const [showMath, setShowMath] = useState(false);
  const [showAfford, setShowAfford] = useState(false);
  const [affordAmount, setAffordAmount] = useState<string>('500');

  const affordVerdict = evaluateAffordability(
    currentPersona,
    (parseFloat(affordAmount) || 0) * 100,
    prototypeClock.now
  );

  return (
    <div className="space-y-6 pb-20">
      {/* 9. TODAY — HIGHEST PRIORITY ABOVE-THE-FOLD */}
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
            ₱{(safeToSpend.stsTotalCentavos / 100).toLocaleString('en-PH')}
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
                <span className="tabular-nums font-semibold">₱{(affordVerdict.newStsDailyCentavos / 100).toFixed(0)} / day</span>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* In / Out / Net Summary Strip */}
      <section className="grid grid-cols-3 gap-2 bg-surface border border-ink-hairline rounded-xl p-3 text-center">
        <div>
          <span className="text-[11px] font-medium text-ink-muted flex items-center justify-center gap-1">
            <ArrowDownLeft className="w-3 h-3 text-pine" /> Inflow
          </span>
          <div className="mt-0.5">
            <MoneyFigure centavos={currentPersona.monthlyNetCentavos / currentPersona.paydayDays.length} size="sm" semantic="pine" />
          </div>
        </div>
        <div className="border-x border-ink-hairline">
          <span className="text-[11px] font-medium text-ink-muted flex items-center justify-center gap-1">
            <ArrowUpRight className="w-3 h-3 text-ink" /> Committed
          </span>
          <div className="mt-0.5">
            <MoneyFigure centavos={safeToSpend.billsCentavos + safeToSpend.debtMinCentavos} size="sm" semantic="neutral" />
          </div>
        </div>
        <div>
          <span className="text-[11px] font-medium text-ink-muted flex items-center justify-center gap-1">
            <ShieldCheck className="w-3 h-3 text-slate" /> Runway
          </span>
          <div className="mt-0.5">
            <span className="text-sm font-semibold tabular-nums text-ink">{safeToSpend.horizonDays}d remaining</span>
          </div>
        </div>
      </section>

      {/* Needs Attention (<= 3 rows) */}
      <section className="bg-surface border border-ink-hairline rounded-xl p-4">
        <SectionHeader title="Needs Attention" />
        <div className="space-y-2">
          {currentPersona.commitments.filter(c => !c.isPaid).slice(0, 2).map((c) => (
            <div key={c.id} className="flex justify-between items-center text-sm py-1.5 border-b border-ink-hairline last:border-0">
              <div>
                <span className="font-medium text-ink">{c.title}</span>
                <span className="text-xs text-amber block font-medium">Due {c.dueDate}</span>
              </div>
              <MoneyFigure centavos={c.amountCentavos} size="sm" semantic="neutral" />
            </div>
          ))}
          {currentPersona.ious.filter(i => i.status === 'overdue').map((i) => (
            <div key={i.id} className="flex justify-between items-center text-sm py-1.5 border-b border-ink-hairline last:border-0">
              <div>
                <span className="font-medium text-ink">{i.personName}</span>
                <span className="text-xs text-brick block font-semibold">Overdue IOU: {i.description}</span>
              </div>
              <MoneyFigure centavos={i.amountCentavos} size="sm" semantic="neutral" />
            </div>
          ))}
        </div>
      </section>

      {/* Up Next & Insights */}
      <section className="bg-surface border border-ink-hairline rounded-xl p-4">
        <SectionHeader title="Evidence Insight" actionText="View all" onAction={() => onNavigate('patterns')} />
        {currentPersona.insights[0] && (
          <div className="p-3 bg-surface-alt rounded-lg border border-ink-hairline">
            <span className="text-xs font-semibold text-pine uppercase tracking-wider">{currentPersona.insights[0].metric}</span>
            <h4 className="text-sm font-bold text-ink mt-0.5">{currentPersona.insights[0].title}</h4>
            <p className="text-xs text-ink-muted mt-1">{currentPersona.insights[0].description}</p>
          </div>
        )}
      </section>

      {/* Latest Activity */}
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
