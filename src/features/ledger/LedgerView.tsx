import React, { useState } from 'react';
import { useKivra } from '../../state/kivraStore';
import { SectionHeader } from '../../components/kivra/SectionHeader';
import { TransactionRow } from '../../components/kivra/TransactionRow';

export const LedgerView: React.FC = () => {
  const { currentPersona } = useKivra();
  const [filter, setFilter] = useState<'all' | 'expense' | 'income' | 'transfer'>('all');

  const filtered = currentPersona.transactions.filter((t) => {
    if (filter === 'all') return true;
    return t.type === filter;
  });

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-baseline">
        <h1 className="text-xl font-bold tracking-tight text-ink">Transaction Activity</h1>
        <span className="text-xs text-ink-muted tabular-nums">{filtered.length} entries</span>
      </div>

      {/* Filter Chips */}
      <div className="flex gap-2 text-xs">
        {(['all', 'expense', 'income', 'transfer'] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => setFilter(mode)}
            className={`px-3 py-1.5 rounded-md font-medium border transition-colors ${
              filter === mode
                ? 'bg-ink text-paper border-ink'
                : 'bg-surface border-ink-hairline text-ink-muted hover:bg-surface-alt'
            }`}
          >
            {mode.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="bg-surface border border-ink-hairline rounded-xl p-4 divide-y divide-ink-hairline">
        {filtered.map((txn) => (
          <TransactionRow key={txn.id} txn={txn} />
        ))}
      </div>
    </div>
  );
};
