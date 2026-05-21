# HoloAid — Project Document

> **Purpose of this document:** Give this file to Claude (or any AI collaborator) for context when suggesting improvements, architecture changes, or new features. It describes what exists today, what is simulated vs. real, and known gaps.

---

## 1. Product overview

**HoloAid** is a **monitoring care giver system** — a web dashboard that lets a caregiver (e.g. Marcus, son of Afolabi) monitor a loved one navigating their home with vision impairment.

**Demo persona:**
- **Resident:** Afolabi — moves independently through a 6-room home using an assistive navigation headset.
- **Caregiver:** Marcus — watches the dashboard remotely for location, hazards, and emergencies.
- **Residence:** “Afolabi residence” (simulated).

**Core value proposition:** HoloAid’s “brain” autonomously perceives the environment, assesses risk, plans paths, reroutes around hazards, and escalates to the caregiver only when needed — reducing anxiety without removing independence.

---

## 2. Tech stack

| Layer | Technology |
|-------|------------|
| Framework | React 19 |
| Build | Vite 8 |
| Styling | Tailwind CSS 3 + custom CSS |
| Language | JavaScript (JSX), no TypeScript |
| Routing | None — single-page with landing → dashboard views |
| State | React `useState` / `useEffect` / `useRef` |
| Backend | **None** — all data is simulated client-side |
| Deploy | Vercel (SPA rewrite in `vercel.json`) |
| Repo | https://github.com/Demiladepy/dashboard |

**Font:** Varela Round  
**Visual direction:** Stripe-inspired midnight blue (`#060d18`), purple accent (`#635bff`), cyan highlight (`#00d4ff`)

---

## 3. Application structure

```
src/
├── App.jsx                 # Landing vs dashboard view switch
├── main.jsx                # Entry point
├── index.css               # Global styles, animations, Stripe tokens
├── components/
│   ├── LandingHero.jsx     # Marketing / intro screen
│   ├── Dashboard.jsx       # Main command center layout
│   ├── GuardianBrainPanel.jsx   # AI reasoning UI
│   ├── FloorPlan.jsx       # Spatial map + path trails
│   ├── LidarView.jsx       # Mock sensor feed
│   ├── RoutePlanner.jsx    # Planned path display
│   ├── AutonomousLog.jsx   # Auto-action history
│   ├── AlertFeed.jsx       # Event stream
│   ├── StatsPanel.jsx      # Brain metrics
│   ├── ActivityChart.jsx   # Room occupancy bars
│   ├── ImpactBanner.jsx    # Risk / hazard summary
│   ├── TimelineScrubber.jsx
│   ├── ActionBar.jsx       # Intercom / Reports / SOS
│   ├── SereneAlert.jsx     # Calm caregiver notifications
│   ├── ToastNotification.jsx  # (legacy, may be replaced)
│   └── modals/
│       ├── SosModal.jsx
│       ├── IntercomModal.jsx
│       └── ReportsModal.jsx
├── data/
│   └── constants.js        # Route, alerts, room layout, chart data
├── engine/
│   ├── guardianBrain.js    # Main orchestrator
│   ├── navigationEngine.js # Dijkstra pathfinding + reroute
│   ├── riskEngine.js       # Risk scoring + prediction
│   ├── memoryEngine.js     # Hazard memory + furniture drift
│   └── homeGraph.js        # Room graph, hazard profiles, baselines
├── hooks/
│   └── useSimulation.js    # Live demo loop + brain integration
└── utils/
    ├── sereneMessages.js   # Calm caregiver copy
    └── sereneChime.js      # Soft notification sound
```

---

## 4. User flows

### Landing
1. User sees HoloAid intro + brain capabilities list.
2. Clicks **Launch Command Center** → dashboard.

### Dashboard (live demo)
1. Simulation ticks every **3 seconds**.
2. User dot moves through 8 waypoints across 6 rooms.
3. Brain processes each event → updates risk, reasoning, route, decisions.
4. **Serene alert** appears for every new event (calm copy + optional soft chime).
5. Caregiver can:
   - **Chaos sandbox** — inject wet floor, chair move, or fall instantly
   - **Override reroutes** — approve or reject when brain reroutes Afolabi
   - **Intercom** — push-to-talk UI (mock)
   - **Reports** — export `.txt` brain report
   - **SOS** — hold-to-activate emergency contact flow (mock)
   - **Pause / scrub** route timeline

