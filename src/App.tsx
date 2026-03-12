import { useEffect, useCallback, useState } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import Toolbox from './components/Toolbox';
import Canvas from './components/Canvas';
import PropertiesPanel from './components/PropertiesPanel';
import Toolbar from './components/Toolbar';
import Toast, { type ToastData } from './components/Toast';
import { useStore } from './store/useStore';

export default function App() {
  const { darkMode, undo, redo, deleteSelected } = useStore();
  const [toasts, setToasts] = useState<ToastData[]>([]);

  // Apply dark mode on mount
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isCtrl = e.ctrlKey || e.metaKey;

      if (isCtrl && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if (isCtrl && (e.key === 'Z' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        redo();
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const target = e.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;
        deleteSelected();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [undo, redo, deleteSelected]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ReactFlowProvider>
      <div className="flex h-screen w-screen flex-col" style={{ background: 'var(--bg-primary)' }}>
        <Toolbar />
        <div className="flex flex-1 overflow-hidden">
          <Toolbox />
          <Canvas />
          <PropertiesPanel />
        </div>

        {/* Toast container */}
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
          {toasts.map((t) => (
            <Toast key={t.id} toast={t} onRemove={removeToast} />
          ))}
        </div>
      </div>
    </ReactFlowProvider>
  );
}
