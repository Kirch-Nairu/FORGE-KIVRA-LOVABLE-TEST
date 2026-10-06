import React from 'react';
import { useKivra } from '../../state/kivraStore';
import { SectionHeader } from '../../components/kivra/SectionHeader';
import { Sparkles, Calendar, Coffee, AlertCircle } from 'lucide-react';

export const PatternsView: React.FC = () => {
  const { currentPersona } = useKivra();

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-baseline">
        <h1 className="text-xl font-bold tracking-tight text-ink">Behavioral Patterns</h1>
        <span className="text-xs text-ink-muted">Derived from transaction evidence</span>
      </div>

      <div className="space-y-3">
        {currentPersona.insights.map((ins) => (
          <div key={ins.id} className="bg-surface border border-ink-hairline rounded-xl p-4 space-y-2">
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold uppercase tracking-wider text-pine bg-pine-soft px-2 py-0.5 rounded">
                {ins.metric}
              </span>
              <span className="text-xs text-ink-muted capitalize">{ins.patternType}</span>
            </div>
            <h3 className="text-base font-semibold text-ink">{ins.title}</h3>
            <p className="text-xs text-ink-muted">{ins.description}</p>
            {ins.suggestedAction && (
              <div className="pt-2 border-t border-ink-hairline flex items-center justify-between text-xs">
                <span className="text-ink font-medium">Suggested Action:</span>
                <span className="text-pine font-medium">{ins.suggestedAction}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
