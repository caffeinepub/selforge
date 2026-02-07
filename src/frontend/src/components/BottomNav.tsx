import { Home, BookOpen, Dumbbell, Apple, Target } from 'lucide-react';

interface BottomNavProps {
  currentPage: 'dashboard' | 'study' | 'gym' | 'nutrition' | 'goals';
  onNavigate: (page: 'dashboard' | 'study' | 'gym' | 'nutrition' | 'goals') => void;
}

export default function BottomNav({ currentPage, onNavigate }: BottomNavProps) {
  const navItems = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: Home },
    { id: 'study' as const, label: 'Study', icon: BookOpen },
    { id: 'gym' as const, label: 'Gym', icon: Dumbbell },
    { id: 'nutrition' as const, label: 'Nutrition', icon: Apple },
    { id: 'goals' as const, label: 'Goals', icon: Target },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black border-t border-border-subtle">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors ${
                isActive ? 'text-neon-green' : 'text-muted-foreground'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'glow-icon' : ''}`} />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
