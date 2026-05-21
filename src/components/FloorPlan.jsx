import { ROOM_LAYOUT } from '../data/constants';

const CONTAINER_W = 426;
const CONTAINER_H = 268;

function plannedPathPoints(plannedRoute) {
  if (!plannedRoute?.length) return '';
  return plannedRoute
    .map((room) => {
      const layout = ROOM_LAYOUT[room];
      return layout ? `${layout.dotX},${layout.dotY}` : null;
    })
    .filter(Boolean)
    .join(' ');
}

export default function FloorPlan({ activeRoomId, currentStatus, pathTrail, plannedRoute }) {
  const trailPoints = pathTrail.length > 1 ? pathTrail.map((p) => `${p.x},${p.y}`).join(' ') : '';
  const plannedPoints = plannedPathPoints(plannedRoute);

  return (
    <section aria-label="Real-time floor plan" className="stripe-card !p-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="section-label">Spatial map</h2>
        <span className="text-[10px] text-muted bg-surface border border-border px-2 py-0.5 rounded-full">
          0.4 m/s
        </span>
      </div>

      <div className="w-full bg-surface rounded-xl border border-border h-[220px] lg:h-[260px] relative overflow-hidden flex items-center justify-center">
        <div
          className="relative"
          style={{ width: CONTAINER_W, height: CONTAINER_H, transform: 'scale(0.82)', transformOrigin: 'center' }}
        >
          <svg className="absolute inset-0 pointer-events-none" width={CONTAINER_W} height={CONTAINER_H} aria-hidden="true">
            <line x1="152" y1="62" x2="152" y2="82" stroke="#635bff" strokeWidth="2" strokeDasharray="3 2" opacity="0.35" />
            <line x1="273" y1="62" x2="273" y2="82" stroke="#635bff" strokeWidth="2" strokeDasharray="3 2" opacity="0.35" />
          </svg>

          {Object.entries(ROOM_LAYOUT).map(([id, info]) => {
            const isActive = activeRoomId === id;
            return (
              <div
                key={id}
                className={`absolute border rounded-lg flex items-end p-2 room-highlight ${
                  isActive
                    ? 'border-accent/40 bg-accent/5 shadow-[inset_0_0_24px_rgba(99,91,255,0.1)]'
                    : 'border-border bg-transparent'
                }`}
                style={{ top: info.top, left: info.left, width: info.width, height: info.height }}
              >
                <span className={`text-[9px] ${isActive ? 'text-accent' : 'text-muted'}`}>{info.label}</span>
              </div>
            );
          })}

          {plannedPoints && (
            <svg className="absolute inset-0 pointer-events-none z-[5]" width={CONTAINER_W} height={CONTAINER_H} aria-hidden="true">
              <polyline points={plannedPoints} fill="none" stroke="#635bff" strokeWidth="1.5" className="path-planned" />
            </svg>
          )}

          {trailPoints && (
            <svg className="absolute inset-0 pointer-events-none z-10" width={CONTAINER_W} height={CONTAINER_H} aria-hidden="true">
              <polyline points={trailPoints} fill="none" stroke="#00d4ff" strokeWidth="2" strokeLinecap="round" className="path-flow" />
            </svg>
          )}

          <div
            className="absolute w-[14px] h-[14px] rounded-full bg-accent-cyan avatar-move z-20"
            style={{
              top: ROOM_LAYOUT[activeRoomId].dotY,
              left: ROOM_LAYOUT[activeRoomId].dotX,
              transform: 'translate(-50%, -50%)',
              boxShadow: '0 0 12px rgba(0, 212, 255, 0.6)',
            }}
            aria-label={`User located in ${ROOM_LAYOUT[activeRoomId].label}`}
          >
            <div className="absolute top-1/2 left-1/2 w-full h-full rounded-full border-[1.5px] border-accent-cyan avatar-ring-anim box-border pointer-events-none" />
            <div className="absolute top-[-26px] left-1/2 -translate-x-1/2 bg-background/90 px-2 py-0.5 rounded-md whitespace-nowrap z-30 border border-accent-cyan/20">
              <span className="text-[8px] text-accent-cyan">{currentStatus.dist}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4 mt-2 text-[10px] text-muted">
        <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-accent inline-block rounded" /> Planned</span>
        <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-accent-cyan inline-block rounded" /> Actual</span>
      </div>
    </section>
  );
}
