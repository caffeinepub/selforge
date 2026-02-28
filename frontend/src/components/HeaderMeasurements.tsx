import { useAppStore } from '../lib/store';

export default function HeaderMeasurements() {
  const weeklyMeasurements = useAppStore((state) => state.weeklyMeasurements);
  const monthlyMeasurements = useAppStore((state) => state.monthlyMeasurements);

  const hasWeeklyData = Object.values(weeklyMeasurements).some((val) => (val ?? 0) > 0);
  const hasMonthlyData = Object.values(monthlyMeasurements).some((val) => (val ?? 0) > 0);

  if (!hasWeeklyData && !hasMonthlyData) {
    return null;
  }

  const formatMeasurement = (value: number | undefined, unit: string = '') => {
    return value && value > 0 ? `${value}${unit}` : '-';
  };

  return (
    <div className="flex flex-col gap-2 text-xs">
      {/* Weekly Measurements */}
      {hasWeeklyData && (
        <div className="space-y-1">
          <div className="text-neon-green font-semibold">Weekly</div>
          <div className="grid grid-cols-3 gap-x-3 gap-y-0.5 text-white/70">
            <div>Chest: {formatMeasurement(weeklyMeasurements.chest, 'cm')}</div>
            <div>Waist: {formatMeasurement(weeklyMeasurements.waist, 'cm')}</div>
            <div>Butt: {formatMeasurement(weeklyMeasurements.butt, 'cm')}</div>
            <div>Thighs: {formatMeasurement(weeklyMeasurements.thighs, 'cm')}</div>
            <div>Weight: {formatMeasurement(weeklyMeasurements.weight, 'kg')}</div>
            <div>Height: {formatMeasurement(weeklyMeasurements.height, 'cm')}</div>
          </div>
        </div>
      )}

      {/* Monthly Measurements */}
      {hasMonthlyData && (
        <div className="space-y-1">
          <div className="text-neon-green font-semibold">Monthly</div>
          <div className="grid grid-cols-3 gap-x-3 gap-y-0.5 text-white/70">
            <div>Chest: {formatMeasurement(monthlyMeasurements.chest, 'cm')}</div>
            <div>Waist: {formatMeasurement(monthlyMeasurements.waist, 'cm')}</div>
            <div>Butt: {formatMeasurement(monthlyMeasurements.butt, 'cm')}</div>
            <div>Thighs: {formatMeasurement(monthlyMeasurements.thighs, 'cm')}</div>
            <div>Weight: {formatMeasurement(monthlyMeasurements.weight, 'kg')}</div>
            <div>Height: {formatMeasurement(monthlyMeasurements.height, 'cm')}</div>
          </div>
        </div>
      )}
    </div>
  );
}
