import { useState, useEffect, useRef } from 'react';
import { getFromLocalStorage, saveToLocalStorage, setupStorageListener, STORAGE_KEYS } from '@/lib/localStorage';

/**
 * Custom hook for working with localStorage data
 * Provides a state variable and setter that automatically 
 * persists to localStorage and stays in sync across components
 * 
 * @param key The localStorage key to use
 * @param defaultValue The default value to use if no value exists in localStorage
 * @returns [value, setValue, isLoading]
 */
export function useLocalStorage<T>(
  key: string, 
  defaultValue: T
): [T, (value: T) => void, boolean] {
  // Initialize state with the default value
  const [value, setValue] = useState<T>(defaultValue);
  const [isLoading, setIsLoading] = useState(true);
  const initializedRef = useRef(false);

  // Load the value from localStorage only once on mount
  useEffect(() => {
    if (!initializedRef.current) {
      try {
        const storedValue = getFromLocalStorage<T>(key, defaultValue);
        setValue(storedValue);
      } catch (error) {
        console.error(`Error reading from localStorage for key "${key}":`, error);
      } finally {
        setIsLoading(false);
        initializedRef.current = true;
      }
    }
  }, []);

  // Listen for changes to this key in localStorage from other components
  useEffect(() => {
    const cleanup = setupStorageListener(key, () => {
      try {
        console.log(`[useLocalStorage] Listener triggered for key: ${key}`);
        const newValue = getFromLocalStorage<T>(key, defaultValue);
        if (key === STORAGE_KEYS.ACHIEVEMENTS) {
          console.log('[useLocalStorage] Achievements updated in storage:', newValue);
        }
        setValue(newValue);
      } catch (error) {
        console.error(`Error updating from localStorage for key "${key}":`, error);
      }
    });

    return cleanup;
  }, [key, defaultValue]);

  // Create a function to update both state and localStorage
  const updateValue = (newValue: T) => {
    try {
      setValue(newValue);
      saveToLocalStorage(key, newValue);
    } catch (error) {
      console.error(`Error saving to localStorage for key "${key}":`, error);
    }
  };

  return [value, updateValue, isLoading];
}

export default useLocalStorage; 