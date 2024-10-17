import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Modal, Pressable, Keyboard, ScrollView } from 'react-native';

const Account = () => {
  const [goal, setGoal] = useState('');
  const [currentSavings, setCurrentSavings] = useState('');
  const [progress, setProgress] = useState(0);

  const [investmentName, setInvestmentName] = useState('');
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [investments, setInvestments] = useState([]);

  const [yearlyIncome, setYearlyIncome] = useState('');
  const [yearlyExpenses, setYearlyExpenses] = useState('');
  const [yearlyReport, setYearlyReport] = useState('');

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedInvestmentId, setSelectedInvestmentId] = useState(null);

  const handleCalculateProgress = () => {
    const goalValue = parseFloat(goal);
    const currentSavingsValue = parseFloat(currentSavings);

    if (isNaN(goalValue) || isNaN(currentSavingsValue)) {
      console.error('Please enter valid numbers for goal and current savings.');
      return;
    }

    if (goalValue > 0) {
      const calculatedProgress = ((currentSavingsValue / goalValue) * 100).toFixed(2);
      setProgress(calculatedProgress);
    } else {
      console.error('Goal must be greater than zero.');
      setProgress(0);
    }
  };

  const handleAddInvestment = () => {
    const amount = parseFloat(investmentAmount);

    if (investmentName && !isNaN(amount)) {
      const newInvestment = { id: Date.now().toString(), name: investmentName, amount };
      setInvestments((prevInvestments) => [...prevInvestments, newInvestment]);
      setInvestmentName('');
      setInvestmentAmount('');
    } else {
      console.error('Please enter a valid investment name and amount.');
    }
  };

  const openDeleteModal = (id) => {
    setSelectedInvestmentId(id);
    setModalVisible(true);
  };

  const deleteInvestment = () => {
    const updatedInvestments = investments.filter((investment) => investment.id !== selectedInvestmentId);
    setInvestments(updatedInvestments);
    setModalVisible(false);
    setSelectedInvestmentId(null);
  };

  const handleCalculateYearlyReport = () => {
    const income = parseFloat(yearlyIncome);
    const expenses = parseFloat(yearlyExpenses);

    if (!isNaN(income) && !isNaN(expenses)) {
      const report = income - expenses;
      setYearlyReport(`Your net savings for the year: $${report.toFixed(2)}`);
    } else {
      console.error('Please enter valid yearly income and expenses.');
      setYearlyReport('');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.container}>
        <Text style={styles.title}>Emergency Fund Tracker</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your goal amount"
          keyboardType="numeric"
          value={goal}
          onChangeText={setGoal}
          returnKeyType="done"
          onSubmitEditing={() => Keyboard.dismiss()} 
        />
        <TextInput
          style={styles.input}
          placeholder="Enter current savings"
          keyboardType="numeric"
          value={currentSavings}
          onChangeText={setCurrentSavings}
          returnKeyType="done"
          onSubmitEditing={() => Keyboard.dismiss()} 
        />
        <Pressable style={styles.button} onPress={handleCalculateProgress}>
          <Text style={styles.buttonText}>Calculate Progress</Text>
        </Pressable>
        <Text style={styles.result}>
          Progress towards goal: {progress}%
        </Text>

        <Text style={styles.title}>Investment Tracker</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter investment name"
          value={investmentName}
          onChangeText={setInvestmentName}
          returnKeyType="done"
          onSubmitEditing={() => Keyboard.dismiss()} 
        />
        <TextInput
          style={styles.input}
          placeholder="Enter investment amount"
          keyboardType="numeric"
          value={investmentAmount}
          onChangeText={setInvestmentAmount}
          returnKeyType="done"
          onSubmitEditing={() => Keyboard.dismiss()} 
        />
        <Pressable style={styles.button} onPress={handleAddInvestment}>
          <Text style={styles.buttonText}>Add Investment</Text>
        </Pressable>

        <FlatList
          data={investments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.investmentItem}>
              <Text>{item.name}: ${item.amount.toFixed(2)}</Text>
              <Button
                title="Delete"
                onPress={() => openDeleteModal(item.id)}
                color="red"
              />
            </View>
          )}
        />

        <Text style={styles.title}>Yearly Report</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter yearly income"
          keyboardType="numeric"
          value={yearlyIncome}
          onChangeText={setYearlyIncome}
          returnKeyType="done"
          onSubmitEditing={() => Keyboard.dismiss()} 
        />
        <TextInput
          style={styles.input}
          placeholder="Enter yearly expenses"
          keyboardType="numeric"
          value={yearlyExpenses}
          onChangeText={setYearlyExpenses}
          returnKeyType="done"
          onSubmitEditing={() => Keyboard.dismiss()} 
        />
        <Pressable style={styles.button} onPress={handleCalculateYearlyReport}>
          <Text style={styles.buttonText}>Calculate Yearly Report</Text>
        </Pressable>
        <Text style={styles.result}>
          {yearlyReport}
        </Text>

        <Modal
          transparent={true}
          animationType="slide"
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>Are you sure you want to delete this investment?</Text>
              <View style={styles.modalButtons}>
                <Pressable style={styles.modalButtonYes} onPress={deleteInvestment}>
                  <Text style={styles.modalButtonText}>Yes, Delete</Text>
                </Pressable>
                <Pressable style={styles.modalButtonCancel} onPress={() => setModalVisible(false)}>
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
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
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  result: {
    marginTop: 20,
    fontSize: 18,
    color: '#fff',
  },
  investmentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    marginBottom: 15,
    fontSize: 18,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButtonYes: {
    backgroundColor: '#d9534f',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
  },
  modalButtonCancel: {
    backgroundColor: '#5bc0de',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 10,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default Account;
