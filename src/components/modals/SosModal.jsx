import { useState, useRef, useCallback } from 'react';
import { EMERGENCY_CONTACTS } from '../../data/constants';

export default function SosModal({ open, onClose }) {
  const [phase, setPhase] = useState('idle');
  const [progress, setProgress] = useState(0);
  const [contactIndex, setContactIndex] = useState(0);
  const holdTimer = useRef(null);
  const progressTimer = useRef(null);

  const reset = useCallback(() => {
    clearInterval(holdTimer.current);
    clearInterval(progressTimer.current);
    setPhase('idle');
    setProgress(0);
    setContactIndex(0);
  }, []);

  const handleClose = () => {
    reset();
    onClose();
  };

  const startHold = () => {
    if (phase !== 'idle') return;
    setProgress(0);
    progressTimer.current = setInterval(() => {
      setProgress((p) => {
        const next = p + 4;
        if (next >= 100) {
          clearInterval(progressTimer.current);
          setPhase('active');
          let idx = 0;
          holdTimer.current = setInterval(() => {
            idx += 1;
            setContactIndex(idx);
            if (idx >= EMERGENCY_CONTACTS.length) {
              clearInterval(holdTimer.current);
              setPhase('done');
            }
          }, 900);
        }
        return Math.min(100, next);
      });
    }, 60);
  };

  const cancelHold = () => {
    if (phase !== 'idle') return;
    clearInterval(progressTimer.current);
    setProgress(0);
  };

  if (!open) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="sos-title">
      <div className={`modal-panel sos-panel ${phase === 'active' || phase === 'done' ? 'sos-active' : ''}`}>
        {phase === 'idle' && (
          <>
            <h2 id="sos-title" className="text-lg font-semibold text-text">Emergency SOS</h2>
            <p className="text-sm text-text-secondary mt-2">Hold the button below for 1.5 seconds to alert all emergency contacts.</p>
            <button
              type="button"
              className="sos-hold-btn mt-8 relative"
              onMouseDown={startHold}
              onMouseUp={cancelHold}
              onMouseLeave={cancelHold}
              onTouchStart={startHold}
              onTouchEnd={cancelHold}
              aria-label="Hold to activate SOS"
            >
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 120 120" aria-hidden="true">
                <circle cx="60" cy="60" r="54" fill="none" stroke="#e3e8ee" strokeWidth="4" />
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke="#df1b41"
                  strokeWidth="4"
                  strokeDasharray={`${(progress / 100) * 339} 339`}
                  strokeLinecap="round"
                />
              </svg>
              <span className="relative z-10 text-accent-red font-bold text-sm">HOLD</span>
            </button>
            <button type="button" onClick={handleClose} className="mt-6 text-sm text-muted hover:text-text transition-colors">
              Cancel
            </button>
          </>
        )}

        {(phase === 'active' || phase === 'done') && (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-red-12 border-2 border-accent-red flex items-center justify-center sos-pulse">
              <span className="text-accent-red text-2xl font-bold">!</span>
            </div>
            <h2 className="text-xl font-semibold text-accent-red mt-4">SOS ACTIVATED</h2>
            <p className="text-sm text-text-secondary mt-2">Notifying emergency contacts…</p>
            <ul className="mt-6 space-y-2 text-left">
              {EMERGENCY_CONTACTS.map((c, i) => (
                <li
                  key={c.name}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg border text-sm transition-all duration-500 ${
                    i < contactIndex
                      ? 'border-green/30 bg-green-12 text-accent-cyan'
                      : 'border-border bg-background text-muted'
                  }`}
                >
                  <span>
                    {c.name}
                    <span className="text-[10px] font-mono ml-2 opacity-60">{c.relation}</span>
                  </span>
                  <span className="text-[10px] font-mono uppercase">
                    {i < contactIndex ? '✓ Sent' : '…'}
                  </span>
                </li>
              ))}
            </ul>
            {phase === 'done' && (
              <button type="button" onClick={handleClose} className="mt-6 px-6 py-2.5 rounded-lg bg-background border border-border text-sm text-text-secondary hover:bg-blue-12 transition-colors">
                Close
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
