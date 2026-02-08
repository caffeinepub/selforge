// Multi-item meal prompt parser
// Extracts multiple food items from a single prompt

import { estimatePortionGrams } from './portionEstimates';

export interface ParsedFoodItem {
  name: string;
  quantity: number; // in grams
  displayQuantity: string; // original unit display (e.g., "2 slices")
  originalText: string;
}

export interface MealParseResult {
  items: ParsedFoodItem[];
  rawText: string;
}

// Common food keywords to help identify food items
const FOOD_KEYWORDS = [
  'egg', 'eggs', 'bread', 'toast', 'rice', 'chicken', 'milk', 'cheese', 'paneer',
  'maggi', 'noodles', 'pasta', 'roti', 'chapati', 'dal', 'curry', 'sabzi',
  'mayonnaise', 'mayo', 'butter', 'oil', 'yogurt', 'curd', 'banana', 'apple',
  'orange', 'mango', 'potato', 'tomato', 'onion', 'garlic', 'ginger',
];

// Common quantity units
const UNIT_PATTERNS = [
  'slice', 'slices', 'packet', 'packets', 'piece', 'pieces',
  'tablespoon', 'tablespoons', 'tbsp', 'teaspoon', 'teaspoons', 'tsp',
  'cup', 'cups', 'serving', 'servings',
  'g', 'gram', 'grams', 'ml', 'milliliter', 'milliliters',
];

export function parseMealPrompt(text: string): MealParseResult {
  const items: ParsedFoodItem[] = [];
  const normalizedText = text.toLowerCase();

  // Try to extract multiple items using pattern matching
  // Pattern: [number] [unit?] [food name]
  // Examples: "2 cheese slice", "10 gram mayonnaise", "2 maggi"
  
  const words = normalizedText.split(/\s+/);
  let i = 0;

  while (i < words.length) {
    // Look for a number
    const numMatch = words[i].match(/^(\d+(?:\.\d+)?)/);
    if (numMatch) {
      const quantity = parseFloat(numMatch[1]);
      i++;

      if (i >= words.length) break;

      // Check if next word is a unit
      let unit = '';
      let unitIndex = i;
      for (const pattern of UNIT_PATTERNS) {
        if (words[i] === pattern || words[i] === pattern + 's' || words[i] === pattern.slice(0, -1)) {
          unit = words[i];
          i++;
          break;
        }
      }

      if (i >= words.length) break;

      // Next word(s) should be the food name
      let foodName = '';
      let foodWords: string[] = [];
      
      // Collect words until we hit another number or end
      while (i < words.length && !words[i].match(/^\d+/)) {
        foodWords.push(words[i]);
        i++;
        
        // Check if we've found a food keyword
        const currentFood = foodWords.join(' ');
        let foundFood = false;
        for (const keyword of FOOD_KEYWORDS) {
          if (currentFood.includes(keyword)) {
            foodName = currentFood;
            foundFood = true;
            break;
          }
        }
        
        if (foundFood) break;
        
        // Limit to 3 words for food name
        if (foodWords.length >= 3) break;
      }

      if (foodWords.length === 0) continue;
      
      foodName = foodWords.join(' ').trim();
      
      // Estimate grams based on unit
      const { grams, displayUnit } = estimatePortionGrams(
        quantity,
        unit || 'piece',
        foodName
      );

      items.push({
        name: foodName,
        quantity: grams,
        displayQuantity: displayUnit,
        originalText: `${quantity}${unit ? ' ' + unit : ''} ${foodName}`,
      });
    } else {
      i++;
    }
  }

  // If no items found, try a simpler approach: look for food keywords
  if (items.length === 0) {
    for (const keyword of FOOD_KEYWORDS) {
      if (normalizedText.includes(keyword)) {
        // Extract quantity if present
        const beforeKeyword = normalizedText.split(keyword)[0];
        const numMatch = beforeKeyword.match(/(\d+(?:\.\d+)?)\s*(\w+)?\s*$/);
        
        if (numMatch) {
          const quantity = parseFloat(numMatch[1]);
          const unit = numMatch[2] || 'piece';
          const { grams, displayUnit } = estimatePortionGrams(quantity, unit, keyword);
          
          items.push({
            name: keyword,
            quantity: grams,
            displayQuantity: displayUnit,
            originalText: `${quantity} ${unit} ${keyword}`,
          });
        } else {
          // Default to 100g
          items.push({
            name: keyword,
            quantity: 100,
            displayQuantity: '100g',
            originalText: keyword,
          });
        }
      }
    }
  }

  return {
    items,
    rawText: text,
  };
}