---

## 5. The “brain” — logic architecture

Each simulation tick runs `processBrainTick()` in `guardianBrain.js`:

```
Perceive → Recall → Assess → Predict → Plan → Decide
```

### 5.1 Navigation engine (`navigationEngine.js`)
- **Room graph** with edge weights in meters (hallway as hub).
- **Dijkstra** shortest path between rooms.
- **Reroute** when hazards block rooms/edges.
- Returns: planned path, distance, ETA, rerouted flag.

### 5.2 Risk engine (`riskEngine.js`)
- Computes **risk score 0–100** from:
  - Room hazard profile (slip, clutter, fall history)
  - Alert severity
  - Active hazards in memory
  - Recent warn/danger count
- **Risk levels:** low | moderate | high | critical
- **Predictive alerts:** slip/trip probability windows

### 5.3 Memory engine (`memoryEngine.js`)
- Tracks **active hazards** and **resolved hazards**
- **Furniture drift** / layout anomaly count
- **Room visit** counts
- **Autonomous action log** (last 8 actions)
- Compares LiDAR obstacles to `ENVIRONMENT_BASELINE`

### 5.4 Guardian brain decisions
| Action | Trigger |
|--------|---------|
| `MONITOR` | Normal operation |
| `REROUTE` | Wet floor, blocked path |
| `UPDATE_MAP` | Furniture moved |
| `AVOID` | Dynamic obstacle |
| `NOTIFY_CAREGIVER` | High/critical risk |
| `EMERGENCY_HALT` | Fall / danger alert |

Each decision includes: label, reason, priority, autonomous flag, and caregiver recommendations.

---

## 6. Simulated data (not real)

Everything below is **hardcoded or cycled** — there is no API, WebSocket, database, or device connection.

| Data | Source |
|------|--------|
| User location | `ROUTE` array cycled every 3s |
| Alerts | `ALERTS_CYCLE` array |
| LiDAR obstacles | `LIDAR_OBSTACLES` static list |
| Room layout | `ROOM_LAYOUT` pixel positions |
| Activity chart | `INITIAL_CHART` + incremental bumps |
| Stats (safe trips, etc.) | Incremented by simulation |
| Intercom / SOS / SMS | UI-only mocks |
| Sound | Web Audio API chime (client-side) |

**Important for improvements:** Any suggestion to “connect real sensors” requires building a backend + device pipeline that does not exist yet.

---

## 7. Alert types

| Type | Meaning | Example |
|------|---------|---------|
| `info` | Navigation instruction | “Wall ahead, turn right” |
| `safe` | Positive milestone | “Reached kitchen independently” |
| `warn` | Hazard detected | “Wet floor near kitchen sink” |
| `danger` | Emergency | “Sudden drop — emergency halt” |

Alert metadata is mapped in `ALERT_SIGNATURES` (`homeGraph.js`) with hazard type, category, and severity.

---

## 8. UI panels (dashboard layout)

| Panel | Shows |
|-------|-------|
| **HoloAid Brain** | Reasoning chain, risk bar, decision, recommendations |
| **Spatial map** | Room grid, planned path (purple), actual trail (cyan), user dot |
| **LiDAR fusion** | Scan animation, obstacle boxes, drift status |
| **Path engine** | Room-by-room planned route, ETA, reroute badge |
| **Autonomous actions** | Log of brain decisions |
| **Event stream** | Raw alert feed |
| **Brain metrics** | Safe trips, auto actions, reroutes, alerts, independence time |
| **Room occupancy** | Stacked bar chart by hour |
| **Serene alert** | Calm caregiver notification on every event |

---

## 9. What works well today

- Clear product identity (HoloAid + caregiver monitoring)
- Believable autonomous brain loop with visible reasoning
- Pathfinding + reroute logic tied to hazard memory
- Connected stats (not static mock numbers)
- Working SOS / Intercom / Report export flows (UI level)
- Polished midnight UI suitable for demos
- Deployable to Vercel in one command

