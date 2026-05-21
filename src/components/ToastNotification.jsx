import { useEffect } from 'react';
import { Icons, ALERT_STYLES } from './Icons';

export default function ToastNotification({ toast, onDismiss }) {
  useEffect(() => {
    if (!toast) return undefined;
    const id = setTimeout(onDismiss, 4500);
    return () => clearTimeout(id);
  }, [toast, onDismiss]);

  if (!toast) return null;

  const IconComp = Icons[toast.type] || Icons.warn;

  return (
    <div className="toast-container" role="alert">
      <div className={`toast-item ${toast.type === 'danger' ? 'toast-danger' : 'toast-warn'}`}>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${ALERT_STYLES[toast.type]}`}>
          <IconComp />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] uppercase tracking-wide text-muted">Brain decision: {toast.decision}</p>
          <p className="text-sm text-text truncate">{toast.msg}</p>
        </div>
        <button type="button" onClick={onDismiss} className="text-muted hover:text-text p-1" aria-label="Dismiss">
          <Icons.close />
        </button>
      </div>
    </div>
  );
}
