// DeepSeek AI API integration for Selforge
// Unified smart data backend for exercise and nutrition details

// DeepSeek API configuration
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY || '';

// User profile constants for calorie calculations
const USER_AGE = 17;
const USER_HEIGHT = 172; // cm
const USER_WEIGHT = 80; // kg

interface DeepSeekExerciseResponse {
  exercise: string;
  muscleGroup: string;
  caloriesBurned: number;
  variations: string[];
}

interface DeepSeekNutritionResponse {
  food: string;
  brand?: string;
  calories: number;
  protein: number;
  sugar: number;
}

// Call DeepSeek AI API
async function callDeepSeekAPI(prompt: string): Promise<string | null> {
  if (!DEEPSEEK_API_KEY) {
    console.warn('DeepSeek API key not configured. Using fallback calculations.');
    return null;
  }

  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'You are a fitness and nutrition expert. Always respond with valid JSON only, no markdown formatting or explanations.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      console.warn('DeepSeek API request failed:', response.status);
      return null;
    }

    const data = await response.json();
    
    if (data.choices && data.choices.length > 0) {
      const content = data.choices[0].message.content;
      // Clean potential markdown formatting
      return content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    }

    return null;
  } catch (error) {
    console.warn('Error calling DeepSeek API:', error);
    return null;
  }
}

// Fetch exercise data from DeepSeek AI
export async function fetchDeepSeekExerciseData(
  exerciseName: string,
  muscleGroup: string
): Promise<DeepSeekExerciseResponse | null> {
  const prompt = `Analyze this exercise: "${exerciseName}" for muscle group "${muscleGroup}".
Return ONLY a JSON object with this exact structure:
{
  "exercise": "${exerciseName}",
  "muscleGroup": "${muscleGroup}",
  "caloriesBurned": <estimated calories per minute for this exercise>,
  "variations": [<list of common variations like barbell, dumbbell, incline, decline, machine>]
}
Base the calorie estimate on a 17-year-old, 80kg, 172cm person.`;

  const result = await callDeepSeekAPI(prompt);
  
  if (result) {
    try {
      return JSON.parse(result);
    } catch (error) {
      console.warn('Failed to parse DeepSeek exercise response:', error);
    }
  }
  
  return null;
}

// Calculate gym exercise calories using DeepSeek AI
export async function calculateDeepSeekGymCalories(
  exerciseName: string,
  muscleGroup: string,
  sets: number,
  reps: number,
  weight: number
): Promise<number | null> {
  const prompt = `Calculate calories burned for this gym exercise:
Exercise: ${exerciseName}
Muscle Group: ${muscleGroup}
Sets: ${sets}
Reps: ${reps}
Weight: ${weight}kg
User Profile: Age 17, Weight 80kg, Height 172cm

Return ONLY a JSON object with this exact structure:
{
  "caloriesBurned": <total calories burned as a number>
}`;

  const result = await callDeepSeekAPI(prompt);
  
  if (result) {
    try {
      const data = JSON.parse(result);
      return data.caloriesBurned;
    } catch (error) {
      console.warn('Failed to parse DeepSeek calories response:', error);
    }
  }
  
  return null;
}

// Calculate cardio calories using DeepSeek AI
export async function calculateDeepSeekCardioCalories(
  activityType: string,
  duration: number
): Promise<number | null> {
  const prompt = `Calculate calories burned for this cardio activity:
Activity: ${activityType}
Duration: ${duration} minutes
User Profile: Age 17, Weight 80kg, Height 172cm

Return ONLY a JSON object with this exact structure:
{
  "caloriesBurned": <total calories burned as a number>
}`;

  const result = await callDeepSeekAPI(prompt);
  
  if (result) {
    try {
      const data = JSON.parse(result);
      return data.caloriesBurned;
    } catch (error) {
      console.warn('Failed to parse DeepSeek cardio calories response:', error);
    }
  }
  
  return null;
}

// Fetch nutrition data from DeepSeek AI
export async function fetchDeepSeekNutritionData(
  foodName: string,
  quantity: number,
  brand?: string
): Promise<DeepSeekNutritionResponse | null> {
  const brandInfo = brand ? ` from brand "${brand}"` : '';
  const prompt = `Analyze nutrition for: ${quantity}g/ml of "${foodName}"${brandInfo}.
${brand ? 'This is an Indian brand product. Use accurate Indian brand nutrition data if available.' : ''}

Return ONLY a JSON object with this exact structure:
{
  "food": "${foodName}",
  ${brand ? `"brand": "${brand}",` : ''}
  "calories": <total calories as a number>,
  "protein": <total protein in grams as a number>,
  "sugar": <total sugar in grams as a number>
}

For Indian brands like Amul, Mother Dairy, Country Delight, Verka, Nandini, Aavin, Heritage, Milma, Dodla, use accurate brand-specific nutrition data.`;

  const result = await callDeepSeekAPI(prompt);
  
  if (result) {
    try {
      return JSON.parse(result);
    } catch (error) {
      console.warn('Failed to parse DeepSeek nutrition response:', error);
    }
  }
  
  return null;
}

