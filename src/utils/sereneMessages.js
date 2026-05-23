import { ROOM_LAYOUT } from '../data/constants';

const SERENE_BY_TYPE = {
  info: {
    headline: 'Update',
    tone: 'Routine guidance is in progress.',
  },
  safe: {
    headline: 'Milestone reached',
    tone: 'Afolabi is moving safely on his own.',
  },
  warn: {
    headline: 'Hazard detected',
    tone: 'Something needs attention, but HoloAid is already responding.',
  },
  danger: {
    headline: 'Please check in',
    tone: 'HoloAid has paused movement and is staying with Afolabi.',
  },
};

const CONTEXT_BY_MSG = {
  'Wet floor detected near kitchen sink': 'A wet surface was noticed near the kitchen sink. HoloAid has slowed pace and adjusted the route.',
  'Chair moved from usual position — rerouting': 'Furniture shifted from its usual place. The spatial map is updating automatically.',
  'Sudden drop detected — emergency halt activated': 'Movement stopped as a precaution. HoloAid is holding position until you respond.',
  'Object on hallway floor — alerting': 'Something unexpected is on the hallway floor. HoloAid is guiding around it.',
  'Reached kitchen independently': 'Afolabi arrived in the kitchen without assistance.',
  'Returned to living room safely': 'Afolabi is back in the living room, safe and steady.',
  'Bedroom reached — daily route complete': 'The daily route is complete. Afolabi is resting in the bedroom.',
  'Obstacle avoided — path clear': 'A brief obstacle appeared and was handled calmly. The path is clear again.',
  'Caregiver kept original path': 'You chose to keep the direct route. HoloAid will continue monitoring closely.',
  'Caregiver approved HoloAid reroute': 'You approved the safer alternate path. HoloAid is guiding Afolabi accordingly.',
};

const SIGNIFICANT_SAFE = new Set([
  'Reached kitchen independently',
  'Bedroom reached — daily route complete',
  'Returned to living room safely',
]);

const BRAIN_ACTIONS_THAT_NOTIFY = new Set([
  'EMERGENCY_HALT',
  'REROUTE',
  'NOTIFY_CAREGIVER',
  'AVOID',
  'UPDATE_MAP',
]);

/** Only pop a caregiver notification when something meaningful actually happened */
export function shouldNotifyCaregiver({ alert, brainResult, injected, caregiverAction }) {
  if (injected) return true;
  if (caregiverAction) return true;
  if (alert.type === 'danger' || alert.type === 'warn') return true;
  if (brainResult.needsCaregiverApproval) return true;
  if (brainResult.decayed?.length > 0) return true;
  if (brainResult.decision?.action && BRAIN_ACTIONS_THAT_NOTIFY.has(brainResult.decision.action)) {
    if (brainResult.decision.action === 'REROUTE' && !brainResult.route?.rerouted) return false;
    return true;
  }
  if (alert.type === 'safe' && SIGNIFICANT_SAFE.has(alert.msg)) return true;
  return false;
}

function resolveTrigger({ alert, brainResult, injected, caregiverAction }) {
  if (caregiverAction) return 'Your decision';
  if (injected) return 'Sandbox hazard';
  if (brainResult.decayed?.length > 0) return 'Hazard cleared';
  if (brainResult.needsCaregiverApproval) return 'Reroute proposed';
  if (brainResult.decision?.action === 'EMERGENCY_HALT') return 'Emergency halt';
  if (alert.type === 'warn' || alert.type === 'danger') return 'Sensor alert';
  if (alert.type === 'safe') return 'Milestone';
  return 'Brain response';
}

export function buildSereneAlert({ alert, room, decision, riskLevel, brainResult, injected, caregiverAction }) {
  const roomLabel = ROOM_LAYOUT[room]?.label || room;
  const meta = SERENE_BY_TYPE[alert.type] || SERENE_BY_TYPE.info;
  const detail = CONTEXT_BY_MSG[alert.msg] || alert.msg;
  const trigger = resolveTrigger({ alert, brainResult, injected, caregiverAction });

  return {
    id: `${Date.now()}-${alert.type}-${alert.msg.slice(0, 12)}`,
    type: alert.type,
    headline: meta.headline,
    room: roomLabel,
    message: detail,
    trigger,
    reassurance:
      alert.type === 'danger'
        ? 'Take a breath — HoloAid has already taken protective action.'
        : alert.type === 'warn'
          ? `Brain response: ${decision}. HoloAid is handling this now.`
          : caregiverAction
            ? 'Your choice has been applied to the live route.'
            : `Triggered by: ${trigger}. ${meta.tone}`,
    riskLevel,
    raw: alert.msg,
  };
}
