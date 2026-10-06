import React, { createContext, useContext, useState, useMemo } from 'react';
import { PersonaProfile, Transaction, WantItem, Goal, PersonIOU, Debt } from '../domain/types';
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

interface KivraContextValue {
  currentPersona: PersonaProfile;
  setPersona: (id: 'mika' | 'dan' | 'ysa') => void;
  setCustomProfile: (profile: PersonaProfile) => void;
  isPrivacyMasked: boolean;
  togglePrivacyMask: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  safeToSpend: SafeToSpendResult;
  healthDimensions: ReturnType<typeof evaluateFinancialHealth>;
  addTransaction: (mutation: QuickAddMutation) => void;
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

export const KivraProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [personaId, setPersonaId] = useState<'mika' | 'dan' | 'ysa'>('mika');
  const [profile, setProfile] = useState<PersonaProfile>(JSON.parse(JSON.stringify(DEMO_PERSONAS.mika)));
  const [historyStack, setHistoryStack] = useState<PersonaProfile[]>([]);
  const [lastActionMessage, setLastActionMessage] = useState<string | null>(null);
  const [isPrivacyMasked, setIsPrivacyMasked] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  const switchPersona = (id: 'mika' | 'dan' | 'ysa') => {
    setPersonaId(id);
    setProfile(JSON.parse(JSON.stringify(DEMO_PERSONAS[id])));
    setHistoryStack([]);
    setLastActionMessage(null);
  };

  const setCustomProfile = (custom: PersonaProfile) => {
    setProfile(custom);
    setHistoryStack([]);
    setLastActionMessage('Profile initialized from Onboarding');
  };

  const togglePrivacyMask = () => setIsPrivacyMasked((prev) => !prev);
  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  };

  const safeToSpend = useMemo(() => {
    return calculateSafeToSpend(profile, prototypeClock.now);
  }, [profile]);

  const healthDimensions = useMemo(() => {
    return evaluateFinancialHealth(profile, prototypeClock.now);
  }, [profile]);

  const addTransaction = (mut: QuickAddMutation) => {
    setProfile((prev) => {
      // Save snapshot for undo
      setHistoryStack((stack) => [JSON.parse(JSON.stringify(prev)), ...stack].slice(0, 5));

      const newTxnId = `txn_${Date.now()}`;
      const newTxn: Transaction = {
        id: newTxnId,
        timestamp: prototypeClock.now.toISOString(),
        type: mut.type,
        amountCentavos: mut.amountCentavos,
        accountId: mut.accountId,
        toAccountId: mut.toAccountId,
        category: mut.category || (mut.type === 'income' ? 'Income' : 'Discretionary'),
        merchant: mut.merchant,
        note: mut.note,
        personId: mut.iouId,
      };

      let updatedAccounts = [...prev.accounts];
      let updatedDebts = [...prev.debts];
      let updatedIous = [...prev.ious];
      let actionMsg = '';

      if (mut.type === 'expense') {
        updatedAccounts = updatedAccounts.map((a) =>
          a.id === mut.accountId ? { ...a, balanceCentavos: a.balanceCentavos - mut.amountCentavos } : a
        );
        actionMsg = `Logged expense of ₱${(mut.amountCentavos / 100).toFixed(0)}`;
      } else if (mut.type === 'income') {
        updatedAccounts = updatedAccounts.map((a) =>
          a.id === mut.accountId ? { ...a, balanceCentavos: a.balanceCentavos + mut.amountCentavos } : a
        );
        actionMsg = `Logged income of ₱${(mut.amountCentavos / 100).toFixed(0)}`;
      } else if (mut.type === 'transfer') {
        // Balance-conserving: source - amount, destination + amount
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
        // Reduce source account, reduce debt balance
        updatedAccounts = updatedAccounts.map((a) =>
          a.id === mut.accountId ? { ...a, balanceCentavos: a.balanceCentavos - mut.amountCentavos } : a
        );
        updatedDebts = updatedDebts.map((d) => {
          if (d.id === mut.debtId) {
            const newBal = Math.max(0, d.remainingBalanceCentavos - mut.amountCentavos);
            return { ...d, remainingBalanceCentavos: newBal };
          }
          return d;
        });
        actionMsg = `Paid ₱${(mut.amountCentavos / 100).toFixed(0)} toward debt`;
      } else if (mut.type === 'iou_settlement') {
        const targetIou = updatedIous.find((i) => i.id === mut.iouId);
        if (targetIou) {
          const isOwedToMe = targetIou.direction === 'owed_to_me';
          // owed_to_me -> money received in account, IOU remaining decreases
          // i_owe -> money paid from account, IOU remaining decreases
          updatedAccounts = updatedAccounts.map((a) => {
            if (a.id === mut.accountId) {
              const delta = isOwedToMe ? mut.amountCentavos : -mut.amountCentavos;
              return { ...a, balanceCentavos: a.balanceCentavos + delta };
            }
            return a;
          });

          updatedIous = updatedIous.map((i) => {
            if (i.id === mut.iouId) {
              const newRemaining = Math.max(0, i.amountCentavos - mut.amountCentavos);
              const newStatus = newRemaining === 0 ? 'settled' : 'partially_paid';
              return { ...i, amountCentavos: newRemaining, status: newStatus };
            }
            return i;
          });
          actionMsg = `Settled ₱${(mut.amountCentavos / 100).toFixed(0)} for ${targetIou.personName}`;
        }
      }

      setLastActionMessage(actionMsg);

      return {
        ...prev,
        accounts: updatedAccounts,
        debts: updatedDebts,
        ious: updatedIous,
        transactions: [newTxn, ...prev.transactions],
      };
    });
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
      id: `want_${Date.now()}`,
      addedDate: prototypeClock.isoDate,
      status: 'cooling_off',
    };
    setProfile((prev) => ({
      ...prev,
      wants: [newWant, ...prev.wants],
    }));
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

      const newGoal: Goal = {
        id: `goal_${Date.now()}`,
        title: want.title,
        targetCentavos: want.priceCentavos,
        currentCentavos: 0,
        targetDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        category: 'purchase',
        monthlyContributionCentavos,
      };

      return {
        ...prev,
        wants: prev.wants.map((w) => (w.id === wantId ? { ...w, status: 'promoted_to_goal' } : w)),
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
          ? { ...g, monthlyContributionCentavos: Math.max(0, g.monthlyContributionCentavos + deltaMonthlyCentavos) }
          : g
      ),
    }));
  };

  const resetToSeeds = () => {
    prototypeClock.reset();
    setProfile(JSON.parse(JSON.stringify(DEMO_PERSONAS[personaId])));
    setHistoryStack([]);
    setLastActionMessage('Reset to prototype seeds');
  };

  return React.createElement(
    KivraContext.Provider,
    {
      value: {
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
      },
    },
    children
  );
};

export function useKivra() {
  const ctx = useContext(KivraContext);
  if (!ctx) throw new Error('useKivra must be used within KivraProvider');
  return ctx;
}
