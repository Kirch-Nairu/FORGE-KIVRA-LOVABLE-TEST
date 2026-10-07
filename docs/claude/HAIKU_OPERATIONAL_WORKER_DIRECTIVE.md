# KIRION FORGE — KIVRA
# CLAUDE HAIKU OPERATIONAL WORKER DIRECTIVE

## STATUS

Benchmark phase is closed.

Haiku 4.5 is now the default bounded implementation worker for Kivra under KIRION Forge control.

This is an operational policy, not a new product handoff.

## SOURCE BASE

Operational branch:

```text
forge/claude-operational-haiku
```

Accepted implementation base at operationalization:

```text
965ab9f6aff99032a11dd16f68eb804554da3823
```

That SHA contains the accepted bounded C1.1, C2, C3, and C4 repairs.

## DEFAULT WORKER CONFIGURATION

```text
MODEL: Haiku 4.5
EFFORT: Off
ROLE: KIRION FORGE: CLAUDE CODE_WRITER
```

Haiku is the default for bounded implementation work when Forge has already defined:

- exact source candidate;
- exact owned files;
- exact defect or feature delta;
- architecture invariants;
- required negative cases;
- validation expectations;
- STOP condition.

## AUTHORITY MODEL

Haiku is not the product, architecture, merge, or acceptance authority.

Haiku may:

- read the exact handoff;
- inspect the exact bounded source;
- implement the authorized delta;
- return an exact patch when direct Git mutation is unavailable;
- report evidence honestly;
- stop at the handoff boundary.

KIRION Forge retains authority for:

- product intent;
- architecture;
- scope;
- candidate identity;
- patch application when required;
- independent review;
- acceptance or rework;
- escalation.

## DEFAULT EXECUTION LOOP

```text
Forge authority
  ->
exact Git handoff
  ->
Haiku 4.5 / Effort Off
  ->
bounded source delta
  ->
Forge mechanical application if needed
  ->
independent Forge review
  ->
ACCEPT / REWORK / ESCALATE
```

## FIX-FORWARD POLICY

First-pass imperfection is not automatic escalation.

If Haiku produces a bounded, repairable defect:

1. Forge records the exact defect.
2. Forge issues one small fix-forward handoff.
3. Haiku repairs against the exact current candidate.
4. Forge independently reviews again.

Do not discard a correct overall direction because of one bounded worker defect.

## ESCALATION POLICY

Escalate from Haiku only when at least one of these is true:

- authority is ambiguous or conflicting;
- architecture must be created or materially changed;
- the task requires broad product inference;
- subtle security/auth/cryptographic reasoning is central;
- the defect remains unresolved after a precise fix-forward attempt;
- the worker repeatedly violates scope or exact-candidate discipline;
- the worker cannot produce a mechanically applicable patch;
- independent Forge review finds reasoning risk too broad to bound safely.

Preferred escalation target:

```text
Sonnet 5.5
```

Escalation is controlled, not automatic.

## OBSERVED HAIKU PROFILE

Operational decision is based on the completed Kivra benchmark sequence:

```text
C0   forensic intake          -> useful; premature-closure weakness observed
C1   bounded repair           -> REWORK
C1.1 fix-forward              -> ACCEPT
C2   two-file date authority  -> FIRST-PASS ACCEPT
C3   IOU state transition     -> FIRST-PASS CODE ACCEPT
C4   nullable goal semantics
     + domain/UI propagation  -> FIRST-PASS ACCEPT
```

Observed strengths:

- fast bounded source inspection;
- strong scope obedience;
- exact-state recovery;
- good response to precise corrective feedback;
- increasingly reliable bounded implementation;
- low tendency to redesign outside authority.

Observed weakness:

- report/evidence prose can overstate certainty or contain small reasoning mistakes even when the code delta is correct.

Therefore:

```text
CODE OUTPUT: independently review
REPORT CLAIMS: never trust without verification
SELF-ACCEPTANCE: prohibited
```

## EVIDENCE DISCIPLINE

Source mutation invalidates inherited build/typecheck/runtime evidence.

For every new candidate, report separately:

```text
SOURCE: OBSERVED / NOT_OBSERVED
BUILD: TESTED / NOT_EXECUTED / FAILED
TYPECHECK: TESTED / NOT_EXECUTED / FAILED
RUNTIME: TESTED / NOT_EXECUTED / FAILED
TESTS: TESTED / NOT_EXECUTED / FAILED
```

Never inherit an old PASS across source mutation.

## OPERATIONAL INTENT

From this point forward, do not create synthetic defects merely to benchmark Haiku.

Use Haiku on real Kivra work when the task is suitable for bounded worker execution.

Benchmarking may resume only by explicit Forge/user authorization.

## STOP

This file defines worker operating policy only.

It does not authorize a new implementation delta.
