import React, { useState, useEffect } from 'react';

const rx = (val) => `${(val / 440) * 100}%`;
const ry = (val) => `${(val / 220) * 100}%`;

const ROOMS = [
  { id: 'living', name: 'Living room', style: { left: rx(10), top: ry(10), width: rx(140), height: ry(100) }, dot: { left: rx(80), top: ry(60) } },
  { id: 'kitchen', name: 'Kitchen',     style: { left: rx(160), top: ry(10), width: rx(120), height: ry(100) }, dot: { left: rx(220), top: ry(60) } },
  { id: 'bedroom', name: 'Bedroom',     style: { left: rx(290), top: ry(10), width: rx(140), height: ry(100) }, dot: { left: rx(360), top: ry(60) } },
  { id: 'hallway', name: 'Hallway',     style: { left: rx(10), top: ry(120), width: rx(270), height: ry(45) }, dot: { left: rx(145), top: ry(142.5) } },
  { id: 'bathroom', name: 'Bathroom',   style: { left: rx(290), top: ry(120), width: rx(140), height: ry(90) }, dot: { left: rx(360), top: ry(165) } },
  { id: 'entrance', name: 'Entrance',   style: { left: rx(10), top: ry(175), width: rx(130), height: ry(35) }, dot: { left: rx(75), top: ry(192.5) } },
];

const ROUTE = [0, 3, 1, 3, 4, 3, 2, 3]; // Living, Hallway, Kitchen, Hallway, Bathroom, Hallway, Bedroom, Hallway -> repeat

const ALERT_CYCLE = [
  { type: 'info', text: "Instruction: 'Wall ahead, turn right'", icon: '→' },
  { type: 'safe', text: "Reached kitchen independently", icon: '✓' },
  { type: 'warn', text: "Wet floor detected near kitchen sink", icon: '⚠' },
  { type: 'info', text: "Distance to door: 1.2 meters", icon: '→' },
  { type: 'safe', text: "Obstacle avoided — path clear", icon: '✓' },
  { type: 'warn', text: "Chair moved from usual position — rerouting", icon: '⚠' },
  { type: 'info', text: "Speed: 0.4 m/s — normal walking pace", icon: '→' },
  { type: 'safe', text: "Returned to living room safely", icon: '✓' },
  { type: 'warn', text: "Object on hallway floor — alerting", icon: '⚠' },
  { type: 'info', text: "Instruction: 'Bathroom door, straight ahead, 2 steps'", icon: '→' }
];

const CHART_DATA = [
  { time: '7am',  segments: [{c:'#34D399', h:10}, {c:'#FBBF24', h:20}, {c:'#64748B', h:10}, {c:'#60A5FA', h:60}] },
  { time: '8am',  segments: [{c:'#60A5FA', h:20}, {c:'#64748B', h:10}, {c:'#34D399', h:70}] }, 
  { time: '9am',  segments: [{c:'#34D399', h:90}, {c:'#64748B', h:10}] },
  { time: '10am', segments: [{c:'#34D399', h:30}, {c:'#A78BFA', h:70}] },
  { time: '11am', segments: [{c:'#A78BFA', h:40}, {c:'#34D399', h:60}] },
  { time: '12pm', segments: [{c:'#34D399', h:20}, {c:'#64748B', h:10}, {c:'#60A5FA', h:70}] },
  { time: '1pm',  segments: [{c:'#60A5FA', h:30}, {c:'#34D399', h:70}] },
  { time: '2pm',  segments: [{c:'#34D399', h:90}, {c:'#64748B', h:10}] },
  { time: '3pm',  segments: [{c:'#34D399', h:80}, {c:'#FBBF24', h:20}] },
  { time: '4pm',  segments: [{c:'#A78BFA', h:90}, {c:'#64748B', h:10}] },
  { time: '5pm',  segments: [{c:'#A78BFA', h:40}, {c:'#34D399', h:60}] },
  { time: '6pm',  segments: [{c:'#34D399', h:40}, {c:'#64748B', h:10}, {c:'#60A5FA', h:50}] },
];

