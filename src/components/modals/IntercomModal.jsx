import { useState, useEffect } from 'react';
import { Icons } from '../Icons';

export default function IntercomModal({ open, onClose }) {
  const [talking, setTalking] = useState(false);
  const [bars, setBars] = useState(Array(12).fill(20));

  useEffect(() => {
    if (!talking) {
      setBars(Array(12).fill(12));
      return undefined;
    }
    const id = setInterval(() => {
      setBars(Array.from({ length: 12 }, () => 15 + Math.random() * 70));
    }, 80);
    return () => clearInterval(id);
  }, [talking]);

  if (!open) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="intercom-title">
      <div className="modal-panel">
        <div className="flex items-center justify-between">
          <h2 id="intercom-title" className="text-lg font-semibold text-slate-100">Intercom</h2>
          <button type="button" onClick={onClose} className="text-dim hover:text-slate-300 p-1" aria-label="Close intercom">
            <Icons.close />
          </button>
        </div>
        <p className="text-sm text-text-secondary mt-1">Connected to Afolabi&apos;s HoloAid headset</p>

        <div className="mt-6 flex items-end justify-center gap-1 h-16">
          {bars.map((h, i) => (
            <div
              key={i}
              className="w-2 rounded-full bg-green transition-all duration-75"
              style={{ height: `${h}%`, opacity: talking ? 0.4 + (h / 100) * 0.6 : 0.2 }}
            />
          ))}
        </div>

        <p className="text-center text-[11px] font-mono text-dim mt-4">
          {talking ? 'Transmitting…' : 'Hold to speak'}
        </p>

        <button
          type="button"
          className={`mt-6 mx-auto flex items-center justify-center gap-2 w-full max-w-[200px] py-3 rounded-xl font-semibold text-sm transition-all ${
            talking ? 'bg-green text-background scale-105' : 'bg-green-12 text-green border border-green/20'
          }`}
          onMouseDown={() => setTalking(true)}
          onMouseUp={() => setTalking(false)}
          onMouseLeave={() => setTalking(false)}
          onTouchStart={() => setTalking(true)}
          onTouchEnd={() => setTalking(false)}
          aria-label="Push to talk"
        >
          <Icons.mic />
          {talking ? 'Speaking…' : 'Push to Talk'}
        </button>
      </div>
    </div>
  );
}
