import React, { useState } from 'react';
import { useKivra } from '../state/kivraStore';
import { useRouter, AppRoute } from './router';
import { TodayView } from '../features/today/TodayView';
import { PlanView } from '../features/plan/PlanView';
import { MoneyView } from '../features/money/MoneyView';
import { GoalsView } from '../features/goals/GoalsView';
import { PatternsView } from '../features/patterns/PatternsView';
import { LedgerView } from '../features/ledger/LedgerView';
import { SearchView } from '../features/search/SearchView';
import { YouView } from '../features/you/YouView';
import { HealthView } from '../features/health/HealthView';
import { ExportsView } from '../features/exports/ExportsView';
import { OnboardingView } from '../features/onboarding/OnboardingView';
import { QuickAddView } from '../features/quick-add/QuickAddView';
import {
  Calendar,
  LayoutDashboard,
  Wallet,
  Target,
  Sparkles,
  Plus,
  Search,
  User,
  Eye,
  EyeOff,
  BookOpen,
  Activity,
  Download,
  RotateCcw,
  Compass,
} from 'lucide-react';

export const AppShell: React.FC = () => {
  const { currentRoute, navigate } = useRouter();
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const {
    currentPersona,
    isPrivacyMasked,
    togglePrivacyMask,
    lastActionMessage,
    clearLastActionMessage,
    hasUndo,
    undoLastMutation,
  } = useKivra();

  return (
    <div className="min-h-screen bg-paper text-ink flex justify-center">
      <div className="w-full max-w-6xl flex">
        {/* 15. ADAPTIVE EXPANDED NAVIGATION RAIL / SIDEBAR (hidden on compact mobile) */}
        <aside className="hidden md:flex flex-col w-64 border-r border-ink-hairline p-4 space-y-6 shrink-0 h-screen sticky top-0 overflow-y-auto">
          {/* Logo & Persona */}
          <div className="flex items-center justify-between pb-3 border-b border-ink-hairline">
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-ink uppercase">Kivra</span>
              <span className="text-[10px] font-semibold bg-surface-alt border border-ink-hairline px-2 py-0.5 rounded text-ink-muted">
                {currentPersona.name.toUpperCase()}
              </span>
            </div>
            <button
              onClick={togglePrivacyMask}
              className="p-1.5 rounded hover:bg-surface-alt text-ink-muted hover:text-ink transition-colors"
              title="Toggle Privacy Mask"
              aria-label="Toggle Privacy Mask"
            >
              {isPrivacyMasked ? <EyeOff className="w-4 h-4 text-pine" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Quick Add CTA */}
          <button
            onClick={() => setShowQuickAdd(true)}
            className="w-full flex items-center justify-center gap-2 py-2 bg-pine text-white text-xs font-semibold rounded-lg hover:bg-pine/90 transition-colors shadow-xs"
            aria-label="Quick Add Movement"
          >
            <Plus className="w-4 h-4" /> Quick Add Movement
          </button>

          {/* 5 Primary tabs */}
          <nav className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted px-2 block mb-1">
              Primary Destinations
            </span>
            {[
              { route: '/today', label: 'Today', icon: LayoutDashboard },
              { route: '/plan', label: 'Plan', icon: Calendar },
              { route: '/money', label: 'Money', icon: Wallet },
              { route: '/goals', label: 'Goals', icon: Target },
              { route: '/patterns', label: 'Patterns', icon: Sparkles },
            ].map(({ route, label, icon: Icon }) => (
              <button
                key={route}
                onClick={() => navigate(route)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                  currentRoute === route ? 'bg-pine-soft text-pine font-bold' : 'text-ink-muted hover:bg-surface-alt hover:text-ink'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </nav>

          {/* Secondary routes */}
          <nav className="space-y-1 pt-3 border-t border-ink-hairline">
            <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted px-2 block mb-1">
              Registers & Tools
            </span>
            {[
              { route: '/ledger', label: 'Ledger', icon: BookOpen },
              { route: '/search', label: 'Search', icon: Search },
              { route: '/health', label: 'Financial Health', icon: Activity },
              { route: '/exports', label: 'Data & Reports', icon: Download },
              { route: '/onboarding', label: 'Onboarding', icon: Compass },
              { route: '/you', label: 'You & Settings', icon: User },
            ].map(({ route, label, icon: Icon }) => (
              <button
                key={route}
                onClick={() => navigate(route)}
                className={`w-full flex items-center gap-3 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  currentRoute === route ? 'bg-surface-alt text-ink font-bold' : 'text-ink-muted hover:bg-surface-alt hover:text-ink'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content Pane */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="w-full max-w-2xl mx-auto px-4 py-3 flex-1 flex flex-col">
            {/* Top Header on Compact Mobile */}
            <header className="md:hidden flex items-center justify-between py-2 border-b border-ink-hairline mb-4">
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight text-ink uppercase">Kivra</span>
                <span className="text-[10px] font-semibold bg-surface-alt border border-ink-hairline px-1.5 py-0.5 rounded text-ink-muted">
                  {currentPersona.name.toUpperCase()}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={togglePrivacyMask}
                  className="p-1.5 rounded text-ink-muted hover:text-ink transition-colors"
                  title="Toggle Privacy Mask"
                  aria-label="Toggle Privacy Mask"
                >
                  {isPrivacyMasked ? <EyeOff className="w-4 h-4 text-pine" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => navigate('/search')}
                  className="p-1.5 rounded text-ink-muted hover:text-ink transition-colors"
                  title="Search"
                  aria-label="Search"
                >
                  <Search className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigate('/you')}
                  className="w-7 h-7 rounded-full bg-pine-soft flex items-center justify-center text-xs font-bold text-pine border border-pine/30"
                  aria-label="User Profile and Settings"
                >
                  {currentPersona.name[0]}
                </button>
              </div>
            </header>

            {/* 6. UNDO TOAST NOTIFICATION */}
            {lastActionMessage && (
              <div className="mb-4 p-2.5 bg-surface border border-pine rounded-lg text-xs flex items-center justify-between shadow-xs">
                <span className="text-ink font-medium">{lastActionMessage}</span>
                <div className="flex items-center gap-2">
                  {hasUndo && (
                    <button
                      onClick={undoLastMutation}
                      className="px-2 py-0.5 bg-pine text-white rounded font-semibold text-[11px] hover:bg-pine/90 flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" /> Undo
                    </button>
                  )}
                  <button
                    onClick={clearLastActionMessage}
                    className="text-ink-muted hover:text-ink text-[11px]"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}

            {/* Main Content Body */}
            <main className="flex-1">
              {currentRoute === '/today' && <TodayView onNavigate={(t) => navigate(t)} />}
              {currentRoute === '/plan' && <PlanView />}
              {currentRoute === '/money' && <MoneyView />}
              {currentRoute === '/goals' && <GoalsView />}
              {currentRoute === '/patterns' && <PatternsView />}
              {currentRoute === '/ledger' && <LedgerView />}
              {currentRoute === '/search' && <SearchView onNavigate={(t) => navigate(t)} />}
              {currentRoute === '/you' && <YouView onNavigate={(t) => navigate(t)} />}
              {currentRoute === '/health' && <HealthView />}
              {currentRoute === '/exports' && <ExportsView />}
              {currentRoute === '/onboarding' && <OnboardingView onComplete={() => navigate('/today')} />}
            </main>
          </div>
        </div>
      </div>

      {/* Quick Add Modal */}
      {showQuickAdd && <QuickAddView onClose={() => setShowQuickAdd(false)} />}

      {/* 6. COMPACT BOTTOM NAVIGATION — HIDDEN ON EXPANDED DESKTOP (md:hidden) */}
      <nav className="md:hidden fixed bottom-0 w-full max-w-md md:max-w-xl lg:max-w-2xl bg-surface/95 backdrop-blur-md border-t border-ink-hairline px-3 py-2 flex justify-between items-center z-40">
        <button
          onClick={() => navigate('/today')}
          className={`flex flex-col items-center gap-1 text-[11px] font-medium transition-colors ${
            currentRoute === '/today' ? 'text-pine font-bold' : 'text-ink-muted hover:text-ink'
          }`}
          aria-label="Today Tab"
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Today</span>
        </button>

        <button
          onClick={() => navigate('/plan')}
          className={`flex flex-col items-center gap-1 text-[11px] font-medium transition-colors ${
            currentRoute === '/plan' ? 'text-pine font-bold' : 'text-ink-muted hover:text-ink'
          }`}
          aria-label="Plan Tab"
        >
          <Calendar className="w-4 h-4" />
          <span>Plan</span>
        </button>

        {/* Global Quick Add Action */}
        <button
          onClick={() => setShowQuickAdd(true)}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-pine text-white shadow-sm hover:scale-105 active:scale-95 transition-transform -mt-4 border-2 border-paper"
          title="Quick Add"
          aria-label="Quick Add"
        >
          <Plus className="w-5 h-5" />
        </button>

        <button
          onClick={() => navigate('/money')}
          className={`flex flex-col items-center gap-1 text-[11px] font-medium transition-colors ${
            currentRoute === '/money' ? 'text-pine font-bold' : 'text-ink-muted hover:text-ink'
          }`}
          aria-label="Money Tab"
        >
          <Wallet className="w-4 h-4" />
          <span>Money</span>
        </button>

        <button
          onClick={() => navigate('/goals')}
          className={`flex flex-col items-center gap-1 text-[11px] font-medium transition-colors ${
            currentRoute === '/goals' ? 'text-pine font-bold' : 'text-ink-muted hover:text-ink'
          }`}
          aria-label="Goals Tab"
        >
          <Target className="w-4 h-4" />
          <span>Goals</span>
        </button>

        <button
          onClick={() => navigate('/patterns')}
          className={`flex flex-col items-center gap-1 text-[11px] font-medium transition-colors ${
            currentRoute === '/patterns' ? 'text-pine font-bold' : 'text-ink-muted hover:text-ink'
          }`}
          aria-label="Patterns Tab"
        >
          <Sparkles className="w-4 h-4" />
          <span>Patterns</span>
        </button>
      </nav>
    </div>
  );
};
