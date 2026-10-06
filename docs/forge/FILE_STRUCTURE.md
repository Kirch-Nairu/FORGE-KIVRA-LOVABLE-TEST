# KIVRA — FROZEN FILE / FEATURE STRUCTURE

Lovable should initialize its current supported **TanStack Start + React + TypeScript** project and converge toward this structure.

Do not collapse the product into a single route/component.

```text
src/
├─ routes/
│  ├─ __root.*
│  ├─ index.*
│  ├─ onboarding.*
│  ├─ today.*
│  ├─ plan.*
│  ├─ money.*
│  ├─ goals.*
│  ├─ patterns.*
│  ├─ ledger.*
│  ├─ search.*
│  ├─ you.*
│  └─ health.*
├─ app/
│  ├─ AppShell.*
│  ├─ PrimaryNav.*
│  ├─ MobileTopBar.*
│  ├─ DesktopRail.*
│  └─ overlays/
├─ design-system/
│  ├─ tokens.*
│  ├─ typography.*
│  ├─ money.*
│  ├─ surfaces.*
│  ├─ motion.*
│  └─ charts.*
├─ components/
│  └─ kivra/
│     ├─ MoneyFigure.*
│     ├─ PrivacyAmount.*
│     ├─ StatusChip.*
│     ├─ SectionHeader.*
│     ├─ TransactionRow.*
│     ├─ AccountRow.*
│     ├─ ObligationRow.*
│     ├─ GoalRow.*
│     ├─ PersonRow.*
│     ├─ RunwayBar.*
│     ├─ Waterfall.*
│     ├─ CashFlowChart.*
│     ├─ HeatStrip.*
│     ├─ PaceBar.*
│     ├─ InsightCard.*
│     ├─ ScenarioPanel.*
│     ├─ QuickAddSheet.*
│     └─ EmptyState.*
├─ domain/
│  ├─ types.*
│  ├─ money.*
│  ├─ clock.*
│  └─ finance/
│     ├─ safeToSpend.*
│     ├─ affordability.*
│     ├─ cashFlow.*
│     ├─ goals.*
│     ├─ debt.*
│     ├─ health.*
│     └─ insights.*
├─ data/
│  └─ demo/
│     ├─ index.*
│     ├─ mika.*
│     ├─ dan.*
│     ├─ ysa.*
│     └─ seedHelpers.*
├─ state/
│  ├─ kivraStore.*
│  ├─ selectors.*
│  └─ demoActions.*
├─ features/
│  ├─ onboarding/
│  ├─ today/
│  ├─ quick-add/
│  ├─ ledger/
│  ├─ plan/
│  ├─ money/
│  ├─ goals/
│  ├─ patterns/
│  ├─ search/
│  ├─ you/
│  ├─ health/
│  └─ exports/
└─ lib/
   ├─ format/
   ├─ export/
   └─ accessibility/
```

## Ownership rules

- `domain/`: pure business definitions/calculations. No React/UI.
- `data/demo/`: deterministic persona fixtures.
- `state/`: mutable runtime reference state.
- `features/`: feature composition and interactions.
- `components/kivra/`: reusable Kivra components.
- `design-system/`: tokens and visual primitives.
- `routes/`: thin route coordination.
- `docs/`: read-only authority.

## File-size discipline

Avoid:
- giant App component;
- thousand-line route components;
- one giant data file;
- one all-purpose utils file;
- one God store/ViewModel;
- business calculations embedded in visual components.

Prefer feature-local components plus shared Kivra primitives.
