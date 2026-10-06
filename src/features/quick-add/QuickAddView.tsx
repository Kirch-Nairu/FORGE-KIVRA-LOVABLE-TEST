import React, { useState } from 'react';
import { useKivra } from '../../state/kivraStore';
import { TransactionType } from '../../domain/types';

export const QuickAddView: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { currentPersona, addTransaction } = useKivra();
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [category, setCategory] = useState('Food & Drink');
  const [merchant, setMerchant] = useState('');
  const [note, setNote] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (!val || val <= 0) return;

    addTransaction({
      type,
      amountCentavos: Math.round(val * 100),
      accountId: currentPersona.accounts[0].id,
      category,
      merchant: merchant || undefined,
      note: note || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-ink/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
      <div className="bg-surface border border-ink-hairline w-full max-w-md rounded-t-2xl sm:rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex justify-between items-center border-b border-ink-hairline pb-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-ink">Quick Add Movement</h2>
          <button onClick={onClose} className="text-xs text-ink-muted hover:text-ink font-semibold">Cancel</button>
        </div>

        {/* 14. QUICK ADD MODES */}
        <div className="flex gap-1 overflow-x-auto pb-1 text-xs">
          {(['expense', 'income', 'transfer', 'iou_settlement', 'debt_payment'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setType(m)}
              className={`px-2.5 py-1 rounded whitespace-nowrap border capitalize ${
                type === m ? 'bg-ink text-paper border-ink font-semibold' : 'bg-surface-alt border-ink-hairline text-ink-muted'
              }`}
            >
              {m.replace('_', ' ')}
            </button>
          ))}
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-ink-muted uppercase block mb-1">Amount (₱)</label>
            <input
              type="number"
              autoFocus
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full text-2xl font-bold px-3 py-2 bg-surface-alt border border-ink-hairline rounded-lg tabular-nums focus:outline-none focus:ring-1 focus:ring-pine"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <label className="text-ink-muted uppercase block mb-1 font-semibold">Category</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2 bg-surface-alt border border-ink-hairline rounded-lg focus:outline-none"
              />
            </div>
            <div>
              <label className="text-ink-muted uppercase block mb-1 font-semibold">Merchant / Person</label>
              <input
                type="text"
                value={merchant}
                onChange={(e) => setMerchant(e.target.value)}
                placeholder="Optional"
                className="w-full p-2 bg-surface-alt border border-ink-hairline rounded-lg focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-pine text-white text-sm font-semibold rounded-lg hover:bg-pine/90 transition-colors shadow-xs"
          >
            Log Transaction
          </button>
        </form>
      </div>
    </div>
  );
};
