const LEVEL_STYLES = {
  low: { bar: 'bg-accent', text: 'text-accent', badge: 'badge-cyan' },
  moderate: { bar: 'bg-muted', text: 'text-muted', badge: 'badge-muted' },
  high: { bar: 'bg-accent-amber', text: 'text-accent-amber', badge: 'badge-amber' },
  critical: { bar: 'bg-accent-red', text: 'text-accent-red', badge: 'badge-red' },
};

export default function GuardianBrainPanel({ brain }) {
  const styles = LEVEL_STYLES[brain.riskLevel] || LEVEL_STYLES.low;

  return (
    <section aria-label="HoloAid AI brain" className="stripe-card overflow-hidden">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h2 className="section-label">HoloAid Brain</h2>
          <p className="text-sm text-text-secondary mt-1">Autonomous reasoning · pathfinding · hazard response</p>
        </div>
        <div className={`text-right ${styles.text}`}>
          <span className="text-2xl font-bold tabular-nums">{brain.riskScore}</span>
          <span className="text-[10px] uppercase tracking-wider block opacity-70">{brain.riskLevel} risk</span>
        </div>
      </div>

      <div className="h-1.5 rounded-full bg-background overflow-hidden mb-5">
        <div
          className={`h-full rounded-full transition-all duration-700 ${styles.bar}`}
          style={{ width: `${brain.riskScore}%` }}
        />
      </div>

      <div className="space-y-2 mb-5 max-h-[180px] overflow-y-auto brain-scroll">
        {brain.reasoning.map((r, i) => (
          <div key={`${r.step}-${i}`} className="brain-step flex gap-3">
            <div className="shrink-0 w-16">
              <span className="text-[10px] uppercase tracking-wider text-accent font-semibold">{r.step}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] text-text leading-snug">{r.detail}</p>
              <span className="text-[10px] text-muted">{Math.round(r.confidence * 100)}% confidence</span>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl bg-background border border-border p-3 mb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${styles.badge}`}>
            {brain.decision.priority}
          </span>
          {brain.decision.autonomous && (
            <span className="text-[10px] text-accent uppercase tracking-wider">Autonomous</span>
          )}
        </div>
        <p className="text-sm font-semibold text-text">{brain.decision.label}</p>
        <p className="text-[12px] text-text-secondary mt-0.5">{brain.decision.reason}</p>
      </div>

      {brain.prediction && (
        <div className="rounded-xl bg-blue-12 border border-blue/15 p-3 mb-4">
          <p className="text-[10px] uppercase tracking-wider text-accent mb-1">Predictive alert</p>
          <p className="text-[13px] text-text">
            {Math.round(brain.prediction.probability * 100)}% {brain.prediction.type} risk within {brain.prediction.window}
          </p>
        </div>
      )}

      <div>
        <p className="text-[10px] uppercase tracking-wider text-muted mb-2">Caregiver recommendations</p>
        <ul className="space-y-1.5">
          {brain.recommendations.slice(0, 3).map((rec, i) => (
            <li key={i} className="flex items-start gap-2 text-[12px] text-text-secondary">
              <span className="text-accent shrink-0">→</span>
              <span>
                {rec.text}
                {rec.autonomous && <span className="text-accent ml-1">(auto-handled)</span>}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
