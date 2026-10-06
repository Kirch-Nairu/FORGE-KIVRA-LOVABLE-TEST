# KIRION FORGE — CLAUDE STAGING

## Purpose

Claude is staged as the **next external worker** after Lovable.

Claude is not authorized to touch the current Lovable lane yet.

This branch exists so the next worker can be bootstrapped without interfering with Lovable's active implementation branch.

## Current sequencing

```text
Lovable B2
→ KIRION Forge review
→ if ACCEPT: preserve candidate
→ if PARTIAL/REWORK: GPT/Forge may perform exact repair
→ then Claude bootstrap against the resulting exact accepted candidate
```

Claude should not inherit stale assumptions from the branch point.

At activation time, Claude must first verify:

- latest main SHA;
- latest issue #1 Forge checkpoint;
- current accepted/rejected candidate;
- any GPT repair commit;
- current architecture rebaseline.

## Claude's intended role

Claude is primarily staged for:

- independent architecture/source review;
- bounded repair;
- product/UX refinement;
- exact implementation passes;
- forensic comparison against previous AI workers.

Claude is not the authority plane.

KIRION Forge remains the authority plane.

## Required read order when activated

1. `CLAUDE.md`
2. latest issue #1 checkpoint
3. `docs/authority/KIVRA_PRODUCT_AUTHORITY.md`
4. `docs/authority/KIVRA_UIUX_AUTHORITY.md`
5. `docs/authority/LOVABLE_PLATFORM_OVERLAY.md`
6. `docs/forge/DATA_CONTRACT.md`
7. `docs/forge/SCREEN_CONTRACTS.md`
8. current implementation source
9. exact current Claude handoff

Do not begin implementation until an exact handoff exists.
