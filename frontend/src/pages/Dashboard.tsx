import { useState } from 'react';
import { useAppStore, OLED_ACCENT_COLORS } from '../lib/store';
import { Card, CardContent } from '@/components/ui/card';
import { Flame, BookOpen, Dumbbell, Apple, Target, Brain, Clock } from 'lucide-react';
import LiveCalendarWidget from '../components/LiveCalendarWidget';
import HeaderMeasurements from '../components/HeaderMeasurements';
import MeasurementsEditorDialog from '../components/MeasurementsEditorDialog';
import OledModeToggle from '../components/OledModeToggle';
import { useResultCountdowns } from '../hooks/useResultCountdowns';

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

// OLED accent colors
const OV = '#7B00FF'; // Electric Violet — study/default
const OG = '#DC143C'; // Crimson — gym
const ON = '#39FF14'; // Radioactive Green — nutrition

export default function Dashboard() {
  const { getTodayData, currentStreak, userName, oledMode, oledAccentColorId, protocolSessions } = useAppStore();
  const todayData = getTodayData();
  const { weeklyDays, monthlyDays } = useResultCountdowns();
  const [measurementsDialogOpen, setMeasurementsDialogOpen] = useState(false);

  // Resolve accent hex for OLED mode
  const accentHex = OLED_ACCENT_COLORS.find((c) => c.id === oledAccentColorId)?.hex ?? OV;

  const totalStudyTopics = todayData.studyTopics.length;
  const doneTopics = todayData.studyTopics.filter((t) => t.status === 'done').length;
  const pendingTopics = todayData.studyTopics.filter((t) => t.status === 'pending').length;

  const totalGymCalories = todayData.gymActivities.reduce((sum, a) => sum + a.caloriesBurned, 0);
  const musclesTrained = [
    ...new Set(
      todayData.gymActivities.filter((a) => a.muscleGroup).map((a) => a.muscleGroup as string)
    ),
  ];

  const totalCaloriesEaten = todayData.foodEntries.reduce((sum, f) => sum + f.calories, 0);
  const totalProtein = todayData.foodEntries.reduce((sum, f) => sum + f.protein, 0);
  const totalSugar = todayData.foodEntries.reduce((sum, f) => sum + f.sugar, 0);

  const schoolCalories = todayData.wentToSchool ? 1700 : 0;
  const totalCaloriesBurned = totalGymCalories + schoolCalories;
  const netCalories = totalCaloriesEaten - totalCaloriesBurned;

  const goalsCompleted = Object.values(todayData.goalsCompleted).filter(Boolean).length;
  const totalGoals = 5;

  return (
    <div className={`page-container ${oledMode ? 'bg-black' : ''}`}>
      {/* Header Block */}
      <div className="space-y-3">
        <div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-start">
          {/* Left: App Name */}
          <div className="flex items-start">
            <h1 className="text-2xl sm:text-3xl font-black tracking-[0.12em] text-neon-green axiom-glow-title">
              AXIOM
            </h1>
          </div>

          {/* Center: Greeting + Time/Date */}
          <div className="flex justify-center min-w-0">
            <LiveCalendarWidget
              userName={userName}
              onCalendarClick={() => setMeasurementsDialogOpen(true)}
            />
          </div>

          {/* Right: Streak + Countdowns */}
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-neon-yellow" />
              <span className="text-xl font-bold text-neon-yellow glow-text">{currentStreak}</span>
              <span className={`text-[10px] ${oledMode ? 'text-[#7B00FF]/60' : 'text-muted-foreground'}`}>days</span>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <div
                className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full max-w-[140px]"
                style={
                  oledMode
                    ? { background: `${accentHex}10`, border: `1px solid ${accentHex}50` }
                    : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(117,255,20,0.3)' }
                }
              >
                <span
                  className="text-[10px] leading-tight text-right break-words"
                  style={oledMode ? { color: accentHex } : { color: 'rgba(255,255,255,0.9)' }}
                >
                  {weeklyDays} {weeklyDays === 1 ? 'day' : 'days'} before weekly result
                </span>
              </div>
              <div
                className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full max-w-[140px]"
                style={
                  oledMode
                    ? { background: `${accentHex}10`, border: `1px solid ${accentHex}50` }
                    : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(117,255,20,0.3)' }
                }
              >
                <span
                  className="text-[10px] leading-tight text-right break-words"
                  style={oledMode ? { color: accentHex } : { color: 'rgba(255,255,255,0.9)' }}
                >
                  {monthlyDays} {monthlyDays === 1 ? 'day' : 'days'} before monthly result
                </span>
              </div>
            </div>
          </div>
        </div>

        <HeaderMeasurements />

        {/* Mode toggles row */}
        <div className="flex items-center gap-2 justify-end">
          <OledModeToggle />
        </div>
      </div>

      {/* ── Study Progress ───────────────────────────────────────────────────── */}
      <Card
        className="border"
        style={
          oledMode
            ? { background: '#000', borderColor: OV, boxShadow: `0 0 8px ${OV}60` }
            : undefined
        }
      >
        <CardContent className={`card-compact ${!oledMode ? 'bg-card-dark border-border-subtle/60 hover:border-neon-green/20 transition-colors duration-300 rounded-xl' : ''}`}>
          <div className="flex items-center gap-2 mb-3">
            <BookOpen
              className="w-4 h-4"
              style={oledMode ? { color: OV, filter: `drop-shadow(0 0 4px ${OV})` } : { color: 'oklch(var(--neon-green))' }}
            />
            <h2 className="heading-2" style={oledMode ? { color: OV } : { color: '#fff' }}>
              Study
            </h2>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs" style={oledMode ? { color: `${OV}80` } : { color: 'rgba(255,255,255,0.5)' }}>
                Topics completed
              </span>
              <span
                className="text-xl font-bold"
                style={oledMode ? { color: OV, textShadow: `0 0 8px ${OV}80` } : { color: 'oklch(var(--neon-green))' }}
              >
                {doneTopics}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs" style={oledMode ? { color: `${OV}80` } : { color: 'rgba(255,255,255,0.5)' }}>
                Topics pending
              </span>
              <span
                className="text-xl font-bold"
                style={oledMode ? { color: `${OV}CC`, textShadow: `0 0 6px ${OV}60` } : { color: 'oklch(var(--neon-yellow))' }}
              >
                {pendingTopics}
              </span>
            </div>
            <div className="h-px" style={oledMode ? { background: `${OV}30` } : { background: 'rgba(255,255,255,0.08)' }} />
            <div className="flex justify-between items-center">
              <span className="text-xs" style={oledMode ? { color: `${OV}80` } : { color: 'rgba(255,255,255,0.5)' }}>
                Total topics
              </span>
              <span
                className="text-base font-bold"
                style={oledMode ? { color: OV } : { color: '#fff' }}
              >
                {totalStudyTopics}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Gym Progress ─────────────────────────────────────────────────────── */}
      <Card
        className="border"
        style={
          oledMode
            ? { background: '#000', borderColor: OG, boxShadow: `0 0 8px ${OG}60` }
            : undefined
        }
      >
        <CardContent className={`card-compact ${!oledMode ? 'bg-card-dark border-border-subtle/60 hover:border-neon-green/20 transition-colors duration-300 rounded-xl' : ''}`}>
          <div className="flex items-center gap-2 mb-3">
            <Dumbbell
              className="w-4 h-4"
              style={oledMode ? { color: OG, filter: `drop-shadow(0 0 4px ${OG})` } : { color: 'oklch(var(--neon-green))' }}
            />
            <h2 className="heading-2" style={oledMode ? { color: OG } : { color: '#fff' }}>
              Gym
            </h2>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs" style={oledMode ? { color: `${OG}90` } : { color: 'rgba(255,255,255,0.5)' }}>
                Calories burned
              </span>
              <span
                className="text-2xl font-bold"
                style={oledMode ? { color: OG, textShadow: `0 0 10px ${OG}80` } : { color: 'oklch(var(--neon-green))' }}
              >
                {totalGymCalories}
              </span>
            </div>
            <div className="h-px" style={oledMode ? { background: `${OG}30` } : { background: 'rgba(255,255,255,0.08)' }} />
            <div>
              <span className="text-xs" style={oledMode ? { color: `${OG}90` } : { color: 'rgba(255,255,255,0.5)' }}>
                Muscles trained
              </span>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {musclesTrained.length > 0 ? (
                  musclesTrained.map((muscle) => (
                    <span
                      key={muscle}
                      className="px-2 py-0.5 rounded-full text-[10px] border tracking-wide"
                      style={
                        oledMode
                          ? { background: `${OG}12`, color: OG, borderColor: `${OG}40` }
                          : { background: 'rgba(117,255,20,0.1)', color: 'oklch(var(--neon-green))', borderColor: 'rgba(117,255,20,0.25)' }
                      }
                    >
                      {muscle}
                    </span>
                  ))
                ) : (
                  <span
                    className="text-xs"
                    style={oledMode ? { color: `${OG}70` } : { color: 'rgba(255,255,255,0.4)' }}
                  >
                    None yet
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Nutrition Summary ────────────────────────────────────────────────── */}
      <Card
        className="border"
        style={
          oledMode
            ? { background: '#000', borderColor: ON, boxShadow: `0 0 8px ${ON}60` }
            : undefined
        }
      >
        <CardContent className={`card-compact ${!oledMode ? 'bg-card-dark border-border-subtle/60 hover:border-neon-green/20 transition-colors duration-300 rounded-xl' : ''}`}>
          <div className="flex items-center gap-2 mb-3">
            <Apple
              className="w-4 h-4"
              style={oledMode ? { color: ON, filter: `drop-shadow(0 0 4px ${ON})` } : { color: 'oklch(var(--neon-green))' }}
            />
            <h2 className="heading-2" style={oledMode ? { color: ON } : { color: '#fff' }}>
              Nutrition
            </h2>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs" style={oledMode ? { color: `${ON}90` } : { color: 'rgba(255,255,255,0.5)' }}>
                Calories eaten
              </span>
              <span
                className="text-2xl font-bold"
                style={oledMode ? { color: ON, textShadow: `0 0 10px ${ON}80` } : { color: 'oklch(var(--neon-green))' }}
              >
                {totalCaloriesEaten}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs" style={oledMode ? { color: `${ON}90` } : { color: 'rgba(255,255,255,0.5)' }}>
                Protein
              </span>
              <span
                className="text-lg font-bold"
                style={oledMode ? { color: ON } : { color: 'oklch(var(--neon-green))' }}
              >
                {totalProtein.toFixed(1)}g
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs" style={oledMode ? { color: `${ON}90` } : { color: 'rgba(255,255,255,0.5)' }}>
                Sugar
              </span>
              <span
                className="text-lg font-bold"
                style={oledMode ? { color: ON } : { color: '#fff' }}
              >
                {totalSugar.toFixed(1)}g
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Calorie Burn Summary ─────────────────────────────────────────────── */}
      <Card
        className="border"
        style={
          oledMode
            ? { background: '#000', borderColor: OV, boxShadow: `0 0 8px ${OV}60` }
            : undefined
        }
      >
        <CardContent className={`card-compact ${!oledMode ? 'bg-card-dark border-border-subtle/60 hover:border-neon-green/20 transition-colors duration-300 rounded-xl' : ''}`}>
          <div className="flex items-center gap-2 mb-3">
            <Flame
              className="w-4 h-4"
              style={oledMode ? { color: OV, filter: `drop-shadow(0 0 4px ${OV})` } : { color: 'oklch(var(--neon-green))' }}
            />
            <h2 className="heading-2" style={oledMode ? { color: OV } : { color: '#fff' }}>
              Calorie Burn
            </h2>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span style={oledMode ? { color: `${OV}80` } : { color: 'rgba(255,255,255,0.5)' }}>
                Gym
              </span>
              <span
                className="font-bold"
                style={oledMode ? { color: OG, textShadow: `0 0 6px ${OG}60` } : { color: 'oklch(var(--neon-green))' }}
              >
                {totalGymCalories}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span style={oledMode ? { color: `${OV}80` } : { color: 'rgba(255,255,255,0.5)' }}>
                School
              </span>
              <span
                className="font-bold"
                style={oledMode ? { color: `${OV}CC` } : { color: 'oklch(var(--neon-yellow))' }}
              >
                {schoolCalories}
              </span>
            </div>
            <div className="h-px" style={oledMode ? { background: `${OV}30` } : { background: 'rgba(255,255,255,0.08)' }} />
            <div className="flex justify-between items-center">
              <span className="text-xs" style={oledMode ? { color: `${OV}80` } : { color: 'rgba(255,255,255,0.5)' }}>
                Total burned
              </span>
              <span
                className="text-xl font-bold"
                style={oledMode ? { color: OV, textShadow: `0 0 8px ${OV}80` } : { color: 'oklch(var(--neon-green))' }}
              >
                {totalCaloriesBurned}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs" style={oledMode ? { color: `${OV}80` } : { color: 'rgba(255,255,255,0.5)' }}>
                Net calories
              </span>
              <span
                className="text-base font-bold"
                style={
                  netCalories > 0
                    ? oledMode ? { color: ON } : { color: 'oklch(var(--neon-yellow))' }
                    : oledMode ? { color: OG } : { color: 'oklch(var(--neon-green))' }
                }
              >
                {netCalories > 0 ? '+' : ''}{netCalories}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Goals Summary ────────────────────────────────────────────────────── */}
      <Card
        className="border"
        style={
          oledMode
            ? { background: '#000', borderColor: OV, boxShadow: `0 0 8px ${OV}60` }
            : undefined
        }
      >
        <CardContent className={`card-compact ${!oledMode ? 'bg-card-dark border-border-subtle/60 hover:border-neon-green/20 transition-colors duration-300 rounded-xl' : ''}`}>
          <div className="flex items-center gap-2 mb-3">
            <Target
              className="w-4 h-4"
              style={oledMode ? { color: OV, filter: `drop-shadow(0 0 4px ${OV})` } : { color: 'oklch(var(--neon-green))' }}
            />
            <h2 className="heading-2" style={oledMode ? { color: OV } : { color: '#fff' }}>
              Goals
            </h2>
            <span
              className="ml-auto text-xs font-bold"
              style={oledMode ? { color: OV } : { color: 'oklch(var(--neon-green))' }}
            >
              {goalsCompleted}/{totalGoals}
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${(goalsCompleted / totalGoals) * 100}%`,
                background: oledMode ? OV : 'oklch(var(--neon-green))',
                boxShadow: oledMode ? `0 0 6px ${OV}80` : 'none',
              }}
            />
          </div>
          <p
            className="text-xs mt-2"
            style={oledMode ? { color: `${OV}80` } : { color: 'rgba(255,255,255,0.4)' }}
          >
            {goalsCompleted === totalGoals
              ? 'All goals completed today!'
              : `${totalGoals - goalsCompleted} goal${totalGoals - goalsCompleted !== 1 ? 's' : ''} remaining`}
          </p>
        </CardContent>
      </Card>

      {/* ── Protocol Sessions ────────────────────────────────────────────────── */}
      {protocolSessions.length > 0 && (
        <Card
          className="border"
          style={
            oledMode
              ? { background: '#000', borderColor: OV, boxShadow: `0 0 8px ${OV}60` }
              : undefined
          }
        >
          <CardContent className={`card-compact ${!oledMode ? 'bg-card-dark border-border-subtle/60 rounded-xl' : ''}`}>
            <div className="flex items-center gap-2 mb-3">
              <Brain
                className="w-4 h-4"
                style={oledMode ? { color: OV, filter: `drop-shadow(0 0 4px ${OV})` } : { color: 'oklch(var(--neon-green))' }}
              />
              <h2 className="heading-2" style={oledMode ? { color: OV } : { color: '#fff' }}>
                Protocol Sessions
              </h2>
            </div>
            <div className="space-y-2">
              {protocolSessions.slice(-5).map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between text-xs"
                  style={oledMode ? { color: `${OV}CC` } : { color: 'rgba(255,255,255,0.7)' }}
                >
                  <span className="truncate max-w-[60%]">{session.subject} — {session.topic}</span>
                  <span className="flex items-center gap-1 shrink-0">
                    <Clock className="w-3 h-3" />
                    {formatDuration(session.durationSeconds)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <MeasurementsEditorDialog
        open={measurementsDialogOpen}
        onOpenChange={setMeasurementsDialogOpen}
      />
    </div>
  );
}
