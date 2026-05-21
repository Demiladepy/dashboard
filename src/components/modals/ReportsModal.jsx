import { Icons } from '../Icons';

export default function ReportsModal({ open, onClose, stats, alerts, brain }) {
  if (!open) return null;

  const handleExport = () => {
    const report = [
      'HoloAid — Brain Report',
      `Date: ${new Date().toLocaleDateString()}`,
      '',
      '--- Metrics ---',
      `Safe trips: ${stats.safeTrips}`,
      `Auto actions: ${stats.autoActions}`,
      `Reroutes: ${stats.reroutes}`,
      `Alerts: ${stats.alerts}`,
      `Risk: ${brain.riskScore}/100 (${brain.riskLevel})`,
      '',
      '--- Last decision ---',
      `${brain.decision.label}: ${brain.decision.reason}`,
      '',
      '--- Active hazards ---',
      brain.memory.activeHazards.join(', ') || 'none',
      '',
      '--- Recent events ---',
      ...alerts.slice(0, 8).map((a) => `[${a.type}] ${a.msg}`),
    ].join('\n');

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `holoaid-brain-report-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="reports-title">
      <div className="modal-panel max-w-md">
        <div className="flex items-center justify-between">
          <h2 id="reports-title" className="text-lg text-text flex items-center gap-2">
            <Icons.report />
            Brain Report
          </h2>
          <button type="button" onClick={onClose} className="text-muted hover:text-text p-1" aria-label="Close">
            <Icons.close />
          </button>
        </div>

        <div className="mt-4 rounded-xl bg-surface border border-border p-3">
          <p className="text-[11px] text-muted uppercase tracking-wider mb-1">Last autonomous decision</p>
          <p className="text-sm text-text">{brain.decision.label}</p>
          <p className="text-[12px] text-text-secondary mt-0.5">{brain.decision.reason}</p>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-4">
          {[
            { label: 'Auto actions', value: stats.autoActions },
            { label: 'Reroutes', value: stats.reroutes },
            { label: 'Risk', value: brain.riskScore },
          ].map((s) => (
            <div key={s.label} className="bg-surface border border-border rounded-xl p-3 text-center">
              <span className="text-xl text-accent tabular-nums">{s.value}</span>
              <p className="text-[9px] text-muted uppercase mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <button type="button" onClick={handleExport} className="stripe-btn w-full mt-5 !rounded-xl">
          Export Brain Report
        </button>
      </div>
    </div>
  );
}
