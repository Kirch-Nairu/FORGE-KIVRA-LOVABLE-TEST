import React, { useState } from 'react';
import { useKivra } from '../../state/kivraStore';

export const QuickAddView: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { currentPersona, addTransaction } = useKivra();
  const [type, setType] = useState<'expense' | 'income' | 'transfer' | 'debt_payment' | 'iou_settlement'>('expense');
  const [amount, setAmount] = useState('');
  const [sourceAccountId, setSourceAccountId] = useState(currentPersona.accounts[0]?.id || '');
  const [destAccountId, setDestAccountId] = useState(
    currentPersona.accounts[1]?.id || currentPersona.accounts[0]?.id || ''
  );
  const [selectedDebtId, setSelectedDebtId] = useState(currentPersona.debts[0]?.id || '');
  const [selectedIouId, setSelectedIouId] = useState(currentPersona.ious[0]?.id || '');
  const [category, setCategory] = useState('Food & Drink');
  const [merchant, setMerchant] = useState('');
  const [note, setNote] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const val = parseFloat(amount);
    if (!val || val <= 0) {
      setErrorMsg('Please enter a valid amount.');
      return;
    }

    const amountCentavos = Math.round(val * 100);

    if (type === 'transfer') {
      if (sourceAccountId === destAccountId) {
        setErrorMsg('Source and destination accounts must be different.');
        return;
      }
      const sourceAcc = currentPersona.accounts.find((a) => a.id === sourceAccountId);
      if (sourceAcc && sourceAcc.balanceCentavos < amountCentavos) {
        setErrorMsg(`Insufficient funds in ${sourceAcc.name} (Balance: ₱${(sourceAcc.balanceCentavos / 100).toFixed(0)}).`);
        return;
      }
    }

    if (type === 'debt_payment') {
      if (!selectedDebtId) {
        setErrorMsg('Please select a debt obligation to pay.');
        return;
      }
    }

    if (type === 'iou_settlement') {
      if (!selectedIouId) {
        setErrorMsg('Please select a peer IOU to settle.');
        return;
      }
    }

    addTransaction({
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

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-ink/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
      <div className="bg-surface border border-ink-hairline w-full max-w-md rounded-t-2xl sm:rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex justify-between items-center border-b border-ink-hairline pb-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-ink">Quick Add Movement</h2>
          <button onClick={onClose} className="text-xs text-ink-muted hover:text-ink font-semibold">Cancel</button>
        </div>

        {/* Mode Selector */}
        <div className="flex gap-1 overflow-x-auto pb-1 text-xs">
          {(['expense', 'income', 'transfer', 'debt_payment', 'iou_settlement'] as const).map((m) => (
            <button
              key={m}
              onClick={() => {
                setType(m);
                setErrorMsg('');
              }}
              className={`px-2.5 py-1 rounded whitespace-nowrap border capitalize ${
                type === m ? 'bg-ink text-paper border-ink font-semibold' : 'bg-surface-alt border-ink-hairline text-ink-muted'
              }`}
            >
              {m.replace('_', ' ')}
            </button>
          ))}
        </div>

        {errorMsg && (
          <div className="p-2 text-xs bg-brick-soft text-brick border border-brick/30 rounded font-medium">
            {errorMsg}
          </div>
        )}

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

          {/* Contextual form fields based on mode */}
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
                      {acc.name} (₱{(acc.balanceCentavos / 100).toFixed(0)})
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
                      {acc.name} (₱{(acc.balanceCentavos / 100).toFixed(0)})
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
                      <option key={acc.id} value={acc.id}>
                        {acc.name}
                      </option>
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
                      <option key={acc.id} value={acc.id}>
                        {acc.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <p className="text-[11px] text-ink-muted">
                Transfers conserve net worth and do not alter monthly spending or income totals.
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
                  {currentPersona.debts.length === 0 ? (
                    <option value="">No debts recorded</option>
                  ) : (
                    currentPersona.debts.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} (Bal: ₱{(d.remainingBalanceCentavos / 100).toFixed(0)})
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
                    <option key={acc.id} value={acc.id}>
                      {acc.name} (₱{(acc.balanceCentavos / 100).toFixed(0)})
                    </option>
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
                  {currentPersona.ious.length === 0 ? (
                    <option value="">No IOUs recorded</option>
                  ) : (
                    currentPersona.ious.map((i) => (
                      <option key={i.id} value={i.id}>
                        {i.personName} - {i.direction === 'owed_to_me' ? 'Receivable' : 'Payable'} (₱{(i.amountCentavos / 100).toFixed(0)})
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
                    <option key={acc.id} value={acc.id}>
                      {acc.name} (₱{(acc.balanceCentavos / 100).toFixed(0)})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

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
