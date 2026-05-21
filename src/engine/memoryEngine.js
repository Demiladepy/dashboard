import { ENVIRONMENT_BASELINE } from './homeGraph';

export function createMemory() {
  return {
    activeHazards: [],
    resolvedHazards: [],
    hazardFreshness: {},
    anomalyCount: 0,
    furnitureDrift: {},
    roomVisits: {},
    autoActions: [],
    caregiverActions: [],
    lastDecision: null,
  };
}

export function updateMemory(memory, { room, alertMeta, alertType }) {
  const next = {
    ...memory,
    roomVisits: { ...memory.roomVisits, [room]: (memory.roomVisits[room] || 0) + 1 },
    activeHazards: [...memory.activeHazards],
    resolvedHazards: [...memory.resolvedHazards],
    hazardFreshness: { ...(memory.hazardFreshness || {}) },
    furnitureDrift: { ...memory.furnitureDrift },
    anomalyCount: memory.anomalyCount,
    autoActions: [...memory.autoActions],
    caregiverActions: [...(memory.caregiverActions || [])],
  };

  if (!alertMeta) return next;

  const hazard = alertMeta.hazard;
  if (hazard && hazard !== 'none') {
    if (alertMeta.resolved) {
      next.activeHazards = next.activeHazards.filter((h) => h !== hazard);
      if (!next.resolvedHazards.includes(hazard)) next.resolvedHazards.push(hazard);
      delete next.hazardFreshness[hazard];
    } else if (!next.activeHazards.includes(hazard)) {
      next.activeHazards.push(hazard);
    }
    next.hazardFreshness[hazard] = 0;
  }

  if (hazard === 'furniture_shift') {
    next.anomalyCount += 1;
    next.furnitureDrift[room] = (next.furnitureDrift[room] || 0) + 1;
  }

  if (alertType === 'danger') {
    if (!next.activeHazards.includes('fall')) next.activeHazards.push('fall');
    next.hazardFreshness.fall = 0;
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

/** Hazards fade after 3 cycles without refresh — environments are dynamic */
export function decayStaleHazards(memory, currentAlertMeta) {
  const refreshed =
    currentAlertMeta?.hazard && currentAlertMeta.hazard !== 'none' ? currentAlertMeta.hazard : null;

  const hazardFreshness = { ...memory.hazardFreshness };
  let activeHazards = [...memory.activeHazards];
  const decayed = [];

  for (const hazard of [...activeHazards]) {
    if (hazard === refreshed) {
      hazardFreshness[hazard] = 0;
      continue;
    }

    const stale = (hazardFreshness[hazard] ?? 0) + 1;
    hazardFreshness[hazard] = stale;

    if (stale >= 3) {
      activeHazards = activeHazards.filter((h) => h !== hazard);
      delete hazardFreshness[hazard];
      decayed.push(hazard);
    }
  }

  return {
    memory: { ...memory, activeHazards, hazardFreshness },
    decayed,
  };
}

export function recordCaregiverAction(memory, action) {
  return {
    ...memory,
    caregiverActions: [{ ...action, timestamp: Date.now() }, ...memory.caregiverActions].slice(0, 6),
  };
}
