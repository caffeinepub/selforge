import { parseMealPrompt, MealParseResult, ParsedFoodItem } from './mealPromptParser';
import { estimatePortionGrams } from './portionEstimates';
import { fetchNutritionData } from './nutrition';

interface ParsedEntry {
  food: string;
  quantity: number;
  unit: string;
}

interface EnrichedEntry {
  name: string;
  quantity: number;
  displayQuantity: string;
  calories: number;
  protein: number;
  sugar: number;
  nutritionSource: 'local';
}

/**
 * Parse a description string into structured entries using local heuristics only
 */
export function parseDescription(description: string): ParsedEntry[] {
  // Use local meal prompt parser
  const result: MealParseResult = parseMealPrompt(description);
  
  // Convert ParsedFoodItem[] to ParsedEntry[]
  return result.items.map((item: ParsedFoodItem) => ({
    food: item.name,
    quantity: item.quantity,
    unit: 'g', // Already converted to grams by parser
  }));
}

/**
 * Enrich a parsed entry with nutrition data using local databases only
 */
export async function enrichParsedEntry(entry: ParsedEntry): Promise<EnrichedEntry> {
  // Convert portion to grams if needed
  let quantityInGrams = entry.quantity;
  
  if (entry.unit !== 'g' && entry.unit !== 'gram' && entry.unit !== 'grams') {
    const result = estimatePortionGrams(entry.quantity, entry.unit, entry.food);
    quantityInGrams = result.grams;
  }
  
  // Fetch nutrition data from local databases
  const nutritionData = await fetchNutritionData(entry.food, quantityInGrams);
  
  return {
    name: nutritionData.name,
    quantity: nutritionData.quantity,
    displayQuantity: `${entry.quantity} ${entry.unit}`,
    calories: nutritionData.calories,
    protein: nutritionData.protein,
    sugar: nutritionData.sugar,
    nutritionSource: 'local',
  };
}
