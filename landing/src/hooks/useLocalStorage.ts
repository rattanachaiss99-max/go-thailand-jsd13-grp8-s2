import { useState, useEffect, useCallback, Dispatch, SetStateAction } from 'react';

type useLocalReturn<T> = {
  state: T;
  setState: Dispatch<SetStateAction<T>>;
  setField: <K extends keyof T>(key: K, value: T[K]) => void;
  resetState: () => void;
};

/***************************  HOOKS - LOCAL STORAGE  ***************************/

export default function useLocalStorage<T>(key: string, defaultValue: T): useLocalReturn<T> {
  // Load initial state from localStorage or fallback to default
  const readValue = (): T => {
    if (typeof window === 'undefined') return defaultValue;

    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : defaultValue;
    } catch (err) {
      console.warn(`Error reading localStorage key “${key}”:`, err);
      return defaultValue;
    }
  };

  const [state, setState] = useState<T>(readValue);

  // Sync to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (err) {
      console.warn(`Error setting localStorage key “${key}”:`, err);
    }
  }, [key, state]);

  // Update single field
  const setField = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
    setState((prev) => ({
      ...prev,
      [key]: value
    }));
  }, []);

  // Reset to defaults
  const resetState = useCallback(() => {
    setState(defaultValue);
    localStorage.setItem(key, JSON.stringify(defaultValue));
  }, [defaultValue, key]);

  return { state, setState, setField, resetState };
}
