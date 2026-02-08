import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface ParsedMealItem {
  name: string;
  quantity: number;
  displayQuantity: string;
  calories: number;
  protein: number;
  sugar: number;
  nutritionSource: 'local';
}

interface ParsedMealPreviewProps {
  items: ParsedMealItem[];
  totalCalories: number;
  totalProtein: number;
  totalSugar: number;
}

export default function ParsedMealPreview({
  items,
  totalCalories,
  totalProtein,
  totalSugar,
}: ParsedMealPreviewProps) {
  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-sm font-medium text-neon-yellow mb-2">Detected Items:</h3>
        <div className="space-y-2">
          {items.map((item, index) => (
            <div
              key={index}
              className="bg-black/50 rounded-lg p-2 border border-border-subtle"
            >
              <div className="flex items-start justify-between mb-1">
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{item.name}</p>
                  <p className="text-xs text-gray-400">{item.displayQuantity}</p>
                </div>
                <div className="text-right ml-2">
                  <p className="text-sm font-bold text-neon-yellow">{item.calories}</p>
                  <p className="text-xs text-gray-500">kcal</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex gap-2 text-xs">
                  <span className="text-neon-blue">P: {item.protein.toFixed(1)}g</span>
                  <span className="text-red-400">S: {item.sugar.toFixed(1)}g</span>
                </div>
                <Badge variant="secondary" className="text-xs h-4 px-1.5">
                  Local
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Separator className="bg-border-subtle" />

      <div className="bg-neon-yellow/10 rounded-lg p-3 border border-neon-yellow/30">
        <h3 className="text-sm font-medium text-neon-yellow mb-2">Total:</h3>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <p className="text-xs text-gray-400">Calories</p>
            <p className="text-lg font-bold text-neon-yellow">{totalCalories}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Protein</p>
            <p className="text-lg font-bold text-neon-blue">{totalProtein.toFixed(1)}g</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Sugar</p>
            <p className="text-lg font-bold text-red-400">{totalSugar.toFixed(1)}g</p>
          </div>
        </div>
      </div>
    </div>
  );
}
