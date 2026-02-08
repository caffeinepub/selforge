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
    // Update immediately
    setWeeklyDays(getDaysUntilWeeklyResult(userStartTimestamp));
    setMonthlyDays(getDaysUntilMonthlyResult(userStartTimestamp));

    // Update every minute to catch date changes
    const interval = setInterval(() => {
      setWeeklyDays(getDaysUntilWeeklyResult(userStartTimestamp));
      setMonthlyDays(getDaysUntilMonthlyResult(userStartTimestamp));
    }, 60000); // 60 seconds

    return () => clearInterval(interval);
  }, [userStartTimestamp]);

  return { weeklyDays, monthlyDays };
}
