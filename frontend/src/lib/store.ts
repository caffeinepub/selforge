import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// ── Types ──────────────────────────────────────────────────────────────────

interface StudyTopic {
  id: string;
  subject: string;
  chapter: string;
  status: 'done' | 'pending' | 'later';
  date: string;
}

interface GymActivity {
  id: string;
  type: 'gym' | 'cardio';
  muscleGroup?: string;
  exerciseName?: string;
  sets?: number;
  reps?: number;
  weight?: number;
  activityType?: string;
  duration?: number;
  caloriesBurned: number;
  date: string;
  description?: string;
  summary?: string;
}

interface FoodEntry {
  id: string;
  name: string;
  quantity: number;
  brand?: string;
  calories: number;
  protein: number;
  sugar: number;
  date: string;
  description?: string;
  summary?: string;
}

interface GoalsCompleted {
  study: boolean;
  gym: boolean;
  nutrition: boolean;
  sleep: boolean;
  discipline: boolean;
}

interface GoalManualOverrides {
  study: boolean;
  gym: boolean;
  nutrition: boolean;
  sleep: boolean;
  discipline: boolean;
}

export interface BodyMeasurements {
  chest: number;
  waist: number;
  butt: number;
  thighs: number;
  weight: number;
  height: number;
}

interface DailyData {
  date: string;
  studyTopics: StudyTopic[];
  gymActivities: GymActivity[];
  foodEntries: FoodEntry[];
  goalsCompleted: GoalsCompleted;
  goalManualOverrides: GoalManualOverrides;
  wentToSchool: boolean;
}

export interface ProtocolSession {
  id: string;
  subject: string;
  topic: string;
  durationSeconds: number;
  timestamp: number;
}

export interface StreakHistoryEntry {
  startDate: string;
  endDate: string;
  lengthDays: number;
}

// ── OLED Accent Color Palette ──────────────────────────────────────────────
export interface OledAccentColor {
  id: string;
  label: string;
  hex: string;
  oklch: string;
}

export const OLED_ACCENT_COLORS: OledAccentColor[] = [
  { id: 'electric-violet',   label: 'Electric Violet',  hex: '#7B00FF', oklch: 'oklch(0.42 0.31 293)' },
  { id: 'crimson',           label: 'Crimson',           hex: '#DC143C', oklch: 'oklch(0.52 0.26 18)'  },
  { id: 'radioactive-green', label: 'Radioactive Green', hex: '#39FF14', oklch: 'oklch(0.87 0.35 140)' },
  { id: 'hot-pink',          label: 'Hot Pink',          hex: '#FF0090', oklch: 'oklch(0.58 0.32 335)' },
  { id: 'cyber-yellow',      label: 'Cyber Yellow',      hex: '#FFE600', oklch: 'oklch(0.93 0.22 100)' },
  { id: 'sky-blue',          label: 'Sky Blue',          hex: '#00BFFF', oklch: 'oklch(0.72 0.18 220)' },
  { id: 'coral',             label: 'Coral',             hex: '#FF4500', oklch: 'oklch(0.60 0.26 35)'  },
  { id: 'teal',              label: 'Teal',              hex: '#00E5CC', oklch: 'oklch(0.82 0.18 180)' },
  { id: 'amber',             label: 'Amber',             hex: '#FF8C00', oklch: 'oklch(0.70 0.22 60)'  },
  { id: 'rose',              label: 'Rose',              hex: '#FF2D6B', oklch: 'oklch(0.60 0.28 355)' },
  { id: 'lime',              label: 'Lime',              hex: '#AAFF00', oklch: 'oklch(0.90 0.28 120)' },
  { id: 'indigo',            label: 'Indigo',            hex: '#4040FF', oklch: 'oklch(0.48 0.28 265)' },
  { id: 'orange',            label: 'Orange',            hex: '#FF6200', oklch: 'oklch(0.65 0.24 48)'  },
  { id: 'mint',              label: 'Mint',              hex: '#00FF9F', oklch: 'oklch(0.88 0.25 160)' },
  { id: 'magenta',           label: 'Magenta',           hex: '#FF00FF', oklch: 'oklch(0.60 0.35 310)' },
  { id: 'gold',              label: 'Gold',              hex: '#FFD700', oklch: 'oklch(0.90 0.20 88)'  },
  { id: 'ice-blue',          label: 'Ice Blue',          hex: '#00FFFF', oklch: 'oklch(0.90 0.18 195)' },
  { id: 'blood-orange',      label: 'Blood Orange',      hex: '#FF3300', oklch: 'oklch(0.57 0.27 28)'  },
];

