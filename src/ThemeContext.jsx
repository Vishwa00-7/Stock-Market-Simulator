import React, { createContext, useContext, useEffect, useState } from 'react';

// Create the Context
const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Check local storage first, default to 'system'
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('app-theme') || 'system';
  });

  useEffect(() => {
    const root = document.documentElement; // Targets the <html> tag

    const applyTheme = (currentTheme) => {
      if (currentTheme === 'system') {
        // Check what the user's OS is using
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        root.setAttribute('data-theme', systemPrefersDark ? 'dark' : 'light');
      } else {
        root.setAttribute('data-theme', currentTheme);
      }
    };

    applyTheme(theme);
    localStorage.setItem('app-theme', theme);

    // Listen for OS-level theme changes if 'system' is selected
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') applyTheme('system');
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);

  }, [theme]); // Re-run whenever 'theme' state changes

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme easily in any component
export const useTheme = () => useContext(ThemeContext);