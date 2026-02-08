import { useAppStore } from '../lib/store';
import { Dumbbell, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function Gym() {
  const { getTodayData } = useAppStore();
  const todayData = getTodayData();

  const totalCalories = todayData.gymActivities.reduce((sum, a) => sum + a.caloriesBurned, 0);
  const musclesTrained = [...new Set(todayData.gymActivities.filter((a) => a.muscleGroup).map((a) => a.muscleGroup))];

  return (
    <div className="page-container">
      <h1 className="page-title">Gym</h1>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <Card className="bg-card-dark border-border-subtle">
          <CardContent className="pt-4 pb-3">
            <p className="text-xs text-gray-400 mb-1">Calories Burned</p>
            <p className="text-xl font-bold text-neon-green">{totalCalories}</p>
          </CardContent>
        </Card>
        <Card className="bg-card-dark border-border-subtle">
          <CardContent className="pt-4 pb-3">
            <p className="text-xs text-gray-400 mb-1">Muscles Trained</p>
            <p className="text-xl font-bold">{musclesTrained.length}</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-2">
        <h2 className="text-sm font-medium text-gray-400 mb-2">Today's Activities</h2>
        {todayData.gymActivities.length === 0 ? (
          <Card className="bg-card-dark border-border-subtle">
            <CardContent className="pt-4 pb-4 text-center">
              <p className="text-sm text-gray-500">No activities logged yet</p>
            </CardContent>
          </Card>
        ) : (
          todayData.gymActivities.map((activity) => (
            <Card key={activity.id} className="bg-card-dark border-border-subtle">
              <CardContent className="pt-3 pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-2 flex-1">
                    {activity.type === 'gym' ? (
                      <Dumbbell className="w-4 h-4 text-neon-green mt-0.5 flex-shrink-0" />
                    ) : (
                      <Heart className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      {activity.summary ? (
                        <p className="text-sm font-medium text-white mb-1">{activity.summary}</p>
                      ) : (
                        <>
                          {activity.type === 'gym' ? (
                            <>
                              <p className="text-sm font-medium text-white">
                                {activity.exerciseName || 'Exercise'}
                              </p>
                              <p className="text-xs text-gray-400">
                                {activity.muscleGroup} • {activity.sets}×{activity.reps} @ {activity.weight}kg
                              </p>
                            </>
                          ) : (
                            <>
                              <p className="text-sm font-medium text-white">
                                {activity.activityType || 'Cardio'}
                              </p>
                              <p className="text-xs text-gray-400">{activity.duration} minutes</p>
                            </>
                          )}
                        </>
                      )}
                      {activity.description && (
                        <p className="text-xs text-gray-500 mt-1 italic">"{activity.description}"</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right ml-2">
                    <p className="text-sm font-bold text-neon-green">{activity.caloriesBurned}</p>
                    <p className="text-xs text-gray-500">kcal</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
