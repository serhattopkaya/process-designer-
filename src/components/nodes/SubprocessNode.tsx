import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { ProcessNodeData } from '../../types';

export default function SubprocessNode({ data, selected }: NodeProps) {
  const nodeData = data as ProcessNodeData;
  return (
    <div
      className={`process-node rounded-lg border-2 bg-white px-4 py-3 shadow-md dark:bg-slate-800 ${selected ? 'selected' : ''}`}
      style={{
        borderColor: selected ? 'var(--accent)' : (nodeData.color || '#8b5cf6'),
        minWidth: 160,
      }}
    >
      <Handle type="target" position={Position.Top} />
      {/* Double border lines on sides for subprocess */}
      <div
        className="absolute left-2 top-0 bottom-0 w-0.5"
        style={{ background: nodeData.color || '#8b5cf6', opacity: 0.4 }}
      />
      <div
        className="absolute right-2 top-0 bottom-0 w-0.5"
        style={{ background: nodeData.color || '#8b5cf6', opacity: 0.4 }}
      />
      <div className="flex flex-col gap-1 px-2">
        <span className="text-sm font-semibold" style={{ color: nodeData.color || '#8b5cf6' }}>
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
