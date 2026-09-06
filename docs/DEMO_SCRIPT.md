# BLACKLIGHT — 90-second judge demo

## 0–15 sec: the claim

Open the workbench on `BL-1042`.

Say:

> "The entity reports that every critical cyber alert is meaningfully investigated before closure. The dashboard KPI can still say 100%. BLACKLIGHT asks a different question: can the operational evidence support that claim?"

Point to the entity declaration.

## 15–35 sec: reconstruct the process

Point to the evidence flow:

Detection → Triage → Investigation → Enrichment → Closure.

The `Investigation` state is red.

Say:

> "We reconstruct the process deterministically. 136 critical alerts closed without an observable investigation transition. We do not convert that into an AI risk score. We say the claim is not supported by the submitted evidence."

## 35–55 sec: do not accuse

Scroll to **Competing explanations**.

Say:

> "Missing evidence is not proof of gaming. It may be legitimate automation, a duplicate, a shallow closure, or an incomplete export. BLACKLIGHT keeps those explanations separate and shows what supports or contradicts each."

## 55–72 sec: the invention

Show **Counterfactual clearing**.

Say:

> "This is the part normal dashboards do not give an examiner: what evidence would change the finding? A valid automation execution trace, the missing workflow event stream, or an approved exception can clear or downgrade it."

## 72–82 sec: next-best evidence

Show **Next-best evidence**.

Say:

> "Instead of asking for everything, BLACKLIGHT tells the examiner which evidence source can resolve the most uncertainty first."

## 82–90 sec: reproducibility

Generate the Merkle root and export the capsule.

Say:

> "Same evidence, same ruleset, same finding. The examiner can reproduce the result offline. BLACKLIGHT is proof before prediction."

## Second demo if asked

Open `BL-1188`.

Explain negative space:

> "The entity claims 587 protected critical assets, but only 311 ever appear in the submitted operational evidence. BLACKLIGHT does not call that withholding. It flags the contradiction and asks for monitoring-health evidence or a time-matched scope reconciliation."
