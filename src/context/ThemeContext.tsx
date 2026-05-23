import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeType = {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  toggleDarkMode: () => void;
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
  theme: {
    bg: string;
    card: string;
    text: string;
    subText: string;
    border: string;
    itemBg: string;
    headerBg: string;
    primary: string;
    secondary: string;
    accent: string;
    success: string;
    warning: string;
    error: string;
  };
};

const ThemeContext = createContext<ThemeType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [darkMode, setDarkMode] = useState(systemColorScheme === 'dark');
  const [primaryColor, setPrimaryColor] = useState("#6366f1");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedDarkMode = await AsyncStorage.getItem('darkMode');
        const storedPrimaryColor = await AsyncStorage.getItem('primaryColor');
        
        if (storedDarkMode !== null) {
          setDarkMode(JSON.parse(storedDarkMode));
        }
        if (storedPrimaryColor !== null) {
          setPrimaryColor(storedPrimaryColor);
        }
      } catch (error) {
        console.error('Failed to load theme:', error);
      } finally {
        setIsLoaded(true);
      }
    };
    loadTheme();
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    const saveTheme = async () => {
      try {
        await AsyncStorage.setItem('darkMode', JSON.stringify(darkMode));
        await AsyncStorage.setItem('primaryColor', primaryColor);
      } catch (error) {
        console.error('Failed to save theme:', error);
      }
    };
    saveTheme();
  }, [darkMode, primaryColor, isLoaded]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  const theme = {
    bg: darkMode ? "#0f172a" : "#fff",
    card: darkMode ? "#1e293b" : "#fff",
    text: darkMode ? "#f8fafc" : "#1e293b",
    subText: darkMode ? "#94a3b8" : "#64748b",
    border: darkMode ? "#334155" : "#f1f5f9",
    itemBg: darkMode ? "#1e293b" : "#f8fafc",
    headerBg: darkMode ? "#1e293b" : "#fff",
    primary: primaryColor,
    secondary: "#4f46e5",
    accent: "#10b981",
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
  };

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode, toggleDarkMode, primaryColor, setPrimaryColor, theme }}>
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
