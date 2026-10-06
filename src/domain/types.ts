export type MoneyCentavos = number; // integer centavos (₱1 = 100)

export type AccountType = 'cash' | 'ewallet' | 'payroll' | 'savings' | 'credit' | 'digital_bank';
export type DemoPersonaId = 'mika' | 'dan' | 'ysa';
export type PersonaId = DemoPersonaId | 'custom';

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  institution?: string;
  balanceCentavos: MoneyCentavos;
  isSpendable: boolean;
  icon?: string;
}

export interface Reservation {
  id: string;
  title: string;
  amountCentavos: MoneyCentavos;
  targetDate: string;
  purpose: string;
  isLocked: boolean;
}

export type TransactionType =
  | 'expense'
  | 'income'
  | 'transfer'
  | 'iou_settlement'
  | 'debt_payment'
  | 'reconciliation';

export interface Transaction {
  id: string;
  timestamp: string;
  type: TransactionType;
  amountCentavos: MoneyCentavos;
  accountId: string;
  toAccountId?: string;
  category?: string;
  merchant?: string;
  note?: string;
  contextTag?: string;
  personId?: string;
}

export interface Commitment {
  id: string;
  title: string;
  amountCentavos: MoneyCentavos;
  dueDate: string;
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
  dueDate: string;
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
  transactions: string[];
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
  id: PersonaId;
  name: string;
  headline: string;
  monthlyNetCentavos: MoneyCentavos;
  paydayDays: number[];
  nextPayday: string;
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
