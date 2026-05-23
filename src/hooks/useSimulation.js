import { useState, useEffect, useCallback, useRef } from 'react';
import {
  ROUTE,
  ROUTE_EVENTS,
  ROOM_LAYOUT,
  ROOM_TO_COLOR,
  INITIAL_CHART,
  INITIAL_ALERTS,
  CHART_HOURS,
  LIDAR_OBSTACLES,
} from '../data/constants';
import { CHAOS_PRESETS } from '../data/chaosPresets';
import { processBrainTick, getInitialBrainState } from '../engine/guardianBrain';
import { recordCaregiverAction } from '../engine/memoryEngine';
import { buildSereneAlert, shouldNotifyCaregiver } from '../utils/sereneMessages';

function getCurrentHourIndex() {
  const hour = new Date().getHours();
  if (hour < 7) return 0;
  if (hour > 18) return CHART_HOURS.length - 1;
  return hour - 7;
}

function bumpChartRoom(chart, roomId) {
  const hourIdx = getCurrentHourIndex();
  const color = ROOM_TO_COLOR[roomId] || '#8898aa';
  return chart.map((col, i) => {
    if (i !== hourIdx) return col;
    const parts = col.parts.map((p) => ({ ...p }));
    const match = parts.find((p) => p.c === color);
    if (match) match.h = Math.min(100, match.h + 8);
    else if (parts.length > 0) parts[parts.length - 1].h = Math.min(100, parts[parts.length - 1].h + 8);
    return { ...col, parts };
  });
}

