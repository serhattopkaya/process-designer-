import { useCallback, useState, type DragEvent } from 'react';
import {
  ReactFlow,
  MiniMap,
  Background,
  BackgroundVariant,
  ConnectionLineType,
  useReactFlow,
  type NodeMouseHandler,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useStore } from '../store/useStore';
import { nodeTypes } from './nodes';
import ContextMenu from './ContextMenu';
import type { ProcessNodeType, ProcessNode, ProcessEdge } from '../types';

export default function Canvas() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    setSelectedNodeId,
    setSelectedEdgeId,
    deleteSelected,
    darkMode,
    pushHistory,
  } = useStore();

  const { screenToFlowPosition } = useReactFlow();
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; nodeId: string } | null>(null);

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/processnode') as ProcessNodeType;
      if (!type) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      addNode(type, position);
    },
    [screenToFlowPosition, addNode],
  );

  const onNodeClick: NodeMouseHandler = useCallback(
    (_event, node) => {
      setSelectedNodeId(node.id);
    },
    [setSelectedNodeId],
  );

  const onEdgeClick = useCallback(
    (_event: React.MouseEvent, edge: ProcessEdge) => {
      setSelectedEdgeId(edge.id);
    },
    [setSelectedEdgeId],
  );

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
    setSelectedEdgeId(null);
    setContextMenu(null);
  }, [setSelectedNodeId, setSelectedEdgeId]);

  const onNodeContextMenu = useCallback(
    (event: React.MouseEvent, node: ProcessNode) => {
      event.preventDefault();
      setSelectedNodeId(node.id);
      setContextMenu({ x: event.clientX, y: event.clientY, nodeId: node.id });
    },
    [setSelectedNodeId],
  );

  const onNodeDragStop = useCallback(() => {
    pushHistory();
  }, [pushHistory]);

  const handleDuplicate = useCallback(() => {
    if (!contextMenu) return;
    const node = nodes.find((n) => n.id === contextMenu.nodeId) as ProcessNode | undefined;
    if (!node) return;
    addNode(node.type as ProcessNodeType, {
      x: node.position.x + 40,
      y: node.position.y + 40,
    });
  }, [contextMenu, nodes, addNode]);

  return (
    <div className="relative flex-1">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onPaneClick={onPaneClick}
        onNodeContextMenu={onNodeContextMenu}
        onNodeDragStop={onNodeDragStop}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        defaultEdgeOptions={{
          type: 'smoothstep',
          animated: false,
        }}
        connectionLineType={ConnectionLineType.SmoothStep}
        deleteKeyCode="Delete"
        className="bg-gray-50 dark:bg-slate-950"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color={darkMode ? '#334155' : '#cbd5e1'}
        />
        <MiniMap
          nodeStrokeWidth={3}
          pannable
          zoomable
          style={{
            background: darkMode ? '#1e293b' : '#f8fafc',
          }}
          maskColor={darkMode ? 'rgba(15, 23, 42, 0.7)' : 'rgba(248, 250, 252, 0.7)'}
        />
      </ReactFlow>

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          onDelete={deleteSelected}
          onDuplicate={handleDuplicate}
        />
      )}
    </div>
  );
}
