import { useState } from 'react';
import LandingHero from './components/LandingHero';
import Dashboard from './components/Dashboard';

export default function App() {
  const [view, setView] = useState('landing');

  if (view === 'landing') {
    return <LandingHero onEnter={() => setView('dashboard')} />;
  }

  return <Dashboard onBack={() => setView('landing')} />;
}
