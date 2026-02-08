import { getCaloriesBurnedApiKey } from './caloriesBurnedKey';

/**
 * Call external Calories Burned API for exercise calorie calculations.
 * Returns null if API is unavailable or request fails.
 */
export async function fetchCaloriesBurnedFromApi(
  activityType: string,
  durationMinutes: number,
  weight: number = 80
): Promise<number | null> {
  const apiKey = getCaloriesBurnedApiKey();
  
  if (!apiKey) {
    return null;
  }

  try {
    // Example API endpoint - adjust based on actual API documentation
    const baseUrl = import.meta.env.VITE_CALORIES_BURNED_API_URL || 'https://api.api-ninjas.com/v1/caloriesburned';
    
    const response = await fetch(
      `${baseUrl}?activity=${encodeURIComponent(activityType)}&duration=${durationMinutes}&weight=${weight}`,
      {
        headers: {
          'X-Api-Key': apiKey,
        },
      }
    );

    if (!response.ok) {
      console.warn('Calories Burned API request failed:', response.status);
      return null;
    }

    const data = await response.json();
    
    // Adjust based on actual API response structure
    if (Array.isArray(data) && data.length > 0 && data[0].total_calories) {
      return Math.round(data[0].total_calories);
    }
    
    return null;
  } catch (error) {
    console.warn('Calories Burned API error:', error);
    return null;
  }
}
