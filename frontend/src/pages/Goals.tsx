import { useAppStore, GOAL_COLORS, OLED_ACCENT_COLORS } from '../lib/store';
import { BookOpen, Dumbbell, Apple, Moon, Target } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export default function Goals() {
  const { getTodayData, updateGoal, setWentToSchool, oledMode, oledAccentColorId } = useAppStore();
  const todayData = getTodayData();

  const accentColor = OLED_ACCENT_COLORS.find(c => c.id === oledAccentColorId) ?? OLED_ACCENT_COLORS[0];
  const accentHex = accentColor.hex;

  const goals = [
    { key: 'study' as const,      label: 'Study',     icon: BookOpen, auto: true  },
    { key: 'gym' as const,        label: 'Gym',        icon: Dumbbell, auto: true  },
    { key: 'nutrition' as const,  label: 'Nutrition',  icon: Apple,    auto: false },
    { key: 'sleep' as const,      label: 'Sleep',      icon: Moon,     auto: false },
    { key: 'discipline' as const, label: 'NMB',        icon: Target,   auto: false },
  ];

  const completedCount = Object.values(todayData.goalsCompleted).filter(Boolean).length;
  const totalGoals = goals.length;
  const progressPct = (completedCount / totalGoals) * 100;

  return (
    <div
      className="page-container"
      style={oledMode ? { background: '#000' } : undefined}
    >
      {/* Page header */}
      <div className="space-y-2 pb-1">
        <h1
          className="heading-1"
          style={oledMode ? { color: accentHex, textShadow: `0 0 12px ${accentHex}80` } : undefined}
        >
          Daily Goals
        </h1>
        <div className="flex items-baseline gap-2">
          <span
            className="text-4xl font-black tracking-tight"
            style={
              oledMode
                ? { color: accentHex, textShadow: `0 0 16px ${accentHex}90, 0 0 32px ${accentHex}40` }
                : { color: 'oklch(var(--neon-green))' }
            }
          >
            {completedCount}/{totalGoals}
          </span>
          <span className="text-xs text-muted-foreground">completed today</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div
        className="w-full rounded-full h-1.5 overflow-hidden"
        style={
          oledMode
            ? { background: `${accentHex}20`, border: `1px solid ${accentHex}30` }
            : { background: 'rgba(255,255,255,0.08)' }
        }
      >
        <div
          className="h-full transition-all duration-700 ease-out"
          style={{
            width: `${progressPct}%`,
            background: oledMode
              ? `linear-gradient(90deg, ${accentHex}CC, ${accentHex})`
              : 'linear-gradient(90deg, oklch(0.75 0.35 145), oklch(0.95 0.25 100))',
            boxShadow: oledMode ? `0 0 8px ${accentHex}80` : undefined,
          }}
        />
      </div>

      {/* Goals List */}
      <div className="space-y-2.5">
        {goals.map((goal) => {
          const Icon = goal.icon;
          const isCompleted = todayData.goalsCompleted[goal.key];
          const goalColor = GOAL_COLORS[goal.key];
          const gc = goalColor.hex; // goal-specific color hex

          return (
            <div key={goal.key} className="relative">
              {/* Glow backdrop */}
              <div
                className="absolute inset-0 rounded-lg pointer-events-none transition-all duration-500"
                style={
                  isCompleted
                    ? {
                        boxShadow: oledMode
                          ? `0 0 18px ${gc}40, 0 0 40px ${gc}18, inset 0 0 20px ${gc}10`
                          : `0 0 18px ${gc}30, 0 0 40px ${gc}12, inset 0 0 20px ${gc}06`,
                      }
                    : { boxShadow: 'none' }
                }
              />

              <Card
                className="relative transition-all duration-300 cursor-pointer"
                style={
                  oledMode
                    ? isCompleted
                      ? {
                          background: `${gc}08`,
                          border: `1px solid ${gc}70`,
                          boxShadow: `0 0 10px ${gc}50`,
                        }
                      : {
                          background: '#050505',
                          border: `1px solid ${gc}30`,
                        }
                    : isCompleted
                    ? {
                        background: `${gc}08`,
                        border: `1px solid ${gc}50`,
                      }
                    : {
                        background: 'oklch(var(--card-dark))',
                        border: '1px solid rgba(255,255,255,0.08)',
                      }
                }
                onClick={() => updateGoal(goal.key, !isCompleted)}
              >
                <CardContent className="pt-3 pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/* Icon box */}
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300"
                        style={
                          isCompleted
                            ? {
                                background: `${gc}20`,
                                border: `1px solid ${gc}60`,
                                boxShadow: `0 0 12px ${gc}35`,
                              }
                            : oledMode
                            ? {
                                background: `${gc}0A`,
                                border: `1px solid ${gc}25`,
                              }
                            : {
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                              }
                        }
                      >
                        <Icon
                          className="w-4 h-4 transition-colors duration-300"
                          style={
                            isCompleted
                              ? { color: gc, filter: `drop-shadow(0 0 4px ${gc})` }
                              : oledMode
                              ? { color: `${gc}80` }
                              : { color: 'rgba(255,255,255,0.4)' }
                          }
                        />
                      </div>

                      <div>
                        <h3
                          className="heading-3 tracking-wide transition-colors duration-300"
                          style={
                            isCompleted
                              ? { color: gc, textShadow: `0 0 6px ${gc}60` }
                              : oledMode
                              ? { color: `${gc}CC` }
                              : { color: '#fff' }
                          }
                        >
                          {goal.label}
                        </h3>
                        {goal.auto && (
                          <p
                            className="text-[10px] tracking-wider uppercase mt-0.5"
                            style={
                              oledMode
                                ? { color: `${gc}50` }
                                : { color: 'rgba(255,255,255,0.3)' }
                            }
                          >
                            Auto-tracked
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Checkbox */}
                    <Checkbox
                      checked={isCompleted}
                      onCheckedChange={(checked) => updateGoal(goal.key, checked as boolean)}
                      className="w-5 h-5 transition-all duration-300"
                      style={
                        isCompleted
                          ? {
                              borderColor: gc,
                              backgroundColor: gc,
                              boxShadow: `0 0 8px ${gc}60`,
                            }
                          : oledMode
                          ? { borderColor: `${gc}40` }
                          : { borderColor: 'rgba(255,255,255,0.2)' }
                      }
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>

      {/* School Activity */}
      <Card
        style={
          oledMode
            ? {
                background: '#050505',
                border: `1px solid ${accentHex}30`,
                boxShadow: `0 0 6px ${accentHex}20`,
              }
            : undefined
        }
        className={oledMode ? '' : 'bg-card-dark border-border-subtle/50 hover:border-neon-green/20 transition-colors duration-300'}
      >
        <CardContent className="pt-3 pb-3">
          <div className="flex items-center justify-between">
            <div>
              <Label
                htmlFor="school"
                className="heading-3"
                style={oledMode ? { color: `${accentHex}CC` } : { color: '#fff' }}
              >
                Did you go to school today?
              </Label>
              <p
                className="text-[10px] mt-0.5 tracking-wide"
                style={oledMode ? { color: `${accentHex}50` } : { color: 'rgba(255,255,255,0.3)' }}
              >
                Adds 1700 kcal burned
              </p>
            </div>
            <Switch
              id="school"
              checked={todayData.wentToSchool}
              onCheckedChange={setWentToSchool}
              style={
                todayData.wentToSchool && oledMode
                  ? { backgroundColor: accentHex }
                  : undefined
              }
              className={!oledMode ? 'data-[state=checked]:bg-neon-green' : ''}
            />
          </div>
        </CardContent>
      </Card>

      {/* Perfect Day celebration */}
      {completedCount === totalGoals && (
        <Card
          style={
            oledMode
              ? {
                  background: `${accentHex}08`,
                  border: `1px solid ${accentHex}60`,
                  boxShadow: `0 0 24px ${accentHex}30, inset 0 0 30px ${accentHex}08`,
                }
              : undefined
          }
          className={oledMode ? 'relative overflow-hidden' : 'relative overflow-hidden border-neon-green/60 bg-neon-green/5'}
        >
          {/* Celebration glow */}
          <div
            className="absolute inset-0 pointer-events-none rounded-lg"
            style={
              oledMode
                ? { background: `linear-gradient(135deg, ${accentHex}12, transparent, ${accentHex}08)` }
                : { background: 'linear-gradient(to right, oklch(0.75 0.35 145 / 0.1), oklch(0.95 0.25 100 / 0.05), oklch(0.75 0.35 145 / 0.1))' }
            }
          />
          <CardContent className="pt-3 pb-3 text-center relative z-10">
            <p
              className="text-base font-black tracking-widest"
              style={
                oledMode
                  ? { color: accentHex, textShadow: `0 0 12px ${accentHex}` }
                  : { color: 'oklch(var(--neon-green))' }
              }
            >
              🔥 PERFECT DAY 🔥
            </p>
            <p className="text-xs text-muted-foreground mt-1">All goals completed. Keep the streak alive!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
