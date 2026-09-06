import { ScanSearch } from 'lucide-react';

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className="brand-mark" aria-label="BLACKLIGHT">
      <span className="brand-mark__glyph">
        <ScanSearch size={compact ? 15 : 17} strokeWidth={1.8} />
      </span>
      <span className="brand-mark__word">BLACKLIGHT</span>
      {!compact ? <span className="brand-mark__tag">SAT-SA</span> : null}
    </div>
  );
}
