import { Redirect, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Image, SrcollView, Text, View } from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";

export default function App() {
  return (
    <View style={styles.container}>
      <Text s
      tyle={{ color: '#8aecc7',}}>hello world</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});