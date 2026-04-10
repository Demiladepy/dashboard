import React, { useState, useEffect } from 'react';

// ----- SVGs -----
const Icons = {
  warn: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  safe: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>,
  info: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  danger: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
};

// ----- DATA MODELS -----
const ROUTE = [
  { room: 'living', dist: '2.1m to hallway' },
  { room: 'hallway', dist: '3.4m to kitchen' },
  { room: 'kitchen', dist: '0.8m to sink' },
  { room: 'hallway', dist: '4.2m to bathroom' },
  { room: 'bathroom', dist: '1.2m to door' },
  { room: 'hallway', dist: '3.8m to bedroom' },
  { room: 'bedroom', dist: '0.5m to bed' },
  { room: 'hallway', dist: '2.5m to living' }
];

const ALERTS_CYCLE = [
  { type: 'info', msg: "Instruction: 'Wall ahead, turn right'" },
  { type: 'safe', msg: "Reached kitchen independently" },
  { type: 'warn', msg: "Wet floor detected near kitchen sink" },
  { type: 'info', msg: "Distance to door: 1.2 meters" },
  { type: 'safe', msg: "Obstacle avoided — path clear" },
  { type: 'warn', msg: "Chair moved from usual position — rerouting" },
  { type: 'info', msg: "Speed: 0.4 m/s — normal walking pace" },
  { type: 'safe', msg: "Returned to living room safely" },
  { type: 'warn', msg: "Object on hallway floor — alerting" },
  { type: 'info', msg: "Instruction: 'Bathroom door, straight ahead, 2 steps'" }
];

const ROOM_LAYOUT = {
  living: { top: 12, left: 12, width: 140, height: 100, label: 'Living room', dotX: 82, dotY: 62 },
  kitchen: { top: 12, left: 153, width: 120, height: 100, label: 'Kitchen', dotX: 213, dotY: 62 },
  bedroom: { top: 12, left: 274, width: 140, height: 100, label: 'Bedroom', dotX: 344, dotY: 62 },
  hallway: { top: 113, left: 75, width: 268, height: 46, label: 'Hallway', dotX: 209, dotY: 136 }, 
  entrance: { top: 160, left: 12, width: 130, height: 42, label: 'Entrance', dotX: 77, dotY: 181 },
  bathroom: { top: 160, left: 274, width: 140, height: 96, label: 'Bathroom', dotX: 344, dotY: 208 }
};

// Map colors to room types for chart
const ROOM_COLORS = {
  living: '#34D399',
  kitchen: '#60A5FA',
  bedroom: '#A78BFA',
  bathroom: '#FBBF24',
  hallway: '#64748B'
};

const CHART_DATA = [
  { time: '7am', parts: [{c: '#A78BFA', h: 80}, {c: '#64748B', h: 10}, {c: '#FBBF24', h: 10}] },
  { time: '8am', parts: [{c: '#FBBF24', h: 20}, {c: '#64748B', h: 20}, {c: '#60A5FA', h: 60}] },
  { time: '9am', parts: [{c: '#60A5FA', h: 40}, {c: '#64748B', h: 20}, {c: '#34D399', h: 40}] },
  { time: '10am', parts: [{c: '#34D399', h: 90}, {c: '#64748B', h: 10}, {c: '#60A5FA', h: 0}] },
  { time: '11am', parts: [{c: '#34D399', h: 60}, {c: '#64748B', h: 20}, {c: '#A78BFA', h: 20}] },
  { time: '12pm', parts: [{c: '#34D399', h: 20}, {c: '#64748B', h: 30}, {c: '#60A5FA', h: 50}] },
  { time: '1pm', parts: [{c: '#60A5FA', h: 70}, {c: '#64748B', h: 20}, {c: '#34D399', h: 10}] },
  { time: '2pm', parts: [{c: '#34D399', h: 80}, {c: '#64748B', h: 20}, {c: '#A78BFA', h: 0}] },
  { time: '3pm', parts: [{c: '#A78BFA', h: 100}, {c: '#64748B', h: 0}, {c: '#60A5FA', h: 0}] },
  { time: '4pm', parts: [{c: '#A78BFA', h: 90}, {c: '#64748B', h: 10}, {c: '#FBBF24', h: 0}] },
  { time: '5pm', parts: [{c: '#A78BFA', h: 40}, {c: '#64748B', h: 30}, {c: '#34D399', h: 30}] },
  { time: '6pm', parts: [{c: '#34D399', h: 70}, {c: '#64748B', h: 10}, {c: '#60A5FA', h: 20}] },
];

