import { Icons, ALERT_STYLES } from './Icons';

export default function AlertFeed({ alerts }) {
  return (
    <section aria-label="Live alerts" className="stripe-card !p-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="section-label">Event stream</h2>
        <span className="text-[10px] text-muted">{alerts.length} events</span>
      </div>
      <div className="flex flex-col gap-2" role="log" aria-live="polite">
        {alerts.map((alert) => {
          const IconComp = Icons[alert.type] || Icons.info;
          return (
            <div key={alert.id} className="alert-item flex items-center gap-3">
              <div className={`w-7 h-7 shrink-0 rounded-lg flex items-center justify-center ${ALERT_STYLES[alert.type] || ALERT_STYLES.info}`}>
                <IconComp />
              </div>
              <div className="flex-1 flex justify-between items-center bg-surface border border-border rounded-xl px-3 py-2 min-w-0">
                <span className="text-[12px] text-text-secondary truncate">{alert.msg}</span>
                <span className="text-[9px] text-muted shrink-0 ml-2">{alert.time}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
