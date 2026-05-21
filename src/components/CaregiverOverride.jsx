export default function CaregiverOverride({ pending, onApprove, onReject }) {
  if (!pending) return null;

  return (
    <div className="override-flash" role="alertdialog" aria-labelledby="override-title">
      <div className="override-flash-inner">
        <p id="override-title" className="text-[11px] uppercase tracking-[0.12em] text-accent-amber mb-1">
          Caregiver decision required
        </p>
        <p className="text-[13px] text-text leading-snug">
          HoloAid wants to reroute Afolabi. {pending.reason}
        </p>
        <div className="flex flex-wrap gap-1.5 mt-2 text-[10px] text-muted">
          <span className="px-2 py-0.5 rounded-md bg-surface border border-border">
            Was: {pending.originalRoute?.join(' → ')}
          </span>
          <span className="text-accent">→</span>
          <span className="px-2 py-0.5 rounded-md bg-accent/10 border border-accent/25 text-accent">
            New: {pending.proposedRoute?.join(' → ')}
          </span>
        </div>
        <div className="flex gap-2 mt-4">
          <button
            type="button"
            onClick={onApprove}
            className="flex-1 py-2 rounded-xl text-[11px] bg-accent/15 text-accent border border-accent/30 hover:bg-accent/25 transition-colors"
          >
            Approve reroute
          </button>
          <button
            type="button"
            onClick={onReject}
            className="flex-1 py-2 rounded-xl text-[11px] bg-surface text-text-secondary border border-border hover:bg-card transition-colors"
          >
            Ignore &amp; keep original path
          </button>
        </div>
      </div>
    </div>
  );
}
