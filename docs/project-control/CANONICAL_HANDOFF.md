# LARI Growth OS — Canonical Handoff

**Canonical Revision:** 1.2  
**Revision Date:** 2026-09-18  
**Supersedes:** `LARI_GROWTH_OS_CANONICAL_HANDOFF_2026-09-18_v1.1.md`  
**Execution mode:** AUTONOMOUS_BOUNDED_WORK_PACKAGE_EXECUTION  
**Production:** NO_GO  
**Cloud Run deployment:** NOT_AUTHORIZED  
**LARI production mutation:** NOT_AUTHORIZED  
**AOS production mutation:** NOT_AUTHORIZED  

## 1. Purpose

This document is the authoritative starting point for LARI Growth OS: an always-on, agentic visibility, acquisition, conversion, reputation, SEO, content, site architecture, and revenue-optimization system for LARI.

This document serves as canonical context. The assistant behaves as a rigorous controller/architect: distinguish facts from assumptions, avoid premature completion claims, define measurable acceptance gates, and preserve provenance for every important decision.

## 2. Strategic Vision

LARI should behave like a living commercial ecosystem rather than a static website.

The system should continuously observe discoverability and customer behavior, identify opportunities or defects, propose and execute bounded changes, measure the result, keep winning changes, roll back losing changes, and learn from outcomes.

Core closed loop:
**Observe -> Diagnose -> Hypothesize -> Plan -> Change -> Verify -> Deploy/Canary -> Measure -> Keep/Rollback -> Learn -> Replan**

Primary objective chain:
**Qualified visibility -> qualified traffic -> qualified lead -> consultation -> booking -> realized revenue / commercial value**

## 3. Architectural Boundary

- **AOS**: Autonomous execution/governance/runtime platform.
- **LARI**: Commercial product/application.
- **LARI Growth OS**: Domain system running on top of AOS owning LARI-specific growth logic, data, objectives, experiments, and decision policies.

## 4. Why Separate Growth OS From Core AOS

AOS remains reusable infrastructure. Growth OS contains LARI-specific commercial reasoning and integrations.

## 5. Agent / Capability Topology

Six logical capability lanes (collapsed from 10 canonical roles per D-002):
1. Discovery & Technical Health (Technical SEO + Site Architecture)
2. Demand & Content Intelligence (Search/Content + Acquisition/SERP)
3. Funnel & Revenue Intelligence (CRO + CRM/Sales)
4. Trust & Presence (Reputation/Local/International)
5. Measurement & Experiment Integrity (Analytics Integrity + Causal Measurement)
6. Growth Controller (Portfolio Optimizer)

Deterministic-first rule: use deterministic analyzers before LLM reasoning whenever a rule can be expressed reliably.

## 6. Data / Integration Layer

Data sources: Google Search Console, GA4, GBP, Bing Webmaster Tools, CRM/lead pipeline, booking system, telemetry/performance, server/crawl logs, AOS browser evidence, sitemap/crawl graph, SERP monitoring. All metrics labeled by source, freshness, and confidence.

## 7. Objective Function

Multi-objective score balancing qualified visibility, clicks, sessions, lead quality, consultation rate, booking rate, revenue, trust/reputation with penalties for UX/perf regressions, compliance/trust risks, and spammy behavior.

## 8. Change Risk Classes

- **R0/R1**: Read-only & low-risk validated mutations (after standing authority, currently PROD NO_GO).
- **R2**: Controlled / Canary / Strong evidence (PROD NO_GO).
- **R3 / HUMAN_REQUIRED**: Medical/clinical claims, pricing, legal/compliance, guarantees, brand repositioning, domain migration, destructive URL changes.

## 9. Health-Tourism Specific Guardrails

- AI is human-supported, not medical authority.
- Claims require evidence/provenance.
- Marketing info separated from medical advice.
- Safety/compliance outranks conversion gains.
- High-risk medical content changes require human review (R3).

## 10. Measurement / Experiment Ledger

Every optimization requires a durable record with hypothesis, baseline window, intervention, primary & guardrail metrics, confidence, decision, linked evidence, and provenance.

