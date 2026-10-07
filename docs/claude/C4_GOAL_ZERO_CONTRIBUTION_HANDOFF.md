# KIRION FORGE — KIVRA
# CLAUDE C4 BOUNDED CODE-WRITER HANDOFF
# GOAL WHAT-IF ZERO-CONTRIBUTION TRUTHFULNESS

## STATUS

C3 bounded IOU status integrity repair is accepted.

C4 is the next Haiku 4.5 / Effort Off CODE_WRITER benchmark.

This pass targets a financial simulation truthfulness defect across:

```text
domain calculation
+
result type
+
Goals UI rendering
```

Do not reopen C1-C3.

Do not redesign Goals.

---

# SOURCE IDENTITY

Repository:

```text
Kirch-Nairu/FORGE-KIVRA-LOVABLE-TEST
```

Accepted C3 source candidate:

```text
e6c54482d72abbcd667fad7c8be6dc59aa1b5514
```

C4 branch:

```text
forge/claude-c4-goal-zero-contribution
```

---

# AUTHORIZED C4 DEFECT

Current `evaluateGoalWhatIf()` in:

```text
src/domain/finance/scenarios.ts
```

forces both monthly contribution values to at least:

```text
10000 centavos = ₱100/month
```

Current code:

```ts
const curMonthly = Math.max(10000, baseMonthlyCentavos);
const newMonthly = Math.max(10000, baseMonthlyCentavos + deltaMonthlyCentavos);
```

This fabricates a contribution that may not exist.

If a user has:

```text
baseMonthlyCentavos = 0
remaining goal > 0
```

Kivra currently invents ₱100/month and produces a completion date.

That violates Kivra's no-fabricated-financial-claims rule.

A second related defect exists in completion-date generation:

```ts
const d1 = new Date(currentDate);
d1.setMonth(...)
...
d1.toISOString().split('T')[0]
```

This uses host-local month mutation and a UTC output date instead of the established Manila calendar authority.

---

# OWNED FILES

```text
src/domain/finance/scenarios.ts
src/features/goals/GoalsView.tsx
```

You may import existing date authority from:

```text
src/domain/clock.ts
```

Do not modify clock.ts unless absolutely required.

Do not add dependencies.

Do not change fixtures.

---

# REQUIRED RESULT SEMANTICS

Update `GoalWhatIfResult` so an unreachable projection can be represented truthfully.

Use:

```ts
monthsToTargetCurrent: number | null
monthsToTargetNew: number | null
monthsSaved: number | null
completionDateCurrent: string | null
completionDateNew: string | null
```

Keep:

```text
currentMonthlyPesos
newMonthlyPesos
```

as numbers.

---

# CONTRIBUTION RULES

## Rule A — no magic floor

Do not impose a minimum monthly contribution.

Use the actual values:

```text
current monthly = max(0, baseMonthlyCentavos)
new monthly = max(0, baseMonthlyCentavos + deltaMonthlyCentavos)
```

## Rule B — target already achieved

If:

```text
remainingCentavos === 0
```

then both projections are reachable immediately:

```text
monthsToTargetCurrent = 0
monthsToTargetNew = 0
completionDateCurrent = current Manila date
completionDateNew = current Manila date
monthsSaved = 0
```

## Rule C — remaining > 0 and monthly contribution = 0

That projection is not reachable from scheduled monthly contributions.

Represent it as:

```text
monthsToTarget... = null
completionDate... = null
```

Do NOT invent a completion date.

## Rule D — positive contribution

For:

```text
remaining > 0
monthly > 0
```

months:

```text
ceil(remaining / monthly)
```

## Rule E — monthsSaved

Only calculate numeric `monthsSaved` when BOTH baseline and new projections are reachable.

If either projection is unreachable:

```text
monthsSaved = null
```

Do not claim "X months saved" against an infinite/unprojected baseline.

---

# MANILA DATE AUTHORITY

Completion dates must be deterministic and based on the current Manila calendar date.

Do not use:

```text
host-local setMonth()
+
toISOString().split('T')[0]
```

You may use the established:

```text
getManilaDateKey(currentDate)
```

as the source calendar date.

For month arithmetic, use deterministic calendar math that does not depend on the host timezone.

No external date library.