---

## 10. Known gaps & improvement opportunities

Use this section to ask Claude for targeted suggestions.

### Logic / brain
- [x] Caregiver override (approve/reject reroutes)
- [x] Stale hazard memory decay (3 cycles without refresh)
- [x] Manual hazard injection via chaos sandbox
- [ ] No persistent memory across page refresh
- [ ] No multi-resident or multi-home support
- [ ] Predictive model is rule-based, not ML
- [ ] Pathfinding graph is static; no dynamic obstacle blocking edges in graph
- [ ] No time-of-day or routine learning (“Afolabi usually goes to kitchen at 8am”)

### Data / infrastructure
- [ ] No backend, auth, or real-time sync
- [ ] No WebSocket for live device telemetry
- [ ] No database for alert history / audit trail
- [ ] No integration with phone/SMS/push notifications
- [ ] No actual headset or LiDAR hardware interface

### Caregiver UX
- [x] Serene alerts on every event (calm copy + soft chime)
- [x] Chaos sandbox — inject hazards on demand (wet floor, chair move, fall)
- [x] Caregiver override — approve/reject brain reroutes
- [ ] Serene alerts exist but no notification history panel
- [ ] No snooze / acknowledgment workflow (“I’ve seen this”)
- [ ] No escalation tiers (notify son → notify doctor → 911)
- [ ] No video or audio stream from resident device
- [ ] No customizable alert sensitivity per caregiver

### Accessibility
- [ ] Dashboard accessibility for caregivers (screen reader, keyboard) is minimal
- [ ] No high-contrast mode
- [ ] End-user (blind resident) experience is not represented in this dashboard

### Code quality
- [ ] No TypeScript
- [ ] No tests (unit or e2e)
- [ ] `GuardianBrainPanel` / `guardianBrain.js` naming still says “Guardian” internally
- [ ] Some components still reference legacy color tokens

### Demo / pitch
- [ ] No README pitch doc for judges/investors
- [ ] No architecture diagram
- [ ] No before/after impact story baked into UI

---

## 11. Suggested prompts for Claude

Copy one of these when asking for improvements:

**Brain logic:**
> “Read PROJECT.md. How would you improve HoloAid’s guardianBrain.js to support caregiver override and persistent hazard memory?”

**Backend:**
> “Read PROJECT.md. Design a minimal WebSocket backend schema to replace the simulated ROUTE/ALERTS_CYCLE data.”

**UX:**
> “Read PROJECT.md. Propose a serene notification history panel and acknowledgment flow for caregivers.”

**Judge demo:**
> “Read PROJECT.md. Write a 90-second demo script and suggest one ‘hero moment’ feature to build next.”

**Architecture:**
> “Read PROJECT.md. Refactor plan to TypeScript with tests for navigationEngine and riskEngine.”

---

## 12. Run & deploy

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build
npm run preview  # preview production build
```

Deployed via Vercel from `main` branch.

---

## 13. File reference (key constants)

| Constant | File | Purpose |
|----------|------|---------|
| `ROUTE` | `constants.js` | 8 waypoint cycle |
| `ALERTS_CYCLE` | `constants.js` | 12 alert messages |
| `ROOM_LAYOUT` | `constants.js` | Floor plan positions |
| `ROOM_GRAPH` | `homeGraph.js` | Navigation graph |
| `ALERT_SIGNATURES` | `homeGraph.js` | Alert → hazard mapping |
| `ENVIRONMENT_BASELINE` | `homeGraph.js` | Furniture baseline for drift |
| `EMERGENCY_CONTACTS` | `constants.js` | SOS contact list |

---

## 14. Version snapshot

- **Product name:** HoloAid
- **Tagline:** Monitoring care giver system
- **Last major change:** Autonomous brain engine + Stripe midnight UI + serene caregiver alerts
- **Simulation interval:** 3000ms
- **Rooms:** living, kitchen, bedroom, bathroom, hallway, entrance

---

*End of document — paste this entire file into Claude for improvement discussions.*
