import { useStore, PROTOCOL_LABELS } from '../store/useStore';
import { X, Trash2, Plus } from 'lucide-react';
import type { ProcessNodeData, CommunicationProtocol, DataField, SolutionEdgeData, SolutionNodeType } from '../types';

const COLORS = ['#3b82f6', '#22c55e', '#ef4444', '#f59e0b', '#8b5cf6', '#ec4899', '#6b7280', '#14b8a6'];

const SOLUTION_NODE_TYPES: SolutionNodeType[] = ['plc', 'plcDataReader', 'msSqlServer', 'azureFunction', 'restApi', 'kafka'];

const DATA_FIELD_TYPES: DataField['type'][] = ['string', 'int', 'float', 'bool', 'datetime', 'json'];

const inputClass = 'w-full rounded-md border px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500';
const inputStyle = { borderColor: 'var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' };
const labelClass = 'mb-1 block text-xs font-medium';
const labelStyle = { color: 'var(--text-secondary)' };

function SolutionNodeProperties({ nodeType, nodeData, nodeId }: { nodeType: string; nodeData: ProcessNodeData; nodeId: string }) {
  const updateNodeData = useStore((s) => s.updateNodeData);

  const renderField = (key: string, label: string, placeholder: string, type: string = 'text') => (
    <div>
      <label className={labelClass} style={labelStyle}>{label}</label>
      <input
        type={type}
        value={(nodeData[key] as string) || ''}
        onChange={(e) => updateNodeData(nodeId, { [key]: type === 'number' ? Number(e.target.value) : e.target.value })}
        className={inputClass}
        style={inputStyle}
        placeholder={placeholder}
      />
    </div>
  );

  switch (nodeType) {
    case 'plc':
      return (
        <>
          {renderField('ipAddress', 'IP Address', 'e.g. 192.168.1.100')}
          {renderField('rack', 'Rack', 'e.g. 0', 'number')}
          {renderField('slot', 'Slot', 'e.g. 1', 'number')}
        </>
      );
    case 'plcDataReader':
      return (
        <>
          {renderField('plcAddress', 'PLC Address', 'e.g. DB1.DBW0')}
          {renderField('pollingInterval', 'Polling Interval', 'e.g. 1000ms')}
        </>
      );
    case 'msSqlServer':
      return (
        <>
          {renderField('connectionString', 'Connection String', 'Server=...;Database=...')}
          {renderField('database', 'Database', 'e.g. ProductionDB')}
        </>
      );
    case 'azureFunction':
      return (
        <>
          {renderField('functionUrl', 'Function URL', 'https://...')}
          {renderField('functionKey', 'Function Key', 'Key...')}
        </>
      );
    case 'restApi':
      return (
        <>
          {renderField('baseUrl', 'Base URL', 'https://api.example.com')}
          <div>
            <label className={labelClass} style={labelStyle}>Auth Type</label>
            <select
              value={(nodeData.authType as string) || 'none'}
              onChange={(e) => updateNodeData(nodeId, { authType: e.target.value })}
              className={inputClass}
              style={inputStyle}
            >
              <option value="none">None</option>
              <option value="apiKey">API Key</option>
              <option value="bearerToken">Bearer Token</option>
              <option value="basic">Basic Auth</option>
            </select>
          </div>
        </>
      );
    case 'kafka':
      return (
        <>
          {renderField('brokerUrl', 'Broker URL', 'e.g. localhost:9092')}
          {renderField('topic', 'Topic', 'e.g. sensor-data')}
          {renderField('groupId', 'Group ID', 'e.g. consumer-group-1')}
        </>
      );
    default:
      return null;
  }
}

function ProtocolSelector({ edgeId, edgeData }: { edgeId: string; edgeData: SolutionEdgeData }) {
  const updateEdgeProtocol = useStore((s) => s.updateEdgeProtocol);

  return (
    <div>
      <label className={labelClass} style={labelStyle}>Protocol</label>
      <select
        value={edgeData.protocol || ''}
        onChange={(e) => {
          if (e.target.value) {
            updateEdgeProtocol(edgeId, e.target.value as CommunicationProtocol);
          }
        }}
        className={inputClass}
        style={inputStyle}
      >
        <option value="">Select protocol...</option>
        {Object.entries(PROTOCOL_LABELS).map(([key, label]) => (
          <option key={key} value={key}>{label}</option>
        ))}
      </select>
    </div>
  );
}

