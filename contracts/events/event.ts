/**
 * LARI Growth OS — Canonical Internal Event Envelope
 * Canonical Handoff Section 20.5 (D-005)
 */

export type FunnelEventName =
  | 'page_view'
  | 'cta_view'
  | 'cta_click'
  | 'form_start'
  | 'form_validation_error'
  | 'form_submit'
  | 'generate_lead'
  | 'lead_qualified'
  | 'lead_disqualified'
  | 'lead_working'
  | 'consultation_scheduled'
  | 'consultation_completed'
  | 'booking_created'
  | 'booking_cancelled'
  | 'revenue_realized'
  | 'refund_realized';

export interface GrowthEvent {
  event_id: string; // Globally unique UUID / ULID
  event_name: FunnelEventName | string;
  schema_version: string;
  occurred_at: string; // ISO-8601 UTC
  received_at: string; // ISO-8601 UTC
  source_system: string;
  environment: 'local' | 'test' | 'staging' | 'production';

  anonymous_subject_id?: string;
  session_id?: string;
  lead_id?: string;
  consultation_id?: string;
  booking_id?: string;

  site_id: string;
  url_id: string;
  page_id?: string;
  market_id?: string;
  locale_id?: string;
  service_id?: string;

  acquisition?: {
    source?: string;
    medium?: string;
    campaign?: string;
    referrer_domain?: string;
    landing_page_id?: string;
  };

  experiment?: {
    experiment_id?: string;
    arm_id?: string;
    exposure_id?: string;
  };

  commercial?: {
    value_amount?: number;
    value_currency?: string;
    value_type?: string;
  };

  governance: {
    consent_state: 'GRANTED' | 'DENIED' | 'NOT_APPLICABLE';
    data_classification: 'PUBLIC' | 'COMMERCIAL_CONFIDENTIAL' | 'RESTRICTED_HEALTH_SURFACE';
    provenance_ref: string;
  };
}
