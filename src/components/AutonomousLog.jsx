export default function AutonomousLog({ memory }) {
  const auto = memory?.autoActions || [];
  const caregiver = memory?.caregiverActions || [];
  const combined = [
    ...caregiver.map((a) => ({ ...a, source: 'caregiver' })),
    ...auto.map((a) => ({ ...a, source: 'brain' })),
  ].sort((a, b) => b.timestamp - a.timestamp);

  if (combined.length === 0) return null;

  return (
    <section aria-label="Action log" className="stripe-card">
      <h2 className="section-label mb-3">Action log</h2>
      <ul className="space-y-2">
        {combined.slice(0, 6).map((a, i) => (
          <li key={`${a.action}-${a.timestamp}-${i}`} className="flex items-center gap-3 text-[12px]">
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${a.source === 'caregiver' ? 'bg-accent-amber' : 'bg-accent'}`} />
            <span className="text-[10px] text-muted uppercase w-14 shrink-0">{a.source}</span>
            <span className="text-text flex-1">{a.label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
