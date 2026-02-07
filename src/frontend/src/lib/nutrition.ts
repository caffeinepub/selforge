import { fetchDeepSeekNutritionData } from './deepseek';

// Nutrition database with common foods (per 100g) - used as final fallback
const NUTRITION_DB: Record<string, { calories: number; protein: number; sugar: number }> = {
  // Proteins
  'chicken breast': { calories: 165, protein: 31, sugar: 0 },
  'chicken': { calories: 165, protein: 31, sugar: 0 },
  'beef': { calories: 250, protein: 26, sugar: 0 },
  'pork': { calories: 242, protein: 27, sugar: 0 },
  'fish': { calories: 206, protein: 22, sugar: 0 },
  'salmon': { calories: 208, protein: 20, sugar: 0 },
  'tuna': { calories: 132, protein: 28, sugar: 0 },
  'egg': { calories: 155, protein: 13, sugar: 1.1 },
  'eggs': { calories: 155, protein: 13, sugar: 1.1 },
  'tofu': { calories: 76, protein: 8, sugar: 0.6 },

  // Carbs
  'rice': { calories: 130, protein: 2.7, sugar: 0.1 },
  'white rice': { calories: 130, protein: 2.7, sugar: 0.1 },
  'brown rice': { calories: 111, protein: 2.6, sugar: 0.4 },
  'pasta': { calories: 131, protein: 5, sugar: 0.6 },
  'bread': { calories: 265, protein: 9, sugar: 5 },
  'white bread': { calories: 265, protein: 9, sugar: 5 },
  'whole wheat bread': { calories: 247, protein: 13, sugar: 6 },
  'oats': { calories: 389, protein: 17, sugar: 1 },
  'potato': { calories: 77, protein: 2, sugar: 0.8 },
  'sweet potato': { calories: 86, protein: 1.6, sugar: 4.2 },

  // Fruits
  'apple': { calories: 52, protein: 0.3, sugar: 10.4 },
  'banana': { calories: 89, protein: 1.1, sugar: 12.2 },
  'orange': { calories: 47, protein: 0.9, sugar: 9.4 },
  'strawberry': { calories: 32, protein: 0.7, sugar: 4.9 },
  'strawberries': { calories: 32, protein: 0.7, sugar: 4.9 },
  'grapes': { calories: 69, protein: 0.7, sugar: 15.5 },
  'watermelon': { calories: 30, protein: 0.6, sugar: 6.2 },
  'mango': { calories: 60, protein: 0.8, sugar: 13.7 },

  // Vegetables
  'broccoli': { calories: 34, protein: 2.8, sugar: 1.7 },
  'spinach': { calories: 23, protein: 2.9, sugar: 0.4 },
  'carrot': { calories: 41, protein: 0.9, sugar: 4.7 },
  'carrots': { calories: 41, protein: 0.9, sugar: 4.7 },
  'tomato': { calories: 18, protein: 0.9, sugar: 2.6 },
  'tomatoes': { calories: 18, protein: 0.9, sugar: 2.6 },
  'lettuce': { calories: 15, protein: 1.4, sugar: 0.8 },
  'cucumber': { calories: 16, protein: 0.7, sugar: 1.7 },

  // Dairy
  'milk': { calories: 61, protein: 3.2, sugar: 5.1 },
  'whole milk': { calories: 61, protein: 3.2, sugar: 5.1 },
  'skim milk': { calories: 34, protein: 3.4, sugar: 5 },
  'yogurt': { calories: 59, protein: 10, sugar: 3.2 },
  'greek yogurt': { calories: 59, protein: 10, sugar: 3.2 },
  'cheese': { calories: 402, protein: 25, sugar: 1.3 },
  'cheddar cheese': { calories: 402, protein: 25, sugar: 1.3 },
  'paneer': { calories: 312, protein: 18, sugar: 2 },

  // Snacks & Others
  'peanut butter': { calories: 588, protein: 25, sugar: 9 },
  'almonds': { calories: 579, protein: 21, sugar: 4.4 },
  'walnuts': { calories: 654, protein: 15, sugar: 2.6 },
  'chocolate': { calories: 546, protein: 5, sugar: 48 },
  'dark chocolate': { calories: 546, protein: 5, sugar: 24 },
  'honey': { calories: 304, protein: 0.3, sugar: 82 },
  'olive oil': { calories: 884, protein: 0, sugar: 0 },
  'butter': { calories: 717, protein: 0.9, sugar: 0.1 },
  'ghee': { calories: 897, protein: 0, sugar: 0 },
};

