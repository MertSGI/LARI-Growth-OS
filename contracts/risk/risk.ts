/**
 * LARI Growth OS — Risk & Authority Matrix Contracts
 * Canonical Handoff Section 20.6 (D-006)
 */

import { RiskClass } from '../work-intents/work_intent.ts';

export interface RiskDimensions {
  content_claim_risk: 0 | 1 | 2 | 3;
  medical_or_legal_risk: 0 | 1 | 2 | 3;
  blast_radius: 0 | 1 | 2 | 3;
  reversibility_risk: 0 | 1 | 2 | 3; // 3 = Irreversible
  revenue_policy_impact: 0 | 1 | 2 | 3;
  privacy_data_sensitivity: 0 | 1 | 2 | 3;
  external_side_effect_level: 0 | 1 | 2 | 3;
  architecture_migration_risk: 0 | 1 | 2 | 3;
}

export interface RiskAssessment {
  assessment_id: string;
  evaluated_at: string;
  dimensions: RiskDimensions;
  computed_risk_class: RiskClass;
  is_human_required: boolean;
  prohibited_reasons: string[];
  required_evidence_level: 'E0' | 'E1' | 'E2' | 'E3' | 'E4';
}

export function computeRiskClass(dims: RiskDimensions): RiskAssessment {
  const maxScore = Math.max(
    dims.content_claim_risk,
    dims.medical_or_legal_risk,
    dims.blast_radius,
    dims.reversibility_risk,
    dims.revenue_policy_impact,
    dims.privacy_data_sensitivity,
    dims.external_side_effect_level,
    dims.architecture_migration_risk
  );

  let computed_risk_class: RiskClass = 'R0';
  if (maxScore === 1) computed_risk_class = 'R1';
  if (maxScore === 2) computed_risk_class = 'R2';
  if (maxScore >= 3) computed_risk_class = 'R3';

  const prohibited_reasons: string[] = [];
  if (dims.medical_or_legal_risk >= 3) prohibited_reasons.push('Medical or legal claim modification requires HUMAN_REQUIRED R3');
  if (dims.content_claim_risk >= 3) prohibited_reasons.push('High-risk clinical marketing claim modification requires HUMAN_REQUIRED R3');
  if (dims.revenue_policy_impact >= 3) prohibited_reasons.push('Pricing or guarantee changes require HUMAN_REQUIRED R3');

  const is_human_required = computed_risk_class === 'R3';
  const required_evidence_level = is_human_required ? 'E3' : computed_risk_class === 'R2' ? 'E3' : computed_risk_class === 'R1' ? 'E2' : 'E1';

  return {
    assessment_id: `risk_${Date.now()}`,
    evaluated_at: new Date().toISOString(),
    dimensions: dims,
    computed_risk_class,
    is_human_required,
    prohibited_reasons,
    required_evidence_level
  };
}
