import React, { createContext, useContext, useMemo, useState } from 'react';
import {
  DemoPersonaId,
  PersonaProfile,
  Transaction,
  WantItem,
  Goal,
} from '../domain/types';
import { DEMO_PERSONAS } from '../data/demo';
import { prototypeClock } from '../domain/clock';
import { calculateSafeToSpend, SafeToSpendResult } from '../domain/finance/safeToSpend';
import { evaluateFinancialHealth } from '../domain/finance/health';

export interface QuickAddMutation {
  type: 'expense' | 'income' | 'transfer' | 'debt_payment' | 'iou_settlement';
  amountCentavos: number;
  accountId: string;
  toAccountId?: string;
  debtId?: string;
  iouId?: string;
  category?: string;
  merchant?: string;
  note?: string;
}

export type MutationResult =
  | { ok: true }
  | { ok: false; error: string };

interface KivraContextValue {
  currentPersona: PersonaProfile;
  setPersona: (id: DemoPersonaId) => void;
  setCustomProfile: (profile: PersonaProfile) => void;
  isPrivacyMasked: boolean;
  togglePrivacyMask: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  safeToSpend: SafeToSpendResult;
  healthDimensions: ReturnType<typeof evaluateFinancialHealth>;
  addTransaction: (mutation: QuickAddMutation) => MutationResult;
  undoLastMutation: () => boolean;
  hasUndo: boolean;
  lastActionMessage: string | null;
  clearLastActionMessage: () => void;
  addWant: (want: Omit<WantItem, 'id' | 'addedDate' | 'status'>) => void;
  updateWantStatus: (wantId: string, status: WantItem['status']) => void;
  promoteWantToGoal: (wantId: string, monthlyContributionCentavos: number) => void;
  updateGoalContribution: (goalId: string, deltaMonthlyCentavos: number) => void;
  resetToSeeds: () => void;
}

const KivraContext = createContext<KivraContextValue | null>(null);

function cloneProfile(profile: PersonaProfile): PersonaProfile {
  return JSON.parse(JSON.stringify(profile));
}