// Fetch nutrition data from local database (fallback)
function fetchFromLocalDatabase(
  foodName: string,
  quantity: number
): { calories: number; protein: number; sugar: number } {
  const normalizedName = foodName.toLowerCase().trim();
  const dbEntry = NUTRITION_DB[normalizedName];
  
  if (dbEntry) {
    const multiplier = quantity / 100;
    return {
      calories: Math.round(dbEntry.calories * multiplier),
      protein: Math.round(dbEntry.protein * multiplier * 10) / 10,
      sugar: Math.round(dbEntry.sugar * multiplier * 10) / 10,
    };
  }

  // If not found in database, return estimated values
  const multiplier = quantity / 100;
  const estimatedNutrition = estimateFoodNutrition(normalizedName);
  
  return {
    calories: Math.round(estimatedNutrition.calories * multiplier),
    protein: Math.round(estimatedNutrition.protein * multiplier * 10) / 10,
    sugar: Math.round(estimatedNutrition.sugar * multiplier * 10) / 10,
  };
}

function estimateFoodNutrition(foodName: string): { calories: number; protein: number; sugar: number } {
  // Simple heuristic-based estimation
  const name = foodName.toLowerCase();

  // Check for keywords to categorize
  if (name.includes('chicken') || name.includes('meat') || name.includes('beef') || name.includes('pork')) {
    return { calories: 200, protein: 25, sugar: 0 };
  }
  if (name.includes('fish') || name.includes('salmon') || name.includes('tuna')) {
    return { calories: 180, protein: 22, sugar: 0 };
  }
  if (name.includes('rice') || name.includes('pasta') || name.includes('noodle')) {
    return { calories: 130, protein: 3, sugar: 0.5 };
  }
  if (name.includes('bread') || name.includes('toast')) {
    return { calories: 250, protein: 8, sugar: 5 };
  }
  if (name.includes('fruit') || name.includes('berry') || name.includes('melon')) {
    return { calories: 50, protein: 0.5, sugar: 10 };
  }
  if (name.includes('vegetable') || name.includes('salad') || name.includes('greens')) {
    return { calories: 25, protein: 2, sugar: 2 };
  }
  if (name.includes('milk') || name.includes('yogurt') || name.includes('dairy') || name.includes('dahi') || name.includes('curd')) {
    return { calories: 60, protein: 3.5, sugar: 5 };
  }
  if (name.includes('cheese') || name.includes('paneer')) {
    return { calories: 350, protein: 22, sugar: 1 };
  }
  if (name.includes('oil') || name.includes('butter') || name.includes('ghee') || name.includes('fat')) {
    return { calories: 800, protein: 0, sugar: 0 };
  }
  if (name.includes('sugar') || name.includes('candy') || name.includes('sweet')) {
    return { calories: 400, protein: 0, sugar: 90 };
  }

  // Default fallback
  return { calories: 150, protein: 5, sugar: 5 };
}

// Main function to fetch nutrition data using DeepSeek AI with fallback
export async function fetchNutritionData(
  foodName: string,
  quantity: number,
  brand?: string
): Promise<{ calories: number; protein: number; sugar: number }> {
  // Try DeepSeek AI first
  const deepseekResult = await fetchDeepSeekNutritionData(foodName, quantity, brand);
  
  if (deepseekResult) {
    return {
      calories: deepseekResult.calories,
      protein: deepseekResult.protein,
      sugar: deepseekResult.sugar,
    };
  }

  // Fallback to local database
  return fetchFromLocalDatabase(foodName, quantity);
}
