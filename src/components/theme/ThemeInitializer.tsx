'use client';

import { useEffect } from 'react';
import { applyTheme } from '@/lib/themeUtils';

/**
 * This component ensures the green theme is applied whenever any page loads.
 * It should be included in the app layout.
 */
export default function ThemeInitializer() {
  useEffect(() => {
    // Apply green theme immediately on component mount
    console.log("ThemeInitializer: Applying green theme");
    applyTheme('green');
    
    // Reapply theme when visibility changes (when tab is focused again)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log("Tab visible again: Reapplying green theme");
        applyTheme('green');
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // This component doesn't render anything
  return null;
}