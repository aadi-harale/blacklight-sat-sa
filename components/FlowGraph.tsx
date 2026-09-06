import { Check, CircleDotDashed, X } from 'lucide-react';
import type { EvidenceNode } from '@/lib/types';

function NodeIcon({ status }: { status: EvidenceNode['status'] }) {
  if (status === 'observed') return <Check size={15} />;
  if (status === 'missing') return <X size={15} />;
  return <CircleDotDashed size={15} />;
}

export function FlowGraph({
  nodes,
  title,
}: {
  nodes: EvidenceNode[];
  title: string;
}) {
  return (
    <section className="flow-stage">
      <div className="flow-stage__header">
        <div>
          <span className="panel-kicker">CLAIM RECONSTRUCTION</span>
          <h2>{title}</h2>
        </div>
        <div className="flow-stage__legend">
          <span><i className="legend-dot legend-dot--ok" /> observed</span>
          <span><i className="legend-dot legend-dot--missing" /> missing</span>
          <span><i className="legend-dot legend-dot--review" /> contextual</span>
        </div>
      </div>

      <div className="flow-track" role="img" aria-label="Expected evidence sequence">
        <div className="flow-track__rail" aria-hidden="true" />
        <div className="flow-track__pulse" aria-hidden="true" />
        {nodes.map((node, index) => (
          <div className="flow-unit" key={node.id}>
            <div className={`flow-node flow-node--${node.status}`}>
              <div className="flow-node__status"><NodeIcon status={node.status} /></div>
              <span className="flow-node__index">0{index + 1}</span>
              <strong>{node.label}</strong>
              <small>{node.detail}</small>
              {typeof node.count === 'number' ? (
                <em>{node.count.toLocaleString()} records</em>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
