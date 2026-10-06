import React, { useMemo, useState } from 'react';
import { useKivra } from '../../state/kivraStore';
import {
  Account,
  AccountType,
  Commitment,
  Debt,
  PersonaProfile,
  PersonIOU,
  Transaction,
} from '../../domain/types';
import { Check, ChevronRight, ArrowLeft, HelpCircle } from 'lucide-react';
import { privacyMoneyText } from '../../lib/privacy';

interface OnboardingProps {
  onComplete: () => void;
}

const PROTOTYPE_DATE = '2026-10-07';

const accountTypeFor = (label: string): AccountType => {
  if (label === 'Cash') return 'cash';
  if (label === 'GCash' || label === 'Maya') return 'ewallet';
  if (label === 'Payroll Bank') return 'payroll';
  if (label.includes('Savings')) return 'savings';
  return 'digital_bank';
};

const nextIncomeForCadence = (cadence: string) => {
  if (cadence.includes('15/30')) return { paydayDays: [15, 30], nextPayday: '2026-10-15' };
  if (cadence.startsWith('Weekly')) return { paydayDays: [12, 19, 26], nextPayday: '2026-10-12' };
  if (cadence.startsWith('Monthly')) return { paydayDays: [31], nextPayday: '2026-10-31' };
  return { paydayDays: [21], nextPayday: '2026-10-21' };
};

