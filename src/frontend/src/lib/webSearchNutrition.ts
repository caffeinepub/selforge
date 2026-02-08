// Web-search-based nutrition lookup using Google Custom Search API
// Extracts nutrition data from search result snippets

export interface WebSearchNutritionResult {
  calories?: number;
  protein?: number;
  sugar?: number;
  confidence: 'high' | 'medium' | 'low' | 'none';
  source: 'web-search' | 'not-found';
}

// Parse nutrition values from text snippets
function parseNutritionFromText(text: string): {
  calories?: number;
  protein?: number;
  sugar?: number;
  confidence: 'high' | 'medium' | 'low' | 'none';
} {
  const normalizedText = text.toLowerCase();
  
  let calories: number | undefined;
  let protein: number | undefined;
  let sugar: number | undefined;
  let foundCount = 0;

  // Parse calories (kcal, calories, cal)
  const caloriePatterns = [
    /(\d+)\s*(?:kcal|calories|cal)(?:\s|,|\.|\))/i,
    /(?:calories|kcal|cal)[\s:]+(\d+)/i,
    /(\d+)\s*(?:kcal|calories|cal)$/i,
  ];
  
  for (const pattern of caloriePatterns) {
    const match = text.match(pattern);
    if (match) {
      const value = parseInt(match[1]);
      if (value > 0 && value < 10000) {
        calories = value;
        foundCount++;
        break;
      }
    }
  }

  // Parse protein (g, grams, gram)
  const proteinPatterns = [
    /(\d+(?:\.\d+)?)\s*g?\s*protein/i,
    /protein[\s:]+(\d+(?:\.\d+)?)\s*g/i,
    /(\d+(?:\.\d+)?)\s*g\s*of\s*protein/i,
  ];
  
  for (const pattern of proteinPatterns) {
    const match = text.match(pattern);
    if (match) {
      const value = parseFloat(match[1]);
      if (value >= 0 && value < 500) {
        protein = value;
        foundCount++;
        break;
      }
    }
  }

  // Parse sugar (g, grams, gram)
  const sugarPatterns = [
    /(\d+(?:\.\d+)?)\s*g?\s*sugar/i,
    /sugar[\s:]+(\d+(?:\.\d+)?)\s*g/i,
    /(\d+(?:\.\d+)?)\s*g\s*of\s*sugar/i,
  ];
  
  for (const pattern of sugarPatterns) {
    const match = text.match(pattern);
    if (match) {
      const value = parseFloat(match[1]);
      if (value >= 0 && value < 500) {
        sugar = value;
        foundCount++;
        break;
      }
    }
  }

  // Determine confidence based on what we found
  let confidence: 'high' | 'medium' | 'low' | 'none' = 'none';
  if (foundCount >= 2 && calories) {
    confidence = 'high';
  } else if (foundCount >= 1 && calories) {
    confidence = 'medium';
  } else if (foundCount >= 1) {
    confidence = 'low';
  }

  return { calories, protein, sugar, confidence };
}

export async function fetchWebSearchNutrition(
  foodName: string,
  quantityGrams: number
): Promise<WebSearchNutritionResult> {
  const API_KEY = import.meta.env.VITE_GOOGLE_CSE_API_KEY;
  const CX = import.meta.env.VITE_GOOGLE_CSE_CX;

  // If not configured, return not-found
  if (!API_KEY || !CX) {
    return { source: 'not-found', confidence: 'none' };
  }

  try {
    // Search for nutrition information
    const query = `${foodName} nutrition facts calories protein`;
    const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${CX}&q=${encodeURIComponent(query)}`;

    const response = await fetch(searchUrl);

    if (!response.ok) {
      console.warn('Web search API request failed:', response.status);
      return { source: 'not-found', confidence: 'none' };
    }

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      return { source: 'not-found', confidence: 'none' };
    }

    // Try to extract nutrition from snippets
    let bestResult: {
      calories?: number;
      protein?: number;
      sugar?: number;
      confidence: 'high' | 'medium' | 'low' | 'none';
    } = { confidence: 'none' };

    for (const item of data.items.slice(0, 5)) {
      const snippet = item.snippet || '';
      const title = item.title || '';
      const combinedText = `${title} ${snippet}`;

      const parsed = parseNutritionFromText(combinedText);

      // Use the first result with at least medium confidence
      if (parsed.confidence === 'high' || parsed.confidence === 'medium') {
        bestResult = parsed;
        break;
      }

      // Keep track of the best low-confidence result
      if (parsed.confidence === 'low' && bestResult.confidence === 'none') {
        bestResult = parsed;
      }
    }

    // Only return results with at least medium confidence
    if (bestResult.confidence === 'high' || bestResult.confidence === 'medium') {
      // Scale to actual quantity (assuming parsed values are per 100g or per serving)
      // We'll assume the values are per 100g for scaling
      const scaleFactor = quantityGrams / 100;

      return {
        calories: bestResult.calories ? Math.round(bestResult.calories * scaleFactor) : undefined,
        protein: bestResult.protein ? Math.round(bestResult.protein * scaleFactor * 10) / 10 : undefined,
        sugar: bestResult.sugar ? Math.round(bestResult.sugar * scaleFactor * 10) / 10 : undefined,
        confidence: bestResult.confidence,
        source: 'web-search',
      };
    }

    return { source: 'not-found', confidence: 'none' };
  } catch (error) {
    console.warn('Web search nutrition lookup failed:', error);
    return { source: 'not-found', confidence: 'none' };
  }
}
