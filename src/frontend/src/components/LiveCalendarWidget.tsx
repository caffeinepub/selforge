import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';

export default function LiveCalendarWidget() {
  const [currentTime, setCurrentTime] = useState(new Date());

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

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentTime);
  const currentDay = currentTime.getDate();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptySlots = Array.from({ length: startingDayOfWeek }, (_, i) => i);

  return (
    <Card className="bg-card-dark border-border-subtle">
      <CardContent className="p-3">
        <div className="space-y-2">
          {/* Time Display */}
          <div className="text-center">
            <span className="text-xl font-bold text-neon-green glow-text tabular-nums tracking-tight">
              {formatTime(currentTime)}
            </span>
          </div>

          {/* Date Display */}
          <div className="text-center text-xs text-muted-foreground">
            {formatDate(currentTime)}
          </div>

          {/* Mini Calendar */}
          <div className="mt-2">
            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-0.5">
              {/* Day headers */}
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                <div
                  key={`header-${i}`}
                  className="text-center text-[10px] text-muted-foreground font-medium py-0.5"
                >
                  {day}
                </div>
              ))}

              {/* Empty slots for days before month starts */}
              {emptySlots.map((slot) => (
                <div key={`empty-${slot}`} className="aspect-square" />
              ))}

              {/* Days of the month */}
              {days.map((day) => (
                <div
                  key={day}
                  className={`
                    aspect-square flex items-center justify-center text-[10px] rounded-sm
                    ${
                      day === currentDay
                        ? 'bg-neon-green text-black font-bold shadow-[0_0_6px_oklch(var(--neon-green)/0.5)]'
                        : 'text-foreground/70'
                    }
                  `}
                >
                  {day}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
