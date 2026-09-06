import { describe, expect, it } from 'vitest';
import { makeDemoRecords, DEMO_ASSET_PROFILE } from '../lib/demo';
import { assessDataset } from '../lib/engine';

describe('BLACKLIGHT deterministic assessment', () => {
  const records = makeDemoRecords();
  const assessment = assessDataset(records, {
    name: 'test',
    source: 'demo',
    declaredCriticalAssets: DEMO_ASSET_PROFILE.declaredCriticalAssets,
    claimedProtectedAssets: DEMO_ASSET_PROFILE.claimedProtectedAssets,
    loadedAt: '2026-07-31T00:00:00.000Z',
  });

  it('detects the known investigation gap', () => {
    const finding = assessment.findings.find((item) => item.id === 'BL-1042');
    expect(finding?.missingCount).toBe(136);
    expect(finding?.verdict).toBe('unsupported');
  });

  it('detects negative-space coverage against claimed protected assets', () => {
    const finding = assessment.findings.find((item) => item.id === 'BL-1188');
    expect(finding?.missingCount).toBe(276);
  });

  it('keeps policy-dependent escalation at review instead of overclaiming', () => {
    const finding = assessment.findings.find((item) => item.id === 'BL-1270');
    expect(finding?.verdict).toBe('review');
  });
});
