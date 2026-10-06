# KIRION FORGE — KIVRA
# CLAUDE C0 FORENSIC INTAKE HANDOFF AFTER LOVABLE B2 + GPT REPAIR

## AUTHORITY

You are Claude acting as an external KIRION Forge reviewer/worker.

This turn is **READ-ONLY FORENSIC INTAKE ONLY**.

No code mutation is authorized.

No product redesign is authorized.

No framework migration is authorized.

No tests are required unless you already have an execution environment and can run an existing command without modifying the repository.

---

# EXACT SOURCE IDENTITY

Repository:

```text
Kirch-Nairu/FORGE-KIVRA-LOVABLE-TEST
```

Lovable B2 source candidate:

```text
d17a47d4a24bf6ebd0e5b1315da931818d25dbb9
```

GPT/Forge repair candidate:

```text
4b5cb783a4dfcdf182a85936d6423e8b002b742d
```

The GPT repair is:

```text
32 commits ahead
0 behind
relative to Lovable B2
```

Claude staging branch:

```text
forge/claude-c0-after-gpt-repair
```

Claude staging head after adding only Claude bootstrap documentation:

```text
382455b3e049e8d69bd0511e02391870c7f1b95d
```

The implementation candidate is the source tree inherited from:

```text
4b5cb783a4dfcdf182a85936d6423e8b002b742d
```

The commits after it on the Claude branch add only `CLAUDE.md` and `docs/claude/**` staging documents.

---

# CURRENT ARCHITECTURE — FROZEN FOR C0

```text
React 18
TypeScript
Vite 5
Tailwind CSS
client-only deterministic reference data
in-memory runtime state
pure financial/domain calculations
NO backend
NO database
NO auth provider
NO cloud data
NO remote financial API
```

React + TypeScript + Vite has been deliberately rebaselined for Experiment C.

Do not reopen TanStack Start migration during C0.

---

# PRODUCT INVARIANTS

Preserve and independently verify:

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

Primary navigation:

```text
Today
Plan
Money
Goals
Patterns
```

Global:

```text
Quick Add
Search
You
Privacy mask
```

---

# GPT REPAIR CLAIM SET TO VERIFY

Do not accept these claims merely because Forge GPT wrote them.

Inspect the source independently.

### Mutation safety

Verify that application/domain mutation logic rejects:

- expense overdraft;
- transfer without valid destination;
- same-account transfer;
- transfer overdraft;
- unknown debt;
- debt overpayment;
- debt-payment overdraft;
- unknown/settled IOU;
- IOU over-settlement;
- outgoing IOU overdraft.

Verify valid mutations conserve the intended financial semantics.

### STS

Verify due `i_owe` IOU obligations inside the next-income horizon are deducted from Safe-to-Spend.

Verify Mika's canonical golden vector remains:

```text
STS total ₱651
STS daily ≈ ₱81
8 days
Tight
```

### Today

Verify the evening Quick Add control opens the global Quick Add interaction rather than routing to an invalid path.

### Patterns

Verify UI insights derive from current transaction/commitment/IOU evidence.

Verify suggested peso savings are derived rather than disconnected magic constants where presented as observed savings.

### Scenarios

Verify discretionary-habit reductions do not reduce the essential daily survival run-rate.

Verify extra debt payment does not double-count the same current minimum obligation.

Verify scenario copy is honest about model assumptions.

### Onboarding

Verify close-ended answers materially shape the generated custom profile.

Verify custom users receive a distinct custom identity.

Verify money locations, emergency buffer, commitments, support, debt, IOU, habits/triggers and goal information actually flow into runtime profile state.

### Privacy

Verify sensitive visible peso amounts are masked across:

- Today;
- Waterfall;
- Money;
- Goals;
- Patterns;
- Health;
- Cash Flow;
- Plan scenarios;
- Quick Add;
- print/report views.

Also inspect accessibility labels for leakage.

### Search

Verify results are actionable and navigate to relevant product surfaces.

### Export

Verify CSV serialization handles quotes, commas and line breaks safely.

Verify exports remain local.

### Network posture

Verify the Google Fonts external request was removed and no other application-required remote service was introduced.

### Prototype clock

Verify want→goal promotion uses the injected prototype clock.

### Cash flow / health

Verify projection uses spendable cash rather than protected savings and models due outgoing IOUs.

Verify financial health emergency-buffer logic uses protected/non-spendable money rather than arbitrary digital-bank classification.

---

# VALIDATION STATUS BEFORE CLAUDE

Do not inherit Lovable's previous build PASS.

The GPT repair changed the exact candidate.

Current evidence state:

```text
SOURCE INSPECTION: OBSERVED
TYPECHECK: NOT_EXECUTED
BUILD: NOT_EXECUTED
RUNTIME: NOT_EXECUTED
TESTS: NOT_EXECUTED
```

If Claude's environment can run the existing build **without modifying the repository**, it may report that command as additional evidence.

Do not create tests during C0.

---

# REQUIRED C0 RETURN

Return exactly:

```text
KIRION FORGE — KIVRA
CLAUDE C0 FORENSIC INTAKE REPORT

1. SOURCE SHA
2. CLAUDE BRANCH HEAD
3. ARCHITECTURE
4. PRODUCT INVARIANTS

5. GPT REPAIR CLAIMS VERIFIED
6. GPT REPAIR CLAIMS CONTRADICTED
7. REMAINING CRITICAL DEFECTS
8. REMAINING HIGH DEFECTS
9. REMAINING MEDIUM / UX DEFECTS

10. PRIVACY BOUNDARY
11. FINANCIAL SEMANTIC INTEGRITY
12. SAFE-TO-SPEND
13. PATTERN EVIDENCE
14. QUICK ADD
15. ONBOARDING
16. SCENARIOS
17. SEARCH
18. EXPORTS
19. NETWORK / STATIC POSTURE
20. ACCESSIBILITY / ADAPTIVE NOTES

21. BUILD / TYPECHECK
    TESTED / NOT_EXECUTED / BLOCKED
    exact evidence

22. FILES MUTATED
    expected NONE

23. RECOMMENDED C1 SCOPE
    bounded exact defects only

24. DISPOSITION
    READY FOR C1 AUTHORIZATION
    or
    ACCEPTABLE WITHOUT C1
    or
    BLOCKED
```

Then STOP.

Do not mutate code.
Do not self-accept the product.
