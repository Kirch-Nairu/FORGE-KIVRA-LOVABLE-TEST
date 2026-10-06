import { PersonaProfile } from '../../domain/types';

export const danProfile: PersonaProfile = {
  id: 'dan',
  name: 'Dan',
  headline: 'Freelance Motion Designer · Irregular Client Retainers',
  monthlyNetCentavos: 6200000, // Average ₱62,000/mo variable
  paydayDays: [25], // estimated invoice cycle
  nextPayday: '2026-10-25',
  essentialDailyRunRateCentavos: 35000, // ₱350/day
  cushionDays: 3, // 3 days buffer due to income variance
  accounts: [
    { id: 'dan_cash', name: 'Cash On Hand', type: 'cash', balanceCentavos: 250000, isSpendable: true },
    { id: 'dan_personal', name: 'UnionBank Personal', type: 'digital_bank', balanceCentavos: 820000, isSpendable: true },
    { id: 'dan_business', name: 'BDO Business Account', type: 'digital_bank', balanceCentavos: 2200000, isSpendable: true },
    { id: 'dan_tax', name: 'Tax & BIR Stash', type: 'savings', balanceCentavos: 1200000, isSpendable: false },
  ],
  reservations: [
    { id: 'res_camera', title: 'Sony FX3 Reserve', amountCentavos: 300000, targetDate: '2026-10-20', purpose: 'Production gear deposit', isLocked: true },
  ],
  commitments: [
    { id: 'dan_com_adobe', title: 'Adobe Creative Cloud', amountCentavos: 320000, dueDate: '2026-10-18', isSubscription: true, category: 'Software', isPaid: false, frequency: 'monthly' },
    { id: 'dan_com_render', title: 'Cloud Render Farm', amountCentavos: 150000, dueDate: '2026-10-22', isSubscription: true, category: 'Software', isPaid: false, frequency: 'monthly' },
  ],
  debts: [
    { id: 'dan_debt_gear', name: 'Camera Store Equipment Loan', institution: 'JG Summit Finance', totalPrincipalCentavos: 4500000, remainingBalanceCentavos: 2800000, minimumDueCentavos: 250000, dueDate: '2026-10-20', interestRateAnnual: 18, type: 'personal_loan' },
  ],
  ious: [
    { id: 'dan_iou_1', personName: 'Agency Manila (Pending Invoice)', direction: 'owed_to_me', amountCentavos: 3500000, originalAmountCentavos: 3500000, dueDate: '2026-10-01', description: 'Brand commercial animation retainer (Overdue 6 days)', status: 'overdue' },
  ],
  goals: [
    { id: 'dan_goal_camera', title: 'Sony FX3 Cinema Rig', targetCentavos: 22000000, currentCentavos: 8500000, targetDate: '2027-01-15', category: 'purchase', monthlyContributionCentavos: 250000 },
  ],
  wants: [],
  transactions: [
    { id: 'dan_txn_1', timestamp: '2026-10-06T23:30:00+08:00', type: 'expense', amountCentavos: 45000, accountId: 'dan_personal', category: 'Entertainment', merchant: 'Steam Games', note: 'Late night game purchase', contextTag: 'late-night' },
  ],
  insights: [
    { id: 'dan_ins_1', title: 'Overdue client receivable', metric: '₱35,000 invoice · 6 days overdue', description: 'Agency Manila retainer overdue; Safe-to-Spend excludes this receivable to protect cash flow.', patternType: 'anomaly', transactions: [], suggestedAction: 'Send polite follow-up email.' },
  ],
};
