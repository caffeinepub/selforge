import { useState } from 'react';
import { ThemeProvider } from 'next-themes';
import Dashboard from './pages/Dashboard';
import Study from './pages/Study';
import Gym from './pages/Gym';
import Nutrition from './pages/Nutrition';
import Goals from './pages/Goals';
import BottomNav from './components/BottomNav';
import OnboardingGate from './components/OnboardingGate';
import { useAppStore } from './lib/store';

function App() {
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'study' | 'gym' | 'nutrition' | 'goals'>('dashboard');
  const { onboardingCompleted, userName } = useAppStore();

  // Check if initial onboarding is complete (only requires name)
  const isOnboardingComplete = onboardingCompleted && userName;

  // Show onboarding gate if not complete
  if (!isOnboardingComplete) {
    return (
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} forcedTheme="dark">
        <OnboardingGate />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} forcedTheme="dark">
      <div className="min-h-screen bg-black text-white flex justify-center">
        <div className="app-canvas flex flex-col min-h-screen">
          <main className="flex-1 pb-16 overflow-y-auto">
            {currentPage === 'dashboard' && <Dashboard />}
            {currentPage === 'study' && <Study />}
            {currentPage === 'gym' && <Gym />}
            {currentPage === 'nutrition' && <Nutrition />}
            {currentPage === 'goals' && <Goals />}
          </main>
          <BottomNav currentPage={currentPage} onNavigate={setCurrentPage} />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
