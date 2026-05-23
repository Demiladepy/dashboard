import { useEffect } from 'react';
import { playSereneChime } from '../utils/sereneChime';

const TYPE_STYLES = {
  info: 'serene-info',
  safe: 'serene-safe',
  warn: 'serene-warn',
  danger: 'serene-danger',
};

export default function SereneAlert({ alert, onDismiss, soundEnabled = true }) {
  useEffect(() => {
    if (!alert) return undefined;

    if (soundEnabled) {
      playSereneChime(alert.type);
    }

    const id = setTimeout(onDismiss, alert.type === 'danger' ? 8000 : 5500);
    return () => clearTimeout(id);
  }, [alert, onDismiss, soundEnabled]);

  if (!alert) return null;

  return (
    <div className="serene-alert-wrap" role="status" aria-live="polite">
      <div className={`serene-alert ${TYPE_STYLES[alert.type] || TYPE_STYLES.info}`}>
        <div className="serene-alert-glow" aria-hidden="true" />

        <div className="relative z-10">
          <div className="flex items-center justify-between gap-3 mb-2">
            <span className="serene-alert-headline">{alert.headline}</span>
            <span className="serene-alert-room">{alert.room}</span>
          </div>

          <p className="serene-alert-message">{alert.message}</p>
          <p className="serene-alert-reassurance">{alert.reassurance}</p>

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
            <span className="text-[10px] text-muted capitalize">{alert.riskLevel} risk · HoloAid brain</span>
            <button
              type="button"
              onClick={onDismiss}
              className="text-[11px] text-accent hover:opacity-80 transition-opacity"
            >
              Acknowledge
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