## 11. Site Mapping / Visibility Graph

Maintains canonical graph of URLs, page types, services, destinations/markets, clinics/providers, languages/locales, keywords/topics/entities, internal links, sitemap membership, index state, traffic/value signals, and conversion role.

## 12. Continuous Operating Loops

Adaptive cadences: Near-real-time (anomalies/errors), Daily (crawl/index health), Weekly (opportunities/CRO), Monthly (market expansion/ROI).

## 13. Provider / Agent Strategy

Correctness > useful parallelism > raw agent count. Deterministic analyzers first.

## 14. Deployment Philosophy

Maturity ladder: Observe -> Diagnose+Recommend -> Shadow decisions -> Execute in non-prod -> Canary low-risk -> Autonomous low-risk -> Broader autonomy. Production remains NO_GO.

## 15. Initial Build Phases

- Phase 0: Canonical Discovery
- Phase 1: Measurement Foundation
- Phase 2: Technical SEO Engine
- Phase 3: Visibility Intelligence
- Phase 4: CRO & Commercial Intelligence
- Phase 5: Closed-Loop Experiments
- Phase 6: Autonomous Growth Portfolio

## 16. Acceptance Gates

G0 (Authority + Source Registration), G1 (Current-State Discovery Completeness), G2 (Analytics Integrity), G3 (Commercial Linkage), G4 (Technical Detector Validity), G5 (AOS Boundary Integrity), G6 (Shadow Decision Quality), G7 (Non-Prod Execution Safety), G8 (Production Canary Entry - BLOCKED), G9 (Standing R1 Autonomy - BLOCKED).

## 17. Current Relevant AOS Context at Handoff

Fresh-read required; no stale assumptions.

## 18. Future Conversation Operating Instructions

Treat handoff as authoritative, maintain living handoff, fail closed on missing evidence, enforce production NO_GO.

## 19. First Task: V1 Architecture & Program Plan

Delivered in Sections 20-24.

## 20. Canonical Decision Set (D-001 through D-012)

- D-001: Separate Growth OS repository (`MertSGI/lari-growth-os`)
- D-002: Capability lanes, not one persistent model per agent
- D-003: Append-only observations + versioned derived state
- D-004: Read adapters domain-owned; mutation execution AOS-owned
- D-005: Canonical internal event envelope
- D-006: Multi-dimensional risk matrix; production NO_GO
- D-007: Durable experiment ledger
- D-008: Isolated domain data plane; deterministic-first cost policy
- D-009: AOS execution port/adapter contract
- D-010: GSC Search Analytics is partial signal by contract
- D-011: Bing connector must use REST/OAuth
- D-012: Objective-function weights calibrated from real baseline

## 21. Canonical Decision Log

Accepted D-001 through D-012.

## 22. Open Evidence Gaps

Gaps G-01 through G-12 cataloged for Phase 0 resolution.

## 23. External Capability Verification Snapshot

Verified GSC, GA4, GBP, Bing, Cloud Run, Cloud Billing.

## 24. Canonical Next Action

Phase 0 / WP-01 execution with PRODUCTION = NO_GO.

## 25. AI Studio Autonomous Executor Contract

Sections 25.1 to 25.14 define authority hierarchy, mission, red lines, allowed autonomous scope, autonomous work loop, stop conditions, evidence classes (E0-E4), git discipline, living project control, decision/evidence formats, completion rules, cost/resource discipline, and security/privacy.

## 26. Controller Report Contract

Exact reporting shape version 1.0.

## 27. Initial Autonomous Program Authority

WP-01 specification, acceptance gates WP01-A1 through WP01-A10.

## 28. AI Studio Session Bootstrap Prompt

Autonomous execution prompt.

## 29. Revision 1.2 Canonical State

CANONICAL_REVISION = 1.2
PROJECT_STATE = ACTIVE_DESIGN_AND_DISCOVERY
CURRENT_PHASE = PHASE_0_CANONICAL_DISCOVERY
CURRENT_WORK_PACKAGE = WP-01
PRODUCTION = NO_GO
AUTONOMOUS_MODE = BOUNDED_NON_PROD