// Get comprehensive exercise list from DeepSeek AI
export async function getDeepSeekExerciseList(muscleGroup: string): Promise<string[]> {
  const prompt = `List all common exercises for muscle group "${muscleGroup}".
Include all variations: barbell, dumbbell, incline, decline, machine, cable, bodyweight.

Return ONLY a JSON object with this exact structure:
{
  "exercises": [<array of exercise names as strings>]
}`;

  const result = await callDeepSeekAPI(prompt);
  
  if (result) {
    try {
      const data = JSON.parse(result);
      return data.exercises || [];
    } catch (error) {
      console.warn('Failed to parse DeepSeek exercise list:', error);
    }
  }
  
  return [];
}

// Export user profile for external use
export const USER_PROFILE = {
  age: USER_AGE,
  height: USER_HEIGHT,
  weight: USER_WEIGHT,
};

// Comprehensive exercise categories with all variations (fallback data)
export const EXERCISE_CATEGORIES = {
  Chest: [
    'Barbell Bench Press',
    'Dumbbell Bench Press',
    'Incline Barbell Press',
    'Incline Dumbbell Press',
    'Decline Barbell Press',
    'Decline Dumbbell Press',
    'Cable Fly',
    'Dumbbell Fly',
    'Incline Cable Fly',
    'Chest Dips',
    'Push-ups',
    'Machine Chest Press',
    'Pec Deck',
  ],
  Shoulders: [
    'Barbell Overhead Press',
    'Dumbbell Overhead Press',
    'Military Press',
    'Machine Shoulder Press',
    'Dumbbell Lateral Raise',
    'Cable Lateral Raise',
    'Rear Delt Fly',
    'Face Pulls',
    'Barbell Upright Row',
    'Dumbbell Upright Row',
    'Barbell Shrugs',
    'Dumbbell Shrugs',
    'Front Raise',
  ],
  Legs: [
    'Barbell Squat',
    'Front Squat',
    'Goblet Squat',
    'Machine Squat',
    'Leg Press',
    'Leg Curl',
    'Lying Leg Curl',
    'Seated Leg Curl',
    'Leg Extension',
    'Walking Lunges',
    'Dumbbell Lunges',
    'Barbell Lunges',
    'Bulgarian Split Squat',
    'Standing Calf Raise',
    'Seated Calf Raise',
    'Romanian Deadlift',
    'Stiff Leg Deadlift',
  ],
  Back: [
    'Pull-up',
    'Chin-up',
    'Lat Pulldown',
    'Wide Grip Lat Pulldown',
    'Close Grip Lat Pulldown',
    'Seated Row',
    'Cable Row',
    'Barbell Row',
    'Dumbbell Row',
    'One Arm Dumbbell Row',
    'Barbell Deadlift',
    'Sumo Deadlift',
    'T-Bar Row',
    'Hyperextension',
  ],
  Biceps: [
    'Barbell Curl',
    'EZ Bar Curl',
    'Dumbbell Curl',
    'Alternating Dumbbell Curl',
    'Hammer Curl',
    'Preacher Curl',
    'EZ Bar Preacher Curl',
    'Cable Curl',
    'Concentration Curl',
    'Incline Dumbbell Curl',
    'Spider Curl',
  ],
  Triceps: [
    'Tricep Dip',
    'Bench Dips',
    'Dumbbell Overhead Extension',
    'EZ Bar Overhead Extension',
    'Close Grip Bench Press',
    'Cable Pushdown',
    'Rope Pushdown',
    'Diamond Push-ups',
    'Skull Crushers',
    'Dumbbell Kickbacks',
  ],
  Core: [
    'Plank',
    'Side Plank',
    'Crunches',
    'Bicycle Crunches',
    'Russian Twist',
    'Mountain Climbers',
    'Leg Raises',
    'Hanging Leg Raises',
    'Sit-ups',
    'Ab Wheel',
    'Cable Crunches',
    'Dead Bug',
  ],
  Cardio: [
    'Running',
    'Jogging',
    'Cycling',
    'Elliptical',
    'Rowing',
    'Swimming',
    'Jump Rope',
    'Stair Climber',
    'Walking',
    'Treadmill',
  ],
};
