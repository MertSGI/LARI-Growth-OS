# LARI Growth OS — Open Evidence Gaps

This document tracks unresolved live data, access, and infrastructure gaps.
In accordance with Section 20.0 and Section 22, **UNKNOWN must remain UNKNOWN**. Unknown is never assumed to be healthy, indexed, attributable, or authorized.

| GAP_ID | Description | Why It Matters | Status | Blocking Phase / WP | Target Resolution Path |
|---|---|---|---|---|---|
| GAP-001 | Exact current LARI route/build manifest and deployed URL set | Defines real canonical page universe for G1 exit gate | OPEN | WP-03, G1 | Ingest from public crawl / route registry fixture / LARI repo export |
| GAP-002 | Current locales, markets, services, clinics/providers actually represented | Required for entity mapping, taxonomy graph, and market segmentation | OPEN | WP-03, Phase 3 | Extract from public multilingual page tree & service hierarchy |
| GAP-003 | Google Search Console property IDs and API service account credentials | Required for real Search Analytics & URL Inspection ingestion | OPEN | WP-05 | Await authorized read-only credentials via secure config |
| GAP-004 | Google Analytics 4 property ID, data stream config, and custom events | Needed for real session, funnel, and attribution tracking | OPEN | WP-06, G2 | Await authorized read-only GA4 service account / client ID |
| GAP-005 | CRM lead and stage schema | Required for joining acquisition traffic with lead qualification status | OPEN | WP-07, G3 | Await CRM export or read connector specification |
| GAP-006 | Booking / consultation / revenue / refund schema | Required to calibrate multi-objective commercial optimization function | OPEN | WP-07, Phase 4 | Await commercial transaction data model and definitions |
| GAP-007 | Google Business Profile listing inventory and API access | Local entity consistency, reputation monitoring, and discovery | OPEN | Later presence connector | Await approved GBP project credentials |
| GAP-008 | Bing Webmaster REST property and OAuth2 access | Cross-engine visibility monitoring | OPEN | Later connector | Await Bing Webmaster API credentials |
| GAP-009 | Formal consent and privacy classification policy | Health-tourism privacy compliance and data minimization boundary | OPEN | G0, G2 | Review legal guidelines on patient consultation data handling |
| GAP-010 | Current LARI deployment/canary/rollback mechanics | Required for executable change design in non-prod | OPEN | G7, G8 | Ingest LARI deployment pipeline documentation |
| GAP-011 | Canonical AOS callable execution interface and authority contract | Binds the abstract AosExecutionPort (D-009) to live execution runtime | OPEN | WP-10, G5 | Fresh-read live AOS API/CLI specification when available |
| GAP-012 | Current AOS evidence taxonomy mapping | Prevents conflicting evidence semantics between Growth OS and AOS | OPEN | WP-10 | Align evidence ID namespaces with AOS evidence store |
