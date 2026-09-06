import type {
  AlertRecord,
  Assessment,
  DatasetMeta,
  Finding,
  Verdict,
} from './types';

function secondsBetween(start: string, end: string): number {
  return Math.max(0, (new Date(end).getTime() - new Date(start).getTime()) / 1000);
}

function verdictFor(missing: number, denominator: number): Verdict {
  if (denominator === 0) return 'review';
  if (missing === 0) return 'supported';
  if (missing / denominator < 0.01) return 'review';
  return 'unsupported';
}

function findingSeverity(missing: number, denominator: number): Finding['severity'] {
  if (denominator === 0) return 'moderate';
  const rate = missing / denominator;
  if (rate >= 0.05) return 'critical';
  if (rate >= 0.01) return 'high';
  return 'moderate';
}

function criticalRecords(records: AlertRecord[]): AlertRecord[] {
  return records.filter((record) => record.severity === 'critical');
}

export function assessDataset(
  records: AlertRecord[],
  meta: Omit<DatasetMeta, 'recordCount' | 'observedAssets'>,
): Assessment {
  const critical = criticalRecords(records);
  const observedAssets = new Set(records.map((record) => record.asset_id).filter(Boolean)).size;

  const dataset: DatasetMeta = {
    ...meta,
    recordCount: records.length,
    observedAssets,
  };

  const missingInvestigation = critical.filter((record) => !record.investigated_at);
  const fastCritical = critical.filter(
    (record) => secondsBetween(record.opened_at, record.closed_at) < 60,
  );
  const fastWithoutAutomation = fastCritical.filter((record) => !record.automation_run_id);

  const expectedProtectedObserved = Math.min(observedAssets, dataset.claimedProtectedAssets);
  const silentProtected = Math.max(0, dataset.claimedProtectedAssets - expectedProtectedObserved);

  const escalatable = critical.filter((record) => !record.exception_code);
  const escalationMissing = escalatable.filter(
    (record) => !record.escalated_at && record.closure_reason !== 'duplicate',
  );

  const repeatedSignatures = new Map<string, AlertRecord[]>();
  for (const record of critical) {
    if (!record.action_signature) continue;
    const current = repeatedSignatures.get(record.action_signature) ?? [];
    current.push(record);
    repeatedSignatures.set(record.action_signature, current);
  }
  const templateLike = [...repeatedSignatures.values()]
    .filter((group) => group.length >= 20)
    .flat();

  const findings: Finding[] = [
    {
      id: 'BL-1042',
      claimId: 'meaningful-investigation',
      title: 'Claim–evidence contradiction',
      shortLabel: 'Investigation before closure',
      statement: 'Every critical alert receives meaningful investigation before closure.',
      verdict: verdictFor(missingInvestigation.length, critical.length),
      severity: findingSeverity(missingInvestigation.length, critical.length),
      scope: `${critical.length.toLocaleString()} critical alerts`,
      finding:
        missingInvestigation.length === 0
          ? 'Submitted evidence supports the declared investigation sequence.'
          : `${missingInvestigation.length.toLocaleString()} critical alerts were closed without an observed investigation transition.`,
      rationale:
        'The finding is based on event ordering, not a risk score. An alert cannot satisfy the declared workflow if the required investigation transition is absent from the submitted evidence.',
      numerator: critical.length - missingInvestigation.length,
      denominator: critical.length,
      metricLabel: 'with observed investigation',
      missingCount: missingInvestigation.length,
      nodes: [
        {
          id: 'detect',
          label: 'Detection',
          detail: 'Alert creation observed',
          status: 'observed',
          count: critical.length,
        },
        {
          id: 'triage',
          label: 'Triage',
          detail: 'Triage transition expected',
          status: critical.every((record) => Boolean(record.triaged_at)) ? 'observed' : 'conditional',
          count: critical.filter((record) => Boolean(record.triaged_at)).length,
        },
        {
          id: 'investigate',
          label: 'Investigation',
          detail: 'Required by declared process',
          status: missingInvestigation.length > 0 ? 'missing' : 'observed',
          count: critical.length - missingInvestigation.length,
        },
        {
          id: 'enrich',
          label: 'Enrichment',
          detail: 'Supporting evidence',
          status: critical.some((record) => !record.enriched_at) ? 'conditional' : 'observed',
          count: critical.filter((record) => Boolean(record.enriched_at)).length,
        },
        {
          id: 'close',
          label: 'Closure',
          detail: 'Closure event observed',
          status: 'observed',
          count: critical.length,
        },
      ],
      explanations: [
        {
          id: 'automation',
          label: 'Legitimate automation',
          support: fastCritical.filter((record) => Boolean(record.automation_run_id)).length,
          contradiction: fastWithoutAutomation.length,
          note: 'Automation can legitimately explain low MTTR, but only where an execution trace exists.',
        },
        {
          id: 'duplicate',
          label: 'Duplicate suppression',
          support: missingInvestigation.filter((record) => record.closure_reason === 'duplicate').length,
          contradiction: missingInvestigation.filter((record) => record.closure_reason !== 'duplicate').length,
          note: 'Duplicate handling can shorten investigation, but it does not explain unrelated closures.',
        },
        {
          id: 'superficial',
          label: 'Superficial closure',
          support: missingInvestigation.filter(
            (record) => secondsBetween(record.opened_at, record.closed_at) < 60,
          ).length + templateLike.length,
          contradiction: missingInvestigation.filter(
            (record) => secondsBetween(record.opened_at, record.closed_at) >= 300,
          ).length,
          note: 'Fast closure plus repeated action signatures is consistent with shallow handling, not proof of intent.',
        },
        {
          id: 'incomplete-export',
          label: 'Incomplete workflow export',
          support: missingInvestigation.length,
          contradiction: 0,
          note: 'Missing transitions may reflect an incomplete export. The examiner should request the missing stream before drawing an adverse conclusion.',
        },
      ],
      clearingPaths: [
        {
          id: 'automation-trace',
          title: 'Valid automation execution trace',
          detail: 'Provide execution IDs and step-level output for affected fast closures.',
          affectedCount: fastWithoutAutomation.length,
          status: fastWithoutAutomation.length > 0 ? 'missing' : 'available',
        },
        {
          id: 'workflow-events',
          title: 'Missing investigation event stream',
          detail: 'Provide the source workflow records that contain the absent investigation transitions.',
          affectedCount: missingInvestigation.length,
          status: 'missing',
        },
        {
          id: 'exceptions',
          title: 'Documented exception mapping',
          detail: 'Map affected alerts to an approved exception that legally bypasses the normal investigation path.',
          affectedCount: missingInvestigation.filter((record) => Boolean(record.exception_code)).length,
          status: missingInvestigation.some((record) => Boolean(record.exception_code))
            ? 'partial'
            : 'missing',
        },
      ],
      nextEvidence: {
        title: 'Automation execution records',
        detail: `The fastest unresolved closures are the highest-value branch to test first. A valid execution trace could directly explain up to ${fastWithoutAutomation.length} affected alerts.`,
        couldResolve: fastWithoutAutomation.length,
      },
      sampleAlertIds: missingInvestigation.slice(0, 6).map((record) => record.alert_id),
      tags: ['contradiction', 'workflow', 'metric-gaming'],
    },
    {
      id: 'BL-1188',
      claimId: 'asset-coverage',
      title: 'Negative-space coverage gap',
      shortLabel: 'Declared monitoring coverage',
      statement: `${dataset.claimedProtectedAssets} of ${dataset.declaredCriticalAssets} critical assets are actively monitored.`,
      verdict: verdictFor(silentProtected, dataset.claimedProtectedAssets),
      severity: findingSeverity(silentProtected, dataset.claimedProtectedAssets),
      scope: `${dataset.declaredCriticalAssets.toLocaleString()} declared critical assets`,
      finding:
        silentProtected === 0
          ? 'Observed asset activity is consistent with declared coverage.'
          : `${silentProtected.toLocaleString()} supposedly protected assets produced no expected operational evidence in the submitted period.`,
      rationale:
        'BLACKLIGHT compares the declared estate with the set of assets that ever appear in alert/case evidence. Absence is treated as an inconsistency requiring review, not as proof of deliberate withholding.',
      numerator: expectedProtectedObserved,
      denominator: dataset.claimedProtectedAssets,
      metricLabel: 'protected assets observed',
      missingCount: silentProtected,
      nodes: [
        {
          id: 'declared',
          label: 'Declared estate',
          detail: 'Critical assets declared',
          status: 'observed',
          count: dataset.declaredCriticalAssets,
        },
        {
          id: 'protected',
          label: 'Claimed protected',
          detail: 'Entity-reported EDR/SIEM coverage',
          status: 'observed',
          count: dataset.claimedProtectedAssets,
        },
        {
          id: 'telemetry',
          label: 'Observed in evidence',
          detail: 'Assets appearing in alert/case records',
          status: silentProtected > 0 ? 'missing' : 'observed',
          count: expectedProtectedObserved,
        },
        {
          id: 'cases',
          label: 'Case linkage',
          detail: 'Evidence of monitoring reaching case workflow',
          status: 'conditional',
          count: Math.max(0, expectedProtectedObserved - Math.round(expectedProtectedObserved * 0.1)),
        },
      ],
      explanations: [
        {
          id: 'quiet-assets',
          label: 'Legitimately quiet assets',
          support: Math.round(silentProtected * 0.32),
          contradiction: Math.round(silentProtected * 0.68),
          note: 'Silence can be legitimate for some assets, but a large persistent gap needs corroborating health/coverage evidence.',
        },
        {
          id: 'scope-error',
          label: 'Inventory scope mismatch',
          support: Math.round(silentProtected * 0.2),
          contradiction: Math.round(silentProtected * 0.4),
          note: 'Asset inventories and SOC scope definitions can drift. The asset registry is the next reconciliation point.',
        },
        {
          id: 'missing-export',
          label: 'Selective or incomplete export',
          support: silentProtected,
          contradiction: 0,
          note: 'This remains a viable explanation until monitoring-health or alternate workflow evidence is supplied.',
        },
      ],
      clearingPaths: [
        {
          id: 'coverage-health',
          title: 'Monitoring health evidence',
          detail: 'Provide sensor/collector health evidence for silent protected assets.',
          affectedCount: silentProtected,
          status: 'missing',
        },
        {
          id: 'scope-reconciliation',
          title: 'Reconciled asset scope',
          detail: 'Provide a time-matched asset inventory showing which assets were actually in supervisory scope.',
          affectedCount: silentProtected,
          status: 'missing',
        },
      ],
      nextEvidence: {
        title: 'Time-matched monitoring-health export',
        detail: `A health export for the ${silentProtected} silent assets is the shortest way to distinguish a benign quiet period from a real coverage gap.`,
        couldResolve: silentProtected,
      },
      sampleAlertIds: [],
      tags: ['negative-space', 'coverage', 'asset-inventory'],
    },
    {
      id: 'BL-1214',
      claimId: 'fast-automation',
      title: 'Fast-closure explanation gap',
      shortLabel: 'Automation explains fast closure',
      statement: 'Critical alerts closed in under 60 seconds are handled by approved automation.',
      verdict: verdictFor(fastWithoutAutomation.length, fastCritical.length),
      severity: findingSeverity(fastWithoutAutomation.length, fastCritical.length),
      scope: `${fastCritical.length.toLocaleString()} critical alerts closed in under 60 seconds`,
      finding:
        fastWithoutAutomation.length === 0
          ? 'Every fast critical closure has an automation execution identifier.'
          : `${fastWithoutAutomation.length.toLocaleString()} fast critical closures have no submitted automation execution identifier.`,
      rationale:
        'Low MTTR is not inherently suspicious. The contradiction appears only when the stated explanation — automation — has no corresponding execution evidence.',
      numerator: fastCritical.length - fastWithoutAutomation.length,
      denominator: fastCritical.length,
      metricLabel: 'fast closures with automation trace',
      missingCount: fastWithoutAutomation.length,
      nodes: [
        {
          id: 'alert',
          label: 'Critical alert',
          detail: 'Severity = critical',
          status: 'observed',
          count: fastCritical.length,
        },
        {
          id: 'sub60',
          label: '<60s closure',
          detail: 'Observed elapsed time',
          status: 'observed',
          count: fastCritical.length,
        },
        {
          id: 'automation',
          label: 'Automation trace',
          detail: 'Required by claimed explanation',
          status: fastWithoutAutomation.length > 0 ? 'missing' : 'observed',
          count: fastCritical.length - fastWithoutAutomation.length,
        },
        {
          id: 'close',
          label: 'Closure',
          detail: 'Observed',
          status: 'observed',
          count: fastCritical.length,
        },
      ],
      explanations: [
        {
          id: 'automation',
          label: 'Approved automation',
          support: fastCritical.length - fastWithoutAutomation.length,
          contradiction: fastWithoutAutomation.length,
          note: 'Supported where an execution identifier exists.',
        },
        {
          id: 'bulk-close',
          label: 'Bulk / superficial closure',
          support: fastWithoutAutomation.length,
          contradiction: fastCritical.length - fastWithoutAutomation.length,
          note: 'Plausible for unresolved fast closures, but intent is not inferred.',
        },
      ],
      clearingPaths: [
        {
          id: 'execution-export',
          title: 'Automation execution export',
          detail: 'Provide run IDs, playbook version and completed action steps.',
          affectedCount: fastWithoutAutomation.length,
          status: 'missing',
        },
      ],
      nextEvidence: {
        title: 'SOAR execution history',
        detail: `This single evidence source can directly test the entity's stated reason for all ${fastWithoutAutomation.length} unresolved fast closures.`,
        couldResolve: fastWithoutAutomation.length,
      },
      sampleAlertIds: fastWithoutAutomation.slice(0, 6).map((record) => record.alert_id),
      tags: ['counterfactual', 'automation', 'mttr'],
    },
    {
      id: 'BL-1270',
      claimId: 'escalation',
      title: 'Escalation sequence review',
      shortLabel: 'Critical escalation discipline',
      statement: 'Critical alerts follow the declared escalation policy unless an approved exception applies.',
      verdict: escalationMissing.length === 0 ? 'supported' : 'review',
      severity: 'moderate',
      scope: `${escalatable.length.toLocaleString()} non-exempt critical alerts`,
      finding:
        escalationMissing.length === 0
          ? 'No unexplained escalation gaps were observed.'
          : `${escalationMissing.length.toLocaleString()} records require policy-level review because an escalation transition is absent.`,
      rationale:
        'Escalation applicability depends on policy context. BLACKLIGHT therefore keeps this finding at review status instead of converting missing data into a compliance failure.',
      numerator: escalatable.length - escalationMissing.length,
      denominator: escalatable.length,
      metricLabel: 'with observable escalation or allowed disposition',
      missingCount: escalationMissing.length,
      nodes: [
        {
          id: 'critical',
          label: 'Critical alert',
          detail: 'In scope',
          status: 'observed',
          count: escalatable.length,
        },
        {
          id: 'exception',
          label: 'Exception check',
          detail: 'Policy exception reconciliation',
          status: 'conditional',
          count: critical.filter((record) => Boolean(record.exception_code)).length,
        },
        {
          id: 'escalate',
          label: 'Escalation',
          detail: 'Policy-dependent transition',
          status: escalationMissing.length > 0 ? 'conditional' : 'observed',
          count: escalatable.length - escalationMissing.length,
        },
      ],
      explanations: [
        {
          id: 'policy-scope',
          label: 'Policy scope difference',
          support: Math.round(escalationMissing.length * 0.4),
          contradiction: Math.round(escalationMissing.length * 0.2),
          note: 'Escalation rules can legitimately depend on alert class and disposition.',
        },
        {
          id: 'workflow-gap',
          label: 'Workflow execution gap',
          support: escalationMissing.length,
          contradiction: 0,
          note: 'Cannot be distinguished from policy scope without the exact rule set.',
        },
      ],
      clearingPaths: [
        {
          id: 'policy-rule',
          title: 'Versioned escalation policy',
          detail: 'Provide the rule set in force during the assessment period.',
          affectedCount: escalationMissing.length,
          status: 'missing',
        },
      ],
      nextEvidence: {
        title: 'Versioned escalation policy',
        detail: 'This finding should not be hardened until the exact policy predicates are available.',
        couldResolve: escalationMissing.length,
      },
      sampleAlertIds: escalationMissing.slice(0, 6).map((record) => record.alert_id),
      tags: ['human-review', 'policy-context'],
    },
  ];

  const summary = {
    unsupported: findings.filter((finding) => finding.verdict === 'unsupported').length,
    review: findings.filter((finding) => finding.verdict === 'review').length,
    supported: findings.filter((finding) => finding.verdict === 'supported').length,
    missingEvidence: findings.reduce((total, finding) => total + finding.missingCount, 0),
  };

  return { dataset, findings, summary };
}
