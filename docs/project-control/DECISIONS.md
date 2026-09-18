# LARI Growth OS — Decision Ledger

This ledger records architectural, governance, and technical decisions made during the lifecycle of LARI Growth OS.
Format conforms to Canonical Handoff Section 25.10.

---

### DECISION_ID: D-001
- **TIMESTAMP_UTC:** 2026-09-18T00:00:00Z
- **WORK_PACKAGE_ID:** WP-01
- **STATUS:** ACCEPTED
- **DECISION:** Separate Growth OS into dedicated repository boundary (`MertSGI/lari-growth-os`) rather than nesting in AOS or LARI product repo.
- **RATIONALE:** Preserves AOS as a domain-agnostic autonomous platform; prevents coupling commercial heuristics with product application code.
- **ALTERNATIVES_CONSIDERED:** Monorepo within AOS; subdirectory in LARI app repo.
- **EVIDENCE_LEVEL:** E1
- **EVIDENCE_REFERENCES:** Canonical Handoff Section 20.1
- **RISK_CLASS:** R0
- **AFFECTED_COMPONENTS:** All repository modules.
- **SUPERSEDES_DECISION_ID:** None

---

### DECISION_ID: D-002
- **TIMESTAMP_UTC:** 2026-09-18T00:00:00Z
- **WORK_PACKAGE_ID:** WP-01
- **STATUS:** ACCEPTED
- **DECISION:** Collapse 10 canonical roles into 6 logical capability lanes with deterministic-first rules.
- **RATIONALE:** Prevents agent proliferation and unnecessary LLM token expenditure on deterministic checks (HTTP status, sitemap schemas, canonical tags).
- **ALTERNATIVES_CONSIDERED:** One persistent LLM agent per canonical role.
- **EVIDENCE_LEVEL:** E1
- **EVIDENCE_REFERENCES:** Canonical Handoff Section 20.2
- **RISK_CLASS:** R0
- **AFFECTED_COMPONENTS:** Analyzers, Controller.
- **SUPERSEDES_DECISION_ID:** None

---

### DECISION_ID: D-003
- **TIMESTAMP_UTC:** 2026-09-18T00:00:00Z
- **WORK_PACKAGE_ID:** WP-01
- **STATUS:** ACCEPTED
- **DECISION:** Append-only observation store with explicit provenance; versioned derived state.
- **RATIONALE:** Guarantees auditability, reproducible derivations, and prevents loss of raw source facts.
- **ALTERNATIVES_CONSIDERED:** Destructive in-place table updates.
- **EVIDENCE_LEVEL:** E1
- **EVIDENCE_REFERENCES:** Canonical Handoff Section 20.3
- **RISK_CLASS:** R0
- **AFFECTED_COMPONENTS:** Raw observation schema, storage layer.
- **SUPERSEDES_DECISION_ID:** None

---

### DECISION_ID: D-004
- **TIMESTAMP_UTC:** 2026-09-18T00:00:00Z
- **WORK_PACKAGE_ID:** WP-01
- **STATUS:** ACCEPTED
- **DECISION:** Read adapters domain-owned; mutation execution AOS-owned via work intent port.
- **RATIONALE:** Isolates domain-specific ingestion logic while enforcing central AOS governance and red lines for side effects.
- **ALTERNATIVES_CONSIDERED:** Direct mutation by Growth OS services.
- **EVIDENCE_LEVEL:** E1
- **EVIDENCE_REFERENCES:** Canonical Handoff Section 20.4
- **RISK_CLASS:** R0
- **AFFECTED_COMPONENTS:** Connectors, AOS adapter.
- **SUPERSEDES_DECISION_ID:** None

---

### DECISION_ID: D-005
- **TIMESTAMP_UTC:** 2026-09-18T00:00:00Z
- **WORK_PACKAGE_ID:** WP-01
- **STATUS:** ACCEPTED
- **DECISION:** Canonical internal vendor-neutral event envelope; GA4 is a projection, not sole commercial truth.
- **RATIONALE:** Protects against analytics vendor lock-in, data model drift, and quota issues; enables full funnel joins.
- **ALTERNATIVES_CONSIDERED:** Direct coupling to GA4 Data API schemas.
- **EVIDENCE_LEVEL:** E1
- **EVIDENCE_REFERENCES:** Canonical Handoff Section 20.5
- **RISK_CLASS:** R0
- **AFFECTED_COMPONENTS:** Event contracts, analytics connector.
- **SUPERSEDES_DECISION_ID:** None

---

### DECISION_ID: D-006
- **TIMESTAMP_UTC:** 2026-09-18T00:00:00Z
- **WORK_PACKAGE_ID:** WP-01
- **STATUS:** ACCEPTED
- **DECISION:** Multi-dimensional risk matrix (R0-R3); production mutation remains NO_GO.
- **RATIONALE:** Prevents autonomous degradation of commercial, clinical, or legal boundaries.
- **ALTERNATIVES_CONSIDERED:** Single-axis blast radius score.
- **EVIDENCE_LEVEL:** E1
- **EVIDENCE_REFERENCES:** Canonical Handoff Section 20.6
- **RISK_CLASS:** R0
- **AFFECTED_COMPONENTS:** Governance, Risk assessment.
- **SUPERSEDES_DECISION_ID:** None

---

