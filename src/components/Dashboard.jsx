import { useState } from 'react';
import { useSimulation } from '../hooks/useSimulation';
import FloorPlan from './FloorPlan';
import LidarView from './LidarView';
import AlertFeed from './AlertFeed';
import StatsPanel from './StatsPanel';
import ActivityChart from './ActivityChart';
import ImpactBanner from './ImpactBanner';
import TimelineScrubber from './TimelineScrubber';
import ActionBar from './ActionBar';
import ToastNotification from './ToastNotification';
import GuardianBrainPanel from './GuardianBrainPanel';
import RoutePlanner from './RoutePlanner';
import AutonomousLog from './AutonomousLog';
import SosModal from './modals/SosModal';
import IntercomModal from './modals/IntercomModal';
import ReportsModal from './modals/ReportsModal';

export default function Dashboard({ onBack }) {
  const [paused, setPaused] = useState(false);
  const [sosOpen, setSosOpen] = useState(false);
  const [intercomOpen, setIntercomOpen] = useState(false);
  const [reportsOpen, setReportsOpen] = useState(false);

  const sim = useSimulation({ paused });

  return (
    <div className="dashboard-root min-h-screen flex flex-col">
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-5 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-accent-cyan header-pulse" aria-hidden="true" />
            <div>
              <h1 className="text-[15px] font-normal text-text leading-tight">HoloAid</h1>
              <p className="text-[11px] text-muted mt-0.5">Monitoring care giver system</p>
              <p className="text-[10px] text-muted/70 mt-0.5">
                Afolabi residence · {sim.activeRoomLabel.toLowerCase()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {onBack && (
              <button type="button" onClick={onBack} className="hidden lg:block text-[11px] text-muted hover:text-text transition-colors">
                ← Back
              </button>
            )}
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-accent/10 border border-accent/20">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan header-pulse" />
              <span className="text-[10px] text-accent-cyan uppercase tracking-wider">Live</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-5 lg:px-8 py-5 pb-28 lg:pb-8">
        <ImpactBanner stats={sim.stats} brain={sim.brain} />

        <div className="mt-5">
          <GuardianBrainPanel brain={sim.brain} />
        </div>

        <div className="mt-5 lg:mt-6 grid lg:grid-cols-12 gap-5 lg:gap-6">
          <div className="lg:col-span-5 space-y-5">
            <FloorPlan
              activeRoomId={sim.activeRoomId}
              currentStatus={sim.currentStatus}
              pathTrail={sim.pathTrail}
              plannedRoute={sim.brain.route?.planned}
            />
            <LidarView
              activeRoomId={sim.activeRoomId}
              activeRoomLabel={sim.activeRoomLabel}
              anomalies={sim.brain.anomalies}
            />
            <TimelineScrubber
              routeIndex={sim.routeIndex}
              routeLength={sim.routeLength}
              onScrub={sim.scrubTo}
              paused={paused}
              onTogglePause={() => setPaused((p) => !p)}
            />
          </div>

          <div className="lg:col-span-3 space-y-5">
            <RoutePlanner brain={sim.brain} activeRoomId={sim.activeRoomId} />
            <AutonomousLog memory={sim.brain.memory} />
          </div>

          <div className="lg:col-span-4 space-y-5">
            <AlertFeed alerts={sim.alerts} />
            <StatsPanel stats={sim.stats} />
            <ActivityChart chartData={sim.chartData} />
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 lg:static z-20 px-5 lg:px-8 pb-5 lg:pb-8 pt-3 bg-gradient-to-t from-background via-background/95 to-transparent lg:from-transparent">
        <div className="max-w-7xl mx-auto">
          <ActionBar
            onIntercom={() => setIntercomOpen(true)}
            onReports={() => setReportsOpen(true)}
            onSos={() => setSosOpen(true)}
          />
        </div>
      </div>

      <ToastNotification toast={sim.toast} onDismiss={sim.dismissToast} />
      <SosModal open={sosOpen} onClose={() => setSosOpen(false)} />
      <IntercomModal open={intercomOpen} onClose={() => setIntercomOpen(false)} />
      <ReportsModal open={reportsOpen} onClose={() => setReportsOpen(false)} stats={sim.stats} alerts={sim.alerts} brain={sim.brain} />
    </div>
  );
}
