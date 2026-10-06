import React from 'react';
import { Transaction } from '../../domain/types';
import { MoneyFigure } from './MoneyFigure';

interface TransactionRowProps {
  txn: Transaction;
}

export const TransactionRow: React.FC<TransactionRowProps> = ({ txn }) => {
  const flow =
    txn.cashFlowDirection ??
    (txn.type === 'income'
      ? 'in'
      : txn.type === 'transfer'
      ? 'neutral'
      : 'out');

  const typeLabel =
    txn.type === 'transfer'
      ? 'Transfer'
      : txn.type === 'reconciliation'
      ? 'Reconciliation'
      : txn.type === 'debt_payment'
      ? 'Debt payment'
      : txn.type === 'iou_settlement'
      ? 'IOU settlement'
      : txn.category || (flow === 'in' ? 'Income' : 'Expense');

  const formattedDate = new Date(txn.timestamp).toLocaleDateString('en-PH', {
    month: 'short',
    day: 'numeric',
  });

  const displayCentavos =
    flow === 'in' ? txn.amountCentavos : flow === 'out' ? -txn.amountCentavos : txn.amountCentavos;

  return (
    <div className="flex items-center justify-between py-3 border-b border-ink-hairline last:border-0 hover:bg-surface-alt/40 transition-colors px-1">
      <div className="flex flex-col min-w-0 pr-3">
        <span className="text-sm font-medium text-ink truncate">{txn.merchant || txn.note || typeLabel}</span>
        <span className="text-xs text-ink-muted">
          {formattedDate} · {typeLabel} {txn.contextTag ? `· #${txn.contextTag}` : ''}
        </span>
      </div>
      <div className="text-right shrink-0">
        <MoneyFigure
          centavos={displayCentavos}
          size="sm"
          semantic={flow === 'in' ? 'pine' : 'neutral'}
          showSign={flow !== 'neutral'}
        />
      </div>
    </div>
  );
};
