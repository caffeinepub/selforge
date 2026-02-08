import { useAppStore } from './store';

/**
 * Get the runtime API Ninjas API key.
 * Checks the persisted Zustand store first, then falls back to environment variable.
 */
export function getCaloriesBurnedApiKey(): string {
  const savedKey = useAppStore.getState().apiNinjasKey;
  if (savedKey) {
    return savedKey;
  }
  return import.meta.env.VITE_API_NINJAS_KEY || '';
}
