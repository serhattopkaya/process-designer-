import { type DragEvent } from 'react';
import {
  Play,
  Square,
  RectangleHorizontal,
  Diamond,
  Layers,
  Clock,
  Cpu,
  ScanLine,
  Database,
  Zap,
  Globe,
  Radio,
} from 'lucide-react';
import type { AppNodeType } from '../types';
import { useStore } from '../store/useStore';

const processFlowTools: { type: AppNodeType; label: string; icon: React.ReactNode; color: string }[] = [
  { type: 'start', label: 'Start', icon: <Play size={18} />, color: '#22c55e' },
  { type: 'end', label: 'End', icon: <Square size={18} />, color: '#ef4444' },
  { type: 'processStep', label: 'Process', icon: <RectangleHorizontal size={18} />, color: '#3b82f6' },
  { type: 'decision', label: 'Decision', icon: <Diamond size={18} />, color: '#f59e0b' },
  { type: 'subprocess', label: 'Subprocess', icon: <Layers size={18} />, color: '#8b5cf6' },
  { type: 'delay', label: 'Delay', icon: <Clock size={18} />, color: '#6b7280' },
];

const solutionDesignerTools: { type: AppNodeType; label: string; icon: React.ReactNode; color: string }[] = [
  { type: 'plc', label: 'PLC', icon: <Cpu size={18} />, color: '#0ea5e9' },
  { type: 'plcDataReader', label: 'PLC Data Reader', icon: <ScanLine size={18} />, color: '#06b6d4' },
  { type: 'msSqlServer', label: 'MS SQL Server', icon: <Database size={18} />, color: '#8b5cf6' },
  { type: 'azureFunction', label: 'Azure Function', icon: <Zap size={18} />, color: '#f59e0b' },
  { type: 'restApi', label: 'REST API', icon: <Globe size={18} />, color: '#22c55e' },
  { type: 'kafka', label: 'Kafka', icon: <Radio size={18} />, color: '#ef4444' },
];

export default function Toolbox() {
  const mode = useStore((s) => s.mode);
  const tools = mode === 'processFlow' ? processFlowTools : solutionDesignerTools;

  const onDragStart = (event: DragEvent, nodeType: AppNodeType) => {
    event.dataTransfer.setData('application/processnode', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="flex w-56 flex-col border-r bg-white/80 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/80"
         style={{ borderColor: 'var(--border-color)' }}>
      <div className="border-b p-3" style={{ borderColor: 'var(--border-color)' }}>
        <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
          {mode === 'processFlow' ? 'Toolbox' : 'Solution Blocks'}
        </h2>
      </div>
      <div className="flex flex-col gap-1.5 p-3">
        {tools.map((tool) => (
          <div
            key={tool.type}
            className="flex cursor-grab items-center gap-3 rounded-lg border px-3 py-2.5 transition-all hover:shadow-md active:cursor-grabbing"
            style={{
              borderColor: 'var(--border-color)',
              background: 'var(--bg-primary)',
            }}
            draggable
            onDragStart={(e) => onDragStart(e, tool.type)}
          >
            <div
              className="flex h-8 w-8 items-center justify-center rounded-md text-white"
              style={{ background: tool.color }}
            >
              {tool.icon}
            </div>
            <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              {tool.label}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-auto border-t p-3" style={{ borderColor: 'var(--border-color)' }}>
        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          {mode === 'processFlow'
            ? 'Drag nodes onto the canvas to build your process flow.'
            : 'Drag solution blocks onto the canvas to design your architecture.'}
        </p>
      </div>
    </div>
  );
}
