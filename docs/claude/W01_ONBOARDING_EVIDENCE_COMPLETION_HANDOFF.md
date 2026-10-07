# KIRION FORGE — KIVRA
# HAIKU OPERATIONAL W01 HANDOFF
# COMPLETE ONBOARDING HABIT/TRIGGER EVIDENCE

## STATUS

Benchmark phase is closed.

This is real Kivra implementation work under the operational Haiku worker policy.

Worker:

```text
Claude Haiku 4.5
Effort Off
KIRION FORGE: CLAUDE CODE_WRITER
```

Do not treat this as another synthetic benchmark.

---

# SOURCE IDENTITY

Repository:

```text
Kirch-Nairu/FORGE-KIVRA-LOVABLE-TEST
```

Operational branch:

```text
forge/claude-operational-haiku
```

Accepted implementation source before this handoff:

```text
965ab9f6aff99032a11dd16f68eb804554da3823
```

Operational governance head before this W01 handoff:

```text
58305fed5ae071ca7cafb76ebb361fdaa2e1a3ef
```

The governance commit contains policy/docs only. The source implementation authority remains the accepted implementation candidate above.

---

# ACTUAL PRODUCT GAP

Guided onboarding currently presents these selectable frequent-purchase options:

```text
Coffee / Snacks
Delivery Apps
Gaming / Digital
Online Shopping
Weekend Social
```

and these spending-context options:

```text
Payday weekend surge
Late evening browsing
Stress-relief takeout
Team lunch advances
```

However `buildCustomProfile()` currently materializes evidence only for:

```text
Coffee / Snacks
Delivery Apps
Payday weekend surge
Late evening browsing
```

The following visible onboarding choices are currently accepted by the UI but ignored when the custom profile is built:

```text
Gaming / Digital
Online Shopping
Weekend Social
Stress-relief takeout
Team lunch advances
```

This is a real onboarding integrity defect.

A user-visible answer must not silently disappear.

---

# PRODUCT AUTHORITY

The purpose of the Habits & Triggers step is to tailor the generated local prototype profile with deterministic evidence.

The requirement is:

```text
selected onboarding habit/context
→ deterministic local transaction evidence
```

This does NOT mean every selection must produce a behavioral insight card.

Do not broaden the pattern engine in W01.

The source transactions themselves are the evidence.

---

# OWNED FILE

Primary and expected only implementation file:

```text
src/features/onboarding/OnboardingView.tsx
```

Do not modify:

- pattern engine;
- finance formulas;
- Safe-to-Spend;
- Quick Add;
- clock authority;
- routing;
- exports;
- demo persona fixtures;
- domain types;
- package/dependencies.

If another file appears necessary, STOP and report BLOCKED rather than broadening scope.

---

# REQUIRED IMPLEMENTATION

Extend `buildCustomProfile()` so every currently offered habit/context choice materially affects the generated custom profile.

Preserve all existing evidence generation.

Add deterministic transaction evidence for exactly the five currently ignored choices.

## 1. Gaming / Digital

When selected, add deterministic expense evidence with:

```text
category: Entertainment
merchant/note: clearly digital-game/app related
contextTag: gaming-digital
```

Use a daytime or early-evening timestamp so this selection alone does NOT accidentally fabricate the separate Late evening browsing pattern.

## 2. Online Shopping

When selected, add deterministic expense evidence with:

```text
category: Shopping
merchant/note: clearly online-shopping related
contextTag: online-shopping
```

Do not mark it late-night unless Late evening browsing is independently selected.

## 3. Weekend Social

When selected, add deterministic weekend expense evidence.

Use at least two transactions so the selected context is materially visible rather than represented by one arbitrary event.

Required:

```text
category: Dining or Entertainment
contextTag: weekend-social
```

Use Saturday/Sunday Manila timestamps.

Do not tag them as post-payday or late-night.

## 4. Stress-relief takeout

When selected, add deterministic takeout expense evidence.

Use at least two transactions.

Required:

```text
category: Food & Drink
contextTag: stress-takeout
```

Use non-Friday timestamps so this selection alone does NOT fabricate the separate Friday-delivery pattern.

Do not mark them late-night unless Late evening browsing is independently selected.

## 5. Team lunch advances

When selected, add deterministic transaction evidence for paying a team lunch at checkout.

Required:

```text
category: Food & Drink
contextTag: team-lunch-advance
```

Important financial invariant:

```text
do NOT create an IOU automatically
do NOT create expected repayment
do NOT create income
```

The onboarding flow has a separate explicit IOU question.

