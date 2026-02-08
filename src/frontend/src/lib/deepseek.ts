// DeepSeek AI API integration for Selforge
// Unified smart data backend for exercise and nutrition details

import { getRuntimeApiKey } from './apiKey';

// DeepSeek API configuration
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

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
  const apiKey = getRuntimeApiKey();
  
  if (!apiKey) {
    console.warn('DeepSeek API key not configured. Using fallback calculations.');
    return null;
  }

  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
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
  quantityGrams: number
): Promise<DeepSeekNutritionResponse | null> {
  const prompt = `Provide nutrition information for this food:
Food: ${foodName}
Quantity: ${quantityGrams}g

Return ONLY a JSON object with this exact structure:
{
  "food": "${foodName}",
  "brand": "<brand name if commonly known, otherwise omit>",
  "calories": <total calories as a number>,
  "protein": <total protein in grams as a number>,
  "sugar": <total sugar in grams as a number>
}`;

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

// Fallback exercise categories for when AI is unavailable
export const FALLBACK_EXERCISES = {
  chest: ['bench press', 'incline press', 'decline press', 'chest fly', 'push-ups'],
  back: ['deadlift', 'lat pulldown', 'barbell row', 'dumbbell row', 'pull-ups'],
  legs: ['squat', 'leg press', 'lunges', 'leg curl', 'leg extension'],
  shoulders: ['shoulder press', 'lateral raise', 'front raise', 'rear delt fly'],
  arms: ['bicep curl', 'tricep extension', 'hammer curl', 'tricep dips'],
  core: ['crunches', 'planks', 'russian twists', 'leg raises'],
};
