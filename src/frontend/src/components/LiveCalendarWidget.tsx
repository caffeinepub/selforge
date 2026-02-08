import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useAppStore } from '../lib/store';

export default function LiveCalendarWidget() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { userName } = useAppStore();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  };

  const getWeekday = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  const getMonth = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long' });
  };

  const getDay = (date: Date) => {
    return date.getDate();
  };

  const getYear = (date: Date) => {
    return date.getFullYear();
  };

  return (
    <Card className="bg-card-dark border-border-subtle">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Greeting with Name */}
          {userName && (
            <div className="text-center">
              <span className="text-lg font-semibold text-neon-green">
                Hello, {userName}
              </span>
            </div>
          )}

          {/* Time Display */}
          <div className="text-center">
            <span className="text-3xl font-bold text-neon-green glow-text tabular-nums tracking-tight">
              {formatTime(currentTime)}
            </span>
          </div>

          {/* Full Date Breakdown */}
          <div className="text-center space-y-1">
            <div className="text-lg font-semibold text-foreground">
              {getWeekday(currentTime)}
            </div>
            <div className="text-base text-muted-foreground">
              {getMonth(currentTime)} {getDay(currentTime)}, {getYear(currentTime)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
