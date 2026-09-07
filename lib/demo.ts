import type { AlertRecord } from './types';

const pad = (value: number, width = 4) => value.toString().padStart(width, '0');

function iso(base: Date, seconds: number): string {
  return new Date(base.getTime() + seconds * 1000).toISOString();
}

/** Deterministic synthetic benchmark pack with known evidence gaps. */
export function makeDemoRecords(): AlertRecord[] {
  const records: AlertRecord[] = [];
  const base = new Date('2026-07-31T00:00:00.000Z');

  for (let i = 0; i < 1842; i += 1) {
    const alertId = `CRIT-${pad(i + 1, 5)}`;
    const assetIndex = (i % 311) + 1;
    const openedSeconds = i * 173;
    const isMissingInvestigation = i < 136;
    const isFastUnexplained = i < 41;
    const isTemplateSequence = i >= 41 && i < 70;
    const isLegitAutomation = i >= 136 && i < 237;
    const isEscalationGap = i >= 300 && i < 322;
    const closeDelta = isFastUnexplained ? 28 + (i % 23) : isLegitAutomation ? 22 + (i % 31) : 240 + (i % 900);

    const record: AlertRecord = {
      alert_id: alertId,
      severity: 'critical',
      asset_id: `ASSET-${pad(assetIndex, 3)}`,
      opened_at: iso(base, openedSeconds),
      triaged_at: iso(base, openedSeconds + 8 + (i % 20)),
      closed_at: iso(base, openedSeconds + closeDelta),
      closure_reason: isTemplateSequence ? 'benign-positive' : i % 17 === 0 ? 'duplicate' : 'resolved',
      action_signature: isTemplateSequence ? 'query>alert>close' : `query>${i % 4}>enrich>${i % 7}>decision`,
    };

    if (!isMissingInvestigation) {
      record.investigated_at = iso(base, openedSeconds + 45 + (i % 70));
      record.enriched_at = iso(base, openedSeconds + 31 + (i % 50));
    }
    if (isLegitAutomation) {
      record.automation_run_id = `AUTO-${pad(i - 135, 4)}`;
      record.enriched_at = iso(base, openedSeconds + 4);
      record.investigated_at = iso(base, openedSeconds + 8);
    }
    if (!isEscalationGap && i % 3 === 0) record.escalated_at = iso(base, openedSeconds + 120 + (i % 240));
    if (i >= 70 && i < 82) record.exception_code = 'EXC-MAINT-WINDOW';
    records.push(record);
  }
  return records;
}

/** Healthy-control SOC pack: same deterministic schema, but fast closures are traceable and workflow evidence is complete. */
export function makeWestDemoRecords(): AlertRecord[] {
  const base = new Date('2026-07-31T00:00:00.000Z');
  const records: AlertRecord[] = [];
  for (let i = 0; i < 1842; i += 1) {
    const openedSeconds = i * 173;
    const isFast = i < 139;
    const closeDelta = isFast ? 34 + (i % 19) : 260 + (i % 780);
    records.push({
      alert_id: `WEST-${pad(i + 1, 5)}`,
      severity: 'critical',
      asset_id: `ASSET-${pad((i % 311) + 1, 3)}`,
      opened_at: iso(base, openedSeconds),
      triaged_at: iso(base, openedSeconds + 9 + (i % 17)),
      investigated_at: iso(base, openedSeconds + (isFast ? 15 : 48 + (i % 55))),
      enriched_at: iso(base, openedSeconds + (isFast ? 9 : 34 + (i % 40))),
      escalated_at: iso(base, openedSeconds + 110 + (i % 180)),
      closed_at: iso(base, openedSeconds + closeDelta),
      closure_reason: i % 23 === 0 ? 'duplicate' : 'resolved',
      action_signature: `query>${i % 6}>enrich>${i % 9}>decision`,
      ...(isFast ? { automation_run_id: `WEST-AUTO-${pad(i + 1, 4)}` } : {}),
    });
  }
  return records;
}

export const DEMO_ASSET_PROFILE = { declaredCriticalAssets: 620, claimedProtectedAssets: 587 };
export const WEST_ASSET_PROFILE = { declaredCriticalAssets: 311, claimedProtectedAssets: 311 };
