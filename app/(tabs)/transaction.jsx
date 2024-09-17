import { StyleSheet, Text, View, SafeAreaView } from 'react-native'
import React from 'react'
import CircularChart from '../../compents/PieChart'


const transactions = () => {
  return (
    
    <View>
      <Text>transactions</Text>
      <CircularChart title="Transactions" />


    </View>
    
  )
}

export default transactions