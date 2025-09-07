import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-6 right-6 z-50 p-3 rounded-xl glass hover:glass-strong transition-all duration-300 hover:scale-105 hover:rotate-12"
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDarkMode ? (
        <Sun className="w-5 h-5 text-yellow-400 drop-shadow-lg" />
      ) : (
        <Moon className="w-5 h-5 text-indigo-600 drop-shadow-lg" />
      )}
    </button>
  );
};