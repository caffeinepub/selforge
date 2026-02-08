import { fetchNutritionixData } from './nutritionix';
import { getIndianNutritionData } from './indianNutrition';
import { getMevsaNutritionData } from './mevsa';
import { fetchDeepSeekNutritionData } from './deepseek';

interface NutritionData {
  name: string;
  calories: number;
  protein: number;
  sugar: number;
  brand?: string;
  quantity: number;
  source?: string;
  nutritionSource: 'online' | 'web-search' | 'deepseek' | 'local';
}

/**
 * Fetch nutrition data with multi-tier fallback:
 * 1. Nutritionix API (if credentials available)
 * 2. Indian nutrition database
 * 3. Mevsa nutrition database
 * 4. DeepSeek AI estimation
 */
export async function fetchNutritionData(
  foodName: string,
  quantity: number
): Promise<NutritionData> {
  // Tier 1: Try Nutritionix API first
  try {
    const nutritionixData = await fetchNutritionixData(`${quantity}g ${foodName}`);
    if (nutritionixData) {
      return {
        name: nutritionixData.name,
        calories: nutritionixData.calories,
        protein: nutritionixData.protein,
        sugar: nutritionixData.sugar,
        brand: nutritionixData.brand,
        quantity: nutritionixData.quantity,
        source: 'Nutritionix',
        nutritionSource: 'online',
      };
    }
  } catch (error) {
    console.log('Nutritionix lookup failed, trying fallback');
  }

  // Tier 2: Try Indian nutrition database
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

  // Tier 3: Try Mevsa nutrition database
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

  // Tier 4: Use DeepSeek AI estimation as final fallback
  try {
    const aiData = await fetchDeepSeekNutritionData(foodName, quantity);
    if (aiData) {
      return {
        name: aiData.food,
        calories: aiData.calories,
        protein: aiData.protein,
        sugar: aiData.sugar,
        brand: aiData.brand,
        quantity,
        source: 'AI Estimate',
        nutritionSource: 'deepseek',
      };
    }
  } catch (error) {
    console.error('DeepSeek nutrition lookup failed:', error);
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

/**
 * Estimate nutrition using AI (wrapper for backward compatibility)
 */
export async function estimateNutritionWithAI(
  foodName: string,
  quantity: number
): Promise<NutritionData> {
  const aiData = await fetchDeepSeekNutritionData(foodName, quantity);
  if (aiData) {
    return {
      name: aiData.food,
      calories: aiData.calories,
      protein: aiData.protein,
      sugar: aiData.sugar,
      brand: aiData.brand,
      quantity,
      source: 'AI Estimate',
      nutritionSource: 'deepseek',
    };
  }

  // Fallback
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
