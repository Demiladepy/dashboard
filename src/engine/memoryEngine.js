import { ENVIRONMENT_BASELINE } from './homeGraph';

export function createMemory() {
  return {
    activeHazards: [],
    resolvedHazards: [],
    anomalyCount: 0,
    furnitureDrift: {},
    roomVisits: {},
    autoActions: [],
    lastDecision: null,
  };
}

export function updateMemory(memory, { room, alertMeta, alertType }) {
  const next = {
    ...memory,
    roomVisits: { ...memory.roomVisits, [room]: (memory.roomVisits[room] || 0) + 1 },
    activeHazards: [...memory.activeHazards],
    resolvedHazards: [...memory.resolvedHazards],
    furnitureDrift: { ...memory.furnitureDrift },
    anomalyCount: memory.anomalyCount,
    autoActions: [...memory.autoActions],
  };

  if (!alertMeta) return next;

  const hazard = alertMeta.hazard;
  if (hazard && hazard !== 'none') {
    if (alertMeta.resolved) {
      next.activeHazards = next.activeHazards.filter((h) => h !== hazard);
      if (!next.resolvedHazards.includes(hazard)) next.resolvedHazards.push(hazard);
    } else if (!next.activeHazards.includes(hazard)) {
      next.activeHazards.push(hazard);
    }
  }

  if (hazard === 'furniture_shift') {
    next.anomalyCount += 1;
    next.furnitureDrift[room] = (next.furnitureDrift[room] || 0) + 1;
  }

  if (alertType === 'danger') {
    next.activeHazards.push('fall');
  }

  return next;
}

export function detectFurnitureAnomaly(room, obstacles) {
  const baseline = ENVIRONMENT_BASELINE[room] || [];
  const anomalies = [];

  for (const obj of obstacles) {
    const known = baseline.find((b) => b.id === obj.label || b.id === obj.id);
    if (known) {
      const dx = Math.abs(known.x - obj.x);
      const dy = Math.abs(known.y - obj.y);
      if (dx > 8 || dy > 8) {
        anomalies.push({ object: obj.label || obj.id, drift: Math.round(Math.sqrt(dx * dx + dy * dy)) });
      }
    } else if (obj.label !== 'threshold') {
      anomalies.push({ object: obj.label, drift: null, note: 'unmapped object' });
    }
  }

  return anomalies;
}

export function recordAutoAction(memory, action) {
  const entry = { ...action, timestamp: Date.now() };
  return {
    ...memory,
    autoActions: [entry, ...memory.autoActions].slice(0, 8),
  };
}
