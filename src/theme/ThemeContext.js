// src/theme/ThemeContext.js
import React, { createContext } from 'react';
import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme } from './color.js';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};
