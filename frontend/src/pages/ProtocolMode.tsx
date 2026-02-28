import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAppStore } from '../lib/store';
import { useLongPress } from '../hooks/useLongPress';
import InboundSignalOverlay from '../components/InboundSignalOverlay';
import { ShieldAlert, Brain } from 'lucide-react';

interface ProtocolModeProps {
  subject: string;
  topic: string;
  onExit: () => void;
}

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [h, m, s].map((v) => String(v).padStart(2, '0')).join(':');
}

function formatHoldTime(progress: number, duration: number): string {
  const remaining = Math.ceil((1 - progress) * (duration / 1000));
  return `${remaining}s`;
}

const TERMINATE_DURATION = 3000; // 3 seconds in ms

export default function ProtocolMode({ subject, topic, onExit }: ProtocolModeProps) {
  const { addProtocolSession } = useAppStore();
  const [elapsed, setElapsed] = useState(0);
  const [showInbound, setShowInbound] = useState(false);
  const [inboundCaller, setInboundCaller] = useState('Unknown Signal');
  const [terminated, setTerminated] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Keep a ref to elapsed so the long-press callback always reads the latest value
  const elapsedRef = useRef(0);
  useEffect(() => {
    elapsedRef.current = elapsed;
  }, [elapsed]);

  // Lock navigation: push a dummy history entry so back button doesn't leave
  useEffect(() => {
    window.history.pushState({ protocol: true }, '');
    const handlePopState = () => {
      window.history.pushState({ protocol: true }, '');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Ascending stopwatch
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setElapsed((prev) => {
        const next = prev + 1;
        elapsedRef.current = next;
        return next;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Simulate an inbound signal after 8 seconds for demo
  useEffect(() => {
    const timer = setTimeout(() => {
      setInboundCaller('Incoming: Contact');
      setShowInbound(true);
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  // Use a stable ref for the terminate handler so useLongPress never captures a stale closure
  const handleTerminateRef = useRef<() => void>(() => {});

  const handleTerminate = useCallback(() => {
    if (terminated) return;
    setTerminated(true);
    if (intervalRef.current) clearInterval(intervalRef.current);
    addProtocolSession(subject, topic, elapsedRef.current);
    setTimeout(onExit, 300);
  }, [terminated, subject, topic, addProtocolSession, onExit]);

  // Keep the ref up to date
  useEffect(() => {
    handleTerminateRef.current = handleTerminate;
  }, [handleTerminate]);

  // Stable callback that delegates to the ref — useLongPress captures this once
  const stableTerminate = useCallback(() => {
    handleTerminateRef.current();
  }, []);

  const { handlers: longPressHandlers, progress, isPressed } = useLongPress({
    onLongPress: stableTerminate,
    duration: TERMINATE_DURATION,
  });

  // SVG ring dimensions
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className="fixed inset-0 bg-black z-[100] flex flex-col select-none overflow-hidden">
      {/* Inbound Signal Overlay */}
      {showInbound && (
        <InboundSignalOverlay
          callerName={inboundCaller}
          onDismiss={() => setShowInbound(false)}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-8 pb-4">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-[#7B00FF]" style={{ filter: 'drop-shadow(0 0 6px #7B00FF)' }} />
          <span className="text-[10px] text-[#7B00FF] uppercase tracking-[0.25em] font-semibold">Protocol Active</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-[#7B00FF] animate-pulse" />
          <span className="text-[10px] text-white/30 uppercase tracking-widest">Locked</span>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-8">
        {/* Subject / Topic */}
        <div className="text-center space-y-2">
          <p className="text-[10px] text-white/30 uppercase tracking-[0.3em]">Subject</p>
          <h2 className="text-xl font-bold text-white tracking-wide">{subject}</h2>
          <div className="w-12 h-px bg-[#7B00FF]/40 mx-auto" />
          <p className="text-[10px] text-white/30 uppercase tracking-[0.3em]">Topic</p>
          <h3 className="text-base font-medium text-[#7B00FF]" style={{ textShadow: '0 0 12px #7B00FF80' }}>
            {topic}
          </h3>
        </div>

        {/* Stopwatch */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 mb-1">
            <Brain className="w-4 h-4 text-white/30" />
            <span className="text-[10px] text-white/30 uppercase tracking-[0.25em]">Mental Volume</span>
          </div>
          <div
            className="font-mono text-6xl font-black tracking-wider text-white"
            style={{
              textShadow: '0 0 20px rgba(123,0,255,0.4), 0 0 40px rgba(123,0,255,0.2)',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {formatTime(elapsed)}
          </div>
          <p className="text-[10px] text-white/20 tracking-widest uppercase">HH : MM : SS</p>
        </div>

        {/* Lockdown notice */}
        <div className="border border-white/5 rounded-lg px-4 py-3 bg-white/[0.02] max-w-xs text-center">
          <p className="text-[10px] text-white/25 leading-relaxed">
            Navigation gestures disabled · Calls silenced · Focus enforced
          </p>
          <p className="text-[9px] text-white/15 mt-1">
            Web-layer simulation — OS-level controls require native app
          </p>
        </div>
      </div>

      {/* 3-second hold-to-terminate */}
      <div className="flex flex-col items-center gap-3 pb-12 px-6">
        <p className="text-[10px] text-white/25 uppercase tracking-widest">
          Hold 3 sec to terminate session
        </p>

        <div className="relative flex items-center justify-center">
          {/* Progress ring */}
          <svg
            width="128"
            height="128"
            viewBox="0 0 128 128"
            style={{ transform: 'rotate(-90deg)' }}
          >
            {/* Background ring */}
            <circle
              cx="64"
              cy="64"
              r={radius}
              fill="none"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="3"
            />
            {/* Progress ring */}
            <circle
              cx="64"
              cy="64"
              r={radius}
              fill="none"
              stroke={isPressed ? '#DC143C' : 'rgba(220,20,60,0.25)'}
              strokeWidth="3"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{
                transition: isPressed ? 'none' : 'stroke-dashoffset 0.1s ease',
                filter: isPressed ? 'drop-shadow(0 0 8px #DC143C)' : 'none',
              }}
            />
          </svg>

          {/* Inner button */}
          <button
            {...longPressHandlers}
            disabled={terminated}
            className={`absolute w-24 h-24 rounded-full border-2 flex flex-col items-center justify-center gap-1 transition-all duration-200 cursor-pointer select-none ${
              isPressed
                ? 'border-[#DC143C] bg-[#DC143C]/20 scale-95'
                : 'border-white/15 bg-white/[0.03] hover:border-[#DC143C]/40 hover:bg-[#DC143C]/8'
            } ${terminated ? 'opacity-50 cursor-not-allowed' : ''}`}
            style={{
              boxShadow: isPressed ? '0 0 24px #DC143C50, inset 0 0 12px #DC143C15' : 'none',
              WebkitUserSelect: 'none',
              userSelect: 'none',
              touchAction: 'none',
            }}
          >
            {isPressed ? (
              <>
                <span
                  className="font-mono text-base font-bold text-[#DC143C] tabular-nums"
                  style={{ textShadow: '0 0 8px #DC143C80' }}
                >
                  {formatHoldTime(progress, TERMINATE_DURATION)}
                </span>
                <span className="text-[8px] text-[#DC143C]/70 uppercase tracking-widest">
                  hold
                </span>
              </>
            ) : (
              <>
                <span className="text-[9px] font-bold uppercase tracking-widest text-white/30">
                  {terminated ? 'DONE' : 'END'}
                </span>
                <span className="text-[8px] text-white/15 uppercase tracking-wider">
                  3 sec
                </span>
              </>
            )}
          </button>
        </div>

        {isPressed && (
          <p className="text-[10px] text-[#DC143C]/80 uppercase tracking-widest animate-pulse">
            Keep holding… {Math.round(progress * 100)}%
          </p>
        )}
      </div>
    </div>
  );
}
