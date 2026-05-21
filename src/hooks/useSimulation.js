import { useState, useEffect, useCallback, useRef } from 'react';
import {
  ROUTE,
  ALERTS_CYCLE,
  ROOM_LAYOUT,
  ROOM_TO_COLOR,
  INITIAL_CHART,
  INITIAL_ALERTS,
  CHART_HOURS,
  LIDAR_OBSTACLES,
} from '../data/constants';
import { processBrainTick, getInitialBrainState } from '../engine/guardianBrain';

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
  const [toast, setToast] = useState(null);
  const [brain, setBrain] = useState(getInitialBrainState);
  const memoryRef = useRef(getInitialBrainState().memory);
  const tickRef = useRef(0);

  const currentStatus = ROUTE[routeIndex];
  const activeRoomId = currentStatus.room;

  const advance = useCallback(() => {
    setRouteIndex((prev) => {
      const next = (prev + 1) % ROUTE.length;
      const cycleAlert = ALERTS_CYCLE[next % ALERTS_CYCLE.length];
      const room = ROUTE[next].room;
      const dot = ROOM_LAYOUT[room];

      setAlerts((current) => {
        const newAlert = { id: `${Date.now()}-${Math.random()}`, time: 'just now', ...cycleAlert };
        const updated = [
          newAlert,
          ...current.slice(0, 5).map((a) => ({
            ...a,
            time: a.time === 'just now' ? '12s ago' : a.time,
          })),
        ];

        const brainResult = processBrainTick({
          room,
          alert: cycleAlert,
          routeIndex: next,
          memory: memoryRef.current,
          recentAlerts: updated,
          obstacles: LIDAR_OBSTACLES,
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
        });

        setStats((s) => ({
          ...s,
          independentSec: s.independentSec + Math.floor(intervalMs / 1000),
          safeTrips: cycleAlert.type === 'safe' ? s.safeTrips + 1 : s.safeTrips,
          alerts: cycleAlert.type === 'warn' || cycleAlert.type === 'danger' ? s.alerts + 1 : s.alerts,
          autoActions: brainResult.decision.autonomous && brainResult.decision.action !== 'MONITOR'
            ? s.autoActions + 1
            : s.autoActions,
          reroutes: brainResult.route.rerouted ? s.reroutes + 1 : s.reroutes,
        }));

        if (cycleAlert.type === 'warn' || cycleAlert.type === 'danger') {
          setToast({ type: cycleAlert.type, msg: cycleAlert.msg, decision: brainResult.decision.label });
        }

        return updated;
      });

      setPathTrail((trail) => [...trail, { x: dot.dotX, y: dot.dotY, room }].slice(-20));
      setChartData((c) => bumpChartRoom(c, room));

      return next;
    });
    tickRef.current += 1;
  }, [intervalMs]);

  useEffect(() => {
    if (paused) return undefined;
    const timer = setInterval(advance, intervalMs);
    return () => clearInterval(timer);
  }, [paused, advance, intervalMs]);

  const scrubTo = useCallback((index) => {
    const clamped = Math.max(0, Math.min(ROUTE.length - 1, index));
    setRouteIndex(clamped);
    setPathTrail(
      ROUTE.slice(0, clamped + 1).map((r) => {
        const dot = ROOM_LAYOUT[r.room];
        return { x: dot.dotX, y: dot.dotY, room: r.room };
      }),
    );
  }, []);

  const dismissToast = useCallback(() => setToast(null), []);

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
    toast,
    dismissToast,
    scrubTo,
    advance,
    tick: tickRef.current,
  };
}
