export default function ActionBar({ onIntercom, onReports, onSos }) {
  return (
    <section aria-label="Caregiver actions">
      <div className="flex gap-2 p-1 rounded-2xl bg-card/80 border border-border backdrop-blur-xl">
        <button type="button" onClick={onIntercom} className="flex-1 py-2.5 rounded-xl text-[11px] text-accent bg-accent/10 border border-accent/20 hover:bg-accent/20 transition-colors">
          Intercom
        </button>
        <button type="button" onClick={onReports} className="flex-1 py-2.5 rounded-xl text-[11px] text-text-secondary bg-surface border border-border hover:bg-card transition-colors">
          Reports
        </button>
        <button type="button" onClick={onSos} className="flex-1 py-2.5 rounded-xl text-[11px] text-accent-red bg-accent-red/10 border border-accent-red/20 hover:bg-accent-red/20 transition-colors">
          SOS
        </button>
      </div>
    </section>
  );
}
