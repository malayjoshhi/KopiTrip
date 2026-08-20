import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuth } from '@/hooks/useAuth';
import { Colors } from '@/constants/Colors';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const segments = useSegments();
  const { isInitializing, isAuthenticated } = useAuth();
  const [initialRouteSet, setInitialRouteSet] = useState(false);
  
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const isDark = colorScheme === 'dark';
  const backgroundColor = isDark ? Colors.dark.background : Colors.light.background;

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    if (!isInitializing && !initialRouteSet && loaded) {
      setInitialRouteSet(true);

      const inAuthGroup = segments[0] === 'auth';

      if (isAuthenticated) {
        // Only redirect to home tab if user is currently in auth screens or at root
        if (inAuthGroup || !segments[0]) {
          router.replace('/(tabs)');
        }
      } else {
        if (!inAuthGroup) {
          router.replace('/auth/login');
        }
      }
    }
  }, [isInitializing, isAuthenticated, initialRouteSet, loaded, segments]);

  if (!loaded || isInitializing) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor,
        }}
      >
        <ActivityIndicator size="large" color={isDark ? Colors.primary.sky : Colors.primary.ocean} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          {!isAuthenticated ? (
            <Stack.Screen
              name="auth"
              options={{
                title: 'Authentication',
              }}
            />
          ) : (
            <>
              <Stack.Screen
                name="(tabs)"
                options={{
                  title: 'KopiTrip',
                }}
              />
              <Stack.Screen
                name="bookings"
                options={{
                  title: 'Bookings',
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="expenses"
                options={{
                  title: 'Expenses',
                  headerShown: false,
                }}
              />
            </>
          )}

          <Stack.Screen
            name="destination/[id]"
            options={{
              title: 'Destination Details',
            }}
          />

          <Stack.Screen
            name="modal"
            options={{
              presentation: 'modal',
              title: 'Modal',
            }}
          />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

