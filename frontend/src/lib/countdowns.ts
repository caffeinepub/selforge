/**
 * Countdown utilities for weekly and monthly result deadlines.
 * Based on user start timestamp with 7-day and 30-day cycles.
 */

/**
 * Calculate days remaining in current 7-day cycle since user start timestamp.
 * Returns a value from 0 to 6.
 */
export function getDaysUntilWeeklyResult(userStartTimestamp: number | null): number {
  if (!userStartTimestamp) {
    // Fallback to Monday-based countdown if no start timestamp
    const now = new Date();
    const currentDay = now.getDay();
    const daysUntilMonday = currentDay === 0 ? 1 : 8 - currentDay;
    return daysUntilMonday;
  }

  const now = new Date();
  const startDate = new Date(userStartTimestamp);
  
  // Set both dates to start of their local day (midnight)
  const nowDayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startDayStart = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  
  // Calculate days elapsed since start
  const msPerDay = 1000 * 60 * 60 * 24;
  const daysSinceStart = Math.floor((nowDayStart.getTime() - startDayStart.getTime()) / msPerDay);
  
  // Calculate position in current 7-day cycle (0-6)
  const dayInCycle = daysSinceStart % 7;
  
  // Days remaining in cycle (0-6)
  const daysRemaining = (6 - dayInCycle);
  
  return daysRemaining;
}

/**
 * Calculate days remaining in current 30-day cycle since user start timestamp.
 * Returns a value from 0 to 29.
 */
export function getDaysUntilMonthlyResult(userStartTimestamp: number | null): number {
  if (!userStartTimestamp) {
    // Fallback to 1st-of-month countdown if no start timestamp
    const now = new Date();
    const currentDate = now.getDate();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysRemaining = lastDayOfMonth - currentDate + 1;
    return daysRemaining;
  }

  const now = new Date();
  const startDate = new Date(userStartTimestamp);
  
  // Set both dates to start of their local day (midnight)
  const nowDayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startDayStart = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  
  // Calculate days elapsed since start
  const msPerDay = 1000 * 60 * 60 * 24;
  const daysSinceStart = Math.floor((nowDayStart.getTime() - startDayStart.getTime()) / msPerDay);
  
  // Calculate position in current 30-day cycle (0-29)
  const dayInCycle = daysSinceStart % 30;
  
  // Days remaining in cycle (0-29)
  const daysRemaining = (29 - dayInCycle);
  
  return daysRemaining;
}
