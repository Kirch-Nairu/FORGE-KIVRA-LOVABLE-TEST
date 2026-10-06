import React, { createContext, useContext, useState, useMemo } from 'react';
import { PersonaProfile, Transaction, WantItem, Goal } from '../domain/types';
import { DEMO_PERSONAS } from '../data/demo';
import { prototypeClock } from '../domain/clock';
import { calculateSafeToSpend, SafeToSpendResult } from '../domain/finance/safeToSpend';
import { evaluateFinancialHealth } from '../domain/finance/health';

interface KivraContextValue {
  currentPersona: PersonaProfile;
  setPersona: (id: 'mika' | 'dan' | 'ysa') => void;
  isPrivacyMasked: boolean;
  togglePrivacyMask: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  safeToSpend: SafeToSpendResult;
  healthDimensions: ReturnType<typeof evaluateFinancialHealth>;
  addTransaction: (txn: Omit<Transaction, 'id' | 'timestamp'>) => void;
  addWant: (want: Omit<WantItem, 'id' | 'addedDate' | 'status'>) => void;
  updateGoalContribution: (goalId: string, deltaMonthlyCentavos: number) => void;
  resetToSeeds: () => void;
}

const KivraContext = createContext<KivraContextValue | null>(null);

export const KivraProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [personaId, setPersonaId] = useState<'mika' | 'dan' | 'ysa'>('mika');
  const [profile, setProfile] = useState<PersonaProfile>(JSON.parse(JSON.stringify(DEMO_PERSONAS.mika)));
  const [isPrivacyMasked, setIsPrivacyMasked] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  const switchPersona = (id: 'mika' | 'dan' | 'ysa') => {
    setPersonaId(id);
    setProfile(JSON.parse(JSON.stringify(DEMO_PERSONAS[id])));
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

  const addTransaction = (txn: Omit<Transaction, 'id' | 'timestamp'>) => {
    const newTxn: Transaction = {
      ...txn,
      id: `txn_${Date.now()}`,
      timestamp: prototypeClock.now.toISOString(),
    };

    setProfile((prev) => {
      const updatedAccounts = prev.accounts.map((acc) => {
        if (acc.id === txn.accountId) {
          if (txn.type === 'expense' || txn.type === 'debt_payment' || txn.type === 'transfer') {
            return { ...acc, balanceCentavos: acc.balanceCentavos - txn.amountCentavos };
          } else if (txn.type === 'income' || txn.type === 'iou_settlement') {
            return { ...acc, balanceCentavos: acc.balanceCentavos + txn.amountCentavos };
          }
        }
        if (txn.type === 'transfer' && acc.id === txn.toAccountId) {
          return { ...acc, balanceCentavos: acc.balanceCentavos + txn.amountCentavos };
        }
        return acc;
      });

      return {
        ...prev,
        accounts: updatedAccounts,
        transactions: [newTxn, ...prev.transactions],
      };
    });
  };

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
  };

  return React.createElement(
    KivraContext.Provider,
    {
      value: {
        currentPersona: profile,
        setPersona: switchPersona,
        isPrivacyMasked,
        togglePrivacyMask,
        isDarkMode,
        toggleDarkMode,
        safeToSpend,
        healthDimensions,
        addTransaction,
        addWant,
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
