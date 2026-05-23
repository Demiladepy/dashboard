export default function ActionBar({ onIntercom, onReports, onSos }) {
  return (
    <section aria-label="Caregiver actions">
      <div className="flex gap-2 p-1.5 rounded-2xl bg-surface border border-border shadow-stripe-sm">
        <button type="button" onClick={onIntercom} className="flex-1 py-2.5 rounded-xl text-[11px] text-accent bg-blue-12 border border-blue/15 hover:bg-blue/20 transition-colors">
          Intercom
        </button>
        <button type="button" onClick={onReports} className="flex-1 py-2.5 rounded-xl text-[11px] text-text-secondary bg-background border border-border hover:bg-blue-12 transition-colors">
          Reports
        </button>
        <button type="button" onClick={onSos} className="flex-1 py-2.5 rounded-xl text-[11px] text-accent-red bg-accent-red/10 border border-accent-red/20 hover:bg-accent-red/20 transition-colors">
          SOS
        </button>
      </div>
    </section>
  );
}
