# BLACKLIGHT — Proof Before Prediction

A polished, offline-first prototype for **SIH26157 — Supervisory Analytics Tool for SOC Assessment (SAT-SA)**.

BLACKLIGHT is intentionally **not** an LLM cyber copilot and not a black-box anomaly score. Its core product idea is deterministic supervisory evidence reasoning:

1. Convert an organisational claim into an expected evidence path.
2. Reconstruct what actually happened from submitted structured records.
3. Detect contradictions and negative space.
4. Keep multiple explanations alive instead of inferring intent.
5. Show exactly what additional evidence would clear or downgrade the finding.
6. Export a reproducibility capsule containing ruleset, evidence references, hashes and counterfactual requirements.

## What is implemented

- Cinematic landing page inspired by instrument / field-console UI rather than a generic hackathon dashboard.
- Fully local synthetic validation pack with deterministic ground truth.
- Claim–evidence contradiction engine.
- Negative-space coverage analysis.
- Fast-closure vs automation evidence checks.
- Policy-dependent review state that avoids overclaiming.
- Competing-explanation support/contradiction matrix.
- Counterfactual clearing paths.
- Next-best-evidence recommendation based on affected records.
- Local CSV and JSON upload.
- SHA-256 dataset fingerprint.
- Row-level SHA-256 Merkle evidence root using native Web Crypto.
- Downloadable finding reproducibility capsule.
- Downloadable supervisory dossier.
- No external model, API, SaaS or cloud call in the application runtime.

## Run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Production:

```bash
npm run verify
npm run build
npm start
```

The Next.js config uses `output: "standalone"` so the built application can be packaged for a local assessment appliance.

## Upload schema

CSV requires:

```text
alert_id,severity,asset_id,opened_at,closed_at
```

Optional fields:

```text
triaged_at
investigated_at
enriched_at
escalated_at
automation_run_id
closure_reason
action_signature
exception_code
```

JSON should be an array of objects with the same fields.

## Demo truth

The included benchmark is **synthetic and explicitly labelled as synthetic**. It contains 1,842 critical alert records and intentionally injects known conditions, including:

- 136 alerts with no investigation transition.
- 41 fast unresolved closures with no automation trace.
- a declared estate of 620 critical assets, 587 claimed protected, but only 311 observed in submitted operational evidence.
- policy-context gaps kept at `REVIEW`, not converted into misconduct claims.

Do not present these numbers as real bank or CSE telemetry.

## Design principle

> A supervisory finding should be reproducible, not persuasive.

BLACKLIGHT supports examiner judgement. It does not determine guilt, regulatory intent or legal liability.
