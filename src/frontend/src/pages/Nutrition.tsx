import { useState } from 'react';
import { useAppStore } from '../lib/store';
import { Apple, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { fetchNutritionData } from '../lib/nutrition';

export default function Nutrition() {
  const { getTodayData, addFoodEntry } = useAppStore();
  const todayData = getTodayData();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Manual entry fields
  const [foodName, setFoodName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [brand, setBrand] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [sugar, setSugar] = useState('');

  const resetForm = () => {
    setFoodName('');
    setQuantity('');
    setBrand('');
    setCalories('');
    setProtein('');
    setSugar('');
  };

  const handleLookup = async () => {
    if (!foodName.trim() || !quantity.trim()) {
      alert('Please enter food name and quantity');
      return;
    }

    setIsLoading(true);
    try {
      const nutritionData = await fetchNutritionData(foodName.trim(), parseFloat(quantity));
      
      setFoodName(nutritionData.name);
      setQuantity(nutritionData.quantity.toString());
      setBrand(nutritionData.brand || '');
      setCalories(nutritionData.calories.toString());
      setProtein(nutritionData.protein.toString());
      setSugar(nutritionData.sugar.toString());
    } catch (error) {
      console.error('Error looking up nutrition:', error);
      alert('Failed to look up nutrition data. Please enter manually.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = () => {
    const caloriesNum = parseInt(calories);
    const proteinNum = parseFloat(protein);
    const sugarNum = parseFloat(sugar);
    const quantityNum = parseFloat(quantity);

    if (!foodName || !quantityNum || !caloriesNum || isNaN(proteinNum) || isNaN(sugarNum)) {
      alert('Please fill in all required fields');
      return;
    }

    addFoodEntry({
      name: foodName,
      quantity: quantityNum,
      brand: brand || undefined,
      calories: caloriesNum,
      protein: proteinNum,
      sugar: sugarNum,
    });

    resetForm();
    setIsDialogOpen(false);
  };

  const totalCalories = todayData.foodEntries.reduce((sum, entry) => sum + entry.calories, 0);
  const totalProtein = todayData.foodEntries.reduce((sum, entry) => sum + entry.protein, 0);
  const totalSugar = todayData.foodEntries.reduce((sum, entry) => sum + entry.sugar, 0);

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neon-yellow">Nutrition</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-neon-yellow text-black hover:bg-neon-yellow/90">
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card-dark border-border-subtle max-w-md">
            <DialogHeader>
              <DialogTitle className="text-neon-yellow">Add Food Entry</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              {/* Quick Lookup */}
              <div className="space-y-2">
                <Label htmlFor="foodName">Food Name</Label>
                <Input
                  id="foodName"
                  type="text"
                  placeholder="e.g., Chicken Breast"
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                  className="bg-black border-border-subtle"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity (grams)</Label>
                <Input
                  id="quantity"
                  type="number"
                  placeholder="100"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="bg-black border-border-subtle"
                />
              </div>

              <Button
                onClick={handleLookup}
                disabled={isLoading}
                variant="outline"
                className="w-full"
              >
                {isLoading ? 'Looking up...' : 'Look Up Nutrition'}
              </Button>

              {/* Manual Entry Fields */}
              <div className="space-y-2">
                <Label htmlFor="brand">Brand (optional)</Label>
                <Input
                  id="brand"
                  type="text"
                  placeholder="e.g., Amul"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="bg-black border-border-subtle"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="calories">Calories</Label>
                  <Input
                    id="calories"
                    type="number"
                    placeholder="165"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    className="bg-black border-border-subtle"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="protein">Protein (g)</Label>
                  <Input
                    id="protein"
                    type="number"
                    step="0.1"
                    placeholder="31"
                    value={protein}
                    onChange={(e) => setProtein(e.target.value)}
                    className="bg-black border-border-subtle"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sugar">Sugar (g)</Label>
                  <Input
                    id="sugar"
                    type="number"
                    step="0.1"
                    placeholder="0"
                    value={sugar}
                    onChange={(e) => setSugar(e.target.value)}
                    className="bg-black border-border-subtle"
                  />
                </div>
              </div>

              <Button
                onClick={handleSubmit}
                className="w-full bg-neon-yellow text-black hover:bg-neon-yellow/90"
              >
                Add Food Entry
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Card */}
      <Card className="bg-card-dark border-border-subtle">
        <CardContent className="pt-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-400">Calories</p>
              <p className="text-2xl font-bold text-neon-yellow">{totalCalories}</p>
              <p className="text-xs text-gray-500">kcal</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Protein</p>
              <p className="text-2xl font-bold text-neon-blue">{totalProtein.toFixed(1)}</p>
              <p className="text-xs text-gray-500">g</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Sugar</p>
              <p className="text-2xl font-bold text-red-400">{totalSugar.toFixed(1)}</p>
              <p className="text-xs text-gray-500">g</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Food Entries List */}
      <div className="space-y-2">
        <h2 className="text-sm font-semibold text-gray-400">Today's Food</h2>
        {todayData.foodEntries.length === 0 ? (
          <Card className="bg-card-dark border-border-subtle">
            <CardContent className="pt-6 text-center text-gray-500">
              No food entries logged yet
            </CardContent>
          </Card>
        ) : (
          todayData.foodEntries.map((entry) => (
            <Card key={entry.id} className="bg-card-dark border-border-subtle">
              <CardContent className="pt-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-semibold text-white">{entry.name}</p>
                    {entry.brand && <p className="text-sm text-gray-400">{entry.brand}</p>}
                    <p className="text-xs text-gray-500 mt-1">{entry.quantity}g</p>
                    <div className="flex gap-3 mt-2 text-xs">
                      <span className="text-neon-blue">P: {entry.protein.toFixed(1)}g</span>
                      <span className="text-red-400">S: {entry.sugar.toFixed(1)}g</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-neon-yellow">{entry.calories}</p>
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
