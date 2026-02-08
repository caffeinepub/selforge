import { useState } from 'react';
import { ThemeProvider } from 'next-themes';
import Dashboard from './pages/Dashboard';
import Study from './pages/Study';
import Gym from './pages/Gym';
import Nutrition from './pages/Nutrition';
import Goals from './pages/Goals';
import Description from './pages/Description';
import BottomNav from './components/BottomNav';

function App() {
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'study' | 'gym' | 'nutrition' | 'goals' | 'description'>('dashboard');

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} forcedTheme="dark">
      <div className="min-h-screen bg-black text-white flex justify-center">
        <div className="app-canvas flex flex-col min-h-screen">
          <main className="flex-1 pb-16 overflow-y-auto">
            {currentPage === 'dashboard' && <Dashboard />}
            {currentPage === 'study' && <Study />}
            {currentPage === 'gym' && <Gym onNavigateToDescription={() => setCurrentPage('description')} />}
            {currentPage === 'nutrition' && <Nutrition onNavigateToDescription={() => setCurrentPage('description')} />}
            {currentPage === 'goals' && <Goals />}
            {currentPage === 'description' && <Description />}
          </main>
          <BottomNav currentPage={currentPage} onNavigate={setCurrentPage} />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
