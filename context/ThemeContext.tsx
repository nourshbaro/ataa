import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Appearance } from 'react-native';
import { darkTheme, lightTheme } from '../constants/theme';
import { AppTheme } from '../types/theme';

type ThemeMode = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'ataa_theme';

interface ThemeContextType {
  theme: AppTheme;
  mode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>('system');
  const [systemMode, setSystemMode] = useState<'light' | 'dark'>('light');
  const [isLoaded, setIsLoaded] = useState(false);

  // Listen to system theme changes
  useEffect(() => {
    const listener = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemMode(colorScheme === 'dark' ? 'dark' : 'light');
    });
    setSystemMode(Appearance.getColorScheme() === 'dark' ? 'dark' : 'light');
    return () => listener.remove();
  }, []);

  // Load theme mode from storage on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedTheme === 'light' || storedTheme === 'dark' || storedTheme === 'system') {
          setMode(storedTheme as ThemeMode);
        } else {
          setMode('system'); // Default to system
        }
      } catch (error) {
        console.error('Error loading theme from AsyncStorage:', error);
      } finally {
        setIsLoaded(true);
      }
    };
    loadTheme();
  }, []);

  // Save theme mode to storage
  const setThemeMode = async (newMode: ThemeMode) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, newMode);
      setMode(newMode);
    } catch (error) {
      console.error('Error saving theme to AsyncStorage:', error);
    }
  };

  // Determine which theme to use
  const theme = (mode === 'system' ? systemMode : mode) === 'dark' ? darkTheme : lightTheme;

  if (!isLoaded) return null;

  return (
    <ThemeContext.Provider value={{ theme, mode, setThemeMode }}>
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
