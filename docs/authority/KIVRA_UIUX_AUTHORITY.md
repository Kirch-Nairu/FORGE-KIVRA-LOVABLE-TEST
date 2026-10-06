# KIRION FORGE — KIVRA UI/UX AUTHORITY

## North star

Kivra is a **calm financial instrument**, not a fintech advertisement.

```text
warm ledger paper
×
modern instrument panel
×
personal daily companion
```

The interface should feel serious enough for money, warm enough for day-to-day use, and fast enough to open repeatedly.

## Primary visual hierarchy

Kivra answers:

1. What can I safely do with money today?
2. What happens before my next confirmed income?
3. What is already committed/protected?
4. What do I owe and what is owed to me?
5. What goal is today's behavior moving?
6. What patterns does my own data actually support?

## Primary navigation

Exactly:
- Today
- Plan
- Money
- Goals
- Patterns

Global:
- Quick Add
- Search
- You
- privacy mask

No sixth primary destination.

## Color tokens

### Light
- paper `#F6F3EE`
- surface `#FFFFFF`
- surface-alt `#EFEBE4`
- ink `#1D2421`
- muted `#5C655F`
- hairline `#DAD4C9`
- pine `#1F5C4D`
- pine-soft `#D6E8E1`
- amber `#B7791F`
- brick `#A63D2F`
- slate `#3F5A73`
- goal `#6B4E9B`

### Dark
- paper `#121614`
- surface `#1A201D`
- surface-alt `#232B27`
- ink `#ECEAE4`
- muted `#A2ABA5`
- hairline `#333C37`
- pine `#7FC4AE`
- amber `#E0B25C`
- brick `#E08A7E`
- slate `#8BAAC7`
- goal `#B7A0DE`

No gradients.

Ordinary spending is not red. Brick is for shortfall/error/risk.

## Typography

- clean restrained sans;
- tabular numerals for money;
- hero finance figure around 36–40px on compact view;
- section title around 18–22px;
- body around 14–16px;
- no landing-page typography inside operational screens.

## Spacing

4px base:
`4 / 8 / 12 / 16 / 24 / 32`

Compact page padding: 16px.

Whitespace and hairline rules before unnecessary containers.

## Shape

- controls ~8px;
- contained cards ~12px;
- grouped surfaces ~16px;
- overlay/sheet ~24px.

Do not turn every row into a pill/card.

## Today acceptance

Above the fold on compact phone:
- date / privacy / search / You;
- Safe to spend today;
- hero ₱81;
- ₱651 until payday · 8 days;
- runway / Tight;
- Show the math;
- Can I afford...?;
- In / Out / Net;
- first Needs Attention item.

Total balance must not be the hero.

## Cards

Cards are reserved for:
- insight;
- goal;
- scenario;
- coherent action block.

Use aligned lists/sections for:
- transactions;
- accounts;
- debts;
- people;
- commitments;
- settings.

## Charts

Allowed:
- line/step;
- range band;
- horizontal comparisons;
- compact stacked bars;
- pace bars;
- heat strips;
- sparklines;
- waterfall;
- event timeline.

Avoid:
- donut-dashboard obsession;
- 3D;
- radar;
- gauges;
- decorative charts.

Every chart must answer a question.

## Motion

- 100–150ms micro;
- 180–250ms standard;
- 250–320ms overlays;
- no bounce;
- no confetti;
- no perpetual animation;
- respect reduced motion.

## Insight language

Evidence first.

Example:
`Coffee · 6 times this week · ₱720`

Then:
- See evidence
- Not useful

No moralizing.
No addiction/stress diagnosis.
No fake AI voice.

## Onboarding

Conversational, not form-heavy.

Use:
- one question/decision at a time;
- chips;
- segmented controls;
- amount entry;
- ranking;
- short explanation;
- Why we ask;
- Skip where appropriate.

Sensitive questions are optional and neutral.

## Accessibility

- 44–48px touch targets;
- clear focus;
- semantic headings;
- meaning not dependent on color;
- chart summaries;
- 200% zoom resilience;
- privacy mode masks accessible labels too;
- no clipped currency amounts.

## Adaptive layout

Compact:
- bottom navigation;
- one-column;
- sheets/drawers;
- 16px margins.

Expanded:
- navigation rail;
- two-pane detail where useful;
- do not just stretch phone cards.

## Immediate rejection patterns

- generic SaaS dashboard;
- generic neobank/crypto clone;
- gradients;
- glassmorphism;
- random KPI cards;
- total-balance hero;
- donut-heavy finance UI;
- red for all spending;
- >5 primary tabs;
- “Good morning 👋” generic copy;
- AI marketing;
- shaming language;
- confetti/gamification;
- every section in a rounded card;
- static/dead controls without explicit simulation labeling.
