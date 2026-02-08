import { calculateCaloriesBurned } from './calories';
import { fetchNutritionData } from './nutrition';
import { parseMealPrompt, type ParsedFoodItem } from './mealPromptParser';
import { getRuntimeApiKey } from './apiKey';

export interface ParsedEntry {
  type: 'food' | 'gym' | 'cardio' | 'unknown';
  summary?: string;
  
  // Food fields (single item)
  name?: string;
  quantity?: number;
  brand?: string;
  calories?: number;
  protein?: number;
  sugar?: number;
  nutritionSource?: 'online' | 'web-search' | 'deepseek' | 'local';
  
  // Food fields (multi-item)
  foodItems?: Array<{
    name: string;
    quantity: number;
    displayQuantity: string;
    calories: number;
    protein: number;
    sugar: number;
    nutritionSource: 'online' | 'web-search' | 'deepseek' | 'local';
  }>;
  totalCalories?: number;
  totalProtein?: number;
  totalSugar?: number;
  
  // Gym fields
  muscleGroup?: string;
  exerciseName?: string;
  sets?: number;
  reps?: number;
  weight?: number;
  
  // Cardio fields
  activityType?: string;
  duration?: number;
  
  // Common
  caloriesBurned?: number;
}

// Parse free-text description into structured data
export async function parseDescription(description: string): Promise<ParsedEntry> {
  const text = description.toLowerCase().trim();
  
  // Try DeepSeek AI parsing if available
  const aiParsed = await parseWithDeepSeek(description);
  if (aiParsed) {
    return aiParsed;
  }
  
  // Fallback to local heuristic parsing
  return parseWithHeuristics(text, description);
}

// Parse using DeepSeek AI
async function parseWithDeepSeek(description: string): Promise<ParsedEntry | null> {
  const apiKey = getRuntimeApiKey();
  
  if (!apiKey) {
    return null;
  }

  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'You are a fitness and nutrition expert. Parse user descriptions into structured data. Always respond with valid JSON only, no markdown.',
          },
          {
            role: 'user',
            content: `Parse this description: "${description}"

Determine if it's food, gym exercise, or cardio activity. Extract all relevant details.

Return ONLY a JSON object with this structure:
{
  "type": "food" | "gym" | "cardio" | "unknown",
  "summary": "brief English summary of what you understood",
  
  // For food:
  "name": "food name",
  "quantity": number in grams,
  "brand": "brand name if mentioned",
  
  // For gym:
  "muscleGroup": "muscle group",
  "exerciseName": "exercise name",
  "sets": number,
  "reps": number,
  "weight": number in kg,
  
  // For cardio:
  "activityType": "activity type",
  "duration": number in minutes
}

Only include fields relevant to the type. If you can't determine the type, use "unknown".`,
          },
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    if (data.choices && data.choices.length > 0) {
      const content = data.choices[0].message.content;
      const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      return JSON.parse(cleaned);
    }
  } catch (error) {
    console.warn('DeepSeek parsing failed:', error);
  }
  
  return null;
}

// Fallback heuristic parsing
function parseWithHeuristics(text: string, originalText: string): ParsedEntry {
  // Food keywords
  const foodKeywords = ['ate', 'had', 'consumed', 'drank', 'breakfast', 'lunch', 'dinner', 'snack', 'meal', 'food', 'egg', 'bread', 'rice', 'chicken', 'milk', 'fruit', 'cheese', 'maggi', 'mayonnaise', 'mayo', 'burger', 'sandwich', 'pizza', 'kfc', 'mcdonalds'];
  
  // Exercise keywords
  const gymKeywords = ['bench', 'press', 'squat', 'deadlift', 'curl', 'row', 'pull', 'push', 'lift', 'sets', 'reps', 'kg', 'weight'];
  
  // Cardio keywords
  const cardioKeywords = ['ran', 'run', 'jog', 'walk', 'cycle', 'swim', 'cardio', 'minutes', 'mins', 'treadmill', 'elliptical'];
  
  const foodScore = foodKeywords.filter(kw => text.includes(kw)).length;
  const gymScore = gymKeywords.filter(kw => text.includes(kw)).length;
  const cardioScore = cardioKeywords.filter(kw => text.includes(kw)).length;
  
  // Determine type
  if (foodScore > gymScore && foodScore > cardioScore) {
    return parseFoodHeuristic(text, originalText);
  } else if (gymScore > cardioScore) {
    return parseGymHeuristic(text, originalText);
  } else if (cardioScore > 0) {
    return parseCardioHeuristic(text, originalText);
  }
  
  return {
    type: 'unknown',
    summary: 'Could not determine if this is food or exercise',
  };
}

