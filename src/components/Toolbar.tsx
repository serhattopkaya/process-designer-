import { useCallback, useRef } from 'react';
import { useReactFlow } from '@xyflow/react';
import { toPng } from 'html-to-image';
import {
  Undo2,
  Redo2,
  LayoutGrid,
  Download,
  Upload,
  Image,
  ZoomIn,
  ZoomOut,
  Maximize,
  Sun,
  Moon,
} from 'lucide-react';
import { useStore } from '../store/useStore';

export default function Toolbar() {
  const undo = useStore((s) => s.undo);
  const redo = useStore((s) => s.redo);
  const autoLayout = useStore((s) => s.autoLayout);
  const exportToJson = useStore((s) => s.exportToJson);
  const importFromJson = useStore((s) => s.importFromJson);
  const darkMode = useStore((s) => s.darkMode);
  const toggleDarkMode = useStore((s) => s.toggleDarkMode);
  const mode = useStore((s) => s.mode);
  const setMode = useStore((s) => s.setMode);
  const canUndo = useStore((s) => s.historyIndex > 0);
  const canRedo = useStore((s) => s.historyIndex < s.history.length - 1);

  const { zoomIn, zoomOut, fitView } = useReactFlow();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportJson = useCallback(() => {
    const json = exportToJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'process-diagram.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [exportToJson]);

  const handleImportJson = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const text = ev.target?.result as string;
        importFromJson(text);
      };
      reader.readAsText(file);
      if (fileInputRef.current) fileInputRef.current.value = '';
    },
    [importFromJson],
  );

  const handleExportImage = useCallback(() => {
    const el = document.querySelector('.react-flow__viewport') as HTMLElement;
    if (!el) return;
    toPng(el, {
      backgroundColor: darkMode ? '#0f172a' : '#ffffff',
      quality: 1,
    }).then((dataUrl) => {
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = 'process-diagram.png';
      a.click();
    }).catch((err) => {
      console.error('Failed to export image:', err);
    });
  }, [darkMode]);

  const btnClass =
    'flex items-center justify-center rounded-lg p-2 transition-all hover:bg-gray-100 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed';

  return (
    <div
      className="flex items-center gap-0.5 border-b bg-white/80 px-3 py-1.5 backdrop-blur-sm dark:bg-slate-900/80"
      style={{ borderColor: 'var(--border-color)' }}
    >
      {/* Mode Toggle */}
      <div className="mr-4 flex items-center gap-1 rounded-lg border p-0.5" style={{ borderColor: 'var(--border-color)' }}>
        <button
          onClick={() => setMode('processFlow')}
          className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
            mode === 'processFlow'
              ? 'bg-blue-500 text-white shadow-sm'
              : 'hover:bg-gray-100 dark:hover:bg-slate-700'
          }`}
          style={mode !== 'processFlow' ? { color: 'var(--text-secondary)' } : undefined}
        >
          Process Flow
        </button>
        <button
          onClick={() => setMode('solutionDesigner')}
          className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
            mode === 'solutionDesigner'
              ? 'bg-blue-500 text-white shadow-sm'
              : 'hover:bg-gray-100 dark:hover:bg-slate-700'
          }`}
          style={mode !== 'solutionDesigner' ? { color: 'var(--text-secondary)' } : undefined}
        >
          Solution Designer
        </button>
      </div>

      <div className="h-6 w-px bg-gray-200 dark:bg-slate-700" />

      {/* Undo/Redo */}
      <button onClick={undo} disabled={!canUndo} className={btnClass} title="Undo (Ctrl+Z)">
        <Undo2 size={16} style={{ color: 'var(--text-secondary)' }} />
      </button>
      <button onClick={redo} disabled={!canRedo} className={btnClass} title="Redo (Ctrl+Shift+Z)">
        <Redo2 size={16} style={{ color: 'var(--text-secondary)' }} />
      </button>

      <div className="h-6 w-px bg-gray-200 dark:bg-slate-700" />

      {/* Auto Layout */}
      <button onClick={autoLayout} className={btnClass} title="Auto Layout">
        <LayoutGrid size={16} style={{ color: 'var(--text-secondary)' }} />
      </button>

      <div className="h-6 w-px bg-gray-200 dark:bg-slate-700" />

      {/* Zoom */}
      <button onClick={() => zoomIn()} className={btnClass} title="Zoom In">
        <ZoomIn size={16} style={{ color: 'var(--text-secondary)' }} />
      </button>
      <button onClick={() => zoomOut()} className={btnClass} title="Zoom Out">
        <ZoomOut size={16} style={{ color: 'var(--text-secondary)' }} />
      </button>
      <button onClick={() => fitView({ padding: 0.2 })} className={btnClass} title="Fit View">
        <Maximize size={16} style={{ color: 'var(--text-secondary)' }} />
      </button>

      <div className="h-6 w-px bg-gray-200 dark:bg-slate-700" />

      {/* Export/Import */}
      <button onClick={handleExportJson} className={btnClass} title="Export JSON">
        <Download size={16} style={{ color: 'var(--text-secondary)' }} />
      </button>
      <button onClick={handleImportJson} className={btnClass} title="Import JSON">
        <Upload size={16} style={{ color: 'var(--text-secondary)' }} />
      </button>
      <button onClick={handleExportImage} className={btnClass} title="Export as Image">
        <Image size={16} style={{ color: 'var(--text-secondary)' }} />
      </button>

      <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={handleFileChange} />

      {/* Spacer */}
      <div className="flex-1" />

      {/* Dark Mode */}
      <button onClick={toggleDarkMode} className={btnClass} title="Toggle Dark Mode">
        {darkMode ? (
          <Sun size={16} style={{ color: 'var(--text-secondary)' }} />
        ) : (
          <Moon size={16} style={{ color: 'var(--text-secondary)' }} />
        )}
      </button>
    </div>
  );
}
