function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

async function sha256(value: string): Promise<string> {
  const encoded = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', encoded);
  return toHex(digest);
}

export async function datasetFingerprint(rows: unknown[]): Promise<string> {
  return sha256(JSON.stringify(rows));
}

/**
 * Row-level SHA-256 Merkle root for finding provenance.
 * This intentionally uses native Web Crypto so no network or external
 * cryptographic service is required.
 */
export async function merkleRoot(rows: unknown[]): Promise<string> {
  if (rows.length === 0) return sha256('');

  let level = await Promise.all(rows.map((row) => sha256(JSON.stringify(row))));

  while (level.length > 1) {
    const next: string[] = [];
    for (let i = 0; i < level.length; i += 2) {
      const left = level[i];
      const right = level[i + 1] ?? left;
      next.push(await sha256(left + right));
    }
    level = next;
  }

  return level[0];
}
