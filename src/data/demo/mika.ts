import { PersonaProfile } from '../../domain/types';

export const mikaProfile: PersonaProfile = {
  id: 'mika',
  name: 'Mika',
  headline: 'Salaried Corporate Analyst · Semi-Monthly Payday',
  monthlyNetCentavos: 4500000, // ₱45,000 net/mo (₱22,500/payday)
  paydayDays: [15, 30],
  nextPayday: '2026-10-15',
  essentialDailyRunRateCentavos: 23000, // ₱230/day essentials
  cushionDays: 1, // ₱230 cushion
  accounts: [
    { id: 'acc_cash', name: 'Physical Cash', type: 'cash', balanceCentavos: 125000, isSpendable: true },
    { id: 'acc_gcash', name: 'GCash Wallet', type: 'ewallet', balanceCentavos: 342000, isSpendable: true },
    { id: 'acc_payroll', name: 'BPI Payroll Account', type: 'payroll', balanceCentavos: 680000, isSpendable: true },
    { id: 'acc_savings', name: 'Maya High Yield Savings', type: 'savings', balanceCentavos: 1500000, isSpendable: false },
    { id: 'acc_emergency', name: 'Seabank Emergency Stash', type: 'digital_bank', balanceCentavos: 2500000, isSpendable: false },
  ],
  reservations: [
    { id: 'res_laptop', title: 'Laptop Goal Allocation', amountCentavos: 100000, targetDate: '2026-10-14', purpose: 'Protected savings for laptop upgrade', isLocked: true },
  ],
  commitments: [
    { id: 'com_rent', title: 'Studio Rent', amountCentavos: 450000, dueDate: '2026-10-12', isSubscription: false, category: 'Housing', isPaid: false, frequency: 'monthly' },
    { id: 'com_internet', title: 'Converge Fiber', amountCentavos: 129900, dueDate: '2026-10-10', isSubscription: true, category: 'Utilities', isPaid: false, frequency: 'monthly' },
    { id: 'com_phone', title: 'Globe Postpaid Plan', amountCentavos: 115000, dueDate: '2026-10-14', isSubscription: true, category: 'Utilities', isPaid: false, frequency: 'monthly' },
    { id: 'com_spotify', title: 'Spotify Premium Family', amountCentavos: 23900, dueDate: '2026-10-24', isSubscription: true, category: 'Entertainment', isPaid: false, frequency: 'monthly' },
    { id: 'com_netflix', title: 'Netflix Standard', amountCentavos: 45900, dueDate: '2026-10-28', isSubscription: true, category: 'Entertainment', isPaid: false, frequency: 'monthly' },
  ],
  debts: [
    { id: 'debt_cc', name: 'BPI Blue Mastercard', institution: 'BPI', totalPrincipalCentavos: 840000, remainingBalanceCentavos: 840000, minimumDueCentavos: 80000, dueDate: '2026-10-13', interestRateAnnual: 36, type: 'credit_card' },
    { id: 'debt_loan', name: 'Company SSS Salary Loan', institution: 'SSS', totalPrincipalCentavos: 3000000, remainingBalanceCentavos: 1800000, minimumDueCentavos: 95000, dueDate: '2026-10-30', interestRateAnnual: 10, type: 'salary_loan' },
  ],
  ious: [
    { id: 'iou_1', personName: 'Bea (Colleague)', direction: 'owed_to_me', amountCentavos: 85000, originalAmountCentavos: 85000, dueDate: '2026-10-05', description: 'Group team lunch advance', status: 'overdue' },
    { id: 'iou_2', personName: 'Carlo (Brother)', direction: 'i_owe', amountCentavos: 50000, originalAmountCentavos: 50000, dueDate: '2026-10-20', description: 'Shared utility bill contribution', status: 'open' },
  ],
  goals: [
    { id: 'goal_laptop', title: 'Work Laptop Upgrade (M3 Air)', targetCentavos: 3500000, currentCentavos: 1240000, targetDate: '2027-02-15', category: 'purchase', monthlyContributionCentavos: 200000 },
    { id: 'goal_emergency', title: '3-Month Emergency Fund', targetCentavos: 6000000, currentCentavos: 2500000, targetDate: '2027-06-30', category: 'emergency', monthlyContributionCentavos: 150000 },
  ],
  wants: [
    { id: 'want_headphones', title: 'Sony WH-1000XM5', priceCentavos: 1899000, addedDate: '2026-10-02', coolingOffDays: 7, status: 'cooling_off', notes: 'Checked review; waiting until payday' },
    { id: 'want_jacket', title: 'Uniqlo Parka', priceCentavos: 249000, addedDate: '2026-09-20', coolingOffDays: 3, status: 'cooling_off', notes: 'Rainy season commute' },
  ],
  transactions: [
    { id: 'txn_1', timestamp: '2026-10-07T08:15:00+08:00', type: 'expense', amountCentavos: 14000, accountId: 'acc_gcash', category: 'Food & Drink', merchant: 'Pickup Coffee', note: 'Iced Kape Kastila', contextTag: 'coffee-habit' },
    { id: 'txn_2', timestamp: '2026-10-06T19:45:00+08:00', type: 'expense', amountCentavos: 38000, accountId: 'acc_gcash', category: 'Food & Drink', merchant: 'GrabFood', note: 'Dinner takeout', contextTag: 'friday-delivery' },
    { id: 'txn_3', timestamp: '2026-10-06T08:20:00+08:00', type: 'expense', amountCentavos: 12000, accountId: 'acc_gcash', category: 'Food & Drink', merchant: 'Pickup Coffee', note: 'Americano', contextTag: 'coffee-habit' },
    { id: 'txn_4', timestamp: '2026-10-05T08:30:00+08:00', type: 'expense', amountCentavos: 13500, accountId: 'acc_gcash', category: 'Food & Drink', merchant: 'Pickup Coffee', note: 'Latte', contextTag: 'coffee-habit' },
    { id: 'txn_5', timestamp: '2026-10-04T22:15:00+08:00', type: 'expense', amountCentavos: 42000, accountId: 'acc_payroll', category: 'Shopping', merchant: 'Shopee', note: 'Phone accessories', contextTag: 'late-night' },
    { id: 'txn_6', timestamp: '2026-10-03T18:00:00+08:00', type: 'transfer', amountCentavos: 200000, accountId: 'acc_payroll', toAccountId: 'acc_gcash', note: 'Top up GCash for transit and food' },
    { id: 'txn_7', timestamp: '2026-10-02T20:30:00+08:00', type: 'expense', amountCentavos: 52000, accountId: 'acc_gcash', category: 'Food & Drink', merchant: 'Foodpanda', note: 'Friday night pizza', contextTag: 'friday-delivery' },
    { id: 'txn_8', timestamp: '2026-09-30T10:00:00+08:00', type: 'income', amountCentavos: 2250000, accountId: 'acc_payroll', category: 'Salary', note: 'End of month payroll' },
    { id: 'txn_9', timestamp: '2026-10-01T14:00:00+08:00', type: 'reconciliation', amountCentavos: 140000, accountId: 'acc_cash', note: 'Cash wallet audit adjustment (₱1,400 drift)' },
  ],
  insights: [
    { id: 'ins_coffee', title: 'Coffee habit pace', metric: '6× this week · ₱720', description: 'Coffee runs averaged ₱120 per transaction, primarily during morning commute.', patternType: 'frequency', transactions: ['txn_1', 'txn_3', 'txn_4'], suggestedAction: 'Setting a 4-day weekly cap preserves ₱960 monthly.' },
    { id: 'ins_delivery', title: 'Friday dinner delivery pattern', metric: '4 of last 5 Fridays', description: 'Food delivery orders peak on Friday evenings after long work shifts.', patternType: 'timing', transactions: ['txn_2', 'txn_7'], suggestedAction: 'Pre-planning simple Friday dinners saves ~₱1,800/mo.' },
    { id: 'ins_payday_spike', title: 'Post-payday 48h surge', metric: '2.3× baseline spend', description: 'Discretionary outlays spike sharply within 48 hours following the 15th and 30th payrolls.', patternType: 'timing', transactions: ['txn_5'], suggestedAction: 'Automate transfer to savings on payday morning.' },
    { id: 'ins_reconciliation', title: 'Cash balance drift', metric: '₱1,400 unreconciled', description: 'Physical cash balance showed a ₱1,400 gap during last physical wallet reconciliation.', patternType: 'reconciliation', transactions: ['txn_9'], suggestedAction: 'Log small jeepney and street vendor cash expenses immediately.' },
    { id: 'ins_overdue_iou', title: 'Overdue IOU from Bea', metric: '₱850 · 2 days overdue', description: 'Bea team lunch settlement was expected by Oct 5.', patternType: 'anomaly', transactions: [], suggestedAction: 'Send friendly reminder via chat.' },
  ],
};
