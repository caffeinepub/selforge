import { useState } from 'react';
import { useAppStore, OLED_ACCENT_COLORS } from '../lib/store';
import { Zap, ChevronDown } from 'lucide-react';

export default function OledModeToggle() {
  const { oledMode, toggleOledMode, oledAccentColorId, setOledAccentColor } = useAppStore();
  const [showPicker, setShowPicker] = useState(false);

  const activeColor = OLED_ACCENT_COLORS.find(c => c.id === oledAccentColorId) ?? OLED_ACCENT_COLORS[0];
  const hex = activeColor.hex;

  return (
    <div className="relative flex flex-col items-end gap-1">
      {/* Main toggle row */}
      <div className="flex items-center gap-1">
        {/* Color picker trigger — only visible when OLED is on */}
        {oledMode && (
          <button
            onClick={() => setShowPicker(v => !v)}
            className="flex items-center gap-1 px-2 py-1.5 rounded-full border text-[10px] font-semibold tracking-widest uppercase transition-all duration-200"
            style={{
              background: `${hex}18`,
              borderColor: `${hex}80`,
              color: hex,
              boxShadow: `0 0 6px ${hex}50`,
            }}
            title="Change accent color"
          >
            <span
              className="w-3 h-3 rounded-full border"
              style={{ background: hex, borderColor: `${hex}CC`, boxShadow: `0 0 4px ${hex}` }}
            />
            <ChevronDown
              className="w-2.5 h-2.5"
              style={{ color: hex, transform: showPicker ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
            />
          </button>
        )}

        {/* OLED toggle button */}
        <button
          onClick={toggleOledMode}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-semibold tracking-widest uppercase transition-all duration-300"
          style={
            oledMode
              ? {
                  background: `${hex}15`,
                  borderColor: hex,
                  color: hex,
                  boxShadow: `0 0 10px ${hex}70, 0 0 20px ${hex}30, inset 0 0 8px ${hex}10`,
                }
              : {
                  background: 'rgba(255,255,255,0.05)',
                  borderColor: 'rgba(255,255,255,0.2)',
                  color: 'rgba(255,255,255,0.5)',
                }
          }
          title={oledMode ? 'Disable OLED Mode' : 'Enable OLED Mode'}
        >
          <Zap
            className="w-3 h-3"
            style={
              oledMode
                ? { color: hex, filter: `drop-shadow(0 0 3px ${hex})` }
                : { color: 'rgba(255,255,255,0.5)' }
            }
          />
          <span style={oledMode ? { color: hex, textShadow: `0 0 6px ${hex}` } : {}}>
            OLED
          </span>
          {oledMode && (
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: hex, boxShadow: `0 0 4px ${hex}` }}
            />
          )}
        </button>
      </div>

      {/* Color picker dropdown */}
      {oledMode && showPicker && (
        <div
          className="absolute top-full right-0 mt-1.5 z-50 rounded-xl border p-2.5"
          style={{
            background: '#0a0a0a',
            borderColor: `${hex}50`,
            boxShadow: `0 0 20px ${hex}30, 0 8px 32px rgba(0,0,0,0.8)`,
            minWidth: '220px',
          }}
        >
          <p
            className="text-[9px] font-bold tracking-widest uppercase mb-2 px-0.5"
            style={{ color: `${hex}90` }}
          >
            Accent Color
          </p>
          <div className="grid grid-cols-6 gap-1.5">
            {OLED_ACCENT_COLORS.map((color) => {
              const isSelected = color.id === oledAccentColorId;
              return (
                <button
                  key={color.id}
                  onClick={() => {
                    setOledAccentColor(color.id);
                    setShowPicker(false);
                  }}
                  title={color.label}
                  className="relative w-7 h-7 rounded-full transition-all duration-150 flex items-center justify-center"
                  style={{
                    background: color.hex,
                    boxShadow: isSelected
                      ? `0 0 0 2px #0a0a0a, 0 0 0 3.5px ${color.hex}, 0 0 10px ${color.hex}80`
                      : `0 0 6px ${color.hex}40`,
                    transform: isSelected ? 'scale(1.18)' : 'scale(1)',
                  }}
                >
                  {isSelected && (
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ background: '#000', opacity: 0.7 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
          <p
            className="text-[9px] mt-2 px-0.5 font-medium"
            style={{ color: `${hex}70` }}
          >
            {activeColor.label}
          </p>
        </div>
      )}
    </div>
  );
}