export const OnboardingView: React.FC<OnboardingProps> = ({ onComplete }) => {
  const { setPersona, setCustomProfile, isPrivacyMasked } = useKivra();
  const [mode, setMode] = useState<'entry' | 'wizard'>('entry');
  const [step, setStep] = useState(0);
  const [showWhy, setShowWhy] = useState(false);

  const [incomeType, setIncomeType] = useState('Salaried Corporate');
  const [cadence, setCadence] = useState('Semi-Monthly (15/30)');
  const [predictability, setPredictability] = useState('Mostly predictable');
  const [monthlyNetPesos, setMonthlyNetPesos] = useState('45000');

  const [accountsSelected, setAccountsSelected] = useState<string[]>([
    'Cash',
    'GCash',
    'Payroll Bank',
  ]);
  const [spendableNowPesos, setSpendableNowPesos] = useState('11500');
  const [emergencyBufferPesos, setEmergencyBufferPesos] = useState('5000');
  const [dailyEssentialsPesos, setDailyEssentialsPesos] = useState('230');

  const [commitments, setCommitments] = useState<string[]>([
    'Rent / Boarding',
    'Fiber Internet',
    'Phone Plan',
  ]);
  const [commitmentTotalPesos, setCommitmentTotalPesos] = useState('6950');
  const [familySupportPesos, setFamilySupportPesos] = useState('0');

  const [debtsSelected, setDebtsSelected] = useState<string[]>(['Credit Card Revolving']);
  const [debtBalancePesos, setDebtBalancePesos] = useState('8400');
  const [debtMinimumPesos, setDebtMinimumPesos] = useState('800');

  const [iouDirection, setIouDirection] = useState<'none' | 'owed_to_me' | 'i_owe'>('none');
  const [iouAmountPesos, setIouAmountPesos] = useState('500');

  const [frequentPurchases, setFrequentPurchases] = useState<string[]>([
    'Coffee / Snacks',
    'Delivery Apps',
  ]);
  const [spendingTriggers, setSpendingTriggers] = useState<string[]>([
    'Payday weekend surge',
    'Late evening browsing',
  ]);

  const [primaryGoal, setPrimaryGoal] = useState('Tech / Laptop upgrade');
  const [goalTargetPesos, setGoalTargetPesos] = useState('35000');
  const [goalSavedPesos, setGoalSavedPesos] = useState('12000');

  const toggleArrayItem = (
    arr: string[],
    item: string,
    setter: (value: string[]) => void
  ) => {
    setter(arr.includes(item) ? arr.filter((value) => value !== item) : [...arr, item]);
  };

  const debtChoice = (item: string) => {
    if (item === 'None') {
      setDebtsSelected(['None']);
      return;
    }
    setDebtsSelected((current) => {
      const withoutNone = current.filter((value) => value !== 'None');
      return withoutNone.includes(item)
        ? withoutNone.filter((value) => value !== item)
        : [...withoutNone, item];
    });
  };

  const buildCustomProfile = (): PersonaProfile => {
    const monthlyNetCentavos = Math.max(0, Math.round(Number(monthlyNetPesos || 0) * 100));
    const spendableCentavos = Math.max(0, Math.round(Number(spendableNowPesos || 0) * 100));
    const emergencyCentavos = Math.max(0, Math.round(Number(emergencyBufferPesos || 0) * 100));
    const dailyCentavos = Math.max(0, Math.round(Number(dailyEssentialsPesos || 0) * 100));
    const commitmentTotalCentavos = Math.max(0, Math.round(Number(commitmentTotalPesos || 0) * 100));
    const supportCentavos = Math.max(0, Math.round(Number(familySupportPesos || 0) * 100));
    const debtBalanceCentavos = Math.max(0, Math.round(Number(debtBalancePesos || 0) * 100));
    const debtMinimumCentavos = Math.max(0, Math.round(Number(debtMinimumPesos || 0) * 100));
    const iouCentavos = Math.max(0, Math.round(Number(iouAmountPesos || 0) * 100));
    const goalTargetCentavos = Math.max(10000, Math.round(Number(goalTargetPesos || 0) * 100));
    const goalSavedCentavos = Math.min(
      goalTargetCentavos,
      Math.max(0, Math.round(Number(goalSavedPesos || 0) * 100))
    );

    const selectedMoneyLocations = accountsSelected.length > 0 ? accountsSelected : ['Cash'];
    const spendableLocations = selectedMoneyLocations.filter((name) => !name.includes('Savings'));
    const spendableNames = spendableLocations.length > 0 ? spendableLocations : ['Cash'];
    const splitBase = Math.floor(spendableCentavos / spendableNames.length);
    let splitRemainder = spendableCentavos - splitBase * spendableNames.length;

    const accounts: Account[] = spendableNames.map((name, index) => {
      const extra = splitRemainder > 0 ? 1 : 0;
      splitRemainder = Math.max(0, splitRemainder - extra);
      return {
        id: `custom_acc_${index}`,
        name,
        type: accountTypeFor(name),
        balanceCentavos: splitBase + extra,
        isSpendable: true,
      };
    });

    if (emergencyCentavos > 0 || selectedMoneyLocations.some((name) => name.includes('Savings'))) {
      accounts.push({
        id: 'custom_emergency',
        name: selectedMoneyLocations.find((name) => name.includes('Savings')) || 'Emergency Buffer',
        type: 'savings',
        balanceCentavos: emergencyCentavos,
        isSpendable: false,
      });
    }

    const perCommitment = commitments.length > 0
      ? Math.round(commitmentTotalCentavos / commitments.length)
      : 0;

    const customCommitments: Commitment[] = commitments.map((title, index) => ({
      id: `custom_commitment_${index}`,
      title,
      amountCentavos: perCommitment,
      dueDate: '2026-10-12',
      isSubscription:
        title.includes('Internet') ||
        title.includes('Phone') ||
        title.includes('Streaming'),
      category: title.includes('Rent') ? 'Housing' : 'Recurring',
      isPaid: false,
      frequency: 'monthly',
    }));

    if (supportCentavos > 0) {
      customCommitments.push({
        id: 'custom_family_support',
        title: 'Family / dependent support',
        amountCentavos: supportCentavos,
        dueDate: '2026-10-13',
        isSubscription: false,
        category: 'Family support',
        isPaid: false,
        frequency: 'monthly',
      });
    }

    const activeDebtTypes = debtsSelected.filter((value) => value !== 'None');
    const debtBalanceEach = activeDebtTypes.length
      ? Math.round(debtBalanceCentavos / activeDebtTypes.length)
      : 0;
    const debtMinimumEach = activeDebtTypes.length
      ? Math.round(debtMinimumCentavos / activeDebtTypes.length)
      : 0;

    const debts: Debt[] = activeDebtTypes.map((name, index) => ({
      id: `custom_debt_${index}`,
      name,
      institution: 'Manual entry',
      totalPrincipalCentavos: debtBalanceEach,
      remainingBalanceCentavos: debtBalanceEach,
      minimumDueCentavos: debtMinimumEach,
      dueDate: '2026-10-13',
      interestRateAnnual: name.includes('Credit')
        ? 36
        : name.includes('SPayLater')
        ? 24
        : 12,
      type: name.includes('Credit')
        ? 'credit_card'
        : name.includes('SPayLater')
        ? 'bnpl'
        : name.includes('SSS')
        ? 'salary_loan'
        : 'personal_loan',
    }));

    const ious: PersonIOU[] =
      iouDirection === 'none' || iouCentavos <= 0
        ? []
        : [
            {
              id: 'custom_iou_1',
              personName: iouDirection === 'owed_to_me' ? 'Person who owes me' : 'Person I owe',
              direction: iouDirection,
              amountCentavos: iouCentavos,
              originalAmountCentavos: iouCentavos,
              dueDate: '2026-10-14',
              description: 'Onboarding manual IOU',
              status: 'open',
            },
          ];

    const transactions: Transaction[] = [];

    if (frequentPurchases.includes('Coffee / Snacks')) {
      [
        ['custom_coffee_1', '2026-10-07T08:10:00+08:00', 12000],
        ['custom_coffee_2', '2026-10-06T08:20:00+08:00', 11000],
        ['custom_coffee_3', '2026-10-04T09:00:00+08:00', 13000],
      ].forEach(([id, timestamp, amount]) =>
        transactions.push({
          id: String(id),
          timestamp: String(timestamp),
          type: 'expense',
          amountCentavos: Number(amount),
          accountId: accounts[0].id,
          category: 'Food & Drink',
          merchant: 'Coffee / snack stop',
          contextTag: 'coffee-habit',
        })
      );
    }

    if (frequentPurchases.includes('Delivery Apps')) {
      transactions.push({
        id: 'custom_delivery_1',
        timestamp: '2026-10-02T20:10:00+08:00',
        type: 'expense',
        amountCentavos: 42000,
        accountId: accounts[0].id,
        category: 'Food & Drink',
        merchant: 'Delivery app',
        contextTag: 'friday-delivery',
      });
      transactions.push({
        id: 'custom_delivery_2',
        timestamp: '2026-09-25T19:50:00+08:00',
        type: 'expense',
        amountCentavos: 39000,
        accountId: accounts[0].id,
        category: 'Food & Drink',
        merchant: 'Delivery app',
        contextTag: 'friday-delivery',
      });
    }

    if (spendingTriggers.includes('Late evening browsing')) {
      transactions.push({
        id: 'custom_late_1',
        timestamp: '2026-10-06T22:15:00+08:00',
        type: 'expense',
        amountCentavos: 35000,
        accountId: accounts[0].id,
        category: 'Shopping',
        merchant: 'Online shop',
        contextTag: 'late-night',
      });
    }

    if (spendingTriggers.includes('Payday weekend surge')) {
      transactions.push({
        id: 'custom_payday_1',
        timestamp: '2026-10-01T17:30:00+08:00',
        type: 'expense',
        amountCentavos: 90000,
        accountId: accounts[0].id,
        category: 'Discretionary',
        merchant: 'Post-payday purchase',
        contextTag: 'post-payday',
      });
      transactions.push({
        id: 'custom_payday_2',
        timestamp: '2026-09-30T20:00:00+08:00',
        type: 'expense',
        amountCentavos: 110000,
        accountId: accounts[0].id,
        category: 'Dining',
        merchant: 'Post-payday dinner',
        contextTag: 'post-payday',
      });
    }

    const incomeSchedule = nextIncomeForCadence(cadence);

    return {
      id: 'custom',
      name: 'Custom User',
      headline: `${incomeType} · ${cadence} · ${predictability}`,
      monthlyNetCentavos,
      paydayDays: incomeSchedule.paydayDays,
      nextPayday: incomeSchedule.nextPayday,
      essentialDailyRunRateCentavos: dailyCentavos,
      cushionDays: predictability === 'Irregular' ? 3 : predictability === 'Variable' ? 2 : 1,
      accounts,
      reservations: [
        {
          id: 'custom_goal_reservation',
          title: `${primaryGoal} allocation`,
          amountCentavos: Math.min(100000, Math.max(0, spendableCentavos / 10)),
          targetDate: '2026-10-14',
          purpose: 'Prototype protected goal allocation',
          isLocked: true,
        },
      ],
      commitments: customCommitments,
      debts,
      ious,
      goals: [
        {
          id: 'custom_goal_1',
          title: primaryGoal,
          targetCentavos: goalTargetCentavos,
          currentCentavos: goalSavedCentavos,
          targetDate: '2027-04-15',
          category: primaryGoal.includes('Emergency') ? 'emergency' : 'purchase',
          monthlyContributionCentavos: Math.max(
            10000,
            Math.round(Math.max(0, monthlyNetCentavos) * 0.05)
          ),
        },
      ],
      wants: [],
      transactions,
      insights: [],
    };
  };

  const steps = useMemo(
    () => [
      {
        title: 'Income & timing',
        subtitle: 'How does money usually arrive?',
        why: 'Safe-to-Spend needs a next confirmed income horizon and should be more conservative when income is irregular.',
        content: (
          <div className="space-y-4">
            <ChoiceGrid
              label="Work / income type"
              options={['Salaried Corporate', 'Freelance / Creative', 'Micro-Business / Trade', 'Student / Allowance']}
              value={incomeType}
              onChange={setIncomeType}
            />
            <ChoiceGrid
              label="Income cadence"
              options={['Semi-Monthly (15/30)', 'Monthly (End of month)', 'Weekly', 'Irregular Invoices']}
              value={cadence}
              onChange={setCadence}
            />
            <ChoiceGrid
              label="How predictable is it?"
              options={['Mostly predictable', 'Variable', 'Irregular']}
              value={predictability}
              onChange={setPredictability}
            />
            <AmountField label="Estimated monthly take-home" value={monthlyNetPesos} onChange={setMonthlyNetPesos} />
          </div>
        ),
      },
      {
        title: 'Money locations & safety',
        subtitle: 'What is spendable now, and what must stay protected?',
        why: 'Kivra separates accessible money from protected savings so the Safe-to-Spend figure does not quietly consume your buffer.',
        content: (
          <div className="space-y-4">
            <MultiChoice
              label="Money locations"
              options={['Cash', 'GCash', 'Maya', 'Payroll Bank', 'Digital Bank (Seabank/GoTyme)', 'High Yield Savings']}
              selected={accountsSelected}
              onToggle={(item) => toggleArrayItem(accountsSelected, item, setAccountsSelected)}
            />
            <AmountField label="Spendable money available now" value={spendableNowPesos} onChange={setSpendableNowPesos} />
            <AmountField label="Protected / emergency money" value={emergencyBufferPesos} onChange={setEmergencyBufferPesos} />
            <AmountField label="Essential daily baseline" value={dailyEssentialsPesos} onChange={setDailyEssentialsPesos} suffix="/day" />
          </div>
        ),
      },
      {
        title: 'Commitments, debts & people',
        subtitle: 'What already has a claim on your cash?',
        why: 'Bills, debt minimums, support obligations, and money you owe another person should be visible before discretionary spending.',
        content: (
          <div className="space-y-4">
            <MultiChoice
              label="Recurring commitments"
              options={['Rent / Boarding', 'Fiber Internet', 'Phone Plan', 'Electric / Water', 'Streaming (Netflix/Spotify)']}
              selected={commitments}
              onToggle={(item) => toggleArrayItem(commitments, item, setCommitments)}
            />
            <AmountField label="Approx total monthly commitments" value={commitmentTotalPesos} onChange={setCommitmentTotalPesos} />
            <AmountField label="Regular family / dependent support" value={familySupportPesos} onChange={setFamilySupportPesos} optional />
            <div>
              <span className="text-xs font-semibold text-ink-muted uppercase block mb-1">Debts / credit</span>
              <div className="grid grid-cols-2 gap-2">
                {['Credit Card Revolving', 'SSS / Salary Loan', 'SPayLater / LazPay', 'Personal Loan', 'None'].map((item) => (
                  <ChoiceButton
                    key={item}
                    label={item}
                    selected={debtsSelected.includes(item)}
                    onClick={() => debtChoice(item)}
                  />
                ))}
              </div>
            </div>
            {!debtsSelected.includes('None') && (
              <div className="grid grid-cols-2 gap-2">
                <AmountField label="Total debt balance" value={debtBalancePesos} onChange={setDebtBalancePesos} />
                <AmountField label="Minimum due" value={debtMinimumPesos} onChange={setDebtMinimumPesos} />
              </div>
            )}
            <ChoiceGrid
              label="Informal IOU"
              options={['None', 'Someone owes me', 'I owe someone']}
              value={iouDirection === 'none' ? 'None' : iouDirection === 'owed_to_me' ? 'Someone owes me' : 'I owe someone'}
              onChange={(value) =>
                setIouDirection(value === 'None' ? 'none' : value === 'Someone owes me' ? 'owed_to_me' : 'i_owe')
              }
            />
            {iouDirection !== 'none' && <AmountField label="IOU amount" value={iouAmountPesos} onChange={setIouAmountPesos} />}
          </div>
        ),
      },
      {
        title: 'Habits & triggers',
        subtitle: 'What repeatedly pulls money out of the plan?',
        why: 'Kivra treats these as context, not moral judgment. Demo observations are only shown when the transaction evidence supports them.',
        content: (
          <div className="space-y-4">
            <MultiChoice
              label="Frequent discretionary areas"
              options={['Coffee / Snacks', 'Delivery Apps', 'Gaming / Digital', 'Online Shopping', 'Weekend Social']}
              selected={frequentPurchases}
              onToggle={(item) => toggleArrayItem(frequentPurchases, item, setFrequentPurchases)}
            />
            <MultiChoice
              label="Common spending contexts"
              options={['Payday weekend surge', 'Late evening browsing', 'Stress-relief takeout', 'Team lunch advances']}
              selected={spendingTriggers}
              onToggle={(item) => toggleArrayItem(spendingTriggers, item, setSpendingTriggers)}
            />
          </div>
        ),
      },
      {
        title: 'What are you trying to achieve?',
        subtitle: 'Give the runway a destination.',
        why: 'A goal lets Kivra show trade-offs instead of reducing every decision to “spend less.”',
        content: (
          <div className="space-y-4">
            <ChoiceGrid
              label="Primary goal"
              options={['3-Month Emergency Fund', 'Tech / Laptop upgrade', 'Travel / Buffer', 'Debt Freedom']}
              value={primaryGoal}
              onChange={setPrimaryGoal}
            />
            <div className="grid grid-cols-2 gap-2">
              <AmountField label="Goal target" value={goalTargetPesos} onChange={setGoalTargetPesos} />
              <AmountField label="Already saved" value={goalSavedPesos} onChange={setGoalSavedPesos} />
            </div>
          </div>
        ),
      },
    ],
    [
      incomeType,
      cadence,
      predictability,
      monthlyNetPesos,
      accountsSelected,
      spendableNowPesos,
      emergencyBufferPesos,
      dailyEssentialsPesos,
      commitments,
      commitmentTotalPesos,
      familySupportPesos,
      debtsSelected,
      debtBalancePesos,
      debtMinimumPesos,
      iouDirection,
      iouAmountPesos,
      frequentPurchases,
      spendingTriggers,
      primaryGoal,
      goalTargetPesos,
      goalSavedPesos,
    ]
  );

  if (mode === 'entry') {
    return (
      <div className="space-y-6 pb-20">
        <header className="text-center py-6 border-b border-ink-hairline">
          <span className="text-xs font-bold uppercase tracking-widest text-pine">Kivra Onboarding</span>
          <h1 className="text-2xl font-bold tracking-tight text-ink mt-1">Build your financial picture</h1>
          <p className="text-xs text-ink-muted max-w-sm mx-auto mt-2">
            Close-ended questions create a local reference profile. No bank connection or account signup is involved.
          </p>
        </header>

        <button
          onClick={() => setMode('wizard')}
          className="w-full p-4 bg-surface border-2 border-pine rounded-xl text-left hover:bg-pine-soft transition-colors shadow-xs group"
        >
          <div className="flex justify-between items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-pine">Tailor Kivra</span>
              <h2 className="text-base font-bold text-ink mt-0.5">Start with my finances</h2>
              <p className="text-xs text-ink-muted mt-1">Five short stages: income, money, obligations, behavior, and goals.</p>
            </div>
            <ChevronRight className="w-5 h-5 text-pine group-hover:translate-x-1 transition-transform" aria-hidden="true" />
          </div>
        </button>

        <section className="pt-2">
          <span className="text-xs font-semibold text-ink-muted uppercase tracking-wider block mb-2 text-center">
            Or explore instantly with deterministic demo data
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <DemoButton
              title="Mika"
              subtitle={`${privacyMoneyText(4500000, isPrivacyMasked)}/mo · semi-monthly · credit debt`}
              onClick={() => { setPersona('mika'); onComplete(); }}
            />
            <DemoButton
              title="Dan"
              subtitle={`${privacyMoneyText(6200000, isPrivacyMasked)}/mo average · irregular invoices`}
              onClick={() => { setPersona('dan'); onComplete(); }}
            />
            <DemoButton
              title="Ysa"
              subtitle={`${privacyMoneyText(1200000, isPrivacyMasked)}/mo reference · weekly allowance`}
              onClick={() => { setPersona('ysa'); onComplete(); }}
            />
          </div>
        </section>
      </div>
    );
  }

  const current = steps[step];

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
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" /> Back
        </button>
        <span className="text-xs font-bold text-ink uppercase tracking-wider">
          Stage {step + 1} of {steps.length}
        </span>
        <button onClick={onComplete} className="text-xs text-ink-muted hover:text-ink">Skip</button>
      </div>

      <div className="w-full bg-ink-hairline h-1 rounded-full overflow-hidden" aria-hidden="true">
        <div
          className="bg-pine h-full rounded-full transition-all duration-300"
          style={{ width: `${((step + 1) / steps.length) * 100}%` }}
        />
      </div>

      <div>
        <h2 className="text-xl font-bold tracking-tight text-ink">{current.title}</h2>
        <p className="text-xs text-ink-muted mt-0.5">{current.subtitle}</p>
      </div>

      <div className="p-3 bg-surface-alt border border-ink-hairline rounded-lg text-xs">
        <button
          onClick={() => setShowWhy((value) => !value)}
          className="w-full flex items-center justify-between text-ink-muted font-medium"
          aria-expanded={showWhy}
        >
          <span className="flex items-center gap-1.5 text-pine font-semibold">
            <HelpCircle className="w-3.5 h-3.5" aria-hidden="true" /> Why we ask
          </span>
          <span>{showWhy ? 'Hide' : 'Explain'}</span>
        </button>
        {showWhy && <p className="mt-2 text-ink-muted text-[11px] leading-relaxed">{current.why}</p>}
      </div>

      <section className="bg-surface border border-ink-hairline rounded-xl p-4">{current.content}</section>

      {step < steps.length - 1 ? (
        <button
          onClick={() => { setShowWhy(false); setStep((value) => value + 1); }}
          className="w-full py-2.5 bg-pine text-white text-sm font-semibold rounded-lg hover:bg-pine/90 transition-colors shadow-xs"
        >
          Continue
        </button>
      ) : (
        <button
          onClick={() => { setCustomProfile(buildCustomProfile()); onComplete(); }}
          className="w-full py-2.5 bg-pine text-white text-sm font-semibold rounded-lg hover:bg-pine/90 transition-colors shadow-xs"
        >
          Finish & open Kivra
        </button>
      )}
    </div>
  );
};

