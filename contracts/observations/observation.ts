/**
 * LARI Growth OS — Observation Contracts
 * Canonical Handoff Section 20.3 (D-003)
 */

export type FreshnessClass = 'REALTIME' | 'HOURLY' | 'DAILY' | 'STALE' | 'HISTORICAL_SNAPSHOT';
export type ConfidenceClass = 'CONFIRMED_HIGH' | 'DERIVED_MEDIUM' | 'HEURISTIC_LOW' | 'UNVERIFIED';

export type ReconciliationState =
  | 'ACTIVE_CANONICAL'
  | 'ACTIVE_NONCANONICAL'
  | 'REDIRECT'
  | 'NOT_FOUND'
  | 'BLOCKED'
  | 'NOINDEX'
  | 'ORPHAN'
  | 'UNKNOWN_REQUIRES_EVIDENCE';

export interface RawObservation<T = unknown> {
  observation_id: string;
  source_system: string;
  source_account_ref?: string;
  source_record_ref?: string;
  source_cursor?: string;
  observed_at: string; // ISO-8601 UTC
  ingested_at: string; // ISO-8601 UTC
  schema_version: string;
  freshness_class: FreshnessClass;
  confidence_class: ConfidenceClass;
  data_quality_flags: string[];
  raw_payload_checksum: string;
  payload: T;
}

export interface ObservationBatch<T = unknown> {
  connector_id: string;
  scope_id: string;
  requested_window?: {
    start: string;
    end: string;
  };
  actual_data_window?: {
    start: string;
    end: string;
  };
  retrieved_at: string;
  next_cursor?: string;
  records: RawObservation<T>[];
  quota_state?: {
    remaining?: number;
    reset_at?: string;
    is_throttled: boolean;
  };
  freshness_state: FreshnessClass;
  completeness_statement: 'COMPLETE' | 'PARTIAL_BY_CONTRACT' | 'SAMPLED' | 'UNKNOWN';
  warnings: string[];
}

export interface DiscoveredUrlNode {
  url: string;
  normalized_url: string;
  discovered_via: 'SITEMAP' | 'ROUTER' | 'HTML_HREF' | 'ROBOTS_TXT' | 'SEARCH_CONSOLE';
  reconciliation_state: ReconciliationState;
  http_status?: number;
  content_type?: string;
  title?: string;
  meta_description?: string;
  canonical_header_or_tag?: string;
  robots_directives?: string[];
  hreflang_tags?: { lang: string; href: string }[];
  structured_data_types?: string[];
  inbound_internal_links_count: number;
  depth_from_root?: number;
  discovered_at: string;
  provenance_ref: string;
}

export interface EvidenceArtifact {
  evidence_id: string;
  timestamp_utc: string;
  work_package_id: string;
  claim: string;
  evidence_level: 'E0' | 'E1' | 'E2' | 'E3' | 'E4';
  source_type: 'File' | 'AutomatedTest' | 'Connector' | 'Crawler' | 'ExternalAPI';
  source_location: string;
  command_or_procedure: string;
  expected_result: string;
  actual_result: string;
  pass_fail_hold: 'PASS' | 'FAIL' | 'HOLD';
  exact_sha_if_applicable?: string;
  notes?: string;
}
