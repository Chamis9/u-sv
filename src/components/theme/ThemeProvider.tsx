
import React from "react";

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: string;
  disableToggle?: boolean;
}

// A simple wrapper since we removed the actual theme functionality
export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  return <>{children}</>;
};

export const useTheme = () => {
  // Return a fixed theme since we've removed dark mode
  return {
    theme: 'light',
    setTheme: () => {},
  };
};