function parseFoodHeuristic(text: string, originalText: string): ParsedEntry {
  // Try multi-item parsing first
  const mealResult = parseMealPrompt(originalText);
  
  if (mealResult.items.length > 1) {
    // Multi-item meal detected
    return {
      type: 'food',
      summary: `Multiple food items detected: ${mealResult.items.map(i => i.displayQuantity + ' ' + i.name).join(', ')}`,
      foodItems: mealResult.items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        displayQuantity: item.displayQuantity,
        calories: 0, // Will be enriched later
        protein: 0,
        sugar: 0,
        nutritionSource: 'local' as const,
      })),
    };
  } else if (mealResult.items.length === 1) {
    // Single item - use the parsed quantity
    const item = mealResult.items[0];
    return {
      type: 'food',
      name: item.name,
      quantity: item.quantity,
      summary: `${item.displayQuantity} ${item.name}`,
    };
  }
  
  // Fallback to simple parsing
  let name = 'Unknown food';
  const foodItems = ['egg', 'eggs', 'bread', 'toast', 'rice', 'chicken', 'milk', 'banana', 'apple', 'yogurt', 'cheese', 'paneer', 'maggi', 'burger', 'sandwich', 'pizza'];
  
  for (const item of foodItems) {
    if (text.includes(item)) {
      name = item;
      break;
    }
  }
  
  const numbers = text.match(/\d+/g);
  let quantity = 100;
  
  if (numbers && numbers.length > 0) {
    const num = parseInt(numbers[0]);
    // If number is small (< 10), treat as pieces
    if (num < 10) {
      // Use portion estimation for pieces
      if (name.includes('burger') || name.includes('sandwich') || name.includes('pizza')) {
        quantity = num * 200; // 200g per piece for restaurant items
      } else {
        quantity = num * 150; // 150g per piece default
      }
    } else {
      quantity = num;
    }
  }
  
  return {
    type: 'food',
    name,
    quantity,
    summary: `${name} (approximately ${quantity}g)`,
  };
}

function parseGymHeuristic(text: string, originalText: string): ParsedEntry {
  const exercises = ['bench press', 'squat', 'deadlift', 'bicep curl', 'shoulder press', 'lat pulldown', 'leg press'];
  
  let exerciseName = 'Unknown exercise';
  for (const ex of exercises) {
    if (text.includes(ex)) {
      exerciseName = ex;
      break;
    }
  }
  
  const numbers = text.match(/\d+/g);
  let sets = 3;
  let reps = 10;
  let weight = 0;
  
  if (numbers && numbers.length >= 2) {
    sets = parseInt(numbers[0]);
    reps = parseInt(numbers[1]);
    if (numbers.length >= 3) {
      weight = parseInt(numbers[2]);
    }
  }
  
  return {
    type: 'gym',
    exerciseName,
    sets,
    reps,
    weight,
    summary: `${exerciseName}: ${sets} sets × ${reps} reps${weight > 0 ? ` @ ${weight}kg` : ''}`,
  };
}

function parseCardioHeuristic(text: string, originalText: string): ParsedEntry {
  const activities = ['running', 'jogging', 'walking', 'cycling', 'swimming'];
  
  let activityType = 'Unknown activity';
  for (const activity of activities) {
    if (text.includes(activity) || text.includes(activity.slice(0, -3))) {
      activityType = activity;
      break;
    }
  }
  
  const numbers = text.match(/\d+/g);
  let duration = 30;
  
  if (numbers && numbers.length > 0) {
    duration = parseInt(numbers[0]);
  }
  
  return {
    type: 'cardio',
    activityType,
    duration,
    summary: `${activityType} for ${duration} minutes`,
  };
}

// Enrich parsed entry with nutrition/calorie data
export async function enrichParsedEntry(entry: ParsedEntry): Promise<ParsedEntry> {
  if (entry.type === 'food') {
    if (entry.foodItems && entry.foodItems.length > 0) {
      // Multi-item meal: enrich each item
      const enrichedItems = await Promise.all(
        entry.foodItems.map(async (item) => {
          const nutrition = await fetchNutritionData(item.name, item.quantity);
          return {
            ...item,
            calories: nutrition.calories,
            protein: nutrition.protein,
            sugar: nutrition.sugar,
            nutritionSource: nutrition.nutritionSource,
          };
        })
      );
      
      const totalCalories = enrichedItems.reduce((sum, item) => sum + item.calories, 0);
      const totalProtein = enrichedItems.reduce((sum, item) => sum + item.protein, 0);
      const totalSugar = enrichedItems.reduce((sum, item) => sum + item.sugar, 0);
      
      return {
        ...entry,
        foodItems: enrichedItems,
        totalCalories,
        totalProtein,
        totalSugar,
      };
    } else if (entry.name && entry.quantity) {
      // Single item: enrich with nutrition
      const nutrition = await fetchNutritionData(entry.name, entry.quantity);
      return {
        ...entry,
        calories: nutrition.calories,
        protein: nutrition.protein,
        sugar: nutrition.sugar,
        nutritionSource: nutrition.nutritionSource,
      };
    }
  } else if (entry.type === 'gym' && entry.exerciseName && entry.sets && entry.reps) {
    // Calculate calories burned for gym
    const caloriesBurned = await calculateCaloriesBurned('gym', {
      exerciseName: entry.exerciseName,
      muscleGroup: entry.muscleGroup,
      sets: entry.sets,
      reps: entry.reps,
      weight: entry.weight,
    });
    return {
      ...entry,
      caloriesBurned,
    };
  } else if (entry.type === 'cardio' && entry.activityType && entry.duration) {
    // Calculate calories burned for cardio
    const caloriesBurned = await calculateCaloriesBurned('cardio', {
      activityType: entry.activityType,
      duration: entry.duration,
    });
    return {
      ...entry,
      caloriesBurned,
    };
  }
  
  return entry;
}
