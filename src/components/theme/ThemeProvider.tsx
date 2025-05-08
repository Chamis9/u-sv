
import React, { createContext, useContext } from 'react';

interface ThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
}

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: string;
  storageKey?: string;
  disableToggle?: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  setTheme: () => {},
});

export function ThemeProvider({ 
  children,
  defaultTheme = 'light',
  storageKey = 'ui-theme',
  disableToggle = false
}: ThemeProviderProps) {
  // Always light mode
  const theme = 'light';
  const setTheme = () => {
    // Do nothing, we're always in light mode
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
