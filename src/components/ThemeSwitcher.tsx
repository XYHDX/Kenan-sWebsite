'use client';

import { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { STORAGE_KEYS } from '@/lib/localStorage';
import { applyTheme } from '@/lib/themeUtils';
import { Palette } from 'lucide-react';

interface ThemeSwitcherProps {
  className?: string;
}

const themes = [
  { name: 'Blue', value: 'blue', color: 'bg-blue-500' },
  { name: 'Green', value: 'green', color: 'bg-green-500' },
  { name: 'Purple', value: 'purple', color: 'bg-purple-500' },
  { name: 'Orange', value: 'orange', color: 'bg-orange-500' },
];

const ThemeSwitcher = ({ className = '' }: ThemeSwitcherProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useLocalStorage(STORAGE_KEYS.SETTINGS, {
    customTheme: 'blue',
  });

  const currentTheme = themes.find(theme => theme.value === settings.customTheme);

  const handleThemeChange = (themeValue: string) => {
    // Update settings in localStorage
    setSettings({
      ...settings,
      customTheme: themeValue,
    });
    
    // Apply the theme immediately
    applyTheme(themeValue);
    
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-accent transition-colors"
      >
        <Palette size={16} className="text-primary" />
        <span className="text-sm font-medium">Theme</span>
        {currentTheme && (
          <div className={`w-4 h-4 rounded-full ${currentTheme.color}`} />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-border">
          {themes.map((theme) => (
            <button
              key={theme.value}
              onClick={() => handleThemeChange(theme.value)}
              className="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-accent transition-colors"
            >
              <div className={`w-4 h-4 rounded-full ${theme.color} mr-2`} />
              <span>{theme.name}</span>
              {theme.value === settings.customTheme && (
                <span className="ml-auto text-primary">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ThemeSwitcher; 