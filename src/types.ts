export interface WorkPackageItem {
  id: string;
  title: string;
  phase: string;
  dependencies: string;
  riskClass: 'R0' | 'R1' | 'R2' | 'R3';
  status: 'ACCEPTED_COMPLETE' | 'READY' | 'PENDING';
  exitEvidence: string;
}

export interface GapItem {
  id: string;
  description: string;
  whyItMatters: string;
  status: string;
  blockingPhase: string;
  targetResolution: string;
}

export interface DecisionItem {
  id: string;
  title: string;
  status: string;
  decision: string;
  rationale: string;
  evidenceLevel: string;
  riskClass: string;
}

export interface EvidenceItem {
  id: string;
  wpId: string;
  claim: string;
  level: string;
  sourceType: string;
  result: 'PASS' | 'FAIL' | 'HOLD';
  actualResult: string;
}
