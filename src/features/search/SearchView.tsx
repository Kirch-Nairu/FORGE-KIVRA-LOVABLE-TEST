import React, { useState } from 'react';
import { useKivra } from '../../state/kivraStore';
import { TransactionRow } from '../../components/kivra/TransactionRow';
import { MoneyFigure } from '../../components/kivra/MoneyFigure';
import { Search, Wallet, CreditCard, Users, Target, HeartHandshake } from 'lucide-react';

export const SearchView: React.FC<{ onNavigate?: (tab: string) => void }> = ({ onNavigate }) => {
  const { currentPersona } = useKivra();
  const [query, setQuery] = useState('');

  const q = query.toLowerCase().trim();

  const matchingTransactions = q
    ? currentPersona.transactions.filter(
        (t) =>
          (t.merchant && t.merchant.toLowerCase().includes(q)) ||
          (t.category && t.category.toLowerCase().includes(q)) ||
          (t.note && t.note.toLowerCase().includes(q)) ||
          (t.contextTag && t.contextTag.toLowerCase().includes(q))
      )
    : [];

  const matchingAccounts = q
    ? currentPersona.accounts.filter(
        (a) => a.name.toLowerCase().includes(q) || (a.institution && a.institution.toLowerCase().includes(q))
      )
    : [];

  const matchingDebts = q
    ? currentPersona.debts.filter(
        (d) => d.name.toLowerCase().includes(q) || d.institution.toLowerCase().includes(q)
      )
    : [];

  const matchingIous = q
    ? currentPersona.ious.filter(
        (i) => i.personName.toLowerCase().includes(q) || i.description.toLowerCase().includes(q)
      )
    : [];

  const matchingGoals = q
    ? currentPersona.goals.filter((g) => g.title.toLowerCase().includes(q))
    : [];

  const matchingWants = q
    ? currentPersona.wants.filter((w) => w.title.toLowerCase().includes(q) || (w.notes && w.notes.toLowerCase().includes(q)))
    : [];

  const totalMatches =
    matchingTransactions.length +
    matchingAccounts.length +
    matchingDebts.length +
    matchingIous.length +
    matchingGoals.length +
    matchingWants.length;

  return (
    <div className="space-y-6 pb-20">
      <div className="relative">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-ink-muted" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search transactions, accounts, debts, people, goals..."
          className="w-full pl-9 pr-4 py-2 text-sm bg-surface border border-ink-hairline rounded-lg focus:outline-none focus:ring-1 focus:ring-pine"
          autoFocus
        />
      </div>

      {!query ? (
        <p className="text-xs text-ink-muted py-6 text-center">
          Search across all local registers: transactions, accounts, debts, IOUs, goals, and wants.
        </p>
      ) : totalMatches === 0 ? (
        <p className="text-xs text-ink-muted py-6 text-center">No matching records found for "{query}".</p>
      ) : (
        <div className="space-y-4">
          {/* Accounts */}
          {matchingAccounts.length > 0 && (
            <div className="bg-surface border border-ink-hairline rounded-xl p-4">
              <h3 className="text-xs font-bold text-ink-muted uppercase tracking-wider mb-2">Accounts</h3>
              <div className="divide-y divide-ink-hairline">
                {matchingAccounts.map((acc) => (
                  <div key={acc.id} className="py-2 flex justify-between items-center text-sm">
                    <span className="font-medium text-ink">{acc.name}</span>
                    <MoneyFigure centavos={acc.balanceCentavos} size="sm" semantic="neutral" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Debts */}
          {matchingDebts.length > 0 && (
            <div className="bg-surface border border-ink-hairline rounded-xl p-4">
              <h3 className="text-xs font-bold text-ink-muted uppercase tracking-wider mb-2">Debts & Loans</h3>
              <div className="divide-y divide-ink-hairline">
                {matchingDebts.map((d) => (
                  <div key={d.id} className="py-2 flex justify-between items-center text-sm">
                    <div>
                      <span className="font-medium text-ink">{d.name}</span>
                      <span className="text-xs text-ink-muted block">Due {d.dueDate}</span>
                    </div>
                    <MoneyFigure centavos={d.remainingBalanceCentavos} size="sm" semantic="neutral" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* IOUs */}
          {matchingIous.length > 0 && (
            <div className="bg-surface border border-ink-hairline rounded-xl p-4">
              <h3 className="text-xs font-bold text-ink-muted uppercase tracking-wider mb-2">People & IOUs</h3>
              <div className="divide-y divide-ink-hairline">
                {matchingIous.map((iou) => (
                  <div key={iou.id} className="py-2 flex justify-between items-center text-sm">
                    <div>
                      <span className="font-medium text-ink">{iou.personName}</span>
                      <span className="text-xs text-ink-muted block">{iou.description}</span>
                    </div>
                    <MoneyFigure centavos={iou.amountCentavos} size="sm" semantic="neutral" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Goals & Wants */}
          {(matchingGoals.length > 0 || matchingWants.length > 0) && (
            <div className="bg-surface border border-ink-hairline rounded-xl p-4">
              <h3 className="text-xs font-bold text-ink-muted uppercase tracking-wider mb-2">Goals & Wants</h3>
              <div className="divide-y divide-ink-hairline">
                {matchingGoals.map((g) => (
                  <div key={g.id} className="py-2 flex justify-between items-center text-sm">
                    <span className="font-medium text-ink">Goal: {g.title}</span>
                    <MoneyFigure centavos={g.targetCentavos} size="sm" semantic="neutral" />
                  </div>
                ))}
                {matchingWants.map((w) => (
                  <div key={w.id} className="py-2 flex justify-between items-center text-sm">
                    <span className="font-medium text-ink">Want: {w.title}</span>
                    <MoneyFigure centavos={w.priceCentavos} size="sm" semantic="neutral" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Transactions */}
          {matchingTransactions.length > 0 && (
            <div className="bg-surface border border-ink-hairline rounded-xl p-4">
              <h3 className="text-xs font-bold text-ink-muted uppercase tracking-wider mb-2">
                Transactions ({matchingTransactions.length})
              </h3>
              <div className="divide-y divide-ink-hairline">
                {matchingTransactions.map((t) => (
                  <TransactionRow key={t.id} txn={t} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