export default function App() {
  const [routeIndex, setRouteIndex] = useState(0);
  const [alerts, setAlerts] = useState([
    { id: 'init3', type: 'info', text: "Guardian session started", icon: '→', time: '1m ago' },
    { id: 'init2', type: 'safe', text: "Sensors functioning optimally", icon: '✓', time: '2m ago' },
    { id: 'init1', type: 'info', text: "System initialized and calibrated", icon: '→', time: '3m ago' },
  ]);

  useEffect(() => {
    let cycleIndex = 0;
    const interval = setInterval(() => {
      setRouteIndex((prev) => (prev + 1) % ROUTE.length);
      
      const newAlertBase = ALERT_CYCLE[cycleIndex];
      const newAlert = { ...newAlertBase, id: (Date.now() + Math.random()).toString(), time: 'just now' };
      
      setAlerts((curr) => {
        const updatedRaw = [newAlert, ...curr].slice(0, 4);
        return updatedRaw.map((a, idx) => ({
          ...a,
          time: idx === 0 ? 'just now' : (idx === 1 ? '12s ago' : (idx === 2 ? '2m ago' : '5m ago'))
        }));
      });
      
      cycleIndex = (cycleIndex + 1) % ALERT_CYCLE.length;
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const activeRoom = ROOMS[ROUTE[routeIndex]];

  return (
    <div className="w-full max-w-[480px] mx-auto min-h-screen bg-background relative flex flex-col font-sans pb-24 shadow-2xl overflow-x-hidden">
      
      {/* 1. Header bar */}
      <header className="flex justify-between items-center px-5 flex-shrink-0 pt-6 pb-4 border-b-[0.5px] border-border bg-[#0B0F14]/90 backdrop-blur sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green"></span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-[15px] font-bold text-white leading-tight font-sans tracking-wide">VisionNav Guardian</h1>
            <p className="text-[10px] font-mono text-dim mt-0.5">Afolabi residence — {activeRoom.name.toLowerCase()}</p>
          </div>
        </div>
        <div className="bg-green-12 text-green px-2 py-0.5 rounded-[4px] text-[10px] font-mono font-bold tracking-wider uppercase border-[0.5px] border-green/20">
          LIVE
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-6">
        
        {/* 2. Floor plan section */}
        <section className="flex flex-col gap-2 relative">
          <h2 className="text-[10px] font-mono text-dim tracking-[0.08em] uppercase ml-1">Floor plan — real-time location</h2>
          <div className="w-full h-[220px] rounded-xl bg-card border-[0.5px] border-border relative overflow-hidden flex flex-col justify-center shadow-lg">
            <div className="absolute top-2 right-2 flex flex-col gap-1 items-end z-20 pointer-events-none">
              <div className="text-green bg-green-12/80 backdrop-blur-sm px-1.5 py-0.5 rounded-[4px] text-[9px] font-mono border-[0.5px] border-green/20 shadow-sm">
                0.4 m/s
              </div>
            </div>

            <div className="relative w-full h-[220px]">
              {ROOMS.map(room => {
                const isActive = activeRoom.id === room.id;
                return (
                  <div 
                    key={room.id}
                    className={`absolute border-[0.5px] rounded-lg transition-colors duration-400 p-2 flex items-start ${
                      isActive 
                        ? 'border-green/40 bg-green/5 shadow-[inset_0_0_20px_rgba(52,211,153,0.05)]' 
                        : 'border-[#1E2530] bg-[#151C26]'
                    }`}
                    style={{
                      left: room.style.left,
                      top: room.style.top,
                      width: room.style.width,
                      height: room.style.height
                    }}
                  >
                    <span className={`text-[9px] font-mono tracking-widest uppercase transition-colors duration-400 ${
                      isActive ? 'text-green font-semibold' : 'text-[#64748B]'
                    }`}>
                      {room.name}
                    </span>
                  </div>
                );
              })}

              {/* Real-time Distance Overlay */}
              <div 
                className="absolute text-[8px] font-mono text-green bg-[#111720]/90 border-[0.5px] border-green/30 px-1.5 py-0.5 rounded shadow-xl whitespace-nowrap z-30 transition-all ease-in-out duration-[1500ms]"
                style={{
                  left: `calc(${activeRoom.dot.left} + 14px)`,
                  top: `calc(${activeRoom.dot.top} - 20px)`,
                  transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                1.2m to {ROOMS[ROUTE[(routeIndex+1)%ROUTE.length]].name.toLowerCase()}
              </div>

              {/* Human dot simulation */}
              <div 
                className="absolute transition-all ease-in-out duration-[1500ms] flex items-center justify-center z-20"
                style={{
                  left: activeRoom.dot.left,
                  top: activeRoom.dot.top,
                  transform: 'translate(-50%, -50%)',
                  transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                <div className="absolute w-[24px] h-[24px] rounded-full animate-pulse-ring border-[1.5px] border-green z-0 bg-green/10"></div>
                <div className="w-[18px] h-[18px] rounded-full bg-green flex items-center justify-center shadow-[0_0_10px_rgba(52,211,153,0.6)] relative z-10 text-[#0B0F14]">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="4" r="2.5" />
                    <path d="m8 21 3-8 2 8" />
                    <path d="m16 21-2-8" />
                    <path d="m10 9 2 3.5 2-3.5" />
                    <path d="M12 12.5v-2.5" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Alerts section */}
        <section className="flex flex-col gap-2">
          <h2 className="text-[10px] font-mono text-dim tracking-[0.08em] uppercase ml-1">Live Alerts</h2>
          <div className="w-full bg-card rounded-xl border-[0.5px] border-border overflow-hidden shadow-lg flex flex-col relative">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-border/50 to-transparent"></div>
            {alerts.map((alert) => {
              const colors = {
                warn: 'text-amber bg-amber-12 border-amber/10',
                safe: 'text-green bg-green-12 border-green/10',
                info: 'text-blue bg-blue-12 border-blue/10',
                danger: 'text-red bg-red-12 border-red/10',
              }[alert.type] || 'text-dim bg-white/5 border-white/5';

              return (
                <div key={alert.id} className="flex items-start gap-3 p-3 border-b-[0.5px] border-border animate-slide-down bg-card first:rounded-t-xl last:rounded-b-xl last:border-0 hover:bg-[#151C26] transition-colors">
                  <div className={`shrink-0 w-7 h-7 flex flex-col justify-center items-center rounded-[6px] font-bold text-sm border-[0.5px] shadow-sm ${colors}`}>
                    {alert.icon}
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center mt-0.5">
                    <span className="text-[12px] text-[#CBD5E1] leading-[1.3] break-words font-medium">{alert.text}</span>
                  </div>
                  <div className="shrink-0 text-[9px] font-mono text-[#475569] mt-0.5 tabular-nums text-right w-12">{alert.time}</div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. Today's summary stats */}
        <section className="flex flex-col gap-2">
          <h2 className="text-[10px] font-mono text-dim tracking-[0.08em] uppercase ml-1">Today's Summary</h2>
          <div className="grid grid-cols-3 gap-2">
            {[
              { val: '7', label: 'SAFE TRIPS', color: 'text-green' },
              { val: '2', label: 'ALERTS', color: 'text-amber' },
              { val: '4.2h', label: 'INDEPENDENT', color: 'text-blue' }
            ].map((stat, i) => (
              <div key={i} className="bg-card rounded-xl border-[0.5px] border-border flex flex-col items-center justify-center py-3 shadow-lg hover:-translate-y-0.5 transition-transform">
                <span className={`text-[20px] font-mono font-bold ${stat.color} leading-none tracking-tight`}>{stat.val}</span>
                <span className="text-[9px] font-mono text-dim uppercase tracking-wider mt-2 font-semibold">{stat.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Room activity chart */}
        <section className="flex flex-col gap-2">
          <div className="w-full bg-card rounded-xl border-[0.5px] border-border p-4 shadow-lg pb-5">
            <div className="flex justify-between items-end h-[40px] mb-2 px-1">
              {CHART_DATA.map((col, i) => (
                <div key={i} className="flex flex-col flex-1 mx-[1px] justify-end h-full gap-[1px] relative group cursor-default">
                  <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-[#2D3748] text-white text-[8px] px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap font-mono z-10">
                    Activity {col.time}
                  </div>
                  {col.segments.map((seg, j) => (
                    <div key={j} className="w-full rounded-[1px] opacity-90 transition-opacity hover:opacity-100" style={{ height: `${seg.h}%`, backgroundColor: seg.c }} />
                  ))}
                </div>
              ))}
            </div>
            <div className="flex border-t-[0.5px] border-border pt-1.5 justify-between px-1">
               {CHART_DATA.map((col, i) => i % 2 === 0 ? <span key={i} className="text-[8px] font-mono text-dim tracking-tight">{col.time}</span> : <div key={i} className="w-4" />)}
            </div>
            
            <div className="flex flex-wrap gap-x-3 gap-y-2 mt-4 justify-center items-center">
              {[ {L:'Living',c:'#34D399'},{L:'Kitchen',c:'#60A5FA'},{L:'Bedroom',c:'#A78BFA'},{L:'Bathroom',c:'#FBBF24'},{L:'Hallway',c:'#64748B'} ].map(item => (
                 <div key={item.L} className="flex items-center gap-1.5">
                   <span className="w-1.5 h-1.5 rounded-full ring-[2px] ring-black/20" style={{backgroundColor:item.c}}></span>
                   <span className="text-[9px] font-mono text-dim">{item.L}</span>
                 </div>
              ))}
            </div>
          </div>
        </section>

      </div>

      {/* 6. Bottom action bar */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-[#0B0F14]/90 backdrop-blur-md border-t-[0.5px] border-border px-5 py-4 pb-safe flex gap-3 z-50">
        <button className="flex-1 bg-green-12 text-green border-[0.5px] border-green/20 rounded-lg py-2.5 text-[11px] font-bold font-sans hover:bg-green-12/80 transition-colors uppercase tracking-wide active:scale-95 shadow-sm">
          Intercom
        </button>
        <button className="flex-1 bg-card text-[#94A3B8] border-[0.5px] border-border rounded-lg py-2.5 text-[11px] font-bold font-sans hover:bg-[#151C26] transition-colors uppercase tracking-wide active:scale-95 shadow-sm">
          Reports
        </button>
        <button className="flex-1 bg-red-12 text-red border-[0.5px] border-red/20 rounded-lg py-2.5 text-[11px] font-bold font-sans hover:bg-red-12/80 transition-colors uppercase tracking-wide active:scale-95 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
          SOS
        </button>
      </div>

    </div>
  );
}
