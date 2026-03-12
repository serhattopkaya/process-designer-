import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { ProcessNodeData } from '../../types';

export default function DecisionNode({ data, selected }: NodeProps) {
  const nodeData = data as ProcessNodeData;
  return (
    <div className="relative flex items-center justify-center" style={{ width: 140, height: 90 }}>
      <svg width="140" height="90" viewBox="0 0 140 90" className="absolute inset-0">
        <polygon
          points="70,4 136,45 70,86 4,45"
          fill={selected ? `${nodeData.color || '#f59e0b'}15` : 'var(--bg-primary)'}
          stroke={selected ? 'var(--accent)' : (nodeData.color || '#f59e0b')}
          strokeWidth="2.5"
          className="transition-colors"
        />
      </svg>
      <div className="process-node relative z-10 flex flex-col items-center gap-0.5 px-6">
        <span className="text-xs font-semibold" style={{ color: nodeData.color || '#f59e0b' }}>
          {nodeData.label}
        </span>
      </div>
      <Handle type="target" position={Position.Top} style={{ top: 0 }} />
      <Handle type="source" position={Position.Bottom} id="yes" style={{ bottom: 0, left: '35%' }} />
      <Handle type="source" position={Position.Bottom} id="no" style={{ bottom: 0, left: '65%' }} />
      <Handle type="source" position={Position.Right} id="right" />
      <Handle type="source" position={Position.Left} id="left" />
    </div>
  );
}
