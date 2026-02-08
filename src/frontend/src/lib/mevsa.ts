// Mevsa nutrition and exercise database

interface NutritionData {
  name: string;
  calories: number;
  protein: number;
  sugar: number;
  brand?: string;
  quantity: number;
}

// Mevsa nutrition database
const MEVSA_NUTRITION_DB: Record<string, { caloriesPer100g: number; proteinPer100g: number; sugarPer100g: number }> = {
  // Common foods
  'egg': { caloriesPer100g: 155, proteinPer100g: 13, sugarPer100g: 1.1 },
  'chicken breast': { caloriesPer100g: 165, proteinPer100g: 31, sugarPer100g: 0 },
  'banana': { caloriesPer100g: 89, proteinPer100g: 1.1, sugarPer100g: 12.2 },
  'apple': { caloriesPer100g: 52, proteinPer100g: 0.3, sugarPer100g: 10.4 },
  'bread': { caloriesPer100g: 265, proteinPer100g: 9, sugarPer100g: 5 },
  'milk': { caloriesPer100g: 61, proteinPer100g: 3.2, sugarPer100g: 4.8 },
  'yogurt': { caloriesPer100g: 59, proteinPer100g: 3.5, sugarPer100g: 4.7 },
  'cheese': { caloriesPer100g: 402, proteinPer100g: 25, sugarPer100g: 1.3 },
  'potato': { caloriesPer100g: 77, proteinPer100g: 2, sugarPer100g: 0.8 },
  'tomato': { caloriesPer100g: 18, proteinPer100g: 0.9, sugarPer100g: 2.6 },
  'onion': { caloriesPer100g: 40, proteinPer100g: 1.1, sugarPer100g: 4.2 },
  'carrot': { caloriesPer100g: 41, proteinPer100g: 0.9, sugarPer100g: 4.7 },
  'broccoli': { caloriesPer100g: 34, proteinPer100g: 2.8, sugarPer100g: 1.7 },
  'spinach': { caloriesPer100g: 23, proteinPer100g: 2.9, sugarPer100g: 0.4 },
  'orange': { caloriesPer100g: 47, proteinPer100g: 0.9, sugarPer100g: 9.4 },
  'strawberry': { caloriesPer100g: 32, proteinPer100g: 0.7, sugarPer100g: 4.9 },
  'watermelon': { caloriesPer100g: 30, proteinPer100g: 0.6, sugarPer100g: 6.2 },
  'mango': { caloriesPer100g: 60, proteinPer100g: 0.8, sugarPer100g: 13.7 },
  'grapes': { caloriesPer100g: 69, proteinPer100g: 0.7, sugarPer100g: 16.3 },
  'peanut butter': { caloriesPer100g: 588, proteinPer100g: 25, sugarPer100g: 9 },
  'almond': { caloriesPer100g: 579, proteinPer100g: 21, sugarPer100g: 4.4 },
  'cashew': { caloriesPer100g: 553, proteinPer100g: 18, sugarPer100g: 5.9 },
  'walnut': { caloriesPer100g: 654, proteinPer100g: 15, sugarPer100g: 2.6 },
  'oats': { caloriesPer100g: 389, proteinPer100g: 17, sugarPer100g: 1 },
  'pasta': { caloriesPer100g: 131, proteinPer100g: 5, sugarPer100g: 0.6 },
  'pizza': { caloriesPer100g: 266, proteinPer100g: 11, sugarPer100g: 3.6 },
  'burger': { caloriesPer100g: 295, proteinPer100g: 17, sugarPer100g: 7 },
  'sandwich': { caloriesPer100g: 250, proteinPer100g: 10, sugarPer100g: 5 },
  'mayonnaise': { caloriesPer100g: 680, proteinPer100g: 1, sugarPer100g: 0.6 },
  'ketchup': { caloriesPer100g: 112, proteinPer100g: 1.2, sugarPer100g: 22.8 },
};

/**
 * Get nutrition data from Mevsa database
 */
export function getMevsaNutritionData(foodName: string, quantity: number): NutritionData | null {
  const normalizedName = foodName.toLowerCase().trim();
  
  // Try exact match first
  if (MEVSA_NUTRITION_DB[normalizedName]) {
    const data = MEVSA_NUTRITION_DB[normalizedName];
    return {
      name: foodName,
      calories: Math.round((data.caloriesPer100g * quantity) / 100),
      protein: Math.round((data.proteinPer100g * quantity) / 100 * 10) / 10,
      sugar: Math.round((data.sugarPer100g * quantity) / 100 * 10) / 10,
      quantity,
    };
  }
  
  // Try partial match
  for (const [key, data] of Object.entries(MEVSA_NUTRITION_DB)) {
    if (normalizedName.includes(key) || key.includes(normalizedName)) {
      return {
        name: foodName,
        calories: Math.round((data.caloriesPer100g * quantity) / 100),
        protein: Math.round((data.proteinPer100g * quantity) / 100 * 10) / 10,
        sugar: Math.round((data.sugarPer100g * quantity) / 100 * 10) / 10,
        quantity,
      };
    }
  }
  
  return null;
}

// Mevsa exercise database
export const MEVSA_EXERCISES = {
  chest: [
    'bench press',
    'incline bench press',
    'decline bench press',
    'dumbbell press',
    'incline dumbbell press',
    'chest fly',
    'cable fly',
    'push-ups',
  ],
  back: [
    'deadlift',
    'lat pulldown',
    'barbell row',
    'dumbbell row',
    'pull-ups',
    'chin-ups',
    'cable row',
    'face pulls',
  ],
  legs: [
    'squat',
    'leg press',
    'lunges',
    'leg curl',
    'leg extension',
    'calf raises',
    'romanian deadlift',
    'front squat',
  ],
  shoulders: [
    'shoulder press',
    'lateral raise',
    'front raise',
    'rear delt fly',
    'arnold press',
    'upright row',
    'shrugs',
  ],
  arms: [
    'bicep curl',
    'tricep extension',
    'hammer curl',
    'tricep dips',
    'preacher curl',
    'skull crushers',
    'concentration curl',
  ],
  core: [
    'crunches',
    'planks',
    'russian twists',
    'leg raises',
    'bicycle crunches',
    'mountain climbers',
    'ab wheel',
  ],
};
