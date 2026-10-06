import React from 'react';
import { useKivra } from '../../state/kivraStore';
import { SectionHeader } from '../../components/kivra/SectionHeader';
import { prototypeClock } from '../../domain/clock';
import { Eye, EyeOff, Moon, Sun, RotateCcw, Compass, FileSpreadsheet, ShieldAlert } from 'lucide-react';

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
      <div className="flex justify-between items-baseline">
        <h1 className="text-xl font-bold tracking-tight text-ink">Settings & Profile</h1>
        <span className="text-xs text-ink-muted">Kivra OS</span>
      </div>

      {/* Profile Overview */}
      <section className="bg-surface border border-ink-hairline rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-pine-soft flex items-center justify-center text-lg font-bold text-pine border border-pine/30">
            {currentPersona.name[0]}
          </div>
          <div>
            <h2 className="text-base font-bold text-ink">{currentPersona.name}</h2>
            <p className="text-xs text-ink-muted">{currentPersona.headline}</p>
          </div>
        </div>
      </section>

      {/* Guided Onboarding */}
      <section className="bg-surface border border-ink-hairline rounded-xl p-4 space-y-2">
        <SectionHeader title="Guided Onboarding" />
        <button
          onClick={() => onNavigate('onboarding')}
          className="w-full p-3 bg-surface-alt border border-ink-hairline rounded-lg text-left flex items-center justify-between text-xs font-semibold text-ink hover:border-pine"
        >
          <span className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-pine" /> Rerun Guided Financial Setup
          </span>
          <span className="text-pine">Start →</span>
        </button>
      </section>

      {/* Demo Personas */}
      <section className="bg-surface border border-ink-hairline rounded-xl p-4 space-y-2">
        <SectionHeader title="Demo Profile Switcher" />
        <div className="grid grid-cols-3 gap-2 text-xs">
          {(['mika', 'dan', 'ysa'] as const).map((id) => (
            <button
              key={id}
              onClick={() => setPersona(id)}
              className={`p-2.5 rounded-lg border capitalize font-semibold transition-colors ${
                currentPersona.id === id
                  ? 'bg-ink text-paper border-ink'
                  : 'bg-surface-alt border-ink-hairline text-ink-muted hover:text-ink'
              }`}
            >
              {id}
            </button>
          ))}
        </div>
      </section>

      {/* Quick Navigation to Secondary Surfaces */}
      <section className="bg-surface border border-ink-hairline rounded-xl p-4 space-y-2">
        <SectionHeader title="Management Tools" />
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            onClick={() => onNavigate('ledger')}
            className="p-3 bg-surface-alt border border-ink-hairline rounded-lg text-left font-medium text-ink hover:border-pine"
          >
            Full Activity Ledger →
          </button>
          <button
            onClick={() => onNavigate('health')}
            className="p-3 bg-surface-alt border border-ink-hairline rounded-lg text-left font-medium text-ink hover:border-pine"
          >
            Financial Health →
          </button>
          <button
            onClick={() => onNavigate('exports')}
            className="p-3 bg-surface-alt border border-ink-hairline rounded-lg text-left font-medium text-ink hover:border-pine"
          >
            Data Registers & Exports →
          </button>
          <button
            onClick={() => onNavigate('search')}
            className="p-3 bg-surface-alt border border-ink-hairline rounded-lg text-left font-medium text-ink hover:border-pine"
          >
            Global Local Search →
          </button>
        </div>
      </section>

      {/* Appearance & Privacy */}
      <section className="bg-surface border border-ink-hairline rounded-xl p-4 space-y-3">
        <SectionHeader title="Display & Privacy" />
        <div className="flex justify-between items-center py-2 border-b border-ink-hairline text-sm">
          <div>
            <span className="font-medium text-ink block">Privacy Mask</span>
            <span className="text-xs text-ink-muted">Mask monetary amounts in public view</span>
          </div>
          <button
            onClick={togglePrivacyMask}
            className="p-2 rounded-lg bg-surface-alt border border-ink-hairline text-ink"
            aria-label="Toggle Privacy Mask"
          >
            {isPrivacyMasked ? <EyeOff className="w-4 h-4 text-pine" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        <div className="flex justify-between items-center py-2 text-sm">
          <div>
            <span className="font-medium text-ink block">Dark Mode</span>
            <span className="text-xs text-ink-muted">Warm ledger dark palette</span>
          </div>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg bg-surface-alt border border-ink-hairline text-ink"
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </section>

      {/* Reset */}
      <section className="bg-surface border border-ink-hairline rounded-xl p-4">
        <button
          onClick={resetToSeeds}
          className="w-full flex items-center justify-center gap-2 p-2.5 bg-surface-alt border border-ink-hairline rounded-lg text-xs font-semibold text-brick hover:bg-brick-soft"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset to Prototype Seeds
        </button>
      </section>
    </div>
  );
};
