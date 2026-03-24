import { ThemeProvider, useThemeContext } from '@/hooks/useThemeContext';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import ThemeToggle from '@/components/ThemeToggle';
import { View } from 'react-native';

const StackLayout = () => {
  const { isDark } = useThemeContext();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ 
          title: 'Mis Notas',
          headerTransparent: true,
          headerTintColor: isDark ? '#fff' : '#1E293B',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />
      <Stack.Screen
        name='create-note'
        options={{ 
          title: 'Crear Nota',
          headerTransparent: true,
          headerTintColor: isDark ? '#fff' : '#1E293B',
          headerTitleStyle: { fontWeight: 'bold' },
          headerRight: () => <ThemeToggle />
        }}
      />
      <Stack.Screen
        name="login"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="register"
        options={{ headerShown: false }}
      />
    </Stack>
  );
};

export default function App() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) return null;

  return (
    <ThemeProvider>
      <StackLayout />
    </ThemeProvider>
  );
}