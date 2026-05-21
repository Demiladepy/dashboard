export const ROUTE = [
  { room: 'living', dist: '2.1m to hallway' },
  { room: 'hallway', dist: '3.4m to kitchen' },
  { room: 'kitchen', dist: '0.8m to sink' },
  { room: 'hallway', dist: '4.2m to bathroom' },
  { room: 'bathroom', dist: '1.2m to door' },
  { room: 'hallway', dist: '3.8m to bedroom' },
  { room: 'bedroom', dist: '0.5m to bed' },
  { room: 'hallway', dist: '2.5m to living' },
];

export const ALERTS_CYCLE = [
  { type: 'info', msg: "Instruction: 'Wall ahead, turn right'" },
  { type: 'safe', msg: 'Reached kitchen independently' },
  { type: 'warn', msg: 'Wet floor detected near kitchen sink' },
  { type: 'info', msg: 'Distance to door: 1.2 meters' },
  { type: 'safe', msg: 'Obstacle avoided — path clear' },
  { type: 'warn', msg: 'Chair moved from usual position — rerouting' },
  { type: 'danger', msg: 'Sudden drop detected — emergency halt activated' },
  { type: 'info', msg: 'Speed: 0.4 m/s — normal walking pace' },
  { type: 'safe', msg: 'Returned to living room safely' },
  { type: 'warn', msg: 'Object on hallway floor — alerting' },
  { type: 'info', msg: "Instruction: 'Bathroom door, straight ahead, 2 steps'" },
  { type: 'safe', msg: 'Bedroom reached — daily route complete' },
];

export const ROOM_LAYOUT = {
  living: { top: 12, left: 12, width: 140, height: 100, label: 'Living room', dotX: 82, dotY: 62 },
  kitchen: { top: 12, left: 153, width: 120, height: 100, label: 'Kitchen', dotX: 213, dotY: 62 },
  bedroom: { top: 12, left: 274, width: 140, height: 100, label: 'Bedroom', dotX: 344, dotY: 62 },
  hallway: { top: 113, left: 75, width: 268, height: 46, label: 'Hallway', dotX: 209, dotY: 136 },
  entrance: { top: 160, left: 12, width: 130, height: 42, label: 'Entrance', dotX: 77, dotY: 181 },
  bathroom: { top: 160, left: 274, width: 140, height: 96, label: 'Bathroom', dotX: 344, dotY: 208 },
};

export const ROOM_COLORS = {
  living: '#00d4ff',
  kitchen: '#635bff',
  bedroom: '#7a73ff',
  bathroom: '#f5a623',
  hallway: '#556677',
  entrance: '#8898aa',
};

export const ROOM_TO_COLOR = {
  living: '#00d4ff',
  kitchen: '#635bff',
  bedroom: '#7a73ff',
  bathroom: '#f5a623',
  hallway: '#556677',
  entrance: '#8898aa',
};

export const CHART_HOURS = ['7am', '8am', '9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm'];

export const INITIAL_CHART = [
  { time: '7am', parts: [{ c: '#7a73ff', h: 80 }, { c: '#556677', h: 10 }, { c: '#f5a623', h: 10 }] },
  { time: '8am', parts: [{ c: '#f5a623', h: 20 }, { c: '#556677', h: 20 }, { c: '#635bff', h: 60 }] },
  { time: '9am', parts: [{ c: '#635bff', h: 40 }, { c: '#556677', h: 20 }, { c: '#00d4ff', h: 40 }] },
  { time: '10am', parts: [{ c: '#00d4ff', h: 90 }, { c: '#556677', h: 10 }, { c: '#635bff', h: 0 }] },
  { time: '11am', parts: [{ c: '#00d4ff', h: 60 }, { c: '#556677', h: 20 }, { c: '#7a73ff', h: 20 }] },
  { time: '12pm', parts: [{ c: '#00d4ff', h: 20 }, { c: '#556677', h: 30 }, { c: '#635bff', h: 50 }] },
  { time: '1pm', parts: [{ c: '#635bff', h: 70 }, { c: '#556677', h: 20 }, { c: '#00d4ff', h: 10 }] },
  { time: '2pm', parts: [{ c: '#00d4ff', h: 80 }, { c: '#556677', h: 20 }, { c: '#7a73ff', h: 0 }] },
  { time: '3pm', parts: [{ c: '#7a73ff', h: 100 }, { c: '#556677', h: 0 }, { c: '#635bff', h: 0 }] },
  { time: '4pm', parts: [{ c: '#7a73ff', h: 90 }, { c: '#556677', h: 10 }, { c: '#f5a623', h: 0 }] },
  { time: '5pm', parts: [{ c: '#7a73ff', h: 40 }, { c: '#556677', h: 30 }, { c: '#00d4ff', h: 30 }] },
  { time: '6pm', parts: [{ c: '#00d4ff', h: 70 }, { c: '#556677', h: 10 }, { c: '#635bff', h: 20 }] },
];

export const INITIAL_ALERTS = [
  { id: 'start3', type: 'info', msg: 'Battery level: 94%', time: '3m ago' },
  { id: 'start2', type: 'safe', msg: 'Initial environmental scan clear', time: '2m ago' },
  { id: 'start1', type: 'info', msg: 'System online — monitoring active', time: '1m ago' },
];

export const IMPACT_METRICS = [
  { label: 'Falls prevented', value: '3', suffix: 'this month', trend: '+73%' },
  { label: 'Caregiver response', value: '<30s', suffix: 'avg', trend: '−42%' },
  { label: 'Route accuracy', value: '98.7%', suffix: 'today', trend: '+2.1%' },
];

export const EMERGENCY_CONTACTS = [
  { name: 'Marcus Afolabi', relation: 'Son', status: 'notified' },
  { name: 'Dr. Okafor', relation: 'Primary care', status: 'notified' },
  { name: '911 Dispatch', relation: 'Emergency', status: 'queued' },
];

export const LIDAR_OBSTACLES = [
  { x: 42, y: 38, w: 18, h: 24, label: 'chair' },
  { x: 68, y: 55, w: 12, h: 8, label: 'rug edge' },
  { x: 22, y: 72, w: 28, h: 6, label: 'threshold' },
];
