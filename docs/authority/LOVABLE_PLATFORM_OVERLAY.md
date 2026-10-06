# KIRION FORGE — KIVRA LOVABLE PLATFORM OVERLAY

## Purpose

The upstream PRD was originally written for native Android. This document changes only platform-specific implementation details for the Lovable experiment.

Product semantics, information architecture, calculations, financial distinctions, and user journeys remain unchanged.

## Supported target

Use Lovable's current supported web stack:

- TanStack Start;
- React;
- TypeScript;
- Lovable's normal styling/component tooling;
- mobile-first responsive behavior.

Do **not** use React Native, Expo, Flutter, Kotlin, Compose, or Capacitor in this experiment.

For this benchmark, using a platform-native web stack is more important than forcing native Android technology into a web builder.

## Backend and data override

```text
BACKEND = NONE
DATABASE = NONE
AUTH = NONE
REMOTE API = NONE
CLOUD DATA = NONE
```

Use deterministic typed fixtures under `src/data/demo/`.

Runtime edits exist only in client application state.

A browser reload may restore the selected persona's seed state.

Optional browser persistence is allowed only for:
- theme;
- privacy-mask preference;
- density;
- selected demo persona.

Do not persist the complete financial domain as a fake database.

## State

Preferred:
- lightweight local store only if needed;
- selectors for derived state;
- pure finance functions;
- injected prototype clock;
- deterministic persona fixtures.

Do not use server-query abstractions for fake server data.

Do not invent network loading delays.

## Export

Generate locally from current runtime state:
- CSV;
- JSON;
- printable report view.

Direct PDF generation is optional if trivial. Do not add a large dependency solely to satisfy prototype PDF generation.

## Android positioning

The candidate is a mobile-first web reference build.

It should feel excellent at Android phone widths and may be installable as a PWA if the current Lovable stack supports it naturally.

It must not claim to be a native Android binary.

## SSR

TanStack Start may server-render. Browser-only APIs must be guarded.

Server rendering does not make this a server-backed financial product. Financial state remains local/demo only.

## Production non-claims

Never claim:
- synced financial accounts;
- secure aggregation;
- real login;
- real payments;
- encrypted financial storage;
- production backup;
- professional financial advice.
