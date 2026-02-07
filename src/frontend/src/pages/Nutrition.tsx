import { useState } from 'react';
import { useAppStore } from '../lib/store';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { fetchNutritionData } from '../lib/nutrition';

export default function Nutrition() {
  const { getTodayData, addFoodEntry } = useAppStore();
  const todayData = getTodayData();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [foodName, setFoodName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [brand, setBrand] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAddFood = async () => {
    if (foodName.trim() && quantity) {
      setIsLoading(true);
      try {
        const nutritionData = await fetchNutritionData(foodName, parseInt(quantity), brand);
        
        addFoodEntry({
          name: foodName.trim(),
          quantity: parseInt(quantity),
          brand: brand.trim() || undefined,
          calories: nutritionData.calories,
          protein: nutritionData.protein,
          sugar: nutritionData.sugar,
        });

        setFoodName('');
        setQuantity('');
        setBrand('');
        setIsAddDialogOpen(false);
      } catch (error) {
        console.error('Error fetching nutrition data:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const totalCalories = todayData.foodEntries.reduce((sum, f) => sum + f.calories, 0);
  const totalProtein = todayData.foodEntries.reduce((sum, f) => sum + f.protein, 0);
  const totalSugar = todayData.foodEntries.reduce((sum, f) => sum + f.sugar, 0);

  // Calculate total burned calories
  const gymCalories = todayData.gymActivities.reduce((sum, a) => sum + a.caloriesBurned, 0);
  const schoolCalories = todayData.wentToSchool ? 1700 : 0;
  const totalBurned = gymCalories + schoolCalories;
  const netCalories = totalCalories - totalBurned;

  // Targets
  const targetCalories = 1900;
  const targetProtein = 120;
  const targetSugar = 20;

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Nutrition</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-neon-green text-black hover:bg-neon-green/90">
              <Plus className="w-4 h-4 mr-1" />
              Add Food
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card-dark border-border-subtle">
            <DialogHeader>
              <DialogTitle>Add Food</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="foodName">Food Name</Label>
                <Input
                  id="foodName"
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                  placeholder="e.g., Chicken breast, Apple, Paneer"
                  className="bg-black border-border-subtle"
                />
              </div>
              <div>
                <Label htmlFor="quantity">Quantity (g/ml)</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="100"
                  className="bg-black border-border-subtle"
                />
              </div>
              <div>
                <Label htmlFor="brand">Brand (optional)</Label>
                <Input
                  id="brand"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="e.g., Amul, Mother Dairy, Country Delight"
                  className="bg-black border-border-subtle"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Supports Indian brands: Amul, Mother Dairy, Country Delight, Verka, and more
                </p>
              </div>
              <Button 
                onClick={handleAddFood} 
                disabled={isLoading}
                className="w-full bg-neon-green text-black hover:bg-neon-green/90"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Fetching nutrition data...
                  </>
                ) : (
                  'Add Food'
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary */}
      <Card className="bg-card-dark border-border-subtle">
        <CardContent className="pt-6 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total calories eaten</span>
            <div className="text-right">
              <span className="text-4xl font-bold text-neon-yellow glow-text">{totalCalories}</span>
              <span className="text-sm text-muted-foreground ml-2">/ {targetCalories}</span>
            </div>
          </div>
          <div className="h-px bg-border-subtle" />
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total protein</span>
            <div className="text-right">
              <span className="text-2xl font-bold text-neon-green">{totalProtein.toFixed(1)}g</span>
              <span className="text-sm text-muted-foreground ml-2">/ {targetProtein}g</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total sugar</span>
            <div className="text-right">
              <span className={`text-2xl font-bold ${totalSugar > targetSugar ? 'text-destructive' : 'text-foreground'}`}>
                {totalSugar.toFixed(1)}g
              </span>
              <span className="text-sm text-muted-foreground ml-2">/ {targetSugar}g</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Net Calories */}
      <Card className="bg-card-dark border-border-subtle">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Net Calories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Calories eaten</span>
            <span className="text-neon-yellow font-bold">{totalCalories}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Calories burned</span>
            <span className="text-neon-green font-bold">-{totalBurned}</span>
          </div>
          <div className="h-px bg-border-subtle" />
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Net</span>
            <span className={`text-3xl font-bold glow-text ${netCalories < 0 ? 'text-neon-green' : 'text-neon-yellow'}`}>
              {netCalories > 0 ? '+' : ''}{netCalories}
            </span>
          </div>
          <div className="text-xs text-center text-muted-foreground">
            {netCalories < 0 ? 'Calorie deficit' : 'Calorie surplus'}
          </div>
        </CardContent>
      </Card>

      {/* Food List */}
      {todayData.foodEntries.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Today's Foods</h2>
          {todayData.foodEntries.map((food) => (
            <Card key={food.id} className="bg-card-dark border-border-subtle">
              <CardContent className="pt-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{food.name}</h3>
                      {food.brand && <p className="text-xs text-muted-foreground">{food.brand}</p>}
                    </div>
                    <span className="text-lg font-bold text-neon-yellow">{food.calories} kcal</span>
                  </div>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>{food.quantity}g</span>
                    <span>Protein: {food.protein.toFixed(1)}g</span>
                    <span>Sugar: {food.sugar.toFixed(1)}g</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {todayData.foodEntries.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>No foods logged yet.</p>
          <p className="text-sm">Add your first food to track nutrition.</p>
        </div>
      )}
    </div>
  );
}
