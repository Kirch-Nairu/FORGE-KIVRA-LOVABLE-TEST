import React, { useState } from 'react';
import { useKivra } from '../state/kivraStore';
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
import { QuickAddView } from '../features/quick-add/QuickAddView';
import { Calendar, LayoutDashboard, Wallet, Target, Sparkles, Plus, Search, User, Eye, EyeOff } from 'lucide-react';

export const AppShell: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('today');
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const { currentPersona, isPrivacyMasked, togglePrivacyMask } = useKivra();

  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col items-center">
      <div className="w-full max-w-md md:max-w-xl lg:max-w-2xl px-4 py-3 flex-1 flex flex-col">
        {/* Top Header */}
        <header className="flex items-center justify-between py-2 border-b border-ink-hairline mb-4">
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
            >
              {isPrivacyMasked ? <EyeOff className="w-4 h-4 text-pine" /> : <Eye className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setActiveTab('search')}
              className="p-1.5 rounded text-ink-muted hover:text-ink transition-colors"
              title="Search"
            >
              <Search className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveTab('you')}
              className="w-7 h-7 rounded-full bg-pine-soft flex items-center justify-center text-xs font-bold text-pine border border-pine/30"
            >
              {currentPersona.name[0]}
            </button>
          </div>
        </header>

        {/* Main Content Body */}
        <main className="flex-1">
          {activeTab === 'today' && <TodayView onNavigate={setActiveTab} />}
          {activeTab === 'plan' && <PlanView />}
          {activeTab === 'money' && <MoneyView />}
          {activeTab === 'goals' && <GoalsView />}
          {activeTab === 'patterns' && <PatternsView />}
          {activeTab === 'ledger' && <LedgerView />}
          {activeTab === 'search' && <SearchView />}
          {activeTab === 'you' && <YouView onNavigate={setActiveTab} />}
          {activeTab === 'health' && <HealthView />}
          {activeTab === 'exports' && <ExportsView />}
        </main>
      </div>

      {/* Quick Add Modal */}
      {showQuickAdd && <QuickAddView onClose={() => setShowQuickAdd(false)} />}

      {/* 6. PRIMARY NAVIGATION — FROZEN 5 TABS */}
      <nav className="fixed bottom-0 w-full max-w-md md:max-w-xl lg:max-w-2xl bg-surface/95 backdrop-blur-md border-t border-ink-hairline px-3 py-2 flex justify-between items-center z-40">
        <button
          onClick={() => setActiveTab('today')}
          className={`flex flex-col items-center gap-1 text-[11px] font-medium transition-colors ${
            activeTab === 'today' ? 'text-pine font-bold' : 'text-ink-muted hover:text-ink'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Today</span>
        </button>

        <button
          onClick={() => setActiveTab('plan')}
          className={`flex flex-col items-center gap-1 text-[11px] font-medium transition-colors ${
            activeTab === 'plan' ? 'text-pine font-bold' : 'text-ink-muted hover:text-ink'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Plan</span>
        </button>

        {/* Global Quick Add Action */}
        <button
          onClick={() => setShowQuickAdd(true)}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-pine text-white shadow-sm hover:scale-105 active:scale-95 transition-transform -mt-4 border-2 border-paper"
          title="Quick Add"
        >
          <Plus className="w-5 h-5" />
        </button>

        <button
          onClick={() => setActiveTab('money')}
          className={`flex flex-col items-center gap-1 text-[11px] font-medium transition-colors ${
            activeTab === 'money' ? 'text-pine font-bold' : 'text-ink-muted hover:text-ink'
          }`}
        >
          <Wallet className="w-4 h-4" />
          <span>Money</span>
        </button>

        <button
          onClick={() => setActiveTab('goals')}
          className={`flex flex-col items-center gap-1 text-[11px] font-medium transition-colors ${
            activeTab === 'goals' ? 'text-pine font-bold' : 'text-ink-muted hover:text-ink'
          }`}
        >
          <Target className="w-4 h-4" />
          <span>Goals</span>
        </button>

        <button
          onClick={() => setActiveTab('patterns')}
          className={`flex flex-col items-center gap-1 text-[11px] font-medium transition-colors ${
            activeTab === 'patterns' ? 'text-pine font-bold' : 'text-ink-muted hover:text-ink'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Patterns</span>
        </button>
      </nav>
    </div>
  );
};
