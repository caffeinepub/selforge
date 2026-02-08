import { useAppStore } from '../lib/store';
import { Card, CardContent } from '@/components/ui/card';
import { Flame, BookOpen, Dumbbell, Apple, Target, Sparkles } from 'lucide-react';
import LiveCalendarWidget from '../components/LiveCalendarWidget';
import HeaderMeasurements from '../components/HeaderMeasurements';
import { useResultCountdowns } from '../hooks/useResultCountdowns';

export default function Dashboard() {
  const { getTodayData, currentStreak, userName } = useAppStore();
  const todayData = getTodayData();
  const { weeklyDays, monthlyDays } = useResultCountdowns();

  // Calculate study progress
  const totalStudyTopics = todayData.studyTopics.length;
  const doneTopics = todayData.studyTopics.filter((t) => t.status === 'done').length;
  const pendingTopics = todayData.studyTopics.filter((t) => t.status === 'pending').length;

  // Calculate gym metrics
  const totalGymCalories = todayData.gymActivities.reduce((sum, a) => sum + a.caloriesBurned, 0);
  const musclesTrained = [...new Set(todayData.gymActivities.filter((a) => a.muscleGroup).map((a) => a.muscleGroup))];

  // Calculate nutrition metrics
  const totalCaloriesEaten = todayData.foodEntries.reduce((sum, f) => sum + f.calories, 0);
  const totalProtein = todayData.foodEntries.reduce((sum, f) => sum + f.protein, 0);
  const totalSugar = todayData.foodEntries.reduce((sum, f) => sum + f.sugar, 0);

  // Calculate total calories burned
  const schoolCalories = todayData.wentToSchool ? 1700 : 0;
  const totalCaloriesBurned = totalGymCalories + schoolCalories;
  const netCalories = totalCaloriesEaten - totalCaloriesBurned;

  // Calculate goals completed
  const goalsCompleted = Object.values(todayData.goalsCompleted).filter(Boolean).length;
  const totalGoals = 5;

  return (
    <div className="page-container">
      {/* Header Block - Aligned */}
      <div className="space-y-3">
        {/* Top Row: App Name and Streak */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight text-neon-green">Nuvio</h1>
          <div className="flex items-center gap-1.5">
            <Flame className="w-5 h-5 text-neon-yellow" />
            <span className="text-2xl font-bold text-neon-yellow glow-text">{currentStreak}</span>
            <span className="text-xs text-muted-foreground">days</span>
          </div>
        </div>

        {/* Greeting with Icon and Countdown Indicators */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-neon-green" />
            <span className="text-base font-semibold text-white">Hello, {userName}</span>
          </div>
          
          {/* Countdown Indicators inside greeting section */}
          <div className="flex flex-col gap-1.5 pl-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-neon-green/30 rounded-full w-fit">
              <span className="text-xs text-white/90">
                {weeklyDays} {weeklyDays === 1 ? 'day' : 'days'} before weekly result
              </span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-neon-green/30 rounded-full w-fit">
              <span className="text-xs text-white/90">
                {monthlyDays} {monthlyDays === 1 ? 'day' : 'days'} before monthly result
              </span>
            </div>
          </div>
        </div>

        {/* Measurements Row */}
        <HeaderMeasurements />
        
        {/* Live Calendar Widget (time and date only) */}
        <LiveCalendarWidget />
      </div>

      {/* Study Progress */}
      <Card className="bg-card-dark border-border-subtle">
        <CardContent className="card-compact">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-4 h-4 text-neon-green" />
            <h2 className="section-title">Study</h2>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Topics completed</span>
              <span className="text-xl font-bold text-neon-green">{doneTopics}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Topics pending</span>
              <span className="text-xl font-bold text-neon-yellow">{pendingTopics}</span>
            </div>
            <div className="h-px bg-border-subtle" />
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Total topics</span>
              <span className="text-base font-bold">{totalStudyTopics}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gym Progress */}
      <Card className="bg-card-dark border-border-subtle">
        <CardContent className="card-compact">
          <div className="flex items-center gap-2 mb-3">
            <Dumbbell className="w-4 h-4 text-neon-green" />
            <h2 className="section-title">Gym</h2>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Calories burned</span>
              <span className="text-2xl font-bold text-neon-green glow-text">{totalGymCalories}</span>
            </div>
            <div className="h-px bg-border-subtle" />
            <div>
              <span className="text-xs text-muted-foreground">Muscles trained</span>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {musclesTrained.length > 0 ? (
                  musclesTrained.map((muscle) => (
                    <span key={muscle} className="px-2 py-0.5 bg-neon-green/20 text-neon-green rounded-full text-[10px] border border-neon-green/30">
                      {muscle}
                    </span>
                  ))
                ) : (
                  <span className="text-muted-foreground text-xs">None yet</span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Nutrition Summary */}
      <Card className="bg-card-dark border-border-subtle">
        <CardContent className="card-compact">
          <div className="flex items-center gap-2 mb-3">
            <Apple className="w-4 h-4 text-neon-yellow" />
            <h2 className="section-title">Nutrition</h2>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Calories eaten</span>
              <span className="text-2xl font-bold text-neon-yellow glow-text">{totalCaloriesEaten}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Protein</span>
              <span className="text-lg font-bold text-neon-green">{totalProtein.toFixed(1)}g</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Sugar</span>
              <span className="text-lg font-bold">{totalSugar.toFixed(1)}g</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calorie Burn Summary */}
      <Card className="bg-card-dark border-border-subtle">
        <CardContent className="card-compact">
          <div className="flex items-center gap-2 mb-3">
            <Flame className="w-4 h-4 text-neon-green" />
            <h2 className="section-title">Calorie Burn</h2>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">Gym</span>
              <span className="text-neon-green font-bold">{totalGymCalories}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">School</span>
              <span className="text-neon-yellow font-bold">{schoolCalories}</span>
            </div>
            <div className="h-px bg-border-subtle" />
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Total burned</span>
              <span className="text-xl font-bold text-neon-green glow-text">{totalCaloriesBurned}</span>
            </div>
            <div className="h-px bg-border-subtle" />
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Net calories</span>
              <span className={`text-xl font-bold ${netCalories > 0 ? 'text-neon-yellow' : 'text-red-400'}`}>
                {netCalories > 0 ? '+' : ''}{netCalories}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Goals Overview */}
      <Card className="bg-card-dark border-border-subtle">
        <CardContent className="card-compact">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-4 h-4 text-neon-green" />
            <h2 className="section-title">Goals</h2>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Completed today</span>
            <span className="text-2xl font-bold text-neon-green glow-text">
              {goalsCompleted}/{totalGoals}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
