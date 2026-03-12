import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

export interface ToastData {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ToastProps {
  toast: ToastData;
  onRemove: (id: string) => void;
}

const icons = {
  success: <CheckCircle size={16} className="text-green-500" />,
  error: <XCircle size={16} className="text-red-500" />,
  info: <Info size={16} className="text-blue-500" />,
};

export default function Toast({ toast, onRemove }: ToastProps) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(() => onRemove(toast.id), 300);
    }, 3000);
    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  return (
    <div
      className={`flex items-center gap-2 rounded-lg border bg-white px-4 py-2.5 shadow-lg dark:border-slate-700 dark:bg-slate-800 ${exiting ? 'toast-exit' : 'toast-enter'}`}
      style={{ borderColor: 'var(--border-color)' }}
    >
      {icons[toast.type]}
      <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{toast.message}</span>
      <button
        onClick={() => { setExiting(true); setTimeout(() => onRemove(toast.id), 300); }}
        className="ml-2 rounded p-0.5 hover:bg-gray-100 dark:hover:bg-slate-700"
      >
        <X size={12} style={{ color: 'var(--text-secondary)' }} />
      </button>
    </div>
  );
}
