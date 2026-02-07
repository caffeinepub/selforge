import { useAppStore } from '../lib/store';
import { Card, CardContent } from '@/components/ui/card';
import { Flame, BookOpen, Dumbbell, Apple, Target } from 'lucide-react';

export default function Dashboard() {
  const { getTodayData, currentStreak } = useAppStore();
  const todayData = getTodayData();

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
    <div className="p-4 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Selforge</h1>
        <div className="flex items-center justify-center gap-2">
          <Flame className="w-6 h-6 text-neon-yellow" />
          <span className="text-4xl font-bold text-neon-yellow glow-text">{currentStreak}</span>
          <span className="text-muted-foreground">day streak</span>
        </div>
      </div>

      {/* Study Progress */}
      <Card className="bg-card-dark border-border-subtle">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-5 h-5 text-neon-green" />
            <h2 className="text-lg font-semibold">Study</h2>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Topics completed</span>
              <span className="text-2xl font-bold text-neon-green">{doneTopics}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Topics pending</span>
              <span className="text-2xl font-bold text-neon-yellow">{pendingTopics}</span>
            </div>
            <div className="h-px bg-border-subtle" />
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total topics</span>
              <span className="text-lg font-bold">{totalStudyTopics}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gym Progress */}
      <Card className="bg-card-dark border-border-subtle">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-4">
            <Dumbbell className="w-5 h-5 text-neon-green" />
            <h2 className="text-lg font-semibold">Gym</h2>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Calories burned</span>
              <span className="text-3xl font-bold text-neon-green glow-text">{totalGymCalories}</span>
            </div>
            <div className="h-px bg-border-subtle" />
            <div>
              <span className="text-sm text-muted-foreground">Muscles trained</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {musclesTrained.length > 0 ? (
                  musclesTrained.map((muscle) => (
                    <span key={muscle} className="px-2 py-1 bg-neon-green/20 text-neon-green rounded-full text-xs border border-neon-green/30">
                      {muscle}
                    </span>
                  ))
                ) : (
                  <span className="text-muted-foreground text-sm">None yet</span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Nutrition Summary */}
      <Card className="bg-card-dark border-border-subtle">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-4">
            <Apple className="w-5 h-5 text-neon-yellow" />
            <h2 className="text-lg font-semibold">Nutrition</h2>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Calories eaten</span>
              <span className="text-3xl font-bold text-neon-yellow glow-text">{totalCaloriesEaten}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Protein</span>
              <span className="text-xl font-bold text-neon-green">{totalProtein.toFixed(1)}g</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Sugar</span>
              <span className="text-xl font-bold">{totalSugar.toFixed(1)}g</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calorie Burn Summary */}
      <Card className="bg-card-dark border-border-subtle">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-4">
            <Flame className="w-5 h-5 text-neon-green" />
            <h2 className="text-lg font-semibold">Calorie Burn</h2>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Gym</span>
              <span className="text-neon-green font-bold">{totalGymCalories} kcal</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">School</span>
              <span className="text-neon-green font-bold">{schoolCalories} kcal</span>
            </div>
            <div className="h-px bg-border-subtle" />
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total burned</span>
              <span className="text-2xl font-bold text-neon-green glow-text">{totalCaloriesBurned}</span>
            </div>
            <div className="h-px bg-border-subtle" />
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Net calories</span>
              <span className={`text-3xl font-bold glow-text ${netCalories < 0 ? 'text-neon-green' : 'text-neon-yellow'}`}>
                {netCalories > 0 ? '+' : ''}{netCalories}
              </span>
            </div>
            <div className="text-xs text-center text-muted-foreground">
              {netCalories < 0 ? 'Calorie deficit' : 'Calorie surplus'}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Goals Progress */}
      <Card className="bg-card-dark border-border-subtle">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-5 h-5 text-neon-yellow" />
            <h2 className="text-lg font-semibold">Daily Goals</h2>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Goals completed</span>
            <span className="text-4xl font-bold text-neon-yellow glow-text">
              {goalsCompleted}/{totalGoals}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
