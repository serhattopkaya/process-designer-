import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { ProcessNodeData } from '../../types';

export default function ProcessStepNode({ data, selected }: NodeProps) {
  const nodeData = data as ProcessNodeData;
  return (
    <div
      className={`process-node rounded-lg border-2 bg-white px-4 py-3 shadow-md dark:bg-slate-800 ${selected ? 'selected' : ''}`}
      style={{
        borderColor: selected ? 'var(--accent)' : (nodeData.color || '#3b82f6'),
        borderLeftWidth: 4,
        minWidth: 160,
      }}
    >
      <Handle type="target" position={Position.Top} />
      <div className="flex flex-col gap-1">
        <span className="text-sm font-semibold" style={{ color: nodeData.color || '#3b82f6' }}>
          {nodeData.label}
        </span>
        {nodeData.description && (
          <span className="text-xs text-gray-500 dark:text-gray-400">{nodeData.description}</span>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
