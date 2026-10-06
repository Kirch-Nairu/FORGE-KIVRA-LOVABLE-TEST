# KIVRA — PRODUCT AUTHORITY SUMMARY

**Product:** KIVRA — Personal Financial OS  
**Primary upstream authority:** Claude-authored KIVRA PRD v1.0  
**This file:** implementation summary, not a replacement for the full PRD

## Product thesis

Kivra is not an expense tracker with prettier charts.

It is a daily financial operating system built to help a person answer:

1. What money do I actually have?
2. What came in today?
3. What went out today?
4. What is committed before my next confirmed income?
5. What is safe to spend?
6. What am I repeatedly spending on?
7. Which behaviors or contexts are associated with that spending?
8. Who owes me?
9. Who do I owe?
10. What goal am I trying to reach?
11. What changes if I make a purchase, reduce a habit, earn more, or pay debt faster?

The user should be able to make a decision **today**, not merely inspect last month's categories.

## Philippine context

The reference product is initially optimized for Philippine financial behavior:

- cash;
- GCash/Maya and e-wallet mental models;
- bank/payroll/savings locations;
- irregular income;
- allowance;
- freelance/side-hustle income;
- family support;
- informal lending;
- salary/online loans;
- BNPL;
- boarding/rent;
- tuition;
- transport;
- mobile load/data;
- subscriptions;
- gaming;
- food delivery;
- family obligations;
- paluwagan / store-credit realities as modeled concepts.

No real account connection exists in this experiment.

## Primary navigation — frozen

Exactly:
- Today
- Plan
- Money
- Goals
- Patterns

Global:
- Quick Add
- Search
- You
- privacy mask

## Product principles

- Goal oriented.
- Behavior aware.
- Cash-flow aware.
- Contextual.
- Explainable.
- Non-shaming.
- Useful for irregular income.
- Safe-to-Spend is explainable via “Show the math.”
- Expected repayments from others are excluded from Safe-to-Spend by default.
- Uncertainty is shown rather than hidden.
- No arbitrary opaque 0–100 finance score.

## Domain distinctions — frozen

```text
transfer != spending
debt principal repayment != ordinary spending
IOU repayment received != earned income
goal contribution != spending
reservation != spending
cash reconciliation adjustment != purchase
goal != want
formal debt != informal IOU
```

## Safe-to-Spend

Canonical formula:

```text
H = next confirmed income date
A = spendable account balances
R = reservations + scheduled goal contributions <= H
B = unpaid commitments + subscriptions + debt minimums + promised IOU payments by the user due before H
E = essential daily run-rate × days to H
C = cushion days × essential daily run-rate

STS_total = max(0, A - R - B - E - C)
STS_daily = STS_total / days_to_H
```

Default Mika golden vector at prototype time:

```text
Accessible A = ₱11,470
Reserved R = ₱1,000
Bills = ₱6,949
Credit-card minimum = ₱800
Essentials = 8 × ₱230 = ₱1,840
Cushion = ₱230

STS total = ₱651
STS daily ≈ ₱81
Horizon = 8 days to 15 Oct 2026
Status = Tight
```

The UI result must come from the calculation engine, not from a magic constant.

## Core product objects

- Profile / financial assumptions
- Account / money location
- Reservation
- Category
- Merchant
- Transaction
- Expected income
- Recurring commitment
- Subscription
- Debt
- Person
- IOU
- Goal
- Want
- Budget plan
- Watch rule
- Insight
- Check-in
- Scenario
- Reminder preferences

Money is represented internally as integer centavos.

## Required demo personas

### Mika
Salaried, paid 15th/30th, multiple money locations, credit card, rent, subscriptions, loan, laptop goal, informal IOUs.

### Dan
Freelancer, irregular invoices, one late invoice, cautious cash flow, business/personal split, debt, Camera/emergency goals.

### Ysa
Student, weekly allowance, gigs, BNPL, weekly-budget mode, social-spend pattern.

## Required pattern behavior

Insights must be computable from demo transactions.

Mika must support:
- coffee frequency;
- Friday delivery pattern;
- post-payday spending spike;
- late-evening discretionary cluster;
- one stale/unused subscription;
- cash withdrawal/reconciliation gap;
- overdue IOU.

Dan:
- income variance;
- late invoice;
- late-night spending;
- goal behind projection.

Ysa:
- weekend/social spend;
- midweek shortfall risk.

## Major product surfaces

Today:
- Safe-to-Spend;
- runway;
- money in/out/net;
- needs attention;
- up next;
- one evidence-based insight;
- goal nudge;
- activity;
- check-in.

Plan:
- cash-flow timeline;
- financial calendar;
- commitments;
- subscriptions;
- budgets;
- what-if scenarios.

Money:
- accounts;
- reservations;
- transfers;
- debts;
- debt strategy;
- people/IOUs;
- net worth as a subordinate tool.

Goals:
- goals;
- emergency fund;
- wants;
- optional cooling-off;
- goal what-if.

Patterns:
- insight feed;
- categories;
- time;
- merchants;
- needs/wants;
- triggers;
- watch rules.

Supporting:
- Search;
- You/profile assumptions;
- Privacy;
- Reports;
- Export/backup;
- Appearance;
- Demo controls;
- explainable financial-health indicators.

## Prototype truthfulness

Never claim:
- bank sync;
- GCash/Maya sync;
- payment execution;
- production security;
- production authentication;
- AI financial advice;
- cloud backup.

Use:
- Demo data;
- Prototype;
- Simulated;
- Reference build.
