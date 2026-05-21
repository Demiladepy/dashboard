import { ALERT_SIGNATURES, DAILY_ROUTE_PLAN } from './homeGraph';
import { findPath, pathDistance, estimateEtaMeters, reroute, nextPlannedRoom } from './navigationEngine';
import { computeRiskScore, riskLevel, predictNextHazard } from './riskEngine';
import { updateMemory, detectFurnitureAnomaly, recordAutoAction } from './memoryEngine';

function buildReasoning({ room, alert, alertMeta, riskScore, level, memory, route, prediction }) {
  const steps = [];

  steps.push({
    step: 'Perceive',
    detail: `LiDAR + IMU fused in ${room}. ${alertMeta?.category === 'environment' ? 'Environmental delta detected.' : 'Navigation telemetry nominal.'}`,
    confidence: 0.94,
  });

  if (memory.activeHazards.length > 0) {
    steps.push({
      step: 'Recall',
      detail: `Active hazards in memory: ${memory.activeHazards.join(', ')}. ${memory.anomalyCount} layout anomalies today.`,
      confidence: 0.91,
    });
  }

  steps.push({
    step: 'Assess',
    detail: `Risk score ${riskScore}/100 (${level}). Room profile weighted for slip/clutter history.`,
    confidence: 0.88,
  });

  if (prediction) {
    steps.push({
      step: 'Predict',
      detail: `${Math.round(prediction.probability * 100)}% chance of ${prediction.type} event within ${prediction.window}.`,
      confidence: prediction.probability,
    });
  }

  if (route?.rerouted) {
    steps.push({
      step: 'Plan',
      detail: `Original path blocked. Computed alternate: ${route.planned.join(' → ')} (${route.distance}m, ETA ${route.eta}).`,
      confidence: 0.86,
    });
  } else if (route?.planned?.length > 1) {
    steps.push({
      step: 'Plan',
      detail: `Optimal path to next waypoint: ${route.planned.join(' → ')} (${route.distance}m).`,
      confidence: 0.92,
    });
  }

  if (alertMeta?.severity >= 0.75 || alert.type === 'danger') {
    steps.push({
      step: 'Decide',
      detail: alert.type === 'danger'
        ? 'Emergency halt triggered. Zero velocity enforced. Caregiver escalation queued.'
        : 'Reduce gait speed 30%. Issue verbal reroute instruction to user headset.',
      confidence: 0.97,
    });
  }

  return steps;
}

function buildDecision({ alert, alertMeta, level, route, room }) {
  if (alert.type === 'danger') {
    return {
      action: 'EMERGENCY_HALT',
      label: 'Emergency halt',
      reason: 'Sudden drop signature exceeds safety threshold',
      autonomous: true,
      priority: 'critical',
    };
  }
  if (alertMeta?.hazard === 'wet_floor') {
    return {
      action: 'REROUTE',
      label: route?.rerouted ? 'Auto-reroute active' : 'Slow & reroute',
      reason: 'Slip hazard in kitchen — avoiding direct path',
      autonomous: true,
      priority: 'high',
    };
  }
  if (alertMeta?.hazard === 'furniture_shift') {
    return {
      action: 'UPDATE_MAP',
      label: 'Remap environment',
      reason: 'Furniture drift exceeds baseline — updating spatial model',
      autonomous: true,
      priority: 'moderate',
    };
  }
  if (alertMeta?.hazard === 'obstacle' && !alertMeta?.resolved) {
    return {
      action: 'AVOID',
      label: 'Obstacle avoidance',
      reason: `Dynamic obstacle in ${room} — computing clearance vector`,
      autonomous: true,
      priority: 'high',
    };
  }
  if (level === 'high' || level === 'critical') {
    return {
      action: 'NOTIFY_CAREGIVER',
      label: 'Notify caregiver',
      reason: `Risk level ${level} — proactive alert to dashboard`,
      autonomous: true,
      priority: 'high',
    };
  }
  return {
    action: 'MONITOR',
    label: 'Continue monitoring',
    reason: 'All vitals within safe envelope',
    autonomous: true,
    priority: 'low',
  };
}

