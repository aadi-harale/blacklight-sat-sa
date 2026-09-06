export type Verdict = 'supported' | 'unsupported' | 'review';

export type AlertRecord = {
  alert_id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  asset_id: string;
  opened_at: string;
  closed_at: string;
  triaged_at?: string;
  investigated_at?: string;
  enriched_at?: string;
  escalated_at?: string;
  automation_run_id?: string;
  closure_reason?: string;
  action_signature?: string;
  exception_code?: string;
};

export type EvidenceNodeStatus = 'observed' | 'missing' | 'conditional';

export type EvidenceNode = {
  id: string;
  label: string;
  detail: string;
  status: EvidenceNodeStatus;
  count?: number;
};

export type Explanation = {
  id: string;
  label: string;
  support: number;
  contradiction: number;
  note: string;
};

export type ClearingPath = {
  id: string;
  title: string;
  detail: string;
  affectedCount: number;
  status: 'available' | 'partial' | 'missing';
};

export type Finding = {
  id: string;
  claimId: string;
  title: string;
  statement: string;
  shortLabel: string;
  verdict: Verdict;
  severity: 'critical' | 'high' | 'moderate';
  scope: string;
  finding: string;
  rationale: string;
  numerator: number;
  denominator: number;
  metricLabel: string;
  metricSuffix?: string;
  missingCount: number;
  nodes: EvidenceNode[];
  explanations: Explanation[];
  clearingPaths: ClearingPath[];
  nextEvidence: {
    title: string;
    detail: string;
    couldResolve: number;
  };
  sampleAlertIds: string[];
  tags: string[];
};

export type DatasetMeta = {
  name: string;
  source: 'demo' | 'upload';
  recordCount: number;
  declaredCriticalAssets: number;
  claimedProtectedAssets: number;
  observedAssets: number;
  loadedAt: string;
  fingerprint?: string;
};

export type Assessment = {
  dataset: DatasetMeta;
  findings: Finding[];
  summary: {
    unsupported: number;
    review: number;
    supported: number;
    missingEvidence: number;
  };
};
