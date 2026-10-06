import React from 'react';
import { useKivra } from '../../state/kivraStore';
import { SectionHeader } from '../../components/kivra/SectionHeader';
import { MoneyFigure } from '../../components/kivra/MoneyFigure';
import { Wallet, Landmark } from 'lucide-react';
import { privacyMoneyText } from '../../lib/privacy';

export const MoneyView: React.FC = () => {
  const { currentPersona, isPrivacyMasked } = useKivra();

  const totalAssets = currentPersona.accounts.reduce((s, a) => s + a.balanceCentavos, 0);
  const totalDebts = currentPersona.debts.reduce((s, d) => s + d.remainingBalanceCentavos, 0);
  const netWorth = totalAssets - totalDebts;

  const owedToMe = currentPersona.ious.filter((i) => i.direction === 'owed_to_me');
  const iOwe = currentPersona.ious.filter((i) => i.direction === 'i_owe');

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-baseline">
        <h1 className="text-xl font-bold tracking-tight text-ink">Accounts & Net Worth</h1>
        <div className="text-right">
          <span className="text-xs text-ink-muted block">Subordinate Net Worth</span>
          <MoneyFigure centavos={netWorth} size="sm" semantic={netWorth >= 0 ? 'neutral' : 'brick'} />
        </div>
      </div>

      {/* Money Locations / Accounts */}
      <section className="bg-surface border border-ink-hairline rounded-xl p-4">
        <SectionHeader title="Spendable & Ring-Fenced Accounts" />
        <div className="divide-y divide-ink-hairline">
          {currentPersona.accounts.map((acc) => (
            <div key={acc.id} className="py-2.5 flex justify-between items-center text-sm">
              <div className="flex items-center gap-2.5">
                {acc.type === 'cash' && <Wallet className="w-4 h-4 text-ink-muted" />}
                {acc.type === 'ewallet' && <Landmark className="w-4 h-4 text-pine" />}
                {acc.type === 'payroll' && <Landmark className="w-4 h-4 text-ink" />}
                {acc.type === 'savings' && <Landmark className="w-4 h-4 text-slate" />}
                {acc.type === 'digital_bank' && <Landmark className="w-4 h-4 text-goal" />}
                <div>
                  <span className="font-medium text-ink block">{acc.name}</span>
                  <span className="text-xs text-ink-muted">
                    {acc.isSpendable ? 'Spendable (In STS)' : 'Protected / Isolated'}
                  </span>
                </div>
              </div>
              <MoneyFigure centavos={acc.balanceCentavos} size="sm" semantic="neutral" />
            </div>
          ))}
        </div>
      </section>

      {/* Debts */}
      <section className="bg-surface border border-ink-hairline rounded-xl p-4">
        <SectionHeader title="Formal Debts & Loans" />
        <div className="divide-y divide-ink-hairline">
          {currentPersona.debts.map((d) => (
            <div key={d.id} className="py-2.5 flex justify-between items-center text-sm">
              <div>
                <span className="font-medium text-ink block">{d.name}</span>
                <span className="text-xs text-ink-muted">
                  Min Due {privacyMoneyText(d.minimumDueCentavos, isPrivacyMasked)} by {d.dueDate} ({d.interestRateAnnual}% APR)
                </span>
              </div>
              <div className="text-right">
                <MoneyFigure centavos={d.remainingBalanceCentavos} size="sm" semantic="neutral" />
                <span className="text-[10px] text-ink-muted block">Principal Balance</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* People / IOUs */}
      <section className="bg-surface border border-ink-hairline rounded-xl p-4">
        <SectionHeader title="Informal Peer IOUs" />
        <div className="space-y-4">
          <div>
            <h3 className="text-xs font-semibold text-pine uppercase tracking-wider mb-2">Owed To Me</h3>
            {owedToMe.length === 0 ? (
              <p className="text-xs text-ink-muted">No outstanding receivables.</p>
            ) : (
              <div className="divide-y divide-ink-hairline">
                {owedToMe.map((iou) => (
                  <div key={iou.id} className="py-2 flex justify-between items-center text-sm">
                    <div>
                      <span className="font-medium text-ink">{iou.personName}</span>
                      <span className="text-xs text-ink-muted block">{iou.description}</span>
                    </div>
                    <div className="text-right">
                      <MoneyFigure centavos={iou.amountCentavos} size="sm" semantic="neutral" />
                      <span className={`text-[10px] block font-semibold ${iou.status === 'overdue' ? 'text-brick' : 'text-amber'}`}>
                        {iou.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-ink-hairline">
            <h3 className="text-xs font-semibold text-amber uppercase tracking-wider mb-2">I Owe</h3>
            {iOwe.length === 0 ? (
              <p className="text-xs text-ink-muted">No outstanding peer debts.</p>
            ) : (
              <div className="divide-y divide-ink-hairline">
                {iOwe.map((iou) => (
                  <div key={iou.id} className="py-2 flex justify-between items-center text-sm">
                    <div>
                      <span className="font-medium text-ink">{iou.personName}</span>
                      <span className="text-xs text-ink-muted block">{iou.description}</span>
                    </div>
                    <MoneyFigure centavos={iou.amountCentavos} size="sm" semantic="neutral" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
