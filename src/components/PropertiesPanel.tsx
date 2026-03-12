import { useStore } from '../store/useStore';
import { X, Trash2 } from 'lucide-react';
import type { ProcessNodeData } from '../types';

const COLORS = ['#3b82f6', '#22c55e', '#ef4444', '#f59e0b', '#8b5cf6', '#ec4899', '#6b7280', '#14b8a6'];

export default function PropertiesPanel() {
  const {
    nodes,
    edges,
    selectedNodeId,
    selectedEdgeId,
    setSelectedNodeId,
    setSelectedEdgeId,
    updateNodeData,
    updateEdgeData,
    deleteSelected,
  } = useStore();

  const selectedNode = selectedNodeId ? nodes.find((n) => n.id === selectedNodeId) : null;
  const selectedEdge = selectedEdgeId ? edges.find((e) => e.id === selectedEdgeId) : null;

  if (!selectedNode && !selectedEdge) {
    return (
      <div className="flex w-64 flex-col border-l bg-white/80 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/80"
           style={{ borderColor: 'var(--border-color)' }}>
        <div className="border-b p-3" style={{ borderColor: 'var(--border-color)' }}>
          <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
            Properties
          </h2>
        </div>
        <div className="flex flex-1 items-center justify-center p-4">
          <p className="text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
            Select a node or edge to view its properties.
          </p>
        </div>
      </div>
    );
  }

  if (selectedEdge) {
    return (
      <div className="flex w-64 flex-col border-l bg-white/80 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/80"
           style={{ borderColor: 'var(--border-color)' }}>
        <div className="flex items-center justify-between border-b p-3" style={{ borderColor: 'var(--border-color)' }}>
          <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
            Edge Properties
          </h2>
          <button
            onClick={() => setSelectedEdgeId(null)}
            className="rounded p-1 transition-colors hover:bg-gray-100 dark:hover:bg-slate-700"
          >
            <X size={14} style={{ color: 'var(--text-secondary)' }} />
          </button>
        </div>
        <div className="flex flex-col gap-3 p-3">
          <div>
            <label className="mb-1 block text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Label</label>
            <input
              type="text"
              value={(selectedEdge.label as string) || ''}
              onChange={(e) => updateEdgeData(selectedEdge.id, { label: e.target.value })}
              className="w-full rounded-md border px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              style={{ borderColor: 'var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
              placeholder="e.g. Yes, No"
            />
          </div>
          <button
            onClick={deleteSelected}
            className="flex items-center gap-2 rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40"
          >
            <Trash2 size={14} /> Delete Edge
          </button>
        </div>
      </div>
    );
  }

  if (!selectedNode) return null;

  const nodeData = selectedNode.data as ProcessNodeData;

  return (
    <div className="flex w-64 flex-col border-l bg-white/80 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/80"
         style={{ borderColor: 'var(--border-color)' }}>
      <div className="flex items-center justify-between border-b p-3" style={{ borderColor: 'var(--border-color)' }}>
        <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
          Properties
        </h2>
        <button
          onClick={() => setSelectedNodeId(null)}
          className="rounded p-1 transition-colors hover:bg-gray-100 dark:hover:bg-slate-700"
        >
          <X size={14} style={{ color: 'var(--text-secondary)' }} />
        </button>
      </div>
      <div className="flex flex-col gap-3 overflow-y-auto p-3">
        {/* Node Type */}
        <div className="rounded-md p-2" style={{ background: 'var(--bg-secondary)' }}>
          <span className="text-xs font-medium capitalize" style={{ color: 'var(--text-secondary)' }}>
            {selectedNode.type?.replace(/([A-Z])/g, ' $1')}
          </span>
        </div>

        {/* Label */}
        <div>
          <label className="mb-1 block text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Label</label>
          <input
            type="text"
            value={nodeData.label}
            onChange={(e) => updateNodeData(selectedNode.id, { label: e.target.value })}
            className="w-full rounded-md border px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            style={{ borderColor: 'var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
          />
        </div>

        {/* Description */}
        {(selectedNode.type === 'processStep' || selectedNode.type === 'subprocess') && (
          <div>
            <label className="mb-1 block text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Description</label>
            <textarea
              value={nodeData.description || ''}
              onChange={(e) => updateNodeData(selectedNode.id, { description: e.target.value })}
              className="w-full resize-none rounded-md border px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              style={{ borderColor: 'var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
              rows={3}
              placeholder="Add a description..."
            />
          </div>
        )}

        {/* Duration (for delay nodes) */}
        {selectedNode.type === 'delay' && (
          <div>
            <label className="mb-1 block text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Duration</label>
            <input
              type="text"
              value={nodeData.duration || ''}
              onChange={(e) => updateNodeData(selectedNode.id, { duration: e.target.value })}
              className="w-full rounded-md border px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              style={{ borderColor: 'var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
              placeholder="e.g. 2 hours"
            />
          </div>
        )}

        {/* Assignee */}
        <div>
          <label className="mb-1 block text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Assignee</label>
          <input
            type="text"
            value={nodeData.assignee || ''}
            onChange={(e) => updateNodeData(selectedNode.id, { assignee: e.target.value })}
            className="w-full rounded-md border px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            style={{ borderColor: 'var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
            placeholder="Assign to..."
          />
        </div>

        {/* Color */}
        <div>
          <label className="mb-1 block text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Color</label>
          <div className="flex flex-wrap gap-2">
            {COLORS.map((color) => (
              <button
                key={color}
                onClick={() => updateNodeData(selectedNode.id, { color })}
                className="h-6 w-6 rounded-full border-2 transition-transform hover:scale-110"
                style={{
                  background: color,
                  borderColor: nodeData.color === color ? 'var(--text-primary)' : 'transparent',
                }}
              />
            ))}
          </div>
        </div>

        {/* Delete */}
        <div className="mt-2 border-t pt-3" style={{ borderColor: 'var(--border-color)' }}>
          <button
            onClick={deleteSelected}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40"
          >
            <Trash2 size={14} /> Delete Node
          </button>
        </div>
      </div>
    </div>
  );
}
