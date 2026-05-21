import { ROUTE } from '../data/constants';

export default function TimelineScrubber({ routeIndex, routeLength, onScrub, paused, onTogglePause }) {
  return (
    <section aria-label="Route timeline" className="stripe-card !p-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="section-label">Route replay</h2>
        <button
          type="button"
          onClick={onTogglePause}
          className="text-[10px] uppercase tracking-wide px-2.5 py-1 rounded-full border border-border bg-surface text-muted hover:text-text transition-colors"
        >
          {paused ? '▶ Resume' : '⏸ Pause'}
        </button>
      </div>
      <input
        type="range"
        min={0}
        max={routeLength - 1}
        value={routeIndex}
        onChange={(e) => onScrub(Number(e.target.value))}
        className="timeline-slider w-full"
        aria-label="Scrub through route"
      />
      <div className="flex justify-between mt-2 text-[9px] text-muted">
        <span className="capitalize">{ROUTE[0].room}</span>
        <span className="text-accent capitalize">{ROUTE[routeIndex].room}</span>
        <span className="capitalize">{ROUTE[routeLength - 1].room}</span>
      </div>
    </section>
  );
}
