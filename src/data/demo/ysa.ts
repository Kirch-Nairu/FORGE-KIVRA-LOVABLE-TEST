import { PersonaProfile } from '../../domain/types';

export const ysaProfile: PersonaProfile = {
  id: 'ysa',
  name: 'Ysa',
  headline: 'College Senior · Weekly Allowance & Micro-Gigs',
  monthlyNetCentavos: 1200000, // ₱12,000/mo (₱1,500/week + tutor gigs)
  paydayDays: [12, 19, 26], // Weekly allowance every Monday
  nextPayday: '2026-10-12',
  essentialDailyRunRateCentavos: 12000, // ₱120/day
  cushionDays: 1,
  accounts: [
    { id: 'ysa_cash', name: 'Cash in Bag', type: 'cash', balanceCentavos: 45000, isSpendable: true },
    { id: 'ysa_gcash', name: 'GCash Student', type: 'ewallet', balanceCentavos: 185000, isSpendable: true },
    { id: 'ysa_maya', name: 'Maya Stash', type: 'savings', balanceCentavos: 300000, isSpendable: false },
  ],
  reservations: [],
  commitments: [
    { id: 'ysa_com_dorm', title: 'Boarding House Share', amountCentavos: 120000, dueDate: '2026-10-11', isSubscription: false, category: 'Housing', isPaid: false, frequency: 'monthly' },
  ],
  debts: [
    { id: 'ysa_debt_spaylater', name: 'Shopee SPayLater', institution: 'Shopee', totalPrincipalCentavos: 320000, remainingBalanceCentavos: 320000, minimumDueCentavos: 65000, dueDate: '2026-10-10', interestRateAnnual: 24, type: 'bnpl' },
  ],
  ious: [
    { id: 'ysa_iou_1', personName: 'Tricia (Classmate)', direction: 'owed_to_me', amountCentavos: 25000, originalAmountCentavos: 25000, description: 'Photocopy & group project share', status: 'open' },
  ],
  goals: [
    { id: 'ysa_goal_grad', title: 'Graduation Fee & Attire', targetCentavos: 1000000, currentCentavos: 320000, targetDate: '2027-05-30', category: 'buffer', monthlyContributionCentavos: 50000 },
  ],
  wants: [],
  transactions: [
    { id: 'ysa_txn_1', timestamp: '2026-10-06T15:30:00+08:00', type: 'expense', amountCentavos: 22000, accountId: 'ysa_gcash', category: 'Food & Drink', merchant: 'Milktea Corner', note: 'After class study group' },
  ],
  insights: [
    { id: 'ysa_ins_1', title: 'Midweek social spending risk', metric: '65% spent in first 3 days', description: 'Social coffee and snack clusters early in the week leave Friday/Saturday tight.', patternType: 'timing', transactions: ['ysa_txn_1'], suggestedAction: 'Cap Tuesday snacks to ₱80.' },
  ],
};
