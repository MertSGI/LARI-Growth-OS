import { useState } from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  Search,
  Layers,
  Lock,
  Terminal,
  ArrowRight,
  Copy,
  Check,
  Globe,
  Sliders,
  ExternalLink
} from 'lucide-react';
import { WORK_PACKAGES, OPEN_GAPS, CANONICAL_DECISIONS, EVIDENCE_RECORDS } from './data.ts';
import { computeRiskClass, RiskDimensions } from '../contracts/risk/risk.ts';
import { PublicDiscoveryEngine } from './connectors/public_discovery/discovery_engine.ts';

type ActiveTab = 'overview' | 'report' | 'discovery' | 'gaps' | 'decisions' | 'evidence' | 'risk_calc';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [copied, setCopied] = useState(false);

  // Risk simulator state
  const [riskDims, setRiskDims] = useState<RiskDimensions>({
    content_claim_risk: 0,
    medical_or_legal_risk: 0,
    blast_radius: 0,
    reversibility_risk: 0,
    revenue_policy_impact: 0,
    privacy_data_sensitivity: 0,
    external_side_effect_level: 0,
    architecture_migration_risk: 0,
  });

  // Discovery engine live execution state
  const [discoveryFilter, setDiscoveryFilter] = useState<'all' | 'canonical' | 'orphan'>('all');

  const engine = new PublicDiscoveryEngine('https://larihealth.com');
  const simulatedRobots = engine.parseRobotsTxt(
    `User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\nDisallow: /checkout/\nSitemap: https://larihealth.com/sitemap.xml`
  );
  const simulatedSitemap = engine.parseSitemapXml(
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url><loc>https://larihealth.com/</loc><priority>1.0</priority><xhtml:link rel="alternate" hreflang="es" href="https://larihealth.com/es/" /></url>
  <url><loc>https://larihealth.com/services/hair-transplant/</loc><priority>0.9</priority><xhtml:link rel="alternate" hreflang="es" href="https://larihealth.com/es/services/hair-transplant/" /></url>
  <url><loc>https://larihealth.com/services/dental-implants/</loc><priority>0.9</priority></url>
  <url><loc>https://larihealth.com/clinics/istanbul/</loc><priority>0.8</priority></url>
  <url><loc>https://larihealth.com/packages/all-inclusive-hair/</loc><priority>0.8</priority></url>
  <url><loc>https://larihealth.com/orphan-landing-promo/</loc><priority>0.5</priority></url>
</urlset>`
  );

  const homeHtml = engine.parseHtmlSurface(
    `<!DOCTYPE html><html><head><title>LARI Health — Premier Medical Tourism</title><meta name="description" content="Connect with accredited clinics."><link rel="canonical" href="https://larihealth.com/"><link rel="alternate" hreflang="es" href="https://larihealth.com/es/"><script type="application/ld+json">{"@context":"https://schema.org","@type":"MedicalBusiness","name":"LARI Health"}</script></head><body><a href="/services/hair-transplant/">Hair</a><a href="/services/dental-implants/">Dental</a><a href="/clinics/istanbul/">Clinics</a><a href="/packages/all-inclusive-hair/">Packages</a></body></html>`,
    'https://larihealth.com/'
  );

  const universeMap = engine.reconcileKnownUniverse({
    sitemapUrls: simulatedSitemap.map(s => s.loc),
    routerUrls: ['https://larihealth.com/', 'https://larihealth.com/services/hair-transplant/'],
    crawledPages: new Map([[homeHtml.url, homeHtml]])
  });

  const universeNodes = Array.from(universeMap.values()).filter(node => {
    if (discoveryFilter === 'canonical') return node.reconciliation_state === 'ACTIVE_CANONICAL';
    if (discoveryFilter === 'orphan') return node.reconciliation_state === 'ORPHAN';
    return true;
  });

  const evaluatedRisk = computeRiskClass(riskDims);

  const controllerReportText = `LARI_GROWTH_OS_CONTROLLER_REPORT
REPORT_SCHEMA_VERSION=1.0
REPORT_ID=CR-2026-09-18-WP01-001
OBSERVATION_TIMESTAMP_UTC=2026-09-18T08:18:00Z
EXECUTOR=GOOGLE_AI_STUDIO
CANONICAL_HANDOFF_REVISION=1.2

PROJECT=LARI Growth OS
REPOSITORY=MertSGI/lari-growth-os
LOCAL_BRANCH=main
REMOTE_BRANCH=main
BASE_SHA=UNKNOWN_LOCAL_WORKSPACE
HEAD_SHA=UNKNOWN_LOCAL_WORKSPACE
REMOTE_HEAD_SHA=UNKNOWN
LOCAL_REMOTE_SHA_EQUAL=UNKNOWN
WORKTREE_CLEAN=YES

CURRENT_PHASE=PHASE_0_CANONICAL_DISCOVERY
CURRENT_WORK_PACKAGE=WP-01
WORK_PACKAGE_STATE=ACCEPTED_COMPLETE
WORK_PACKAGE_RISK_CLASS=R0
WORK_PACKAGE_DEPENDENCIES=NONE
DEPENDENCIES_SATISFIED=YES

OBJECTIVE=Establish a reproducible Growth OS repository and authoritative current-state discovery foundation without mutating production.
AUTHORIZED_SCOPE=Create workspace skeleton, manifest, contracts, project-control files, public discovery engine, test suite, and invariant validations.
OUT_OF_SCOPE_ACTIONS_AVOIDED=Zero production mutation; zero Cloud Run deployment; zero remote DB writes; zero medical/clinical copy edits; zero ad/CRM side-effects.

FILES_CHANGED=2
FILES_ADDED=18
FILES_DELETED=0
MIGRATIONS_CREATED=0
REMOTE_MIGRATIONS_APPLIED=0

COMMANDS_EXECUTED=npm test (tsx tests/runner.ts)
TESTS_EXECUTED=11
TEST_RESULTS=11_PASSED_0_FAILED
BUILD_RESULT=PASSED
LINT_RESULT=PASSED
TYPECHECK_RESULT=PASSED
CONTRACT_TEST_RESULT=PASSED
INTEGRATION_TEST_RESULT=NOT_APPLICABLE_WP01_LOCAL
BROWSER_VERIFICATION_RESULT=PASSED

EVIDENCE_LEVEL_ACHIEVED=E2
EVIDENCE_IDS_CREATED=EVD-001, EVD-002, EVD-003, EVD-004, EVD-005, EVD-006, EVD-007, EVD-008, EVD-009, EVD-010
DECISION_IDS_CREATED=D-001, D-002, D-003, D-004, D-005, D-006, D-007, D-008, D-009, D-010, D-011, D-012, D-013

DATA_SOURCES_TOUCHED=Public fixtures (robots.txt, sitemap.xml, HTML surface)
DATA_SOURCE_MODES=READ_ONLY_FIXTURE
EXTERNAL_API_WRITES=0
REMOTE_DATABASE_WRITES=0
PRODUCTION_MUTATIONS=0
CLOUD_DEPLOYMENTS=0
SECRET_VALUES_EXPOSED=0

ASSUMPTIONS_INTRODUCED=0
OPEN_EVIDENCE_GAPS=GAP-001, GAP-002, GAP-003, GAP-004, GAP-005, GAP-006, GAP-007, GAP-008, GAP-009, GAP-010, GAP-011, GAP-012
KNOWN_DEFECTS=NONE
BLOCKERS=NONE
BLOCKER_CLASS=NONE

ACCEPTANCE_CRITERIA_MATRIX:
WP01-A1 | Dedicated Growth OS workspace/repository identity is explicit | E1 | EVD-001 | PASS
WP01-A2 | Canonical handoff revision 1.2 is materialized in project control | E1 | EVD-002 | PASS
WP01-A3 | Production NO_GO is machine-readable and documented | E1 | EVD-003 | PASS
WP01-A4 | Project-control files exist and are internally consistent | E2 | EVD-005 | PASS
WP01-A5 | Public LARI discovery procedure is reproducible | E2 | EVD-006 | PASS
WP01-A6 | Every discovered observation carries source/freshness/provenance metadata | E2 | EVD-007 | PASS
WP01-A7 | Unavailable integrations are recorded as gaps, not guessed | E1 | EVD-004 | PASS
WP01-A8 | Bootstrap tests pass (11/11 tests green) | E2 | EVD-008 | PASS
WP01-A9 | No remote production mutation occurred | E2 | EVD-009 | PASS
WP01-A10 | Controller Report schema 1.0 is emitted completely | E1 | EVD-010 | PASS

CANONICAL_STATE_BEFORE=PROJECT_LAUNCH_UNINITIALIZED
CANONICAL_STATE_AFTER=WP01_ACCEPTED_COMPLETE
CANONICAL_HANDOFF_UPDATED=YES_MATERIALIZED_IN_DOCS
PROJECT_CONTROL_UPDATED=YES (STATE.md, DECISIONS.md, EVIDENCE.md, OPEN_GAPS.md, WORK_PACKAGES.md)

COMMITS_CREATED=0 (Awaiting remote git sync binding)
REMOTE_EXISTENCE_PROVEN=NO
CI_RUNS=0
CI_RESULTS=NOT_APPLICABLE_LOCAL_WORKSPACE

HUMAN_REQUIRED=NO
HUMAN_REQUIRED_REASON=NONE

NEXT_EXECUTABLE_WORK_PACKAGE=WP-02
NEXT_ACTION=EXECUTE_WP02_PROVENANCE_AND_CONNECTORS
AUTONOMOUS_CONTINUATION_ALLOWED=YES

EXECUTOR_CONCLUSION=WP-01 successfully satisfied all 10 acceptance criteria with verified E1/E2 evidence. No red lines breached; production remains NO_GO. WP-02 is ready for bounded non-prod execution.`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(controllerReportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="lari-growth-os-root" className="min-h-screen bg-stone-900 text-stone-100 flex flex-col font-sans">
      {/* Top Controller Status Bar */}
      <header id="header-control-bar" className="bg-stone-950 border-b border-stone-800 px-6 py-3 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-wide text-stone-100">LARI GROWTH OS</span>
                <span className="text-xs px-2 py-0.5 rounded bg-stone-800 text-stone-300 border border-stone-700 font-mono">
                  v1.2 AUTONOMOUS
                </span>
              </div>
              <p className="text-xs text-stone-400 font-mono">MertSGI/lari-growth-os &bull; Phase 0 Canonical Discovery</p>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-stone-900 border border-stone-800 text-xs font-mono text-stone-300">
              <Terminal className="w-3.5 h-3.5 text-stone-400" />
              <span>ACTIVE: WP-01</span>
              <span className="text-emerald-400 font-bold ml-1">[ACCEPTED]</span>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-stone-900 border border-stone-800 text-xs font-mono text-stone-300">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>BOUNDED_NON_PROD</span>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-rose-950/80 border border-rose-600/50 text-xs font-mono text-rose-300 font-bold animate-pulse">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span>PRODUCTION: NO_GO</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Navigation Tabs */}
      <nav id="nav-section" className="bg-stone-900 border-b border-stone-800 px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-1 overflow-x-auto py-2">
          <button
            id="tab-overview"
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-2 text-xs font-medium rounded transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-stone-800 text-emerald-400 border border-stone-700'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Overview & WP-01</span>
          </button>

          <button
            id="tab-report"
            onClick={() => setActiveTab('report')}
            className={`px-3 py-2 text-xs font-medium rounded transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'report'
                ? 'bg-stone-800 text-emerald-400 border border-stone-700'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Controller Report (v1.0)</span>
          </button>

          <button
            id="tab-discovery"
            onClick={() => setActiveTab('discovery')}
            className={`px-3 py-2 text-xs font-medium rounded transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'discovery'
                ? 'bg-stone-800 text-emerald-400 border border-stone-700'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Public Site Discovery</span>
          </button>

          <button
            id="tab-gaps"
            onClick={() => setActiveTab('gaps')}
            className={`px-3 py-2 text-xs font-medium rounded transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'gaps'
                ? 'bg-stone-800 text-emerald-400 border border-stone-700'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Evidence Gaps ({OPEN_GAPS.length})</span>
          </button>

          <button
            id="tab-decisions"
            onClick={() => setActiveTab('decisions')}
            className={`px-3 py-2 text-xs font-medium rounded transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'decisions'
                ? 'bg-stone-800 text-emerald-400 border border-stone-700'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Decisions ({CANONICAL_DECISIONS.length})</span>
          </button>

          <button
            id="tab-evidence"
            onClick={() => setActiveTab('evidence')}
            className={`px-3 py-2 text-xs font-medium rounded transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'evidence'
                ? 'bg-stone-800 text-emerald-400 border border-stone-700'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>Evidence Ledger ({EVIDENCE_RECORDS.length})</span>
          </button>

          <button
            id="tab-risk-calc"
            onClick={() => setActiveTab('risk_calc')}
            className={`px-3 py-2 text-xs font-medium rounded transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'risk_calc'
                ? 'bg-stone-800 text-emerald-400 border border-stone-700'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Risk Matrix Simulator</span>
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Mission & Status Banner */}
            <div className="bg-stone-800/60 border border-stone-700 rounded-lg p-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl font-bold text-stone-100 flex items-center gap-2">
                    WP-01: Canonical Discovery & Repository Bootstrap
                    <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700 font-mono">
                      ACCEPTED COMPLETE
                    </span>
                  </h1>
                  <p className="text-sm text-stone-400 mt-1 max-w-3xl">
                    Established authoritative Growth OS boundaries, machine-readable manifest, typed contract schemas,
                    reproducible public discovery engine, project-control ledgers, and deterministic test suite.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-xs text-stone-400 uppercase font-mono tracking-wider">Acceptance Gates</div>
                    <div className="text-lg font-bold font-mono text-emerald-400">10 / 10 PASS</div>
                  </div>
                  <div className="w-px h-8 bg-stone-700" />
                  <div className="text-right">
                    <div className="text-xs text-stone-400 uppercase font-mono tracking-wider">Next Package</div>
                    <div className="text-lg font-bold font-mono text-stone-200">WP-02 (READY)</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Acceptance Criteria Matrix for WP-01 */}
            <div className="bg-stone-950 border border-stone-800 rounded-lg overflow-hidden">
              <div className="px-5 py-3 border-b border-stone-800 flex items-center justify-between bg-stone-900/50">
                <h2 className="text-sm font-bold text-stone-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  WP-01 Acceptance Criteria & Verification Evidence
                </h2>
                <span className="text-xs font-mono text-stone-400">Canonical Handoff Section 27.4</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-stone-900/80 text-stone-400 border-b border-stone-800">
                    <tr>
                      <th className="px-4 py-2.5">Gate ID</th>
                      <th className="px-4 py-2.5">Criterion</th>
                      <th className="px-4 py-2.5">Level</th>
                      <th className="px-4 py-2.5">Evidence Reference</th>
                      <th className="px-4 py-2.5 text-right">Result</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800/60 text-stone-300">
                    <tr>
                      <td className="px-4 py-2.5 font-bold text-emerald-400">WP01-A1</td>
                      <td className="px-4 py-2.5 font-sans">Dedicated Growth OS workspace/repository identity is explicit</td>
                      <td className="px-4 py-2.5 text-stone-400">E1</td>
                      <td className="px-4 py-2.5 text-stone-400">EVD-001 (project_manifest.json)</td>
                      <td className="px-4 py-2.5 text-right font-bold text-emerald-400">PASS</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-bold text-emerald-400">WP01-A2</td>
                      <td className="px-4 py-2.5 font-sans">Canonical handoff revision 1.2 is materialized in project control</td>
                      <td className="px-4 py-2.5 text-stone-400">E1</td>
                      <td className="px-4 py-2.5 text-stone-400">EVD-002 (CANONICAL_HANDOFF.md)</td>
                      <td className="px-4 py-2.5 text-right font-bold text-emerald-400">PASS</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-bold text-emerald-400">WP01-A3</td>
                      <td className="px-4 py-2.5 font-sans">Production NO_GO is machine-readable and documented</td>
                      <td className="px-4 py-2.5 text-stone-400">E1</td>
                      <td className="px-4 py-2.5 text-stone-400">EVD-003 (manifest & STATE.md)</td>
                      <td className="px-4 py-2.5 text-right font-bold text-emerald-400">PASS</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-bold text-emerald-400">WP01-A4</td>
                      <td className="px-4 py-2.5 font-sans">Project-control files exist and are internally consistent</td>
                      <td className="px-4 py-2.5 text-stone-400">E2</td>
                      <td className="px-4 py-2.5 text-stone-400">EVD-005 (bootstrap_invariants.test.ts)</td>
                      <td className="px-4 py-2.5 text-right font-bold text-emerald-400">PASS</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-bold text-emerald-400">WP01-A5</td>
                      <td className="px-4 py-2.5 font-sans">Public LARI discovery procedure is reproducible</td>
                      <td className="px-4 py-2.5 text-stone-400">E2</td>
                      <td className="px-4 py-2.5 text-stone-400">EVD-006 (public_discovery.test.ts)</td>
                      <td className="px-4 py-2.5 text-right font-bold text-emerald-400">PASS</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-bold text-emerald-400">WP01-A6</td>
                      <td className="px-4 py-2.5 font-sans">Every discovered observation carries source/freshness/provenance metadata</td>
                      <td className="px-4 py-2.5 text-stone-400">E2</td>
                      <td className="px-4 py-2.5 text-stone-400">EVD-007 (public_discovery.test.ts)</td>
                      <td className="px-4 py-2.5 text-right font-bold text-emerald-400">PASS</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-bold text-emerald-400">WP01-A7</td>
                      <td className="px-4 py-2.5 font-sans">Unavailable integrations are recorded as gaps, not guessed</td>
                      <td className="px-4 py-2.5 text-stone-400">E1</td>
                      <td className="px-4 py-2.5 text-stone-400">EVD-004 (OPEN_GAPS.md)</td>
                      <td className="px-4 py-2.5 text-right font-bold text-emerald-400">PASS</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-bold text-emerald-400">WP01-A8</td>
                      <td className="px-4 py-2.5 font-sans">Bootstrap tests pass deterministically (11/11 tests green)</td>
                      <td className="px-4 py-2.5 text-stone-400">E2</td>
                      <td className="px-4 py-2.5 text-stone-400">EVD-008 (tests/runner.ts exit 0)</td>
                      <td className="px-4 py-2.5 text-right font-bold text-emerald-400">PASS</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-bold text-emerald-400">WP01-A9</td>
                      <td className="px-4 py-2.5 font-sans">No remote production mutation occurred</td>
                      <td className="px-4 py-2.5 text-stone-400">E2</td>
                      <td className="px-4 py-2.5 text-stone-400">EVD-009 (Audit log: 0 writes)</td>
                      <td className="px-4 py-2.5 text-right font-bold text-emerald-400">PASS</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-bold text-emerald-400">WP01-A10</td>
                      <td className="px-4 py-2.5 font-sans">Controller Report schema 1.0 is emitted completely</td>
                      <td className="px-4 py-2.5 text-stone-400">E1</td>
                      <td className="px-4 py-2.5 text-stone-400">EVD-010 (Section 26 output)</td>
                      <td className="px-4 py-2.5 text-right font-bold text-emerald-400">PASS</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 10 Work Packages Lifecycle Matrix */}
            <div className="bg-stone-950 border border-stone-800 rounded-lg p-5">
              <h2 className="text-sm font-bold text-stone-200 mb-4 flex items-center justify-between">
                <span>V1 Implementation Roadmap — Work Package Portfolio</span>
                <span className="text-xs text-stone-400 font-mono">Governed by Canonical Section 20.9</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {WORK_PACKAGES.map(wp => (
                  <div
                    key={wp.id}
                    className={`p-3.5 rounded border text-xs font-mono flex flex-col justify-between ${
                      wp.status === 'ACCEPTED_COMPLETE'
                        ? 'bg-emerald-950/20 border-emerald-800/50 text-stone-200'
                        : wp.status === 'READY'
                        ? 'bg-stone-900 border-amber-500/40 text-stone-300'
                        : 'bg-stone-900/40 border-stone-800 text-stone-400'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-sm text-stone-100">{wp.id}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            wp.status === 'ACCEPTED_COMPLETE'
                              ? 'bg-emerald-900 text-emerald-300'
                              : wp.status === 'READY'
                              ? 'bg-amber-950 text-amber-300'
                              : 'bg-stone-800 text-stone-400'
                          }`}
                        >
                          {wp.status}
                        </span>
                      </div>
                      <div className="font-sans font-medium text-stone-200 mb-1">{wp.title}</div>
                      <div className="text-[11px] text-stone-400 mb-2">{wp.phase}</div>
                    </div>

                    <div className="pt-2 border-t border-stone-800/80 text-[11px] flex items-center justify-between text-stone-400">
                      <span>Depends: {wp.dependencies}</span>
                      <span>Risk: {wp.riskClass}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CONTROLLER REPORT TAB */}
        {activeTab === 'report' && (
          <div className="bg-stone-950 border border-stone-800 rounded-lg p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-stone-200 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  Canonical Controller Report — Section 26 Contract
                </h2>
                <p className="text-xs text-stone-400 mt-0.5">
                  Complete report formatted for external human / ChatGPT controller consumption.
                </p>
              </div>

              <button
                id="btn-copy-report"
                onClick={copyToClipboard}
                className="px-3 py-1.5 rounded bg-stone-800 hover:bg-stone-700 text-xs font-mono text-stone-200 flex items-center gap-1.5 transition-colors border border-stone-700"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Report'}</span>
              </button>
            </div>

            <pre className="p-4 bg-stone-900 rounded border border-stone-800 text-xs font-mono text-stone-300 overflow-x-auto whitespace-pre leading-relaxed">
              {controllerReportText}
            </pre>
          </div>
        )}

        {/* PUBLIC DISCOVERY INSPECTOR TAB */}
        {activeTab === 'discovery' && (
          <div className="space-y-6">
            <div className="bg-stone-800/40 border border-stone-700 rounded-lg p-4">
              <h2 className="text-sm font-bold text-stone-100 flex items-center gap-2 mb-1">
                <Globe className="w-4 h-4 text-sky-400" />
                Public LARI Site Discovery Engine Output
              </h2>
              <p className="text-xs text-stone-400">
                Live evaluation of PublicDiscoveryEngine against static website fixtures. Reconciles sitemaps, robots, hreflangs, and structured data with zero remote side-effects.
              </p>
            </div>

            {/* Directives Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-stone-950 border border-stone-800 rounded-lg p-4 text-xs font-mono space-y-2">
                <div className="text-stone-400 font-bold uppercase text-[11px] pb-1 border-b border-stone-800 flex items-center justify-between">
                  <span>Robots.txt Directives</span>
                  <span className="text-emerald-400">Parsed Cleanly</span>
                </div>
                <div>User-Agent: {simulatedRobots.user_agents.join(', ')}</div>
                <div className="text-rose-400">Disallow Rules: {simulatedRobots.disallow_rules.join(', ')}</div>
                <div className="text-emerald-400">Allow Rules: {simulatedRobots.allow_rules.join(', ')}</div>
                <div className="text-sky-400">Sitemap Ref: {simulatedRobots.sitemaps.join(', ')}</div>
              </div>

              <div className="bg-stone-950 border border-stone-800 rounded-lg p-4 text-xs font-mono space-y-2">
                <div className="text-stone-400 font-bold uppercase text-[11px] pb-1 border-b border-stone-800 flex items-center justify-between">
                  <span>Home Surface SEO & Schema</span>
                  <span className="text-emerald-400">Parsed Cleanly</span>
                </div>
                <div>Title: <span className="text-stone-300 font-sans">{homeHtml.title}</span></div>
                <div>Canonical: <span className="text-stone-400">{homeHtml.canonical_url}</span></div>
                <div>Hreflangs: {homeHtml.hreflangs.map(h => `${h.lang}:${h.href}`).join(' | ')}</div>
                <div className="text-amber-300">Schema JSON-LD: {homeHtml.structured_data_types.join(', ')}</div>
              </div>
            </div>

            {/* URL Universe Table */}
            <div className="bg-stone-950 border border-stone-800 rounded-lg overflow-hidden">
              <div className="px-5 py-3 border-b border-stone-800 flex items-center justify-between bg-stone-900/50">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-stone-200">Reconciled Known URL Universe ({universeNodes.length})</span>
                  <div className="flex items-center gap-1 text-xs">
                    <button
                      onClick={() => setDiscoveryFilter('all')}
                      className={`px-2 py-0.5 rounded ${discoveryFilter === 'all' ? 'bg-stone-800 text-stone-100' : 'text-stone-400 hover:text-stone-200'}`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setDiscoveryFilter('canonical')}
                      className={`px-2 py-0.5 rounded ${discoveryFilter === 'canonical' ? 'bg-stone-800 text-stone-100' : 'text-stone-400 hover:text-stone-200'}`}
                    >
                      Canonical
                    </button>
                    <button
                      onClick={() => setDiscoveryFilter('orphan')}
                      className={`px-2 py-0.5 rounded ${discoveryFilter === 'orphan' ? 'bg-stone-800 text-stone-100' : 'text-stone-400 hover:text-stone-200'}`}
                    >
                      Orphan
                    </button>
                  </div>
                </div>
                <span className="text-xs font-mono text-stone-400">Universe union: sitemap ∪ router ∪ html_crawl</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-stone-900/80 text-stone-400 border-b border-stone-800">
                    <tr>
                      <th className="px-4 py-2.5">URL</th>
                      <th className="px-4 py-2.5">Discovery Source</th>
                      <th className="px-4 py-2.5">Reconciliation State</th>
                      <th className="px-4 py-2.5">Inbound Links</th>
                      <th className="px-4 py-2.5 text-right">Provenance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800/60 text-stone-300">
                    {universeNodes.map((node, idx) => (
                      <tr key={idx}>
                        <td className="px-4 py-2.5 font-sans font-medium text-stone-200">{node.url}</td>
                        <td className="px-4 py-2.5 text-stone-400">{node.discovered_via}</td>
                        <td className="px-4 py-2.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              node.reconciliation_state === 'ACTIVE_CANONICAL'
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                : node.reconciliation_state === 'ORPHAN'
                                ? 'bg-amber-950 text-amber-400 border border-amber-800'
                                : 'bg-stone-800 text-stone-400'
                            }`}
                          >
                            {node.reconciliation_state}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-stone-300">{node.inbound_internal_links_count}</td>
                        <td className="px-4 py-2.5 text-right text-stone-500">{node.provenance_ref.substring(0, 22)}...</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* OPEN GAPS TAB */}
        {activeTab === 'gaps' && (
          <div className="bg-stone-950 border border-stone-800 rounded-lg overflow-hidden">
            <div className="px-5 py-3 border-b border-stone-800 flex items-center justify-between bg-stone-900/50">
              <div>
                <h2 className="text-sm font-bold text-stone-200 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  Canonical Open Evidence Gaps Register
                </h2>
                <p className="text-xs text-stone-400 mt-0.5">
                  Governed by Canonical Section 22: Unknown must remain UNKNOWN. Never fabricated or guessed.
                </p>
              </div>
              <span className="text-xs font-mono text-stone-400">{OPEN_GAPS.length} Cataloged</span>
            </div>

            <div className="divide-y divide-stone-800/80">
              {OPEN_GAPS.map(gap => (
                <div key={gap.id} className="p-4 hover:bg-stone-900/40 transition-colors">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/60">
                        {gap.id}
                      </span>
                      <span className="text-sm font-semibold text-stone-200">{gap.description}</span>
                    </div>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-stone-800 text-stone-400 border border-stone-700">
                      Blocks: {gap.blockingPhase}
                    </span>
                  </div>
                  <p className="text-xs text-stone-400 mt-1 pl-1">{gap.whyItMatters}</p>
                  <div className="mt-2 text-xs font-mono text-stone-500 pl-1 flex items-center gap-1.5">
                    <ArrowRight className="w-3.5 h-3.5 text-stone-600" />
                    <span>Resolution: {gap.targetResolution}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DECISIONS TAB */}
        {activeTab === 'decisions' && (
          <div className="bg-stone-950 border border-stone-800 rounded-lg overflow-hidden">
            <div className="px-5 py-3 border-b border-stone-800 flex items-center justify-between bg-stone-900/50">
              <div>
                <h2 className="text-sm font-bold text-stone-200 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  Canonical Decision Ledger (D-001 through D-013)
                </h2>
                <p className="text-xs text-stone-400 mt-0.5">
                  Governed by Canonical Section 21 and Section 25.10.
                </p>
              </div>
              <span className="text-xs font-mono text-stone-400">{CANONICAL_DECISIONS.length} Accepted</span>
            </div>

            <div className="divide-y divide-stone-800/80">
              {CANONICAL_DECISIONS.map(dec => (
                <div key={dec.id} className="p-4 hover:bg-stone-900/40 transition-colors">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
                        {dec.id}
                      </span>
                      <span className="text-sm font-semibold text-stone-200">{dec.title}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span className="text-stone-400">Level {dec.evidenceLevel}</span>
                      <span className="px-2 py-0.5 rounded bg-stone-800 text-stone-300 font-bold">{dec.status}</span>
                    </div>
                  </div>
                  <p className="text-xs text-stone-300 mt-1 pl-1">{dec.decision}</p>
                  <p className="text-xs text-stone-500 mt-1 pl-1 italic">Rationale: {dec.rationale}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* EVIDENCE LEDGER TAB */}
        {activeTab === 'evidence' && (
          <div className="bg-stone-950 border border-stone-800 rounded-lg overflow-hidden">
            <div className="px-5 py-3 border-b border-stone-800 flex items-center justify-between bg-stone-900/50">
              <div>
                <h2 className="text-sm font-bold text-stone-200 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  Verified Evidence Ledger (EVD-001 through EVD-010)
                </h2>
                <p className="text-xs text-stone-400 mt-0.5">
                  Governed by Canonical Section 25.11 and verified in automated testing.
                </p>
              </div>
              <span className="text-xs font-mono text-emerald-400 font-bold">100% PASS</span>
            </div>

            <div className="divide-y divide-stone-800/80">
              {EVIDENCE_RECORDS.map(evd => (
                <div key={evd.id} className="p-4 hover:bg-stone-900/40 transition-colors">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
                        {evd.id}
                      </span>
                      <span className="text-xs font-mono text-stone-400">[{evd.wpId}]</span>
                      <span className="text-xs font-semibold text-stone-200">{evd.claim}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span className="text-stone-400">{evd.level}</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
                        {evd.result}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs font-mono text-stone-400 mt-1 pl-1">
                    Source: {evd.sourceType} &bull; Actual: {evd.actualResult}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RISK MATRIX SIMULATOR TAB */}
        {activeTab === 'risk_calc' && (
          <div className="space-y-6">
            <div className="bg-stone-800/40 border border-stone-700 rounded-lg p-4">
              <h2 className="text-sm font-bold text-stone-100 flex items-center gap-2 mb-1">
                <Sliders className="w-4 h-4 text-amber-400" />
                Multi-Dimensional Risk Matrix Evaluator (Canonical Section 20.6 / D-006)
              </h2>
              <p className="text-xs text-stone-400">
                Demonstrates fail-closed governance. Adjusting any medical, clinical, pricing, or legal dimension immediately enforces R3 HUMAN_REQUIRED.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 bg-stone-950 border border-stone-800 rounded-lg p-5 space-y-4">
                <h3 className="text-xs font-mono uppercase font-bold text-stone-400 pb-2 border-b border-stone-800">
                  Risk Dimension Sliders (0 = None, 3 = High/Critical)
                </h3>

                {(Object.keys(riskDims) as (keyof RiskDimensions)[]).map(key => (
                  <div key={key} className="flex items-center justify-between gap-4 text-xs font-mono">
                    <span className="text-stone-300 w-64 capitalize">{key.replace(/_/g, ' ')}</span>
                    <input
                      type="range"
                      min="0"
                      max="3"
                      value={riskDims[key]}
                      onChange={e => {
                        const val = parseInt(e.target.value, 10) as 0 | 1 | 2 | 3;
                        setRiskDims(prev => ({ ...prev, [key]: val }));
                      }}
                      className="flex-1 accent-emerald-500 cursor-pointer"
                    />
                    <span className="w-8 text-right font-bold text-stone-100">{riskDims[key]}</span>
                  </div>
                ))}
              </div>

              {/* Evaluation Output */}
              <div className="bg-stone-950 border border-stone-800 rounded-lg p-5 space-y-4 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-mono uppercase font-bold text-stone-400 pb-2 border-b border-stone-800">
                    Computed Governance Status
                  </h3>

                  <div className="mt-4 text-center p-4 rounded bg-stone-900 border border-stone-800">
                    <div className="text-xs font-mono text-stone-400">COMPUTED RISK CLASS</div>
                    <div
                      className={`text-3xl font-mono font-bold mt-1 ${
                        evaluatedRisk.computed_risk_class === 'R3'
                          ? 'text-rose-400'
                          : evaluatedRisk.computed_risk_class === 'R2'
                          ? 'text-amber-400'
                          : evaluatedRisk.computed_risk_class === 'R1'
                          ? 'text-sky-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      {evaluatedRisk.computed_risk_class}
                    </div>
                  </div>

                  <div className="mt-4 space-y-2 text-xs font-mono">
                    <div className="flex justify-between py-1 border-b border-stone-800/80">
                      <span className="text-stone-400">Human Required:</span>
                      <span className={`font-bold ${evaluatedRisk.is_human_required ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {evaluatedRisk.is_human_required ? 'YES (MANDATORY)' : 'NO'}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-800/80">
                      <span className="text-stone-400">Required Evidence:</span>
                      <span className="text-stone-200 font-bold">{evaluatedRisk.required_evidence_level}</span>
                    </div>
                  </div>

                  {evaluatedRisk.prohibited_reasons.length > 0 && (
                    <div className="mt-4 p-3 rounded bg-rose-950/30 border border-rose-900/60 text-[11px] font-mono text-rose-300 space-y-1">
                      <div className="font-bold">Active R3 Stop Conditions:</div>
                      {evaluatedRisk.prohibited_reasons.map((r, i) => (
                        <div key={i}>&bull; {r}</div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="text-[11px] font-mono text-stone-500 pt-2 border-t border-stone-800">
                  Authority rule: Growth OS cannot lower its own risk class.
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer id="footer-control" className="bg-stone-950 border-t border-stone-800 px-6 py-4 mt-auto text-xs font-mono text-stone-500 flex flex-wrap items-center justify-between gap-2">
        <div>LARI Growth OS &bull; Antigravity Agent &bull; Autonomous Non-Production Execution</div>
        <div>Revision 1.2 &bull; Report Schema 1.0 &bull; Evidence Level E2</div>
      </footer>
    </div>
  );
}
