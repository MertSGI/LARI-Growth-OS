# LARI Growth OS — Work Package Register

This register details the initial 10 work packages for LARI Growth OS V1, their dependencies, risk classification, acceptance gates, and lifecycle state.

| WP_ID | Title | Phase | Dependencies | Risk Class | Status | Exit Evidence |
|---|---|---|---|---|---|---|
| **WP-01** | Canonical Discovery & Repository Bootstrap | Phase 0 | None | R0 | **ACCEPTED_COMPLETE** | Repository boundary, manifest, project control, public discovery engine, test suite (11/11 pass) |
| **WP-02** | Provenance Store + Connector Registry + Cursors | Phase 1 | WP-01 | R0 | **READY** | Deterministic ingest contract tests; append-only raw observation proof |
| **WP-03** | LARI Site Graph Discovery Adapter | Phase 0 | WP-01, WP-02 | R0 | PENDING | Known URL universe reconciliation from router/sitemap/crawl inputs |
| **WP-04** | Metric Registry + Canonical Funnel/Event Contract | Phase 1 | WP-01 | R0 | PENDING | Versioned event/metric schemas and data-minimization tests |
| **WP-05** | Search Console Read Connector | Phase 1 | WP-02, WP-03 | R0 | PENDING | Search Analytics + URL Inspection ingestion with quota/completeness metadata |
| **WP-06** | GA4 Read Connector | Phase 1 | WP-02, WP-04 | R0 | PENDING | Quota-aware incremental reports, canonical metric mapping, freshness proof |
| **WP-07** | CRM / Booking / Revenue Read Model | Phase 1 | WP-02, WP-04 | R0 | PENDING | Lead -> consultation -> booking -> realized value join contract |
| **WP-08** | Deterministic Technical SEO Detector Engine | Phase 2 | WP-03, WP-05 | R0 | PENDING | Fixture-backed detection of canonical/sitemap/link/hreflang/schema defects |
| **WP-09** | Experiment Ledger + Opportunity Queue + Scoring v0 | Phase 2 | WP-04..WP-08 | R0 | PENDING | Evidence-linked hypotheses; no unproven claims; pre-registration records |
| **WP-10** | AOS Execution Adapter in SHADOW Mode | Phase 5 | WP-01, WP-09, Live AOS | R0 | PENDING | GrowthWorkIntent -> AOS receipt contract proven with zero mutation |

---

## Detailed Specifications: Completed Work Package WP-01

- **Work Package:** WP-01
- **Phase:** Phase 0 — Canonical Discovery
- **Objective:** Establish a reproducible Growth OS repository and authoritative current-state discovery foundation without mutating production.
- **Assigned Executor:** GOOGLE_AI_STUDIO
- **Authority:** CANONICAL_HANDOFF Revision 1.2 Section 27
- **Risk Class:** R0 (Read-only, local design/testing)
- **Status:** **ACCEPTED_COMPLETE**
- **Acceptance Criteria Matrix:**

| Criteria ID | Description | Required Level | Status | Evidence Reference |
|---|---|---|---|---|
| `WP01-A1` | Dedicated Growth OS workspace/repository identity is explicit | E1 | **PASS** | `EVD-001` (`/project_manifest.json`) |
| `WP01-A2` | Canonical handoff revision 1.2 is materialized in project control | E1 | **PASS** | `EVD-002` (`/docs/project-control/CANONICAL_HANDOFF.md`) |
| `WP01-A3` | Production NO_GO is machine-readable and documented | E1 | **PASS** | `EVD-003` (`/project_manifest.json`, `STATE.md`) |
| `WP01-A4` | Project-control files exist and are internally consistent | E2 | **PASS** | `EVD-005` (`tests/bootstrap_invariants.test.ts`) |
| `WP01-A5` | Public LARI discovery procedure is reproducible | E2 | **PASS** | `EVD-006` (`tests/public_discovery.test.ts`) |
| `WP01-A6` | Every discovered observation carries source/freshness/provenance metadata | E2 | **PASS** | `EVD-007` (`tests/public_discovery.test.ts`) |
| `WP01-A7` | Unavailable integrations are recorded as gaps, not guessed | E1 | **PASS** | `EVD-004` (`docs/project-control/OPEN_GAPS.md`) |
| `WP01-A8` | Bootstrap tests pass (11/11 tests green) | E2 | **PASS** | `EVD-008` (`tests/runner.ts`) |
| `WP01-A9` | No remote production mutation occurred | E2 | **PASS** | `EVD-009` (Execution log) |
| `WP01-A10` | Controller Report schema 1.0 is emitted completely | E1 | **PASS** | `EVD-010` (Emitted in cycle conclusion) |
