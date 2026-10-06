# KIRION FORGE — KIVRA
# LOVABLE B2 REWORK HANDOFF — DOMAIN DEPTH / INTERACTION / TRUTHFULNESS

**Source candidate under review:** `57bc6785689ffbab0f596e92a5942606f946ca66`  
**Forge disposition:** `REWORK`  
**Worker:** Lovable  
**Mode:** bounded repair pass only  
**Tests:** deliberately NOT authorized in Lovable  
**Backend/database/cloud:** NONE

---

# 0. AUTHORITY

This handoff supersedes the B1 completion claim only where the F1 independent review found defects.

All existing product, UI/UX, data and file-structure authority remains frozen.

Do not redesign Kivra.
Do not restart from scratch.
Do not introduce cloud services.
Do not generate tests or CI.
Do not rewrite Forge authority documents.

Fix forward from the current candidate.

---

# 1. PLATFORM REBASELINE — EXPLICIT FOR THIS EXPERIMENT

B1 was authorized against Lovable's expected TanStack Start host, but the worker produced:

```text
React 18
TypeScript
Vite 5
Tailwind CSS
```

For Experiment C only, KIRION Forge now deliberately ADOPTS this implementation host:

```text
React + TypeScript + Vite
```

Do NOT spend B2 migrating frameworks.

This is a prototype/reference benchmark, not production architecture.

The failure was unauthorized substitution, not that Vite is intrinsically unacceptable.

---

# 2. B2 OBJECTIVE

Repair the candidate so the visible product behavior actually matches the B1 report and Kivra authority.

B2 priorities, in order:

1. financial semantic correctness;
2. computed evidence rather than prewritten claims;
3. missing major interactions;
4. complete privacy behavior;
5. truthful Today metrics;
6. global search;
7. richer exports;
8. onboarding;
9. adaptive/accessibility correction;
10. report truthfulness.

Do not spend time on decorative redesign unless required by one of these defects.

---

# 3. REAL ROUTING / DEEP-LINK BOUNDARIES

Current `AppShell` uses only an `activeTab` string.

B2 must introduce real browser route boundaries for major destinations while keeping the existing visual shell.

Required canonical URLs at minimum:

```text
/today
/plan
/money
/goals
/patterns
/ledger
/search
/you
/health
/exports
/onboarding
```

A lightweight client router or a minimal URL/history layer is acceptable.

Do not add a large framework migration.

Back/forward navigation must not be meaningless.

---

# 4. ONBOARDING — CURRENTLY ABSENT

Implement the governed onboarding as an interactive multi-step flow.

Required entry:

```text
Start with my finances
Try a demo profile
```

Required demo persona options:

```text
Mika
Dan
Ysa
```

Real onboarding must cover the main close-ended dimensions without becoming a 34-field scrolling form:

- work/income type;
- income cadence;
- predictability;
- money locations;
- essential expenses;
- recurring commitments;
- debts;
- informal IOUs;
- dependents/support;
- common spending;
- frequent purchases;
- spending triggers;
- financial vices using neutral wording;
- savings/emergency buffer;
- goals;
- budgeting style / observation mode.

Use:
- one decision at a time;
- chips/segmented options;
- amount entry;
- optional/skip;
- Why we ask;
- stage-based progress.

For the static experiment, onboarding may create a local runtime profile derived from entered answers. It does not need persistent account creation.

---

# 5. PATTERN ENGINE — REMOVE FAKE EVIDENCE

Current `PersonaProfile.insights` contains prewritten claims such as:

```text
6× this week · ₱720
4 of last 5 Fridays
2.3× baseline spend
```

while the seeded transactions do not mechanically support all those values.

This violates Kivra's trust model.

## Required correction

Insights shown in the UI must be derived from transaction/commitment/IOU data by pure calculation functions.

Introduce domain functions such as:

```text
deriveCoffeePattern()
deriveDayOfWeekPattern()
derivePostPaydayPattern()
deriveLateEveningPattern()
deriveSubscriptionPattern()
deriveReconciliationPattern()
deriveOverdueIouPattern()
```

Equivalent structure is acceptable.

You may expand deterministic fixture history so the intended demo insights become genuinely calculable.

Do not keep a detached hard-coded metric string as the evidence authority.

If data is insufficient, show:

```text
Not enough entries yet
```

instead of fabricating an insight.

---

# 6. QUICK ADD — FIX FINANCIAL SEMANTICS

