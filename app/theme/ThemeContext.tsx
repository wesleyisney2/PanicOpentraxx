// app/theme/ThemeContext.tsx
import React, { createContext, useState, ReactNode } from 'react';

export interface Theme {
  backgroundColor: string;
  textColor: string;
  primary: string;
}

export interface ThemeContextData {
  isDarkMode: boolean;
  toggleTheme: () => void;
  theme: Theme;
}

export const ThemeContext = createContext<ThemeContextData>({
  isDarkMode: false,
  toggleTheme: () => {},
  theme: { backgroundColor: "#fff", textColor: "#333", primary: "#007AFF" },
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  const theme: Theme = isDarkMode
    ? { backgroundColor: "#222", textColor: "#fff", primary: "#81b0ff" }
    : { backgroundColor: "#fff", textColor: "#333", primary: "#007AFF" };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};
