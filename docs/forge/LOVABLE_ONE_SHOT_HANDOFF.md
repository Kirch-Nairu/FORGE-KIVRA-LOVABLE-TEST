# KIRION FORGE — KIVRA
# LOVABLE ONE-SHOT CODE_WRITER HANDOFF

## Authority

You are the bounded UI CODE_WRITER for Experiment C.

The repository is already governed. Do not redesign the product or architecture.

Read all authority first, including the attached full KIVRA PRD.

## Objective

Produce one coherent, high-fidelity, mobile-first Kivra reference application using Lovable's current supported stack.

This is a frontend/product benchmark, not production infrastructure.

## Stack

Use:
- TanStack Start;
- React;
- TypeScript;
- the current Lovable styling/component setup.

Do not use React Native.

## Architecture

No backend.
No database.
No auth.
No Lovable Cloud data.
No remote APIs.

Use:
- deterministic typed demo fixtures;
- pure finance calculation modules;
- one lightweight client state layer;
- browser-generated exports;
- injected prototype clock.

Reload may restore deterministic seed state.

## Implementation breadth

Implement the complete product shell and major route families in `SCREEN_CONTRACTS.md`.

Prioritize polished, actually interactive primary journeys over decorative completeness.

### Must be deeply interactive

1. Onboarding / demo-persona entry.
2. Today.
3. Safe-to-Spend math.
4. Can-I-afford.
5. Quick Add.
6. Ledger.
7. Plan cash-flow/calendar.
8. Money accounts/debts/people.
9. Goals + what-if.
10. Patterns + evidence.
11. Search.
12. You / privacy / demo controls.
13. Reports/export surface.
14. Health indicators.

Secondary/detail routes should be functional surfaces using the same data model, not dead placeholders.

## Data

Use product authority and `DATA_CONTRACT.md`.

At default clock Mika must compute:

```text
₱651 total
≈ ₱81/day
8 days
Tight
```

Do not hard-code the displayed result independently of the finance engine.

Pattern cards must emerge from seeded transactions.

## Visual execution

Use `KIVRA_UIUX_AUTHORITY.md`.

Required:
- no gradients;
- no glassmorphism;
- no total-balance hero;
- no donut-dashboard;
- no generic SaaS card wall;
- no random marketing hero;
- normal spending is not red;
- lists/sections dominate operational screens;
- strong money alignment;
- hairline dividers;
- warm paper/pine identity;
- sparse purposeful motion.

## Mobile priority

Design first for ~390px Android-class phone, then expanded/tablet/desktop.

Compact uses bottom navigation.
Expanded can use navigation rail/sidebar.

## Onboarding

Use one controlled, branching step flow.

Provide:
- Start;
- Try a demo profile;
- Mika;
- Dan;
- Ysa.

Do not implement 34 unrelated page files.

## Quick Add

Amount first.

Modes:
- Expense;
- Income;
- Transfer;
- IOU;
- Debt payment.

## Exports

Implement:
- CSV from current state;
- JSON snapshot;
- polished printable monthly/debt/IOU report surfaces.

Direct client PDF generation is optional if trivial. Do not add a huge PDF package just for the benchmark.

## Simulation labels

Use:
- Simulated reminder;
- Simulated lock;
- Demo data;
- Prototype / Reference build.

Never fake bank sync or payment confirmation.

## Explicit test policy

Do not write:
- unit tests;
- integration tests;
- E2E;
- Playwright/Cypress;
- Vitest/Jest;
- CI workflows.

Do not spend Lovable credits on test generation.

Run only the minimum build/preview check required to leave the app loading without obvious compile errors.

Report all other testing as `NOT_EXECUTED`.

KIRION Forge will inspect the GitHub candidate externally.

## File ownership

Follow `FILE_STRUCTURE.md`.

Do not modify:
- product authority;
- platform overlay;
- UI/UX authority;
- Forge docs.

Implementation may create/modify source, package metadata, config, and public assets only as necessary.

## Completion report

Return:

```text
KIRION FORGE — KIVRA
LOVABLE BUILD REPORT

STACK
ROUTES IMPLEMENTED
PRIMARY JOURNEYS IMPLEMENTED
FILES CREATED
FILES MODIFIED
DEPENDENCIES ADDED
SIMULATED FEATURES
EXPORTS
RESPONSIVE STATES OBSERVED
KNOWN LIMITATIONS
TESTS: NOT_EXECUTED (by authority)
BUILD/PREVIEW STATUS
AUTHORITY FILES MODIFIED: expected NONE
BACKEND/CLOUD: expected NONE
DISPOSITION: READY FOR FORGE REVIEW | BLOCKED
```

Then STOP.

Do not self-review.
Do not launch a redesign pass.
Do not add features outside authority.
