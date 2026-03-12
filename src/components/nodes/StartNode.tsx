import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { ProcessNodeData } from '../../types';

export default function StartNode({ data, selected }: NodeProps) {
  const nodeData = data as ProcessNodeData;
  return (
    <div
      className={`process-node flex items-center justify-center rounded-full border-2 px-6 py-3 font-semibold text-white shadow-md ${selected ? 'selected' : ''}`}
      style={{
        background: `linear-gradient(135deg, ${nodeData.color || '#22c55e'}, ${nodeData.color || '#22c55e'}dd)`,
        borderColor: selected ? 'var(--accent)' : 'transparent',
        minWidth: 100,
      }}
    >
      <span className="text-sm">{nodeData.label}</span>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
