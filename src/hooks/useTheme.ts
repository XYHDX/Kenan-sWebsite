import { useState, useEffect } from 'react';
// import { useLocalStorage } from '@/hooks/useLocalStorage'; // No longer needed directly
// import { STORAGE_KEYS } from '@/lib/localStorage'; // No longer needed directly
// import { applyTheme } from '@/lib/themeUtils'; // Should not apply theme here

/**
 * Custom hook to get the current theme name.
 * Listens for theme changes applied elsewhere (e.g., RootLayout).
 */
export function useTheme() {
  const [theme, setTheme] = useState<string>('blue'); // Initialize with default

  const getCurrentTheme = () => {
    if (typeof window === 'undefined') return 'blue'; // Default for SSR
    const classList = document.documentElement.classList;
    if (classList.contains('theme-green')) return 'green';
    if (classList.contains('theme-purple')) return 'purple';
    if (classList.contains('theme-orange')) return 'orange';
    return 'blue'; // Default
  };

  useEffect(() => {
    // Set initial theme based on current DOM state
    setTheme(getCurrentTheme());

    // Setup a listener for theme change events
    const handleThemeChange = (event: CustomEvent) => {
      // Use theme from event detail if available, otherwise check DOM
      setTheme(event.detail?.theme || getCurrentTheme());
    };

    window.addEventListener('themechange', handleThemeChange as EventListener);

    // Add a MutationObserver to catch direct class changes as a fallback
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          setTheme(getCurrentTheme());
        }
      }
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => {
      window.removeEventListener('themechange', handleThemeChange as EventListener);
      observer.disconnect();
    };
  }, []);

  return theme;
}

export default useTheme; 