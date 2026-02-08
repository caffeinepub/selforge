import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

interface DailyData {
  date: string;
  studyTopics: StudyTopic[];
  gymActivities: GymActivity[];
  foodEntries: FoodEntry[];
  goalsCompleted: GoalsCompleted;
  wentToSchool: boolean;
}

interface AppState {
  dailyData: Record<string, DailyData>;
  currentStreak: number;
  userName: string;
  deepseekApiKey: string;
  nutritionixAppId: string;
  nutritionixAppKey: string;
  apiNinjasKey: string;
  onboardingCompleted: boolean;
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
  setDeepseekApiKey: (key: string) => void;
  setNutritionixAppId: (id: string) => void;
  setNutritionixAppKey: (key: string) => void;
  setApiNinjasKey: (key: string) => void;
  completeOnboarding: () => void;
  clearAllSettings: () => void;
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
  wentToSchool: false,
});

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      dailyData: {},
      currentStreak: 0,
      userName: '',
      deepseekApiKey: '',
      nutritionixAppId: '',
      nutritionixAppKey: '',
      apiNinjasKey: '',
      onboardingCompleted: false,

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
          
          return {
            dailyData: {
              ...state.dailyData,
              [today]: {
                ...todayData,
                studyTopics: updatedTopics,
                goalsCompleted: {
                  ...todayData.goalsCompleted,
                  study: allDone && updatedTopics.length > 0,
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
          
          return {
            dailyData: {
              ...state.dailyData,
              [today]: {
                ...todayData,
                studyTopics: updatedTopics,
                goalsCompleted: {
                  ...todayData.goalsCompleted,
                  study: allDone && updatedTopics.length > 0,
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
          
          return {
            dailyData: {
              ...state.dailyData,
              [today]: {
                ...todayData,
                studyTopics: updatedTopics,
                goalsCompleted: {
                  ...todayData.goalsCompleted,
                  study: allDone && updatedTopics.length > 0,
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
          
          return {
            dailyData: {
              ...state.dailyData,
              [today]: {
                ...todayData,
                studyTopics: updatedTopics,
                goalsCompleted: {
                  ...todayData.goalsCompleted,
                  study: allDone && updatedTopics.length > 0,
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
          
          return {
            dailyData: {
              ...state.dailyData,
              [today]: {
                ...todayData,
                gymActivities: [...todayData.gymActivities, newActivity],
                goalsCompleted: {
                  ...todayData.goalsCompleted,
                  gym: true,
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
          
          return {
            dailyData: {
              ...state.dailyData,
              [today]: {
                ...todayData,
                foodEntries: [...todayData.foodEntries, newFood],
              },
            },
          };
        });
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
        let streak = 0;
        const today = new Date();
        
        for (let i = 0; i < 365; i++) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          const dateString = date.toISOString().split('T')[0];
          
          const dayData = state.dailyData[dateString];
          if (!dayData) break;
          
          const allGoalsComplete = Object.values(dayData.goalsCompleted).every(Boolean);
          if (allGoalsComplete) {
            streak++;
          } else {
            break;
          }
        }
        
        set({ currentStreak: streak });
      },

      setUserName: (name) => {
        set({ userName: name });
      },

      setDeepseekApiKey: (key) => {
        set({ deepseekApiKey: key });
      },

      setNutritionixAppId: (id) => {
        set({ nutritionixAppId: id });
      },

      setNutritionixAppKey: (key) => {
        set({ nutritionixAppKey: key });
      },

      setApiNinjasKey: (key) => {
        set({ apiNinjasKey: key });
      },

      completeOnboarding: () => {
        set({ onboardingCompleted: true });
      },

      clearAllSettings: () => {
        set({
          userName: '',
          deepseekApiKey: '',
          nutritionixAppId: '',
          nutritionixAppKey: '',
          apiNinjasKey: '',
          onboardingCompleted: false,
        });
      },
    }),
    {
      name: 'selforge-storage',
    }
  )
);
