import { useState } from 'react';
import { useAppStore } from '../lib/store';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface MeasurementsEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function MeasurementsEditorDialog({
  open,
  onOpenChange,
}: MeasurementsEditorDialogProps) {
  const weeklyMeasurements = useAppStore((state) => state.weeklyMeasurements);
  const monthlyMeasurements = useAppStore((state) => state.monthlyMeasurements);
  const setWeeklyMeasurements = useAppStore((state) => state.setWeeklyMeasurements);
  const setMonthlyMeasurements = useAppStore((state) => state.setMonthlyMeasurements);

  // Local draft state
  const [weeklyDraft, setWeeklyDraft] = useState(weeklyMeasurements);
  const [monthlyDraft, setMonthlyDraft] = useState(monthlyMeasurements);

  // Sync drafts when dialog opens
  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      setWeeklyDraft(weeklyMeasurements);
      setMonthlyDraft(monthlyMeasurements);
    }
    onOpenChange(newOpen);
  };

  const handleSave = () => {
    setWeeklyMeasurements(weeklyDraft);
    setMonthlyMeasurements(monthlyDraft);
    onOpenChange(false);
  };

  const handleCancel = () => {
    setWeeklyDraft(weeklyMeasurements);
    setMonthlyDraft(monthlyMeasurements);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-card-dark border-border-subtle">
        <DialogHeader>
          <DialogTitle className="text-neon-green">Edit Measurements</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Update your weekly and monthly body measurements. Changes are saved when you click Save.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="weekly" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>

          <TabsContent value="weekly" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weekly-chest" className="text-sm">
                  Chest (cm)
                </Label>
                <Input
                  id="weekly-chest"
                  type="number"
                  min="0"
                  step="0.1"
                  value={weeklyDraft.chest || ''}
                  onChange={(e) =>
                    setWeeklyDraft({ ...weeklyDraft, chest: parseFloat(e.target.value) || 0 })
                  }
                  className="bg-white/5 border-border-subtle"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weekly-waist" className="text-sm">
                  Waist (cm)
                </Label>
                <Input
                  id="weekly-waist"
                  type="number"
                  min="0"
                  step="0.1"
                  value={weeklyDraft.waist || ''}
                  onChange={(e) =>
                    setWeeklyDraft({ ...weeklyDraft, waist: parseFloat(e.target.value) || 0 })
                  }
                  className="bg-white/5 border-border-subtle"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weekly-butt" className="text-sm">
                  Butt (cm)
                </Label>
                <Input
                  id="weekly-butt"
                  type="number"
                  min="0"
                  step="0.1"
                  value={weeklyDraft.butt || ''}
                  onChange={(e) =>
                    setWeeklyDraft({ ...weeklyDraft, butt: parseFloat(e.target.value) || 0 })
                  }
                  className="bg-white/5 border-border-subtle"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weekly-thighs" className="text-sm">
                  Thighs (cm)
                </Label>
                <Input
                  id="weekly-thighs"
                  type="number"
                  min="0"
                  step="0.1"
                  value={weeklyDraft.thighs || ''}
                  onChange={(e) =>
                    setWeeklyDraft({ ...weeklyDraft, thighs: parseFloat(e.target.value) || 0 })
                  }
                  className="bg-white/5 border-border-subtle"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weekly-weight" className="text-sm">
                  Weight (kg)
                </Label>
                <Input
                  id="weekly-weight"
                  type="number"
                  min="0"
                  step="0.1"
                  value={weeklyDraft.weight || ''}
                  onChange={(e) =>
                    setWeeklyDraft({ ...weeklyDraft, weight: parseFloat(e.target.value) || 0 })
                  }
                  className="bg-white/5 border-border-subtle"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weekly-height" className="text-sm">
                  Height (cm)
                </Label>
                <Input
                  id="weekly-height"
                  type="number"
                  min="0"
                  step="0.1"
                  value={weeklyDraft.height || ''}
                  onChange={(e) =>
                    setWeeklyDraft({ ...weeklyDraft, height: parseFloat(e.target.value) || 0 })
                  }
                  className="bg-white/5 border-border-subtle"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="monthly" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="monthly-chest" className="text-sm">
                  Chest (cm)
                </Label>
                <Input
                  id="monthly-chest"
                  type="number"
                  min="0"
                  step="0.1"
                  value={monthlyDraft.chest || ''}
                  onChange={(e) =>
                    setMonthlyDraft({ ...monthlyDraft, chest: parseFloat(e.target.value) || 0 })
                  }
                  className="bg-white/5 border-border-subtle"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="monthly-waist" className="text-sm">
                  Waist (cm)
                </Label>
                <Input
                  id="monthly-waist"
                  type="number"
                  min="0"
                  step="0.1"
                  value={monthlyDraft.waist || ''}
                  onChange={(e) =>
                    setMonthlyDraft({ ...monthlyDraft, waist: parseFloat(e.target.value) || 0 })
                  }
                  className="bg-white/5 border-border-subtle"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="monthly-butt" className="text-sm">
                  Butt (cm)
                </Label>
                <Input
                  id="monthly-butt"
                  type="number"
                  min="0"
                  step="0.1"
                  value={monthlyDraft.butt || ''}
                  onChange={(e) =>
                    setMonthlyDraft({ ...monthlyDraft, butt: parseFloat(e.target.value) || 0 })
                  }
                  className="bg-white/5 border-border-subtle"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="monthly-thighs" className="text-sm">
                  Thighs (cm)
                </Label>
                <Input
                  id="monthly-thighs"
                  type="number"
                  min="0"
                  step="0.1"
                  value={monthlyDraft.thighs || ''}
                  onChange={(e) =>
                    setMonthlyDraft({ ...monthlyDraft, thighs: parseFloat(e.target.value) || 0 })
                  }
                  className="bg-white/5 border-border-subtle"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="monthly-weight" className="text-sm">
                  Weight (kg)
                </Label>
                <Input
                  id="monthly-weight"
                  type="number"
                  min="0"
                  step="0.1"
                  value={monthlyDraft.weight || ''}
                  onChange={(e) =>
                    setMonthlyDraft({ ...monthlyDraft, weight: parseFloat(e.target.value) || 0 })
                  }
                  className="bg-white/5 border-border-subtle"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="monthly-height" className="text-sm">
                  Height (cm)
                </Label>
                <Input
                  id="monthly-height"
                  type="number"
                  min="0"
                  step="0.1"
                  value={monthlyDraft.height || ''}
                  onChange={(e) =>
                    setMonthlyDraft({ ...monthlyDraft, height: parseFloat(e.target.value) || 0 })
                  }
                  className="bg-white/5 border-border-subtle"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-neon-green text-black hover:bg-neon-green/90">
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
