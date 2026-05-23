export default function StatsPanel({ stats }) {
  const items = [
    { label: 'Safe trips', value: stats.safeTrips, color: 'text-accent-cyan' },
    { label: 'Auto actions', value: stats.autoActions, color: 'text-accent' },
    { label: 'Reroutes', value: stats.reroutes, color: 'text-accent-amber' },
    { label: 'Alerts', value: stats.alerts, color: 'text-accent-amber' },
    { label: 'Independent', value: stats.independent, color: 'text-text' },
  ];

  return (
    <section aria-label="System metrics" className="stripe-card !p-4">
      <h2 className="section-label mb-3">Brain metrics</h2>
      <div className="grid grid-cols-3 gap-2">
        {items.slice(0, 3).map((item) => (
          <div key={item.label} className="bg-background rounded-xl border border-border p-3 text-center stat-card">
            <span className={`text-xl font-normal tabular-nums ${item.color}`}>{item.value}</span>
            <span className="text-[10px] text-muted uppercase block mt-1">{item.label}</span>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2 mt-2">
        {items.slice(3).map((item) => (
          <div key={item.label} className="bg-background rounded-xl border border-border p-3 text-center stat-card">
            <span className={`text-lg font-normal tabular-nums ${item.color}`}>{item.value}</span>
            <span className="text-[10px] text-muted uppercase block mt-1">{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
