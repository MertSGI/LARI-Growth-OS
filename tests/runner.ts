/**
 * LARI Growth OS — Deterministic Test Runner
 * Executes all WP-01 test suites and verifies invariants
 */

import { runBootstrapTests } from './bootstrap_invariants.test.ts';
import { runDiscoveryTests } from './public_discovery.test.ts';

async function main() {
  console.log('====================================================');
  console.log('  LARI Growth OS — Deterministic Test Runner');
  console.log('  Mode: BOUNDED_NON_PROD | Target: WP-01 Acceptance');
  console.log('====================================================\n');

  const bootstrapResults = runBootstrapTests();
  const discoveryResults = runDiscoveryTests();

  const allResults = [...bootstrapResults, ...discoveryResults];

  let passed = 0;
  let failed = 0;

  for (const res of allResults) {
    if (res.passed) {
      console.log(`  [PASS] ${res.name}`);
      passed++;
    } else {
      console.error(`  [FAIL] ${res.name}`);
      console.error(`         Reason: ${res.error}`);
      failed++;
    }
  }

  console.log('\n----------------------------------------------------');
  console.log(`  Total: ${allResults.length} | Passed: ${passed} | Failed: ${failed}`);
  console.log('----------------------------------------------------\n');

  if (failed > 0) {
    console.error('WP-01 Validation FAILED: One or more invariants violated.');
    process.exit(1);
  } else {
    console.log('WP-01 Validation PASSED: All bootstrap & discovery invariants verified.');
    process.exit(0);
  }
}

main().catch(err => {
  console.error('Unexpected error running test suite:', err);
  process.exit(1);
});
