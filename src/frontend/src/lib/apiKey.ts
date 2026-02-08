import { useAppStore } from './store';

/**
 * Get the runtime DeepSeek API key.
 * Checks the persisted Zustand store first, then falls back to environment variable.
 */
export function getRuntimeApiKey(): string {
  const savedKey = useAppStore.getState().deepseekApiKey;
  if (savedKey) {
    return savedKey;
  }
  return import.meta.env.VITE_DEEPSEEK_API_KEY || '';
}
