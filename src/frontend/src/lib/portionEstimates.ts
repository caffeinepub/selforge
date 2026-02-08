// Portion-to-grams estimates for common units
// Used when the prompt unit is not already grams/ml

interface PortionEstimate {
  grams: number;
  description: string;
}

const DEFAULT_PORTIONS: Record<string, PortionEstimate> = {
  slice: { grams: 30, description: 'slice' },
  slices: { grams: 30, description: 'slice' },
  packet: { grams: 70, description: 'packet' },
  packets: { grams: 70, description: 'packet' },
  tablespoon: { grams: 15, description: 'tablespoon' },
  tablespoons: { grams: 15, description: 'tablespoon' },
  tbsp: { grams: 15, description: 'tablespoon' },
  teaspoon: { grams: 5, description: 'teaspoon' },
  teaspoons: { grams: 5, description: 'teaspoon' },
  tsp: { grams: 5, description: 'teaspoon' },
  cup: { grams: 240, description: 'cup' },
  cups: { grams: 240, description: 'cup' },
  serving: { grams: 100, description: 'serving' },
  servings: { grams: 100, description: 'serving' },
  piece: { grams: 150, description: 'piece' }, // Increased default for burger-like items
  pieces: { grams: 150, description: 'piece' },
};

// Food-specific overrides
const FOOD_SPECIFIC_PORTIONS: Record<string, Record<string, PortionEstimate>> = {
  cheese: {
    slice: { grams: 20, description: 'slice' },
    slices: { grams: 20, description: 'slice' },
    piece: { grams: 20, description: 'piece' },
    pieces: { grams: 20, description: 'piece' },
  },
  bread: {
    slice: { grams: 35, description: 'slice' },
    slices: { grams: 35, description: 'slice' },
    piece: { grams: 35, description: 'piece' },
    pieces: { grams: 35, description: 'piece' },
  },
  maggi: {
    packet: { grams: 70, description: 'packet' },
    packets: { grams: 70, description: 'packet' },
    piece: { grams: 70, description: 'packet' },
    pieces: { grams: 70, description: 'packet' },
  },
  egg: {
    piece: { grams: 50, description: 'egg' },
    pieces: { grams: 50, description: 'egg' },
  },
  eggs: {
    piece: { grams: 50, description: 'egg' },
    pieces: { grams: 50, description: 'egg' },
  },
  burger: {
    piece: { grams: 200, description: 'burger' },
    pieces: { grams: 200, description: 'burger' },
  },
  sandwich: {
    piece: { grams: 150, description: 'sandwich' },
    pieces: { grams: 150, description: 'sandwich' },
  },
  zinger: {
    piece: { grams: 200, description: 'burger' },
    pieces: { grams: 200, description: 'burger' },
  },
  pizza: {
    slice: { grams: 100, description: 'slice' },
    slices: { grams: 100, description: 'slice' },
    piece: { grams: 300, description: 'pizza' },
    pieces: { grams: 300, description: 'pizza' },
  },
  wrap: {
    piece: { grams: 180, description: 'wrap' },
    pieces: { grams: 180, description: 'wrap' },
  },
  roll: {
    piece: { grams: 120, description: 'roll' },
    pieces: { grams: 120, description: 'roll' },
  },
};

export function estimatePortionGrams(
  quantity: number,
  unit: string,
  foodName: string
): { grams: number; displayUnit: string } {
  const normalizedUnit = unit.toLowerCase().trim();
  const normalizedFood = foodName.toLowerCase().trim();

  // If already in grams or ml, return as-is
  if (normalizedUnit === 'g' || normalizedUnit === 'gram' || normalizedUnit === 'grams' || 
      normalizedUnit === 'ml' || normalizedUnit === 'milliliter' || normalizedUnit === 'milliliters') {
    return { grams: quantity, displayUnit: `${quantity}g` };
  }

  // Check food-specific portions first
  for (const [food, portions] of Object.entries(FOOD_SPECIFIC_PORTIONS)) {
    if (normalizedFood.includes(food)) {
      const portion = portions[normalizedUnit];
      if (portion) {
        return {
          grams: quantity * portion.grams,
          displayUnit: `${quantity} ${portion.description}${quantity > 1 ? 's' : ''}`,
        };
      }
    }
  }

  // Fall back to default portions
  const defaultPortion = DEFAULT_PORTIONS[normalizedUnit];
  if (defaultPortion) {
    return {
      grams: quantity * defaultPortion.grams,
      displayUnit: `${quantity} ${defaultPortion.description}${quantity > 1 ? 's' : ''}`,
    };
  }

  // If no unit match, assume pieces for restaurant items
  if (normalizedFood.includes('burger') || normalizedFood.includes('sandwich') || 
      normalizedFood.includes('zinger') || normalizedFood.includes('pizza') ||
      normalizedFood.includes('wrap') || normalizedFood.includes('roll')) {
    return { 
      grams: quantity * 200, // Default 200g per piece for restaurant items
      displayUnit: `${quantity} piece${quantity > 1 ? 's' : ''}` 
    };
  }

  // Default: assume the quantity is pieces with 150g each
  return { 
    grams: quantity * 150, 
    displayUnit: `${quantity} piece${quantity > 1 ? 's' : ''}` 
  };
}
