# KIVRA — STATIC DATA / CALCULATION CONTRACT

## Architecture

This experiment has **no database**.

```text
typed deterministic fixtures
→ local runtime state
→ pure finance functions
→ UI
```

No API layer.

## Prototype clock

Default:

```text
Wed 7 Oct 2026
19:30
Asia/Manila
```

All date-sensitive logic uses the prototype clock.

Never use real wall-clock time for financial calculations.

## Personas

### Mika
- salaried;
- paid 15th/30th;
- ₱22,500 net per payday;
- Cash, GCash, Payroll, Savings, Emergency;
- credit card remaining ₱8,400, min ₱800;
- rent ₱4,500 due 12th;
- internet ₱1,299;
- phone installment ₱1,150;
- subscriptions;
- salary loan;
- Laptop goal ₱35,000 / ₱12,400 current;
- IOUs both directions.

### Dan
- irregular freelance invoices;
- one late invoice;
- cautious cash flow;
- business/personal split;
- Camera + emergency goals;
- online loan.

### Ysa
- weekly allowance ₱1,500;
- gigs;
- BNPL ₱3,200;
- weekly-budget mode;
- social-spend trigger.

## Golden Safe-to-Spend vector

At default clock for Mika:

```text
Accessible A = ₱11,470
Reserved R = ₱1,000
Bills = ₱6,949
Debt min = ₱800
Essentials = 8 × ₱230 = ₱1,840
Cushion = ₱230

STS total = ₱651
STS daily ≈ ₱81
Horizon = 8 days to 15 Oct 2026
Status = Tight
```

Compute it. Do not insert it as an independent UI constant.

## Canonical formula

```text
H = next confirmed income
A = spendable balances
R = reservations + scheduled goal contributions <= H
B = unpaid commitments + subscriptions + debt minimums + promised IOU payments by user due <= H
E = essential daily run-rate × days to H
C = cushion days × essential daily run-rate

STS_total = max(0, A - R - B - E - C)
STS_daily = STS_total / days_to_H
```

No confirmed income within 31 days → rolling 14-day horizon, visibly labeled.

Expected repayments from others are excluded by default.

## Frozen distinctions

```text
transfer != expense
debt principal != ordinary category spend
IOU repayment received != earned income
goal contribution != spend
reservation != spend
cash reconciliation adjustment != purchase
want != goal
formal debt != informal IOU
```

## Seed patterns

Mika data must support by calculation:
- coffee ~6× this week at about ₱120;
- food delivery 4 of last 5 Fridays;
- post-payday 48h spend around 2.3× baseline;
- 8 of 12 discretionary entries after 8 PM this week;
- one unused/stale subscription;
- ₱1,400 cash reconciliation gap;
- one overdue IOU.

Dan:
- income variance;
- late invoice;
- late-night spend;
- goal behind plan.

Ysa:
- weekend social spending;
- midweek shortfall risk.

Insight cards must come from fixture data, not hard-coded prose detached from data.

## Money representation

Use integer centavos internally.

## Runtime persistence

Full financial-domain persistence across reload is **not required**.

A reload may restore persona seed state.

Optional persistence only for:
- selected persona;
- theme;
- privacy;
- density.

## Exports

Generate from current runtime state:
- CSV;
- JSON snapshot;
- printable reports.

Do not upload anything.
