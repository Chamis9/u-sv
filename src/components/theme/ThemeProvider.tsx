
import { createContext, useContext, useEffect, useState, useMemo, useCallback, ReactNode } from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
  disableToggle?: boolean;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isToggleDisabled: boolean;
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
  isToggleDisabled: false,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

// Create a global variable to store the theme state
let globalThemeState: Theme | null = null;
let globalThemeSetters: ((theme: Theme) => void)[] = [];

// Function to update all theme instances
const updateAllThemeInstances = (newTheme: Theme) => {
  globalThemeState = newTheme;
  globalThemeSetters.forEach(setter => setter(newTheme));
};

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "ui-theme",
  disableToggle = false,
  ...props
}: ThemeProviderProps) {
  // Initialize from global state or localStorage
  const initialTheme = globalThemeState || localStorage.getItem(storageKey) as Theme || defaultTheme;
  
  const [theme, setThemeState] = useState<Theme>(initialTheme);

  // Register this setter with the global list
  useEffect(() => {
    const setter = (newTheme: Theme) => setThemeState(newTheme);
    globalThemeSetters.push(setter);
    return () => {
      globalThemeSetters = globalThemeSetters.filter(s => s !== setter);
    };
  }, []);

  useEffect(() => {
    // Update the global theme state
    globalThemeState = theme;
    
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  const setTheme = useCallback((newTheme: Theme) => {
    // Store in localStorage
    localStorage.setItem(storageKey, newTheme);
    
    // Update all instances
    updateAllThemeInstances(newTheme);
  }, [storageKey]);

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      isToggleDisabled: disableToggle,
    }),
    [theme, setTheme, disableToggle]
  );

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
