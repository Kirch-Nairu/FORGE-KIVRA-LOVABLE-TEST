import React, { useState } from 'react';
import { useKivra } from '../../state/kivraStore';
import { deriveAllPatterns } from '../../domain/finance/patterns';
import { prototypeClock } from '../../domain/clock';
import { maskCurrencyText } from '../../lib/privacy';
import { TransactionRow } from '../../components/kivra/TransactionRow';
import { Sparkles, Eye, EyeOff, ThumbsDown } from 'lucide-react';

export const PatternsView: React.FC = () => {
  const { currentPersona, isPrivacyMasked } = useKivra();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState<string[]>([]);

  const derivedInsights = deriveAllPatterns(currentPersona, prototypeClock.now).filter(
    (ins) => !dismissed.includes(ins.id)
  );

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-baseline">
        <h1 className="text-xl font-bold tracking-tight text-ink">Behavioral Patterns</h1>
        <span className="text-xs text-ink-muted">Purely calculated from activity</span>
      </div>

      <div className="space-y-3">
        {derivedInsights.length === 0 ? (
          <div className="p-6 bg-surface border border-ink-hairline rounded-xl text-center space-y-1">
            <span className="text-xs font-semibold uppercase text-ink-muted">Pattern Engine</span>
            <p className="text-sm font-medium text-ink">Not enough entries yet</p>
            <p className="text-xs text-ink-muted max-w-xs mx-auto">
              Continue logging transactions or switch to another demo profile to see evidence-backed cluster insights.
            </p>
          </div>
        ) : (
          derivedInsights.map((ins) => {
            const isExpanded = expandedId === ins.id;
            const evidenceTxns = currentPersona.transactions.filter((t) => ins.transactions.includes(t.id));

            return (
              <div key={ins.id} className="bg-surface border border-ink-hairline rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-semibold uppercase tracking-wider text-pine bg-pine-soft px-2 py-0.5 rounded">
                    {maskCurrencyText(ins.metric, isPrivacyMasked)}
                  </span>
                  <span className="text-xs text-ink-muted capitalize">{ins.patternType}</span>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-ink">{ins.title}</h3>
                  <p className="text-xs text-ink-muted mt-1 leading-relaxed">{maskCurrencyText(ins.description, isPrivacyMasked)}</p>
                </div>

                {ins.suggestedAction && (
                  <div className="p-2.5 bg-surface-alt border border-ink-hairline rounded-lg text-xs flex items-center justify-between">
                    <span className="text-ink font-medium">Suggested Action:</span>
                    <span className="text-pine font-semibold">{maskCurrencyText(ins.suggestedAction, isPrivacyMasked)}</span>
                  </div>
                )}

                {/* Evidence Controls */}
                <div className="pt-2 border-t border-ink-hairline flex items-center justify-between text-xs">
                  {ins.transactions.length > 0 ? (
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : ins.id)}
                      className="inline-flex items-center gap-1.5 text-pine hover:underline font-semibold"
                    >
                      {isExpanded ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      {isExpanded ? 'Hide evidence' : `See evidence (${ins.transactions.length})`}
                    </button>
                  ) : (
                    <span className="text-ink-muted text-[11px]">System rule match</span>
                  )}

                  <button
                    onClick={() => setDismissed([...dismissed, ins.id])}
                    className="inline-flex items-center gap-1 text-ink-muted hover:text-ink text-[11px]"
                  >
                    <ThumbsDown className="w-3 h-3" /> Not useful
                  </button>
                </div>

                {/* Expanded Transaction Evidence */}
                {isExpanded && evidenceTxns.length > 0 && (
                  <div className="mt-2 p-3 bg-paper border border-ink-hairline rounded-lg divide-y divide-ink-hairline">
                    <span className="text-[10px] font-bold text-ink-muted uppercase tracking-wider block mb-2">
                      Matching Source Transactions
                    </span>
                    {evidenceTxns.map((t) => (
                      <TransactionRow key={t.id} txn={t} />
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
