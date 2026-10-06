# KIRION FORGE — KIVRA
# LOVABLE R0 READ-ONLY AUTHORITY HANDOFF

## WORKER

Lovable

## MODE

READ-ONLY / CHAT / PLAN MODE ONLY

## PURPOSE

Consume the already-prepared KIVRA product and implementation authority without spending build credits on discovery or premature code generation.

This is deliberately optimized for a free / no-subscription Lovable usage profile.

Do not mutate files.

Do not initialize a project.

Do not enter Build mode.

Do not add integrations.

Do not connect Lovable Cloud.

---

# AUTHORITY ORDER

Read completely, in order:

1. `LOVABLE.md`
2. `docs/forge/START_HERE.md`
3. `docs/authority/KIVRA_PRODUCT_AUTHORITY.md`
4. `docs/authority/LOVABLE_PLATFORM_OVERLAY.md`
5. `docs/authority/KIVRA_UIUX_AUTHORITY.md`
6. `docs/forge/FILE_STRUCTURE.md`
7. `docs/forge/DATA_CONTRACT.md`
8. `docs/forge/SCREEN_CONTRACTS.md`
9. `docs/forge/CREDIT_EFFICIENCY.md`
10. `docs/forge/ACCEPTANCE.md`
11. `docs/forge/LOVABLE_ONE_SHOT_HANDOFF.md`

Also read the attached full KIVRA PRD.

Repository authority governs implementation.
The full PRD supplies detailed product behavior and UX requirements.

---

# FIXED PRODUCT IDENTITY

```text
KIVRA
Personal Financial OS
```

Kivra is not:
- a generic expense tracker;
- a bank clone;
- a crypto wallet;
- a SaaS dashboard;
- a marketing landing page.

Its product thesis is:

```text
What can I safely do with money today?
What is coming next?
What do I owe / what is owed to me?
What goals matter?
What spending behavior is actually visible in my own data?
```

---

# PRIMARY NAVIGATION — FROZEN

Exactly:

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

Do not propose a sixth primary tab.

---

# PLATFORM — FROZEN

Use Lovable's current supported web stack.

```text
TanStack Start
React
TypeScript
```

Do not propose:

```text
React Native
Expo
Flutter
Kotlin
Compose
Firebase
Supabase
Lovable Cloud database
hosted auth
remote API
payment API
bank API
AI API
```

This experiment is a mobile-first web reference build, not a native Android binary.

---

# DATA ARCHITECTURE — FROZEN

```text
deterministic typed demo fixtures
        ↓
local runtime state
        ↓
pure finance calculations
        ↓
UI
```

No database.

No backend.

No fake API layer.

A page reload may restore deterministic seed state.

Optional persistence is limited to harmless UI/demo preferences.

---

# CREDIT / TOKEN ECONOMY — FROZEN

This project is deliberately optimized to minimize Lovable build-credit use.

Lovable is NOT authorized to spend build credits on:

- product discovery;
- architecture discovery;
- test generation;
- CI;
- broad self-review;
- backend setup;
- deployment engineering;
- integration research;
- repeated visual redesign loops.

KIRION Forge already supplied those decisions.

The intended lifecycle is:

```text
R0 read-only ingestion
→ B1 one broad implementation pass
→ Forge independent GitHub review
→ B2 bounded repair only if required
```

Do not suggest unnecessary extra passes.

---

# REQUIRED R0 RETURN

Return exactly:

```text
KIRION FORGE — KIVRA
R0 AUTHORITY DIGEST

1. PRODUCT THESIS

2. FIVE PRIMARY DESTINATIONS

3. GLOBAL PRODUCT ACTIONS

4. SAFE-TO-SPEND CONTRACT
   - formula
   - Mika golden vector
   - explainability rule

5. FINANCIAL DOMAIN DISTINCTIONS
   - transfer != spending
   - debt principal repayment != ordinary spending
   - IOU repayment received != earned income
   - goal contribution != spending
   - reservation != spending
   - goal != want
   - formal debt != informal IOU

6. DEMO PERSONAS
   - Mika
   - Dan
   - Ysa

7. STATIC DATA ARCHITECTURE

8. TARGET LOVABLE STACK

9. FILE / FEATURE ARCHITECTURE

10. TODAY ABOVE-THE-FOLD HIERARCHY

11. UI/UX NORTH STAR

12. REQUIRED INTERACTIVE SURFACES

13. FORBIDDEN VISUAL PATTERNS

14. FORBIDDEN INFRASTRUCTURE

15. TEST POLICY

16. CREDIT-EFFICIENCY POLICY

17. AUTHORITY CONFLICTS / AMBIGUITIES
    expected NONE unless genuinely found

18. FILES MUTATED
    expected NONE

19. DISPOSITION
    READY FOR B1 ONE-SHOT BUILD
    or
    BLOCKED
```

---

# STOP CONDITION

After returning the R0 Authority Digest:

```text
STOP.
DO NOT BUILD.
WAIT FOR KIRION FORGE B1 AUTHORIZATION.
```
