import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useThemeContext } from '../hooks/useThemeContext';
import { BlurView } from 'expo-blur';

export default function ThemeToggle({ absolute = false }: { absolute?: boolean }) {
  const { isDark, toggleTheme } = useThemeContext();

  return (
    <TouchableOpacity 
      onPress={toggleTheme} 
      style={[styles.button, absolute && styles.absolute]}
    >
      <BlurView intensity={100} tint={isDark ? "dark" : "light"} style={styles.glass}>
        <MaterialIcons name={isDark ? "light-mode" : "dark-mode"} size={22} color={isDark ? "#FCD34D" : "#475569"} />
      </BlurView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  absolute: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 100,
  },
  glass: {
    padding: 10,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.3)',
  }
});
