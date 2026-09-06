'use client';

import {
  AlertTriangle,
  ArrowDownToLine,
  Braces,
  Check,
  ChevronDown,
  ChevronRight,
  CircleDot,
  Database,
  FileText,
  Fingerprint,
  Gauge,
  GitBranch,
  HardDrive,
  Info,
  KeyRound,
  Loader2,
  Play,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  Upload,
  WifiOff,
  X,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { BrandMark } from './BrandMark';
import { FlowGraph } from './FlowGraph';
import { assessDataset } from '@/lib/engine';
import { makeDemoRecords, DEMO_ASSET_PROFILE } from '@/lib/demo';
import { parseAlertCsv, parseAlertJson } from '@/lib/csv';
import { datasetFingerprint, merkleRoot } from '@/lib/crypto';
import type { AlertRecord, Assessment, Finding } from '@/lib/types';

function verdictLabel(verdict: Finding['verdict']) {
  if (verdict === 'unsupported') return 'UNSUPPORTED';
  if (verdict === 'supported') return 'SUPPORTED';
  return 'REVIEW';
}

function formatPct(numerator: number, denominator: number): string {
  if (denominator === 0) return 'n/a';
  return `${((numerator / denominator) * 100).toFixed(1)}%`;
}

function downloadText(name: string, text: string, type = 'text/plain') {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = name;
  anchor.click();
  URL.revokeObjectURL(url);
}

function FindingRow({
  finding,
  active,
  onClick,
}: {
  finding: Finding;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={`finding-row ${active ? 'finding-row--active' : ''}`}
      onClick={onClick}
    >
      <span className={`finding-row__status finding-row__status--${finding.verdict}`}>
        {finding.verdict === 'supported' ? <Check size={13} /> : finding.verdict === 'review' ? <Info size={13} /> : <X size={13} />}
      </span>
      <span className="finding-row__body">
        <strong>{finding.shortLabel}</strong>
        <small>{finding.id} · {finding.scope}</small>
      </span>
      <ChevronRight size={14} />
    </button>
  );
}

export function Workbench() {
  const demoRecords = useMemo(() => makeDemoRecords(), []);
  const [records, setRecords] = useState<AlertRecord[]>(demoRecords);
  const [datasetName, setDatasetName] = useState('BLACKLIGHT Synthetic Validation Pack');
  const [source, setSource] = useState<'demo' | 'upload'>('demo');
  const [declaredAssets, setDeclaredAssets] = useState(DEMO_ASSET_PROFILE.declaredCriticalAssets);
  const [claimedProtectedAssets, setClaimedProtectedAssets] = useState(DEMO_ASSET_PROFILE.claimedProtectedAssets);
  const [assessment, setAssessment] = useState<Assessment>(() =>
    assessDataset(demoRecords, {
      name: 'BLACKLIGHT Synthetic Validation Pack',
      source: 'demo',
      declaredCriticalAssets: DEMO_ASSET_PROFILE.declaredCriticalAssets,
      claimedProtectedAssets: DEMO_ASSET_PROFILE.claimedProtectedAssets,
      loadedAt: new Date().toISOString(),
    }),
  );
  const [selectedId, setSelectedId] = useState('BL-1042');
  const [running, setRunning] = useState(false);
  const [fingerprint, setFingerprint] = useState('');
  const [merkle, setMerkle] = useState('');
  const [cryptoBusy, setCryptoBusy] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [dropActive, setDropActive] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const selected = assessment.findings.find((finding) => finding.id === selectedId) ?? assessment.findings[0];

  useEffect(() => {
    let cancelled = false;
    datasetFingerprint(records).then((hash) => {
      if (!cancelled) setFingerprint(hash);
    });
    setMerkle('');
    return () => {
      cancelled = true;
    };
  }, [records]);

  const runAssessment = useCallback(() => {
    setRunning(true);
    window.setTimeout(() => {
      const next = assessDataset(records, {
        name: datasetName,
        source,
        declaredCriticalAssets: declaredAssets,
        claimedProtectedAssets: Math.min(claimedProtectedAssets, declaredAssets),
        loadedAt: new Date().toISOString(),
        fingerprint,
      });
      setAssessment(next);
      setSelectedId(next.findings[0]?.id ?? '');
      setRunning(false);
    }, 650);
  }, [claimedProtectedAssets, datasetName, declaredAssets, fingerprint, records, source]);

  const loadDemo = useCallback(() => {
    const nextRecords = makeDemoRecords();
    setRecords(nextRecords);
    setDatasetName('BLACKLIGHT Synthetic Validation Pack');
    setSource('demo');
    setDeclaredAssets(DEMO_ASSET_PROFILE.declaredCriticalAssets);
    setClaimedProtectedAssets(DEMO_ASSET_PROFILE.claimedProtectedAssets);
    setUploadError('');
    const next = assessDataset(nextRecords, {
      name: 'BLACKLIGHT Synthetic Validation Pack',
      source: 'demo',
      declaredCriticalAssets: DEMO_ASSET_PROFILE.declaredCriticalAssets,
      claimedProtectedAssets: DEMO_ASSET_PROFILE.claimedProtectedAssets,
      loadedAt: new Date().toISOString(),
    });
    setAssessment(next);
    setSelectedId('BL-1042');
  }, []);

  const handleFile = useCallback(async (file: File) => {
    setUploadError('');
    try {
      const text = await file.text();
      const parsed = file.name.toLowerCase().endsWith('.json')
        ? parseAlertJson(text)
        : parseAlertCsv(text);
      setRecords(parsed);
      setDatasetName(file.name);
      setSource('upload');
      const uniqueAssets = new Set(parsed.map((row) => row.asset_id)).size;
      setDeclaredAssets(Math.max(uniqueAssets, 1));
      setClaimedProtectedAssets(Math.max(uniqueAssets, 1));
      const next = assessDataset(parsed, {
        name: file.name,
        source: 'upload',
        declaredCriticalAssets: Math.max(uniqueAssets, 1),
        claimedProtectedAssets: Math.max(uniqueAssets, 1),
        loadedAt: new Date().toISOString(),
      });
      setAssessment(next);
      setSelectedId(next.findings[0]?.id ?? '');
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Could not parse the file.');
    }
  }, []);

  const generateMerkle = useCallback(async () => {
    setCryptoBusy(true);
    try {
      const root = await merkleRoot(records);
      setMerkle(root);
    } finally {
      setCryptoBusy(false);
    }
  }, [records]);

  const exportCapsule = useCallback(async () => {
    let root = merkle;
    if (!root) {
      setCryptoBusy(true);
      try {
        root = await merkleRoot(records);
        setMerkle(root);
      } finally {
        setCryptoBusy(false);
      }
    }

    const capsule = {
      schema: 'blacklight.finding-capsule.v1',
      generated_at: new Date().toISOString(),
      finding: {
        id: selected.id,
        title: selected.title,
        statement: selected.statement,
        verdict: selected.verdict,
        rationale: selected.rationale,
        numerator: selected.numerator,
        denominator: selected.denominator,
        missing_count: selected.missingCount,
        sample_alert_ids: selected.sampleAlertIds,
      },
      dataset: {
        name: assessment.dataset.name,
        records: assessment.dataset.recordCount,
        fingerprint_sha256: fingerprint,
        merkle_root_sha256: root,
      },
      ruleset: 'blacklight-sat-sa/0.1.0',
      counterfactual_clearing_paths: selected.clearingPaths,
      next_best_evidence: selected.nextEvidence,
    };

    downloadText(
      `${selected.id.toLowerCase()}-reproducibility-capsule.json`,
      JSON.stringify(capsule, null, 2),
      'application/json',
    );
  }, [assessment.dataset, fingerprint, merkle, records, selected]);

  const exportDossier = useCallback(() => {
    const lines = [
      '# BLACKLIGHT Supervisory Assessment Dossier',
      '',
      `Dataset: ${assessment.dataset.name}`,
      `Generated: ${new Date().toISOString()}`,
      `Dataset SHA-256: ${fingerprint || 'pending'}`,
      '',
      '## Summary',
      `- Unsupported findings: ${assessment.summary.unsupported}`,
      `- Review findings: ${assessment.summary.review}`,
      `- Supported findings: ${assessment.summary.supported}`,
      `- Missing evidence references: ${assessment.summary.missingEvidence}`,
      '',
      ...assessment.findings.flatMap((finding) => [
        `## ${finding.id} — ${finding.shortLabel}`,
        `Verdict: ${verdictLabel(finding.verdict)}`,
        '',
        `Claim: ${finding.statement}`,
        '',
        `Finding: ${finding.finding}`,
        '',
        `Rationale: ${finding.rationale}`,
        '',
        `Next evidence to request: ${finding.nextEvidence.title}`,
        finding.nextEvidence.detail,
        '',
      ]),
      '---',
      'BLACKLIGHT does not replace supervisory judgement. Findings identify evidence contradictions and unresolved gaps for examiner review.',
    ];

    downloadText('blacklight-supervisory-dossier.md', lines.join('\n'), 'text/markdown');
  }, [assessment, fingerprint]);

  return (
    <main className="workbench">
      <header className="workbench-topbar">
        <div className="workbench-topbar__left">
          <Link href="/" className="brand-link"><BrandMark compact /></Link>
          <div className="topbar-divider" />
          <div className="dataset-title">
            <strong>{assessment.dataset.name}</strong>
            <span>
              {assessment.dataset.recordCount.toLocaleString()} rows · {assessment.dataset.source === 'demo' ? 'synthetic benchmark' : 'local upload'}
            </span>
          </div>
        </div>
        <div className="workbench-topbar__right">
          <span className="offline-badge"><WifiOff size={13} /> LOCAL / AIR-GAP MODE</span>
          <button type="button" className="button button--ghost button--small" onClick={exportDossier}>
            <FileText size={14} /> Export dossier
          </button>
        </div>
      </header>

      <div className="workbench-grid">
        <aside className="left-rail">
          <div className="rail-section">
            <div className="rail-section__heading">
              <span>ASSESSMENT INPUT</span>
              <Database size={14} />
            </div>

            <input
              ref={fileRef}
              className="sr-only"
              type="file"
              accept=".csv,.json,text/csv,application/json"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void handleFile(file);
              }}
            />

            <button
              type="button"
              className={`dropzone ${dropActive ? 'dropzone--active' : ''}`}
              onDragEnter={(event) => {
                event.preventDefault();
                setDropActive(true);
              }}
              onDragOver={(event) => event.preventDefault()}
              onDragLeave={(event) => {
                event.preventDefault();
                setDropActive(false);
              }}
              onDrop={(event) => {
                event.preventDefault();
                setDropActive(false);
                const file = event.dataTransfer.files?.[0];
                if (file) void handleFile(file);
              }}
              onClick={() => fileRef.current?.click()}
            >
              <Upload size={17} />
              <span>Drop evidence export</span>
              <small>CSV or JSON · never leaves this browser</small>
            </button>

            {uploadError ? <div className="upload-error"><AlertTriangle size={13} /> {uploadError}</div> : null}

            <button type="button" className="text-button" onClick={loadDemo}>
              <Sparkles size={13} /> Reload synthetic validation pack
            </button>

            <div className="asset-input-grid">
              <label>
                <span>Declared critical assets</span>
                <input
                  type="number"
                  min={1}
                  value={declaredAssets}
                  onChange={(event) => setDeclaredAssets(Math.max(1, Number(event.target.value)))}
                />
              </label>
              <label>
                <span>Claimed protected</span>
                <input
                  type="number"
                  min={0}
                  max={declaredAssets}
                  value={claimedProtectedAssets}
                  onChange={(event) =>
                    setClaimedProtectedAssets(Math.max(0, Number(event.target.value)))
                  }
                />
              </label>
            </div>

            <button
              type="button"
              className="button button--primary button--full"
              onClick={runAssessment}
              disabled={running}
            >
              {running ? <Loader2 className="spin" size={16} /> : <Play size={15} />}
              {running ? 'Reconstructing evidence…' : 'Run deterministic assessment'}
            </button>
          </div>

          <div className="rail-section rail-section--findings">
            <div className="rail-section__heading">
              <span>SUPERVISORY FINDINGS</span>
              <span className="rail-count">{assessment.findings.length}</span>
            </div>
            <div className="finding-list">
              {assessment.findings.map((finding) => (
                <FindingRow
                  key={finding.id}
                  finding={finding}
                  active={selected.id === finding.id}
                  onClick={() => setSelectedId(finding.id)}
                />
              ))}
            </div>
          </div>

          <div className="rail-section rail-section--bottom">
            <div className="rail-section__heading"><span>DATASET FINGERPRINT</span><Fingerprint size={14} /></div>
            <code className="fingerprint">{fingerprint ? `${fingerprint.slice(0, 18)}…${fingerprint.slice(-10)}` : 'calculating…'}</code>
            <p className="rail-note">SHA-256 over the local normalized evidence set.</p>
          </div>
        </aside>

        <section className="center-stage">
          <div className="stage-toolbar">
            <div className="stage-toolbar__crumbs">
              <span>CLAIM</span>
              <ChevronRight size={12} />
              <strong>{selected.id}</strong>
              <ChevronRight size={12} />
              <span>RECONSTRUCTION</span>
            </div>
            <div className={`verdict-pill verdict-pill--${selected.verdict}`}>
              {selected.verdict === 'unsupported' ? <X size={13} /> : selected.verdict === 'supported' ? <Check size={13} /> : <Info size={13} />}
              {verdictLabel(selected.verdict)}
            </div>
          </div>

          <div className="stage-scroll">
            <section className="claim-banner">
              <div className="claim-banner__meta">
                <span>ENTITY DECLARATION</span>
                <span>{selected.scope}</span>
              </div>
              <blockquote>“{selected.statement}”</blockquote>
              <div className="claim-banner__metric">
                <div>
                  <strong>{formatPct(selected.numerator, selected.denominator)}</strong>
                  <span>{selected.metricLabel}</span>
                </div>
                <Gauge size={22} />
              </div>
            </section>

            <FlowGraph nodes={selected.nodes} title={selected.shortLabel} />

            <section className={`finding-hero finding-hero--${selected.verdict}`}>
              <div className="finding-hero__icon">
                {selected.verdict === 'unsupported' ? <X size={22} /> : selected.verdict === 'supported' ? <Check size={22} /> : <Info size={22} />}
              </div>
              <div className="finding-hero__copy">
                <span>{selected.title}</span>
                <h2>{selected.finding}</h2>
                <p>{selected.rationale}</p>
              </div>
              <div className="finding-hero__number">
                <strong>{selected.missingCount.toLocaleString()}</strong>
                <span>unresolved evidence gaps</span>
              </div>
            </section>

            <section className="matrix-card">
              <div className="panel-heading">
                <div>
                  <span className="panel-kicker">COMPETING EXPLANATIONS</span>
                  <h3>What can currently explain the observation?</h3>
                </div>
                <GitBranch size={17} />
              </div>

              <div className="matrix-table">
                <div className="matrix-table__header">
                  <span>Hypothesis</span><span>Supports</span><span>Contradicts</span>
                </div>
                {selected.explanations.map((item) => {
                  const total = Math.max(1, item.support + item.contradiction);
                  return (
                    <details className="matrix-row" key={item.id}>
                      <summary>
                        <span className="matrix-row__name"><ChevronDown size={13} /> {item.label}</span>
                        <span>
                          <i className="matrix-bar"><b style={{ width: `${(item.support / total) * 100}%` }} /></i>
                          <em>{item.support}</em>
                        </span>
                        <span>
                          <i className="matrix-bar matrix-bar--negative"><b style={{ width: `${(item.contradiction / total) * 100}%` }} /></i>
                          <em>{item.contradiction}</em>
                        </span>
                      </summary>
                      <p>{item.note}</p>
                    </details>
                  );
                })}
              </div>
            </section>
          </div>
        </section>

        <aside className="right-panel">
          <div className="right-panel__scroll">
            <section className="inspector-block">
              <div className="inspector-heading">
                <div><span>COUNTERFACTUAL CLEARING</span><strong>What would change this finding?</strong></div>
                <ShieldCheck size={17} />
              </div>
              <div className="clearing-list">
                {selected.clearingPaths.map((path) => (
                  <article className="clearing-item" key={path.id}>
                    <span className={`clearing-item__status clearing-item__status--${path.status}`}>
                      {path.status === 'available' ? <Check size={12} /> : path.status === 'partial' ? <CircleDot size={12} /> : <X size={12} />}
                    </span>
                    <div>
                      <strong>{path.title}</strong>
                      <p>{path.detail}</p>
                      <small>{path.affectedCount.toLocaleString()} affected records</small>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="inspector-block inspector-block--accent">
              <div className="inspector-heading">
                <div><span>NEXT-BEST EVIDENCE</span><strong>{selected.nextEvidence.title}</strong></div>
                <ScanSearch size={17} />
              </div>
              <p className="inspector-copy">{selected.nextEvidence.detail}</p>
              <div className="resolve-meter">
                <span>Could directly resolve</span>
                <strong>{selected.nextEvidence.couldResolve.toLocaleString()} records</strong>
              </div>
            </section>

            <section className="inspector-block">
              <div className="inspector-heading">
                <div><span>EVIDENCE REFERENCES</span><strong>Sample records behind this finding</strong></div>
                <Braces size={17} />
              </div>
              {selected.sampleAlertIds.length ? (
                <div className="evidence-id-grid">
                  {selected.sampleAlertIds.map((id) => <code key={id}>{id}</code>)}
                </div>
              ) : (
                <p className="inspector-copy">This finding is aggregate and does not depend on a single alert row.</p>
              )}
            </section>

            <section className="inspector-block">
              <div className="inspector-heading">
                <div><span>REPRODUCIBILITY</span><strong>Finding capsule</strong></div>
                <KeyRound size={17} />
              </div>
              <div className="receipt">
                <div><span>Ruleset</span><strong>blacklight-sat-sa/0.1.0</strong></div>
                <div><span>Dataset hash</span><code>{fingerprint ? `${fingerprint.slice(0, 14)}…` : 'pending'}</code></div>
                <div><span>Merkle root</span><code>{merkle ? `${merkle.slice(0, 14)}…` : 'not generated'}</code></div>
                <div><span>Execution</span><strong>LOCAL / DETERMINISTIC</strong></div>
              </div>

              {!merkle ? (
                <button
                  type="button"
                  className="button button--secondary button--full"
                  onClick={generateMerkle}
                  disabled={cryptoBusy}
                >
                  {cryptoBusy ? <Loader2 className="spin" size={14} /> : <Fingerprint size={14} />}
                  {cryptoBusy ? 'Hashing evidence tree…' : 'Generate Merkle evidence root'}
                </button>
              ) : null}

              <button
                type="button"
                className="button button--primary button--full inspector-export"
                onClick={exportCapsule}
                disabled={cryptoBusy}
              >
                <ArrowDownToLine size={14} />
                Export reproducibility capsule
              </button>
            </section>

            <section className="inspector-block inspector-block--quiet">
              <div className="trust-note">
                <WifiOff size={15} />
                <div>
                  <strong>No external model or API is used for findings.</strong>
                  <p>Uploads are parsed and assessed locally in this browser session.</p>
                </div>
              </div>
              <div className="trust-note">
                <HardDrive size={15} />
                <div>
                  <strong>Human supervisory judgement remains final.</strong>
                  <p>BLACKLIGHT identifies evidence contradictions and unresolved branches; it does not determine guilt or regulatory intent.</p>
                </div>
              </div>
            </section>
          </div>
        </aside>
      </div>
    </main>
  );
}
