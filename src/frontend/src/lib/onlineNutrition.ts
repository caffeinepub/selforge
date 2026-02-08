// Online nutrition lookup using public APIs (Open Food Facts)

export interface OnlineNutritionResult {
  calories?: number;
  protein?: number;
  sugar?: number;
  source: 'online' | 'not-found';
  productName?: string;
}

export async function fetchOnlineNutrition(
  foodName: string,
  quantityGrams: number
): Promise<OnlineNutritionResult> {
  try {
    // Search Open Food Facts for the product
    const searchUrl = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(
      foodName
    )}&search_simple=1&json=1&page_size=5`;

    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'SelfImprovementApp/1.0',
      },
    });

    if (!response.ok) {
      return { source: 'not-found' };
    }

    const data = await response.json();

    if (!data.products || data.products.length === 0) {
      return { source: 'not-found' };
    }

    // Get the first product match
    const product = data.products[0];
    const nutriments = product.nutriments || {};

    // Extract nutrition per 100g
    const caloriesPer100g = nutriments['energy-kcal_100g'] || nutriments['energy-kcal'] || 0;
    const proteinPer100g = nutriments['proteins_100g'] || nutriments['proteins'] || 0;
    const sugarPer100g = nutriments['sugars_100g'] || nutriments['sugars'] || 0;

    // Scale to actual quantity
    const scaleFactor = quantityGrams / 100;

    return {
      calories: Math.round(caloriesPer100g * scaleFactor),
      protein: Math.round(proteinPer100g * scaleFactor * 10) / 10,
      sugar: Math.round(sugarPer100g * scaleFactor * 10) / 10,
      source: 'online',
      productName: product.product_name || foodName,
    };
  } catch (error) {
    console.warn('Online nutrition lookup failed:', error);
    return { source: 'not-found' };
  }
}
