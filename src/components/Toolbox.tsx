import { type DragEvent } from 'react';
import {
  Play,
  Square,
  RectangleHorizontal,
  Diamond,
  Layers,
  Clock,
} from 'lucide-react';
import type { ProcessNodeType } from '../types';

const tools: { type: ProcessNodeType; label: string; icon: React.ReactNode; color: string }[] = [
  { type: 'start', label: 'Start', icon: <Play size={18} />, color: '#22c55e' },
  { type: 'end', label: 'End', icon: <Square size={18} />, color: '#ef4444' },
  { type: 'processStep', label: 'Process', icon: <RectangleHorizontal size={18} />, color: '#3b82f6' },
  { type: 'decision', label: 'Decision', icon: <Diamond size={18} />, color: '#f59e0b' },
  { type: 'subprocess', label: 'Subprocess', icon: <Layers size={18} />, color: '#8b5cf6' },
  { type: 'delay', label: 'Delay', icon: <Clock size={18} />, color: '#6b7280' },
];

export default function Toolbox() {
  const onDragStart = (event: DragEvent, nodeType: ProcessNodeType) => {
    event.dataTransfer.setData('application/processnode', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="flex w-56 flex-col border-r bg-white/80 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/80"
         style={{ borderColor: 'var(--border-color)' }}>
      <div className="border-b p-3" style={{ borderColor: 'var(--border-color)' }}>
        <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
          Toolbox
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
          Drag nodes onto the canvas to build your process flow.
        </p>
      </div>
    </div>
  );
}
