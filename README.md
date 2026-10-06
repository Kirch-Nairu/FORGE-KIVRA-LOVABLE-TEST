# KIVRA — Lovable Reference Experiment

**Product:** KIVRA — Personal Financial OS  
**Experiment:** KIRION Forge / Lovable static-reference benchmark  
**Target:** mobile-first web application for Android-class phone use  
**Worker:** Lovable as bounded UI CODE_WRITER  
**Production status:** prototype/reference only

## Start here

Lovable and every external worker must read, in order:

1. `LOVABLE.md`
2. `docs/forge/START_HERE.md`
3. `docs/authority/KIVRA_PRODUCT_AUTHORITY.md`
4. `docs/authority/LOVABLE_PLATFORM_OVERLAY.md`
5. `docs/authority/KIVRA_UIUX_AUTHORITY.md`
6. `docs/forge/FILE_STRUCTURE.md`
7. `docs/forge/DATA_CONTRACT.md`
8. `docs/forge/SCREEN_CONTRACTS.md`
9. `docs/forge/LOVABLE_ONE_SHOT_HANDOFF.md`

The complete Claude-authored KIVRA PRD remains upstream product authority and should be supplied to Lovable as a reference attachment when the project is created. The repository documents below translate that PRD into an implementation contract so Lovable does not need to reinvent product decisions while spending build credits.

## Architecture classification

This experiment deliberately uses **no backend and no database**.

The application uses deterministic typed demo fixtures and client-side runtime state. There is no Firebase, Supabase, Lovable Cloud database, hosted authentication, payment provider, bank API, or remote data authority.

## Credit policy

Lovable is not the test/review authority. Use read-only chat/plan work to ingest authority, then one bounded Build pass. Do not spend build credits generating test suites or repeatedly self-reviewing. KIRION Forge reviews the GitHub candidate externally.
