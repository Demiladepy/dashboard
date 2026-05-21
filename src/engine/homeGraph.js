/** Room connectivity graph — edge weights in meters */
export const ROOM_GRAPH = {
  living: { hallway: 2.1 },
  hallway: { living: 2.5, kitchen: 3.4, bathroom: 4.2, bedroom: 3.8, entrance: 2.0 },
  kitchen: { hallway: 3.4 },
  bathroom: { hallway: 4.2 },
  bedroom: { hallway: 3.8 },
  entrance: { hallway: 2.0 },
};

/** Per-room hazard baselines used by risk engine */
export const ROOM_PROFILES = {
  living: { slipRisk: 0.15, clutter: 0.25, fallHistory: 0.1 },
  kitchen: { slipRisk: 0.65, clutter: 0.45, fallHistory: 0.2 },
  bathroom: { slipRisk: 0.85, clutter: 0.3, fallHistory: 0.35 },
  bedroom: { slipRisk: 0.2, clutter: 0.35, fallHistory: 0.15 },
  hallway: { slipRisk: 0.4, clutter: 0.55, fallHistory: 0.25 },
  entrance: { slipRisk: 0.5, clutter: 0.2, fallHistory: 0.1 },
};

/** Default daily route the brain plans against */
export const DAILY_ROUTE_PLAN = [
  'living', 'hallway', 'kitchen', 'hallway', 'bathroom', 'hallway', 'bedroom', 'hallway', 'living',
];

export const ALERT_SIGNATURES = {
  "Instruction: 'Wall ahead, turn right'": { hazard: 'none', category: 'navigation', severity: 0 },
  'Reached kitchen independently': { hazard: 'none', category: 'milestone', severity: 0 },
  'Wet floor detected near kitchen sink': { hazard: 'wet_floor', category: 'environment', severity: 0.75 },
  'Distance to door: 1.2 meters': { hazard: 'none', category: 'navigation', severity: 0 },
  'Obstacle avoided — path clear': { hazard: 'obstacle', category: 'avoidance', severity: 0.35, resolved: true },
  'Chair moved from usual position — rerouting': { hazard: 'furniture_shift', category: 'environment', severity: 0.55 },
  'Sudden drop detected — emergency halt activated': { hazard: 'fall', category: 'emergency', severity: 1.0 },
  'Speed: 0.4 m/s — normal walking pace': { hazard: 'none', category: 'vitals', severity: 0 },
  'Returned to living room safely': { hazard: 'none', category: 'milestone', severity: 0 },
  'Object on hallway floor — alerting': { hazard: 'obstacle', category: 'environment', severity: 0.6 },
  "Instruction: 'Bathroom door, straight ahead, 2 steps'": { hazard: 'none', category: 'navigation', severity: 0 },
  'Bedroom reached — daily route complete': { hazard: 'none', category: 'milestone', severity: 0 },
};

/** Known furniture baseline for anomaly detection */
export const ENVIRONMENT_BASELINE = {
  living: [{ id: 'sofa', x: 40, y: 50, w: 30, h: 18 }],
  kitchen: [
    { id: 'chair', x: 42, y: 38, w: 18, h: 24 },
    { id: 'island', x: 55, y: 20, w: 25, h: 12 },
  ],
  hallway: [{ id: 'rug', x: 68, y: 55, w: 12, h: 8 }],
  bathroom: [{ id: 'mat', x: 30, y: 70, w: 20, h: 10 }],
  bedroom: [{ id: 'bed', x: 50, y: 40, w: 35, h: 25 }],
  entrance: [{ id: 'threshold', x: 22, y: 72, w: 28, h: 6 }],
};
