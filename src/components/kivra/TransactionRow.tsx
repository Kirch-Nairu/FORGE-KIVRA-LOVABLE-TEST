import React from 'react';
import { Transaction } from '../../domain/types';
import { MoneyFigure } from './MoneyFigure';

interface TransactionRowProps {
  txn: Transaction;
}

export const TransactionRow: React.FC<TransactionRowProps> = ({ txn }) => {
  // Correction B: Ordinary expenses remain neutral / Ink.
  // Income uses Pine. Transfers remain neutral.
  const isIncome = txn.type === 'income' || txn.type === 'iou_settlement';
  const isTransfer = txn.type === 'transfer';
  const isRecon = txn.type === 'reconciliation';

  const typeLabel = isTransfer
    ? 'Transfer'
    : isRecon
    ? 'Reconciliation'
    : txn.category || (isIncome ? 'Income' : 'Expense');

  const formattedDate = new Date(txn.timestamp).toLocaleDateString('en-PH', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="flex items-center justify-between py-3 border-b border-ink-hairline last:border-0 hover:bg-surface-alt/40 transition-colors px-1">
      <div className="flex flex-col">
        <span className="text-sm font-medium text-ink">{txn.merchant || txn.note || typeLabel}</span>
        <span className="text-xs text-ink-muted">
          {formattedDate} · {typeLabel} {txn.contextTag ? `· #${txn.contextTag}` : ''}
        </span>
      </div>
      <div className="text-right">
        <MoneyFigure
          centavos={isIncome ? txn.amountCentavos : -txn.amountCentavos}
          size="sm"
          semantic={isIncome ? 'pine' : 'neutral'}
          showSign={true}
        />
      </div>
    </div>
  );
};