function newLocalId(prefix: string): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}_${crypto.randomUUID()}`;
  }
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

function mutationCategory(mut: QuickAddMutation): string {
  switch (mut.type) {
    case 'income':
      return mut.category || 'Income';
    case 'transfer':
      return 'Transfer';
    case 'debt_payment':
      return 'Debt payment';
    case 'iou_settlement':
      return 'IOU settlement';
    case 'expense':
    default:
      return mut.category || 'Discretionary';
  }
}

function validateMutation(profile: PersonaProfile, mut: QuickAddMutation): MutationResult {
  if (!Number.isInteger(mut.amountCentavos) || mut.amountCentavos <= 0) {
    return { ok: false, error: 'Enter a valid amount greater than zero.' };
  }

  const source = profile.accounts.find((a) => a.id === mut.accountId);
  if (!source) {
    return { ok: false, error: 'Select a valid account.' };
  }

  if (mut.type === 'income') return { ok: true };

  if (mut.type === 'expense') {
    if (source.balanceCentavos < mut.amountCentavos) {
      return { ok: false, error: `Insufficient funds in ${source.name}.` };
    }
    return { ok: true };
  }

  if (mut.type === 'transfer') {
    if (!mut.toAccountId) return { ok: false, error: 'Select a destination account.' };
    if (mut.toAccountId === mut.accountId) {
      return { ok: false, error: 'Source and destination accounts must be different.' };
    }
    const destination = profile.accounts.find((a) => a.id === mut.toAccountId);
    if (!destination) return { ok: false, error: 'Select a valid destination account.' };
    if (source.balanceCentavos < mut.amountCentavos) {
      return { ok: false, error: `Insufficient funds in ${source.name}.` };
    }
    return { ok: true };
  }

  if (mut.type === 'debt_payment') {
    const debt = profile.debts.find((d) => d.id === mut.debtId);
    if (!debt) return { ok: false, error: 'Select a valid debt obligation.' };
    if (mut.amountCentavos > debt.remainingBalanceCentavos) {
      return { ok: false, error: 'Payment exceeds the remaining debt balance.' };
    }
    if (source.balanceCentavos < mut.amountCentavos) {
      return { ok: false, error: `Insufficient funds in ${source.name}.` };
    }
    return { ok: true };
  }

  const iou = profile.ious.find((i) => i.id === mut.iouId);
  if (!iou) return { ok: false, error: 'Select a valid IOU.' };
  if (iou.status === 'settled' || iou.amountCentavos <= 0) {
    return { ok: false, error: 'That IOU is already settled.' };
  }
  if (mut.amountCentavos > iou.amountCentavos) {
    return { ok: false, error: 'Settlement exceeds the remaining IOU amount.' };
  }
  if (iou.direction === 'i_owe' && source.balanceCentavos < mut.amountCentavos) {
    return { ok: false, error: `Insufficient funds in ${source.name}.` };
  }
  return { ok: true };
}

export const KivraProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [personaId, setPersonaId] = useState<DemoPersonaId | 'custom'>('mika');
  const [profile, setProfile] = useState<PersonaProfile>(cloneProfile(DEMO_PERSONAS.mika));
  const [customSeed, setCustomSeed] = useState<PersonaProfile | null>(null);
  const [historyStack, setHistoryStack] = useState<PersonaProfile[]>([]);
  const [lastActionMessage, setLastActionMessage] = useState<string | null>(null);
  const [isPrivacyMasked, setIsPrivacyMasked] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const switchPersona = (id: DemoPersonaId) => {
    setPersonaId(id);
    setProfile(cloneProfile(DEMO_PERSONAS[id]));
    setHistoryStack([]);
    setLastActionMessage(null);
  };

  const setCustomProfile = (custom: PersonaProfile) => {
    const normalized = cloneProfile({ ...custom, id: 'custom' });
    setPersonaId('custom');
    setCustomSeed(cloneProfile(normalized));
    setProfile(normalized);
    setHistoryStack([]);
    setLastActionMessage('Profile initialized from onboarding');
  };

  const togglePrivacyMask = () => setIsPrivacyMasked((prev) => !prev);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle('dark', next);
      return next;
    });
  };

  const safeToSpend = useMemo(
    () => calculateSafeToSpend(profile, prototypeClock.now),
    [profile]
  );

  const healthDimensions = useMemo(
    () => evaluateFinancialHealth(profile, prototypeClock.now),
    [profile]
  );

  const addTransaction = (mut: QuickAddMutation): MutationResult => {
    const validation = validateMutation(profile, mut);
    if (!validation.ok) return validation;

    const snapshot = cloneProfile(profile);
    let actionMsg = '';

    setProfile((prev) => {
      const newTxn: Transaction = {
        id: newLocalId('txn'),
        timestamp: prototypeClock.now.toISOString(),
        type: mut.type,
        amountCentavos: mut.amountCentavos,
        accountId: mut.accountId,
        toAccountId: mut.toAccountId,
        category: mutationCategory(mut),
        merchant: mut.merchant,
        note: mut.note,
        personId: mut.iouId,
      };

      let updatedAccounts = [...prev.accounts];
      let updatedDebts = [...prev.debts];
      let updatedIous = [...prev.ious];

      if (mut.type === 'expense') {
        updatedAccounts = updatedAccounts.map((a) =>
          a.id === mut.accountId
            ? { ...a, balanceCentavos: a.balanceCentavos - mut.amountCentavos }
            : a
        );
        actionMsg = `Logged expense of ₱${(mut.amountCentavos / 100).toFixed(0)}`;
      } else if (mut.type === 'income') {
        updatedAccounts = updatedAccounts.map((a) =>
          a.id === mut.accountId
            ? { ...a, balanceCentavos: a.balanceCentavos + mut.amountCentavos }
            : a
        );
        actionMsg = `Logged income of ₱${(mut.amountCentavos / 100).toFixed(0)}`;
      } else if (mut.type === 'transfer') {
        updatedAccounts = updatedAccounts.map((a) => {
          if (a.id === mut.accountId) {
            return { ...a, balanceCentavos: a.balanceCentavos - mut.amountCentavos };
          }
          if (a.id === mut.toAccountId) {
            return { ...a, balanceCentavos: a.balanceCentavos + mut.amountCentavos };
          }
          return a;
        });
        actionMsg = `Transferred ₱${(mut.amountCentavos / 100).toFixed(0)} between accounts`;
      } else if (mut.type === 'debt_payment') {
        updatedAccounts = updatedAccounts.map((a) =>
          a.id === mut.accountId
            ? { ...a, balanceCentavos: a.balanceCentavos - mut.amountCentavos }
            : a
        );
        updatedDebts = updatedDebts.map((d) =>
          d.id === mut.debtId
            ? {
                ...d,
                remainingBalanceCentavos: d.remainingBalanceCentavos - mut.amountCentavos,
                minimumDueCentavos: Math.max(0, d.minimumDueCentavos - mut.amountCentavos),
              }
            : d
        );
        actionMsg = `Paid ₱${(mut.amountCentavos / 100).toFixed(0)} toward debt`;
      } else if (mut.type === 'iou_settlement') {
        const targetIou = prev.ious.find((i) => i.id === mut.iouId)!;
        const incoming = targetIou.direction === 'owed_to_me';

        updatedAccounts = updatedAccounts.map((a) =>
          a.id === mut.accountId
            ? {
                ...a,
                balanceCentavos:
                  a.balanceCentavos + (incoming ? mut.amountCentavos : -mut.amountCentavos),
              }
            : a
        );

        updatedIous = updatedIous.map((i) => {
          if (i.id !== mut.iouId) return i;
          const remaining = i.amountCentavos - mut.amountCentavos;
          return {
            ...i,
            amountCentavos: remaining,
            status: remaining === 0 ? 'settled' : 'partially_paid',
          };
        });

        actionMsg = `Settled ₱${(mut.amountCentavos / 100).toFixed(0)} for ${targetIou.personName}`;
      }

      return {
        ...prev,
        accounts: updatedAccounts,
        debts: updatedDebts,
        ious: updatedIous,
        transactions: [newTxn, ...prev.transactions],
      };
    });

    setHistoryStack((stack) => [snapshot, ...stack].slice(0, 5));
    setLastActionMessage(actionMsg);
    return { ok: true };
  };

  const undoLastMutation = (): boolean => {
    if (historyStack.length === 0) return false;
    const [previousState, ...remainingStack] = historyStack;
    setProfile(previousState);
    setHistoryStack(remainingStack);
    setLastActionMessage('Action undone');
    return true;
  };

  const clearLastActionMessage = () => setLastActionMessage(null);

  const addWant = (want: Omit<WantItem, 'id' | 'addedDate' | 'status'>) => {
    const newWant: WantItem = {
      ...want,
      id: newLocalId('want'),
      addedDate: prototypeClock.isoDate,
      status: 'cooling_off',
    };
    setProfile((prev) => ({ ...prev, wants: [newWant, ...prev.wants] }));
    setLastActionMessage(`Added "${want.title}" to cooling-off list`);
  };

  const updateWantStatus = (wantId: string, status: WantItem['status']) => {
    setProfile((prev) => ({
      ...prev,
      wants: prev.wants.map((w) => (w.id === wantId ? { ...w, status } : w)),
    }));
  };

  const promoteWantToGoal = (wantId: string, monthlyContributionCentavos: number) => {
    setProfile((prev) => {
      const want = prev.wants.find((w) => w.id === wantId);
      if (!want) return prev;

      const target = prototypeClock.now;
      target.setDate(target.getDate() + 180);

      const newGoal: Goal = {
        id: newLocalId('goal'),
        title: want.title,
        targetCentavos: want.priceCentavos,
        currentCentavos: 0,
        targetDate: target.toISOString().split('T')[0],
        category: 'purchase',
        monthlyContributionCentavos,
      };

      return {
        ...prev,
        wants: prev.wants.map((w) =>
          w.id === wantId ? { ...w, status: 'promoted_to_goal' } : w
        ),
        goals: [...prev.goals, newGoal],
      };
    });
    setLastActionMessage('Promoted item to funded goal');
  };

  const updateGoalContribution = (goalId: string, deltaMonthlyCentavos: number) => {
    setProfile((prev) => ({
      ...prev,
      goals: prev.goals.map((g) =>
        g.id === goalId
          ? {
              ...g,
              monthlyContributionCentavos: Math.max(
                0,
                g.monthlyContributionCentavos + deltaMonthlyCentavos
              ),
            }
          : g
      ),
    }));
  };

  const resetToSeeds = () => {
    prototypeClock.reset();
    const seed =
      personaId === 'custom' && customSeed
        ? customSeed
        : DEMO_PERSONAS[personaId as DemoPersonaId];
    setProfile(cloneProfile(seed));
    setHistoryStack([]);
    setLastActionMessage('Reset to prototype seed');
  };

  return (
    <KivraContext.Provider
      value={{
        currentPersona: profile,
        setPersona: switchPersona,
        setCustomProfile,
        isPrivacyMasked,
        togglePrivacyMask,
        isDarkMode,
        toggleDarkMode,
        safeToSpend,
        healthDimensions,
        addTransaction,
        undoLastMutation,
        hasUndo: historyStack.length > 0,
        lastActionMessage,
        clearLastActionMessage,
        addWant,
        updateWantStatus,
        promoteWantToGoal,
        updateGoalContribution,
        resetToSeeds,
      }}
    >
      {children}
    </KivraContext.Provider>
  );
};

export function useKivra() {
  const ctx = useContext(KivraContext);
  if (!ctx) throw new Error('useKivra must be used within KivraProvider');
  return ctx;
}
