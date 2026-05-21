import { ROOM_PROFILES } from './homeGraph';

export function computeRiskScore({ room, alertMeta, memory, recentAlerts = [] }) {
  const profile = ROOM_PROFILES[room] || { slipRisk: 0.3, clutter: 0.3, fallHistory: 0.1 };
  let score = profile.slipRisk * 25 + profile.clutter * 15 + profile.fallHistory * 20;

  if (alertMeta?.severity) score += alertMeta.severity * 40;
  if (alertMeta?.hazard === 'wet_floor') score += 20;
  if (alertMeta?.hazard === 'fall') score = 95;
  if (alertMeta?.hazard === 'furniture_shift') score += memory.anomalyCount * 8;

  const recentWarns = recentAlerts.filter((a) => a.type === 'warn' || a.type === 'danger').length;
  score += recentWarns * 6;

  if (memory.activeHazards.includes('wet_floor') && room === 'kitchen') score += 15;
  if (memory.activeHazards.includes('obstacle') && room === 'hallway') score += 12;

  return Math.min(100, Math.round(score));
}

export function riskLevel(score) {
  if (score >= 80) return 'critical';
  if (score >= 55) return 'high';
  if (score >= 30) return 'moderate';
  return 'low';
}

export function riskColor(level) {
  const map = {
    low: '#00d4ff',
    moderate: '#a3acb9',
    high: '#f5a623',
    critical: '#ff4757',
  };
  return map[level] || map.low;
}

export function predictNextHazard(room, memory) {
  const profile = ROOM_PROFILES[room];
  if (!profile) return null;
  if (profile.slipRisk > 0.6 && memory.activeHazards.includes('wet_floor')) {
    return { type: 'slip', probability: 0.72, window: '2 min' };
  }
  if (profile.clutter > 0.5 && memory.anomalyCount > 1) {
    return { type: 'trip', probability: 0.58, window: '5 min' };
  }
  return null;
}
