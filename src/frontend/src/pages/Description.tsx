import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle2, AlertCircle, Utensils, Dumbbell, Activity } from 'lucide-react';
import { parseDescription, enrichParsedEntry, type ParsedEntry } from '@/lib/descriptionFlow';
import { useAppStore } from '@/lib/store';

export default function Description() {
  const navigate = useNavigate();
  const addFoodEntry = useAppStore((state) => state.addFoodEntry);
  const addGymActivity = useAppStore((state) => state.addGymActivity);
  
  const [description, setDescription] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedResult, setParsedResult] = useState<ParsedEntry | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleParse = async () => {
    if (!description.trim()) return;
    
    setIsProcessing(true);
    setError(null);
    setParsedResult(null);
    
    try {
      const parsed = await parseDescription(description);
      const enriched = await enrichParsedEntry(parsed);
      setParsedResult(enriched);
    } catch (err) {
      setError('Failed to parse description. Please try again.');
      console.error('Parse error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirm = () => {
    if (!parsedResult) return;
    
    if (parsedResult.type === 'food') {
      if (parsedResult.foodItems && parsedResult.foodItems.length > 0) {
        // Multi-item meal: create separate entries for each item
        parsedResult.foodItems.forEach((item) => {
          addFoodEntry({
            name: item.name,
            quantity: item.quantity,
            calories: item.calories,
            protein: item.protein,
            sugar: item.sugar,
            description: `${item.displayQuantity} ${item.name}`,
            summary: `${item.displayQuantity} ${item.name} - ${item.calories} cal`,
          });
        });
      } else if (parsedResult.name && parsedResult.quantity && parsedResult.calories) {
        // Single item
        addFoodEntry({
          name: parsedResult.name,
          quantity: parsedResult.quantity,
          calories: parsedResult.calories,
          protein: parsedResult.protein || 0,
          sugar: parsedResult.sugar || 0,
          description: description,
          summary: parsedResult.summary,
        });
      }
      navigate({ to: '/nutrition' });
    } else if (parsedResult.type === 'gym' && parsedResult.exerciseName) {
      addGymActivity({
        type: 'gym',
        muscleGroup: parsedResult.muscleGroup || 'Unknown',
        exerciseName: parsedResult.exerciseName,
        sets: parsedResult.sets || 0,
        reps: parsedResult.reps || 0,
        weight: parsedResult.weight || 0,
        caloriesBurned: parsedResult.caloriesBurned || 0,
        description: description,
        summary: parsedResult.summary,
      });
      navigate({ to: '/gym' });
    } else if (parsedResult.type === 'cardio' && parsedResult.activityType) {
      addGymActivity({
        type: 'cardio',
        muscleGroup: 'Cardio',
        activityType: parsedResult.activityType,
        duration: parsedResult.duration || 0,
        caloriesBurned: parsedResult.caloriesBurned || 0,
        description: description,
        summary: parsedResult.summary,
      });
      navigate({ to: '/gym' });
    }
  };

  const getNutritionSourceBadge = (source: string) => {
    switch (source) {
      case 'online':
        return <Badge variant="default" className="text-xs">Online DB</Badge>;
      case 'web-search':
        return <Badge variant="secondary" className="text-xs">Web Search</Badge>;
      case 'deepseek':
        return <Badge variant="outline" className="text-xs">AI</Badge>;
      case 'local':
        return <Badge variant="outline" className="text-xs">Estimated</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 pb-24">
      <div className="mx-auto max-w-2xl space-y-4">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">Quick Log</h1>
          <p className="text-sm text-muted-foreground">
            Describe what you ate or your workout in plain English
          </p>
        </div>

        {/* Input */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <Textarea
              placeholder="e.g., 2 kfc veg zinger burger&#10;or: bench press 3 sets 10 reps 60kg&#10;or: ran for 30 minutes"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <Button 
              onClick={handleParse} 
              disabled={!description.trim() || isProcessing}
              className="w-full"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Parse Description'
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Error */}
        {error && (
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
                <div>
                  <p className="font-medium text-destructive">Error</p>
                  <p className="text-sm text-muted-foreground">{error}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {parsedResult && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {parsedResult.type === 'food' && <Utensils className="h-5 w-5" />}
                  {parsedResult.type === 'gym' && <Dumbbell className="h-5 w-5" />}
                  {parsedResult.type === 'cardio' && <Activity className="h-5 w-5" />}
                  {parsedResult.type === 'food' ? 'Food Entry' : 'Workout Entry'}
                </CardTitle>
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Summary */}
              {parsedResult.summary && (
                <div className="text-sm text-muted-foreground">
                  {parsedResult.summary}
                </div>
              )}

              {/* Food - Multi-item */}
              {parsedResult.type === 'food' && parsedResult.foodItems && parsedResult.foodItems.length > 0 && (
                <div className="space-y-3">
                  {parsedResult.foodItems.map((item, idx) => (
                    <div key={idx} className="border rounded-lg p-3 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">{item.displayQuantity}</p>
                        </div>
                        {getNutritionSourceBadge(item.nutritionSource)}
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">Calories</p>
                          <p className="font-medium">{item.calories}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Protein</p>
                          <p className="font-medium">{item.protein}g</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Sugar</p>
                          <p className="font-medium">{item.sugar}g</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Totals */}
                  <div className="border-t pt-3 mt-3">
                    <p className="text-sm font-medium mb-2">Totals</p>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">Calories</p>
                        <p className="font-bold">{parsedResult.totalCalories}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Protein</p>
                        <p className="font-bold">{parsedResult.totalProtein?.toFixed(1)}g</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Sugar</p>
                        <p className="font-bold">{parsedResult.totalSugar?.toFixed(1)}g</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Food - Single item */}
              {parsedResult.type === 'food' && !parsedResult.foodItems && parsedResult.name && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{parsedResult.name}</p>
                      <p className="text-sm text-muted-foreground">{parsedResult.quantity}g</p>
                    </div>
                    {parsedResult.nutritionSource && getNutritionSourceBadge(parsedResult.nutritionSource)}
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Calories</p>
                      <p className="font-medium">{parsedResult.calories}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Protein</p>
                      <p className="font-medium">{parsedResult.protein}g</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Sugar</p>
                      <p className="font-medium">{parsedResult.sugar}g</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Gym */}
              {parsedResult.type === 'gym' && (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Exercise</p>
                      <p className="font-medium">{parsedResult.exerciseName}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Muscle Group</p>
                      <p className="font-medium">{parsedResult.muscleGroup}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Sets × Reps</p>
                      <p className="font-medium">{parsedResult.sets} × {parsedResult.reps}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Weight</p>
                      <p className="font-medium">{parsedResult.weight}kg</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Calories Burned</p>
                      <p className="font-medium">{parsedResult.caloriesBurned}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Cardio */}
              {parsedResult.type === 'cardio' && (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Activity</p>
                      <p className="font-medium">{parsedResult.activityType}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Duration</p>
                      <p className="font-medium">{parsedResult.duration} min</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Calories Burned</p>
                      <p className="font-medium">{parsedResult.caloriesBurned}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Unknown */}
              {parsedResult.type === 'unknown' && (
                <div className="text-sm text-muted-foreground">
                  Could not determine the type of entry. Please try rephrasing your description.
                </div>
              )}

              {/* Confirm Button */}
              {parsedResult.type !== 'unknown' && (
                <Button onClick={handleConfirm} className="w-full">
                  Confirm & Save
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
