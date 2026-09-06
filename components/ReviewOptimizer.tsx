'use client';

import { ChevronDown, ChevronUp, ScanSearch, Target } from 'lucide-react';
import { useState } from 'react';

const reviewQueue = [
  { id: 'CRIT-00001', reason: 'fast closure · investigation missing' },
  { id: 'CRIT-00042', reason: 'template-close cluster' },
  { id: 'CRIT-00071', reason: 'maintenance exception confounder' },
  { id: 'CRIT-00137', reason: 'legitimate automation control' },
  { id: 'CRIT-00301', reason: 'escalation evidence gap' },
  { id: 'CRIT-01022', reason: 'healthy baseline control' },
  { id: 'CRIT-01842', reason: 'tail-of-period baseline' },
];

export function ReviewOptimizer() {
  const [open, setOpen] = useState(true);

  return (
    <aside
      aria-label="BLACKLIGHT review optimizer"
      style={{
        position: 'fixed',
        right: 18,
        bottom: 18,
        zIndex: 80,
        width: open ? 372 : 292,
        border: '1px solid rgba(109, 231, 200, .26)',
        borderRadius: 14,
        background: 'rgba(8, 15, 20, .96)',
        boxShadow: '0 20px 60px rgba(0,0,0,.42)',
        backdropFilter: 'blur(18px)',
        color: '#e8f1ef',
        overflow: 'hidden',
        fontFamily: 'inherit',
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        style={{
          width: '100%',
          border: 0,
          color: 'inherit',
          background: 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          padding: '12px 14px',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Target size={16} color="#72dfc4" />
          <span>
            <strong style={{ display: 'block', fontSize: 12, letterSpacing: '.04em' }}>REVIEW OPTIMIZER</strong>
            <small style={{ color: '#7f9692', fontSize: 10 }}>7 diverse reviews from 1,842 critical alerts</small>
          </span>
        </span>
        {open ? <ChevronDown size={15} /> : <ChevronUp size={15} />}
      </button>

      {open ? (
        <div style={{ borderTop: '1px solid rgba(255,255,255,.07)', padding: '11px 13px 13px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            {reviewQueue.map((item) => (
              <div
                key={item.id}
                style={{
                  minWidth: 0,
                  border: '1px solid rgba(255,255,255,.07)',
                  borderRadius: 8,
                  padding: '7px 8px',
                  background: 'rgba(255,255,255,.025)',
                }}
              >
                <code style={{ display: 'block', color: '#cae6df', fontSize: 10 }}>{item.id}</code>
                <span style={{ display: 'block', color: '#738985', fontSize: 9, lineHeight: 1.35, marginTop: 3 }}>{item.reason}</span>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 8,
              border: '1px solid rgba(222, 173, 66, .24)',
              borderRadius: 9,
              padding: '9px 10px',
              background: 'rgba(222, 173, 66, .045)',
              display: 'flex',
              gap: 9,
            }}
          >
            <ScanSearch size={15} color="#d9ad58" style={{ flex: '0 0 auto', marginTop: 1 }} />
            <div>
              <strong style={{ display: 'block', color: '#ead7af', fontSize: 10 }}>+ 1 smallest-next-evidence request</strong>
              <span style={{ display: 'block', color: '#95886f', fontSize: 9, lineHeight: 1.45, marginTop: 2 }}>
                Request the missing automation execution trail before escalating the 99.8% SLA anomaly. This preserves the legitimate-automation explanation instead of assuming gaming.
              </span>
            </div>
          </div>

          <p style={{ margin: '8px 1px 0', color: '#647a75', fontSize: 9, lineHeight: 1.45 }}>
            Deterministic diversity sampling: anomaly, confounder, escalation gap and healthy controls. Human review remains final.
          </p>
        </div>
      ) : null}
    </aside>
  );
}
