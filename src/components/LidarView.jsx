import { useEffect, useState } from 'react';
import { LIDAR_OBSTACLES } from '../data/constants';

export default function LidarView({ activeRoomId, activeRoomLabel, anomalies = [] }) {
  const [scanLine, setScanLine] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setScanLine((s) => (s + 2) % 100), 50);
    return () => clearInterval(id);
  }, []);

  return (
    <section aria-label="LiDAR sensor view" className="stripe-card !p-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="section-label">LiDAR fusion — {activeRoomLabel.toLowerCase()}</h2>
        <span className="text-[10px] text-accent flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-accent header-pulse" />
          Fusing
        </span>
      </div>
      <div className="bg-background rounded-xl border border-border h-[130px] relative overflow-hidden">
        <div className="absolute inset-0 lidar-grid opacity-40" aria-hidden="true" />
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="scanGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00d4ff" stopOpacity="0" />
              <stop offset="50%" stopColor="#635bff" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#00d4ff" stopOpacity="0" />
            </linearGradient>
          </defs>
          <rect x="0" y={scanLine - 8} width="100" height="16" fill="url(#scanGrad)" />
          {LIDAR_OBSTACLES.map((obs) => (
            <g key={obs.label}>
              <rect x={obs.x} y={obs.y} width={obs.w} height={obs.h} fill="none" stroke="#635bff" strokeWidth="0.5" strokeDasharray="1 1" opacity="0.7" />
              <text x={obs.x + obs.w / 2} y={obs.y - 2} textAnchor="middle" fill="#8898aa" fontSize="3" fontFamily="Varela Round, sans-serif">
                {obs.label}
              </text>
            </g>
          ))}
          <circle cx="50" cy="85" r="3" fill="#635bff" opacity="0.9" />
        </svg>
        <div className="absolute bottom-2 left-2 right-2 flex justify-between text-[9px] text-muted">
          <span>{activeRoomId}</span>
          <span>{anomalies.length > 0 ? `${anomalies.length} drift detected` : 'baseline match'}</span>
          <span>4.2m depth</span>
        </div>
      </div>
    </section>
  );
}
