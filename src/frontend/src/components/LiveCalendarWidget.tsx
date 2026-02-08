import { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LiveCalendarWidgetProps {
  userName: string;
  onCalendarClick: () => void;
}

export default function LiveCalendarWidget({ userName, onCalendarClick }: LiveCalendarWidgetProps) {
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
    <div className="flex flex-col items-center gap-2">
      {/* Greeting with Calendar Icon */}
      <div className="flex items-center gap-2">
        <span className="text-lg font-semibold text-white">Hello {userName}</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 hover:bg-neon-green/20"
          onClick={onCalendarClick}
          aria-label="Edit measurements"
        >
          <Calendar className="h-4 w-4 text-neon-green" />
        </Button>
      </div>

      {/* Time Display - centered */}
      <div className="text-center">
        <span className="text-2xl font-bold text-neon-green glow-text tabular-nums tracking-tight">
          {formatTime(currentTime)}
        </span>
      </div>

      {/* Date Display - centered */}
      <div className="text-center space-y-0.5">
        <div className="text-sm font-semibold text-foreground">
          {getWeekday(currentTime)}
        </div>
        <div className="text-xs text-muted-foreground">
          {getMonth(currentTime)} {getDay(currentTime)}, {getYear(currentTime)}
        </div>
      </div>
    </div>
  );
}
