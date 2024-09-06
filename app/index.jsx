import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import { Link } from 'expo-router';
import 'nativewind';


export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-white" >
      <Text class> Welcome to Budget Buddy !!!</Text>
      <StatusBar style="auto" />
      <Link href={'/budget'} style={{color:'#8aecc7'}}>Welcome to Budget</Link>
    </View>
  );
}

