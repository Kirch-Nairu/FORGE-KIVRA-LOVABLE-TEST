import React, { useState } from 'react';
import { useKivra } from '../../state/kivraStore';
import { SectionHeader } from '../../components/kivra/SectionHeader';
import { MoneyFigure } from '../../components/kivra/MoneyFigure';
import { Download, FileText, Printer } from 'lucide-react';
import { csvDocument } from '../../lib/export/csv';
import { privacyMoneyText } from '../../lib/privacy';

type ReportKind = 'monthly' | 'debt' | 'iou' | 'goal';

export const ExportsView: React.FC = () => {
  const { currentPersona, safeToSpend, isPrivacyMasked } = useKivra();
  const [activeReport, setActiveReport] = useState<ReportKind | null>(null);

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 0);
  };

  const exportTransactionsCSV = () =>
    downloadFile(
      csvDocument(
        ['ID', 'Timestamp', 'Type', 'AmountCentavos', 'AccountID', 'DestinationAccountID', 'Category', 'Merchant', 'Note'],
        currentPersona.transactions.map((t) => [
          t.id,
          t.timestamp,
          t.type,
          t.amountCentavos,
          t.accountId,
          t.toAccountId || '',
          t.category || '',
          t.merchant || '',
          t.note || '',
        ])
      ),
      `kivra_${currentPersona.id}_transactions.csv`,
      'text/csv;charset=utf-8'
    );

  const exportIncomeCSV = () =>
    downloadFile(
      csvDocument(
        ['ID', 'Timestamp', 'AmountCentavos', 'AccountID', 'Category', 'Merchant', 'Note'],
        currentPersona.transactions
          .filter((t) => t.type === 'income')
          .map((t) => [t.id, t.timestamp, t.amountCentavos, t.accountId, t.category || '', t.merchant || '', t.note || ''])
      ),
      `kivra_${currentPersona.id}_income.csv`,
      'text/csv;charset=utf-8'
    );

  const exportExpenseCSV = () =>
    downloadFile(
      csvDocument(
        ['ID', 'Timestamp', 'AmountCentavos', 'AccountID', 'Category', 'Merchant', 'Note'],
        currentPersona.transactions
          .filter((t) => t.type === 'expense')
          .map((t) => [t.id, t.timestamp, t.amountCentavos, t.accountId, t.category || '', t.merchant || '', t.note || ''])
      ),
      `kivra_${currentPersona.id}_expenses.csv`,
      'text/csv;charset=utf-8'
    );

  const exportAccountsCSV = () =>
    downloadFile(
      csvDocument(
        ['ID', 'Name', 'Type', 'Institution', 'BalanceCentavos', 'IsSpendable'],
        currentPersona.accounts.map((a) => [a.id, a.name, a.type, a.institution || '', a.balanceCentavos, a.isSpendable])
      ),
      `kivra_${currentPersona.id}_accounts.csv`,
      'text/csv;charset=utf-8'
    );

  const exportDebtsCSV = () =>
    downloadFile(
      csvDocument(
        ['ID', 'Name', 'Institution', 'RemainingBalanceCentavos', 'MinimumDueCentavos', 'DueDate', 'APR'],
        currentPersona.debts.map((d) => [
          d.id,
          d.name,
          d.institution,
          d.remainingBalanceCentavos,
          d.minimumDueCentavos,
          d.dueDate,
          d.interestRateAnnual,
        ])
      ),
      `kivra_${currentPersona.id}_debts.csv`,
      'text/csv;charset=utf-8'
    );

  const exportIousCSV = () =>
    downloadFile(
      csvDocument(
        ['ID', 'PersonName', 'Direction', 'AmountCentavos', 'Status', 'DueDate', 'Description'],
        currentPersona.ious.map((i) => [
          i.id,
          i.personName,
          i.direction,
          i.amountCentavos,
          i.status,
          i.dueDate || '',
          i.description,
        ])
      ),
      `kivra_${currentPersona.id}_ious.csv`,
      'text/csv;charset=utf-8'
    );

  const exportGoalsCSV = () =>
    downloadFile(
      csvDocument(
        ['ID', 'Title', 'TargetCentavos', 'CurrentCentavos', 'MonthlyContributionCentavos', 'TargetDate'],
        currentPersona.goals.map((g) => [
          g.id,
          g.title,
          g.targetCentavos,
          g.currentCentavos,
          g.monthlyContributionCentavos,
          g.targetDate,
        ])
      ),
      `kivra_${currentPersona.id}_goals.csv`,
      'text/csv;charset=utf-8'
    );

  const exportJSON = () => {
    const snapshot = {
      format: 'kivra-reference-snapshot',
      formatVersion: 1,
      persona: currentPersona,
    };
    downloadFile(
      JSON.stringify(snapshot, null, 2),
      `kivra_${currentPersona.id}_snapshot.json`,
      'application/json;charset=utf-8'
    );
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-baseline">
        <h1 className="text-xl font-bold tracking-tight text-ink">Local Data & Exports</h1>
        <span className="text-xs text-ink-muted">Client-side reference data</span>
      </div>

      <section className="bg-surface border border-ink-hairline rounded-xl p-4 space-y-3">
        <SectionHeader title="Printable Reports" />
        <p className="text-xs text-ink-muted">
          Select an intentional report view, then use the browser print dialog for paper or PDF output.
        </p>

        <div className="grid grid-cols-2 gap-2 text-xs">
          {[
            { id: 'monthly' as const, title: 'Monthly Summary' },
            { id: 'debt' as const, title: 'Debt Register' },
            { id: 'iou' as const, title: 'Peer IOU Report' },
            { id: 'goal' as const, title: 'Goal Progress' },
          ].map((report) => (
            <button
              key={report.id}
              type="button"
              onClick={() => setActiveReport(activeReport === report.id ? null : report.id)}
              className={`p-2.5 rounded-lg border text-left flex items-center justify-between ${
                activeReport === report.id
                  ? 'bg-pine-soft border-pine font-bold text-pine'
                  : 'bg-surface-alt border-ink-hairline text-ink'
              }`}
            >
              <span>{report.title}</span>
              <FileText className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          ))}
        </div>

        {activeReport && (
          <article id="kivra-print-report" className="p-4 bg-paper border border-ink-hairline rounded-lg space-y-3 font-sans">
            <header className="flex justify-between items-center border-b border-ink-hairline pb-2">
              <div>
                <span className="text-[10px] font-bold uppercase text-pine">Kivra Reference Report</span>
                <h3 className="text-sm font-bold text-ink">
                  {activeReport === 'monthly' && 'Monthly Runway & Obligation Summary'}
                  {activeReport === 'debt' && 'Debt Liability Register'}
                  {activeReport === 'iou' && 'Informal Peer IOU Report'}
                  {activeReport === 'goal' && 'Funded Goal Progress Report'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-ink text-paper rounded text-xs font-semibold"
              >
                <Printer className="w-3.5 h-3.5" aria-hidden="true" /> Print report
              </button>
            </header>

            {activeReport === 'monthly' && (
              <div className="text-xs space-y-2">
                <div className="flex justify-between py-1 border-b border-ink-hairline">
                  <span>Profile</span>
                  <span className="font-semibold text-right">{currentPersona.name} · {currentPersona.headline}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-ink-hairline">
                  <span>Safe-to-Spend daily</span>
                  <MoneyFigure centavos={safeToSpend.stsDailyCentavos} size="sm" semantic="pine" />
                </div>
                <div className="flex justify-between py-1 border-b border-ink-hairline">
                  <span>Total STS until payday ({safeToSpend.horizonDays}d)</span>
                  <MoneyFigure centavos={safeToSpend.stsTotalCentavos} size="sm" semantic="neutral" />
                </div>
                <div className="flex justify-between py-1">
                  <span>Committed bills & debt minimums</span>
                  <MoneyFigure centavos={safeToSpend.billsCentavos + safeToSpend.debtMinCentavos} size="sm" semantic="neutral" />
                </div>
              </div>
            )}

            {activeReport === 'debt' && (
              <div className="text-xs divide-y divide-ink-hairline">
                {currentPersona.debts.length === 0 ? (
                  <p className="py-2 text-ink-muted">No debt liabilities recorded.</p>
                ) : (
                  currentPersona.debts.map((d) => (
                    <div key={d.id} className="py-2 flex justify-between gap-4">
                      <div>
                        <span className="font-medium text-ink block">{d.name}</span>
                        <span className="text-[11px] text-ink-muted">
                          Minimum due {privacyMoneyText(d.minimumDueCentavos, isPrivacyMasked)} by {d.dueDate} · {d.interestRateAnnual}% APR
                        </span>
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
                    <div key={i.id} className="py-2 flex justify-between gap-4">
                      <div>
                        <span className="font-medium text-ink block">
                          {i.personName} · {i.direction === 'owed_to_me' ? 'Owed to me' : 'I owe'}
                        </span>
                        <span className="text-[11px] text-ink-muted">{i.description} · {i.status.replace('_', ' ').toUpperCase()}</span>
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
                  <div key={g.id} className="py-2 flex justify-between gap-4">
                    <div>
                      <span className="font-medium text-ink block">{g.title}</span>
                      <span className="text-[11px] text-ink-muted">
                        Target {g.targetDate} · {privacyMoneyText(g.monthlyContributionCentavos, isPrivacyMasked)}/mo
                      </span>
                    </div>
                    <div className="text-right">
                      <MoneyFigure centavos={g.currentCentavos} size="sm" semantic="neutral" />
                      <span className="text-[10px] text-ink-muted block">
                        of {privacyMoneyText(g.targetCentavos, isPrivacyMasked)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </article>
        )}
      </section>

      <section className="bg-surface border border-ink-hairline rounded-xl p-4 space-y-2">
        <SectionHeader title="Local Data Registers" />
        <p className="text-[11px] text-ink-muted">
          Downloads contain the current demo/runtime financial data even when Privacy Mask is on. Nothing is uploaded.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {[
            ['Transactions Register CSV', exportTransactionsCSV],
            ['Income Register CSV', exportIncomeCSV],
            ['Expense Register CSV', exportExpenseCSV],
            ['Account Balances CSV', exportAccountsCSV],
            ['Debt Register CSV', exportDebtsCSV],
            ['IOU Register CSV', exportIousCSV],
            ['Goal Progress CSV', exportGoalsCSV],
            ['Full State JSON Snapshot', exportJSON],
          ].map(([label, action]) => (
            <button
              key={label as string}
              type="button"
              onClick={action as () => void}
              className="p-3 bg-surface-alt border border-ink-hairline rounded-lg text-left flex items-center justify-between hover:border-pine"
            >
              <span>{label as string}</span>
              <Download className="w-3.5 h-3.5 text-pine" aria-hidden="true" />
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};
