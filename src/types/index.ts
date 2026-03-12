import type { Node, Edge, NodeChange, EdgeChange, Connection } from '@xyflow/react';

export type ProcessNodeType = 'start' | 'end' | 'processStep' | 'decision' | 'subprocess' | 'delay';

export type SolutionNodeType = 'plc' | 'plcDataReader' | 'msSqlServer' | 'azureFunction' | 'restApi' | 'kafka';

export type AppNodeType = ProcessNodeType | SolutionNodeType;

export type DesignerMode = 'processFlow' | 'solutionDesigner';

export type CommunicationProtocol =
  | 'siemensS7'
  | 'opcUa'
  | 'modbusTcp'
  | 'mqtt'
  | 'httpRest'
  | 'grpc'
  | 'kafka'
  | 'amqp'
  | 'tcpIp'
  | 'azureServiceBus';

export interface DataField {
  name: string;
  type: 'string' | 'int' | 'float' | 'bool' | 'datetime' | 'json';
}

export interface SolutionEdgeData {
  protocol?: CommunicationProtocol;
  dataFields?: DataField[];
  [key: string]: unknown;
}

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
  mode: DesignerMode;
  history: { nodes: ProcessNode[]; edges: ProcessEdge[] }[];
  historyIndex: number;

  // Node/Edge actions
  setNodes: (nodes: ProcessNode[]) => void;
  setEdges: (edges: ProcessEdge[]) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  addNode: (type: AppNodeType, position: { x: number; y: number }) => void;
  deleteSelected: () => void;
  updateNodeData: (nodeId: string, data: Partial<ProcessNodeData>) => void;
  updateEdgeData: (edgeId: string, data: Partial<ProcessEdge>) => void;

  // Selection
  setSelectedNodeId: (id: string | null) => void;
  setSelectedEdgeId: (id: string | null) => void;

  // Mode
  setMode: (mode: DesignerMode) => void;

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

  // Solution edge helpers
  updateEdgeProtocol: (edgeId: string, protocol: CommunicationProtocol) => void;
  updateEdgeDataFields: (edgeId: string, dataFields: DataField[]) => void;
}
