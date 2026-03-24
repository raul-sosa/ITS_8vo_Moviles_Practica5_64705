import React, { createContext, useState, useEffect, useContext } from 'react';
import { useColorScheme as useDeviceColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeContextType = {
  isDark: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({ isDark: true, toggleTheme: () => {} });

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const deviceTheme = useDeviceColorScheme();
  const [isDark, setIsDark] = useState<boolean>(true);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const stored = await AsyncStorage.getItem('userTheme');
        if (stored !== null) {
          setIsDark(stored === 'dark');
        } else {
          setIsDark(deviceTheme === 'dark');
        }
      } catch (e) {
        setIsDark(deviceTheme === 'dark');
      }
    };
    loadTheme();
  }, [deviceTheme]);

  const toggleTheme = async () => {
    const newValue = !isDark;
    setIsDark(newValue);
    try {
      await AsyncStorage.setItem('userTheme', newValue ? 'dark' : 'light');
    } catch (e) {
      console.warn("Could not save theme");
    }
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => useContext(ThemeContext);
