import { useAppStore } from './store';

interface NutritionixResponse {
  foods: Array<{
    food_name: string;
    serving_qty: number;
    serving_unit: string;
    serving_weight_grams: number;
    nf_calories: number;
    nf_protein: number;
    nf_sugars: number;
    brand_name?: string;
  }>;
}

interface NutritionData {
  name: string;
  calories: number;
  protein: number;
  sugar: number;
  brand?: string;
  quantity: number;
}

/**
 * Fetch nutrition data from Nutritionix API
 */
export async function fetchNutritionixData(query: string): Promise<NutritionData | null> {
  const appId = useAppStore.getState().nutritionixAppId;
  const appKey = useAppStore.getState().nutritionixAppKey;

  // Check if credentials are available
  if (!appId || !appKey) {
    console.log('Nutritionix credentials not available');
    return null;
  }

  // Fallback to env vars if store is empty
  const finalAppId = appId || import.meta.env.VITE_NUTRITIONIX_APP_ID;
  const finalAppKey = appKey || import.meta.env.VITE_NUTRITIONIX_APP_KEY;

  if (!finalAppId || !finalAppKey) {
    return null;
  }

  try {
    const response = await fetch('https://trackapi.nutritionix.com/v2/natural/nutrients', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-app-id': finalAppId,
        'x-app-key': finalAppKey,
      },
      body: JSON.stringify({
        query: query,
      }),
    });

    if (!response.ok) {
      console.error('Nutritionix API error:', response.status);
      return null;
    }

    const data: NutritionixResponse = await response.json();

    if (!data.foods || data.foods.length === 0) {
      return null;
    }

    // Use the first food item
    const food = data.foods[0];

    return {
      name: food.food_name,
      calories: Math.round(food.nf_calories),
      protein: Math.round(food.nf_protein * 10) / 10,
      sugar: Math.round(food.nf_sugars * 10) / 10,
      brand: food.brand_name,
      quantity: Math.round(food.serving_weight_grams),
    };
  } catch (error) {
    console.error('Error fetching from Nutritionix:', error);
    return null;
  }
}
