/**
 * LARI Growth OS — AOS Execution Receipt Contract
 * Canonical Handoff Section 20.12 (D-009)
 */

export type ExecutionResult = 'PASS' | 'FAIL' | 'HOLD' | 'HUMAN_REQUIRED';

export interface AosExecutionReceipt {
  aos_task_id: string;
  intent_id: string;
  received_input_hash: string;
  resolved_authority_ref: string;
  exact_execution_base?: string;
  execution_environment: 'local' | 'test' | 'staging' | 'production';

  actions_performed: string[];
  side_effects: string[];
  changed_paths: string[];
  test_results: {
    test_suite: string;
    total: number;
    passed: number;
    failed: number;
    skipped: number;
  }[];
  browser_evidence_refs: string[];
  external_evidence_refs: string[];
  rollback_evidence_ref?: string;

  model_provider_usage_summary?: {
    total_tokens: number;
    estimated_cost_usd: number;
    providers_used: string[];
  };

  cost_summary?: {
    currency: string;
    amount: number;
  };

  retry_repair_summary?: {
    retry_count: number;
    repair_attempts: number;
  };

  result: ExecutionResult;
  blocker?: string;
  canonical_next_action: string;
}