The current five modes exist visually but do not all execute correct domain behavior.

## Expense

Must:
- choose source account;
- subtract source balance;
- create expense transaction.

## Income

Must:
- choose destination account;
- add balance;
- create income transaction.

## Transfer

Must require:
- source account;
- destination account;
- source != destination;
- sufficient source balance or explicit prototype warning.

One atomic local action must:
- subtract source;
- add destination;
- create one transfer transaction.

Transfer must not increase spending or income.

## Debt Payment

Must require:
- debt;
- source account;
- amount.

One action must:
- reduce source account;
- reduce debt remaining balance;
- create debt-payment transaction.

Do not reduce below zero.

## IOU Settlement

Must require:
- IOU/person;
- amount;
- account.

Behavior depends on direction:

```text
owed_to_me
→ account increases
→ IOU remaining decreases

i_owe
→ account decreases
→ IOU remaining decreases
```

Set:
- partially_paid;
- settled;

according to remaining balance.

IOU repayment received remains distinct from earned income.

## Undo

After Quick Add, provide a short-lived local Undo action for the last mutation where practical.

---

# 7. TODAY — ACTUAL TODAY METRICS

Current B1 strip incorrectly substitutes expected payday inflow, commitments and runway for the contract:

```text
Money in today
Money out today
Net today
```

B2 must compute these from transactions occurring on the prototype date.

Rules:

```text
money in today
= income + incoming IOU settlement
excluding transfers

money out today
= ordinary expense + debt payment + outgoing IOU settlement
excluding transfers and reconciliation

net today
= in - out
```

Keep runway as a separate element.

Do not count scheduled future payday as "money in today."

---

# 8. SAFE-TO-SPEND WATERFALL — REMOVE MIKA-ONLY LABELS

Current Waterfall hard-codes:

```text
Essentials (... × ₱230/day)
```

B2 must derive the daily run-rate from the active persona.

No Mika-only amount may leak into Dan/Ysa views.

---

# 9. FINANCIAL HEALTH — REMOVE MIKA-SPECIFIC HARDCODING

Current `health.ts` embeds Mika facts in generic logic, including:

- "Next confirmed income 15 Oct";
- "Credit card revolving balance";
- "Salary loan amortization";
- "₱25,000 isolated in emergency pocket";
- laptop goal claims.

B2 must derive explanations and factors from the active persona.

If no corresponding debt/account/goal exists, do not mention one.

No opaque score.

---

# 10. PLAN WHAT-IF — MAKE CONTROLS REAL

Current checkboxes only change local checkbox state while showing static outcome copy.

B2 must actually change computed scenario outputs.

At minimum support computed examples:

- reduce a recurring discretionary behavior;
- delay/reduce next income;
- add extra income;
- extra debt payment;
- planned purchase now;
- delay purchase;
- increase goal contribution.

Scenario UI may be compact, but result values must change from calculation modules.

Do not display a fixed "+₱960" or "-4 days" unless derived from the chosen scenario and data.

---

# 11. GOALS WHAT-IF — CURRENTLY ABSENT

Add a per-goal scenario interaction.

At minimum:

```text
What if I contribute +₱X / week or month?
```

Show derived change to:
- projected completion;
- shortfall or surplus;
- contribution requirement.

Also allow a Want to:
- remain in cooling-off;
- be dropped;
- be promoted to a Goal.

---

# 12. PRIVACY MASK — COMPLETE THE BOUNDARY

Current mask only protects values rendered through `MoneyFigure`.

B2 must remove raw sensitive monetary strings from unmasked paths.

Audit at minimum:

- Today STS subtitle;
- Waterfall labels;
- Money debt due text;
- Goals contribution text;
- Patterns metrics/descriptions when amount-bearing;
- Cash-flow chart labels;
- Health explanations/factors;
- scenario result copy;
- exports/report preview;
- any account/debt/IOU amounts.

Create reusable privacy-aware formatters/components rather than scattered conditionals.

When masked:
- visible amounts are hidden;
- accessible labels must not leak the amount either.

---

# 13. SEARCH — EXPAND TO PRODUCT-WIDE LOCAL SEARCH

Current search covers transactions only.

B2 search must include:

- transactions;
- merchants;
- categories;
- notes;
- accounts;
- people/IOUs;
- debts;
- goals;
- wants.

Group results by type.

Selecting a result should navigate or reveal the relevant product surface.

