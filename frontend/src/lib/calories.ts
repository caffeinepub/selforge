// User profile constants for calorie calculations
const USER_PROFILE = {
  age: 17,
  height: 172, // cm
  weight: 80, // kg
};

// MET (Metabolic Equivalent of Task) values for different activities
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

// Calculate calories burned using MET-based calculations
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
    // Use MET calculation for cardio
    const met = MET_VALUES[params.activityType] || 6.0;
    const durationHours = params.duration / 60;
    return Math.round(met * USER_PROFILE.weight * durationHours);
  }

  if (type === 'gym' && params.sets && params.reps && params.weight) {
    // Fallback calculation for gym exercises
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