export default function App() {
  const [routeIndex, setRouteIndex] = useState(0);
  const [alerts, setAlerts] = useState([
    { id: 'start3', type: 'info', msg: "Battery level: 94%", time: '3m ago' },
    { id: 'start2', type: 'safe', msg: "Initial environmental scan clear", time: '2m ago' },
    { id: 'start1', type: 'info', msg: "System online — monitoring active", time: '1m ago' }
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setRouteIndex(prev => {
        const next = (prev + 1) % ROUTE.length;
        const cycleAlert = ALERTS_CYCLE[next];
        setAlerts(current => [
          { id: Date.now().toString(), time: 'just now', ...cycleAlert },
          ...current.slice(0, 3).map(a => ({...a, time: a.time === 'just now' ? '12s ago' : a.time}))
        ]);
        return next;
      });
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const currentStatus = ROUTE[routeIndex];
  const activeRoomId = currentStatus.room;
  const activeRoomDisplayName = ROOM_LAYOUT[activeRoomId].label.toLowerCase();
  
  // Layout constraints to center inside card
  const containerW = 426; // total width used by elements
  const containerH = 268; 

  return (
    <div className="w-full min-h-screen bg-[#0B0F14] text-[#CBD5E1] font-sans overflow-x-hidden selection:bg-purple-500/30">
      
      {/* Dynamic CSS for animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&display=swap');
        
        .font-sans { font-family: 'DM Sans', sans-serif; }
        .font-mono { font-family: 'DM Mono', monospace; }
        
        @keyframes header-dot-pulse {
          0% { box-shadow: 0 0 0 0 rgba(52, 211, 153, 0.4); }
          70% { box-shadow: 0 0 0 6px rgba(52, 211, 153, 0); }
          100% { box-shadow: 0 0 0 0 rgba(52, 211, 153, 0); }
        }
        .header-pulse { animation: header-dot-pulse 2s infinite; }
        
        @keyframes avatar-ring {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
        }
        .avatar-ring-anim { animation: avatar-ring 2s infinite; }
        
        @keyframes slide-down-fade {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .alert-item { animation: slide-down-fade 0.3s ease-out forwards; }
        
        .avatar-move { transition: left 1.5s cubic-bezier(0.4, 0, 0.2, 1), top 1.5s cubic-bezier(0.4, 0, 0.2, 1); }
        .room-highlight { transition: background-color 0.4s ease, border-color 0.4s ease; }
      `}} />

      {/* MOBILE CONTAINER (Max width constraint) */}
      <div className="max-w-[480px] mx-auto min-h-screen border-x border-[#1E2530] bg-[#0B0F14] pb-12 flex flex-col">
        
        {/* 1. Header bar */}
        <header className="flex items-center justify-between p-5 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-[#34D399] header-pulse"></div>
            <div>
              <h1 className="text-[15px] font-[600] text-[#F1F5F9] leading-tight">VisionNav Guardian</h1>
              <p className="text-[10px] font-mono text-[#64748B] mt-0.5">Afolabi residence — {activeRoomDisplayName}</p>
            </div>
          </div>
          <div className="bg-[#34D399]/12 text-[#34D399] text-[10px] font-mono px-2 py-1 rounded-[4px] tracking-wide font-medium">
            LIVE
          </div>
        </header>

        {/* 2. Floor plan section */}
        <section className="px-5 mt-4">
          <h2 className="text-[10px] font-mono uppercase text-[#64748B] tracking-[0.08em] mb-2 font-medium">Floor plan — real-time location</h2>
          
          <div className="w-full bg-[#111720] rounded-[12px] border border-[#1E2530] h-[220px] relative overflow-hidden flex items-center justify-center">
             
             {/* Coordinate wrapper for exact pixel mapping within the flex centered container */}
             <div className="relative" style={{ width: containerW, height: containerH, transform: 'scale(0.8)', transformOrigin: 'center' }}>
                
                {/* Render Rooms */}
                {Object.entries(ROOM_LAYOUT).map(([id, info]) => {
                  const isActive = activeRoomId === id;
                  return (
                    <div 
                      key={id}
                      className={`absolute border rounded-[4px] flex items-end p-2 room-highlight
                        ${isActive ? 'border-[#34D399]/40 bg-[#34D399]/5' : 'border-[#1E2530] bg-transparent'}
                      `}
                      style={{ top: info.top, left: info.left, width: info.width, height: info.height }}
                    >
                      <span className={`text-[9px] font-mono ${isActive ? 'text-[#34D399]' : 'text-[#64748B]'}`}>{info.label}</span>
                    </div>
                  )
                })}

                {/* Speed indicator overlay */}
                <div className="absolute top-2 right-2 text-[9px] font-mono text-[#64748B]">
                  0.4 m/s
                </div>

                {/* Avatar Dot */}
                <div 
                  className="absolute w-[14px] h-[14px] rounded-full bg-[#34D399] avatar-move z-20"
                  style={{ top: ROOM_LAYOUT[activeRoomId].dotY, left: ROOM_LAYOUT[activeRoomId].dotX, transform: 'translate(-50%, -50%)' }}
                >
                  <div className="absolute top-1/2 left-1/2 w-full h-full rounded-full border-[1.5px] border-[#34D399] avatar-ring-anim box-border pointer-events-none"></div>
                  
                  {/* Distance Overlay */}
                  <div className="absolute top-[-24px] left-1/2 transform -translate-x-1/2 bg-[#000000]/80 px-2 py-0.5 rounded-[4px] whitespace-nowrap z-30">
                    <span className="text-[8px] font-mono text-[#34D399]">{currentStatus.dist}</span>
                  </div>
                </div>

             </div>
          </div>
        </section>

        {/* 3. Alerts section */}
        <section className="px-5 mt-6">
          <h2 className="text-[10px] font-mono uppercase text-[#64748B] tracking-[0.08em] mb-2 font-medium">Alerts</h2>
          <div className="flex flex-col gap-2 relative">
            {alerts.map((alert) => {
              const iconBoxBg = alert.type === 'warn' ? 'bg-[#FBBF24]/12 text-[#FBBF24]' : 
                                alert.type === 'safe' ? 'bg-[#34D399]/12 text-[#34D399]' : 
                                alert.type === 'danger' ? 'bg-[#EF4444]/12 text-[#EF4444]' : 
                                'bg-[#60A5FA]/12 text-[#60A5FA]';
              const IconComp = Icons[alert.type];

              return (
                <div key={alert.id} className="alert-item flex items-center gap-3">
                  <div className={`w-[28px] h-[28px] shrink-0 rounded-[6px] flex items-center justify-center ${iconBoxBg}`}>
                    <IconComp />
                  </div>
                  <div className="flex-1 flex justify-between items-center bg-[#111720] border border-[#1E2530] rounded-[8px] px-3 py-2">
                    <span className="text-[12px] text-[#CBD5E1] truncate">{alert.msg}</span>
                    <span className="text-[9px] font-mono text-[#475569] shrink-0 ml-2">{alert.time}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. Today's summary stats */}
        <section className="px-5 mt-6">
          <h2 className="text-[10px] font-mono uppercase text-[#64748B] tracking-[0.08em] mb-2 font-medium">Today's summary</h2>
          <div className="grid grid-cols-3 gap-2">
            
            <div className="bg-[#111720] rounded-[8px] border border-[#1E2530] p-3 text-center flex flex-col items-center justify-center">
              <span className="text-[20px] font-mono font-[700] text-[#34D399] leading-none mb-1">7</span>
              <span className="text-[9px] font-mono uppercase text-[#64748B]">Safe trips</span>
            </div>

            <div className="bg-[#111720] rounded-[8px] border border-[#1E2530] p-3 text-center flex flex-col items-center justify-center">
              <span className="text-[20px] font-mono font-[700] text-[#FBBF24] leading-none mb-1">2</span>
              <span className="text-[9px] font-mono uppercase text-[#64748B]">Alerts</span>
            </div>

            <div className="bg-[#111720] rounded-[8px] border border-[#1E2530] p-3 text-center flex flex-col items-center justify-center">
              <span className="text-[20px] font-mono font-[700] text-[#60A5FA] leading-none mb-1">4.2h</span>
              <span className="text-[9px] font-mono uppercase text-[#64748B]">Independent</span>
            </div>

          </div>
        </section>

        {/* 5. Room activity chart */}
        <section className="px-5 mt-6">
          <h2 className="text-[10px] font-mono uppercase text-[#64748B] tracking-[0.08em] mb-2 font-medium">Activity by room</h2>
          <div className="bg-[#111720] rounded-[8px] border border-[#1E2530] p-4 flex flex-col items-center">
             
             {/* Chart Bars */}
             <div className="w-full flex justify-between items-end h-[40px]">
               {CHART_DATA.map((col, idx) => (
                 <div key={idx} className="w-[18px] h-full flex flex-col justify-end bg-transparent gap-[1px]">
                   {col.parts.map((part, pidx) => (
                     <div key={pidx} style={{ height: `${part.h}%`, backgroundColor: part.c }} className="w-full rounded-[1px]"></div>
                   ))}
                 </div>
               ))}
             </div>

             {/* Chart Timeline */}
             <div className="w-full flex justify-between mt-2 px-0.5">
               {CHART_DATA.map((col, idx) => (
                 <span key={idx} className="text-[8px] font-mono text-[#475569]">{idx % 2 === 0 ? col.time : ''}</span>
               ))}
             </div>

             {/* Chart Legend */}
             <div className="flex flex-wrap gap-x-3 gap-y-1 mt-4 w-full justify-center">
               {Object.entries(ROOM_COLORS).map(([key, hex]) => (
                  <div key={key} className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: hex }}></div>
                    <span className="text-[9px] font-mono text-[#64748B] capitalize">{key}</span>
                  </div>
               ))}
             </div>
          </div>
        </section>

        {/* Spacer for bottom bar */}
        <div className="flex-1"></div>

        {/* 6. Bottom action bar */}
        <section className="px-5 mt-8 sticky bottom-5 pt-4">
          <div className="flex gap-2">
            <button className="flex-1 bg-[#34D399]/12 text-[#34D399] border border-[#34D399]/20 rounded-[8px] py-[10px] text-[11px] font-[600] active:bg-[#34D399]/20 transition-colors">
              Intercom
            </button>
            <button className="flex-1 bg-[#111720] text-[#94A3B8] border border-[#1E2530] rounded-[8px] py-[10px] text-[11px] font-[600] active:bg-[#1E2530] transition-colors">
              Reports
            </button>
            <button className="flex-1 bg-[#EF4444]/12 text-[#EF4444] border border-[#EF4444]/20 rounded-[8px] py-[10px] text-[11px] font-[600] active:bg-[#EF4444]/20 transition-colors">
              SOS
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}

