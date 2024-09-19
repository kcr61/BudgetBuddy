import { StatusBar } from 'expo-status-bar';
import { Text, View, Image } from 'react-native';
import { Link } from 'expo-router';


export default function App() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#8aecc7' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}> Welcome to Budget Buddy !!!</Text>
      <StatusBar style="auto" />
      <Link href={'/transaction'} style={{ color: 'black' }}>Head to Transaction</Link>
    </View>
  );


}
