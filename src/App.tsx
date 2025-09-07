import React from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { ThemeToggle } from './components/ThemeToggle';
import { MindMap } from './components/MindMap';
import { GlassmorphismBackground } from './components/GlassmorphismBackground';

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen relative overflow-hidden transition-all duration-500">
        <GlassmorphismBackground />
        <ThemeToggle />
        <MindMap />
      </div>
    </ThemeProvider>
  );
}

export default App;