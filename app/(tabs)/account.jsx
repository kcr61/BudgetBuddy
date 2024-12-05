import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform, 
  Keyboard,
  TouchableOpacity
} from 'react-native';
import { useRouter, Link } from 'expo-router';

const Account = () => {
  const [goal, setGoal] = useState('');
  const [currentSavings, setCurrentSavings] = useState('');
  const [progress, setProgress] = useState(0);
  const [yearlyIncome, setYearlyIncome] = useState('');
  const [yearlyExpenses, setYearlyExpenses] = useState('');
  const [yearlyReport, setYearlyReport] = useState('');
  const router = useRouter();

  const dismissKeyboard = () => {
    if (Platform.OS !== 'web') {
      Keyboard.dismiss();
    }
  };

  const handleInputSubmit = (nextInput = null) => {
    if (Platform.OS !== 'web') {
      dismissKeyboard();
    }
    if (nextInput) {
      nextInput.current?.focus();
    }
  };

  const handleCalculateProgress = async () => {
    dismissKeyboard();
    const goalValue = parseFloat(goal);
    const currentSavingsValue = parseFloat(currentSavings);
  
    if (isNaN(goalValue) || isNaN(currentSavingsValue)) {
      alert('Please enter valid numbers for goal and current savings.');
      return;
    }
  
    if (goalValue > 0) {
      const calculatedProgress = ((currentSavingsValue / goalValue) * 100).toFixed(2);
      setProgress(calculatedProgress);
    } else {
      alert('Goal must be greater than zero.');
      setProgress(0);
    }
  };
  const ProgressDisplay = ({ currentAmount, goalAmount }) => (
    <>
      <Text style={styles.amountText}>Goal: {formatCurrency(goalAmount)}</Text>
      <Text style={styles.amountText}>Current: {formatCurrency(currentAmount)}</Text>
      <Text style={styles.progressText}>
        Progress: {formatPercentage((currentAmount / goalAmount) * 100)}
      </Text>
    </>
  );

  const handleCalculateYearlyReport = async () => {
    dismissKeyboard();
    const income = parseFloat(yearlyIncome);
    const expenses = parseFloat(yearlyExpenses);
  
    if (!isNaN(income) && !isNaN(expenses)) {
      const report = income - expenses;
      setYearlyReport(`Your net savings for the year: $${report.toFixed(2)}`);
    } else {
      alert('Please enter valid yearly income and expenses.');
      setYearlyReport('');
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1, backgroundColor: '#036704' }}
    >
      <ScrollView 
        style={styles.scrollViewContent} 
        contentContainerStyle={{ flexGrow: 1, backgroundColor: '#036704' }}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Emergency Fund Tracker</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your goal amount"
            keyboardType="decimal-pad"
            value={goal}
            onChangeText={setGoal}
            returnKeyType="done"
          />
          <TextInput
            style={styles.input}
            placeholder="Enter current savings"
            keyboardType="decimal-pad"
            value={currentSavings}
            onChangeText={setCurrentSavings}
            returnKeyType="done"
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.linkButtonSmall} onPress={handleCalculateProgress}>
              <Text style={styles.linkButtonText}>Calculate Progress</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.linkButtonSmall}
              onPress={() => router.push({
                pathname: '/BarGraph',
                params: {
                  goal: parseFloat(goal),
                  currentSavings: parseFloat(currentSavings),
                },
              })}
            >
              <Text style={styles.linkButtonText}>View Bar Graph</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.result}>
            Progress towards goal: {progress}%
          </Text>

          <Link href="/investment" asChild>
            <TouchableOpacity style={styles.linkButton}>
              <Text style={styles.linkButtonText}>Go to Investment Tracker</Text>
            </TouchableOpacity>
          </Link>

          <Text style={styles.title}>Yearly Report</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter yearly income"
            keyboardType="decimal-pad"
            value={yearlyIncome}
            onChangeText={setYearlyIncome}
            returnKeyType="done"
          />
          <TextInput
            style={styles.input}
            placeholder="Enter yearly expenses"
            keyboardType="decimal-pad"
            value={yearlyExpenses}
            onChangeText={setYearlyExpenses}
            returnKeyType="done"
          />
          <TouchableOpacity style={styles.button} onPress={handleCalculateYearlyReport}>
            <Text style={styles.buttonText}>Calculate Yearly Report</Text>
          </TouchableOpacity>
          <Text style={styles.result}>
            {yearlyReport}
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#036704',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    color: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  linkButtonSmall: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 25,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },
  linkButtonText: {
    color: '#036704',
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  result: {
    marginTop: 20,
    fontSize: 18,
    color: '#fff',
  },
  linkButton: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginBottom: 20,
    minWidth: 160,
  },
});

export default Account;
