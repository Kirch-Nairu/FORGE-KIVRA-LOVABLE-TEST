# KIRION FORGE — START HERE

## Experiment C — Lovable

The purpose of this experiment is to measure whether a **heavily pre-governed Lovable worker** can produce an unusually polished, coherent, highly interactive Kivra frontend in a minimal number of build-credit-consuming passes.

We optimize simultaneously for:

```text
STRICT PRODUCT / ARCHITECTURE GOVERNANCE
+
MINIMUM LOVABLE BUILD-CREDIT WASTE
```

Lovable must not discover the product while building it.

Forge GPT has already supplied:
- product authority;
- platform adaptation;
- UI/UX authority;
- route/screen contracts;
- file structure;
- data/calculation contract;
- worker scope;
- acceptance criteria.

Lovable's role is implementation, not product invention.

## Execution model

### R0 — read-only ingestion

Use Lovable Chat/Plan/read-only mode.

Lovable reads the repository and returns an authority digest **without modifying files**.

Required read order:
1. `/LOVABLE.md`
2. `/docs/authority/KIVRA_PRODUCT_AUTHORITY.md`
3. `/docs/authority/LOVABLE_PLATFORM_OVERLAY.md`
4. `/docs/authority/KIVRA_UIUX_AUTHORITY.md`
5. `/docs/forge/FILE_STRUCTURE.md`
6. `/docs/forge/DATA_CONTRACT.md`
7. `/docs/forge/SCREEN_CONTRACTS.md`
8. `/docs/forge/LOVABLE_ONE_SHOT_HANDOFF.md`

Attach the full KIVRA PRD in Lovable during R0 so product detail is available read-only.

### B1 — one primary Build pass

Only after the R0 digest is correct.

Lovable initializes its supported current template and implements the candidate in one bounded run.

### F1 — external Forge review

Do not ask Lovable for a broad self-review pass.

KIRION Forge reads the resulting GitHub repository and returns:
- ACCEPT;
- bounded REWORK;
- FAIL.

### B2 — bounded repair only if necessary

If Forge finds defects, send only the exact defect list back to Lovable.

No broad redesign prompt.

## Deliberately skipped in Lovable

- unit tests;
- integration tests;
- browser automation;
- E2E;
- CI;
- security scan loops;
- backend verification;
- deployment engineering.

A final compile/preview sanity check is permitted only to leave the application loadable.

## Stop conditions

Lovable must stop rather than:
- enabling Lovable Cloud DB;
- enabling hosted auth;
- adding Supabase/Firebase;
- adding React Native/Expo;
- adding payment or bank APIs;
- inventing product semantics;
- creating a sixth primary tab;
- replacing deterministic Kivra data with generic lorem-finance data.
