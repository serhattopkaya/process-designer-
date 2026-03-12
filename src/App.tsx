import { useEffect } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import Toolbox from './components/Toolbox';
import Canvas from './components/Canvas';
import PropertiesPanel from './components/PropertiesPanel';
import Toolbar from './components/Toolbar';
import { useStore } from './store/useStore';

export default function App() {
  const { darkMode, undo, redo, deleteSelected } = useStore();

  // Apply dark mode class on mount and when toggled
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
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

  return (
    <ReactFlowProvider>
      <div className="flex h-screen w-screen flex-col" style={{ background: 'var(--bg-primary)' }}>
        <Toolbar />
        <div className="flex flex-1 overflow-hidden">
          <Toolbox />
          <Canvas />
          <PropertiesPanel />
        </div>
      </div>
    </ReactFlowProvider>
  );
}
