# KIVRA — SCREEN / ROUTE IMPLEMENTATION CONTRACT

The full PRD remains upstream detail. This file prevents Lovable from spending build credits rediscovering routing and hierarchy.

## Primary shell

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

Compact: bottom navigation.
Expanded: navigation rail/sidebar.

## Today

Routes:
- `/today`
- `/today/math`
- `/today/afford`
- `/today/payday-plan`
- `/today/checkin`
- `/ledger`
- `/txn/:id`
- `/add`

### Today order

1. Date / privacy / search / You.
2. Safe-to-Spend open section, not generic KPI card.
3. Hero ₱81.
4. ₱651 until payday · 15 Oct · 8 days.
5. Runway/status + Show the math + Can I afford.
6. In / Out / Net.
7. Needs Attention <=3 rows.
8. Up Next timeline.
9. One Noticed insight.
10. One Goal nudge.
11. Latest transactions.
12. Check-in after 18:00 prototype time.
13. Wins only when measured.

No total-balance hero.
No donut dashboard.

### Show the math

Waterfall:
Accessible → Reserved → Bills → Debt → Essentials → Cushion → STS.

### Can I afford

Enter amount and recompute:
- STS;
- runway;
- nearest goal;
- verdict.

Actions:
- Buy anyway & log;
- Add to Wants;
- Wait 48h;
- Pay in 2 parts.

### Quick Add

Modes:
- Expense;
- Income;
- Transfer;
- IOU;
- Debt payment.

Amount first.

## Plan

Routes:
- `/plan`
- `/plan/cashflow`
- `/plan/calendar`
- `/plan/commitments`
- `/plan/subscriptions`
- `/plan/commitment/:id`
- `/plan/budget`
- `/plan/budget/mode`
- `/plan/whatif`
- `/plan/whatif/:id`

Cash flow is default.

Scenario templates:
- extra income;
- income -20%;
- reduce coffee;
- extra debt payment;
- buy phone now;
- delay purchase;
- increase goal contribution.

## Money

Routes:
- `/money`
- `/money/account/:id`
- `/money/reconcile/:id`
- `/money/transfer`
- `/money/reservations`
- `/money/networth`
- `/money/debts`
- `/money/debt/:id`
- `/money/debt/strategy`
- `/money/people`
- `/money/person/:id`
- `/money/iou/new`

Transfers never count as spending.

People separates:
- Owed to me;
- I owe.

## Goals

Routes:
- `/goals`
- `/goals/:id`
- `/goals/emergency`
- `/goals/wants`
- `/goals/want/:id`

Goal != Want.

Wants include:
- impact preview;
- optional cooling-off;
- Buy / Plan / Drop / Make it a goal.

## Patterns

Routes:
- `/patterns`
- `/patterns/insights`
- `/patterns/insight/:id`
- `/patterns/categories`
- `/patterns/time`
- `/patterns/merchants`
- `/patterns/needs-wants`
- `/patterns/triggers`
- `/patterns/watch`

Scope:
- 7;
- 30;
- 90 days.

Every insight requires evidence.

## Search

`/search`

Search:
merchant, transaction, person, account, goal, debt, note, category.

## You

- `/you`
- `/you/profile`
- `/you/privacy`
- `/you/reminders`
- `/you/reports`
- `/you/export`
- `/you/backup`
- `/you/import`
- `/you/appearance`
- `/you/data`
- `/you/demo`

Prototype honesty is visible here.

## Health

`/health`

Dimensions:
- cash stability;
- debt pressure;
- emergency readiness;
- spending control;
- goal progress;
- upcoming obligation pressure.

No opaque magic score.

## Onboarding

The full PRD defines O-01…O-34.

Implement as one controlled multi-step flow with branching instead of 34 unrelated route files.

Must preserve:
- one decision at a time;
- close-ended tailoring;
- Why we ask;
- Skip;
- Try demo profile;
- starting picture.

No giant scrolling questionnaire.

## Interaction completeness

Every control that looks actionable must:
- work;
- open a clearly simulated surface;
- or be explicitly disabled with prototype reason.

No dead primary controls.
