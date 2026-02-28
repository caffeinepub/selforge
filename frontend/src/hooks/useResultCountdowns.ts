import { useState, useEffect } from 'react';
import { getDaysUntilWeeklyResult, getDaysUntilMonthlyResult } from '../lib/countdowns';
import { useAppStore } from '../lib/store';

/**
 * Hook that provides live countdown values for weekly and monthly results.
 * Updates every minute to handle date changes without reload.
 */
export function useResultCountdowns() {
  const userStartTimestamp = useAppStore((state) => state.userStartTimestamp);
  const [weeklyDays, setWeeklyDays] = useState(getDaysUntilWeeklyResult(userStartTimestamp));
  const [monthlyDays, setMonthlyDays] = useState(getDaysUntilMonthlyResult(userStartTimestamp));

  useEffect(() => {
    setWeeklyDays(getDaysUntilWeeklyResult(userStartTimestamp));
    setMonthlyDays(getDaysUntilMonthlyResult(userStartTimestamp));

    const interval = setInterval(() => {
      setWeeklyDays(getDaysUntilWeeklyResult(userStartTimestamp));
      setMonthlyDays(getDaysUntilMonthlyResult(userStartTimestamp));
    }, 60000);

    return () => clearInterval(interval);
  }, [userStartTimestamp]);

  return { weeklyDays, monthlyDays };
}
