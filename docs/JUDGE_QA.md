# Judge Q&A — BLACKLIGHT

## "Why not just use an LLM to summarize the logs?"

Because an adverse supervisory finding must be reproducible. BLACKLIGHT's finding path is deterministic: the same normalized evidence and versioned ruleset produces the same result. A local LLM can be added later as a navigation layer, but it should not decide whether a claim is supported.

## "Does missing evidence prove the entity hid data?"

No. BLACKLIGHT deliberately separates observation from intent. It says the submitted evidence is inconsistent with the declared process and keeps benign explanations such as incomplete export or scope mismatch alive until the examiner obtains more evidence.

## "What is actually novel here?"

The novelty is the supervisory reasoning loop: claim -> expected evidence -> contradiction / negative space -> competing explanations -> counterfactual clearing -> next-best evidence -> reproducibility capsule. The system does not stop at anomaly detection or a risk score.

## "How do you validate without real bank data?"

The prototype uses an explicitly synthetic benchmark with known injected conditions. The evaluation plan is to blind the labels, compare BLACKLIGHT findings with expert manual review, and report finding recall, false supervisory flags, time-to-finding, ranking quality, and counterfactual correctness. Synthetic benchmark results must never be presented as production accuracy.

## "Can it scale?"

The current browser prototype demonstrates the reasoning architecture. The production ingestion path should move normalization and aggregation to an embedded analytical engine such as DuckDB while preserving the same deterministic ruleset and exported finding capsule.

## "Why the Merkle root?"

It is evidence provenance, not blockchain. It lets an examiner bind a finding to the exact rows used during assessment. A production deployment can attach an approved internal timestamp/signature service; the prototype intentionally does not fake an RFC 3161 TSA.

## "What happens if the entity provides the missing evidence?"

That is the point of counterfactual clearing. The finding can be rerun and downgraded or cleared if the new evidence satisfies one of the explicit clearing conditions.
