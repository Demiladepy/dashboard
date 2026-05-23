export default function ImpactBanner({ stats, brain }) {
  const items = [
    { label: 'Risk level', value: brain.riskLevel, suffix: `${brain.riskScore}/100` },
    { label: 'Auto actions', value: stats.autoActions, suffix: 'today' },
    { label: 'Active hazards', value: brain.memory.activeHazards.length, suffix: 'in memory' },
  ];

  return (
    <section aria-label="System status" className="hidden lg:grid grid-cols-3 gap-4">
      {items.map((m) => (
        <div key={m.label} className="stripe-card !py-3 !px-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted">{m.label}</p>
            <p className="text-lg text-text mt-0.5 capitalize">
              {m.value}
              <span className="text-[11px] text-muted ml-2">{m.suffix}</span>
            </p>
          </div>
          <span className="text-[10px] text-accent bg-blue-12 px-2 py-1 rounded-full border border-blue/15">
            brain
          </span>
        </div>
      ))}
    </section>
  );
}
