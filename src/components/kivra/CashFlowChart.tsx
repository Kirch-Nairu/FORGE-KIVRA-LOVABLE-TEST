import React from 'react';
import { DailyProjection } from '../../domain/finance/cashFlow';
import { formatPesos } from '../../domain/money';

interface CashFlowChartProps {
  projections: DailyProjection[];
}

export const CashFlowChart: React.FC<CashFlowChartProps> = ({ projections }) => {
  if (projections.length === 0) return null;

  const balances = projections.map((p) => p.projectedBalanceCentavos);
  const min = Math.min(...balances);
  const max = Math.max(...balances);
  const range = max - min || 1;

  const points = projections
    .map((p, idx) => {
      const x = (idx / (projections.length - 1)) * 100;
      const y = 90 - ((p.projectedBalanceCentavos - min) / range) * 80;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="w-full bg-surface border border-ink-hairline rounded-lg p-3">
      <div className="flex justify-between text-xs text-ink-muted mb-2">
        <span>30-Day Projected Cash Flow Line</span>
        <span className="tabular-nums">Min: {formatPesos(min)} · Peak: {formatPesos(max)}</span>
      </div>
      <div className="relative h-24 w-full">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
          <polyline fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-pine" points={points} />
        </svg>
      </div>
      <div className="flex justify-between text-[10px] text-ink-muted mt-2 border-t border-ink-hairline pt-1">
        <span>Today</span>
        <span>Payday Inflow</span>
        <span>+30 Days</span>
      </div>
    </div>
  );
};
