import React, { createContext, useContext, useState, useEffect } from 'react';

type ThemeStyle = 'classic' | 'modern';

interface ThemeContextType {
  isDarkMode: boolean;
  themeStyle: ThemeStyle;
  toggleTheme: () => void;
  setThemeStyle: (style: ThemeStyle) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  const [themeStyle, setThemeStyleState] = useState<ThemeStyle>(() => {
    const saved = localStorage.getItem('themeStyle');
    return (saved as ThemeStyle) || 'modern';
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('themeStyle', themeStyle);
    // Add theme style class to document
    document.documentElement.classList.remove('theme-classic', 'theme-modern');
    document.documentElement.classList.add(`theme-${themeStyle}`);
  }, [themeStyle]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  
  const setThemeStyle = (style: ThemeStyle) => {
    setThemeStyleState(style);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, themeStyle, toggleTheme, setThemeStyle }}>
      {children}
    </ThemeContext.Provider>
  );
};