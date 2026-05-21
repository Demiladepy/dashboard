/** Manual hazard presets for demo / judge sandbox */
export const CHAOS_PRESETS = {
  wet_floor: {
    id: 'wet_floor',
    label: 'Drop Water in Kitchen',
    type: 'warn',
    msg: 'Wet floor detected near kitchen sink',
    hazardRoom: 'kitchen',
    description: 'Injects slip hazard — brain should reroute around kitchen',
  },
  chair_move: {
    id: 'chair_move',
    label: 'Move Chair in Hallway',
    type: 'warn',
    msg: 'Chair moved from usual position — rerouting',
    hazardRoom: 'hallway',
    description: 'Triggers furniture drift + map remapping',
  },
  fall: {
    id: 'fall',
    label: 'Simulate Fall',
    type: 'danger',
    msg: 'Sudden drop detected — emergency halt activated',
    hazardRoom: 'hallway',
    description: 'Emergency halt + caregiver escalation',
  },
};

export const CHAOS_PRESET_LIST = Object.values(CHAOS_PRESETS);
