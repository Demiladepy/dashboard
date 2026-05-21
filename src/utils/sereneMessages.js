import { ROOM_LAYOUT } from '../data/constants';

const SERENE_BY_TYPE = {
  info: {
    headline: 'A quiet update',
    tone: 'Routine guidance is in progress.',
  },
  safe: {
    headline: 'All is well',
    tone: 'Afolabi is moving safely on his own.',
  },
  warn: {
    headline: 'A gentle note',
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
  'Initial environmental scan clear': 'The home scan looks calm. Monitoring continues quietly.',
  'Caregiver kept original path': 'You chose to keep the direct route. HoloAid will continue monitoring closely.',
  'Caregiver approved HoloAid reroute': 'You approved the safer alternate path. HoloAid is guiding Afolabi accordingly.',
  'System online — monitoring active': 'HoloAid is online and watching over the residence.',
};

export function buildSereneAlert({ alert, room, decision, riskLevel }) {
  const roomLabel = ROOM_LAYOUT[room]?.label || room;
  const meta = SERENE_BY_TYPE[alert.type] || SERENE_BY_TYPE.info;
  const detail = CONTEXT_BY_MSG[alert.msg] || alert.msg;

  return {
    id: `${Date.now()}-${alert.type}`,
    type: alert.type,
    headline: meta.headline,
    room: roomLabel,
    message: detail,
    reassurance:
      alert.type === 'danger'
        ? 'Take a breath — HoloAid has already taken protective action.'
        : alert.type === 'warn'
          ? `Brain response: ${decision}. No urgency unless you feel otherwise.`
          : `Afolabi is in the ${roomLabel.toLowerCase()}. ${meta.tone}`,
    riskLevel,
    raw: alert.msg,
  };
}
