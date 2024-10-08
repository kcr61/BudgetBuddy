import { StyleSheet, Text, View } from "react-native";
import { Slot, SplashScreen, Stack } from "expo-router";
import { useFonts } from 'expo-font';
import { useEffect, useState } from 'react';
import SignInSignUpScreen from  './SignSignup.jsx'

export default function HomeLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return <SignInSignUpScreen onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}