A generic "Team lunch advances" context is not enough authority to fabricate a receivable or guaranteed repayment.

Use note/copy that makes this clear if useful.

---

# DETERMINISTIC EVIDENCE RULES

All seeded evidence must:

- use fixed prototype timestamps;
- use fixed centavo amounts;
- use the first generated spendable account, consistent with existing onboarding seeds;
- use unique stable IDs;
- be ordinary expense transactions;
- appear only when the corresponding option is selected;
- disappear when that option is not selected;
- avoid creating unintended evidence for other onboarding choices.

Do not use wall-clock time.

Do not use randomness.

Do not use `Date.now()`.

---

# NON-INTERFERENCE REQUIREMENTS

Existing choices must continue working exactly as before:

```text
Coffee / Snacks
Delivery Apps
Payday weekend surge
Late evening browsing
```

Do not change their current transaction IDs, timestamps, amounts, categories, or context tags unless required to resolve a direct collision.

Default onboarding selections must therefore preserve existing generated behavior.

No new behavior should appear for unselected options.

---

# REQUIRED NEGATIVE CASES

Before returning, reason through these exact cases.

## Case A

Selected:

```text
Gaming / Digital
```

Not selected:

```text
Late evening browsing
```

Expected:

- gaming transaction exists;
- no new late-night transaction is created by the gaming seed;
- gaming seed timestamp is outside the late-evening threshold.

## Case B

Selected:

```text
Stress-relief takeout
```

Not selected:

```text
Delivery Apps
```

Expected:

- stress-takeout evidence exists;
- its timestamps are non-Friday;
- it does not carry `friday-delivery` context.

## Case C

Selected:

```text
Team lunch advances
```

IOU choice:

```text
None
```

Expected:

- team-lunch transaction evidence exists;
- custom profile IOU array remains empty;
- no income/receivable is fabricated.

## Case D

None of the five new options selected.

Expected:

- none of the new W01 transaction IDs exist;
- existing onboarding evidence generation remains unchanged.

## Case E

All five new options selected.

Expected:

- each selection contributes its own deterministic evidence;
- all generated transaction IDs remain unique;
- no financial entity other than transactions is created because of these five selections.

---

# PRIVACY / FINANCIAL INVARIANTS

Preserve:

```text
transaction evidence != behavioral diagnosis
team lunch context != guaranteed receivable
spending context != IOU unless explicitly declared
ordinary expense != debt
ordinary expense != transfer
ordinary expense != income
```

Do not create claims unsupported by the user's onboarding answers.

---

# TOKEN / USAGE DIRECTIVE

This is normal operational work.

Read only:

```text
docs/claude/HAIKU_OPERATIONAL_WORKER_DIRECTIVE.md
src/features/onboarding/OnboardingView.tsx
```

and a directly required type definition only if necessary.

Do not re-review the whole repository.

Do not re-derive architecture.

Implement the bounded delta.

---

# VALIDATION POLICY

Do not add tests in W01.

If direct build/typecheck execution is unavailable:

```text
BUILD: NOT_EXECUTED
TYPECHECK: NOT_EXECUTED
```

Do not fabricate execution evidence.

Source reasoning is OBSERVED/CALCULATED, not TESTED.

---

# OUTPUT MODE

If browser Claude cannot mutate Git, return an exact unified diff.

The diff must apply to the exact accepted implementation source:

```text
965ab9f6aff99032a11dd16f68eb804554da3823
```

The expected source file is only:

```text
src/features/onboarding/OnboardingView.tsx
```

No pseudocode.

KIRION Forge will apply the patch mechanically.

---

# REQUIRED REPORT

Return exactly:

```text
KIRION FORGE — KIVRA
HAIKU OPERATIONAL W01 REPORT

1. SOURCE CANDIDATE
2. PRODUCT GAP
3. FILES CHANGED
4. IMPLEMENTATION APPROACH
5. PATCH

6. GAMING / DIGITAL CHECK
7. ONLINE SHOPPING CHECK
8. WEEKEND SOCIAL CHECK
9. STRESS-RELIEF TAKEOUT CHECK
10. TEAM LUNCH ADVANCES CHECK
11. UNSELECTED-OPTION CHECK
12. EXISTING-SEED NON-INTERFERENCE

13. FINANCIAL INVARIANTS
14. BUILD
15. TYPECHECK
16. GIT MUTATION
17. LIMITATIONS
18. DISPOSITION
```

Disposition must be one of:

```text
READY FOR FORGE PATCH APPLICATION
BLOCKED
```

Then STOP.

Do not begin W02.
Do not self-accept.
Forge owns review and acceptance.
