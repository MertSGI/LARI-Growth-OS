/**
 * LARI Growth OS — Work Intent Contract
 * Canonical Handoff Section 20.12 (D-009)
 */

export type RiskClass = 'R0' | 'R1' | 'R2' | 'R3';

export interface GrowthWorkIntent {
  intent_id: string;
  idempotency_key: string;
  objective_id: string;
  opportunity_id: string;
  experiment_id?: string;

  requested_operation: string;
  target_system: 'LARI_CODEBASE' | 'GSC' | 'GBP' | 'CRM' | 'ANALYTICS' | 'LOCAL_FIXTURE';
  target_repository?: string;
  target_ref?: string;
  exact_base_sha?: string;

  risk_class: RiskClass;
  authority_ref?: string;
  environment: 'local' | 'test' | 'staging' | 'production';

  input_evidence_refs: string[];
  immutable_input_hash: string;

  allowed_actions: string[];
  forbidden_actions: string[];
  expected_changed_paths?: string[];
  external_side_effect_budget: {
    max_network_writes: number;
    max_api_cost_cents: number;
    max_tokens: number;
  };

  acceptance_gates: string[];
  guardrail_metrics: string[];
  rollback_required: boolean;
  rollback_contract_ref?: string;

  model_compute_budget?: {
    max_model_calls: number;
    max_tokens: number;
  };
}
