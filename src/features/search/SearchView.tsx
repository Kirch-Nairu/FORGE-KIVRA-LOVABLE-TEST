import React, { useState } from 'react';
import { useKivra } from '../../state/kivraStore';
import { TransactionRow } from '../../components/kivra/TransactionRow';
import { Search } from 'lucide-react';

export const SearchView: React.FC = () => {
  const { currentPersona } = useKivra();
  const [query, setQuery] = useState('');

  const q = query.toLowerCase();
  const matches = currentPersona.transactions.filter((t) =>
    (t.merchant && t.merchant.toLowerCase().includes(q)) ||
    (t.category && t.category.toLowerCase().includes(q)) ||
    (t.note && t.note.toLowerCase().includes(q))
  );

  return (
    <div className="space-y-6 pb-20">
      <div className="relative">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-ink-muted" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search transactions, merchants, notes..."
          className="w-full pl-9 pr-4 py-2 text-sm bg-surface border border-ink-hairline rounded-lg focus:outline-none focus:ring-1 focus:ring-pine"
        />
      </div>

      <div className="bg-surface border border-ink-hairline rounded-xl p-4 divide-y divide-ink-hairline">
        {query ? (
          matches.length > 0 ? (
            matches.map((t) => <TransactionRow key={t.id} txn={t} />)
          ) : (
            <p className="text-xs text-ink-muted py-4 text-center">No matching records found.</p>
          )
        ) : (
          <p className="text-xs text-ink-muted py-4 text-center">Enter a merchant name or keyword to search local history.</p>
        )}
      </div>
    </div>
  );
};