---

# 14. EXPORTS / REPORTS — EXPAND HONESTLY

Implement local generation from current runtime state:

- transactions CSV;
- income CSV;
- expense CSV;
- account balances CSV;
- debt register CSV;
- IOU register CSV;
- goal progress CSV;
- JSON snapshot.

Add polished print views for:
- monthly summary;
- debt report;
- IOU report;
- goal summary.

Generic `window.print()` is acceptable as the printing mechanism, but the content being printed must be an intentional report surface rather than whatever screen happens to be visible.

Revoke generated object URLs after download.

---

# 15. ADAPTIVE LAYOUT

Current expanded layout is mostly a wider centered phone column.

B2 must introduce intentional expanded behavior.

Compact:
- fixed bottom navigation;
- one-column.

Expanded:
- navigation rail/sidebar;
- content may use two-column/two-pane where useful;
- no bottom-navigation duplication if rail is active.

Do not stretch every card to desktop width.

---

# 16. ACCESSIBILITY — FIX USER ZOOM

Remove:

```html
maximum-scale=1.0
user-scalable=no
```

from the viewport.

Do not block browser zoom.

Also:
- add explicit aria-labels to icon-only controls;
- preserve focus visibility;
- do not leak masked money through aria-label/title.

---

# 17. TODAY / PRODUCT COMPLETENESS

Add the currently absent or weak operational pieces where they fit naturally:

- "Up Next" before-payday timeline;
- one goal nudge on Today;
- prototype-time evening check-in;
- subscription review signal where evidence supports it.

Do not add random features outside PRD.

---

# 18. REPORT TRUTHFULNESS

The B1 report claimed:

```text
DEFERRED / INCOMPLETE ITEMS: NONE
```

This was false.

B2 report must explicitly distinguish:

```text
IMPLEMENTED
PARTIAL
DEFERRED
SIMULATED
NOT_EXECUTED
```

Do not use "complete" or "fully implemented" unless source actually supports it.

---

# 19. TEST POLICY — STILL FROZEN

Do NOT generate:
- unit tests;
- integration tests;
- E2E;
- browser automation;
- CI.

Use only enough build/preview sanity to leave the candidate loadable.

Forge independently reviews the exact Git candidate.

---

# 20. ACCEPTANCE CHECKLIST

Before returning B2:

```text
[ ] Vite rebaseline acknowledged; no framework migration
[ ] major URLs have real browser navigation state
[ ] onboarding exists
[ ] pattern metrics calculated from evidence
[ ] insufficient evidence handled honestly
[ ] transfer is balance-conserving
[ ] debt payment changes debt
[ ] IOU settlement changes IOU + account
[ ] Today In/Out/Net is actual prototype-day activity
[ ] Waterfall is persona-generic
[ ] health is persona-generic
[ ] Plan scenarios recompute values
[ ] Goal what-if recomputes values
[ ] privacy masks all sensitive visible amounts
[ ] search spans major product objects
[ ] exports include debt/IOU/accounts/goals
[ ] print views are intentional reports
[ ] expanded layout is intentional
[ ] user zoom is not disabled
[ ] authority docs remain untouched
[ ] backend/database/cloud remain NONE
[ ] no tests/CI generated
```

---

# 21. RETURN REPORT

Return exactly:

```text
KIRION FORGE — KIVRA
LOVABLE B2 REWORK REPORT

SOURCE CANDIDATE
PLATFORM REBASELINE
FILES CREATED
FILES MODIFIED
FILES DELETED

ROUTING
ONBOARDING
PATTERN ENGINE
QUICK ADD SEMANTICS
TODAY METRICS
SAFE-TO-SPEND
HEALTH
PLAN WHAT-IF
GOALS WHAT-IF
PRIVACY
SEARCH
EXPORTS / REPORTS
ADAPTIVE LAYOUT
ACCESSIBILITY

KNOWN LIMITATIONS
DEFERRED ITEMS
SIMULATED ITEMS

TESTS
NOT_EXECUTED — BY KIRION FORGE AUTHORITY

BUILD / PREVIEW SANITY
AUTHORITY FILES MODIFIED
expected NONE

BACKEND / DATABASE / CLOUD
expected NONE

CANDIDATE GIT COMMIT SHA

DISPOSITION
READY FOR KIRION FORGE RE-REVIEW
or
BLOCKED
```

Then STOP.

Do not self-review.
Do not self-accept.
