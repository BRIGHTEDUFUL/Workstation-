'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'theme-default-dark' | 'theme-midnight-slate' | 'theme-crimson-glow' | 'theme-forest-mist' | 'theme-sunset-flare' | 'theme-rose-gold' | 'theme-moonlit-amethyst' | 'light';

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: 'theme-default-dark',
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = 'theme-default-dark',
  storageKey = 'vite-ui-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (typeof window !== 'undefined' ? (localStorage.getItem(storageKey) as Theme) || defaultTheme : defaultTheme)
  );

  useEffect(() => {
    if (typeof window !== 'undefined') {
        const root = window.document.documentElement;

        root.classList.remove(
            'light', 
            'theme-default-dark',
            'theme-midnight-slate',
            'theme-crimson-glow',
            'theme-forest-mist',
            'theme-sunset-flare',
            'theme-rose-gold',
            'theme-moonlit-amethyst'
        );

        root.classList.add(theme);
    }
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem(storageKey, theme);
      }
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider');

  return context;
};

    