const ChoiceButton: React.FC<{ label: string; selected: boolean; onClick: () => void }> = ({ label, selected, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`p-2.5 text-xs text-left rounded-lg border flex items-center justify-between transition-colors ${
      selected
        ? 'bg-pine-soft border-pine font-semibold text-pine'
        : 'bg-surface border-ink-hairline text-ink'
    }`}
    aria-pressed={selected}
  >
    <span>{label}</span>
    {selected && <Check className="w-3.5 h-3.5" aria-hidden="true" />}
  </button>
);

const ChoiceGrid: React.FC<{
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}> = ({ label, options, value, onChange }) => (
  <div>
    <span className="text-xs font-semibold text-ink-muted uppercase block mb-1">{label}</span>
    <div className="grid grid-cols-2 gap-2">
      {options.map((option) => (
        <ChoiceButton key={option} label={option} selected={value === option} onClick={() => onChange(option)} />
      ))}
    </div>
  </div>
);

const MultiChoice: React.FC<{
  label: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
}> = ({ label, options, selected, onToggle }) => (
  <div>
    <span className="text-xs font-semibold text-ink-muted uppercase block mb-1">{label}</span>
    <div className="grid grid-cols-2 gap-2">
      {options.map((option) => (
        <ChoiceButton key={option} label={option} selected={selected.includes(option)} onClick={() => onToggle(option)} />
      ))}
    </div>
  </div>
);

