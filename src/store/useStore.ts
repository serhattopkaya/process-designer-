import { create } from 'zustand';
import {
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  type NodeChange,
  type EdgeChange,
  type Connection,
  MarkerType,
} from '@xyflow/react';
import dagre from '@dagrejs/dagre';
import type { StoreState, ProcessNode, ProcessEdge, ProcessNodeType, ProcessNodeData } from '../types';

let idCounter = 0;
const getId = () => `node_${++idCounter}`;

const NODE_DEFAULTS: Record<ProcessNodeType, { label: string; color: string; width: number; height: number }> = {
  start: { label: 'Start', color: '#22c55e', width: 120, height: 60 },
  end: { label: 'End', color: '#ef4444', width: 120, height: 60 },
  processStep: { label: 'Process', color: '#3b82f6', width: 180, height: 80 },
  decision: { label: 'Decision', color: '#f59e0b', width: 160, height: 100 },
  subprocess: { label: 'Subprocess', color: '#8b5cf6', width: 180, height: 80 },
  delay: { label: 'Delay', color: '#6b7280', width: 160, height: 70 },
};

const createInitialNodes = (): ProcessNode[] => [
  {
    id: 'node_start',
    type: 'start',
    position: { x: 250, y: 50 },
    data: { label: 'Start', color: '#22c55e' },
  },
  {
    id: 'node_1',
    type: 'processStep',
    position: { x: 220, y: 180 },
    data: { label: 'Review Request', description: 'Review the incoming request', color: '#3b82f6' },
  },
  {
    id: 'node_2',
    type: 'decision',
    position: { x: 220, y: 320 },
    data: { label: 'Approved?', color: '#f59e0b' },
  },
  {
    id: 'node_3',
    type: 'processStep',
    position: { x: 50, y: 480 },
    data: { label: 'Process Order', description: 'Execute the order', color: '#3b82f6' },
  },
  {
    id: 'node_4',
    type: 'subprocess',
    position: { x: 400, y: 480 },
    data: { label: 'Send Rejection', description: 'Notify requester', color: '#8b5cf6' },
  },
  {
    id: 'node_end',
    type: 'end',
    position: { x: 250, y: 640 },
    data: { label: 'End', color: '#ef4444' },
  },
];

