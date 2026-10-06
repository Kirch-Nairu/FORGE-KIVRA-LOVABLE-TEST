export type MoneyCentavos = number; // integer centavos (₱1 = 100)

export type AccountType = 'cash' | 'ewallet' | 'payroll' | 'savings' | 'credit' | 'digital_bank';

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  institution?: string;
  balanceCentavos: MoneyCentavos;
  isSpendable: boolean; // included in accessible cash
  icon?: string;
}

export interface Reservation {
  id: string;
  title: string;
  amountCentavos: MoneyCentavos;
  targetDate: string; // ISO string
  purpose: string;
  isLocked: boolean;
}

export type TransactionType = 'expense' | 'income' | 'transfer' | 'iou_settlement' | 'debt_payment' | 'reconciliation';

export interface Transaction {
  id: string;
  timestamp: string; // ISO
  type: TransactionType;
  amountCentavos: MoneyCentavos;
  accountId: string;
  toAccountId?: string; // for transfer
  category?: string;
  merchant?: string;
  note?: string;
  contextTag?: string; // e.g. "late-night", "friday-delivery", "coffee-habit"
  personId?: string; // for IOU
}

export interface Commitment {
  id: string;
  title: string;
  amountCentavos: MoneyCentavos;
  dueDate: string; // YYYY-MM-DD
  isSubscription: boolean;
  category: string;
  isPaid: boolean;
  frequency: 'monthly' | 'weekly' | 'semi-monthly';
}

export interface Debt {
  id: string;
  name: string;
  institution: string;
  totalPrincipalCentavos: MoneyCentavos;
  remainingBalanceCentavos: MoneyCentavos;
  minimumDueCentavos: MoneyCentavos;
  dueDate: string; // YYYY-MM-DD
  interestRateAnnual: number;
  type: 'credit_card' | 'salary_loan' | 'bnpl' | 'personal_loan';
}

export interface PersonIOU {
  id: string;
  personName: string;
  direction: 'owed_to_me' | 'i_owe';
  amountCentavos: MoneyCentavos;
  originalAmountCentavos: MoneyCentavos;
  dueDate?: string;
  description: string;
  status: 'open' | 'partially_paid' | 'overdue' | 'settled';
}

export interface Goal {
  id: string;
  title: string;
  targetCentavos: MoneyCentavos;
  currentCentavos: MoneyCentavos;
  targetDate: string;
  category: 'purchase' | 'emergency' | 'buffer';
  monthlyContributionCentavos: MoneyCentavos;
}

export interface WantItem {
  id: string;
  title: string;
  priceCentavos: MoneyCentavos;
  addedDate: string;
  coolingOffDays: number;
  status: 'cooling_off' | 'decided_drop' | 'bought' | 'promoted_to_goal';
  notes?: string;
}

export interface InsightEvidence {
  id: string;
  title: string;
  metric: string;
  description: string;
  patternType: 'frequency' | 'timing' | 'anomaly' | 'subscription' | 'reconciliation';
  transactions: string[]; // transaction IDs
  suggestedAction?: string;
}

export interface FinancialHealthDimension {
  id: string;
  name: string;
  level: 'Robust' | 'Adequate' | 'Tight' | 'Vulnerable';
  explanation: string;
  factors: string[];
}

export interface PersonaProfile {
  id: 'mika' | 'dan' | 'ysa';
  name: string;
  headline: string;
  monthlyNetCentavos: MoneyCentavos;
  paydayDays: number[]; // e.g. [15, 30]
  nextPayday: string; // YYYY-MM-DD
  essentialDailyRunRateCentavos: MoneyCentavos;
  cushionDays: number;
  accounts: Account[];
  reservations: Reservation[];
  commitments: Commitment[];
  debts: Debt[];
  ious: PersonIOU[];
  goals: Goal[];
  wants: WantItem[];
  transactions: Transaction[];
  insights: InsightEvidence[];
}
