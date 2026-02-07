import { useState } from 'react';
import { useAppStore } from '../lib/store';
import { Dumbbell, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { calculateCaloriesBurned } from '../lib/calories';
import { EXERCISE_CATEGORIES } from '../lib/deepseek';

export default function Gym() {
  const { getTodayData, addGymActivity } = useAppStore();
  const todayData = getTodayData();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [workoutType, setWorkoutType] = useState<'gym' | 'cardio'>('gym');
  const [isCalculating, setIsCalculating] = useState(false);

  // Gym form state
  const [muscleGroup, setMuscleGroup] = useState('');
  const [exerciseName, setExerciseName] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');

  // Cardio form state
  const [activityType, setActivityType] = useState('');
  const [duration, setDuration] = useState('');

  const handleAddActivity = async () => {
    if (workoutType === 'gym' && muscleGroup && exerciseName && sets && reps && weight) {
      setIsCalculating(true);
      try {
        const calories = await calculateCaloriesBurned('gym', {
          sets: parseInt(sets),
          reps: parseInt(reps),
          weight: parseInt(weight),
          muscleGroup,
          exerciseName,
        });
        
        addGymActivity({
          type: 'gym',
          muscleGroup,
          exerciseName,
          sets: parseInt(sets),
          reps: parseInt(reps),
          weight: parseInt(weight),
          caloriesBurned: calories,
        });

        resetForm();
        setIsAddDialogOpen(false);
      } finally {
        setIsCalculating(false);
      }
    } else if (workoutType === 'cardio' && activityType && duration) {
      setIsCalculating(true);
      try {
        const calories = await calculateCaloriesBurned('cardio', {
          activityType,
          duration: parseInt(duration),
        });

        addGymActivity({
          type: 'cardio',
          activityType,
          duration: parseInt(duration),
          caloriesBurned: calories,
        });

        resetForm();
        setIsAddDialogOpen(false);
      } finally {
        setIsCalculating(false);
      }
    }
  };

  const resetForm = () => {
    setMuscleGroup('');
    setExerciseName('');
    setSets('');
    setReps('');
    setWeight('');
    setActivityType('');
    setDuration('');
  };

  const handleMuscleGroupChange = (value: string) => {
    setMuscleGroup(value);
    setExerciseName('');
  };

  const totalCalories = todayData.gymActivities.reduce((sum, a) => sum + a.caloriesBurned, 0);
  const musclesTrained = [...new Set(todayData.gymActivities.filter((a) => a.muscleGroup).map((a) => a.muscleGroup))];

  // Get available exercises for selected muscle group
  const availableExercises = muscleGroup ? EXERCISE_CATEGORIES[muscleGroup as keyof typeof EXERCISE_CATEGORIES] || [] : [];

  return (
    <div className="page-container">
      <div className="flex items-center justify-between">
        <h1 className="page-title">Gym</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-neon-green text-black hover:bg-neon-green/90 h-8">
              <Dumbbell className="w-3.5 h-3.5 mr-1" />
              Add
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card-dark border-border-subtle max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Exercise</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Button
                  variant={workoutType === 'gym' ? 'default' : 'outline'}
                  onClick={() => setWorkoutType('gym')}
                  className={workoutType === 'gym' ? 'bg-neon-green text-black flex-1' : 'flex-1'}
                >
                  <Dumbbell className="w-4 h-4 mr-2" />
                  Gym
                </Button>
                <Button
                  variant={workoutType === 'cardio' ? 'default' : 'outline'}
                  onClick={() => setWorkoutType('cardio')}
                  className={workoutType === 'cardio' ? 'bg-neon-green text-black flex-1' : 'flex-1'}
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Cardio
                </Button>
              </div>

              {workoutType === 'gym' ? (
                <>
                  <div>
                    <Label htmlFor="muscle">Muscle Group</Label>
                    <Select value={muscleGroup} onValueChange={handleMuscleGroupChange}>
                      <SelectTrigger className="bg-black border-border-subtle">
                        <SelectValue placeholder="Select muscle group" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Chest">Chest</SelectItem>
                        <SelectItem value="Shoulders">Shoulders</SelectItem>
                        <SelectItem value="Legs">Legs</SelectItem>
                        <SelectItem value="Back">Back</SelectItem>
                        <SelectItem value="Biceps">Biceps</SelectItem>
                        <SelectItem value="Triceps">Triceps</SelectItem>
                        <SelectItem value="Core">Core</SelectItem>
                        <SelectItem value="Cardio">Cardio</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {muscleGroup && (
                    <div>
                      <Label htmlFor="exercise">Exercise</Label>
                      <Select value={exerciseName} onValueChange={setExerciseName}>
                        <SelectTrigger className="bg-black border-border-subtle">
                          <SelectValue placeholder="Select exercise" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                          {availableExercises.map((exercise) => (
                            <SelectItem key={exercise} value={exercise}>
                              {exercise}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <Label htmlFor="sets">Sets</Label>
                      <Input
                        id="sets"
                        type="number"
                        value={sets}
                        onChange={(e) => setSets(e.target.value)}
                        placeholder="3"
                        className="bg-black border-border-subtle"
                      />
                    </div>
                    <div>
                      <Label htmlFor="reps">Reps</Label>
                      <Input
                        id="reps"
                        type="number"
                        value={reps}
                        onChange={(e) => setReps(e.target.value)}
                        placeholder="12"
                        className="bg-black border-border-subtle"
                      />
                    </div>
                    <div>
                      <Label htmlFor="weight">Weight (kg)</Label>
                      <Input
                        id="weight"
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        placeholder="20"
                        className="bg-black border-border-subtle"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <Label htmlFor="activity">Activity Type</Label>
                    <Select value={activityType} onValueChange={setActivityType}>
                      <SelectTrigger className="bg-black border-border-subtle">
                        <SelectValue placeholder="Select activity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Running">Running</SelectItem>
                        <SelectItem value="Cycling">Cycling</SelectItem>
                        <SelectItem value="Swimming">Swimming</SelectItem>
                        <SelectItem value="Walking">Walking</SelectItem>
                        <SelectItem value="Jump Rope">Jump Rope</SelectItem>
                        <SelectItem value="Rowing">Rowing</SelectItem>
                        <SelectItem value="Elliptical">Elliptical</SelectItem>
                        <SelectItem value="Stair Climbing">Stair Climbing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="30"
                      className="bg-black border-border-subtle"
                    />
                  </div>
                </>
              )}

              <Button 
                onClick={handleAddActivity} 
                disabled={isCalculating}
                className="w-full bg-neon-green text-black hover:bg-neon-green/90"
              >
                {isCalculating ? 'Calculating...' : 'Add Exercise'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary */}
      <Card className="bg-card-dark border-border-subtle">
        <CardContent className="card-compact">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Total calories burned</span>
              <span className="text-3xl font-bold text-neon-green glow-text">{totalCalories}</span>
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

      {/* Activity List */}
      {todayData.gymActivities.length > 0 && (
        <div className="space-y-2">
          <h2 className="section-title">Today's Activities</h2>
          {todayData.gymActivities.map((activity) => (
            <Card key={activity.id} className="bg-card-dark border-border-subtle">
              <CardContent className="pt-3 pb-3">
                {activity.type === 'gym' ? (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-semibold">{activity.exerciseName}</h3>
                        <p className="text-xs text-muted-foreground">{activity.muscleGroup}</p>
                      </div>
                      <span className="text-lg font-bold text-neon-green">{activity.caloriesBurned} kcal</span>
                    </div>
                    <div className="flex gap-3 text-xs text-muted-foreground">
                      <span>{activity.sets} sets</span>
                      <span>{activity.reps} reps</span>
                      <span>{activity.weight} kg</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold">{activity.activityType}</h3>
                      <p className="text-xs text-muted-foreground">{activity.duration} minutes</p>
                    </div>
                    <span className="text-lg font-bold text-neon-green">{activity.caloriesBurned} kcal</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {todayData.gymActivities.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-sm">No activities logged yet.</p>
          <p className="text-xs">Add your first exercise to get started.</p>
        </div>
      )}
    </div>
  );
}
