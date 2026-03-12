import { useEffect, useRef } from 'react';
import { Copy, Trash2 } from 'lucide-react';

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

export default function ContextMenu({ x, y, onClose, onDelete, onDuplicate }: ContextMenuProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as HTMLElement)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  const items = [
    { label: 'Duplicate', icon: <Copy size={14} />, action: onDuplicate },
    { label: 'Delete', icon: <Trash2 size={14} />, action: onDelete, danger: true },
  ];

  return (
    <div
      ref={ref}
      className="context-menu fixed z-50 min-w-[160px] rounded-lg border bg-white py-1 shadow-xl dark:border-slate-700 dark:bg-slate-800"
      style={{ left: x, top: y, borderColor: 'var(--border-color)' }}
    >
      {items.map((item) => (
        <button
          key={item.label}
          onClick={() => {
            item.action();
            onClose();
          }}
          className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors ${
            item.danger
              ? 'text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20'
              : 'hover:bg-gray-50 dark:hover:bg-slate-700'
          }`}
          style={item.danger ? {} : { color: 'var(--text-primary)' }}
        >
          <span style={item.danger ? {} : { color: 'var(--text-secondary)' }}>{item.icon}</span>
          {item.label}
        </button>
      ))}
    </div>
  );
}
