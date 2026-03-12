import type { Node, Edge, NodeChange, EdgeChange, Connection } from '@xyflow/react';

export type ProcessNodeType = 'start' | 'end' | 'processStep' | 'decision' | 'subprocess' | 'delay';

export interface ProcessNodeData {
  label: string;
  description?: string;
  color?: string;
  duration?: string;
  assignee?: string;
  metadata?: Record<string, string>;
  [key: string]: unknown;
}

export type ProcessNode = Node<ProcessNodeData>;
export type ProcessEdge = Edge;

export interface StoreState {
  nodes: ProcessNode[];
  edges: ProcessEdge[];
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  darkMode: boolean;
  history: { nodes: ProcessNode[]; edges: ProcessEdge[] }[];
  historyIndex: number;

  // Node/Edge actions
  setNodes: (nodes: ProcessNode[]) => void;
  setEdges: (edges: ProcessEdge[]) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  addNode: (type: ProcessNodeType, position: { x: number; y: number }) => void;
  deleteSelected: () => void;
  updateNodeData: (nodeId: string, data: Partial<ProcessNodeData>) => void;
  updateEdgeData: (edgeId: string, data: Partial<ProcessEdge>) => void;

  // Selection
  setSelectedNodeId: (id: string | null) => void;
  setSelectedEdgeId: (id: string | null) => void;

  // Theme
  toggleDarkMode: () => void;

  // History
  pushHistory: () => void;
  undo: () => void;
  redo: () => void;

  // Import/Export
  exportToJson: () => string;
  importFromJson: (json: string) => void;

  // Layout
  autoLayout: () => void;
}
