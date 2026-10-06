import React, { useState } from 'react';
import { useKivra } from '../../state/kivraStore';
import { PersonaProfile } from '../../domain/types';
import { DEMO_PERSONAS } from '../../data/demo';
import { Check, ChevronRight, ArrowLeft, Sparkles, User, HelpCircle } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

export const OnboardingView: React.FC<OnboardingProps> = ({ onComplete }) => {
  const { setPersona, setCustomProfile } = useKivra();
  const [mode, setMode] = useState<'entry' | 'wizard'>('entry');
  const [step, setStep] = useState(0);

  // Wizard state
  const [incomeType, setIncomeType] = useState('Salaried Corporate');
  const [cadence, setCadence] = useState('Semi-Monthly (15/30)');
  const [monthlyNetPesos, setMonthlyNetPesos] = useState('45000');
  const [accountsSelected, setAccountsSelected] = useState<string[]>(['Cash', 'GCash', 'Payroll Bank', 'Digital Bank']);
  const [dailyEssentialsPesos, setDailyEssentialsPesos] = useState('250');
  const [commitments, setCommitments] = useState<string[]>(['Rent', 'Fiber Internet', 'Phone Plan']);
  const [debtsSelected, setDebtsSelected] = useState<string[]>(['Credit Card']);
  const [frequentPurchases, setFrequentPurchases] = useState<string[]>(['Coffee / Snacks', 'Delivery Apps']);
  const [spendingTriggers, setSpendingTriggers] = useState<string[]>(['Payday weekend surge', 'Late evening browsing']);
  const [primaryGoal, setPrimaryGoal] = useState('Tech / Laptop upgrade');

  const [showWhy, setShowWhy] = useState(false);

  const toggleArrayItem = (arr: string[], item: string, setter: (val: string[]) => void) => {
    if (arr.includes(item)) {
      setter(arr.filter((i) => i !== item));
    } else {
      setter([...arr, item]);
    }
  };

  const steps = [
    {
      title: 'Income & Cadence',
      subtitle: 'How and when do funds land in your hands?',
      why: 'Safe-to-Spend calculates days until your next confirmed inflow to establish your runway horizon.',
      render: () => (
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-ink-muted uppercase block mb-1">Work Type</label>
            <div className="grid grid-cols-2 gap-2">
              {['Salaried Corporate', 'Freelance / Creative', 'Micro-Business / Trade', 'Student / Allowance'].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setIncomeType(opt)}
                  className={`p-2.5 text-xs text-left rounded-lg border transition-all ${
                    incomeType === opt ? 'bg-pine-soft border-pine font-bold text-pine' : 'bg-surface border-ink-hairline text-ink'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-ink-muted uppercase block mb-1">Payroll Cadence</label>
            <div className="grid grid-cols-2 gap-2">
              {['Semi-Monthly (15/30)', 'Monthly (End of month)', 'Weekly', 'Irregular Invoices'].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setCadence(opt)}
                  className={`p-2.5 text-xs text-left rounded-lg border transition-all ${
                    cadence === opt ? 'bg-pine-soft border-pine font-bold text-pine' : 'bg-surface border-ink-hairline text-ink'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-ink-muted uppercase block mb-1">Estimated Monthly Take-Home (₱)</label>
            <input
              type="number"
              value={monthlyNetPesos}
              onChange={(e) => setMonthlyNetPesos(e.target.value)}
              className="w-full text-lg font-bold px-3 py-2 bg-surface border border-ink-hairline rounded-lg tabular-nums"
              placeholder="45000"
            />
          </div>
        </div>
      ),
    },
    {
      title: 'Money Locations & Essentials',
      subtitle: 'Where is your money stored, and what does daily survival cost?',
      why: 'Kivra isolates spendable transaction money from ring-fenced emergency cushions so you never accidentally spend your rent.',
      render: () => (
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-ink-muted uppercase block mb-1">Active Accounts (Select all that apply)</label>
            <div className="grid grid-cols-2 gap-2">
              {['Cash', 'GCash', 'Maya', 'Payroll Bank', 'Digital Bank (Seabank/GoTyme)', 'High Yield Savings'].map((acc) => (
                <button
                  key={acc}
                  type="button"
                  onClick={() => toggleArrayItem(accountsSelected, acc, setAccountsSelected)}
                  className={`p-2 text-xs text-left rounded-lg border flex items-center justify-between ${
                    accountsSelected.includes(acc) ? 'bg-pine-soft border-pine font-semibold text-pine' : 'bg-surface border-ink-hairline text-ink'
                  }`}
                >
                  <span>{acc}</span>
                  {accountsSelected.includes(acc) && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-ink-muted uppercase block mb-1">Daily Baseline Survival Cost (₱/day)</label>
            <p className="text-[11px] text-ink-muted mb-2">Food, transit fare, drinking water, essential work transit.</p>
            <div className="flex gap-2">
              {['150', '230', '350', '500'].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setDailyEssentialsPesos(val)}
                  className={`flex-1 py-1.5 text-xs rounded border tabular-nums ${
                    dailyEssentialsPesos === val ? 'bg-ink text-paper font-bold' : 'bg-surface border-ink-hairline text-ink'
                  }`}
                >
                  ₱{val}
                </button>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Commitments & Debts',
      subtitle: 'Fixed claims on your cash flow before payday.',
      why: 'Unpaid bills due before payday are subtracted from accessible cash upfront in the Safe-to-Spend waterfall.',
      render: () => (
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-ink-muted uppercase block mb-1">Recurring Commitments</label>
            <div className="grid grid-cols-2 gap-2">
              {['Rent / Boarding', 'Fiber Internet', 'Phone Plan', 'Electric / Water', 'Streaming (Netflix/Spotify)'].map((com) => (
                <button
                  key={com}
                  type="button"
                  onClick={() => toggleArrayItem(commitments, com, setCommitments)}
                  className={`p-2 text-xs text-left rounded-lg border flex items-center justify-between ${
                    commitments.includes(com) ? 'bg-pine-soft border-pine font-semibold text-pine' : 'bg-surface border-ink-hairline text-ink'
                  }`}
                >
                  <span>{com}</span>
                  {commitments.includes(com) && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-ink-muted uppercase block mb-1">Debts & Credit (Select all that apply)</label>
            <div className="grid grid-cols-2 gap-2">
              {['Credit Card Revolving', 'SSS / Salary Loan', 'SPayLater / LazPay', 'Personal Loan', 'None'].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => toggleArrayItem(debtsSelected, d, setDebtsSelected)}
                  className={`p-2 text-xs text-left rounded-lg border flex items-center justify-between ${
                    debtsSelected.includes(d) ? 'bg-pine-soft border-pine font-semibold text-pine' : 'bg-surface border-ink-hairline text-ink'
                  }`}
                >
                  <span>{d}</span>
                  {debtsSelected.includes(d) && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Habits, Triggers & Goals',
      subtitle: 'Understanding behavioral patterns without moral judgment.',
      why: 'Kivra uses pattern detection to spot unbudgeted discretionary clusters early, giving you cooling-off suggestions.',
      render: () => (
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-ink-muted uppercase block mb-1">Frequent Discretionary Areas</label>
            <div className="grid grid-cols-2 gap-2">
              {['Coffee / Snacks', 'Delivery Apps', 'Gaming / Digital', 'Online Shopping', 'Weekend Social'].map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => toggleArrayItem(frequentPurchases, f, setFrequentPurchases)}
                  className={`p-2 text-xs text-left rounded-lg border flex items-center justify-between ${
                    frequentPurchases.includes(f) ? 'bg-pine-soft border-pine font-semibold text-pine' : 'bg-surface border-ink-hairline text-ink'
                  }`}
                >
                  <span>{f}</span>
                  {frequentPurchases.includes(f) && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-ink-muted uppercase block mb-1">Neutral Spending Patterns</label>
            <div className="grid grid-cols-2 gap-2">
              {['Payday weekend surge', 'Late evening browsing', 'Stress-relief takeout', 'Team lunch advances'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => toggleArrayItem(spendingTriggers, t, setSpendingTriggers)}
                  className={`p-2 text-xs text-left rounded-lg border flex items-center justify-between ${
                    spendingTriggers.includes(t) ? 'bg-pine-soft border-pine font-semibold text-pine' : 'bg-surface border-ink-hairline text-ink'
                  }`}
                >
                  <span>{t}</span>
                  {spendingTriggers.includes(t) && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-ink-muted uppercase block mb-1">Primary Funded Goal</label>
            <div className="grid grid-cols-2 gap-2">
              {['3-Month Emergency Fund', 'Tech / Laptop upgrade', 'Travel / Buffer', 'Debt Freedom'].map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setPrimaryGoal(g)}
                  className={`p-2.5 text-xs text-left rounded-lg border ${
                    primaryGoal === g ? 'bg-pine-soft border-pine font-bold text-pine' : 'bg-surface border-ink-hairline text-ink'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        </div>
      ),
    },
  ];

  const handleFinishCustom = () => {
    const netCentavos = Math.round(parseFloat(monthlyNetPesos || '45000') * 100);
    const dailyCentavos = Math.round(parseFloat(dailyEssentialsPesos || '250') * 100);

    const custom: PersonaProfile = {
      id: 'mika',
      name: 'Custom User',
      headline: `${incomeType} · ${cadence}`,
      monthlyNetCentavos: netCentavos,
      paydayDays: cadence.includes('15/30') ? [15, 30] : [25],
      nextPayday: '2026-10-15',
      essentialDailyRunRateCentavos: dailyCentavos,
      cushionDays: 1,
      accounts: [
        { id: 'acc_cash', name: 'Physical Cash', type: 'cash', balanceCentavos: 150000, isSpendable: true },
        { id: 'acc_wallet', name: 'GCash / E-Wallet', type: 'ewallet', balanceCentavos: 350000, isSpendable: true },
        { id: 'acc_payroll', name: 'Payroll Account', type: 'payroll', balanceCentavos: 850000, isSpendable: true },
        { id: 'acc_savings', name: 'High Yield Savings', type: 'savings', balanceCentavos: 2500000, isSpendable: false },
      ],
      reservations: [
        { id: 'res_goal', title: `${primaryGoal} Reservation`, amountCentavos: 100000, targetDate: '2026-10-14', purpose: 'Protected goal stash', isLocked: true },
      ],
      commitments: commitments.map((c, i) => ({
        id: `com_${i}`,
        title: c,
        amountCentavos: c.includes('Rent') ? 450000 : 129900,
        dueDate: '2026-10-12',
        isSubscription: c.includes('Internet') || c.includes('Phone') || c.includes('Streaming'),
        category: 'Utilities',
        isPaid: false,
        frequency: 'monthly',
      })),
      debts: debtsSelected.includes('None')
        ? []
        : debtsSelected.map((d, i) => ({
            id: `debt_${i}`,
            name: d,
            institution: 'Bank / Provider',
            totalPrincipalCentavos: 1000000,
            remainingBalanceCentavos: 600000,
            minimumDueCentavos: 75000,
            dueDate: '2026-10-13',
            interestRateAnnual: 30,
            type: d.includes('Credit') ? 'credit_card' : 'personal_loan',
          })),
      ious: [],
      goals: [
        {
          id: 'goal_custom_1',
          title: primaryGoal,
          targetCentavos: 3500000,
          currentCentavos: 1200000,
          targetDate: '2027-04-15',
          category: primaryGoal.includes('Emergency') ? 'emergency' : 'purchase',
          monthlyContributionCentavos: 200000,
        },
      ],
      wants: [
        { id: 'want_c1', title: 'Noise Cancelling Earbuds', priceCentavos: 499000, addedDate: '2026-10-03', coolingOffDays: 7, status: 'cooling_off', notes: 'In 7-day cooling off' },
      ],
      transactions: [
        { id: 'txn_init_1', timestamp: '2026-10-07T08:30:00+08:00', type: 'expense', amountCentavos: 14000, accountId: 'acc_wallet', category: 'Food & Drink', merchant: 'Morning Coffee', note: 'Commute coffee', contextTag: 'coffee-habit' },
      ],
      insights: [],
    };

    setCustomProfile(custom);
    onComplete();
  };

  if (mode === 'entry') {
    return (
      <div className="space-y-6 pb-20">
        <div className="text-center py-6 border-b border-ink-hairline">
          <span className="text-xs font-bold uppercase tracking-widest text-pine">Kivra Onboarding</span>
          <h1 className="text-2xl font-bold tracking-tight text-ink mt-1">Set Up Your Financial Instrument</h1>
          <p className="text-xs text-ink-muted max-w-sm mx-auto mt-2">
            Model your Philippine cash flow with true Safe-to-Spend runway. Choose how you would like to begin.
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => setMode('wizard')}
            className="w-full p-4 bg-surface border-2 border-pine rounded-xl text-left hover:bg-pine-soft transition-colors shadow-xs group"
          >
            <div className="flex justify-between items-center">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-pine">Recommended for First Time</span>
                <h3 className="text-base font-bold text-ink mt-0.5">Start with my finances</h3>
                <p className="text-xs text-ink-muted mt-1">
                  Answer 4 quick sections about income, accounts, bills, and spending habits.
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-pine group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          <div className="pt-4">
            <span className="text-xs font-semibold text-ink-muted uppercase tracking-wider block mb-2 text-center">
              Or explore instantly with a seeded persona:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                onClick={() => {
                  setPersona('mika');
                  onComplete();
                }}
                className="p-3 bg-surface border border-ink-hairline rounded-lg text-left hover:border-pine transition-colors"
              >
                <span className="text-xs font-bold text-ink block">Mika (Corporate)</span>
                <span className="text-[11px] text-ink-muted block mt-0.5">₱45k/mo · 15/30 semi-monthly · CC debt</span>
                <span className="text-[10px] text-pine font-semibold block mt-1.5">Try Mika →</span>
              </button>

              <button
                onClick={() => {
                  setPersona('dan');
                  onComplete();
                }}
                className="p-3 bg-surface border border-ink-hairline rounded-lg text-left hover:border-pine transition-colors"
              >
                <span className="text-xs font-bold text-ink block">Dan (Freelance)</span>
                <span className="text-[11px] text-ink-muted block mt-0.5">₱62k/mo variable · Overdue retainer invoice</span>
                <span className="text-[10px] text-pine font-semibold block mt-1.5">Try Dan →</span>
              </button>

              <button
                onClick={() => {
                  setPersona('ysa');
                  onComplete();
                }}
                className="p-3 bg-surface border border-ink-hairline rounded-lg text-left hover:border-pine transition-colors"
              >
                <span className="text-xs font-bold text-ink block">Ysa (Student)</span>
                <span className="text-[11px] text-ink-muted block mt-0.5">₱12k/mo weekly allowance · SPayLater</span>
                <span className="text-[10px] text-pine font-semibold block mt-1.5">Try Ysa →</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentStepObj = steps[step];

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center border-b border-ink-hairline pb-3">
        <button
          onClick={() => {
            if (step > 0) setStep(step - 1);
            else setMode('entry');
          }}
          className="inline-flex items-center gap-1 text-xs font-medium text-ink-muted hover:text-ink"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </button>
        <span className="text-xs font-bold text-ink uppercase tracking-wider">
          Stage {step + 1} of {steps.length}
        </span>
        <button onClick={onComplete} className="text-xs text-ink-muted hover:text-ink">
          Skip
        </button>
      </div>

      <div className="w-full bg-ink-hairline h-1 rounded-full overflow-hidden">
        <div
          className="bg-pine h-full rounded-full transition-all duration-300"
          style={{ width: `${((step + 1) / steps.length) * 100}%` }}
        />
      </div>

      <div>
        <h2 className="text-xl font-bold tracking-tight text-ink">{currentStepObj.title}</h2>
        <p className="text-xs text-ink-muted mt-0.5">{currentStepObj.subtitle}</p>
      </div>

      <div className="p-3 bg-surface-alt border border-ink-hairline rounded-lg text-xs">
        <button
          onClick={() => setShowWhy(!showWhy)}
          className="w-full flex items-center justify-between text-ink-muted font-medium"
        >
          <span className="flex items-center gap-1.5 text-pine font-semibold">
            <HelpCircle className="w-3.5 h-3.5" /> Why we ask
          </span>
          <span>{showWhy ? 'Hide' : 'Explain'}</span>
        </button>
        {showWhy && <p className="mt-2 text-ink-muted text-[11px] leading-relaxed">{currentStepObj.why}</p>}
      </div>

      <div className="bg-surface border border-ink-hairline rounded-xl p-4">{currentStepObj.render()}</div>

      <div className="flex gap-2">
        {step < steps.length - 1 ? (
          <button
            onClick={() => setStep(step + 1)}
            className="w-full py-2.5 bg-pine text-white text-sm font-semibold rounded-lg hover:bg-pine/90 transition-colors shadow-xs"
          >
            Continue
          </button>
        ) : (
          <button
            onClick={handleFinishCustom}
            className="w-full py-2.5 bg-pine text-white text-sm font-semibold rounded-lg hover:bg-pine/90 transition-colors shadow-xs"
          >
            Finish & Launch Kivra OS
          </button>
        )}
      </div>
    </div>
  );
};
