import React, { createContext, useContext, useEffect, useState } from 'react';
import { skins, Skin } from '@/config/skins';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  skin: Skin;
  setSkin: (skinId: string) => void;
  availableSkins: Skin[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('djfly-theme') as Theme;
    if (savedTheme) return savedTheme;
    if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
    return 'dark';
  });

  const [skin, setSkinState] = useState<Skin>(() => {
    const savedSkinId = localStorage.getItem('djfly-skin');
    return skins.find((s) => s.id === savedSkinId) || skins[0];
  });

  useEffect(() => {
    localStorage.setItem('djfly-theme', theme);
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('light');
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
      root.classList.remove('light');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('djfly-skin', skin.id);
    const root = document.documentElement;
    root.setAttribute('data-skin', skin.id);
  }, [skin]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setSkin = (skinId: string) => {
    const newSkin = skins.find((s) => s.id === skinId);
    if (newSkin) {
      setSkinState(newSkin);
    }
  };

  const value = {
    theme,
    toggleTheme,
    setTheme,
    skin,
    setSkin,
    availableSkins: skins,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
