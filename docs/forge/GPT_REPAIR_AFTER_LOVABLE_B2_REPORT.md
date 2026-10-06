# KIRION FORGE — KIVRA
# GPT REPAIR AFTER LOVABLE B2 — CANDIDATE REPORT

**Source Lovable B2 candidate:** `d17a47d4a24bf6ebd0e5b1315da931818d25dbb9`  
**Repair branch:** `forge/gpt-repair-after-lovable-b2`  
**Repair authority:** F2 independent Forge review in issue #1  
**Worker:** GPT-5.6 Sol acting beneath KIRION Forge authority  
**Architecture:** React + TypeScript + Vite; no backend/database/cloud/auth  
**Tests:** not added  
**Runtime/build after GPT mutation:** NOT_EXECUTED in this environment

## Purpose

Lovable exhausted its available credits after B2. The B2 candidate was materially improved but still contradicted several completion claims. Forge therefore froze the exact Lovable SHA and authorized a bounded GPT repair rather than spending another broad Lovable pass.

## Repairs implemented

### Financial mutation invariants

Moved critical Quick Add validation below the form and into the shared application store.

The mutation boundary now rejects:

- zero/negative/non-integral amounts;
- unknown accounts;
- expense overdrafts;
- transfer without valid distinct destination;
- transfer overdrafts;
- unknown debt;
- debt payment above remaining principal;
- debt-payment overdrafts;
- unknown/already-settled IOUs;
- IOU settlement above remaining amount;
- outgoing IOU settlement overdrafts.

Successful actions preserve domain semantics:

- transfer subtracts source and credits destination;
- debt payment reduces source cash, remaining debt and current minimum due in the simplified prototype model;
- incoming IOU settlement adds cash and reduces receivable;
- outgoing IOU settlement reduces cash and payable;
- settled/partial IOU state is updated;
- mutation errors keep Quick Add open.

### Transaction semantics

Added optional transaction cash-flow direction so incoming and outgoing IOU settlements can be rendered correctly.

Transfers render as neutral movements rather than ordinary spending.

### Safe-to-Spend

Added due informal payables to the canonical STS obligations:

```text
A
- reservations
- bills
- debt minimums
- due IOU payables
- essential run-rate
- cushion
= Safe-to-Spend
```

Mika's golden vector is preserved because Mika's outgoing IOU falls after the next-income horizon.

The STS waterfall exposes due IOU payables when present.

### Cash-flow projection

Projection now starts from spendable accounts rather than protected savings.

Due outgoing IOUs are included as projected cash outflows.

Expected income, commitments, debt minimums and daily essentials remain visible projection events.

### Today

Repaired the broken evening Quick Add action. It now opens the global Quick Add modal rather than navigating to an unknown route.

Affordability and evidence text now respect privacy masking.

### Privacy

Added reusable privacy helpers and extended masking to:

- behavioral evidence;
- financial-health text/factors;
- cash-flow min/peak labels;
- Money debt minimum copy;
- Goal contribution/scenario amounts;
- Plan scenario amounts/results;
- Quick Add account/debt/IOU choices;
- printable report values;
- affordability rationale.

Masked monetary accessibility text no longer discloses hidden figures through `MoneyFigure`.

### Patterns

Pattern observations remain computed from fixture/runtime evidence.

Removed unsupported hard-coded savings claims from suggested actions. Coffee and Friday-delivery suggestions now derive amounts from observed count/ticket data.

Subscription guidance no longer infers actual usage.

### Plan scenarios

Corrected the largest semantic defect: reducing discretionary habits no longer mutates the essential survival run-rate.

Scenario evaluation now distinguishes:

- behavioral savings outside the current STS waterfall;
- delayed next income;
- extra confirmed income;
- extra debt payment;
- immediate purchase;
- unfunded purchase remainder.

Extra debt payment reduces the modeled current minimum first, preventing the prior STS double count.

### Goals

Goal scenario amounts are privacy-aware.

Goal selection repairs itself after persona switches.

Want→Goal promotion uses the injected prototype clock rather than wall-clock `Date.now()`.

### Onboarding

Rebuilt onboarding output so answers materially affect the created custom profile.

The five-stage local flow now captures and applies:

- income type;
- cadence;
- predictability;
- monthly take-home;
- money locations;
- accessible balance;
- protected/emergency balance;
- essential daily run-rate;
- recurring commitments and approximate amount;
- family/dependent support;
- debt categories, balance and minimum;
- informal IOU direction and amount;
- frequent discretionary purchases;
- spending contexts/triggers;
- primary goal, target and saved amount.

A custom profile receives a distinct `custom` identity instead of masquerading as Mika.

Selected habits/contexts seed deterministic transactions so later pattern observations remain evidence-backed.

### Search

Search results now navigate to their relevant product surface:

- transactions → Ledger;
- accounts/debts/IOUs → Money;
- goals/wants → Goals.

### Exports

Added RFC-style CSV field escaping for commas, quotes and line breaks.

Exports use the current runtime state and include:

- transactions;
- income;
- expenses;
- accounts;
- debts;
- IOUs;
- goals;
- JSON snapshot.

Printable report surfaces remain browser-print based and are explicitly reference-build behavior.

### Network posture

Removed the Google Fonts network request from `index.html`.

The app now relies on local/system font fallbacks.

### Health

Emergency-buffer calculation now uses explicitly non-spendable/protected accounts instead of treating all digital-bank accounts as protected.

Coverage incorporates due IOU payables.

Late-night classification is evaluated against Asia/Manila time.

## Validation status

The GPT repair was source-reviewed against the exact branch after each bounded change.

No test suite or CI was introduced.

Because the local execution environment cannot retrieve this GitHub repository or npm dependencies, the post-repair candidate has **not** inherited Lovable's earlier build PASS.

Per exact-candidate governance:

```text
TYPECHECK: NOT_EXECUTED
BUILD: NOT_EXECUTED
RUNTIME: NOT_EXECUTED
TESTS: NOT_EXECUTED
```

The next worker must treat this as a new candidate requiring independent intake.

## Known limitations intentionally retained

- runtime state is memory-only and resets to deterministic seed/custom setup;
- browser print is used instead of a PDF engine;
- no backend/database/auth/cloud;
- financial scenarios are prototype models, not professional financial advice;
- router is a lightweight History API router;
- no automated tests were added under the experiment's credit policy.

## Disposition

```text
GPT REPAIR IMPLEMENTED
READY FOR CLAUDE C0 FORENSIC INTAKE
NOT ACCEPTED
NOT SELF-VALIDATED
```

Claude must inspect the exact repaired source and independently identify any remaining contradictions before receiving mutation authority.
