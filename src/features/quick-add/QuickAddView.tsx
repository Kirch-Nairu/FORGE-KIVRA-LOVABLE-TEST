import React, { useState } from 'react';
import { useKivra } from '../../state/kivraStore';
import { privacyMoneyText } from '../../lib/privacy';

export const QuickAddView: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { currentPersona, addTransaction, isPrivacyMasked } = useKivra();
  const [type, setType] = useState<'expense' | 'income' | 'transfer' | 'debt_payment' | 'iou_settlement'>('expense');
  const [amount, setAmount] = useState('');
  const [sourceAccountId, setSourceAccountId] = useState(currentPersona.accounts[0]?.id || '');
  const [destAccountId, setDestAccountId] = useState(
    currentPersona.accounts[1]?.id || currentPersona.accounts[0]?.id || ''
  );
  const [selectedDebtId, setSelectedDebtId] = useState(currentPersona.debts[0]?.id || '');
  const [selectedIouId, setSelectedIouId] = useState(
    currentPersona.ious.find((i) => i.status !== 'settled')?.id || ''
  );
  const [category, setCategory] = useState('Food & Drink');
  const [merchant, setMerchant] = useState('');
  const [note, setNote] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const activeIous = currentPersona.ious.filter((i) => i.status !== 'settled' && i.amountCentavos > 0);
  const activeDebts = currentPersona.debts.filter((d) => d.remainingBalanceCentavos > 0);

  const accountLabel = (id: string) => {
    const acc = currentPersona.accounts.find((a) => a.id === id);
    if (!acc) return '';
    return `${acc.name} (${privacyMoneyText(acc.balanceCentavos, isPrivacyMasked)})`;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const val = Number(amount);
    if (!Number.isFinite(val) || val <= 0) {
      setErrorMsg('Please enter a valid amount.');
      return;
    }

    const amountCentavos = Math.round(val * 100);

    const result = addTransaction({
      type,
      amountCentavos,
      accountId: sourceAccountId,
      toAccountId: type === 'transfer' ? destAccountId : undefined,
      debtId: type === 'debt_payment' ? selectedDebtId : undefined,
      iouId: type === 'iou_settlement' ? selectedIouId : undefined,
      category: type === 'expense' ? category : undefined,
      merchant: merchant || undefined,
      note: note || undefined,
    });

    if (!result.ok) {
      setErrorMsg(result.error);
      return;
    }

    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-ink/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-add-title"
    >
      <div className="bg-surface border border-ink-hairline w-full max-w-md rounded-t-2xl sm:rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex justify-between items-center border-b border-ink-hairline pb-2">
          <h2 id="quick-add-title" className="text-sm font-bold uppercase tracking-wider text-ink">
            Quick Add Movement
          </h2>
          <button onClick={onClose} className="text-xs text-ink-muted hover:text-ink font-semibold">
            Cancel
          </button>
        </div>

        <div className="flex gap-1 overflow-x-auto pb-1 text-xs" aria-label="Movement type">
          {(['expense', 'income', 'transfer', 'debt_payment', 'iou_settlement'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setType(m);
                setErrorMsg('');
              }}
              className={`px-2.5 py-1 rounded whitespace-nowrap border capitalize ${
                type === m
                  ? 'bg-ink text-paper border-ink font-semibold'
                  : 'bg-surface-alt border-ink-hairline text-ink-muted'
              }`}
              aria-pressed={type === m}
            >
              {m.replace('_', ' ')}
            </button>
          ))}
        </div>

        {errorMsg && (
          <div className="p-2 text-xs bg-brick-soft text-brick border border-brick/30 rounded font-medium" role="alert">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label htmlFor="quick-add-amount" className="text-xs font-semibold text-ink-muted uppercase block mb-1">
              Amount (₱)
            </label>
            <input
              id="quick-add-amount"
              type="number"
              autoFocus
              min="0.01"
              step="0.01"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full text-2xl font-bold px-3 py-2 bg-surface-alt border border-ink-hairline rounded-lg tabular-nums focus:outline-none focus:ring-1 focus:ring-pine"
            />
          </div>

          {type === 'expense' && (
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-ink-muted uppercase block mb-1 font-semibold">From Account</label>
                <select
                  value={sourceAccountId}
                  onChange={(e) => setSourceAccountId(e.target.value)}
                  className="w-full p-2 bg-surface-alt border border-ink-hairline rounded-lg"
                >
                  {currentPersona.accounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {accountLabel(acc.id)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-ink-muted uppercase block mb-1 font-semibold">Category</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2 bg-surface-alt border border-ink-hairline rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-ink-muted uppercase block mb-1 font-semibold">Merchant / Person</label>
                  <input
                    type="text"
                    value={merchant}
                    onChange={(e) => setMerchant(e.target.value)}
                    placeholder="Optional"
                    className="w-full p-2 bg-surface-alt border border-ink-hairline rounded-lg"
                  />
                </div>
              </div>
            </div>
          )}

          {type === 'income' && (
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-ink-muted uppercase block mb-1 font-semibold">To Destination Account</label>
                <select
                  value={sourceAccountId}
                  onChange={(e) => setSourceAccountId(e.target.value)}
                  className="w-full p-2 bg-surface-alt border border-ink-hairline rounded-lg"
                >
                  {currentPersona.accounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {accountLabel(acc.id)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-ink-muted uppercase block mb-1 font-semibold">Source / Description</label>
                <input
                  type="text"
                  value={merchant}
                  onChange={(e) => setMerchant(e.target.value)}
                  placeholder="e.g. Salary, Gig, Bonus"
                  className="w-full p-2 bg-surface-alt border border-ink-hairline rounded-lg"
                />
              </div>
            </div>
          )}

          {type === 'transfer' && (
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-ink-muted uppercase block mb-1 font-semibold">Source Account</label>
                  <select
                    value={sourceAccountId}
                    onChange={(e) => setSourceAccountId(e.target.value)}
                    className="w-full p-2 bg-surface-alt border border-ink-hairline rounded-lg"
                  >
                    {currentPersona.accounts.map((acc) => (
                      <option key={acc.id} value={acc.id}>{accountLabel(acc.id)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-ink-muted uppercase block mb-1 font-semibold">Destination Account</label>
                  <select
                    value={destAccountId}
                    onChange={(e) => setDestAccountId(e.target.value)}
                    className="w-full p-2 bg-surface-alt border border-ink-hairline rounded-lg"
                  >
                    {currentPersona.accounts.map((acc) => (
                      <option key={acc.id} value={acc.id}>{accountLabel(acc.id)}</option>
                    ))}
                  </select>
                </div>
              </div>
              <p className="text-[11px] text-ink-muted">
                Transfers conserve net worth and do not count as income or spending.
              </p>
            </div>
          )}

          {type === 'debt_payment' && (
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-ink-muted uppercase block mb-1 font-semibold">Target Debt</label>
                <select
                  value={selectedDebtId}
                  onChange={(e) => setSelectedDebtId(e.target.value)}
                  className="w-full p-2 bg-surface-alt border border-ink-hairline rounded-lg"
                >
                  {activeDebts.length === 0 ? (
                    <option value="">No active debts recorded</option>
                  ) : (
                    activeDebts.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} (Bal: {privacyMoneyText(d.remainingBalanceCentavos, isPrivacyMasked)})
                      </option>
                    ))
                  )}
                </select>
              </div>
              <div>
                <label className="text-ink-muted uppercase block mb-1 font-semibold">From Account</label>
                <select
                  value={sourceAccountId}
                  onChange={(e) => setSourceAccountId(e.target.value)}
                  className="w-full p-2 bg-surface-alt border border-ink-hairline rounded-lg"
                >
                  {currentPersona.accounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>{accountLabel(acc.id)}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {type === 'iou_settlement' && (
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-ink-muted uppercase block mb-1 font-semibold">Target IOU</label>
                <select
                  value={selectedIouId}
                  onChange={(e) => setSelectedIouId(e.target.value)}
                  className="w-full p-2 bg-surface-alt border border-ink-hairline rounded-lg"
                >
                  {activeIous.length === 0 ? (
                    <option value="">No open IOUs recorded</option>
                  ) : (
                    activeIous.map((i) => (
                      <option key={i.id} value={i.id}>
                        {i.personName} — {i.direction === 'owed_to_me' ? 'Receivable' : 'Payable'} ({privacyMoneyText(i.amountCentavos, isPrivacyMasked)})
                      </option>
                    ))
                  )}
                </select>
              </div>
              <div>
                <label className="text-ink-muted uppercase block mb-1 font-semibold">Account</label>
                <select
                  value={sourceAccountId}
                  onChange={(e) => setSourceAccountId(e.target.value)}
                  className="w-full p-2 bg-surface-alt border border-ink-hairline rounded-lg"
                >
                  {currentPersona.accounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>{accountLabel(acc.id)}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div>
            <label className="text-ink-muted uppercase block mb-1 font-semibold text-xs">Note</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Optional"
              className="w-full p-2 bg-surface-alt border border-ink-hairline rounded-lg text-xs"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-pine text-white text-sm font-semibold rounded-lg hover:bg-pine/90 transition-colors shadow-xs"
          >
            Log {type.replace('_', ' ')}
          </button>
        </form>
      </div>
    </div>
  );
};