const createInitialEdges = (): ProcessEdge[] => [
  { id: 'e-start-1', source: 'node_start', target: 'node_1', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e-1-2', source: 'node_1', target: 'node_2', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e-2-3', source: 'node_2', target: 'node_3', sourceHandle: 'yes', label: 'Yes', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e-2-4', source: 'node_2', target: 'node_4', sourceHandle: 'no', label: 'No', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e-3-end', source: 'node_3', target: 'node_end', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e-4-end', source: 'node_4', target: 'node_end', markerEnd: { type: MarkerType.ArrowClosed } },
];

const MAX_HISTORY = 50;

const initialNodes = createInitialNodes();
const initialEdges = createInitialEdges();

export const useStore = create<StoreState>((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,
  selectedNodeId: null,
  selectedEdgeId: null,
  darkMode: window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false,
  history: [{ nodes: structuredClone(initialNodes), edges: structuredClone(initialEdges) }],
  historyIndex: 0,

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),

  onNodesChange: (changes: NodeChange[]) => {
    const { nodes } = get();
    set({ nodes: applyNodeChanges(changes, nodes) as ProcessNode[] });
  },

  onEdgesChange: (changes: EdgeChange[]) => {
    const { edges } = get();
    set({ edges: applyEdgeChanges(changes, edges) as ProcessEdge[] });
  },

  onConnect: (connection: Connection) => {
    const { edges, pushHistory } = get();
    pushHistory();
    set({
      edges: addEdge(
        { ...connection, markerEnd: { type: MarkerType.ArrowClosed } },
        edges,
      ) as ProcessEdge[],
    });
  },

  addNode: (type: ProcessNodeType, position: { x: number; y: number }) => {
    const { nodes, pushHistory } = get();
    pushHistory();
    const defaults = NODE_DEFAULTS[type];
    const newNode: ProcessNode = {
      id: getId(),
      type,
      position,
      data: {
        label: defaults.label,
        color: defaults.color,
      },
    };
    set({ nodes: [...nodes, newNode] });
  },

  deleteSelected: () => {
    const { nodes, edges, selectedNodeId, selectedEdgeId, pushHistory } = get();
    if (!selectedNodeId && !selectedEdgeId) return;
    pushHistory();
    if (selectedNodeId) {
      set({
        nodes: nodes.filter((n) => n.id !== selectedNodeId),
        edges: edges.filter((e) => e.source !== selectedNodeId && e.target !== selectedNodeId),
        selectedNodeId: null,
      });
    } else if (selectedEdgeId) {
      set({
        edges: edges.filter((e) => e.id !== selectedEdgeId),
        selectedEdgeId: null,
      });
    }
  },

  updateNodeData: (nodeId: string, data: Partial<ProcessNodeData>) => {
    const { nodes } = get();
    set({
      nodes: nodes.map((n) =>
        n.id === nodeId ? { ...n, data: { ...n.data, ...data } } : n,
      ),
    });
  },

  updateEdgeData: (edgeId: string, data: Partial<ProcessEdge>) => {
    const { edges } = get();
    set({
      edges: edges.map((e) => (e.id === edgeId ? { ...e, ...data } : e)),
    });
  },

  setSelectedNodeId: (id) => set({ selectedNodeId: id, selectedEdgeId: null }),
  setSelectedEdgeId: (id) => set({ selectedEdgeId: id, selectedNodeId: null }),

  toggleDarkMode: () => {
    set({ darkMode: !get().darkMode });
  },

  pushHistory: () => {
    const { nodes, edges, history, historyIndex } = get();
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({
      nodes: structuredClone(nodes),
      edges: structuredClone(edges),
    });
    if (newHistory.length > MAX_HISTORY) newHistory.shift();
    set({ history: newHistory, historyIndex: newHistory.length - 1 });
  },

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex <= 0) return;
    const prev = history[historyIndex - 1];
    set({
      nodes: structuredClone(prev.nodes),
      edges: structuredClone(prev.edges),
      historyIndex: historyIndex - 1,
      selectedNodeId: null,
      selectedEdgeId: null,
    });
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex >= history.length - 1) return;
    const next = history[historyIndex + 1];
    set({
      nodes: structuredClone(next.nodes),
      edges: structuredClone(next.edges),
      historyIndex: historyIndex + 1,
      selectedNodeId: null,
      selectedEdgeId: null,
    });
  },

  exportToJson: () => {
    const { nodes, edges } = get();
    return JSON.stringify({ nodes, edges }, null, 2);
  },

  importFromJson: (json: string) => {
    try {
      const { nodes, edges } = JSON.parse(json);
      const { pushHistory } = get();
      pushHistory();
      set({ nodes, edges, selectedNodeId: null, selectedEdgeId: null });
    } catch {
      console.error('Invalid JSON');
    }
  },

  autoLayout: () => {
    const { nodes, edges, pushHistory } = get();
    if (nodes.length === 0) return;
    pushHistory();

    const g = new dagre.graphlib.Graph();
    g.setDefaultEdgeLabel(() => ({}));
    g.setGraph({ rankdir: 'TB', nodesep: 60, ranksep: 80, marginx: 40, marginy: 40 });

    nodes.forEach((node) => {
      const defaults = NODE_DEFAULTS[node.type as ProcessNodeType] || { width: 180, height: 80 };
      g.setNode(node.id, { width: defaults.width, height: defaults.height });
    });

    edges.forEach((edge) => {
      g.setEdge(edge.source, edge.target);
    });

    dagre.layout(g);

    const layoutedNodes = nodes.map((node) => {
      const pos = g.node(node.id);
      const defaults = NODE_DEFAULTS[node.type as ProcessNodeType] || { width: 180, height: 80 };
      return {
        ...node,
        position: {
          x: pos.x - defaults.width / 2,
          y: pos.y - defaults.height / 2,
        },
      };
    });

    set({ nodes: layoutedNodes });
  },
}));
