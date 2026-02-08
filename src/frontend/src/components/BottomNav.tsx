import { Home, BookOpen, Dumbbell, Apple, Target } from 'lucide-react';

interface BottomNavProps {
  currentPage: 'dashboard' | 'study' | 'gym' | 'nutrition' | 'goals';
  onNavigate: (page: 'dashboard' | 'study' | 'gym' | 'nutrition' | 'goals') => void;
}

export default function BottomNav({ currentPage, onNavigate }: BottomNavProps) {
  const navItems = [
    { id: 'dashboard' as const, icon: Home, label: 'Home' },
    { id: 'study' as const, icon: BookOpen, label: 'Study' },
    { id: 'gym' as const, icon: Dumbbell, label: 'Gym' },
    { id: 'nutrition' as const, icon: Apple, label: 'Food' },
    { id: 'goals' as const, icon: Target, label: 'Goals' },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[720px] bg-card-dark border-t border-border-subtle">
      <div className="flex justify-around items-center h-14">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive ? 'text-neon-green' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
