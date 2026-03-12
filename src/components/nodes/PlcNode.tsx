import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Cpu } from 'lucide-react';
import type { ProcessNodeData } from '../../types';

export default function PlcNode({ data, selected }: NodeProps) {
  const nodeData = data as ProcessNodeData;
  return (
    <div
      className={`process-node rounded-lg border-2 bg-white px-4 py-3 shadow-md dark:bg-slate-800 ${selected ? 'selected' : ''}`}
      style={{
        borderColor: selected ? 'var(--accent)' : (nodeData.color || '#0ea5e9'),
        borderLeftWidth: 4,
        minWidth: 160,
      }}
    >
      <Handle type="target" position={Position.Top} />
      <div className="flex items-center gap-2">
        <Cpu size={18} style={{ color: nodeData.color || '#0ea5e9' }} />
        <span className="text-sm font-semibold" style={{ color: nodeData.color || '#0ea5e9' }}>
          {nodeData.label}
        </span>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
