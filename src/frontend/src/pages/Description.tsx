import { useState } from 'react';
import { Loader2, CheckCircle2, AlertCircle, Sparkles, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { parseDescription, enrichDescription, type ParsedEntry } from '../lib/descriptionFlow';
import { useAppStore } from '../lib/store';

export default function Description() {
  const { addGymActivity, addFoodEntry } = useAppStore();
  const [description, setDescription] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedEntry, setParsedEntry] = useState<ParsedEntry | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleParse = async () => {
    if (!description.trim()) return;

    setIsProcessing(true);
    setError(null);
    setParsedEntry(null);

    try {
      const parsed = await parseDescription(description);
      
      if (parsed.type === 'unknown') {
        setError('Unable to determine if this is food or exercise. Please provide more details.');
        setParsedEntry(parsed);
        return;
      }

      const enriched = await enrichDescription(parsed);
      setParsedEntry(enriched);
    } catch (err) {
      setError('Failed to process description. Please try again.');
      console.error('Parse error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirm = () => {
    if (!parsedEntry) return;

    if (parsedEntry.type === 'gym' || parsedEntry.type === 'cardio') {
      addGymActivity({
        type: parsedEntry.type,
        muscleGroup: parsedEntry.muscleGroup,
        exerciseName: parsedEntry.exerciseName,
        sets: parsedEntry.sets,
        reps: parsedEntry.reps,
        weight: parsedEntry.weight,
        activityType: parsedEntry.activityType,
        duration: parsedEntry.duration,
        caloriesBurned: parsedEntry.caloriesBurned || 0,
        description: description,
        summary: parsedEntry.summary,
      });
    } else if (parsedEntry.type === 'food') {
      // Handle multi-item meals
      if (parsedEntry.foodItems && parsedEntry.foodItems.length > 0) {
        parsedEntry.foodItems.forEach((item) => {
          addFoodEntry({
            name: item.name,
            quantity: item.quantity,
            calories: item.calories,
            protein: item.protein,
            sugar: item.sugar,
            description: `${item.displayQuantity} ${item.name}`,
            summary: `${item.displayQuantity} ${item.name}: ${item.calories} kcal, ${item.protein}g protein`,
          });
        });
      } else {
        // Single item
        addFoodEntry({
          name: parsedEntry.name || 'Unknown food',
          quantity: parsedEntry.quantity || 100,
          brand: parsedEntry.brand,
          calories: parsedEntry.calories || 0,
          protein: parsedEntry.protein || 0,
          sugar: parsedEntry.sugar || 0,
          description: description,
          summary: parsedEntry.summary,
        });
      }
    }

    setDescription('');
    setParsedEntry(null);
    setError(null);
  };

  const getNutritionSourceBadge = (source?: string) => {
    if (!source) return null;
    
    const badges = {
      online: { label: 'Online DB', color: 'bg-green-500/20 text-green-300' },
      deepseek: { label: 'AI', color: 'bg-blue-500/20 text-blue-300' },
      local: { label: 'Estimated', color: 'bg-yellow-500/20 text-yellow-300' },
    };

    const badge = badges[source as keyof typeof badges];
    if (!badge) return null;

    return (
      <Badge className={`${badge.color} text-xs px-2 py-0.5`}>
        {source === 'online' && <Globe className="w-3 h-3 mr-1" />}
        {badge.label}
      </Badge>
    );
  };

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-4">
        <h1 className="page-title">Quick Log</h1>
        <Sparkles className="w-5 h-5 text-neon-green" />
      </div>

      <Card className="bg-card-dark border-border-subtle mb-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Describe what you ate or did</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="E.g., 'I had 2 maggie 2 cheese slice 10 gram mayonnaise' or 'Did 3 sets of 10 push-ups' or 'Ran for 30 minutes'"
            className="bg-black border-border-subtle min-h-[120px] text-sm resize-none"
            disabled={isProcessing}
          />
          
          <Button
            onClick={handleParse}
            disabled={!description.trim() || isProcessing}
            className="w-full bg-neon-green text-black hover:bg-neon-green/90 h-9"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Parse & Enrich
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {error && !parsedEntry && (
        <Card className="bg-red-950/20 border-red-900/50 mb-4">
          <CardContent className="pt-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-red-200">{error}</p>
                <p className="text-xs text-red-300/70 mt-1">
                  Try being more specific about what you ate or which exercise you did.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {parsedEntry && (
        <Card className="bg-card-dark border-border-subtle">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-neon-green" />
              What I understood
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {parsedEntry.type === 'unknown' ? (
              <div className="text-sm text-gray-400">
                <p className="mb-2">Could not determine the type of entry.</p>
                <p className="text-xs">Please provide more details about whether this is food or exercise.</p>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Type:</span>
                    <span className={`text-sm font-medium px-2 py-0.5 rounded ${
                      parsedEntry.type === 'food' 
                        ? 'bg-blue-500/20 text-blue-300' 
                        : 'bg-green-500/20 text-green-300'
                    }`}>
                      {parsedEntry.type === 'food' ? 'Food' : parsedEntry.type === 'gym' ? 'Gym' : 'Cardio'}
                    </span>
                  </div>
                </div>

                {/* Multi-item food display */}
                {parsedEntry.type === 'food' && parsedEntry.foodItems && parsedEntry.foodItems.length > 0 && (
                  <div className="space-y-3">
                    <div className="text-xs font-medium text-gray-400 uppercase tracking-wide">Items:</div>
                    {parsedEntry.foodItems.map((item, idx) => (
                      <div key={idx} className="bg-black/50 border border-border-subtle rounded-lg p-3 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-medium text-white">{item.name}</p>
                            <p className="text-xs text-gray-400">{item.displayQuantity} ({item.quantity}g)</p>
                          </div>
                          {getNutritionSourceBadge(item.nutritionSource)}
                        </div>
                        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border-subtle">
                          <div>
                            <p className="text-xs text-gray-500">Calories</p>
                            <p className="text-sm font-medium text-neon-green">{item.calories} kcal</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Protein</p>
                            <p className="text-sm font-medium">{item.protein}g</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Sugar</p>
                            <p className="text-sm font-medium">{item.sugar}g</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {/* Totals */}
                    <div className="bg-neon-green/10 border border-neon-green/30 rounded-lg p-3">
                      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Total</p>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <p className="text-xs text-gray-500">Calories</p>
                          <p className="text-base font-bold text-neon-green">{parsedEntry.totalCalories} kcal</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Protein</p>
                          <p className="text-base font-bold text-white">{parsedEntry.totalProtein}g</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Sugar</p>
                          <p className="text-base font-bold text-white">{parsedEntry.totalSugar}g</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Single food item display */}
                {parsedEntry.type === 'food' && !parsedEntry.foodItems && (
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border-subtle">
                    <div>
                      <p className="text-xs text-gray-500">Food</p>
                      <p className="text-sm font-medium">{parsedEntry.name || 'Unknown'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Quantity</p>
                      <p className="text-sm font-medium">{parsedEntry.quantity || 0}g</p>
                    </div>
                    {parsedEntry.brand && (
                      <div>
                        <p className="text-xs text-gray-500">Brand</p>
                        <p className="text-sm font-medium">{parsedEntry.brand}</p>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <p className="text-xs text-gray-500">Calories</p>
                        <p className="text-sm font-medium text-neon-green">{parsedEntry.calories || 0} kcal</p>
                      </div>
                      {getNutritionSourceBadge(parsedEntry.nutritionSource)}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Protein</p>
                      <p className="text-sm font-medium">{parsedEntry.protein || 0}g</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Sugar</p>
                      <p className="text-sm font-medium">{parsedEntry.sugar || 0}g</p>
                    </div>
                  </div>
                )}

                {/* Gym display */}
                {parsedEntry.type === 'gym' && (
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border-subtle">
                    <div>
                      <p className="text-xs text-gray-500">Exercise</p>
                      <p className="text-sm font-medium">{parsedEntry.exerciseName || 'Unknown'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Muscle Group</p>
                      <p className="text-sm font-medium">{parsedEntry.muscleGroup || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Sets × Reps</p>
                      <p className="text-sm font-medium">{parsedEntry.sets || 0} × {parsedEntry.reps || 0}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Weight</p>
                      <p className="text-sm font-medium">{parsedEntry.weight || 0}kg</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Calories Burned</p>
                      <p className="text-sm font-medium text-neon-green">{parsedEntry.caloriesBurned || 0} kcal</p>
                    </div>
                  </div>
                )}

                {/* Cardio display */}
                {parsedEntry.type === 'cardio' && (
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border-subtle">
                    <div>
                      <p className="text-xs text-gray-500">Activity</p>
                      <p className="text-sm font-medium">{parsedEntry.activityType || 'Unknown'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Duration</p>
                      <p className="text-sm font-medium">{parsedEntry.duration || 0} min</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Calories Burned</p>
                      <p className="text-sm font-medium text-neon-green">{parsedEntry.caloriesBurned || 0} kcal</p>
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleConfirm}
                  className="w-full bg-neon-green text-black hover:bg-neon-green/90 h-9 mt-2"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Confirm & Save
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {!parsedEntry && !isProcessing && (
        <div className="mt-6 space-y-2">
          <p className="text-xs text-gray-500 text-center">Examples:</p>
          <div className="space-y-1">
            <button
              onClick={() => setDescription('I had 2 maggie 2 cheese slice 10 gram mayonnaise for lunch')}
              className="w-full text-left text-xs text-gray-400 hover:text-white bg-black/50 hover:bg-black/70 border border-border-subtle rounded px-3 py-2 transition-colors"
            >
              "I had 2 maggie 2 cheese slice 10 gram mayonnaise for lunch"
            </button>
            <button
              onClick={() => setDescription('2 boiled eggs and 2 slices of whole wheat bread')}
              className="w-full text-left text-xs text-gray-400 hover:text-white bg-black/50 hover:bg-black/70 border border-border-subtle rounded px-3 py-2 transition-colors"
            >
              "2 boiled eggs and 2 slices of whole wheat bread"
            </button>
            <button
              onClick={() => setDescription('Did 4 sets of 12 reps bench press with 60kg')}
              className="w-full text-left text-xs text-gray-400 hover:text-white bg-black/50 hover:bg-black/70 border border-border-subtle rounded px-3 py-2 transition-colors"
            >
              "Did 4 sets of 12 reps bench press with 60kg"
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
