import { ROOM_GRAPH } from './homeGraph';

/** Dijkstra shortest path between two rooms */
export function findPath(from, to, blockedEdges = []) {
  if (from === to) return [from];

  const blocked = new Set(blockedEdges.map(([a, b]) => `${a}->${b}`));
  const dist = { [from]: 0 };
  const prev = {};
  const unvisited = new Set(Object.keys(ROOM_GRAPH).concat(
    ...Object.values(ROOM_GRAPH).flatMap((n) => Object.keys(n)),
  ));

  while (unvisited.size > 0) {
    let current = null;
    let minDist = Infinity;
    for (const node of unvisited) {
      if (dist[node] !== undefined && dist[node] < minDist) {
        minDist = dist[node];
        current = node;
      }
    }
    if (current === null || current === to) break;
    unvisited.delete(current);

    const neighbors = ROOM_GRAPH[current] || {};
    for (const [next, weight] of Object.entries(neighbors)) {
      const key = `${current}->${next}`;
      if (blocked.has(key)) continue;
      const alt = dist[current] + weight;
      if (dist[next] === undefined || alt < dist[next]) {
        dist[next] = alt;
        prev[next] = current;
      }
    }
  }

  if (dist[to] === undefined) return null;

  const path = [to];
  let cur = to;
  while (prev[cur]) {
    cur = prev[cur];
    path.unshift(cur);
  }
  return path;
}

export function pathDistance(path) {
  if (!path || path.length < 2) return 0;
  let total = 0;
  for (let i = 0; i < path.length - 1; i += 1) {
    const from = path[i];
    const to = path[i + 1];
    total += ROOM_GRAPH[from]?.[to] ?? ROOM_GRAPH[to]?.[from] ?? 0;
  }
  return Math.round(total * 10) / 10;
}

export function estimateEtaMeters(meters, speedMps = 0.4) {
  const sec = meters / speedMps;
  if (sec < 60) return `${Math.round(sec)}s`;
  return `${Math.floor(sec / 60)}m ${Math.round(sec % 60)}s`;
}

/** Find alternate route avoiding a blocked room or edge */
export function reroute(currentRoom, destination, avoidRooms = []) {
  const blocked = [];
  for (const room of avoidRooms) {
    for (const [from, neighbors] of Object.entries(ROOM_GRAPH)) {
      if (neighbors[room]) blocked.push([from, room]);
      if (from === room) {
        for (const next of Object.keys(neighbors)) blocked.push([room, next]);
      }
    }
  }
  return findPath(currentRoom, destination, blocked);
}

export function nextPlannedRoom(currentRoom, dailyPlan, stepIndex) {
  const remaining = dailyPlan.slice(stepIndex);
  const idx = remaining.indexOf(currentRoom);
  if (idx >= 0 && idx < remaining.length - 1) return remaining[idx + 1];
  for (let i = stepIndex; i < dailyPlan.length - 1; i += 1) {
    if (dailyPlan[i] === currentRoom) return dailyPlan[i + 1];
  }
  return dailyPlan[(stepIndex + 1) % dailyPlan.length];
}
