import { useState } from 'react';
import { ThemeProvider } from 'next-themes';
import Dashboard from './pages/Dashboard';
import Study from './pages/Study';
import Gym from './pages/Gym';
import Nutrition from './pages/Nutrition';
import Goals from './pages/Goals';
import BottomNav from './components/BottomNav';
import { useAppStore } from './lib/store';

function App() {
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'study' | 'gym' | 'nutrition' | 'goals'>('dashboard');

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} forcedTheme="dark">
      <div className="min-h-screen bg-black text-white flex flex-col">
        <main className="flex-1 pb-20 overflow-y-auto">
          {currentPage === 'dashboard' && <Dashboard />}
          {currentPage === 'study' && <Study />}
          {currentPage === 'gym' && <Gym />}
          {currentPage === 'nutrition' && <Nutrition />}
          {currentPage === 'goals' && <Goals />}
        </main>
        <BottomNav currentPage={currentPage} onNavigate={setCurrentPage} />
      </div>
    </ThemeProvider>
  );
}

export default App;
