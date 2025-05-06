/**
 * Utility functions for theme management
 */

/**
 * Force a refresh of the theme by toggling a class on the HTML element
 * This helps the browser to reapply CSS variables
 */
export const forceThemeRefresh = (): void => {
  if (typeof window !== 'undefined') {
    try {
      // Add and immediately remove a temporary class to force a repaint
      document.documentElement.classList.add('theme-repainting');
      
      // Use a short timeout to ensure the browser applies the changes
      setTimeout(() => {
        document.documentElement.classList.remove('theme-repainting');
      }, 10);
      
      // Log a debug message
      console.log('Theme refresh triggered');
    } catch (error) {
      console.error('Error refreshing theme:', error);
    }
  }
};

/**
 * Apply a specific theme to the document
 * @param theme The theme to apply (e.g., 'blue', 'green', 'purple', 'orange')
 */
export const applyTheme = (theme: string): void => {
  if (typeof window !== 'undefined') {
    try {
      // List of all available themes
      const availableThemes = ['theme-blue', 'theme-green', 'theme-purple', 'theme-orange'];
      
      // Remove all theme classes
      availableThemes.forEach(themeClass => {
        document.documentElement.classList.remove(themeClass);
      });
      
      // Add the new theme class
      document.documentElement.classList.add(`theme-${theme}`);
      
      // Force a refresh to ensure CSS variables are applied
      forceThemeRefresh();
      
      // Dispatch a custom event to notify components of theme change
      window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
      
      console.log(`Theme applied: ${theme}`);
    } catch (error) {
      console.error('Error applying theme:', error);
    }
  }
}; 