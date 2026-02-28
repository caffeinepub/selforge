import React, { useState } from 'react';
import { ArrowLeft, User, Clock, Save } from 'lucide-react';
import { useAppStore, StreakHistoryEntry } from '../lib/store';

const GENDER_OPTIONS = ['Male', 'Female', 'Other', 'Prefer not to say'];

interface SettingsProps {
  onBack: () => void;
}

export default function Settings({ onBack }: SettingsProps) {
  const {
    userName, userAge, userGender,
    setUserName, setUserAge, setUserGender,
    streakHistory,
    oledMode,
  } = useAppStore();

  const [name, setName] = useState(userName);
  const [age, setAge] = useState(userAge > 0 ? String(userAge) : '');
  const [gender, setGender] = useState(userGender);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (name.trim()) setUserName(name.trim());
    const ageNum = parseInt(age, 10);
    if (!isNaN(ageNum) && ageNum > 0) setUserAge(ageNum);
    if (gender) setUserGender(gender);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-10 pb-4 border-b border-zinc-900">
        <button
          onClick={onBack}
          className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-lg font-bold tracking-widest uppercase text-white">Settings</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 pb-28">
        {/* Profile Section */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <User size={14} className="text-violet-400" />
            <h2 className="text-xs font-bold tracking-widest uppercase text-violet-400">Profile</h2>
          </div>

          <div
            className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 space-y-4"
            style={oledMode ? { boxShadow: '0 0 20px #7B00FF22', borderColor: '#7B00FF55' } : {}}
          >
            {/* Name */}
            <div>
              <label className="block text-zinc-500 text-xs tracking-widest uppercase mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-violet-500 transition-colors"
                placeholder="Your name"
              />
            </div>

            {/* Age */}
            <div>
              <label className="block text-zinc-500 text-xs tracking-widest uppercase mb-1">Age</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                min={1}
                max={120}
                className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-violet-500 transition-colors"
                placeholder="Your age"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-zinc-500 text-xs tracking-widest uppercase mb-1">Gender</label>
              <div className="grid grid-cols-2 gap-2">
                {GENDER_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setGender(opt)}
                    className="py-2 px-3 rounded-lg text-xs font-medium border transition-all"
                    style={
                      gender === opt
                        ? {
                            background: '#7B00FF22',
                            borderColor: '#7B00FF',
                            color: '#a78bfa',
                            boxShadow: '0 0 8px #7B00FF55',
                          }
                        : {
                            background: 'transparent',
                            borderColor: '#3f3f46',
                            color: '#71717a',
                          }
                    }
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              className="w-full py-2.5 rounded-xl font-bold text-sm tracking-widest uppercase transition-all flex items-center justify-center gap-2"
              style={{
                background: saved ? '#16a34a22' : 'linear-gradient(135deg, #7B00FF, #5b21b6)',
                color: saved ? '#4ade80' : '#fff',
                border: saved ? '1px solid #16a34a' : 'none',
                boxShadow: saved ? '0 0 12px #16a34a44' : '0 0 16px #7B00FF44',
              }}
            >
              <Save size={14} />
              {saved ? 'Saved!' : 'Save Changes'}
            </button>
          </div>
        </section>

        {/* Streak History Section */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Clock size={14} className="text-violet-400" />
            <h2 className="text-xs font-bold tracking-widest uppercase text-violet-400">Streak History</h2>
          </div>

          <div
            className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden"
            style={oledMode ? { boxShadow: '0 0 20px #7B00FF22', borderColor: '#7B00FF55' } : {}}
          >
            {streakHistory.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-zinc-600 text-sm">No streak history yet.</p>
                <p className="text-zinc-700 text-xs mt-1">Complete your first streak to see it here.</p>
              </div>
            ) : (
              <div className="divide-y divide-zinc-900">
                {[...streakHistory].reverse().map((entry: StreakHistoryEntry, idx: number) => (
                  <div key={idx} className="flex items-center justify-between px-5 py-4">
                    <div>
                      <p className="text-white text-sm font-medium">
                        {formatDate(entry.startDate)} — {formatDate(entry.endDate)}
                      </p>
                      <p className="text-zinc-500 text-xs mt-0.5">
                        {entry.lengthDays} {entry.lengthDays === 1 ? 'day' : 'days'}
                      </p>
                    </div>
                    <div
                      className="px-3 py-1 rounded-full text-xs font-bold"
                      style={{
                        background: '#7B00FF22',
                        color: '#a78bfa',
                        border: '1px solid #7B00FF55',
                      }}
                    >
                      🔥 {entry.lengthDays}d
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
