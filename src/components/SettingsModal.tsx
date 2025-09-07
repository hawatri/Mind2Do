import React from 'react';
import { X, Settings, Palette, Monitor, Moon, Sun, Sparkles, Layout } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { isDarkMode, themeStyle, toggleTheme, setThemeStyle } = useTheme();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 transition-all duration-300"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className={`w-full max-w-md rounded-2xl shadow-2xl transition-all duration-300 ${
          themeStyle === 'modern' 
            ? 'glass-strong' 
            : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
        }`}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200/30 dark:border-gray-700/30">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${
                themeStyle === 'modern' 
                  ? 'glass text-blue-600 dark:text-blue-400' 
                  : 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
              }`}>
                <Settings className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Settings
              </h2>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-xl transition-all duration-300 hover:scale-110 hover:rotate-12 ${
                themeStyle === 'modern'
                  ? 'glass hover:glass-strong text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Theme Style Selection */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Palette className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Theme Style
                </h3>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {/* Classic Theme */}
                <button
                  onClick={() => setThemeStyle('classic')}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                    themeStyle === 'classic'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 shadow-lg'
                      : themeStyle === 'modern'
                      ? 'border-white/30 dark:border-gray-600/30 glass hover:glass-strong'
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className={`p-3 rounded-lg ${
                      themeStyle === 'classic'
                        ? 'bg-blue-100 dark:bg-blue-800'
                        : 'bg-gray-100 dark:bg-gray-700'
                    }`}>
                      <Layout className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        Classic
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Clean & Simple
                      </p>
                    </div>
                  </div>
                </button>

                {/* Modern Glassmorphism Theme */}
                <button
                  onClick={() => setThemeStyle('modern')}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                    themeStyle === 'modern'
                      ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/30 shadow-lg backdrop-blur-sm'
                      : themeStyle === 'modern'
                      ? 'border-white/30 dark:border-gray-600/30 glass hover:glass-strong'
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className={`p-3 rounded-lg ${
                      themeStyle === 'modern'
                        ? 'glass text-purple-600 dark:text-purple-400'
                        : 'bg-gray-100 dark:bg-gray-700'
                    }`}>
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        Modern Glass
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Glassmorphism
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Dark Mode Toggle */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Monitor className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Appearance
                </h3>
              </div>
              
              <button
                onClick={toggleTheme}
                className={`w-full p-4 rounded-xl border transition-all duration-300 hover:scale-105 ${
                  themeStyle === 'modern'
                    ? 'glass hover:glass-strong border-white/30 dark:border-gray-600/30'
                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      themeStyle === 'modern'
                        ? 'glass'
                        : 'bg-gray-100 dark:bg-gray-700'
                    }`}>
                      {isDarkMode ? (
                        <Moon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                      ) : (
                        <Sun className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                      )}
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {isDarkMode ? 'Switch to light theme' : 'Switch to dark theme'}
                      </p>
                    </div>
                  </div>
                  <div className={`w-12 h-6 rounded-full transition-colors duration-300 ${
                    isDarkMode ? 'bg-blue-500' : 'bg-gray-300'
                  }`}>
                    <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 mt-0.5 ${
                      isDarkMode ? 'translate-x-6 ml-0.5' : 'translate-x-0.5'
                    }`} />
                  </div>
                </div>
              </button>
            </div>

            {/* Theme Preview */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Preview
              </h3>
              <div className={`p-4 rounded-xl border ${
                themeStyle === 'modern'
                  ? 'glass border-white/30 dark:border-gray-600/30'
                  : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
              }`}>
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-3 h-3 rounded-full ${
                    themeStyle === 'modern' ? 'bg-gradient-to-r from-pink-400 to-purple-500' : 'bg-blue-500'
                  }`} />
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    Sample Node
                  </p>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  This is how your mind map nodes will look with the selected theme.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200/30 dark:border-gray-700/30">
            <button
              onClick={onClose}
              className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-300 hover:scale-105 ${
                themeStyle === 'modern'
                  ? 'glass-strong text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              Apply Settings
            </button>
          </div>
        </div>
      </div>
    </>
  );
};