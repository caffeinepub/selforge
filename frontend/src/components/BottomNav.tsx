import React from 'react';
import { Home, BookOpen, Dumbbell, Apple, Target, Settings } from 'lucide-react';

type Page = 'dashboard' | 'study' | 'gym' | 'nutrition' | 'goals' | 'settings';

interface BottomNavProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const navItems: { id: Page; icon: React.ElementType; label: string }[] = [
  { id: 'dashboard',  icon: Home,     label: 'Home'     },
  { id: 'study',      icon: BookOpen, label: 'Study'    },
  { id: 'gym',        icon: Dumbbell, label: 'Gym'      },
  { id: 'nutrition',  icon: Apple,    label: 'Food'     },
  { id: 'goals',      icon: Target,   label: 'Goals'    },
  { id: 'settings',   icon: Settings, label: 'Settings' },
];

export default function BottomNav({ currentPage, onNavigate }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[720px] bg-card-dark border-t border-border-subtle/50 backdrop-blur-sm">
      <div className="flex justify-around items-center h-14">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-200 relative group ${
                isActive ? 'text-neon-green' : 'text-white/30 hover:text-white/70'
              }`}
            >
              {/* Active indicator line */}
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-[2px] bg-neon-green rounded-full shadow-[0_0_8px_oklch(0.75_0.35_145/0.8)]" />
              )}
              <Icon
                className={`w-5 h-5 transition-all duration-200 ${
                  isActive ? 'glow-icon scale-110' : 'group-hover:scale-105'
                }`}
              />
              <span
                className={`text-[9px] mt-0.5 tracking-wider transition-all duration-200 ${
                  isActive ? 'font-semibold' : 'font-normal'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
