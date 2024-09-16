import { StyleSheet, Text, View } from "react-native";
import { Slot, SplashScreen, Stack } from "expo-router";
import { useFonts } from 'expo-font';
import { useEffect } from 'react';

export default function HomeLayout() {
  return (

    <Stack>

      <Stack.Screen name="(tabs)" 
      options={{ headerShown: false }} 
       />
    </Stack>
  )

}



