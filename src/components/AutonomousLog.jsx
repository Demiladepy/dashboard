export default function AutonomousLog({ memory }) {
  const actions = memory?.autoActions || [];
  if (actions.length === 0) return null;

  return (
    <section aria-label="Autonomous actions log" className="stripe-card">
      <h2 className="section-label mb-3">Autonomous actions</h2>
      <ul className="space-y-2">
        {actions.slice(0, 5).map((a, i) => (
          <li key={`${a.action}-${a.timestamp}-${i}`} className="flex items-center gap-3 text-[12px]">
            <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
            <span className="text-text-secondary capitalize">{a.room}</span>
            <span className="text-text flex-1">{a.label}</span>
            <span className="text-[10px] text-muted uppercase">{a.action.replace(/_/g, ' ')}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