For a day that does not exist in the destination month, clamp to the destination month's last valid day.

Example:

```text
2026-01-31 + 1 month
=> 2026-02-28
```

---

# REQUIRED GOALS UI BEHAVIOR

Update `src/features/goals/GoalsView.tsx` so null projections render truthfully.

Required copy:

If baseline months/date are null:

```text
Base Pace: Not projected
```

If accelerated months/date are null:

```text
Accelerated Pace: Not projected
```

If `monthsSaved === null`:

```text
Time Saved: Not comparable
```

Do not show:

```text
null months
undefined
NaN
fake completion date
```

If projections are numeric, preserve the existing style/copy structure as much as possible.

---

# REQUIRED CASE REASONING

Use current Manila date:

```text
2026-10-07
```

## Case 1 — zero baseline, positive extra

```text
current = ₱0
target = ₱12,000
base monthly = ₱0
extra monthly = ₱1,000
```

Expected:

```text
baseline months = null
baseline completion = null
new months = 12
new completion = 2027-10-07
monthsSaved = null
```

## Case 2 — zero baseline, zero extra

```text
current = ₱0
target = ₱12,000
base monthly = ₱0
extra monthly = ₱0
```

Expected:

```text
baseline months = null
new months = null
both completion dates = null
monthsSaved = null
```

## Case 3 — normal reachable comparison

```text
current = ₱12,000
target = ₱36,000
remaining = ₱24,000
base monthly = ₱2,000
extra monthly = ₱1,000
```

Expected:

```text
baseline months = 12
new months = 8
monthsSaved = 4
baseline completion = 2027-10-07
new completion = 2027-06-07
```

## Case 4 — already achieved

```text
current = ₱36,000
target = ₱36,000
base monthly = ₱0
extra monthly = ₱0
```

Expected:

```text
baseline months = 0
new months = 0
monthsSaved = 0
both completion dates = 2026-10-07
```

## Case 5 — month-end clamp

Calendar helper check:

```text
2026-01-31 + 1 month
=> 2026-02-28
```

---

# FINANCIAL TRUTHFULNESS INVARIANTS

Preserve:

```text
goal simulation != actual contribution
scenario != mutation
zero scheduled contribution != ₱100/month
unreachable projection != fabricated completion date
```

Do not mutate profile state from this calculator.

---

# TOKEN / USAGE DIRECTIVE

This remains a lower-tier benchmark.

Read only:

```text
src/domain/finance/scenarios.ts
src/features/goals/GoalsView.tsx
src/domain/clock.ts
```

unless a direct type dependency requires more.

Do not re-review Kivra.

Do not write an architecture essay.

Implement the bounded repair.

---

# VALIDATION POLICY

Do not add tests.

If direct Git mutation is unavailable, return an exact unified diff.

If existing build/typecheck can run without mutation, report it.

Otherwise:

```text
BUILD: NOT_EXECUTED
TYPECHECK: NOT_EXECUTED
```

Do not fabricate runtime evidence.

---

# OUTPUT MODE

If browser Claude cannot modify Git:

return an exact unified diff against:

```text
e6c54482d72abbcd667fad7c8be6dc59aa1b5514
```

Only:

```text
src/domain/finance/scenarios.ts
src/features/goals/GoalsView.tsx
```

No pseudocode.

Forge will apply it mechanically.

---

# REQUIRED C4 REPORT

Return exactly:

```text
KIRION FORGE — KIVRA
CLAUDE C4 GOAL PROJECTION TRUTHFULNESS REPORT

1. SOURCE CANDIDATE
2. DEFECT
3. FILES CHANGED
4. IMPLEMENTATION APPROACH
5. PATCH

6. CASE 1 CHECK
7. CASE 2 CHECK
8. CASE 3 CHECK
9. CASE 4 CHECK
10. CASE 5 CHECK

11. FINANCIAL TRUTHFULNESS PRESERVED
12. BUILD
13. TYPECHECK
14. GIT MUTATION
15. LIMITATIONS
16. DISPOSITION
```

Disposition:

```text
READY FOR FORGE PATCH APPLICATION
```

or

```text
BLOCKED
```

Then STOP.

Do not begin C5.
Do not self-review the whole product.
Do not self-accept.
