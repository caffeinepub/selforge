import { useState } from 'react';
import { useAppStore } from '../lib/store';
import { Apple, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function Nutrition() {
  const { getTodayData, addFoodEntry, oledMode } = useAppStore();
  const todayData = getTodayData();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [description, setDescription] = useState('');

  const resetForm = () => {
    setDescription('');
  };

  const handleSubmit = () => {
    if (!description.trim()) return;
    addFoodEntry({
      name: description.trim(),
      description: description.trim(),
      quantity: 0,
      calories: 0,
      protein: 0,
      sugar: 0,
    });
    resetForm();
    setIsDialogOpen(false);
  };

  // OLED border style for nutrition (Radioactive Green)
  const oledCardClass = oledMode
    ? 'border-[#39FF14] shadow-[0_0_8px_#39FF1460,inset_0_0_4px_#39FF1410]'
    : 'border-border-subtle';

  return (
    <div className={`page-container ${oledMode ? 'bg-black' : ''}`}>
      {/* Page header */}
      <div className="flex items-center justify-between">
        <h1 className="heading-1">Nutrition</h1>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-neon-green text-black hover:bg-neon-green/90 h-8">
              <Plus className="w-3.5 h-3.5 mr-1" />
              Add
            </Button>
          </DialogTrigger>
          <DialogContent className={`max-w-md ${oledMode ? 'bg-black border-[#39FF14]/60' : 'bg-card-dark border-border-subtle'}`}>
            <DialogHeader>
              <DialogTitle className={oledMode ? 'text-[#39FF14]' : 'text-neon-green'}>Add Food Entry</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description" className="text-gray-300">Add Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what you ate..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={`min-h-[120px] resize-none ${oledMode ? 'bg-black border-[#39FF14]/30' : 'bg-black border-border-subtle'}`}
                  autoFocus
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => { resetForm(); setIsDialogOpen(false); }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!description.trim()}
                  className={`flex-1 ${oledMode ? 'bg-[#39FF14] text-black hover:bg-[#39FF14]/80' : 'bg-neon-green text-black hover:bg-neon-green/90'}`}
                >
                  Save
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Food Entries List */}
      <div className="space-y-2">
        <h2 className="heading-2 text-white/70">Today's Food</h2>
        {todayData.foodEntries.length === 0 ? (
          <Card className={`${oledMode ? 'bg-black' : 'bg-card-dark'} ${oledCardClass}`}>
            <CardContent className="pt-6 text-center text-gray-500">
              No food entries logged yet
            </CardContent>
          </Card>
        ) : (
          todayData.foodEntries.map((entry) => (
            <Card key={entry.id} className={`${oledMode ? 'bg-black' : 'bg-card-dark'} ${oledCardClass}`}>
              <CardContent className="pt-4 pb-4">
                <div className="flex items-start gap-3">
                  <Apple className={`w-4 h-4 mt-0.5 shrink-0 ${oledMode ? 'text-[#39FF14]' : 'text-neon-green'}`} />
                  <p className="text-white text-sm leading-relaxed">
                    {entry.description || entry.name}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
