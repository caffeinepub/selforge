import { useState } from 'react';
import { useAppStore } from '../lib/store';
import { Dumbbell, Heart, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { calculateCaloriesBurned } from '../lib/calories';

export default function Gym() {
  const { getTodayData, addGymActivity } = useAppStore();
  const todayData = getTodayData();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activityType, setActivityType] = useState<'gym' | 'cardio'>('gym');
  const [isCalculating, setIsCalculating] = useState(false);

  // Gym fields
  const [muscleGroup, setMuscleGroup] = useState('');
  const [exerciseName, setExerciseName] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');

  // Cardio fields
  const [cardioType, setCardioType] = useState('');
  const [duration, setDuration] = useState('');

  const resetForm = () => {
    setActivityType('gym');
    setMuscleGroup('');
    setExerciseName('');
    setSets('');
    setReps('');
    setWeight('');
    setCardioType('');
    setDuration('');
  };

  const handleSubmit = async () => {
    setIsCalculating(true);

    try {
      if (activityType === 'gym') {
        const setsNum = parseInt(sets);
        const repsNum = parseInt(reps);
        const weightNum = parseFloat(weight);

        if (!muscleGroup || !exerciseName || !setsNum || !repsNum || !weightNum) {
          alert('Please fill in all gym fields');
          setIsCalculating(false);
          return;
        }

        const calories = await calculateCaloriesBurned('gym', {
          sets: setsNum,
          reps: repsNum,
          weight: weightNum,
          muscleGroup,
          exerciseName,
        });

        addGymActivity({
          type: 'gym',
          muscleGroup,
          exerciseName,
          sets: setsNum,
          reps: repsNum,
          weight: weightNum,
          caloriesBurned: calories,
        });
      } else {
        const durationNum = parseInt(duration);

        if (!cardioType || !durationNum) {
          alert('Please fill in all cardio fields');
          setIsCalculating(false);
          return;
        }

        const calories = await calculateCaloriesBurned('cardio', {
          activityType: cardioType,
          duration: durationNum,
        });

        addGymActivity({
          type: 'cardio',
          activityType: cardioType,
          duration: durationNum,
          caloriesBurned: calories,
        });
      }

      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error adding activity:', error);
      alert('Failed to add activity. Please try again.');
    } finally {
      setIsCalculating(false);
    }
  };

  const totalCalories = todayData.gymActivities.reduce((sum, activity) => sum + activity.caloriesBurned, 0);

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neon-green">Gym</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-neon-green text-black hover:bg-neon-green/90">
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card-dark border-border-subtle max-w-md">
            <DialogHeader>
              <DialogTitle className="text-neon-green">Add Activity</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              {/* Activity Type Toggle */}
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={activityType === 'gym' ? 'default' : 'outline'}
                  className={activityType === 'gym' ? 'flex-1 bg-neon-green text-black' : 'flex-1'}
                  onClick={() => setActivityType('gym')}
                >
                  <Dumbbell className="w-4 h-4 mr-2" />
                  Gym
                </Button>
                <Button
                  type="button"
                  variant={activityType === 'cardio' ? 'default' : 'outline'}
                  className={activityType === 'cardio' ? 'flex-1 bg-neon-green text-black' : 'flex-1'}
                  onClick={() => setActivityType('cardio')}
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Cardio
                </Button>
              </div>

              {/* Gym Form */}
              {activityType === 'gym' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="muscleGroup">Muscle Group</Label>
                    <Select value={muscleGroup} onValueChange={setMuscleGroup}>
                      <SelectTrigger className="bg-black border-border-subtle">
                        <SelectValue placeholder="Select muscle group" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Chest">Chest</SelectItem>
                        <SelectItem value="Back">Back</SelectItem>
                        <SelectItem value="Shoulders">Shoulders</SelectItem>
                        <SelectItem value="Arms">Arms</SelectItem>
                        <SelectItem value="Legs">Legs</SelectItem>
                        <SelectItem value="Core">Core</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="exerciseName">Exercise Name</Label>
                    <Input
                      id="exerciseName"
                      type="text"
                      placeholder="e.g., Bench Press"
                      value={exerciseName}
                      onChange={(e) => setExerciseName(e.target.value)}
                      className="bg-black border-border-subtle"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-2">
                      <Label htmlFor="sets">Sets</Label>
                      <Input
                        id="sets"
                        type="number"
                        placeholder="3"
                        value={sets}
                        onChange={(e) => setSets(e.target.value)}
                        className="bg-black border-border-subtle"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reps">Reps</Label>
                      <Input
                        id="reps"
                        type="number"
                        placeholder="10"
                        value={reps}
                        onChange={(e) => setReps(e.target.value)}
                        className="bg-black border-border-subtle"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weight">Weight (kg)</Label>
                      <Input
                        id="weight"
                        type="number"
                        step="0.5"
                        placeholder="20"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        className="bg-black border-border-subtle"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Cardio Form */}
              {activityType === 'cardio' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="cardioType">Activity Type</Label>
                    <Select value={cardioType} onValueChange={setCardioType}>
                      <SelectTrigger className="bg-black border-border-subtle">
                        <SelectValue placeholder="Select activity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Running">Running</SelectItem>
                        <SelectItem value="Jogging">Jogging</SelectItem>
                        <SelectItem value="Cycling">Cycling</SelectItem>
                        <SelectItem value="Swimming">Swimming</SelectItem>
                        <SelectItem value="Walking">Walking</SelectItem>
                        <SelectItem value="Jump Rope">Jump Rope</SelectItem>
                        <SelectItem value="Rowing">Rowing</SelectItem>
                        <SelectItem value="Elliptical">Elliptical</SelectItem>
                        <SelectItem value="Stair Climber">Stair Climber</SelectItem>
                        <SelectItem value="Treadmill">Treadmill</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Input
                      id="duration"
                      type="number"
                      placeholder="30"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="bg-black border-border-subtle"
                    />
                  </div>
                </>
              )}

              <Button
                onClick={handleSubmit}
                disabled={isCalculating}
                className="w-full bg-neon-green text-black hover:bg-neon-green/90"
              >
                {isCalculating ? 'Adding...' : 'Add Activity'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Card */}
      <Card className="bg-card-dark border-border-subtle">
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-sm text-gray-400">Total Calories Burned</p>
            <p className="text-3xl font-bold text-neon-green">{totalCalories}</p>
            <p className="text-xs text-gray-500 mt-1">kcal</p>
          </div>
        </CardContent>
      </Card>

      {/* Activities List */}
      <div className="space-y-2">
        <h2 className="text-sm font-semibold text-gray-400">Today's Activities</h2>
        {todayData.gymActivities.length === 0 ? (
          <Card className="bg-card-dark border-border-subtle">
            <CardContent className="pt-6 text-center text-gray-500">
              No activities logged yet
            </CardContent>
          </Card>
        ) : (
          todayData.gymActivities.map((activity) => (
            <Card key={activity.id} className="bg-card-dark border-border-subtle">
              <CardContent className="pt-4">
                {activity.type === 'gym' ? (
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-white">{activity.exerciseName}</p>
                      <p className="text-sm text-gray-400">{activity.muscleGroup}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {activity.sets} sets × {activity.reps} reps @ {activity.weight}kg
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-neon-green">{activity.caloriesBurned}</p>
                      <p className="text-xs text-gray-500">kcal</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-white">{activity.activityType}</p>
                      <p className="text-sm text-gray-400">Cardio</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.duration} minutes</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-neon-green">{activity.caloriesBurned}</p>
                      <p className="text-xs text-gray-500">kcal</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
