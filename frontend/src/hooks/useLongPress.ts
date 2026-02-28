import { useRef, useState, useCallback } from 'react';

interface UseLongPressOptions {
  onLongPress: () => void;
  duration?: number;
}

interface UseLongPressResult {
  handlers: {
    onMouseDown: () => void;
    onMouseUp: () => void;
    onMouseLeave: () => void;
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchEnd: () => void;
  };
  progress: number;
  isPressed: boolean;
}

export function useLongPress({ onLongPress, duration = 2000 }: UseLongPressOptions): UseLongPressResult {
  const [progress, setProgress] = useState(0);
  const [isPressed, setIsPressed] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  const start = useCallback(() => {
    setIsPressed(true);
    startTimeRef.current = Date.now();
    setProgress(0);

    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const p = Math.min(elapsed / duration, 1);
      setProgress(p);
    }, 16);

    timerRef.current = setTimeout(() => {
      cleanup();
      setProgress(1);
      onLongPress();
    }, duration);
  }, [duration, onLongPress]);

  const cleanup = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPressed(false);
    setProgress(0);
  }, []);

  const handlers = {
    onMouseDown: start,
    onMouseUp: cleanup,
    onMouseLeave: cleanup,
    onTouchStart: (e: React.TouchEvent) => {
      e.preventDefault();
      start();
    },
    onTouchEnd: cleanup,
  };

  return { handlers, progress, isPressed };
}
