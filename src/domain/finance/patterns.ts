import { PersonaProfile, Transaction, Commitment, PersonIOU, InsightEvidence } from '../types';

// Convert ISO timestamp to Manila timezone calendar values
function toManilaDateTime(timestamp: string): { dayOfWeek: number; dayOfMonth: number; hours: number } {
  const d = new Date(timestamp);
  const manilaTime = d.toLocaleString('en-US', { timeZone: 'Asia/Manila' });
  const manilaDate = new Date(manilaTime);
  return {
    dayOfWeek: manilaDate.getDay(),
    dayOfMonth: manilaDate.getDate(),
    hours: manilaDate.getHours(),
  };
}

const POSTPAYDAY_WINDOW_DAYS = 35;

export function deriveCoffeePattern(transactions: Transaction[], now: Date): InsightEvidence | null {
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const coffeeTxns = transactions.filter((t) => {
    const isCoffee =
      t.contextTag === 'coffee-habit' ||
      (t.merchant && t.merchant.toLowerCase().includes('coffee')) ||
      (t.note && t.note.toLowerCase().includes('coffee')) ||
      (t.note && t.note.toLowerCase().includes('latte')) ||
      (t.note && t.note.toLowerCase().includes('americano'));
    const isRecent = new Date(t.timestamp).getTime() >= oneWeekAgo.getTime();
    return t.type === 'expense' && isCoffee && isRecent;
  });

  if (coffeeTxns.length < 2) return null;

  const count = coffeeTxns.length;
  const totalCentavos = coffeeTxns.reduce((sum, t) => sum + t.amountCentavos, 0);
  const averageCentavos = Math.round(totalCentavos / count);
  const avgPesos = Math.round(averageCentavos / 100);
  const monthlyImpactPesos = Math.round((totalCentavos * 4.3) / 100);
  const weeklyAvoidedRuns = Math.max(0, count - 4);
  const monthlySavingPesos = Math.round((weeklyAvoidedRuns * averageCentavos * 4.3) / 100);

  return {
    id: 'pattern_coffee',
    title: 'Coffee Habit Pace',
    metric: `${count}× this week · ₱${(totalCentavos / 100).toLocaleString('en-PH')}`,
    description: `Coffee runs averaged ₱${avgPesos} per transaction across morning commutes. Projected monthly spend is ~₱${monthlyImpactPesos.toLocaleString('en-PH')}.`,
    patternType: 'frequency',
    transactions: coffeeTxns.map((t) => t.id),
    suggestedAction:
      monthlySavingPesos > 0
        ? `Reducing this pace to 4 runs/week would preserve about ₱${monthlySavingPesos.toLocaleString('en-PH')}/month at the observed average ticket.`
        : 'Current pace is already at or below 4 runs/week; review the evidence before changing the habit.',
  };
}

export function deriveDayOfWeekPattern(transactions: Transaction[], now: Date): InsightEvidence | null {
  // Check for Friday delivery cluster over last 35 days (5 weeks)
  const fiveWeeksAgo = new Date(now.getTime() - 35 * 24 * 60 * 60 * 1000);
  const fridayDeliveryTxns = transactions.filter((t) => {
    const manila = toManilaDateTime(t.timestamp);
    const isFriday = manila.dayOfWeek === 5;
    const isDelivery =
      t.contextTag === 'friday-delivery' ||
      (t.merchant && (t.merchant.toLowerCase().includes('grab') || t.merchant.toLowerCase().includes('foodpanda')));
    return t.type === 'expense' && isFriday && isDelivery && new Date(t.timestamp).getTime() >= fiveWeeksAgo.getTime();
  });

  if (fridayDeliveryTxns.length < 2) return null;

  const totalCentavos = fridayDeliveryTxns.reduce((s, t) => s + t.amountCentavos, 0);
  const averageOrderCentavos = Math.round(totalCentavos / fridayDeliveryTxns.length);

  return {
    id: 'pattern_friday_delivery',
    title: 'Friday Delivery Dinner Habit',
    metric: `${fridayDeliveryTxns.length} recent Friday delivery orders`,
    description: `Takeout orders cluster on Friday evenings post-shift. Total recent delivery spend is ₱${(totalCentavos / 100).toLocaleString('en-PH')}.`,
    patternType: 'timing',
    transactions: fridayDeliveryTxns.map((t) => t.id),
    suggestedAction: `Replacing one average Friday delivery each month would preserve about ₱${Math.round(
      averageOrderCentavos / 100
    ).toLocaleString('en-PH')} at the observed ticket size.`,
  };
}

