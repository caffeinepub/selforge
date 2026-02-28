import React, { useState } from 'react';
import { useAppStore } from '../lib/store';

interface OnboardingGateProps {
  children: React.ReactNode;
}

const GENDER_OPTIONS = ['Male', 'Female', 'Other', 'Prefer not to say'];

export default function OnboardingGate({ children }: OnboardingGateProps) {
  const {
    onboardingCompleted,
    userName,
    setUserName,
    setUserAge,
    setUserGender,
    completeOnboarding,
  } = useAppStore();

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [errors, setErrors] = useState<{ name?: string; age?: string; gender?: string }>({});

  // Already onboarded — render children
  if (onboardingCompleted && userName) {
    return <>{children}</>;
  }

  const validate = () => {
    const e: { name?: string; age?: string; gender?: string } = {};
    if (!name.trim()) e.name = 'Name is required';
    const ageNum = parseInt(age, 10);
    if (!age || isNaN(ageNum) || ageNum < 1 || ageNum > 120) e.age = 'Enter a valid age (1–120)';
    if (!gender) e.gender = 'Please select a gender';
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setUserName(name.trim());
    setUserAge(parseInt(age, 10));
    setUserGender(gender);
    completeOnboarding();
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #7B00FF 0%, transparent 70%)' }}
        />
      </div>

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo / Title */}
        <div className="text-center mb-10">
          <h1
            className="text-6xl font-black tracking-widest mb-2"
            style={{
              color: '#7B00FF',
              textShadow: '0 0 30px #7B00FF, 0 0 60px #7B00FF55',
              fontFamily: 'monospace',
            }}
          >
            AXIOM
          </h1>
          <p className="text-zinc-500 text-sm tracking-widest uppercase">App built by Aditya Raj</p>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-5"
          style={{ boxShadow: '0 0 40px #7B00FF18' }}
        >
          <p className="text-zinc-400 text-xs tracking-widest uppercase text-center mb-2">
            Initialize your profile
          </p>

          {/* Name */}
          <div>
            <label className="block text-zinc-400 text-xs tracking-widest uppercase mb-1">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErrors((prev) => ({ ...prev, name: undefined }));
              }}
              placeholder="Your name"
              className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-violet-500 transition-colors"
              autoComplete="off"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Age */}
          <div>
            <label className="block text-zinc-400 text-xs tracking-widest uppercase mb-1">
              Age
            </label>
            <input
              type="number"
              value={age}
              onChange={(e) => {
                setAge(e.target.value);
                setErrors((prev) => ({ ...prev, age: undefined }));
              }}
              placeholder="Your age"
              min={1}
              max={120}
              className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-violet-500 transition-colors"
            />
            {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
          </div>

          {/* Gender */}
          <div>
            <label className="block text-zinc-400 text-xs tracking-widest uppercase mb-1">
              Gender
            </label>
            <div className="grid grid-cols-2 gap-2">
              {GENDER_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    setGender(opt);
                    setErrors((prev) => ({ ...prev, gender: undefined }));
                  }}
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
            {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl font-bold text-sm tracking-widest uppercase transition-all mt-2"
            style={{
              background: 'linear-gradient(135deg, #7B00FF, #5b21b6)',
              color: '#fff',
              boxShadow: '0 0 20px #7B00FF55',
            }}
          >
            Initialize
          </button>
        </form>
      </div>
    </div>
  );
}
