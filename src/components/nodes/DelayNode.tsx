import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { ProcessNodeData } from '../../types';

export default function DelayNode({ data, selected }: NodeProps) {
  const nodeData = data as ProcessNodeData;
  return (
    <div
      className={`process-node flex items-center gap-2 rounded-r-full rounded-l-lg border-2 bg-white px-4 py-3 shadow-md dark:bg-slate-800 ${selected ? 'selected' : ''}`}
      style={{
        borderColor: selected ? 'var(--accent)' : (nodeData.color || '#6b7280'),
        minWidth: 140,
      }}
    >
      <Handle type="target" position={Position.Top} />
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-semibold" style={{ color: nodeData.color || '#6b7280' }}>
          {nodeData.label}
        </span>
        {nodeData.duration && (
          <span className="text-xs text-gray-500 dark:text-gray-400">{nodeData.duration}</span>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