export const GOAL_COLORS: Record<string, OledAccentColor> = {
  study:      { id: 'electric-violet',   label: 'Electric Violet',  hex: '#7B00FF', oklch: 'oklch(0.42 0.31 293)' },
  gym:        { id: 'crimson',           label: 'Crimson',           hex: '#DC143C', oklch: 'oklch(0.52 0.26 18)'  },
  nutrition:  { id: 'radioactive-green', label: 'Radioactive Green', hex: '#39FF14', oklch: 'oklch(0.87 0.35 140)' },
  sleep:      { id: 'sky-blue',          label: 'Sky Blue',          hex: '#00BFFF', oklch: 'oklch(0.72 0.18 220)' },
  discipline: { id: 'amber',             label: 'Amber',             hex: '#FF8C00', oklch: 'oklch(0.70 0.22 60)'  },
};

// ── Store Interface ────────────────────────────────────────────────────────

interface AppState {
  dailyData: Record<string, DailyData>;
  currentStreak: number;
  userName: string;
  userAge: number;
  userGender: string;
  onboardingCompleted: boolean;
  userStartTimestamp: number | null;
  weeklyMeasurements: BodyMeasurements;
  monthlyMeasurements: BodyMeasurements;
  oledMode: boolean;
  oledAccentColorId: string;
  protocolSessions: ProtocolSession[];
  streakHistory: StreakHistoryEntry[];

  getTodayData: () => DailyData;
  addStudyTopic: (topic: Omit<StudyTopic, 'id' | 'date'>) => void;
  updateStudyTopicStatus: (id: string, status: StudyTopic['status']) => void;
  updateStudyTopic: (id: string, updates: Partial<Pick<StudyTopic, 'status' | 'subject' | 'chapter'>>) => void;
  deleteStudyTopic: (id: string) => void;
  addGymActivity: (activity: Omit<GymActivity, 'id' | 'date'>) => void;
  addFoodEntry: (food: Omit<FoodEntry, 'id' | 'date'>) => void;
  updateGoal: (goal: keyof GoalsCompleted, completed: boolean) => void;
  setWentToSchool: (went: boolean) => void;
  calculateStreak: () => void;
  setUserName: (name: string) => void;
  setUserAge: (age: number) => void;
  setUserGender: (gender: string) => void;
  completeOnboarding: () => void;
  clearAllSettings: () => void;
  setWeeklyMeasurements: (measurements: Partial<BodyMeasurements>) => void;
  setMonthlyMeasurements: (measurements: Partial<BodyMeasurements>) => void;
  toggleOledMode: () => void;
  setOledAccentColor: (id: string) => void;
  addProtocolSession: (subject: string, topic: string, durationSeconds: number) => void;
  addStreakHistory: (entry: StreakHistoryEntry) => void;
}

// ── Helpers ────────────────────────────────────────────────────────────────

const getTodayString = () => new Date().toISOString().split('T')[0];

const getEmptyDailyData = (date: string): DailyData => ({
  date,
  studyTopics: [],
  gymActivities: [],
  foodEntries: [],
  goalsCompleted: {
    study: false,
    gym: false,
    nutrition: false,
    sleep: false,
    discipline: false,
  },
  goalManualOverrides: {
    study: false,
    gym: false,
    nutrition: false,
    sleep: false,
    discipline: false,
  },
  wentToSchool: false,
});

const getEmptyMeasurements = (): BodyMeasurements => ({
  chest: 0,
  waist: 0,
  butt: 0,
  thighs: 0,
  weight: 0,
  height: 0,
});

