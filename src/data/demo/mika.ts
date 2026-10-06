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
    // Today (Oct 7)
    { id: 'txn_c1', timestamp: '2026-10-07T08:15:00+08:00', type: 'expense', amountCentavos: 14000, accountId: 'acc_gcash', category: 'Food & Drink', merchant: 'Pickup Coffee', note: 'Iced Kape Kastila', contextTag: 'coffee-habit' },
    // Yesterday (Oct 6)
    { id: 'txn_c2', timestamp: '2026-10-06T08:20:00+08:00', type: 'expense', amountCentavos: 12000, accountId: 'acc_gcash', category: 'Food & Drink', merchant: 'Pickup Coffee', note: 'Americano', contextTag: 'coffee-habit' },
    { id: 'txn_f1', timestamp: '2026-10-06T19:45:00+08:00', type: 'expense', amountCentavos: 38000, accountId: 'acc_gcash', category: 'Food & Drink', merchant: 'GrabFood', note: 'Dinner takeout', contextTag: 'friday-delivery' },
    // Mon (Oct 5)
    { id: 'txn_c3', timestamp: '2026-10-05T08:30:00+08:00', type: 'expense', amountCentavos: 13500, accountId: 'acc_gcash', category: 'Food & Drink', merchant: 'Pickup Coffee', note: 'Latte', contextTag: 'coffee-habit' },
    // Sun (Oct 4)
    { id: 'txn_c4', timestamp: '2026-10-04T10:00:00+08:00', type: 'expense', amountCentavos: 11000, accountId: 'acc_gcash', category: 'Food & Drink', merchant: 'Pickup Coffee', note: 'Cold brew', contextTag: 'coffee-habit' },
    { id: 'txn_ln1', timestamp: '2026-10-04T22:15:00+08:00', type: 'expense', amountCentavos: 42000, accountId: 'acc_payroll', category: 'Shopping', merchant: 'Shopee', note: 'Phone accessories', contextTag: 'late-night' },
    // Sat (Oct 3)
    { id: 'txn_c5', timestamp: '2026-10-03T09:15:00+08:00', type: 'expense', amountCentavos: 9500, accountId: 'acc_gcash', category: 'Food & Drink', merchant: 'Pickup Coffee', note: 'Flat white', contextTag: 'coffee-habit' },
    { id: 'txn_tr1', timestamp: '2026-10-03T18:00:00+08:00', type: 'transfer', amountCentavos: 200000, accountId: 'acc_payroll', toAccountId: 'acc_gcash', note: 'Top up GCash for transit and food' },
    // Fri (Oct 2 - Friday delivery + coffee)
    { id: 'txn_c6', timestamp: '2026-10-02T08:45:00+08:00', type: 'expense', amountCentavos: 12000, accountId: 'acc_gcash', category: 'Food & Drink', merchant: 'Pickup Coffee', note: 'Iced Americano', contextTag: 'coffee-habit' },
    { id: 'txn_f2', timestamp: '2026-10-02T20:30:00+08:00', type: 'expense', amountCentavos: 52000, accountId: 'acc_gcash', category: 'Food & Drink', merchant: 'Foodpanda', note: 'Friday night pizza', contextTag: 'friday-delivery' },
    // Thu (Oct 1 - post payday)
    { id: 'txn_pp1', timestamp: '2026-10-01T14:30:00+08:00', type: 'expense', amountCentavos: 185000, accountId: 'acc_payroll', category: 'Shopping', merchant: 'Uniqlo', note: 'Work shirts post-payday', contextTag: 'post-payday' },
    { id: 'txn_rc1', timestamp: '2026-10-01T16:00:00+08:00', type: 'reconciliation', amountCentavos: 140000, accountId: 'acc_cash', note: 'Cash wallet audit adjustment (₱1,400 drift)' },
    // Wed (Sep 30 - Payday deposit + post payday spend)
    { id: 'txn_inc1', timestamp: '2026-09-30T10:00:00+08:00', type: 'income', amountCentavos: 2250000, accountId: 'acc_payroll', category: 'Salary', note: 'End of month payroll' },
    { id: 'txn_pp2', timestamp: '2026-09-30T19:00:00+08:00', type: 'expense', amountCentavos: 235000, accountId: 'acc_payroll', category: 'Dining', merchant: 'Wildflour Cafe', note: 'Payday dinner celebration', contextTag: 'post-payday' },
    // Earlier Fridays for Friday delivery pattern
    { id: 'txn_f3', timestamp: '2026-09-25T20:00:00+08:00', type: 'expense', amountCentavos: 44000, accountId: 'acc_gcash', category: 'Food & Drink', merchant: 'GrabFood', note: 'Friday dinner delivery', contextTag: 'friday-delivery' },
    { id: 'txn_f4', timestamp: '2026-09-18T19:30:00+08:00', type: 'expense', amountCentavos: 49000, accountId: 'acc_gcash', category: 'Food & Drink', merchant: 'GrabFood', note: 'Friday Japanese takeout', contextTag: 'friday-delivery' },
  ],
  insights: [],
};
