import React from 'react';
import { useKivra } from '../../state/kivraStore';
import { SectionHeader } from '../../components/kivra/SectionHeader';

export const HealthView: React.FC = () => {
  const { healthDimensions } = useKivra();

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-baseline">
        <h1 className="text-xl font-bold tracking-tight text-ink">Financial Health Dimensions</h1>
        <span className="text-xs text-ink-muted">Explainable Diagnostics</span>
      </div>

      <div className="space-y-3">
        {healthDimensions.map((dim) => (
          <div key={dim.id} className="bg-surface border border-ink-hairline rounded-xl p-4 space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-ink">{dim.name}</h3>
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded border ${
                  dim.level === 'Robust'
                    ? 'bg-pine-soft text-pine border-pine/30'
                    : dim.level === 'Adequate'
                    ? 'bg-surface-alt text-ink border-ink-hairline'
                    : 'bg-amber/15 text-amber border-amber/30'
                }`}
              >
                {dim.level}
              </span>
            </div>
            <p className="text-xs text-ink-muted">{dim.explanation}</p>
            <div className="pt-2 border-t border-ink-hairline flex flex-wrap gap-1">
              {dim.factors.map((f, idx) => (
                <span key={idx} className="text-[10px] bg-surface-alt text-ink-muted px-2 py-0.5 rounded">
                  {f}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
