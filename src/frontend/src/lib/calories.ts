import { calculateDeepSeekGymCalories, calculateDeepSeekCardioCalories, USER_PROFILE } from './deepseek';

// MET (Metabolic Equivalent of Task) values for different activities (fallback)
const MET_VALUES: Record<string, number> = {
  Running: 9.8,
  Jogging: 8.0,
  Cycling: 7.5,
  Swimming: 8.0,
  Walking: 3.5,
  'Jump Rope': 12.0,
  Rowing: 7.0,
  Elliptical: 8.0,
  'Stair Climber': 8.5,
  Treadmill: 9.0,
};

// Calculate calories burned using DeepSeek AI with fallback
export async function calculateCaloriesBurned(
  type: 'gym' | 'cardio',
  params: {
    sets?: number;
    reps?: number;
    weight?: number;
    activityType?: string;
    duration?: number;
    muscleGroup?: string;
    exerciseName?: string;
  }
): Promise<number> {
  if (type === 'cardio' && params.activityType && params.duration) {
    // Try DeepSeek AI first
    const deepseekCalories = await calculateDeepSeekCardioCalories(
      params.activityType,
      params.duration
    );
    
    if (deepseekCalories !== null) {
      return deepseekCalories;
    }

    // Fallback to MET calculation
    const met = MET_VALUES[params.activityType] || 6.0;
    const durationHours = params.duration / 60;
    return Math.round(met * USER_PROFILE.weight * durationHours);
  }

  if (type === 'gym' && params.sets && params.reps && params.weight) {
    // Try DeepSeek AI first
    if (params.exerciseName && params.muscleGroup) {
      const deepseekCalories = await calculateDeepSeekGymCalories(
        params.exerciseName,
        params.muscleGroup,
        params.sets,
        params.reps,
        params.weight
      );
      
      if (deepseekCalories !== null) {
        return deepseekCalories;
      }
    }

    // Fallback calculation
    const estimatedMinutes = (params.sets * params.reps * 3) / 60;
    const caloriesPerMinute = 6.5;
    const baseCalories = estimatedMinutes * caloriesPerMinute;
    const weightIntensityBonus = (params.weight / 10) * 0.5;
    
    return Math.round(baseCalories * (1 + weightIntensityBonus));
  }

  return 0;
}

// Export user profile for external use
export { USER_PROFILE };
