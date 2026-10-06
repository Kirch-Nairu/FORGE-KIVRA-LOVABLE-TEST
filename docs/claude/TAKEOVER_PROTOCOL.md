# KIRION FORGE — CLAUDE TAKEOVER PROTOCOL

This protocol is dormant until KIRION Forge explicitly authorizes Claude.

## Phase C0 — forensic intake

Claude must independently verify:

1. repository and branch;
2. exact source SHA;
3. latest Forge disposition;
4. whether Lovable's final candidate was ACCEPT / REWORK / FAIL;
5. whether GPT/Forge made any repair commit after Lovable;
6. current build stack;
7. backend/database/cloud status;
8. current known limitations.

No mutation.

Return:

```text
KIRION FORGE — KIVRA
CLAUDE C0 INTAKE REPORT

SOURCE SHA
LATEST FORGE DISPOSITION
ARCHITECTURE
PRODUCT INVARIANTS
CURRENT DEFECTS
CLAIMS VERIFIED
CLAIMS CONTRADICTED
FILES MUTATED: NONE
DISPOSITION: READY FOR C1 | BLOCKED
```

Then stop.

## Phase C1 — bounded implementation

Only after Forge authorizes it.

Claude receives an exact defect/feature handoff.

Requirements:

- fix forward;
- do not broadly redesign;
- preserve Kivra authority;
- do not add cloud/backend;
- do not change framework without explicit authority;
- report exact changed files;
- return exact new candidate SHA.

## If GPT repairs before Claude

Claude treats GPT's repair commit as source, not as unquestionable truth.

It still inspects the source independently.

## If Lovable hits a limit mid-pass

Claude does not restart the product.

Forge first records:
- last Lovable commit;
- incomplete scope;
- source state;
- broken/working areas.

Then Claude resumes only the missing bounded work.
