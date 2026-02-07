import { useAppStore } from '../lib/store';
import { BookOpen, Dumbbell, Apple, Moon, Target } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export default function Goals() {
  const { getTodayData, updateGoal, setWentToSchool } = useAppStore();
  const todayData = getTodayData();

  const goals = [
    { key: 'study' as const, label: 'Study', icon: BookOpen, auto: true },
    { key: 'gym' as const, label: 'Gym', icon: Dumbbell, auto: true },
    { key: 'nutrition' as const, label: 'Nutrition', icon: Apple, auto: false },
    { key: 'sleep' as const, label: 'Sleep', icon: Moon, auto: false },
    { key: 'discipline' as const, label: 'Discipline/NMB', icon: Target, auto: false },
  ];

  const completedCount = Object.values(todayData.goalsCompleted).filter(Boolean).length;
  const totalGoals = goals.length;

  return (
    <div className="p-4 space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Daily Goals</h1>
        <div className="text-5xl font-bold text-neon-green glow-text">
          {completedCount}/{totalGoals}
        </div>
        <p className="text-sm text-muted-foreground mt-1">Goals completed today</p>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-border-subtle rounded-full h-3 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-neon-green to-neon-yellow transition-all duration-500"
          style={{ width: `${(completedCount / totalGoals) * 100}%` }}
        />
      </div>

      {/* Goals List */}
      <div className="space-y-3">
        {goals.map((goal) => {
          const Icon = goal.icon;
          const isCompleted = todayData.goalsCompleted[goal.key];

          return (
            <Card
              key={goal.key}
              className={`bg-card-dark transition-all ${
                isCompleted ? 'border-neon-green/50 bg-neon-green/5' : 'border-border-subtle'
              }`}
            >
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        isCompleted ? 'bg-neon-green/20 border-2 border-neon-green' : 'bg-accent border-2 border-border-subtle'
                      }`}
                    >
                      <Icon className={`w-6 h-6 ${isCompleted ? 'text-neon-green' : 'text-muted-foreground'}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold">{goal.label}</h3>
                      {goal.auto && <p className="text-xs text-muted-foreground">Auto-tracked</p>}
                    </div>
                  </div>
                  <Checkbox
                    checked={isCompleted}
                    onCheckedChange={(checked) => updateGoal(goal.key, checked as boolean)}
                    disabled={goal.auto}
                    className={`w-6 h-6 ${isCompleted ? 'border-neon-green data-[state=checked]:bg-neon-green' : ''}`}
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* School Activity */}
      <Card className="bg-card-dark border-border-subtle">
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="school" className="text-base font-semibold">
                Did you go to school today?
              </Label>
              <p className="text-xs text-muted-foreground mt-1">Adds 1700 kcal burned</p>
            </div>
            <Switch
              id="school"
              checked={todayData.wentToSchool}
              onCheckedChange={setWentToSchool}
              className="data-[state=checked]:bg-neon-green"
            />
          </div>
        </CardContent>
      </Card>

      {/* Motivation */}
      {completedCount === totalGoals && (
        <Card className="bg-gradient-to-r from-neon-green/20 to-neon-yellow/20 border-neon-green">
          <CardContent className="pt-4 text-center">
            <p className="text-lg font-bold text-neon-green">🔥 Perfect Day! 🔥</p>
            <p className="text-sm text-muted-foreground mt-1">All goals completed. Keep the streak alive!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