const AmountField: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  suffix?: string;
  optional?: boolean;
}> = ({ label, value, onChange, suffix, optional }) => (
  <label className="block">
    <span className="text-xs font-semibold text-ink-muted uppercase block mb-1">
      {label} {optional && <span className="normal-case font-normal">(optional)</span>}
    </span>
    <div className="flex items-center">
      <span className="px-3 py-2 bg-surface-alt border border-r-0 border-ink-hairline rounded-l-lg text-sm font-semibold">₱</span>
      <input
        type="number"
        min="0"
        step="1"
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-w-0 flex-1 px-3 py-2 bg-surface border border-ink-hairline rounded-r-lg tabular-nums text-sm"
      />
      {suffix && <span className="ml-2 text-xs text-ink-muted">{suffix}</span>}
    </div>
  </label>
);

const DemoButton: React.FC<{ title: string; subtitle: string; onClick: () => void }> = ({ title, subtitle, onClick }) => (
  <button
    onClick={onClick}
    className="p-3 bg-surface border border-ink-hairline rounded-lg text-left hover:border-pine transition-colors"
  >
    <span className="text-xs font-bold text-ink block">{title}</span>
    <span className="text-[11px] text-ink-muted block mt-0.5">{subtitle}</span>
    <span className="text-[10px] text-pine font-semibold block mt-1.5">Try {title} →</span>
  </button>
);
