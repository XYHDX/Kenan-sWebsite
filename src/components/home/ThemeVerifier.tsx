'use client';

import { useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { STORAGE_KEYS } from '@/lib/localStorage';

const ThemeVerifier = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [settings] = useLocalStorage(STORAGE_KEYS.SETTINGS, {
    customTheme: 'blue',
  });
  
  // Force component to re-render when theme changes
  const [, forceUpdate] = useState({});
  
  useEffect(() => {
    // Update component when theme changes
    console.log('ThemeVerifier theme:', settings.customTheme);
    forceUpdate({});
    
    // Listen for theme changes
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'attributes' && 
            (mutation.attributeName === 'class' || 
             mutation.target === document.documentElement || 
             mutation.target === document.body)) {
          forceUpdate({});
        }
      }
    });
    
    observer.observe(document.documentElement, { attributes: true });
    observer.observe(document.body, { attributes: true });
    
    return () => observer.disconnect();
  }, [settings.customTheme]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg z-50 border border-gray-200 dark:border-gray-700 max-w-xs">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Theme Verification</h3>
        <p className="text-sm text-gray-700 dark:text-gray-300">These color blocks should match your current theme:</p>
      </div>
      
      <div className="space-y-2">
        <div className="flex space-x-2">
          <div className="flex-1">
            <div 
              className="p-4 bg-primary text-primary-foreground rounded-md text-center"
            >
              Primary
            </div>
          </div>
          <div className="flex-1">
            <div 
              className="p-4 bg-primary text-primary-foreground rounded-md text-center"
            >
              Primary Hover
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <div className="flex-1">
            <div 
              className="p-4 bg-secondary text-secondary-foreground rounded-md text-center"
            >
              Secondary
            </div>
          </div>
          <div className="flex-1">
            <div 
              className="p-4 bg-secondary text-secondary-foreground rounded-md text-center"
            >
              Secondary Hover
            </div>
          </div>
        </div>
      </div>
      
      <button 
        onClick={() => setIsVisible(false)}
        className="mt-4 w-full py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-center"
      >
        Close
      </button>
    </div>
  );
};

export default ThemeVerifier; 