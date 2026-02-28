import { useEffect, useState } from 'react';
import { PhoneIncoming, X } from 'lucide-react';

interface InboundSignalOverlayProps {
  callerName?: string;
  onDismiss: () => void;
}

export default function InboundSignalOverlay({ callerName = 'Unknown Signal', onDismiss }: InboundSignalOverlayProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 400);
    }, 4000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div
      className={`fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[720px] z-[9999] transition-all duration-400 ${
        visible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      }`}
      style={{ transition: 'transform 0.4s ease, opacity 0.4s ease' }}
    >
      <div className="mx-3 mt-3 rounded-lg border border-white/10 bg-black/90 backdrop-blur-md px-4 py-3 flex items-center gap-3">
        {/* Pulsing dot */}
        <div className="relative flex-shrink-0">
          <div className="w-2 h-2 rounded-full bg-[#39FF14] animate-ping absolute" />
          <div className="w-2 h-2 rounded-full bg-[#39FF14]" />
        </div>
        <PhoneIncoming className="w-4 h-4 text-white/60 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-white/40 uppercase tracking-widest">Inbound Signal</p>
          <p className="text-sm font-medium text-white truncate">{callerName}</p>
        </div>
        <button
          onClick={() => { setVisible(false); setTimeout(onDismiss, 400); }}
          className="text-white/30 hover:text-white/70 transition-colors flex-shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
