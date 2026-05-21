import { ROOM_COLORS } from '../data/constants';

export default function ActivityChart({ chartData }) {
  return (
    <section aria-label="Activity by room" className="stripe-card !p-4">
      <h2 className="section-label mb-3">Room occupancy</h2>
      <div className="bg-surface rounded-xl border border-border p-4">
        <div className="w-full flex justify-between items-end h-[48px]">
          {chartData.map((col) => (
            <div key={col.time} className="w-[18px] h-full flex flex-col justify-end gap-px">
              {col.parts.map((part, pidx) => (
                <div
                  key={pidx}
                  style={{ height: `${part.h}%`, backgroundColor: part.c }}
                  className="w-full rounded-[1px] transition-all duration-700"
                />
              ))}
            </div>
          ))}
        </div>
        <div className="w-full flex justify-between mt-2">
          {chartData.map((col, idx) => (
            <span key={col.time} className="text-[8px] text-muted">{idx % 2 === 0 ? col.time : ''}</span>
          ))}
        </div>
        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-4 justify-center">
          {Object.entries(ROOM_COLORS).map(([key, hex]) => (
            <div key={key} className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: hex }} />
              <span className="text-[9px] text-muted capitalize">{key}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