// ── Store ──────────────────────────────────────────────────────────────────

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      dailyData: {},
      currentStreak: 0,
      userName: '',
      userAge: 0,
      userGender: '',
      onboardingCompleted: false,
      userStartTimestamp: null,
      weeklyMeasurements: getEmptyMeasurements(),
      monthlyMeasurements: getEmptyMeasurements(),
      oledMode: false,
      oledAccentColorId: 'electric-violet',
      protocolSessions: [],
      streakHistory: [],

      getTodayData: () => {
        const today = getTodayString();
        const state = get();
        if (!state.dailyData[today]) {
          set((s) => ({
            dailyData: {
              ...s.dailyData,
              [today]: getEmptyDailyData(today),
            },
          }));
        }
        return get().dailyData[today];
      },

      addStudyTopic: (topic) => {
        const today = getTodayString();
        set((state) => {
          const todayData = state.dailyData[today] || getEmptyDailyData(today);
          const newTopic: StudyTopic = {
            ...topic,
            id: `${Date.now()}-${Math.random()}`,
            date: today,
          };
          const updatedTopics = [...todayData.studyTopics, newTopic];
          const allDone = updatedTopics.filter(t => t.status !== 'later').every(t => t.status === 'done');
          const shouldAutoUpdate = !todayData.goalManualOverrides.study;
          return {
            dailyData: {
              ...state.dailyData,
              [today]: {
                ...todayData,
                studyTopics: updatedTopics,
                goalsCompleted: {
                  ...todayData.goalsCompleted,
                  study: shouldAutoUpdate ? (allDone && updatedTopics.length > 0) : todayData.goalsCompleted.study,
                },
              },
            },
          };
        });
        get().calculateStreak();
      },

      updateStudyTopicStatus: (id, status) => {
        const today = getTodayString();
        set((state) => {
          const todayData = state.dailyData[today] || getEmptyDailyData(today);
          const updatedTopics = todayData.studyTopics.map((t) =>
            t.id === id ? { ...t, status } : t
          );
          const allDone = updatedTopics.filter(t => t.status !== 'later').every(t => t.status === 'done');
          const shouldAutoUpdate = !todayData.goalManualOverrides.study;
          return {
            dailyData: {
              ...state.dailyData,
              [today]: {
                ...todayData,
                studyTopics: updatedTopics,
                goalsCompleted: {
                  ...todayData.goalsCompleted,
                  study: shouldAutoUpdate ? (allDone && updatedTopics.length > 0) : todayData.goalsCompleted.study,
                },
              },
            },
          };
        });
        get().calculateStreak();
      },

      updateStudyTopic: (id, updates) => {
        const today = getTodayString();
        set((state) => {
          const todayData = state.dailyData[today] || getEmptyDailyData(today);
          const updatedTopics = todayData.studyTopics.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          );
          const allDone = updatedTopics.filter(t => t.status !== 'later').every(t => t.status === 'done');
          const shouldAutoUpdate = !todayData.goalManualOverrides.study;
          return {
            dailyData: {
              ...state.dailyData,
              [today]: {
                ...todayData,
                studyTopics: updatedTopics,
                goalsCompleted: {
                  ...todayData.goalsCompleted,
                  study: shouldAutoUpdate ? (allDone && updatedTopics.length > 0) : todayData.goalsCompleted.study,
                },
              },
            },
          };
        });
        get().calculateStreak();
      },

      deleteStudyTopic: (id) => {
        const today = getTodayString();
        set((state) => {
          const todayData = state.dailyData[today] || getEmptyDailyData(today);
          const updatedTopics = todayData.studyTopics.filter((t) => t.id !== id);
          const allDone = updatedTopics.filter(t => t.status !== 'later').every(t => t.status === 'done');
          const shouldAutoUpdate = !todayData.goalManualOverrides.study;
          return {
            dailyData: {
              ...state.dailyData,
              [today]: {
                ...todayData,
                studyTopics: updatedTopics,
                goalsCompleted: {
                  ...todayData.goalsCompleted,
                  study: shouldAutoUpdate ? (allDone && updatedTopics.length > 0) : todayData.goalsCompleted.study,
                },
              },
            },
          };
        });
        get().calculateStreak();
      },

      addGymActivity: (activity) => {
        const today = getTodayString();
        set((state) => {
          const todayData = state.dailyData[today] || getEmptyDailyData(today);
          const newActivity: GymActivity = {
            ...activity,
            id: `${Date.now()}-${Math.random()}`,
            date: today,
          };
          const shouldAutoUpdate = !todayData.goalManualOverrides.gym;
          return {
            dailyData: {
              ...state.dailyData,
              [today]: {
                ...todayData,
                gymActivities: [...todayData.gymActivities, newActivity],
                goalsCompleted: {
                  ...todayData.goalsCompleted,
                  gym: shouldAutoUpdate ? true : todayData.goalsCompleted.gym,
                },
              },
            },
          };
        });
        get().calculateStreak();
      },

      addFoodEntry: (food) => {
        const today = getTodayString();
        set((state) => {
          const todayData = state.dailyData[today] || getEmptyDailyData(today);
          const newFood: FoodEntry = {
            ...food,
            id: `${Date.now()}-${Math.random()}`,
            date: today,
          };
          const shouldAutoUpdate = !todayData.goalManualOverrides.nutrition;
          return {
            dailyData: {
              ...state.dailyData,
              [today]: {
                ...todayData,
                foodEntries: [...todayData.foodEntries, newFood],
                goalsCompleted: {
                  ...todayData.goalsCompleted,
                  nutrition: shouldAutoUpdate ? true : todayData.goalsCompleted.nutrition,
                },
              },
            },
          };
        });
        get().calculateStreak();
      },

      updateGoal: (goal, completed) => {
        const today = getTodayString();
        set((state) => {
          const todayData = state.dailyData[today] || getEmptyDailyData(today);
          return {
            dailyData: {
              ...state.dailyData,
              [today]: {
                ...todayData,
                goalsCompleted: {
                  ...todayData.goalsCompleted,
                  [goal]: completed,
                },
                goalManualOverrides: {
                  ...todayData.goalManualOverrides,
                  [goal]: true,
                },
              },
            },
          };
        });
        get().calculateStreak();
      },

      setWentToSchool: (went) => {
        const today = getTodayString();
        set((state) => {
          const todayData = state.dailyData[today] || getEmptyDailyData(today);
          return {
            dailyData: {
              ...state.dailyData,
              [today]: {
                ...todayData,
                wentToSchool: went,
              },
            },
          };
        });
      },

      calculateStreak: () => {
        const state = get();
        const sortedDates = Object.keys(state.dailyData).sort().reverse();
        let streak = 0;
        const today = getTodayString();

        for (let i = 0; i < sortedDates.length; i++) {
          const date = sortedDates[i];
          const data = state.dailyData[date];
          const completedGoals = Object.values(data.goalsCompleted).filter(Boolean).length;

          if (completedGoals >= 3) {
            streak++;
          } else {
            if (date !== today) break;
          }

          if (i > 0) {
            const prevDate = new Date(sortedDates[i - 1]);
            const currDate = new Date(date);
            const diffTime = Math.abs(prevDate.getTime() - currDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays > 1) break;
          }
        }

        set({ currentStreak: streak });
      },

      setUserName: (name) => set({ userName: name }),
      setUserAge: (age) => set({ userAge: age }),
      setUserGender: (gender) => set({ userGender: gender }),

      completeOnboarding: () => {
        const state = get();
        if (!state.userStartTimestamp) {
          set({ onboardingCompleted: true, userStartTimestamp: Date.now() });
        } else {
          set({ onboardingCompleted: true });
        }
      },

      clearAllSettings: () => {
        set({
          userName: '',
          userAge: 0,
          userGender: '',
          onboardingCompleted: false,
          userStartTimestamp: null,
          weeklyMeasurements: getEmptyMeasurements(),
          monthlyMeasurements: getEmptyMeasurements(),
        });
      },

      setWeeklyMeasurements: (measurements) => {
        set((state) => ({
          weeklyMeasurements: { ...state.weeklyMeasurements, ...measurements },
        }));
      },

      setMonthlyMeasurements: (measurements) => {
        set((state) => ({
          monthlyMeasurements: { ...state.monthlyMeasurements, ...measurements },
        }));
      },

      toggleOledMode: () => set((state) => ({ oledMode: !state.oledMode })),

      setOledAccentColor: (id: string) => set({ oledAccentColorId: id }),

      addProtocolSession: (subject, topic, durationSeconds) => {
        set((state) => ({
          protocolSessions: [
            ...state.protocolSessions,
            {
              id: `${Date.now()}-${Math.random()}`,
              subject,
              topic,
              durationSeconds,
              timestamp: Date.now(),
            },
          ],
        }));
      },

      addStreakHistory: (entry) => {
        set((state) => ({
          streakHistory: [...state.streakHistory, entry],
        }));
      },
    }),
    {
      name: 'axiom-app-storage',
      version: 3,
      storage: createJSONStorage(() => localStorage),
      migrate: (persistedState: unknown, version: number) => {
        const state = persistedState as Record<string, unknown>;
        if (version < 3) {
          // Carry forward all existing data, add new fields with defaults
          return {
            ...state,
            userAge: (state.userAge as number) ?? 0,
            userGender: (state.userGender as string) ?? '',
            streakHistory: (state.streakHistory as StreakHistoryEntry[]) ?? [],
          };
        }
        return state;
      },
    }
  )
);
