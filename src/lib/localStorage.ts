/**
 * Utility functions for managing data in localStorage
 * This centralizes storage access for all components
 */

// Function to save data to localStorage with event dispatching
export function saveToLocalStorage<T>(key: string, data: T): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new Event('storageupdate'));
    } catch (error) {
      console.error(`Error saving data to localStorage (${key}):`, error);
    }
  }
}

// Function to get data from localStorage with type safety
export function getFromLocalStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') {
    return defaultValue;
  }
  
  try {
    const storedData = localStorage.getItem(key);
    if (!storedData) {
      return defaultValue;
    }
    return JSON.parse(storedData) as T;
  } catch (error) {
    console.error(`Error retrieving data from localStorage (${key}):`, error);
    return defaultValue;
  }
}

// Setup a listener for localStorage changes
export function setupStorageListener(key: string, callback: () => void): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }
  
  const handleStorageChange = (e: StorageEvent) => {
    // Run callback if the specific key changed or if no key is specified in the event
    if (!e.key || e.key === key) {
      callback();
    }
  };
  
  // Also listen for custom storage events dispatched manually
  const handleCustomEvent = () => {
    callback();
  };
  
  window.addEventListener('storage', handleStorageChange);
  window.addEventListener('storageupdate', handleCustomEvent);
  
  // Return cleanup function
  return () => {
    window.removeEventListener('storage', handleStorageChange);
    window.removeEventListener('storageupdate', handleCustomEvent);
  };
}

// Storage keys used throughout the application
export const STORAGE_KEYS = {
  PROFILE: 'kenan_profile_data',
  EDUCATION: 'kenan_education_data',
  CERTIFICATIONS: 'kenan_certifications_data',
  EXPERIENCE: 'kenan_experience_data',
  SKILLS: 'kenan_skills_data',
  ACHIEVEMENTS: 'kenan_achievements_data',
  PUBLICATIONS: 'kenan_publications_data',
  GALLERY: 'kenan_gallery_data',
  CONTACT: 'kenan_contact_data',
  MESSAGES: 'kenan_contact_messages',
  SETTINGS: 'kenan_site_settings'
}; 