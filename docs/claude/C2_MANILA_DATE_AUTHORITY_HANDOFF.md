# KIRION FORGE — KIVRA
# CLAUDE C2 BOUNDED CODE-WRITER HANDOFF
# MANILA DATE AUTHORITY / TODAY BUCKETING

## STATUS

C1.1 bounded repair is accepted.

C2 is a new, slightly broader CODE_WRITER benchmark for Haiku 4.5 / Effort Off.

Do not reopen C1.

Do not redesign Kivra.

Do not broaden into general timezone cleanup.

---

# SOURCE IDENTITY

Repository:

```text
Kirch-Nairu/FORGE-KIVRA-LOVABLE-TEST
```

Accepted C1.1 source candidate:

```text
fd3426a5d235231b25f400f8c9aef4bfa5696e53
```

C2 branch:

```text
forge/claude-c2-manila-date-authority
```

The implementation source to modify is the exact C1.1 candidate above.

---

# AUTHORIZED C2 DEFECT

Kivra's prototype clock authority is explicitly:

```text
Asia/Manila
```

However two current code paths still identify a calendar date incorrectly.

## Defect A — Clock.isoDate uses UTC date

Current:

```ts
get isoDate(): string {
  return this.current.toISOString().split('T')[0];
}
```

`toISOString()` is UTC.

A Manila instant shortly after midnight can therefore return the previous UTC calendar date.

Example:

```text
2026-10-07T00:30:00+08:00
= 2026-10-06T16:30:00Z

Correct Manila date key:
2026-10-07

Current UTC-derived key:
2026-10-06
```

That violates the prototype clock's timezone authority.

## Defect B — Today transaction bucketing trusts timestamp text prefix

Current Today logic:

```ts
const todayDateStr = prototypeClock.isoDate;
const todayTxns = currentPersona.transactions.filter((t) =>
  t.timestamp.startsWith(todayDateStr)
);
```

The serialized timestamp prefix is not necessarily the Manila calendar date of that instant.

Example:

```text
2026-10-06T17:30:00-07:00
= 2026-10-07T08:30:00+08:00
```

This transaction belongs to Manila 2026-10-07, but string-prefix bucketing places it under 2026-10-06.

A second inverse example:

```text
2026-10-08T01:00:00+10:00
= 2026-10-07T23:00:00+08:00
```

This belongs to Manila 2026-10-07 despite the serialized prefix being 2026-10-08.

The Today In/Out/Net strip therefore has a real date-authority defect for non-Manila-offset timestamps.

---

# REQUIRED C2 REPAIR

Owned files:

```text
src/domain/clock.ts
src/features/today/TodayView.tsx
```

You may add one exported helper in `clock.ts`.

Do not add a dependency.

Do not create a generic date library.

Do not touch fixtures merely to manufacture success.

Do not touch:

- pattern engine;
- Safe-to-Spend;
- Quick Add mutation semantics;
- onboarding;
- routing;
- exports;
- Goals;
- Plan scenarios;
- architecture;
- authority documents other than this handoff.

---

# REQUIRED DESIGN

Introduce one canonical helper in `src/domain/clock.ts` that converts a Date or ISO timestamp to a Manila calendar date key:

```text
YYYY-MM-DD
```

Requirements:

1. Explicit timezone:
   `Asia/Manila`.

2. Do not derive the key with:
   `toISOString().split('T')[0]`.

3. Do not parse a localized human-formatted date string back into `Date`.

4. Prefer direct `Intl.DateTimeFormat(...).formatToParts()` extraction.

5. The helper should be reusable by both:
   - `Clock.isoDate`;
   - Today transaction bucketing.

6. `Clock.isoDate` must return the canonical Manila date key.

7. Today must compare:
   ```text
   Manila date key(transaction timestamp)
   ===
   prototypeClock.isoDate
   ```

8. Do not change transaction semantics themselves.

9. Do not change the prototype clock instant.

10. Keep existing public behavior unchanged for the current default clock where the date already coincides.

---

# NEGATIVE / EDGE REASONING

Before returning, reason against these exact cases:

## Case 1 — Manila just after midnight

```text
input:
2026-10-07T00:30:00+08:00

expected Manila date key:
2026-10-07
```

## Case 2 — serialized previous date, Manila next date

```text
transaction:
2026-10-06T17:30:00-07:00

expected Manila date key:
2026-10-07
```

This MUST count as Today when prototype Manila date is 2026-10-07.

## Case 3 — serialized next date, Manila previous date

```text
transaction:
2026-10-08T01:00:00+10:00

expected Manila date key:
2026-10-07
```

This MUST also count as Today when prototype Manila date is 2026-10-07.

## Case 4 — another Manila day

```text
transaction:
2026-10-08T00:30:00+08:00

expected Manila date key:
2026-10-08
```

This MUST NOT count as Today for 2026-10-07.

---

# VALIDATION POLICY

Do not add tests.

If browser Claude cannot mutate Git, return an exact unified diff.

If existing build/typecheck can be run without mutation, report it.

Otherwise:

```text
BUILD: NOT_EXECUTED
TYPECHECK: NOT_EXECUTED
```

Do not fabricate runtime evidence.

Source reasoning is OBSERVED/CALCULATED, not TESTED.

---

# TOKEN / USAGE DIRECTIVE

This remains a lower-tier model benchmark.

Do not re-read the whole repository.

Read only:

```text
src/domain/clock.ts
src/features/today/TodayView.tsx
```

and directly required types/import context if necessary.

Do not produce another architecture analysis.

Implement the bounded change.

---

# OUTPUT MODE

If direct Git write access is unavailable:

return an exact unified diff against:

```text
fd3426a5d235231b25f400f8c9aef4bfa5696e53
```

The patch must modify only:

```text
src/domain/clock.ts
src/features/today/TodayView.tsx
```

No pseudocode.

Forge will apply it mechanically.

---

# REQUIRED C2 REPORT

Return exactly:

```text
KIRION FORGE — KIVRA
CLAUDE C2 MANILA DATE AUTHORITY REPORT

1. SOURCE CANDIDATE
2. DEFECT
3. FILES CHANGED
4. IMPLEMENTATION APPROACH
5. PATCH
6. CASE 1 CHECK
7. CASE 2 CHECK
8. CASE 3 CHECK
9. CASE 4 CHECK
10. BUILD
11. TYPECHECK
12. GIT MUTATION
13. LIMITATIONS
14. DISPOSITION
```

Disposition:

```text
READY FOR FORGE PATCH APPLICATION
```

or

```text
BLOCKED
```

Then STOP.

Do not begin C3.
Do not self-review the whole product.
Do not self-accept.
