# KIRION FORGE — KIVRA
# CLAUDE C3 BOUNDED CODE-WRITER HANDOFF
# PARTIAL IOU SETTLEMENT STATUS INTEGRITY

## STATUS

C2 bounded Manila date authority repair is accepted.

C3 is the next lower-tier CODE_WRITER benchmark.

This pass is intentionally about a real financial state transition across multiple entities:

```text
account balance
+
IOU balance/status
+
transaction history
```

Do not reopen C1/C2.

Do not broaden into general IOU redesign.

---

# SOURCE IDENTITY

Repository:

```text
Kirch-Nairu/FORGE-KIVRA-LOVABLE-TEST
```

Accepted C2 source candidate:

```text
4c389d6259c498af81bc7f361e37a19a4c44297a
```

C3 branch:

```text
forge/claude-c3-iou-partial-status
```

---

# AUTHORIZED C3 DEFECT

Current IOU settlement behavior in:

```text
src/state/kivraStore.ts
```

correctly adjusts:

- account cash;
- IOU remaining amount;
- settlement transaction;
- cash-flow direction.

However the status transition is semantically wrong for overdue IOUs.

Current behavior:

```ts
const remaining = i.amountCentavos - mut.amountCentavos;

return {
  ...i,
  amountCentavos: remaining,
  status: remaining === 0 ? 'settled' : 'partially_paid',
};
```

This means every partial payment rewrites the status to:

```text
partially_paid
```

even when the remaining IOU is still overdue.

That destroys time-state truth.

---

# CONCRETE EXISTING EXAMPLE

Mika has:

```text
Bea (Colleague)
direction: owed_to_me
remaining: ₱850
dueDate: 2026-10-05
status: overdue

prototype date:
2026-10-07 Asia/Manila
```

If Bea pays only ₱100:

Correct resulting state:

```text
account cash: +₱100
IOU remaining: ₱750
IOU status: overdue
transaction: incoming IOU settlement
```

Current implementation instead produces:

```text
IOU status: partially_paid
```

which incorrectly erases the overdue condition.

---

# REQUIRED C3 REPAIR

Primary owned file:

```text
src/state/kivraStore.ts
```

You may use the already-established Manila date authority from:

```text
src/domain/clock.ts
```

Do not create another timezone/date framework.

Do not add dependencies.

Do not modify fixtures.

Do not modify UI.

Do not modify IOU types unless absolutely required.

---

# REQUIRED STATUS TRANSITION RULE

For an IOU settlement:

## Rule A — fully settled

If:

```text
remaining === 0
```

then:

```text
status = settled
```

regardless of previous due state.

## Rule B — partial and overdue by date

If:

```text
remaining > 0
AND
dueDate exists
AND
dueDate < current Manila prototype date
```

then:

```text
status = overdue
```

## Rule C — partial and not overdue

If:

```text
remaining > 0
AND
dueDate is today/future
```

then:

```text
status = partially_paid
```

## Rule D — no dueDate but already marked overdue

If:

```text
remaining > 0
AND
dueDate is absent
AND
existing status === overdue
```

preserve:

```text
status = overdue
```

Do not silently erase an authoritative overdue state when no date exists to recompute it.

Otherwise:

```text
status = partially_paid
```

---

# REQUIRED FINANCIAL INVARIANTS

Preserve all existing C1/C2 mutation rules.

A valid incoming IOU settlement must:

```text
increase selected account by amount
decrease IOU remaining amount by same amount
record one IOU settlement transaction
cashFlowDirection = in
preserve correct remaining IOU status
```

A valid outgoing IOU settlement must:

```text
decrease selected account by amount
decrease IOU remaining amount by same amount
record one IOU settlement transaction
cashFlowDirection = out
preserve correct remaining IOU status
```

Do not alter:

- over-settlement rejection;
- already-settled rejection;
- insufficient-funds rejection for outgoing IOUs;
- transfer semantics;
- debt semantics;
- expense/income semantics.

---

# REQUIRED CASE REASONING

Use prototype date:

```text
2026-10-07 Asia/Manila
```

## Case 1 — overdue receivable, partial payment

Before:

```text
dueDate = 2026-10-05
status = overdue
remaining = 85000
settlement = 10000
```

Expected:

```text
remaining = 75000
status = overdue
incoming account +10000
```

## Case 2 — overdue payable, partial payment

Before:

```text
direction = i_owe
dueDate = 2026-10-01
status = overdue
remaining = 50000
settlement = 10000
```

Expected:

```text
remaining = 40000
status = overdue
outgoing account -10000
```

## Case 3 — future-due IOU, partial payment

Before:

```text
dueDate = 2026-10-20
status = open
remaining = 50000
settlement = 10000
```

Expected:

```text
remaining = 40000
status = partially_paid
```

## Case 4 — full settlement of overdue IOU

Before:

```text
dueDate = 2026-10-05
status = overdue
remaining = 85000
settlement = 85000
```

Expected:

```text
remaining = 0
status = settled
```

## Case 5 — no due date, pre-existing overdue

Before:

```text
dueDate = undefined
status = overdue
remaining = 30000
settlement = 10000
```

Expected:

```text
remaining = 20000
status = overdue
```

---

# DESIGN EXPECTATION

Prefer one small helper or clearly bounded transition expression inside:

```text
src/state/kivraStore.ts
```

The status calculation should be explainable.

Use the current prototype Manila date authority.

Do not compare against wall-clock time.

Do not call:

```text
new Date()
```

to obtain "now".

The supplied prototype clock remains authoritative.

---

# TOKEN / USAGE DIRECTIVE

This remains a Haiku 4.5 / Effort Off benchmark.

Read only:

```text
src/state/kivraStore.ts
src/domain/clock.ts
src/domain/types.ts
```

unless a directly required dependency forces additional inspection.

Do not re-review Kivra.

Do not produce an architecture essay.

Implement the state transition.

---

# VALIDATION POLICY

Do not add tests.

If direct Git mutation is unavailable, return an exact unified diff.

If existing build/typecheck can be executed without mutation, report it.

Otherwise:

```text
BUILD: NOT_EXECUTED
TYPECHECK: NOT_EXECUTED
```

Do not fabricate runtime evidence.

Source reasoning is OBSERVED/CALCULATED, not TESTED.

---

# OUTPUT MODE

If browser Claude cannot modify Git:

return an exact unified diff against:

```text
4c389d6259c498af81bc7f361e37a19a4c44297a
```

Patch should modify only:

```text
src/state/kivraStore.ts
```

unless a tiny import adjustment from existing clock authority is required within that file.

No pseudocode.

Forge will apply the patch mechanically.

---

# REQUIRED C3 REPORT

Return exactly:

```text
KIRION FORGE — KIVRA
CLAUDE C3 IOU STATUS INTEGRITY REPORT

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

11. FINANCIAL INVARIANTS PRESERVED
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

Do not begin C4.
Do not self-review the whole product.
Do not self-accept.
