import React from 'react';
import { useKivra } from '../../state/kivraStore';
import { SectionHeader } from '../../components/kivra/SectionHeader';
import { Moon, Eye, RefreshCw, Download, FileText, User } from 'lucide-react';

export const YouView: React.FC<{ onNavigate: (tab: string) => void }> = ({ onNavigate }) => {
  const {
    currentPersona,
    setPersona,
    isPrivacyMasked,
    togglePrivacyMask,
    isDarkMode,
    toggleDarkMode,
    resetToSeeds,
  } = useKivra();

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center gap-3 bg-surface border border-ink-hairline rounded-xl p-4">
        <div className="w-12 h-12 rounded-full bg-pine-soft flex items-center justify-center text-pine font-bold text-lg">
          {currentPersona.name[0]}
        </div>
        <div>
          <h2 className="text-base font-bold text-ink">{currentPersona.name}</h2>
          <p className="text-xs text-ink-muted">{currentPersona.headline}</p>
        </div>
      </div>

      {/* Demo Persona Switcher */}
      <section className="bg-surface border border-ink-hairline rounded-xl p-4 space-y-3">
        <SectionHeader title="Active Demo Persona" />
        <div className="grid grid-cols-3 gap-2">
          {(['mika', 'dan', 'ysa'] as const).map((id) => (
            <button
              key={id}
              onClick={() => setPersona(id)}
              className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all text-center capitalize ${
                currentPersona.id === id
                  ? 'bg-pine text-white border-pine shadow-xs'
                  : 'bg-surface-alt border-ink-hairline text-ink hover:bg-ink-hairline/50'
              }`}
            >
              {id}
            </button>
          ))}
        </div>
      </section>

      {/* Preferences & Privacy */}
      <section className="bg-surface border border-ink-hairline rounded-xl p-4 divide-y divide-ink-hairline text-sm">
        <SectionHeader title="Display & Privacy Controls" />

        <div className="py-2.5 flex justify-between items-center">
          <span className="flex items-center gap-2 text-ink">
            <Eye className="w-4 h-4 text-ink-muted" /> Privacy Mask (Mask ₱ Values)
          </span>
          <button
            onClick={togglePrivacyMask}
            className={`px-3 py-1 text-xs font-medium rounded border ${
              isPrivacyMasked ? 'bg-pine text-white border-pine' : 'bg-surface-alt border-ink-hairline text-ink'
            }`}
          >
            {isPrivacyMasked ? 'Masked' : 'Visible'}
          </button>
        </div>

        <div className="py-2.5 flex justify-between items-center">
          <span className="flex items-center gap-2 text-ink">
            <Moon className="w-4 h-4 text-ink-muted" /> Dark Mode
          </span>
          <button
            onClick={toggleDarkMode}
            className={`px-3 py-1 text-xs font-medium rounded border ${
              isDarkMode ? 'bg-pine text-white border-pine' : 'bg-surface-alt border-ink-hairline text-ink'
            }`}
          >
            {isDarkMode ? 'Dark' : 'Light'}
          </button>
        </div>

        <div className="py-2.5 flex justify-between items-center">
          <span className="flex items-center gap-2 text-ink">
            <RefreshCw className="w-4 h-4 text-ink-muted" /> Reset to Golden Seeds
          </span>
          <button
            onClick={resetToSeeds}
            className="px-3 py-1 text-xs font-medium rounded bg-surface-alt border border-ink-hairline text-brick hover:bg-brick/10"
          >
            Reset State
          </button>
        </div>
      </section>

      {/* Export & Health Shortcuts */}
      <section className="bg-surface border border-ink-hairline rounded-xl p-4 space-y-2">
        <SectionHeader title="Diagnostics & Reports" />
        <button
          onClick={() => onNavigate('health')}
          className="w-full flex justify-between items-center p-2.5 bg-surface-alt rounded-lg border border-ink-hairline text-sm font-medium text-ink hover:bg-ink-hairline/30"
        >
          <span>Financial Health Indicators</span>
          <span className="text-xs text-pine font-bold">6 Dimensions →</span>
        </button>
        <button
          onClick={() => onNavigate('exports')}
          className="w-full flex justify-between items-center p-2.5 bg-surface-alt rounded-lg border border-ink-hairline text-sm font-medium text-ink hover:bg-ink-hairline/30"
        >
          <span>Exports & Print Reports</span>
          <span className="text-xs text-slate font-bold">CSV / JSON / Print →</span>
        </button>
      </section>
    </div>
  );
};