### DECISION_ID: D-007
- **TIMESTAMP_UTC:** 2026-09-18T00:00:00Z
- **WORK_PACKAGE_ID:** WP-01
- **STATUS:** ACCEPTED
- **DECISION:** Durable experiment ledger with honest causal-design labeling.
- **RATIONALE:** Forbids claiming A/B validity for non-randomized SEO interventions; enforces pre-registration and guardrail tracking.
- **ALTERNATIVES_CONSIDERED:** Unstructured change log.
- **EVIDENCE_LEVEL:** E1
- **EVIDENCE_REFERENCES:** Canonical Handoff Section 20.7
- **RISK_CLASS:** R0
- **AFFECTED_COMPONENTS:** Experiment ledger.
- **SUPERSEDES_DECISION_ID:** None

---

### DECISION_ID: D-008
- **TIMESTAMP_UTC:** 2026-09-18T00:00:00Z
- **WORK_PACKAGE_ID:** WP-01
- **STATUS:** ACCEPTED
- **DECISION:** Isolated domain data plane with deterministic-first cost policy.
- **RATIONALE:** Keeps growth telemetry separate from user auth/clinical database; caps compute and API expenditure.
- **ALTERNATIVES_CONSIDERED:** Colocated schema in production product database.
- **EVIDENCE_LEVEL:** E1
- **EVIDENCE_REFERENCES:** Canonical Handoff Section 20.11
- **RISK_CLASS:** R0
- **AFFECTED_COMPONENTS:** Data storage, cloud topology.
- **SUPERSEDES_DECISION_ID:** None

---

### DECISION_ID: D-009
- **TIMESTAMP_UTC:** 2026-09-18T00:00:00Z
- **WORK_PACKAGE_ID:** WP-01
- **STATUS:** ACCEPTED
- **DECISION:** AOS integration uses a versioned semantic work-intent / execution-receipt port.
- **RATIONALE:** Completely decouples Growth OS logic from physical AOS transport (HTTP, gRPC, queue, CLI).
- **ALTERNATIVES_CONSIDERED:** Hard-coded HTTP client to internal endpoint.
- **EVIDENCE_LEVEL:** E1
- **EVIDENCE_REFERENCES:** Canonical Handoff Section 20.12
- **RISK_CLASS:** R0
- **AFFECTED_COMPONENTS:** AOS adapter.
- **SUPERSEDES_DECISION_ID:** None

---

### DECISION_ID: D-010
- **TIMESTAMP_UTC:** 2026-09-18T00:00:00Z
- **WORK_PACKAGE_ID:** WP-01
- **STATUS:** ACCEPTED
- **DECISION:** Google Search Console Search Analytics is treated as partial signal by contract.
- **RATIONALE:** Official GSC API docs specify row truncation and anonymization; GSC alone is never treated as exhaustive search truth.
- **ALTERNATIVES_CONSIDERED:** Assuming 100% search demand completeness.
- **EVIDENCE_LEVEL:** E1
- **EVIDENCE_REFERENCES:** Canonical Handoff Section 20.4, 23
- **RISK_CLASS:** R0
- **AFFECTED_COMPONENTS:** GSC connector.
- **SUPERSEDES_DECISION_ID:** None

---

### DECISION_ID: D-011
- **TIMESTAMP_UTC:** 2026-09-18T00:00:00Z
- **WORK_PACKAGE_ID:** WP-01
- **STATUS:** ACCEPTED
- **DECISION:** Bing connector must use modern REST/OAuth2 APIs; legacy SOAP/POX forbidden (retired 2026-08-31).
- **RATIONALE:** Compliance with current Microsoft platform API specifications.
- **ALTERNATIVES_CONSIDERED:** Legacy SOAP client.
- **EVIDENCE_LEVEL:** E1
- **EVIDENCE_REFERENCES:** Canonical Handoff Section 20.4, 23
- **RISK_CLASS:** R0
- **AFFECTED_COMPONENTS:** Bing connector.
- **SUPERSEDES_DECISION_ID:** None

---

### DECISION_ID: D-012
- **TIMESTAMP_UTC:** 2026-09-18T00:00:00Z
- **WORK_PACKAGE_ID:** WP-01
- **STATUS:** ACCEPTED
- **DECISION:** Objective-function weights will not be hard-coded before real baseline and commercial linkage exist.
- **RATIONALE:** Prevents arbitrary local optimization for vanity traffic over qualified revenue.
- **ALTERNATIVES_CONSIDERED:** Static default scoring formula.
- **EVIDENCE_LEVEL:** E1
- **EVIDENCE_REFERENCES:** Canonical Handoff Section 20.9, 21
- **RISK_CLASS:** R0
- **AFFECTED_COMPONENTS:** Portfolio scoring, Controller.
- **SUPERSEDES_DECISION_ID:** None

---

### DECISION_ID: D-013
- **TIMESTAMP_UTC:** 2026-09-18T08:15:00Z
- **WORK_PACKAGE_ID:** WP-01
- **STATUS:** ACCEPTED
- **DECISION:** Implement TypeScript/JSON Schema contracts for all canonical interfaces, validated via deterministic automated tests.
- **RATIONALE:** Provides strict compile-time and runtime validation across execution lanes without third-party heavy dependencies.
- **ALTERNATIVES_CONSIDERED:** Python Pydantic or Protobuf without web console alignment.
- **EVIDENCE_LEVEL:** E2
- **EVIDENCE_REFERENCES:** WP-01 implementation files in /contracts/
- **RISK_CLASS:** R0
- **AFFECTED_COMPONENTS:** /contracts/, /src/, /tests/
- **SUPERSEDES_DECISION_ID:** None
