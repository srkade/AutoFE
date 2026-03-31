import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import appLogo from '../assets/Images/logo.png';

type ThemeType = 'light' | 'dark' | 'blue' | 'corporate' | 'high-contrast';

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  logo: string;
}


const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeType>(() => {
    const savedTheme = localStorage.getItem('app-theme');
    return (savedTheme as ThemeType) || 'light';
  });

  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme);
    localStorage.setItem('app-theme', newTheme);
  };

  useEffect(() => {
    // Apply the theme to the body element
    const body = document.body;

    // Remove all possible theme classes
    body.removeAttribute('data-theme');

    // Add the current theme if it's not the default light theme
    if (theme !== 'light') {
      body.setAttribute('data-theme', theme);
    }

    // Some components might prefer a class on the body
    body.className = body.className.replace(/\btheme-\S+/g, '');
    body.classList.add(`theme-${theme}`);

  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, logo: appLogo }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
