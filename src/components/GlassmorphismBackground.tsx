import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

export const GlassmorphismBackground: React.FC = () => {
  const { isDarkMode, themeStyle } = useTheme();

  // Only render glassmorphism background for modern theme
  if (themeStyle !== 'modern') {
    return (
      <div className={`fixed inset-0 transition-all duration-500 ${
        isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`} />
    );
  }

  return (
    <>
      {/* Animated gradient background */}
      <div className={`fixed inset-0 transition-all duration-500 ${
        isDarkMode ? 'gradient-bg-dark' : 'gradient-bg-light'
      }`} />
      
      {/* Blurred decoration circles */}
      <div className="blur-decoration w-[600px] h-[600px] -bottom-40 -left-40 bg-gradient-to-r from-pink-400 to-purple-500" />
      <div className="blur-decoration w-[400px] h-[400px] top-20 -left-20 bg-gradient-to-r from-blue-400 to-cyan-500" />
      <div className="blur-decoration w-[500px] h-[500px] -top-28 -right-28 bg-gradient-to-r from-purple-500 to-indigo-600" />
      <div className="blur-decoration w-[300px] h-[300px] bottom-20 right-20 bg-gradient-to-r from-orange-400 to-pink-500" />
      <div className="blur-decoration w-[350px] h-[350px] top-1/2 left-1/4 bg-gradient-to-r from-green-400 to-blue-500" />
      <div className="blur-decoration w-[250px] h-[250px] top-1/3 right-1/3 bg-gradient-to-r from-yellow-400 to-orange-500" />
    </>
  );
};