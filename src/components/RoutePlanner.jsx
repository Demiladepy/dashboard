export default function RoutePlanner({ brain, activeRoomId }) {
  const { route } = brain;
  if (!route?.planned) return null;

  return (
    <section aria-label="Route planner" className="stripe-card">
      <div className="flex items-center justify-between mb-3">
        <h2 className="section-label">Path engine</h2>
        {route.rerouted && (
          <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full badge-amber">
            Rerouted
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-1.5 mb-3">
        {route.planned.map((room, i) => (
          <span key={`${room}-${i}`} className="flex items-center gap-1.5">
            <span
              className={`text-[11px] px-2 py-1 rounded-md capitalize ${
                room === activeRoomId
                  ? 'bg-accent/20 text-accent border border-accent/30'
                  : 'bg-surface text-text-secondary border border-border'
              }`}
            >
              {room}
            </span>
            {i < route.planned.length - 1 && <span className="text-muted text-[10px]">→</span>}
          </span>
        ))}
      </div>

      <div className="flex gap-4 text-[11px] text-text-secondary">
        <span>Distance: <strong className="text-text">{route.distance}m</strong></span>
        <span>ETA: <strong className="text-accent">{route.eta}</strong></span>
        <span>Target: <strong className="text-text capitalize">{route.destination}</strong></span>
      </div>
    </section>
  );
}
