import { getIndianNutritionData } from './indianNutrition';
import { getMevsaNutritionData } from './mevsa';

interface NutritionData {
  name: string;
  calories: number;
  protein: number;
  sugar: number;
  brand?: string;
  quantity: number;
  source?: string;
  nutritionSource: 'local';
}

/**
 * Fetch nutrition data with local database fallback only
 */
export async function fetchNutritionData(
  foodName: string,
  quantity: number
): Promise<NutritionData> {
  // Try Indian nutrition database
  const indianData = getIndianNutritionData(foodName, quantity);
  if (indianData) {
    return {
      name: indianData.name,
      calories: indianData.calories,
      protein: indianData.protein,
      sugar: indianData.sugar,
      brand: indianData.brand,
      quantity: indianData.quantity,
      source: 'Indian DB',
      nutritionSource: 'local',
    };
  }

  // Try Mevsa nutrition database
  const mevsaData = getMevsaNutritionData(foodName, quantity);
  if (mevsaData) {
    return {
      name: mevsaData.name,
      calories: mevsaData.calories,
      protein: mevsaData.protein,
      sugar: mevsaData.sugar,
      brand: mevsaData.brand,
      quantity: mevsaData.quantity,
      source: 'Mevsa',
      nutritionSource: 'local',
    };
  }

  // Final fallback with basic estimation
  return {
    name: foodName,
    calories: Math.round(quantity * 1.5),
    protein: Math.round(quantity * 0.1),
    sugar: Math.round(quantity * 0.05),
    quantity,
    source: 'Fallback',
    nutritionSource: 'local',
  };
}
