import type { AlertRecord } from './types';

const REQUIRED = ['alert_id', 'severity', 'asset_id', 'opened_at', 'closed_at'] as const;

function splitCsvLine(line: string): string[] {
  const cells: string[] = [];
  let current = '';
  let quoted = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"') {
      if (quoted && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        quoted = !quoted;
      }
    } else if (char === ',' && !quoted) {
      cells.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  cells.push(current.trim());
  return cells;
}

export function parseAlertCsv(input: string): AlertRecord[] {
  const lines = input
    .replace(/\r\n/g, '\n')
    .split('\n')
    .filter((line) => line.trim().length > 0);

  if (lines.length < 2) {
    throw new Error('CSV must contain a header row and at least one data row.');
  }

  const headers = splitCsvLine(lines[0]).map((header) => header.trim());
  const missing = REQUIRED.filter((required) => !headers.includes(required));

  if (missing.length > 0) {
    throw new Error(`Missing required columns: ${missing.join(', ')}`);
  }

  const rows: AlertRecord[] = [];
  for (const line of lines.slice(1)) {
    const cells = splitCsvLine(line);
    const raw: Record<string, string> = {};

    headers.forEach((header, index) => {
      raw[header] = cells[index] ?? '';
    });

    const severity = raw.severity.toLowerCase();
    if (!['critical', 'high', 'medium', 'low'].includes(severity)) {
      continue;
    }

    rows.push({
      alert_id: raw.alert_id,
      severity: severity as AlertRecord['severity'],
      asset_id: raw.asset_id,
      opened_at: raw.opened_at,
      closed_at: raw.closed_at,
      triaged_at: raw.triaged_at || undefined,
      investigated_at: raw.investigated_at || undefined,
      enriched_at: raw.enriched_at || undefined,
      escalated_at: raw.escalated_at || undefined,
      automation_run_id: raw.automation_run_id || undefined,
      closure_reason: raw.closure_reason || undefined,
      action_signature: raw.action_signature || undefined,
      exception_code: raw.exception_code || undefined,
    });
  }

  if (rows.length === 0) {
    throw new Error('No valid alert rows were found.');
  }

  return rows;
}

export function parseAlertJson(input: string): AlertRecord[] {
  const parsed: unknown = JSON.parse(input);
  if (!Array.isArray(parsed)) {
    throw new Error('JSON upload must be an array of alert records.');
  }

  return parsed.map((row, index) => {
    if (typeof row !== 'object' || row === null) {
      throw new Error(`Row ${index + 1} is not an object.`);
    }

    const candidate = row as Record<string, unknown>;
    for (const field of REQUIRED) {
      if (typeof candidate[field] !== 'string' || !candidate[field]) {
        throw new Error(`Row ${index + 1} is missing ${field}.`);
      }
    }

    return candidate as unknown as AlertRecord;
  });
}
