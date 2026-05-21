import { CHAOS_PRESET_LIST } from '../data/chaosPresets';

export default function ChaosInjector({ onInject, disabled }) {
  return (
    <section aria-label="Demo sandbox controller" className="stripe-card !p-4 border-accent/20">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="section-label">Chaos sandbox</h2>
          <p className="text-[11px] text-text-secondary mt-0.5">Inject hazards on demand — no waiting for the loop</p>
        </div>
        <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full badge-amber">Judge mode</span>
      </div>

      <div className="flex flex-col gap-2">
        {CHAOS_PRESET_LIST.map((preset) => (
          <button
            key={preset.id}
            type="button"
            disabled={disabled}
            onClick={() => onInject(preset.id)}
            className={`text-left px-3 py-2.5 rounded-xl border transition-all ${
              preset.type === 'danger'
                ? 'border-accent-red/25 bg-accent-red/5 hover:bg-accent-red/10 text-text'
                : 'border-border bg-surface hover:border-accent/30 hover:bg-accent/5 text-text-secondary hover:text-text'
            } disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            <span className="text-[12px] block">{preset.label}</span>
            <span className="text-[10px] text-muted mt-0.5 block">{preset.description}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
