import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import { Link } from 'expo-router';



export default function App() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}> Welcome to Budget Buddy !!!</Text>
      <StatusBar style="auto" />
      <Link href={'/budget'} style={{ color: '#8aecc7' }}>Welcome to Budget</Link>
    </View>
  );
}


