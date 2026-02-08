import { fetchDeepSeekNutritionData } from './deepseek';
import { fetchOnlineNutrition, type OnlineNutritionResult } from './onlineNutrition';

// Local nutrition database (fallback)
const nutritionDB: Record<string, { calories: number; protein: number; sugar: number }> = {
  // Eggs
  'egg': { calories: 155, protein: 13, sugar: 1.1 },
  'eggs': { calories: 155, protein: 13, sugar: 1.1 },
  'boiled egg': { calories: 155, protein: 13, sugar: 1.1 },
  
  // Bread
  'bread': { calories: 265, protein: 9, sugar: 5 },
  'toast': { calories: 265, protein: 9, sugar: 5 },
  'whole wheat bread': { calories: 247, protein: 13, sugar: 4 },
  
  // Dairy
  'milk': { calories: 42, protein: 3.4, sugar: 5 },
  'cheese': { calories: 402, protein: 25, sugar: 1.3 },
  'paneer': { calories: 265, protein: 18, sugar: 1.2 },
  'yogurt': { calories: 59, protein: 10, sugar: 3.2 },
  'curd': { calories: 98, protein: 11, sugar: 3 },
  
  // Indian staples
  'rice': { calories: 130, protein: 2.7, sugar: 0.1 },
  'roti': { calories: 297, protein: 11, sugar: 2.7 },
  'chapati': { calories: 297, protein: 11, sugar: 2.7 },
  'dal': { calories: 116, protein: 9, sugar: 2 },
  
  // Instant noodles
  'maggi': { calories: 313, protein: 7, sugar: 2 },
  'noodles': { calories: 138, protein: 4.5, sugar: 0.6 },
  
  // Condiments
  'mayonnaise': { calories: 680, protein: 1, sugar: 0.6 },
  'mayo': { calories: 680, protein: 1, sugar: 0.6 },
  'butter': { calories: 717, protein: 0.9, sugar: 0.1 },
  
  // Fruits
  'banana': { calories: 89, protein: 1.1, sugar: 12 },
  'apple': { calories: 52, protein: 0.3, sugar: 10 },
  'orange': { calories: 47, protein: 0.9, sugar: 9 },
  'mango': { calories: 60, protein: 0.8, sugar: 14 },
  
  // Vegetables
  'potato': { calories: 77, protein: 2, sugar: 0.8 },
  'tomato': { calories: 18, protein: 0.9, sugar: 2.6 },
  'onion': { calories: 40, protein: 1.1, sugar: 4.2 },
  
  // Meat
  'chicken': { calories: 239, protein: 27, sugar: 0 },
  'chicken breast': { calories: 165, protein: 31, sugar: 0 },
};

export interface NutritionData {
  calories: number;
  protein: number;
  sugar: number;
  nutritionSource: 'online' | 'deepseek' | 'local';
}

export async function fetchNutritionData(
  foodName: string,
  quantityGrams: number
): Promise<NutritionData> {
  // Try online lookup first (Open Food Facts)
  const onlineResult = await fetchOnlineNutrition(foodName, quantityGrams);
  if (onlineResult.source === 'online' && onlineResult.calories) {
    return {
      calories: onlineResult.calories,
      protein: onlineResult.protein || 0,
      sugar: onlineResult.sugar || 0,
      nutritionSource: 'online',
    };
  }

  // Try DeepSeek AI if available
  const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY || '';
  if (DEEPSEEK_API_KEY) {
    try {
      const deepseekResult = await fetchDeepSeekNutritionData(foodName, quantityGrams);
      if (deepseekResult) {
        return {
          calories: deepseekResult.calories,
          protein: deepseekResult.protein,
          sugar: deepseekResult.sugar,
          nutritionSource: 'deepseek',
        };
      }
    } catch (error) {
      console.warn('DeepSeek nutrition lookup failed:', error);
    }
  }

  // Fall back to local database
  const normalizedName = foodName.toLowerCase().trim();
  const dbEntry = nutritionDB[normalizedName];

  if (dbEntry) {
    const scaleFactor = quantityGrams / 100;
    return {
      calories: Math.round(dbEntry.calories * scaleFactor),
      protein: Math.round(dbEntry.protein * scaleFactor * 10) / 10,
      sugar: Math.round(dbEntry.sugar * scaleFactor * 10) / 10,
      nutritionSource: 'local',
    };
  }

  // Default fallback
  return {
    calories: Math.round(quantityGrams * 2),
    protein: Math.round(quantityGrams * 0.1),
    sugar: Math.round(quantityGrams * 0.05),
    nutritionSource: 'local',
  };
}
