import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';
import { lightTheme } from '../constants/theme';
import { AppTheme, ThemeMode } from '../types/theme';

// type ThemeMode = 'light' | 'dark';

const STORAGE_KEY = 'elbeiruty_theme';

interface ThemeContextType {
  theme: AppTheme;
  mode: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>('light');
  const [isLoaded, setIsLoaded] = useState(false);

  const theme = lightTheme;

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedTheme === 'light' || storedTheme === 'dark') {
          setMode(storedTheme);
        } else {
          const systemPref = Appearance.getColorScheme();
          setMode(systemPref === 'dark' ? 'dark' : 'light');
        }
      } catch (error) {
        console.error('Error loading theme from AsyncStorage:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    try {
      await AsyncStorage.setItem(STORAGE_KEY, newMode);
      setMode(newMode);
    } catch (error) {
      console.error('Error saving theme to AsyncStorage:', error);
    }
  };

  // Avoid rendering children before theme is loaded
  if (!isLoaded) return null;

  return (
    <ThemeContext.Provider value={{ theme, mode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
