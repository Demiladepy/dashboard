import { Icons } from './Icons';

export default function LandingHero({ onEnter }) {
  return (
    <div className="landing-root min-h-screen flex flex-col relative overflow-hidden">
      <div className="landing-grid absolute inset-0 pointer-events-none" aria-hidden="true" />
      <div className="landing-glow absolute top-[-20%] left-1/2 -translate-x-1/2 w-[900px] h-[500px] pointer-events-none" aria-hidden="true" />

      <header className="relative z-10 flex items-center justify-between px-6 lg:px-12 py-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-accent/15 border border-accent/25 flex items-center justify-center text-accent">
            <Icons.shield />
          </div>
          <div>
            <span className="text-sm text-text tracking-tight block">HoloAid</span>
            <span className="text-[10px] text-muted">Monitoring care giver system</span>
          </div>
        </div>
        <span className="text-[11px] uppercase tracking-widest text-muted">Live demo</span>
      </header>

      <main className="relative z-10 flex-1 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20 px-6 lg:px-12 pb-16">
        <div className="max-w-xl text-center lg:text-left">
          <p className="text-[11px] uppercase tracking-[0.15em] text-accent mb-4 animate-fade-up">
            Perceive · Reason · Act
          </p>
          <h1 className="text-4xl lg:text-5xl xl:text-6xl text-text leading-[1.1] tracking-tight animate-fade-up delay-1">
            A brain that navigates
            <span className="block stripe-gradient-text mt-1">so caregivers don&apos;t have to.</span>
          </h1>
          <p className="mt-5 text-[15px] lg:text-base text-text-secondary leading-relaxed max-w-md mx-auto lg:mx-0 animate-fade-up delay-2">
            HoloAid fuses LiDAR, IMU, and spatial memory to pathfind, predict hazards, reroute autonomously, and escalate only when caregivers are needed.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start animate-fade-up delay-3">
            <button type="button" onClick={onEnter} className="stripe-btn">
              Launch Command Center
            </button>
            <div className="flex items-center justify-center gap-2 px-4 py-3 rounded-full border border-border bg-surface text-[11px] text-muted shadow-stripe-sm">
              <span className="w-2 h-2 rounded-full bg-accent header-pulse" />
              Live demo · 6-room spatial model
            </div>
          </div>
        </div>

        <div className="w-full max-w-sm lg:max-w-md animate-fade-up delay-4">
          <div className="stripe-card">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] uppercase tracking-wider text-muted">Brain capabilities</span>
              <span className="text-[10px] text-accent bg-blue-12 px-2 py-0.5 rounded-full border border-blue/15">ACTIVE</span>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Graph pathfinding + auto-reroute', value: 'Dijkstra' },
                { label: 'Environmental memory + drift detection', value: '6 rooms' },
                { label: 'Predictive slip/trip modeling', value: 'Real-time' },
                { label: 'Autonomous halt & caregiver escalation', value: '<30s' },
              ].map((m) => (
                <div key={m.label} className="flex items-center justify-between border-b border-border/60 pb-3 last:border-0 last:pb-0">
                  <span className="text-sm text-text-secondary">{m.label}</span>
                  <span className="text-[12px] text-accent">{m.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer className="relative z-10 px-6 pb-6 text-center">
        <p className="text-[10px] text-muted uppercase tracking-widest">
          Spatial AI · Assistive navigation · Demo simulation
        </p>
      </footer>
    </div>
  );
}
