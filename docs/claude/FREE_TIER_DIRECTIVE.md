# CLAUDE FREE-TIER / LOW-TIER EXECUTION DIRECTIVE

## Objective

Use low-tier model capacity efficiently without weakening governance.

The worker should spend model effort on:

- source inspection;
- exact bounded implementation;
- high-value UI/UX reasoning;
- defect repair.

Avoid wasting usage on:

- repeating the entire PRD;
- generic architecture lectures;
- broad self-reviews;
- unnecessary test generation;
- speculative infrastructure;
- deployment setup;
- repeated summaries.

## Workflow

```text
read authority
→ read exact candidate
→ identify delta
→ implement bounded delta
→ compile/sanity if available
→ report exact evidence
→ stop
```

If usage limits interrupt execution:

- preserve exact file/commit state;
- write a concise checkpoint;
- list incomplete items;
- never pretend completion;
- next worker resumes from the checkpoint.

## Cross-model relay rule

Every worker handoff should preserve:

- exact source SHA;
- architecture;
- product invariants;
- current defects;
- files owned;
- files frozen;
- validation already performed;
- validation not performed.

This allows another low-tier worker to continue without rediscovering the project.