function formatElapsed(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}.${Math.floor(m / 6)}h`;
  if (m > 0) return `${m}m ${seconds % 60}s`;
  return `${seconds % 60}s`;
}

export function useSimulation({ paused = false, intervalMs = 3000 } = {}) {
  const [routeIndex, setRouteIndex] = useState(0);
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [pathTrail, setPathTrail] = useState([]);
  const [chartData, setChartData] = useState(INITIAL_CHART);
  const [stats, setStats] = useState({ safeTrips: 7, alerts: 2, independentSec: 15120, autoActions: 0, reroutes: 0 });
  const [sereneAlert, setSereneAlert] = useState(null);
  const [brain, setBrain] = useState(getInitialBrainState);
  const [pendingOverride, setPendingOverride] = useState(null);

  const memoryRef = useRef(getInitialBrainState().memory);
  const routeIndexRef = useRef(0);
  const tickRef = useRef(0);

  const currentStatus = ROUTE[routeIndex];
  const activeRoomId = currentStatus.room;

  const applyEvent = useCallback(
    (rawAlert, { advanceRoute = false, forceOriginalRoute = false, skipCaregiverPrompt = false, injected = false, caregiverAction = false } = {}) => {
      const idx = routeIndexRef.current;
      const nextIdx = advanceRoute ? (idx + 1) % ROUTE.length : idx;
      const room = ROUTE[nextIdx].room;
      const dot = ROOM_LAYOUT[room];

      const alert = {
        id: `${Date.now()}-${Math.random()}`,
        time: 'just now',
        type: rawAlert.type,
        msg: rawAlert.msg,
        injected,
      };

      if (advanceRoute) {
        routeIndexRef.current = nextIdx;
        setRouteIndex(nextIdx);
        setPathTrail((trail) => [...trail, { x: dot.dotX, y: dot.dotY, room }].slice(-20));
        setChartData((c) => bumpChartRoom(c, room));
      }

      setAlerts((current) => {
        const updated = [
          alert,
          ...current.slice(0, 5).map((a) => ({
            ...a,
            time: a.time === 'just now' ? '12s ago' : a.time,
          })),
        ];

        const brainResult = processBrainTick({
          room,
          alert,
          routeIndex: nextIdx,
          memory: memoryRef.current,
          recentAlerts: updated,
          obstacles: LIDAR_OBSTACLES,
          forceOriginalRoute,
          skipCaregiverPrompt,
        });

        memoryRef.current = brainResult.memory;

        setBrain({
          riskScore: brainResult.riskScore,
          riskLevel: brainResult.riskLevel,
          reasoning: brainResult.reasoning,
          decision: brainResult.decision,
          recommendations: brainResult.recommendations,
          route: brainResult.route,
          prediction: brainResult.prediction,
          anomalies: brainResult.anomalies,
          memory: brainResult.memory,
          decayed: brainResult.decayed,
        });

        setStats((s) => ({
          ...s,
          independentSec: advanceRoute ? s.independentSec + Math.floor(intervalMs / 1000) : s.independentSec,
          safeTrips: alert.type === 'safe' ? s.safeTrips + 1 : s.safeTrips,
          alerts: alert.type === 'warn' || alert.type === 'danger' ? s.alerts + 1 : s.alerts,
          autoActions:
            brainResult.decision.autonomous && brainResult.decision.action !== 'MONITOR'
              ? s.autoActions + 1
              : s.autoActions,
          reroutes: brainResult.route.rerouted ? s.reroutes + 1 : s.reroutes,
        }));

        if (
          shouldNotifyCaregiver({
            alert,
            brainResult,
            injected,
            caregiverAction,
          })
        ) {
          setSereneAlert(
            buildSereneAlert({
              alert,
              room,
              decision: brainResult.decision.label,
              riskLevel: brainResult.riskLevel,
              brainResult,
              injected,
              caregiverAction,
            }),
          );
        }

        if (brainResult.needsCaregiverApproval) {
          setPendingOverride({
            originalRoute: brainResult.route.originalPlanned,
            proposedRoute: brainResult.route.planned,
            reason: brainResult.decision.reason,
            alertMsg: alert.msg,
          });
        }

        return updated;
      });

      if (advanceRoute) tickRef.current += 1;
    },
    [intervalMs],
  );

  const advance = useCallback(() => {
    const next = (routeIndexRef.current + 1) % ROUTE.length;
    const routeEvent = ROUTE_EVENTS[next] || {
      type: 'info',
      msg: `Location update: ${ROOM_LAYOUT[ROUTE[next].room].label}`,
    };
    applyEvent(routeEvent, { advanceRoute: true });
  }, [applyEvent]);

  const injectHazard = useCallback(
    (presetId) => {
      const preset = CHAOS_PRESETS[presetId];
      if (!preset) return;

      // Snap to hallway so wet-floor reroute demo triggers reliably for judges
      if (presetId === 'wet_floor') {
        routeIndexRef.current = 1;
        setRouteIndex(1);
      }

      applyEvent({ type: preset.type, msg: preset.msg }, { injected: true });
    },
    [applyEvent],
  );

  const approveReroute = useCallback(() => {
    if (!pendingOverride) return;
    memoryRef.current = recordCaregiverAction(memoryRef.current, {
      action: 'APPROVE_REROUTE',
      label: 'Approved reroute',
    });
    setBrain((prev) => ({ ...prev, memory: memoryRef.current }));
    setPendingOverride(null);
    setSereneAlert(
      buildSereneAlert({
        alert: { type: 'info', msg: 'Caregiver approved HoloAid reroute' },
        room: activeRoomId,
        decision: 'Reroute approved',
        riskLevel: brain.riskLevel,
        brainResult: brain,
        caregiverAction: true,
      }),
    );
  }, [pendingOverride, activeRoomId, brain]);

  const rejectReroute = useCallback(() => {
    if (!pendingOverride) return;
    memoryRef.current = recordCaregiverAction(memoryRef.current, {
      action: 'REJECT_REROUTE',
      label: 'Kept original path',
    });
    setBrain((prev) => ({
      ...prev,
      route: {
        ...prev.route,
        planned: pendingOverride.originalRoute,
        rerouted: false,
      },
      memory: memoryRef.current,
      decision: {
        ...prev.decision,
        label: 'Original path restored',
        reason: 'Caregiver overrode brain reroute — keeping direct route',
        action: 'MONITOR',
      },
    }));
    setPendingOverride(null);
    setSereneAlert(
      buildSereneAlert({
        alert: { type: 'info', msg: 'Caregiver kept original path' },
        room: activeRoomId,
        decision: 'Override applied',
        riskLevel: brain.riskLevel,
        brainResult: brain,
        caregiverAction: true,
      }),
    );
  }, [pendingOverride, activeRoomId, brain]);

  useEffect(() => {
    if (paused) return undefined;
    const timer = setInterval(advance, intervalMs);
    return () => clearInterval(timer);
  }, [paused, advance, intervalMs]);

  const scrubTo = useCallback((index) => {
    const clamped = Math.max(0, Math.min(ROUTE.length - 1, index));
    routeIndexRef.current = clamped;
    setRouteIndex(clamped);
    setPathTrail(
      ROUTE.slice(0, clamped + 1).map((r) => {
        const dot = ROOM_LAYOUT[r.room];
        return { x: dot.dotX, y: dot.dotY, room: r.room };
      }),
    );
  }, []);

  const dismissSereneAlert = useCallback(() => setSereneAlert(null), []);

  return {
    routeIndex,
    routeLength: ROUTE.length,
    currentStatus,
    activeRoomId,
    activeRoomLabel: ROOM_LAYOUT[activeRoomId].label,
    alerts,
    pathTrail,
    chartData,
    brain,
    stats: {
      safeTrips: stats.safeTrips,
      alerts: stats.alerts,
      independent: formatElapsed(stats.independentSec),
      autoActions: stats.autoActions,
      reroutes: stats.reroutes,
    },
    sereneAlert,
    dismissSereneAlert,
    pendingOverride,
    approveReroute,
    rejectReroute,
    injectHazard,
    scrubTo,
    advance,
    tick: tickRef.current,
  };
}
