// Indian nutrition database for common Indian food products and brands

interface NutritionData {
  name: string;
  calories: number;
  protein: number;
  sugar: number;
  brand?: string;
  quantity: number;
}

// Indian brand nutrition database
const INDIAN_NUTRITION_DB: Record<string, { caloriesPer100g: number; proteinPer100g: number; sugarPer100g: number; brand?: string }> = {
  // Dairy products
  'amul milk': { caloriesPer100g: 60, proteinPer100g: 3.2, sugarPer100g: 4.8, brand: 'Amul' },
  'mother dairy milk': { caloriesPer100g: 62, proteinPer100g: 3.3, sugarPer100g: 4.9, brand: 'Mother Dairy' },
  'amul butter': { caloriesPer100g: 717, proteinPer100g: 0.5, sugarPer100g: 0.5, brand: 'Amul' },
  'amul cheese': { caloriesPer100g: 348, proteinPer100g: 25, sugarPer100g: 2.2, brand: 'Amul' },
  'paneer': { caloriesPer100g: 265, proteinPer100g: 18, sugarPer100g: 1.2 },
  
  // Common Indian foods
  'roti': { caloriesPer100g: 297, proteinPer100g: 11, sugarPer100g: 1.5 },
  'chapati': { caloriesPer100g: 297, proteinPer100g: 11, sugarPer100g: 1.5 },
  'naan': { caloriesPer100g: 310, proteinPer100g: 9, sugarPer100g: 5 },
  'paratha': { caloriesPer100g: 320, proteinPer100g: 6, sugarPer100g: 2 },
  'dal': { caloriesPer100g: 116, proteinPer100g: 9, sugarPer100g: 1 },
  'rice': { caloriesPer100g: 130, proteinPer100g: 2.7, sugarPer100g: 0.1 },
  'biryani': { caloriesPer100g: 170, proteinPer100g: 6, sugarPer100g: 2 },
  'samosa': { caloriesPer100g: 262, proteinPer100g: 5, sugarPer100g: 3 },
  'pakora': { caloriesPer100g: 250, proteinPer100g: 6, sugarPer100g: 2 },
  'idli': { caloriesPer100g: 156, proteinPer100g: 4, sugarPer100g: 1 },
  'dosa': { caloriesPer100g: 168, proteinPer100g: 4, sugarPer100g: 1.5 },
  'vada': { caloriesPer100g: 230, proteinPer100g: 5, sugarPer100g: 2 },
  'upma': { caloriesPer100g: 150, proteinPer100g: 4, sugarPer100g: 1 },
  'poha': { caloriesPer100g: 130, proteinPer100g: 3, sugarPer100g: 1 },
  
  // Snacks
  'maggi': { caloriesPer100g: 400, proteinPer100g: 10, sugarPer100g: 3, brand: 'Maggi' },
  'parle-g': { caloriesPer100g: 462, proteinPer100g: 7, sugarPer100g: 25, brand: 'Parle' },
};

/**
 * Get nutrition data from Indian nutrition database
 */
export function getIndianNutritionData(foodName: string, quantity: number): NutritionData | null {
  const normalizedName = foodName.toLowerCase().trim();
  
  // Try exact match first
  if (INDIAN_NUTRITION_DB[normalizedName]) {
    const data = INDIAN_NUTRITION_DB[normalizedName];
    return {
      name: foodName,
      calories: Math.round((data.caloriesPer100g * quantity) / 100),
      protein: Math.round((data.proteinPer100g * quantity) / 100 * 10) / 10,
      sugar: Math.round((data.sugarPer100g * quantity) / 100 * 10) / 10,
      brand: data.brand,
      quantity,
    };
  }
  
  // Try partial match
  for (const [key, data] of Object.entries(INDIAN_NUTRITION_DB)) {
    if (normalizedName.includes(key) || key.includes(normalizedName)) {
      return {
        name: foodName,
        calories: Math.round((data.caloriesPer100g * quantity) / 100),
        protein: Math.round((data.proteinPer100g * quantity) / 100 * 10) / 10,
        sugar: Math.round((data.sugarPer100g * quantity) / 100 * 10) / 10,
        brand: data.brand,
        quantity,
      };
    }
  }
  
  return null;
}