export function derivePostPaydayPattern(
  transactions: Transaction[],
  paydayDays: number[],
  now: Date
): InsightEvidence | null {
  const postPaydayStart = new Date(now.getTime() - POSTPAYDAY_WINDOW_DAYS * 24 * 60 * 60 * 1000);
  const surgeTxns = transactions.filter((t) => {
    if (t.type !== 'expense') return false;
    const manila = toManilaDateTime(t.timestamp);
    const txnTime = new Date(t.timestamp).getTime();
    // within 48h after a payday (e.g., 15th-17th or 30th/31st/1st/2nd)
    const isPostPayday =
      paydayDays.some((p) => {
        if (p === 30 || p === 31) {
          return manila.dayOfMonth === 30 || manila.dayOfMonth === 31 || manila.dayOfMonth === 1 || manila.dayOfMonth === 2;
        }
        return manila.dayOfMonth >= p && manila.dayOfMonth <= p + 2;
      }) || t.contextTag === 'post-payday';
    return isPostPayday && txnTime >= postPaydayStart.getTime();
  });

  if (surgeTxns.length < 2) return null;

  const totalCentavos = surgeTxns.reduce((s, t) => s + t.amountCentavos, 0);

  return {
    id: 'pattern_post_payday',
    title: 'Post-Payday 48h Outlay Surge',
    metric: `₱${(totalCentavos / 100).toLocaleString('en-PH')} in post-payroll window`,
    description: `Discretionary purchases cluster in the 48 hours following payroll deposit before fixed commitments are fully settled.`,
    patternType: 'timing',
    transactions: surgeTxns.map((t) => t.id),
    suggestedAction: 'Automate transfers to savings or ring-fenced bills immediately on payday morning.',
  };
}

export function deriveLateEveningPattern(transactions: Transaction[], now: Date): InsightEvidence | null {
  const lateTxns = transactions.filter((t) => {
    if (t.type !== 'expense') return false;
    const manila = toManilaDateTime(t.timestamp);
    const hour = manila.hours;
    return hour >= 21 || hour < 4 || t.contextTag === 'late-night';
  });

  if (lateTxns.length < 1) return null;

  const totalCentavos = lateTxns.reduce((s, t) => s + t.amountCentavos, 0);

  return {
    id: 'pattern_late_evening',
    title: 'Late-Evening Discretionary Cluster',
    metric: `${lateTxns.length} orders after 9:00 PM`,
    description: `Tracked discretionary purchases after 9:00 PM total ₱${(totalCentavos / 100).toLocaleString(
      'en-PH'
    )}. Open the evidence list to see which merchants and categories contributed.`,
    patternType: 'timing',
    transactions: lateTxns.map((t) => t.id),
    suggestedAction: 'Use Kivra Wants cooling-off rule for unbudgeted evening browsing.',
  };
}

export function deriveSubscriptionPattern(
  commitments: Commitment[],
  transactions: Transaction[],
  now: Date
): InsightEvidence | null {
  const subscriptions = commitments.filter((c) => c.isSubscription);
  if (subscriptions.length === 0) return null;

  const totalMonthlyCentavos = subscriptions.reduce((s, c) => s + c.amountCentavos, 0);

  return {
    id: 'pattern_subscriptions',
    title: 'Recurring Subscription Inventory',
    metric: `${subscriptions.length} active subscriptions · ₱${(totalMonthlyCentavos / 100).toLocaleString('en-PH')}/mo`,
    description: `Recurring digital services total ₱${(totalMonthlyCentavos / 100).toLocaleString('en-PH')} monthly. Review active usage to eliminate dormant tiers.`,
    patternType: 'subscription',
    transactions: [],
    suggestedAction: 'Review each recurring service before its next billing date; Kivra does not infer usage without explicit data.',
  };
}

export function deriveReconciliationPattern(
  transactions: Transaction[],
  now: Date
): InsightEvidence | null {
  const reconTxns = transactions.filter((t) => t.type === 'reconciliation');
  if (reconTxns.length === 0) return null;

  const totalCentavos = reconTxns.reduce((s, t) => s + t.amountCentavos, 0);

  return {
    id: 'pattern_reconciliation',
    title: 'Cash Reconciliation Gap',
    metric: `₱${(totalCentavos / 100).toLocaleString('en-PH')} unaccounted cash drift`,
    description: `Physical wallet audit required a ₱${(totalCentavos / 100).toLocaleString('en-PH')} balancing adjustment from untracked pocket expenses.`,
    patternType: 'reconciliation',
    transactions: reconTxns.map((t) => t.id),
    suggestedAction: 'Log small transit and food stall cash outlays via Quick Add at point of purchase.',
  };
}

export function deriveOverdueIouPattern(ious: PersonIOU[], now: Date): InsightEvidence | null {
  const overdue = ious.filter((i) => i.status === 'overdue' && i.direction === 'owed_to_me');
  if (overdue.length === 0) return null;

  const first = overdue[0];
  return {
    id: 'pattern_overdue_iou',
    title: `Overdue Peer Receivable (${first.personName})`,
    metric: `₱${(first.amountCentavos / 100).toLocaleString('en-PH')} overdue`,
    description: `${first.personName} settlement for "${first.description}" is overdue. Safe-to-Spend excludes this receivable to protect cash flow.`,
    patternType: 'anomaly',
    transactions: [],
    suggestedAction: 'Send friendly payment reminder or settle in Quick Add.',
  };
}

export function deriveAllPatterns(profile: PersonaProfile, now: Date): InsightEvidence[] {
  const results: (InsightEvidence | null)[] = [
    deriveCoffeePattern(profile.transactions, now),
    deriveDayOfWeekPattern(profile.transactions, now),
    derivePostPaydayPattern(profile.transactions, profile.paydayDays, now),
    deriveLateEveningPattern(profile.transactions, now),
    deriveSubscriptionPattern(profile.commitments, profile.transactions, now),
    deriveReconciliationPattern(profile.transactions, now),
    deriveOverdueIouPattern(profile.ious, now),
  ];

  return results.filter((r): r is InsightEvidence => r !== null);
}
