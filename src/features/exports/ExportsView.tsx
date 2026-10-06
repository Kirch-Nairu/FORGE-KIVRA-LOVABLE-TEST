import React, { useState } from 'react';
import { useKivra } from '../../state/kivraStore';
import { SectionHeader } from '../../components/kivra/SectionHeader';
import { MoneyFigure } from '../../components/kivra/MoneyFigure';
import { Download, Printer, FileText } from 'lucide-react';

export const ExportsView: React.FC = () => {
  const { currentPersona, safeToSpend, isPrivacyMasked } = useKivra();
  const [activeReport, setActiveReport] = useState<'monthly' | 'debt' | 'iou' | 'goal' | null>(null);

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    // Revoke object URL after download
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const exportTransactionsCSV = () => {
    const headers = 'ID,Timestamp,Type,AmountCentavos,AccountID,Category,Merchant,Note\n';
    const rows = currentPersona.transactions
      .map(
        (t) =>
          `${t.id},${t.timestamp},${t.type},${t.amountCentavos},${t.accountId},${t.category || ''},${t.merchant || ''},"${t.note || ''}"`
      )
      .join('\n');
    downloadFile(headers + rows, `kivra_${currentPersona.id}_transactions.csv`, 'text/csv');
  };

  const exportIncomeCSV = () => {
    const headers = 'ID,Timestamp,AmountCentavos,AccountID,Category,Note\n';
    const rows = currentPersona.transactions
      .filter((t) => t.type === 'income')
      .map((t) => `${t.id},${t.timestamp},${t.amountCentavos},${t.accountId},${t.category || ''},"${t.note || ''}"`)
      .join('\n');
    downloadFile(headers + rows, `kivra_${currentPersona.id}_income.csv`, 'text/csv');
  };

  const exportExpenseCSV = () => {
    const headers = 'ID,Timestamp,AmountCentavos,AccountID,Category,Merchant,Note\n';
    const rows = currentPersona.transactions
      .filter((t) => t.type === 'expense')
      .map(
        (t) =>
          `${t.id},${t.timestamp},${t.amountCentavos},${t.accountId},${t.category || ''},${t.merchant || ''},"${t.note || ''}"`
      )
      .join('\n');
    downloadFile(headers + rows, `kivra_${currentPersona.id}_expenses.csv`, 'text/csv');
  };

  const exportAccountsCSV = () => {
    const headers = 'ID,Name,Type,BalanceCentavos,IsSpendable\n';
    const rows = currentPersona.accounts
      .map((a) => `${a.id},${a.name},${a.type},${a.balanceCentavos},${a.isSpendable}`)
      .join('\n');
    downloadFile(headers + rows, `kivra_${currentPersona.id}_accounts.csv`, 'text/csv');
  };

  const exportDebtsCSV = () => {
    const headers = 'ID,Name,Institution,RemainingBalanceCentavos,MinimumDueCentavos,DueDate,APR\n';
    const rows = currentPersona.debts
      .map(
        (d) =>
          `${d.id},${d.name},${d.institution},${d.remainingBalanceCentavos},${d.minimumDueCentavos},${d.dueDate},${d.interestRateAnnual}`
      )
      .join('\n');
    downloadFile(headers + rows, `kivra_${currentPersona.id}_debts.csv`, 'text/csv');
  };

  const exportIousCSV = () => {
    const headers = 'ID,PersonName,Direction,AmountCentavos,Status,DueDate,Description\n';
    const rows = currentPersona.ious
      .map(
        (i) =>
          `${i.id},${i.personName},${i.direction},${i.amountCentavos},${i.status},${i.dueDate || ''},"${i.description}"`
      )
      .join('\n');
    downloadFile(headers + rows, `kivra_${currentPersona.id}_ious.csv`, 'text/csv');
  };

  const exportGoalsCSV = () => {
    const headers = 'ID,Title,TargetCentavos,CurrentCentavos,MonthlyContributionCentavos,TargetDate\n';
    const rows = currentPersona.goals
      .map(
        (g) =>
          `${g.id},${g.title},${g.targetCentavos},${g.currentCentavos},${g.monthlyContributionCentavos},${g.targetDate}`
      )
      .join('\n');
    downloadFile(headers + rows, `kivra_${currentPersona.id}_goals.csv`, 'text/csv');
  };

  const exportJSON = () => {
    const json = JSON.stringify(currentPersona, null, 2);
    downloadFile(json, `kivra_${currentPersona.id}_snapshot.json`, 'application/json');
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-baseline">
        <h1 className="text-xl font-bold tracking-tight text-ink">Local Data & Exports</h1>
        <span className="text-xs text-ink-muted">Client-Side Runtime</span>
      </div>

      {/* 14. POLISHED PRINT REPORTS */}
      <section className="bg-surface border border-ink-hairline rounded-xl p-4 space-y-3">
        <SectionHeader title="Polished Printable Reports" />
        <p className="text-xs text-ink-muted">
          Select an intentional financial report view formatted for printing or browser PDF output.
        </p>

        <div className="grid grid-cols-2 gap-2 text-xs">
          {[
            { id: 'monthly', title: 'Monthly Summary' },
            { id: 'debt', title: 'Debt Register' },
            { id: 'iou', title: 'Peer IOU Report' },
            { id: 'goal', title: 'Goal Progress' },
          ].map((r) => (
            <button
              key={r.id}
              onClick={() => setActiveReport(activeReport === r.id ? null : (r.id as any))}
              className={`p-2.5 rounded-lg border text-left flex items-center justify-between ${
                activeReport === r.id ? 'bg-pine-soft border-pine font-bold text-pine' : 'bg-surface-alt border-ink-hairline text-ink'
              }`}
            >
              <span>{r.title}</span>
              <FileText className="w-3.5 h-3.5" />
            </button>
          ))}
        </div>

        {/* Printable preview card */}
        {activeReport && (
          <div className="p-4 bg-paper border border-ink-hairline rounded-lg space-y-3 font-sans">
            <div className="flex justify-between items-center border-b border-ink-hairline pb-2">
              <div>
                <span className="text-[10px] font-bold uppercase text-pine">Kivra Financial Report</span>
                <h3 className="text-sm font-bold text-ink">
                  {activeReport === 'monthly' && 'Monthly Runway & Obligation Summary'}
                  {activeReport === 'debt' && 'Debt Amortization & Liability Register'}
                  {activeReport === 'iou' && 'Informal Peer IOU Settlement Report'}
                  {activeReport === 'goal' && 'Funded Goal Progress & Savings Report'}
                </h3>
              </div>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-ink text-paper rounded text-xs font-semibold"
              >
                <Printer className="w-3.5 h-3.5" /> Print
              </button>
            </div>

            {activeReport === 'monthly' && (
              <div className="text-xs space-y-2">
                <div className="flex justify-between py-1 border-b border-ink-hairline">
                  <span>Profile:</span>
                  <span className="font-semibold">{currentPersona.name} ({currentPersona.headline})</span>
                </div>
                <div className="flex justify-between py-1 border-b border-ink-hairline">
                  <span>Safe-to-Spend Daily Runway:</span>
                  <MoneyFigure centavos={safeToSpend.stsDailyCentavos} size="sm" semantic="pine" />
                </div>
                <div className="flex justify-between py-1 border-b border-ink-hairline">
                  <span>Total STS until Payday ({safeToSpend.horizonDays}d):</span>
                  <MoneyFigure centavos={safeToSpend.stsTotalCentavos} size="sm" semantic="neutral" />
                </div>
                <div className="flex justify-between py-1">
                  <span>Committed Bills & Debt Minimums:</span>
                  <MoneyFigure centavos={safeToSpend.billsCentavos + safeToSpend.debtMinCentavos} size="sm" semantic="neutral" />
                </div>
              </div>
            )}

            {activeReport === 'debt' && (
              <div className="text-xs divide-y divide-ink-hairline">
                {currentPersona.debts.length === 0 ? (
                  <p className="py-2 text-ink-muted">Zero debt liabilities recorded.</p>
                ) : (
                  currentPersona.debts.map((d) => (
                    <div key={d.id} className="py-2 flex justify-between">
                      <div>
                        <span className="font-medium text-ink block">{d.name}</span>
                        <span className="text-[11px] text-ink-muted">Min due: ₱{(d.minimumDueCentavos / 100).toFixed(0)} by {d.dueDate} ({d.interestRateAnnual}% APR)</span>
                      </div>
                      <MoneyFigure centavos={d.remainingBalanceCentavos} size="sm" semantic="neutral" />
                    </div>
                  ))
                )}
              </div>
            )}

            {activeReport === 'iou' && (
              <div className="text-xs divide-y divide-ink-hairline">
                {currentPersona.ious.length === 0 ? (
                  <p className="py-2 text-ink-muted">No peer IOUs on record.</p>
                ) : (
                  currentPersona.ious.map((i) => (
                    <div key={i.id} className="py-2 flex justify-between">
                      <div>
                        <span className="font-medium text-ink block">{i.personName} ({i.direction === 'owed_to_me' ? 'Owed to me' : 'I owe'})</span>
                        <span className="text-[11px] text-ink-muted">{i.description} · {i.status.toUpperCase()}</span>
                      </div>
                      <MoneyFigure centavos={i.amountCentavos} size="sm" semantic="neutral" />
                    </div>
                  ))
                )}
              </div>
            )}

            {activeReport === 'goal' && (
              <div className="text-xs divide-y divide-ink-hairline">
                {currentPersona.goals.map((g) => (
                  <div key={g.id} className="py-2 flex justify-between">
                    <div>
                      <span className="font-medium text-ink block">{g.title}</span>
                      <span className="text-[11px] text-ink-muted">Target date: {g.targetDate} · ₱{(g.monthlyContributionCentavos / 100).toFixed(0)}/mo</span>
                    </div>
                    <div className="text-right">
                      <MoneyFigure centavos={g.currentCentavos} size="sm" semantic="neutral" />
                      <span className="text-[10px] text-ink-muted block">of ₱{(g.targetCentavos / 100).toFixed(0)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* CSV Registers Download Section */}
      <section className="bg-surface border border-ink-hairline rounded-xl p-4 space-y-2">
        <SectionHeader title="Data Registers CSV" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <button
            onClick={exportTransactionsCSV}
            className="p-3 bg-surface-alt border border-ink-hairline rounded-lg text-left flex items-center justify-between hover:border-pine"
          >
            <span>Transactions Register CSV</span>
            <Download className="w-3.5 h-3.5 text-pine" />
          </button>
          <button
            onClick={exportIncomeCSV}
            className="p-3 bg-surface-alt border border-ink-hairline rounded-lg text-left flex items-center justify-between hover:border-pine"
          >
            <span>Income Register CSV</span>
            <Download className="w-3.5 h-3.5 text-pine" />
          </button>
          <button
            onClick={exportExpenseCSV}
            className="p-3 bg-surface-alt border border-ink-hairline rounded-lg text-left flex items-center justify-between hover:border-pine"
          >
            <span>Expense Register CSV</span>
            <Download className="w-3.5 h-3.5 text-pine" />
          </button>
          <button
            onClick={exportAccountsCSV}
            className="p-3 bg-surface-alt border border-ink-hairline rounded-lg text-left flex items-center justify-between hover:border-pine"
          >
            <span>Account Balances CSV</span>
            <Download className="w-3.5 h-3.5 text-pine" />
          </button>
          <button
            onClick={exportDebtsCSV}
            className="p-3 bg-surface-alt border border-ink-hairline rounded-lg text-left flex items-center justify-between hover:border-pine"
          >
            <span>Debt Register CSV</span>
            <Download className="w-3.5 h-3.5 text-pine" />
          </button>
          <button
            onClick={exportIousCSV}
            className="p-3 bg-surface-alt border border-ink-hairline rounded-lg text-left flex items-center justify-between hover:border-pine"
          >
            <span>IOU Register CSV</span>
            <Download className="w-3.5 h-3.5 text-pine" />
          </button>
          <button
            onClick={exportGoalsCSV}
            className="p-3 bg-surface-alt border border-ink-hairline rounded-lg text-left flex items-center justify-between hover:border-pine"
          >
            <span>Goal Progress CSV</span>
            <Download className="w-3.5 h-3.5 text-pine" />
          </button>
          <button
            onClick={exportJSON}
            className="p-3 bg-surface-alt border border-ink-hairline rounded-lg text-left flex items-center justify-between hover:border-pine"
          >
            <span>Full State JSON Backup</span>
            <Download className="w-3.5 h-3.5 text-slate" />
          </button>
        </div>
      </section>
    </div>
  );
};
