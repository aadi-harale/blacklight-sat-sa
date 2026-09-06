# Architecture

BLACKLIGHT is deliberately local and deterministic.

```text
CSV / JSON evidence
        |
        v
Local parser + schema checks
        |
        v
Normalized alert / asset model
        |
        +----------------------+
        |                      |
        v                      v
Claim evidence paths      Negative-space checks
        |                      |
        +----------+-----------+
                   v
        Deterministic findings
                   |
         +---------+----------+
         |                    |
         v                    v
Competing explanations   Counterfactual clearing
         |                    |
         +---------+----------+
                   v
           Human examiner
                   |
                   v
Reproducibility capsule / dossier
```

## Trust boundaries

- Browser runtime: all analysis.
- External network: not required.
- LLM: not used for finding generation.
- Evidence upload: FileReader only, no upload endpoint.
- Cryptography: browser-native SHA-256 via Web Crypto.

## Current prototype limits

- CSV parser supports standard quoted comma-separated rows but is intentionally small; production ingestion should use a hardened parser and schema validation.
- Parquet ingestion is not implemented in the browser prototype.
- RFC 3161 timestamping is not implemented because a trusted internal TSA must be chosen by the deploying authority.
- The current ruleset demonstrates the architecture on four supervisory claims; a production system would version claim templates and policies per entity/sector.
