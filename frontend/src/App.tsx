import React, { useState } from 'react';
import { ThemeProvider } from 'next-themes';
import { useAppStore } from './lib/store';
import OnboardingGate from './components/OnboardingGate';
import BottomNav from './components/BottomNav';
import Dashboard from './pages/Dashboard';
import Study from './pages/Study';
import Gym from './pages/Gym';
import Nutrition from './pages/Nutrition';
import Goals from './pages/Goals';
import Settings from './pages/Settings';

type Page = 'dashboard' | 'study' | 'gym' | 'nutrition' | 'goals' | 'settings';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const { oledMode } = useAppStore();

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} forcedTheme="dark">
      <OnboardingGate>
        <div className={`min-h-screen text-white flex justify-center ${oledMode ? 'bg-black' : 'bg-black'}`}>
          <div className="app-canvas flex flex-col min-h-screen">
            <main className="flex-1 pb-16 overflow-y-auto">
              {currentPage === 'dashboard' && <Dashboard />}
              {currentPage === 'study' && <Study />}
              {currentPage === 'gym' && <Gym />}
              {currentPage === 'nutrition' && <Nutrition />}
              {currentPage === 'goals' && <Goals />}
              {currentPage === 'settings' && <Settings onBack={() => setCurrentPage('dashboard')} />}
            </main>
            <BottomNav currentPage={currentPage} onNavigate={setCurrentPage} />
          </div>
        </div>
      </OnboardingGate>
    </ThemeProvider>
  );
}
