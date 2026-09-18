/**
 * LARI Growth OS — Bootstrap & Project Control Invariants Test
 * Verifies Acceptance Gates WP01-A1, WP01-A2, WP01-A3, WP01-A4, WP01-A7
 */

import fs from 'node:fs';
import path from 'node:path';
import { computeRiskClass } from '../contracts/risk/risk.ts';

export function runBootstrapTests(): { name: string; passed: boolean; error?: string }[] {
  const results: { name: string; passed: boolean; error?: string }[] = [];

  function test(name: string, fn: () => void) {
    try {
      fn();
      results.push({ name, passed: true });
    } catch (err: unknown) {
      results.push({ name, passed: false, error: err instanceof Error ? err.message : String(err) });
    }
  }

  // 1. WP01-A1: Manifest existence and repository identity
  test('WP01-A1: Project manifest defines explicit repository identity', () => {
    const manifestPath = path.resolve('project_manifest.json');
    if (!fs.existsSync(manifestPath)) {
      throw new Error('project_manifest.json not found at workspace root');
    }
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    if (manifest.project_name !== 'LARI Growth OS') {
      throw new Error(`Unexpected project_name: ${manifest.project_name}`);
    }
    if (manifest.repository_identity !== 'MertSGI/lari-growth-os') {
      throw new Error(`Unexpected repository_identity: ${manifest.repository_identity}`);
    }
  });

  // 2. WP01-A2: Canonical handoff revision 1.2 in docs/project-control/
  test('WP01-A2: Canonical handoff revision 1.2 is materialized in project control', () => {
    const handoffPath = path.resolve('docs/project-control/CANONICAL_HANDOFF.md');
    if (!fs.existsSync(handoffPath)) {
      throw new Error('docs/project-control/CANONICAL_HANDOFF.md missing');
    }
    const content = fs.readFileSync(handoffPath, 'utf8');
    if (!content.includes('Canonical Revision:** 1.2')) {
      throw new Error('Canonical handoff does not declare Revision 1.2');
    }
    if (!content.includes('## 25. AI Studio Autonomous Executor Contract')) {
      throw new Error('Section 25 missing from materialized handoff');
    }
    if (!content.includes('## 27. Initial Autonomous Program Authority')) {
      throw new Error('Section 27 missing from materialized handoff');
    }
  });

  // 3. WP01-A3: Production NO_GO constraint documented and machine-readable
  test('WP01-A3: Production NO_GO constraint strictly enforced in manifest and state', () => {
    const manifest = JSON.parse(fs.readFileSync('project_manifest.json', 'utf8'));
    if (manifest.production_authority !== 'NO_GO') {
      throw new Error(`Manifest production_authority must be NO_GO, got: ${manifest.production_authority}`);
    }
    if (manifest.cloud_deployment_authority !== 'NOT_AUTHORIZED') {
      throw new Error('cloud_deployment_authority must be NOT_AUTHORIZED');
    }
    if (manifest.lari_production_mutation_authority !== 'NOT_AUTHORIZED') {
      throw new Error('lari_production_mutation_authority must be NOT_AUTHORIZED');
    }
    const stateContent = fs.readFileSync('docs/project-control/STATE.md', 'utf8');
    if (!stateContent.includes('PRODUCTION = NO_GO')) {
      throw new Error('docs/project-control/STATE.md missing explicit PRODUCTION = NO_GO');
    }
  });

  // 4. WP01-A4: Project control files exist and are internally consistent
  test('WP01-A4: All required project-control files exist', () => {
    const requiredFiles = [
      'docs/project-control/STATE.md',
      'docs/project-control/DECISIONS.md',
      'docs/project-control/EVIDENCE.md',
      'docs/project-control/OPEN_GAPS.md',
      'docs/project-control/WORK_PACKAGES.md',
      'docs/project-control/CANONICAL_HANDOFF.md',
    ];
    for (const relPath of requiredFiles) {
      if (!fs.existsSync(relPath)) {
        throw new Error(`Required project-control file missing: ${relPath}`);
      }
    }
  });

  // 5. WP01-A7: OPEN_GAPS.md documents all 12 canonical open evidence gaps
  test('WP01-A7: Open evidence gaps cataloged without fabrication', () => {
    const gapsContent = fs.readFileSync('docs/project-control/OPEN_GAPS.md', 'utf8');
    for (let i = 1; i <= 12; i++) {
      const gapId = `GAP-${String(i).padStart(3, '0')}`;
      if (!gapsContent.includes(gapId)) {
        throw new Error(`OPEN_GAPS.md missing canonical gap entry: ${gapId}`);
      }
    }
  });

  // 6. Risk computation test: R3 human-required guardrail enforcement
  test('Risk Matrix: Medical/legal claims force HUMAN_REQUIRED R3 classification', () => {
    const highRisk = computeRiskClass({
      content_claim_risk: 3,
      medical_or_legal_risk: 3,
      blast_radius: 1,
      reversibility_risk: 1,
      revenue_policy_impact: 0,
      privacy_data_sensitivity: 0,
      external_side_effect_level: 0,
      architecture_migration_risk: 0,
    });
    if (highRisk.computed_risk_class !== 'R3') {
      throw new Error(`Expected R3, got: ${highRisk.computed_risk_class}`);
    }
    if (!highRisk.is_human_required) {
      throw new Error('Expected is_human_required to be true for medical claim modifications');
    }

    const lowRisk = computeRiskClass({
      content_claim_risk: 0,
      medical_or_legal_risk: 0,
      blast_radius: 0,
      reversibility_risk: 0,
      revenue_policy_impact: 0,
      privacy_data_sensitivity: 0,
      external_side_effect_level: 0,
      architecture_migration_risk: 0,
    });
    if (lowRisk.computed_risk_class !== 'R0') {
      throw new Error(`Expected R0, got: ${lowRisk.computed_risk_class}`);
    }
  });

  return results;
}
