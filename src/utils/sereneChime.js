let audioContext = null;

function getContext() {
  if (typeof window === 'undefined') return null;
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
}

/** Soft two-tone chime — calm, not alarming */
export function playSereneChime(type = 'info') {
  if (typeof window === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const ctx = getContext();
  if (!ctx) return;

  if (ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }

  const now = ctx.currentTime;
  const tones =
    type === 'danger'
      ? [392, 523.25]
      : type === 'warn'
        ? [440, 554.37]
        : type === 'safe'
          ? [523.25, 659.25]
          : [493.88, 587.33];

  tones.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + i * 0.12);

    gain.gain.setValueAtTime(0, now + i * 0.12);
    gain.gain.linearRampToValueAtTime(0.06, now + i * 0.12 + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 1.2);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + i * 0.12);
    osc.stop(now + i * 0.12 + 1.25);
  });
}

export function primeAudio() {
  const ctx = getContext();
  if (ctx?.state === 'suspended') {
    ctx.resume().catch(() => {});
  }
}
