import React from 'react';
import { useKivra } from '../../state/kivraStore';
import { SectionHeader } from '../../components/kivra/SectionHeader';
import { Download, Printer } from 'lucide-react';

export const ExportsView: React.FC = () => {
  const { currentPersona } = useKivra();

  const downloadCSV = () => {
    const headers = "ID,Date,Type,AmountCentavos,Category,Merchant,Note\n";
    const rows = currentPersona.transactions
      .map((t) => `${t.id},${t.timestamp},${t.type},${t.amountCentavos},${t.category || ''},${t.merchant || ''},"${t.note || ''}"`)
      .join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kivra_${currentPersona.id}_transactions.csv`;
    a.click();
  };

  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(currentPersona, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kivra_${currentPersona.id}_state.json`;
    a.click();
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-baseline">
        <h1 className="text-xl font-bold tracking-tight text-ink">Local Data & Exports</h1>
        <span className="text-xs text-ink-muted">Client-Side Only</span>
      </div>

      <section className="bg-surface border border-ink-hairline rounded-xl p-4 space-y-3">
        <SectionHeader title="Download Data Registers" />
        <button
          onClick={downloadCSV}
          className="w-full flex items-center justify-between p-3 bg-surface-alt rounded-lg border border-ink-hairline text-sm font-medium text-ink hover:bg-ink-hairline/40 transition-colors"
        >
          <span className="flex items-center gap-2">
            <Download className="w-4 h-4 text-pine" /> Download Transactions CSV
          </span>
          <span className="text-xs text-ink-muted">{currentPersona.transactions.length} rows</span>
        </button>

        <button
          onClick={downloadJSON}
          className="w-full flex items-center justify-between p-3 bg-surface-alt rounded-lg border border-ink-hairline text-sm font-medium text-ink hover:bg-ink-hairline/40 transition-colors"
        >
          <span className="flex items-center gap-2">
            <Download className="w-4 h-4 text-slate" /> Export Full State JSON Snapshot
          </span>
          <span className="text-xs text-ink-muted">Portable backup</span>
        </button>

        <button
          onClick={() => window.print()}
          className="w-full flex items-center justify-between p-3 bg-surface-alt rounded-lg border border-ink-hairline text-sm font-medium text-ink hover:bg-ink-hairline/40 transition-colors"
        >
          <span className="flex items-center gap-2">
            <Printer className="w-4 h-4 text-ink" /> Print Current Ledger & Runway Summary
          </span>
          <span className="text-xs text-ink-muted">Printable view</span>
        </button>
      </section>
    </div>
  );
};
