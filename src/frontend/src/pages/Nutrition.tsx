import { useAppStore } from '../lib/store';
import { Apple, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface NutritionProps {
  onNavigateToDescription: () => void;
}

export default function Nutrition({ onNavigateToDescription }: NutritionProps) {
  const { getTodayData } = useAppStore();
  const todayData = getTodayData();

  const totalCalories = todayData.foodEntries.reduce((sum, f) => sum + f.calories, 0);
  const totalProtein = todayData.foodEntries.reduce((sum, f) => sum + f.protein, 0);
  const totalSugar = todayData.foodEntries.reduce((sum, f) => sum + f.sugar, 0);
  const caloriesBurned = todayData.gymActivities.reduce((sum, a) => sum + a.caloriesBurned, 0);
  const netCalories = totalCalories - caloriesBurned;

  return (
    <div className="page-container">
      <div className="flex items-center justify-between">
        <h1 className="page-title">Nutrition</h1>
        <Button 
          size="sm" 
          onClick={onNavigateToDescription}
          className="bg-neon-green text-black hover:bg-neon-green/90 h-8"
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          Add via Description
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <Card className="bg-card-dark border-border-subtle">
          <CardContent className="pt-4 pb-3">
            <p className="text-xs text-gray-400 mb-1">Calories In</p>
            <p className="text-xl font-bold text-neon-green">{totalCalories}</p>
          </CardContent>
        </Card>
        <Card className="bg-card-dark border-border-subtle">
          <CardContent className="pt-4 pb-3">
            <p className="text-xs text-gray-400 mb-1">Net Calories</p>
            <p className="text-xl font-bold">{netCalories}</p>
          </CardContent>
        </Card>
        <Card className="bg-card-dark border-border-subtle">
          <CardContent className="pt-4 pb-3">
            <p className="text-xs text-gray-400 mb-1">Protein</p>
            <p className="text-xl font-bold">{totalProtein.toFixed(1)}g</p>
          </CardContent>
        </Card>
        <Card className="bg-card-dark border-border-subtle">
          <CardContent className="pt-4 pb-3">
            <p className="text-xs text-gray-400 mb-1">Sugar</p>
            <p className="text-xl font-bold">{totalSugar.toFixed(1)}g</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-2">
        <h2 className="text-sm font-medium text-gray-400 mb-2">Today's Food</h2>
        {todayData.foodEntries.length === 0 ? (
          <Card className="bg-card-dark border-border-subtle">
            <CardContent className="pt-4 pb-4 text-center">
              <p className="text-sm text-gray-500">No food logged yet</p>
              <p className="text-xs text-gray-600 mt-1">Use "Add via Description" to log your meals</p>
            </CardContent>
          </Card>
        ) : (
          todayData.foodEntries.map((food) => (
            <Card key={food.id} className="bg-card-dark border-border-subtle">
              <CardContent className="pt-3 pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-2 flex-1">
                    <Apple className="w-4 h-4 text-neon-green mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      {food.summary ? (
                        <p className="text-sm font-medium text-white mb-1">{food.summary}</p>
                      ) : (
                        <>
                          <p className="text-sm font-medium text-white">{food.name}</p>
                          <p className="text-xs text-gray-400">
                            {food.quantity}g{food.brand ? ` • ${food.brand}` : ''}
                          </p>
                        </>
                      )}
                      {food.description && (
                        <p className="text-xs text-gray-500 mt-1 italic">"{food.description}"</p>
                      )}
                      <div className="flex gap-3 mt-1">
                        <span className="text-xs text-gray-500">P: {food.protein.toFixed(1)}g</span>
                        <span className="text-xs text-gray-500">S: {food.sugar.toFixed(1)}g</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right ml-2">
                    <p className="text-sm font-bold text-neon-green">{food.calories}</p>
                    <p className="text-xs text-gray-500">kcal</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