function buildRecommendations({ decision, alert, alertMeta, level, prediction }) {
  const recs = [];

  if (decision.action === 'EMERGENCY_HALT') {
    recs.push({ priority: 1, text: 'Initiate SOS protocol and call Afolabi via intercom', action: 'sos' });
    recs.push({ priority: 2, text: 'Check bathroom/kitchen for fall — highest prior incident rooms' });
  }
  if (alertMeta?.hazard === 'wet_floor') {
    recs.push({ priority: 1, text: 'Place non-slip mat near kitchen sink — recurring wet surface pattern' });
    recs.push({ priority: 2, text: 'Brain auto-rerouted via hallway; no caregiver action needed', autonomous: true });
  }
  if (alertMeta?.hazard === 'furniture_shift') {
    recs.push({ priority: 1, text: 'Confirm chair position change — brain will lock new baseline after 2 scans' });
  }
  if (prediction?.type === 'slip') {
    recs.push({ priority: 2, text: `Pre-alert: ${Math.round(prediction.probability * 100)}% slip risk — consider dry mop before next kitchen visit` });
  }
  if (level === 'low' && alert.type === 'safe') {
    recs.push({ priority: 3, text: 'No action needed — independence metrics trending positive', autonomous: true });
  }
  if (recs.length === 0) {
    recs.push({ priority: 3, text: 'System operating within normal parameters', autonomous: true });
  }

  return recs.sort((a, b) => a.priority - b.priority);
}

function resolveRoute(currentRoom, routeIndex, memory, alertMeta) {
  const destination = nextPlannedRoom(currentRoom, DAILY_ROUTE_PLAN, routeIndex);
  let planned = findPath(currentRoom, destination) || [currentRoom];
  let rerouted = false;

  const avoidRooms = [];
  if (memory.activeHazards.includes('wet_floor') && currentRoom === 'hallway' && destination === 'kitchen') {
    avoidRooms.push('kitchen');
  }
  if (memory.activeHazards.includes('obstacle') && currentRoom === 'hallway') {
    avoidRooms.push('hallway');
  }
  if (alertMeta?.hazard === 'wet_floor' && currentRoom === 'kitchen') {
    avoidRooms.push('kitchen');
  }

  if (avoidRooms.length > 0) {
    const alt = reroute(currentRoom, destination, avoidRooms);
    if (alt && alt.length > 1) {
      planned = alt;
      rerouted = true;
    }
  }

  const distance = pathDistance(planned);
  return {
    planned,
    destination,
    distance,
    eta: estimateEtaMeters(distance),
    rerouted,
  };
}

/** Main brain tick — processes one sensor/alert cycle */
export function processBrainTick({
  room,
  alert,
  routeIndex,
  memory,
  recentAlerts = [],
  obstacles = [],
}) {
  const alertMeta = ALERT_SIGNATURES[alert.msg] || { hazard: 'none', category: 'unknown', severity: 0.1 };

  let nextMemory = updateMemory(memory, { room, alertMeta, alertType: alert.type });
  const anomalies = detectFurnitureAnomaly(room, obstacles);
  if (anomalies.length > 0) {
    nextMemory = { ...nextMemory, anomalyCount: nextMemory.anomalyCount + anomalies.length };
  }

  const riskScore = computeRiskScore({ room, alertMeta, memory: nextMemory, recentAlerts });
  const level = riskLevel(riskScore);
  const route = resolveRoute(room, routeIndex, nextMemory, alertMeta);
  const prediction = predictNextHazard(room, nextMemory);
  const decision = buildDecision({ alert, alertMeta, level, route, room });
  const reasoning = buildReasoning({ room, alert, alertMeta, riskScore, level, memory: nextMemory, route, prediction });
  const recommendations = buildRecommendations({ decision, alert, alertMeta, level, prediction });

  if (decision.autonomous && decision.action !== 'MONITOR') {
    nextMemory = recordAutoAction(nextMemory, {
      action: decision.action,
      label: decision.label,
      room,
    });
  }

  nextMemory = { ...nextMemory, lastDecision: decision };

  return {
    riskScore,
    riskLevel: level,
    reasoning,
    decision,
    recommendations,
    route,
    prediction,
    anomalies,
    memory: nextMemory,
    alertMeta,
  };
}

export function getInitialBrainState() {
  return {
    memory: createInitialMemory(),
    riskScore: 12,
    riskLevel: 'low',
    reasoning: [{
      step: 'Init',
      detail: 'HoloAid brain online. Environmental baseline loaded for 6 rooms.',
      confidence: 1,
    }],
    decision: { action: 'MONITOR', label: 'Monitoring', reason: 'Awaiting first telemetry', autonomous: true, priority: 'low' },
    recommendations: [{ priority: 3, text: 'System calibrating spatial model…', autonomous: true }],
    route: { planned: ['living', 'hallway', 'kitchen'], destination: 'kitchen', distance: 5.5, eta: '14s', rerouted: false },
    prediction: null,
    anomalies: [],
  };
}

function createInitialMemory() {
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
