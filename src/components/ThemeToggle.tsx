import React, { useState } from 'react';
import { Moon, Sun, Settings } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { SettingsModal } from './SettingsModal';

export const ThemeToggle: React.FC = () => {
  const { isDarkMode, themeStyle, toggleTheme } = useTheme();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 flex gap-3">
        {/* Settings Button */}
        <button
          onClick={() => setIsSettingsOpen(true)}
          className={`p-3 rounded-xl transition-all duration-300 hover:scale-105 hover:rotate-12 ${
            themeStyle === 'modern'
              ? 'glass hover:glass-strong'
              : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-lg border border-gray-200 dark:border-gray-700'
          }`}
          aria-label="Open settings"
        >
          <Settings className={`w-5 h-5 drop-shadow-lg ${
            themeStyle === 'modern'
              ? 'text-gray-600 dark:text-gray-400'
              : 'text-gray-700 dark:text-gray-300'
          }`} />
        </button>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className={`p-3 rounded-xl transition-all duration-300 hover:scale-105 hover:rotate-12 ${
            themeStyle === 'modern'
              ? 'glass hover:glass-strong'
              : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-lg border border-gray-200 dark:border-gray-700'
          }`}
          aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDarkMode ? (
            <Sun className="w-5 h-5 text-yellow-400 drop-shadow-lg" />
          ) : (
            <Moon className="w-5 h-5 text-indigo-600 drop-shadow-lg" />
          )}
        </button>
      </div>
      {/* Settings Modal */}
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </>
  );
};