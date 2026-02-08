import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

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

interface BodyMeasurements {
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

interface AppState {
  dailyData: Record<string, DailyData>;
  currentStreak: number;
  userName: string;
  onboardingCompleted: boolean;
  userStartTimestamp: number | null;
  weeklyMeasurements: BodyMeasurements;
  monthlyMeasurements: BodyMeasurements;
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
  completeOnboarding: () => void;
  clearAllSettings: () => void;
  setWeeklyMeasurements: (measurements: Partial<BodyMeasurements>) => void;
  setMonthlyMeasurements: (measurements: Partial<BodyMeasurements>) => void;
}

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

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      dailyData: {},
      currentStreak: 0,
      userName: '',
      onboardingCompleted: false,
      userStartTimestamp: null,
      weeklyMeasurements: getEmptyMeasurements(),
      monthlyMeasurements: getEmptyMeasurements(),

      getTodayData: () => {
        const today = getTodayString();
        const state = get();
        if (!state.dailyData[today]) {
          set((state) => ({
            dailyData: {
              ...state.dailyData,
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
          
          // Only auto-update if not manually overridden
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
          
          // Only auto-update if not manually overridden
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
          
          // Only auto-update if not manually overridden
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
          
          // Only auto-update if not manually overridden
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
          
          // Only auto-update if not manually overridden
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
          
          // Only auto-update if not manually overridden
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
            if (date !== today) {
              break;
            }
          }
          
          if (i > 0) {
            const prevDate = new Date(sortedDates[i - 1]);
            const currDate = new Date(date);
            const diffTime = Math.abs(prevDate.getTime() - currDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays > 1) {
              break;
            }
          }
        }
        
        set({ currentStreak: streak });
      },

      setUserName: (name) => set({ userName: name }),

      completeOnboarding: () => {
        const state = get();
        // Only set userStartTimestamp if it doesn't exist yet
        if (!state.userStartTimestamp) {
          set({
            onboardingCompleted: true,
            userStartTimestamp: Date.now(),
          });
        } else {
          set({ onboardingCompleted: true });
        }
      },

      clearAllSettings: () => {
        set({
          userName: '',
          onboardingCompleted: false,
          userStartTimestamp: null,
          weeklyMeasurements: getEmptyMeasurements(),
          monthlyMeasurements: getEmptyMeasurements(),
        });
      },

      setWeeklyMeasurements: (measurements) => {
        set((state) => ({
          weeklyMeasurements: {
            ...state.weeklyMeasurements,
            ...measurements,
          },
        }));
      },

      setMonthlyMeasurements: (measurements) => {
        set((state) => ({
          monthlyMeasurements: {
            ...state.monthlyMeasurements,
            ...measurements,
          },
        }));
      },
    }),
    {
      name: 'nuvio-app-storage',
      version: 2,
      storage: createJSONStorage(() => localStorage),
      migrate: (persistedState: any, version: number) => {
        if (version < 2) {
          // Clear old API credentials from previous versions
          const { 
            deepseekApiKey, 
            nutritionixAppId, 
            nutritionixAppKey, 
            apiNinjasKey, 
            apiNinjasKeyConfirmedAt,
            ...rest 
          } = persistedState;
          return rest;
        }
        return persistedState;
      },
    }
  )
);