function DataModelEditor({ edgeId, edgeData }: { edgeId: string; edgeData: SolutionEdgeData }) {
  const updateEdgeDataFields = useStore((s) => s.updateEdgeDataFields);
  const fields = edgeData.dataFields || [];

  const addField = () => {
    updateEdgeDataFields(edgeId, [...fields, { name: '', type: 'string' }]);
  };

  const removeField = (index: number) => {
    updateEdgeDataFields(edgeId, fields.filter((_, i) => i !== index));
  };

  const updateField = (index: number, updates: Partial<DataField>) => {
    updateEdgeDataFields(
      edgeId,
      fields.map((f, i) => (i === index ? { ...f, ...updates } : f)),
    );
  };

  return (
    <div>
      <label className={labelClass} style={labelStyle}>Data Model</label>
      <div className="flex flex-col gap-2">
        {fields.map((field, index) => (
          <div key={index} className="flex items-center gap-1">
            <input
              type="text"
              value={field.name}
              onChange={(e) => updateField(index, { name: e.target.value })}
              className="flex-1 rounded-md border px-2 py-1 text-xs outline-none focus:ring-2 focus:ring-blue-500"
              style={inputStyle}
              placeholder="Field name"
            />
            <select
              value={field.type}
              onChange={(e) => updateField(index, { type: e.target.value as DataField['type'] })}
              className="rounded-md border px-1 py-1 text-xs outline-none focus:ring-2 focus:ring-blue-500"
              style={inputStyle}
            >
              {DATA_FIELD_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <button
              onClick={() => removeField(index)}
              className="rounded p-1 text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <X size={12} />
            </button>
          </div>
        ))}
        <button
          onClick={addField}
          className="flex items-center gap-1 rounded-md border border-dashed px-2 py-1.5 text-xs transition-colors hover:bg-gray-50 dark:hover:bg-slate-700"
          style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
        >
          <Plus size={12} /> Add Field
        </button>
      </div>
    </div>
  );
}

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
    mode,
  } = useStore();

  const selectedNode = selectedNodeId ? nodes.find((n) => n.id === selectedNodeId) : null;
  const selectedEdge = selectedEdgeId ? edges.find((e) => e.id === selectedEdgeId) : null;

  const isSolutionMode = mode === 'solutionDesigner';
  const isSolutionNode = selectedNode && SOLUTION_NODE_TYPES.includes(selectedNode.type as SolutionNodeType);

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
    const edgeData = (selectedEdge.data || {}) as SolutionEdgeData;

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
        <div className="flex flex-col gap-3 overflow-y-auto p-3">
          <div>
            <label className={labelClass} style={labelStyle}>Label</label>
            <input
              type="text"
              value={(selectedEdge.label as string) || ''}
              onChange={(e) => updateEdgeData(selectedEdge.id, { label: e.target.value })}
              className={inputClass}
              style={inputStyle}
              placeholder="e.g. Yes, No"
            />
          </div>

          {isSolutionMode && (
            <>
              <div className="border-t pt-3" style={{ borderColor: 'var(--border-color)' }}>
                <ProtocolSelector edgeId={selectedEdge.id} edgeData={edgeData} />
              </div>
              <div className="border-t pt-3" style={{ borderColor: 'var(--border-color)' }}>
                <DataModelEditor edgeId={selectedEdge.id} edgeData={edgeData} />
              </div>
            </>
          )}

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
          <label className={labelClass} style={labelStyle}>Label</label>
          <input
            type="text"
            value={nodeData.label}
            onChange={(e) => updateNodeData(selectedNode.id, { label: e.target.value })}
            className={inputClass}
            style={inputStyle}
          />
        </div>

        {/* Solution block-specific properties */}
        {isSolutionNode && (
          <div className="border-t pt-3" style={{ borderColor: 'var(--border-color)' }}>
            <SolutionNodeProperties
              nodeType={selectedNode.type as string}
              nodeData={nodeData}
              nodeId={selectedNode.id}
            />
          </div>
        )}

        {/* Description (process flow only) */}
        {!isSolutionNode && (selectedNode.type === 'processStep' || selectedNode.type === 'subprocess') && (
          <div>
            <label className={labelClass} style={labelStyle}>Description</label>
            <textarea
              value={nodeData.description || ''}
              onChange={(e) => updateNodeData(selectedNode.id, { description: e.target.value })}
              className="w-full resize-none rounded-md border px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              style={inputStyle}
              rows={3}
              placeholder="Add a description..."
            />
          </div>
        )}

        {/* Duration (for delay nodes) */}
        {selectedNode.type === 'delay' && (
          <div>
            <label className={labelClass} style={labelStyle}>Duration</label>
            <input
              type="text"
              value={nodeData.duration || ''}
              onChange={(e) => updateNodeData(selectedNode.id, { duration: e.target.value })}
              className={inputClass}
              style={inputStyle}
              placeholder="e.g. 2 hours"
            />
          </div>
        )}

        {/* Assignee (process flow only) */}
        {!isSolutionNode && (
          <div>
            <label className={labelClass} style={labelStyle}>Assignee</label>
            <input
              type="text"
              value={nodeData.assignee || ''}
              onChange={(e) => updateNodeData(selectedNode.id, { assignee: e.target.value })}
              className={inputClass}
              style={inputStyle}
              placeholder="Assign to..."
            />
          </div>
        )}

        {/* Color */}
        <div>
          <label className={labelClass} style={labelStyle}>Color</label>
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
